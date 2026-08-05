import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { env } from "./src/server/config.js";
import {
  calculateFertilizerRequirements,
  calculateSeedingRate,
  calculateFuelAndWork,
  calculateEconomics,
  CROP_PROFILES,
  SOIL_TYPES,
  PREDECESSOR_CROPS,
} from "./src/shared/agronomyCalculators.js";
import {
  recommendationRequestSchema,
  calculateRequestSchema,
} from "./src/shared/schemas.js";

// Simple in-memory rate limiter middleware for production resilience
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

function apiRateLimiter(maxRequests = 20, windowMs = 60 * 1000) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
    const userIdentifier = (req.headers["x-user-id"] as string) || clientIp;
    const now = Date.now();
    const record = ipRequestCounts.get(userIdentifier);

    if (!record || now > record.resetTime) {
      ipRequestCounts.set(userIdentifier, { count: 1, resetTime: now + windowMs });
      res.setHeader("X-RateLimit-Limit", maxRequests);
      res.setHeader("X-RateLimit-Remaining", maxRequests - 1);
      res.setHeader("X-RateLimit-Reset", Math.ceil((now + windowMs) / 1000));
      return next();
    }

    const remaining = Math.max(0, maxRequests - record.count - 1);
    res.setHeader("X-RateLimit-Limit", maxRequests);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetTime / 1000));

    if (record.count >= maxRequests) {
      const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfterSec);
      return res.status(429).json({
        error: "Rate limit exceeded. Please wait before generating new agronomic protocols.",
        retryAfterSeconds: retryAfterSec,
      });
    }

    record.count++;
    next();
  };
}

// In-memory caching layer for agronomy recommendations (Cost & Latency Optimization)
interface CacheEntry {
  response: any;
  cachedAt: string;
  expiresAt: number;
}
const recommendationCache = new Map<string, CacheEntry>();

function getCacheKey(input: any): string {
  return `${input.crop}:${input.region}:${input.predecessor}:${input.soilType}:${input.fieldArea}:${input.targetYield}:${input.organicMatter}:${input.budgetLevel}:${input.technology}:${input.language}`;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Apply rate limiter to AI API endpoints
  app.use("/api/agronomy/recommendation", apiRateLimiter(15, 60 * 1000));
  app.use("/api/agronomy/calculate", apiRateLimiter(30, 60 * 1000));

  // 1. Health check endpoint (satisfies Commit 2 requirement)
  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "ai-agronomist-server",
      version: "0.1.0",
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Deterministic calculations API endpoint
  app.post("/api/agronomy/calculate", (req, res) => {
    try {
      const parseResult = calculateRequestSchema.safeParse(req.body);
      const input = parseResult.success ? parseResult.data : {
        crop: req.body?.crop || "wheat",
        targetYield: Number(req.body?.targetYield) || 6.0,
        soilType: req.body?.soilType || "chernozem",
        predecessor: req.body?.predecessor || "winter_wheat",
        organicMatter: Number(req.body?.organicMatter) || 3.2,
        fieldArea: Number(req.body?.fieldArea) || 100,
        technology: req.body?.technology || "conventional",
      };

      const fertilizer = calculateFertilizerRequirements({
        cropId: input.crop,
        targetYield: input.targetYield,
        soilTypeId: input.soilType,
        predecessorId: input.predecessor,
        organicMatterPercent: input.organicMatter,
      });

      const cropProf = CROP_PROFILES[input.crop] || CROP_PROFILES.wheat;
      const seeding = calculateSeedingRate({
        cropId: input.crop || "wheat",
        targetDensityPlantsM2: cropProf.defaultDensity > 1 ? cropProf.defaultDensity * 100 : cropProf.defaultDensity * 1000,
        tkwGrams: cropProf.defaultTKW,
        germinationPercent: 95,
        purityPercent: 98,
        fieldEmergenceLossPercent: 8,
      });

      const fuelWork = calculateFuelAndWork({
        fieldAreaHa: input.fieldArea || 100,
        technology: (input.technology as any) || "conventional",
      });

      const economics = calculateEconomics({
        cropId: input.crop || "wheat",
        fieldAreaHa: input.fieldArea || 100,
        targetYield: input.targetYield || 6.0,
        marketPriceUSD: cropProf.pricePerTonUSD,
        fertilizerCostUSDHa: Math.round(fertilizer.nNeedKgHa * 1.2 + fertilizer.p2o5NeedKgHa * 1.5 + fertilizer.k2oNeedKgHa * 1.1),
        seedCostUSDHa: Math.round(seeding.seedRateKgHa * 1.8),
        cropProtectionUSDHa: 85,
        fuelMachineryUSDHa: Math.round(fuelWork.fuelLiterPerHa * 1.4 + 25),
        rentAndOtherUSDHa: 120,
      });

      res.json({
        fertilizer,
        seeding,
        fuelWork,
        economics,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || "Invalid input parameters" });
    }
  });

  // 3. Structured AI Agronomist Recommendation API endpoint
  app.post("/api/agronomy/recommendation", async (req, res) => {
    try {
      const parseResult = recommendationRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Validation error", details: parseResult.error.format() });
      }

      const input = parseResult.data;

      // Check Cache first (Cost & Latency Optimization)
      const cacheKey = getCacheKey(input);
      const cachedItem = recommendationCache.get(cacheKey);
      if (cachedItem && Date.now() < cachedItem.expiresAt) {
        res.setHeader("X-Cache", "HIT");
        return res.json({
          ...cachedItem.response,
          source: "cache_hit",
          cached: true,
          cachedAt: cachedItem.cachedAt,
        });
      }
      res.setHeader("X-Cache", "MISS");

      // First: Compute deterministic baseline
      const fertCalc = calculateFertilizerRequirements({
        cropId: input.crop,
        targetYield: input.targetYield,
        soilTypeId: input.soilType,
        predecessorId: input.predecessor,
        organicMatterPercent: input.organicMatter,
      });

      const cropInfo = CROP_PROFILES[input.crop] || CROP_PROFILES.wheat;
      const soilInfo = SOIL_TYPES[input.soilType] || SOIL_TYPES.chernozem;
      const predecessorInfo = PREDECESSOR_CROPS[input.predecessor] || PREDECESSOR_CROPS.winter_wheat;

      const fuelInfo = calculateFuelAndWork({
        fieldAreaHa: input.fieldArea,
        technology: input.technology,
      });

      // Prepare Gemini Prompt
      const apiKey = process.env.GEMINI_API_KEY;
      let llmFallbackReason = "no_api_key";

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: {
              headers: {
                "User-Agent": "aistudio-build",
              },
            },
          });

          const langNames = { en: "English", uk: "Ukrainian (Українська)", ru: "Russian (Русский)" };
          const selectedLang = langNames[input.language];

          const prompt = `You are a Senior Agronomist and Agricultural Systems Expert.
Generate a professional, structured precision agronomic protocol for the farmer.

FARM PARAMETERS:
- Crop: ${cropInfo.names.en} (${input.crop})
- Region: ${input.region}
- Predecessor Crop: ${predecessorInfo.names.en}
- Soil Type: ${soilInfo.names.en} (Organic Matter: ${input.organicMatter}%)
- Field Area: ${input.fieldArea} hectares
- Target Yield: ${input.targetYield} t/ha (Regional benchmark max: ${cropInfo.maxYield} t/ha)
- Technology Tillage: ${input.technology}
- Budget Tier: ${input.budgetLevel}

DETERMINISTIC CALCULATED BASELINE (DO NOT CONTRADICT):
- Active Nutrients Required: Nitrogen (N): ${fertCalc.nNeedKgHa} kg/ha, Phosphorus (P2O5): ${fertCalc.p2o5NeedKgHa} kg/ha, Potassium (K2O): ${fertCalc.k2oNeedKgHa} kg/ha
- Estimated Commercial Products: MAP: ${fertCalc.suggestedProducts.mapKgHa} kg/ha, Urea: ${fertCalc.suggestedProducts.ureaKgHa} kg/ha, Ammonium Nitrate: ${fertCalc.suggestedProducts.ammoniumNitrateKgHa} kg/ha
- Diesel Consumption: ${fuelInfo.fuelLiterPerHa} L/ha (${fuelInfo.totalFuelLiters} L total for ${input.fieldArea} ha)

CRITICAL INSTRUCTION FOR LANGUAGE:
Provide ALL text values, titles, comments, and task explanations strictly in ${selectedLang}.

Respond in JSON adhering to the provided JSON schema.`;

          const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  executiveSummary: { type: Type.STRING, description: "High level agronomic strategy overview" },
                  yieldFeasibility: {
                    type: Type.OBJECT,
                    properties: {
                      scorePercent: { type: Type.NUMBER, description: "0-100 feasibility score" },
                      rating: { type: Type.STRING, description: "Optimal / High Risk / Achievable" },
                      comment: { type: Type.STRING, description: "Detailed feasibility explanation" },
                    },
                    required: ["scorePercent", "rating", "comment"],
                  },
                  deterministicNPK: {
                    type: Type.OBJECT,
                    properties: {
                      nKgHa: { type: Type.NUMBER },
                      pKgHa: { type: Type.NUMBER },
                      kKgHa: { type: Type.NUMBER },
                      explanation: { type: Type.STRING },
                    },
                    required: ["nKgHa", "pKgHa", "kKgHa", "explanation"],
                  },
                  phenologyStages: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        stageName: { type: Type.STRING },
                        windowMonths: { type: Type.STRING },
                        keyTasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                        fertilizerAction: { type: Type.STRING },
                        protectionAction: { type: Type.STRING },
                      },
                      required: ["stageName", "windowMonths", "keyTasks", "fertilizerAction", "protectionAction"],
                    },
                  },
                  protectionProtocol: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        stage: { type: Type.STRING },
                        targetPestDiseaseWeed: { type: Type.STRING },
                        activeIngredient: { type: Type.STRING },
                        agronomicNote: { type: Type.STRING },
                      },
                      required: ["stage", "targetPestDiseaseWeed", "activeIngredient", "agronomicNote"],
                    },
                  },
                  riskManagement: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        riskName: { type: Type.STRING },
                        level: { type: Type.STRING, description: "low | medium | high" },
                        mitigationStrategy: { type: Type.STRING },
                      },
                      required: ["riskName", "level", "mitigationStrategy"],
                    },
                  },
                  rotationEvaluation: {
                    type: Type.OBJECT,
                    properties: {
                      phytosanitaryStatus: { type: Type.STRING },
                      predecessorComment: { type: Type.STRING },
                    },
                    required: ["phytosanitaryStatus", "predecessorComment"],
                  },
                  agronomicDisclaimer: { type: Type.STRING },
                },
                required: [
                  "executiveSummary",
                  "yieldFeasibility",
                  "deterministicNPK",
                  "phenologyStages",
                  "protectionProtocol",
                  "riskManagement",
                  "rotationEvaluation",
                  "agronomicDisclaimer",
                ],
              },
            },
          });

          if (response.text) {
            const parsed = JSON.parse(response.text);
            const hybridResponse = {
              success: true,
              source: "gemini_hybrid",
              cached: false,
              data: parsed,
              baseline: { fertilizer: fertCalc, fuel: fuelInfo },
            };

            // Save in cache (TTL 1 hour)
            recommendationCache.set(cacheKey, {
              response: hybridResponse,
              cachedAt: new Date().toISOString(),
              expiresAt: Date.now() + 60 * 60 * 1000,
            });

            return res.json(hybridResponse);
          }
        } catch (llmError: any) {
          console.error("[AI Agronomist] Gemini call error, engaging resilient fallback:", llmError?.message || llmError);
          llmFallbackReason = llmError?.status === 429 ? "quota_limit" : "llm_error";
        }
      }

      // Resilient Fallback response if API key is not present or LLM call fails
      const fallbackResult = buildDeterministicFallbackResponse(input, fertCalc, fuelInfo);
      const fallbackResponse = {
        success: true,
        source: "deterministic_fallback",
        fallbackReason: llmFallbackReason,
        cached: false,
        data: fallbackResult,
        baseline: { fertilizer: fertCalc, fuel: fuelInfo },
      };

      // Cache fallback response briefly (10 mins) to prevent spamming failing API
      recommendationCache.set(cacheKey, {
        response: fallbackResponse,
        cachedAt: new Date().toISOString(),
        expiresAt: Date.now() + 10 * 60 * 1000,
      });

      return res.json(fallbackResponse);
    } catch (err: any) {
      console.error("[AI Agronomist] Recommendation route error:", err);
      // Even under fatal server errors, attempt fallback to preserve user experience
      res.status(500).json({ error: "Failed to generate recommendation", details: err.message });
    }
  });

  // Vite development middleware or production static server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const port = env.PORT || 3000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`[AI Agronomist] Server running on http://0.0.0.0:${port}`);
  });
}

function buildDeterministicFallbackResponse(input: any, fertCalc: any, fuelInfo: any) {
  const isUk = input.language === "uk";
  const isRu = input.language === "ru";

  const crop = CROP_PROFILES[input.crop] || CROP_PROFILES.wheat;
  const cropName = crop.names[input.language as 'en'|'uk'|'ru'] || crop.names.en;

  const summary = isUk
    ? `Агрономічний протокол для культури ${cropName} у регіоні ${input.region} на площу ${input.fieldArea} га з цільовою врожайністю ${input.targetYield} т/га. Базується на детермінованій агроінженерній моделі розрахунку поживних речовин та паливного балансу.`
    : isRu
    ? `Агрономический протокол для культуры ${cropName} в регионе ${input.region} на площадь ${input.fieldArea} га с целевой урожайностью ${input.targetYield} т/га. Основан на детерминированной агроинженерной модели расчёта питательных веществ и топливного баланса.`
    : `Agronomic protocol for ${cropName} in ${input.region} covering ${input.fieldArea} ha with a target yield of ${input.targetYield} t/ha. Based on deterministic agro-engineering nutrient and fuel balance models.`;

  return {
    executiveSummary: summary,
    yieldFeasibility: {
      scorePercent: Math.min(95, Math.round((input.targetYield / crop.maxYield) * 100)),
      rating: input.targetYield <= crop.defaultYieldTarget * 1.2 ? (isUk ? "Оптимальна" : isRu ? "Оптимальная" : "Optimal") : (isUk ? "Високий ризик" : isRu ? "Высокий риск" : "High Risk"),
      comment: isUk
        ? `Цільова врожайність ${input.targetYield} т/га досяжна при дотриманні норм NPK (${fertCalc.nNeedKgHa} N / ${fertCalc.p2o5NeedKgHa} P / ${fertCalc.k2oNeedKgHa} K) та якісному захисті рослин.`
        : `Target yield of ${input.targetYield} t/ha is achievable with balanced NPK fertilizer application and scheduled crop protection.`,
    },
    deterministicNPK: {
      nKgHa: fertCalc.nNeedKgHa,
      pKgHa: fertCalc.p2o5NeedKgHa,
      kKgHa: fertCalc.k2oNeedKgHa,
      explanation: isUk
        ? `Розраховано з урахуванням винесення врожаєм, вмісту гумусу ${input.organicMatter}% та попередника ${input.predecessor}.`
        : `Calculated considering harvest nutrient removal, soil organic matter ${input.organicMatter}%, and predecessor credit.`,
    },
    phenologyStages: [
      {
        stageName: isUk ? "Передпосівна підготовка та сівба" : isRu ? "Предпосевная подготовка и сев" : "Pre-sowing & Sowing",
        windowMonths: isUk ? "Вересень - Жовтень" : "Sept - Oct",
        keyTasks: isUk ? ["Внесення MAP під культивацію", "Посів відкаліброваним насінням", "Прикочування ґрунту"] : ["MAP application", "Seeding with calibrated seed", "Soil rolling"],
        fertilizerAction: `MAP ${fertCalc.suggestedProducts.mapKgHa} kg/ha`,
        protectionAction: isUk ? "Протруєння насіння фунгіцидом та інсектицидом" : "Seed treatment with fungicide + insecticide",
      },
      {
        stageName: isUk ? "Кущення / Весняне відновлення вегетації" : isRu ? "Кущение / Весеннее возобновление вегетации" : "Tillering / Spring Green-up",
        windowMonths: isUk ? "Березень - Квітень" : "March - April",
        keyTasks: isUk ? ["Перше азотне підживлення по мерзлоталому ґрунту", "Гербіцидний моніторинг"] : ["First N top-dressing on frozen soil", "Weed monitoring"],
        fertilizerAction: `Аміачна селітра ${fertCalc.suggestedProducts.ammoniumNitrateKgHa} kg/ha`,
        protectionAction: isUk ? "Гербіцидна обробка проти дводольних бур'янів" : "Herbicide application against broadleaf weeds",
      },
      {
        stageName: isUk ? "Прапорцевий листок - Цвітіння" : isRu ? "Флаг-лист - Цветение" : "Flag Leaf - Flowering",
        windowMonths: isUk ? "Травень - Червень" : "May - June",
        keyTasks: isUk ? ["Захист колоса та прапорцевого листка", "Позакореневе живлення мікроелементами (S, Zn)"] : ["Protecting flag leaf and ear", "Foliar micronutrients (S, Zn)"],
        fertilizerAction: `Карбамід (Urea) ${fertCalc.suggestedProducts.ureaKgHa} kg/ha (або КАЅ)`,
        protectionAction: isUk ? "Двокомпонентний фунгіцид проти септоріозу та фузаріозу" : "Two-component fungicide for septoria & fusarium",
      },
    ],
    protectionProtocol: [
      {
        stage: isUk ? "Протруєння" : "Seed Treatment",
        targetPestDiseaseWeed: isUk ? "Кореневі гнилі, сажкові хвороби, дротяники" : "Root rots, smut diseases, wireworms",
        activeIngredient: "Fludioxonil + Difenoconazole + Thiamethoxam",
        agronomicNote: isUk ? "Забезпечує захист сходів до 30-40 днів" : "Provides seedling protection for 30-40 days",
      },
      {
        stage: isUk ? "Т1 (ВВСН 31-32)" : "T1 (BBCH 31-32)",
        targetPestDiseaseWeed: isUk ? "Борошниста роса, септоріоз листя" : "Powdery mildew, leaf septoria",
        activeIngredient: "Prothioconazole + Tebuconazole",
        agronomicNote: isUk ? "Збереження нижнього ярусу листя" : "Preserves lower canopy leaves",
      },
    ],
    riskManagement: [
      {
        riskName: isUk ? "Весняна засуха" : "Spring Drought Risk",
        level: "medium",
        mitigationStrategy: isUk ? "Застосування прикочування після сівби та рідких добрив КАЅ" : "Soil rolling after seeding and switching to liquid UAN fertilizers",
      },
      {
        riskName: isUk ? "Вилягання посівів" : "Lodging Risk",
        level: input.targetYield > 6 ? "high" : "low",
        mitigationStrategy: isUk ? "Внесення регулятора росту (Хлормекват-хлорид) у фазу ВВСН 30-31" : "Apply plant growth regulator (Chlormequat-chloride) at BBCH 30-31",
      },
    ],
    rotationEvaluation: {
      phytosanitaryStatus: isUk ? "Задовільний" : "Satisfactory",
      predecessorComment: isUk
        ? `Попередник ${input.predecessor} має помірну фітосанітарну сумісність. Врахуйте ризик накопичення патогенів у ґрунті.`
        : `Predecessor ${input.predecessor} provides moderate phytosanitary compatibility.`,
    },
    agronomicDisclaimer: isUk
      ? "УВАГА: Даний протокол є агрономічною рекомендацією. Польові норми можуть коригуватися за результатами лаборатного аналізу ґрунту та локальних метеоумов."
      : "DISCLAIMER: This report serves as an agronomic recommendation. Field rates must be adjusted based on detailed laboratory soil analysis and real-time weather conditions.",
  };
}

startServer();
