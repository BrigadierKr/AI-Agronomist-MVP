/**
 * Deterministic Agronomy Calculation Engine
 * Used by both server (validation/LLM baseline) and client (real-time UI calculations).
 */

export interface CropProfile {
  id: string;
  names: { en: string; uk: string; ru: string };
  defaultYieldTarget: number; // t/ha
  minYield: number;
  maxYield: number;
  nPerTon: number; // kg N per ton of yield
  pPerTon: number; // kg P2O5 per ton of yield
  kPerTon: number; // kg K2O per ton of yield
  defaultDensity: number; // million plants/ha
  defaultTKW: number; // 1000-kernel weight in grams
  pricePerTonUSD: number; // Average market reference price
}

export const CROP_PROFILES: Record<string, CropProfile> = {
  wheat: {
    id: 'wheat',
    names: { en: 'Winter Wheat', uk: 'Пшениця озима', ru: 'Пшеница озимая' },
    defaultYieldTarget: 6.0,
    minYield: 2.0,
    maxYield: 12.0,
    nPerTon: 28,
    pPerTon: 11,
    kPerTon: 20,
    defaultDensity: 4.5, // 4.5 million seeds/ha
    defaultTKW: 42, // 42g per 1000 seeds
    pricePerTonUSD: 215,
  },
  corn: {
    id: 'corn',
    names: { en: 'Grain Corn', uk: 'Кукурудза на зерно', ru: 'Кукуруза на зерно' },
    defaultYieldTarget: 9.0,
    minYield: 3.0,
    maxYield: 16.0,
    nPerTon: 24,
    pPerTon: 10,
    kPerTon: 22,
    defaultDensity: 0.075, // 75,000 plants/ha = 0.075 million
    defaultTKW: 310,
    pricePerTonUSD: 195,
  },
  sunflower: {
    id: 'sunflower',
    names: { en: 'Sunflower', uk: 'Соняшник', ru: 'Подсолнечник' },
    defaultYieldTarget: 3.2,
    minYield: 1.0,
    maxYield: 5.5,
    nPerTon: 42,
    pPerTon: 26,
    kPerTon: 72,
    defaultDensity: 0.065, // 65,000 plants/ha
    defaultTKW: 65,
    pricePerTonUSD: 440,
  },
  soybean: {
    id: 'soybean',
    names: { en: 'Soybeans', uk: 'Соя', ru: 'Соя' },
    defaultYieldTarget: 3.0,
    minYield: 1.2,
    maxYield: 5.0,
    nPerTon: 20, // Low synthetic N needed due to rhizobia nitrogen fixation (~65-70%)
    pPerTon: 16,
    kPerTon: 24,
    defaultDensity: 0.55, // 550,000 plants/ha
    defaultTKW: 160,
    pricePerTonUSD: 410,
  },
  rapeseed: {
    id: 'rapeseed',
    names: { en: 'Winter Rapeseed', uk: 'Ріпак озимий', ru: 'Рапс озимый' },
    defaultYieldTarget: 3.8,
    minYield: 1.5,
    maxYield: 6.0,
    nPerTon: 52,
    pPerTon: 25,
    kPerTon: 48,
    defaultDensity: 0.5, // 500,000 plants/ha
    defaultTKW: 4.8,
    pricePerTonUSD: 490,
  },
  barley: {
    id: 'barley',
    names: { en: 'Spring Barley', uk: 'Ячмінь ярий', ru: 'Ячмень яровой' },
    defaultYieldTarget: 4.8,
    minYield: 1.8,
    maxYield: 8.5,
    nPerTon: 25,
    pPerTon: 11,
    kPerTon: 20,
    defaultDensity: 4.2,
    defaultTKW: 45,
    pricePerTonUSD: 185,
  },
};

export interface SoilTypeInfo {
  id: string;
  names: { en: string; uk: string; ru: string };
  nEfficiency: number; // multiplier for nutrient availability
  pEfficiency: number;
  kEfficiency: number;
}

export const SOIL_TYPES: Record<string, SoilTypeInfo> = {
  chernozem: {
    id: 'chernozem',
    names: { en: 'Chernozem (Black Soil)', uk: 'Чорнозем типовий', ru: 'Чернозем типичный' },
    nEfficiency: 0.85,
    pEfficiency: 0.70,
    kEfficiency: 0.85,
  },
  sandy_loam: {
    id: 'sandy_loam',
    names: { en: 'Sandy Loam', uk: 'Супіщаний ґрунт', ru: 'Супесчаная почва' },
    nEfficiency: 1.15, // Higher leaching, requires more N
    pEfficiency: 0.85,
    kEfficiency: 1.10,
  },
  clay_loam: {
    id: 'clay_loam',
    names: { en: 'Clay Loam', uk: 'Суглинковий ґрунт', ru: 'Суглинистая почва' },
    nEfficiency: 0.95,
    pEfficiency: 0.90,
    kEfficiency: 0.80,
  },
  podzolic: {
    id: 'podzolic',
    names: { en: 'Gray Forest / Podzolic', uk: 'Сірий лісовий / Підзолистий', ru: 'Серая лесная / Подзолистая' },
    nEfficiency: 1.05,
    pEfficiency: 1.10,
    kEfficiency: 1.00,
  },
};

export interface PredecessorCredit {
  id: string;
  names: { en: string; uk: string; ru: string };
  nCreditKgHa: number; // N added or depleted
  phytosanitaryRating: 'excellent' | 'good' | 'moderate' | 'poor';
}

export const PREDECESSOR_CROPS: Record<string, PredecessorCredit> = {
  legumes: {
    id: 'legumes',
    names: { en: 'Peas / Soybeans (Legumes)', uk: 'Горох / Соя (Бобові)', ru: 'Горох / Соя (Бобовые)' },
    nCreditKgHa: 35,
    phytosanitaryRating: 'excellent',
  },
  fallow: {
    id: 'fallow',
    names: { en: 'Black Fallow', uk: 'Чорний пар', ru: 'Черный пар' },
    nCreditKgHa: 45,
    phytosanitaryRating: 'excellent',
  },
  winter_wheat: {
    id: 'winter_wheat',
    names: { en: 'Winter Wheat', uk: 'Пшениця озима', ru: 'Пшеница озимая' },
    nCreditKgHa: 0,
    phytosanitaryRating: 'moderate',
  },
  corn: {
    id: 'corn',
    names: { en: 'Corn for Grain', uk: 'Кукурудза на зерно', ru: 'Кукуруза на зерно' },
    nCreditKgHa: -15, // High C:N residue ties up N temporarily
    phytosanitaryRating: 'good',
  },
  sunflower: {
    id: 'sunflower',
    names: { en: 'Sunflower', uk: 'Соняшник', ru: 'Подсолнечник' },
    nCreditKgHa: -10, // Depletes moisture and potassium deep in profile
    phytosanitaryRating: 'poor',
  },
  rapeseed: {
    id: 'rapeseed',
    names: { en: 'Winter Rapeseed', uk: 'Ріпак озимий', ru: 'Рапс озимый' },
    nCreditKgHa: 10,
    phytosanitaryRating: 'good',
  },
};

export interface CalculateFertilizerParams {
  cropId: string;
  targetYield: number; // t/ha
  soilTypeId: string;
  predecessorId: string;
  organicMatterPercent?: number; // e.g. 3.5%
}

export interface FertilizerCalculationResult {
  nNeedKgHa: number;
  p2o5NeedKgHa: number;
  k2oNeedKgHa: number;
  suggestedProducts: {
    ammoniumNitrateKgHa: number; // 34.4% N
    ureaKgHa: number; // 46% N
    mapKgHa: number; // Monoammonium phosphate (12-52-0)
    potassiumChlorideKgHa: number; // 60% K2O
  };
}

export function calculateFertilizerRequirements(
  params: CalculateFertilizerParams
): FertilizerCalculationResult {
  const crop = CROP_PROFILES[params.cropId] || CROP_PROFILES.wheat;
  const soil = SOIL_TYPES[params.soilTypeId] || SOIL_TYPES.chernozem;
  const predecessor = PREDECESSOR_CROPS[params.predecessorId] || PREDECESSOR_CROPS.winter_wheat;
  const rawOm = params.organicMatterPercent ?? 3.2;
  const om = Math.max(0, Number.isNaN(rawOm) ? 3.2 : rawOm);
  const targetYield = Math.max(0, Number.isNaN(params.targetYield) ? 0 : params.targetYield);

  // Base removal requirement
  const baseN = crop.nPerTon * targetYield;
  const baseP = crop.pPerTon * targetYield;
  const baseK = crop.kPerTon * targetYield;

  // Soil organic matter contribution (approx 10-15 kg N per 1% OM)
  const omNCredit = Math.min(45, om * 10);

  // Net active nutrient required
  let netN = Math.max(0, (baseN - omNCredit - predecessor.nCreditKgHa) * soil.nEfficiency);
  let netP = Math.max(0, baseP * soil.pEfficiency);
  let netK = Math.max(0, baseK * soil.kEfficiency);

  // Round to 1 decimal place
  netN = Math.round(netN * 10) / 10;
  netP = Math.round(netP * 10) / 10;
  netK = Math.round(netK * 10) / 10;

  // Product commercial physical quantity estimates
  // MAP (12% N, 52% P2O5)
  const mapKgHa = Math.round((netP / 0.52) * 10) / 10;
  const nFromMap = mapKgHa * 0.12;

  const remainingN = Math.max(0, netN - nFromMap);
  // Split remaining N: 40% Urea at pre-sowing/sowing, 60% Ammonium Nitrate top-dressing
  const ureaKgHa = Math.round(((remainingN * 0.4) / 0.46) * 10) / 10;
  const ammoniumNitrateKgHa = Math.round(((remainingN * 0.6) / 0.344) * 10) / 10;
  const potassiumChlorideKgHa = Math.round((netK / 0.60) * 10) / 10;

  return {
    nNeedKgHa: netN,
    p2o5NeedKgHa: netP,
    k2oNeedKgHa: netK,
    suggestedProducts: {
      ammoniumNitrateKgHa,
      ureaKgHa,
      mapKgHa,
      potassiumChlorideKgHa,
    },
  };
}

export interface CalculateSeedingRateParams {
  cropId: string;
  targetDensityPlantsM2: number; // e.g. 450 plants/m2 or for corn 7.5 plants/m2
  tkwGrams: number; // 1000-kernel weight in grams
  germinationPercent: number; // e.g. 95%
  purityPercent: number; // e.g. 98%
  fieldEmergenceLossPercent: number; // e.g. 8%
}

export interface SeedingRateResult {
  seedRateKgHa: number;
  seedsPerM2: number;
  totalSeedsHaMillions: number;
  bagsHa50kg: number;
}

export function calculateSeedingRate(params: CalculateSeedingRateParams): SeedingRateResult {
  const germ = Math.max(0.5, Math.min(1.0, params.germinationPercent / 100));
  const pur = Math.max(0.5, Math.min(1.0, params.purityPercent / 100));
  const loss = Math.max(0.0, Math.min(0.4, params.fieldEmergenceLossPercent / 100));

  // Field suitability factor
  const suitability = germ * pur * (1 - loss);

  // Required sown seeds to achieve target established plants
  const seedsToSowM2 = params.targetDensityPlantsM2 / suitability;

  // Rate in kg/ha = (seeds/m2 * TKW) / 100
  const seedRateKgHa = Math.round(((seedsToSowM2 * params.tkwGrams) / 100) * 10) / 10;
  const totalSeedsHaMillions = Math.round(((seedsToSowM2 * 10000) / 1_000_000) * 1000) / 1000;
  const bagsHa50kg = Math.ceil(seedRateKgHa / 50);

  return {
    seedRateKgHa,
    seedsPerM2: Math.round(seedsToSowM2),
    totalSeedsHaMillions,
    bagsHa50kg,
  };
}

export interface CalculateFuelOperationParams {
  fieldAreaHa: number;
  technology: 'conventional' | 'min_till' | 'no_till';
}

export interface FuelOperationResult {
  fuelLiterPerHa: number;
  totalFuelLiters: number;
  estimatedMachineHours: number;
  co2EstimateTons: number;
  breakdown: {
    tillageLiters: number;
    sowingLiters: number;
    sprayingLiters: number;
    harvestingLiters: number;
    transportLiters: number;
  };
}

export function calculateFuelAndWork(params: CalculateFuelOperationParams): FuelOperationResult {
  const fieldArea = Math.max(0, Number.isNaN(params.fieldAreaHa) ? 0 : params.fieldAreaHa);
  let tillage = 42;
  let sowing = 12;
  let spraying = 8;
  let harvesting = 22;
  let transport = 11;

  if (params.technology === 'min_till') {
    tillage = 22;
    sowing = 10;
  } else if (params.technology === 'no_till') {
    tillage = 0;
    sowing = 8;
  }

  const fuelPerHa = tillage + sowing + spraying + harvesting + transport;
  const totalFuelLiters = Math.round(fuelPerHa * fieldArea);
  const machineHoursPerHa = params.technology === 'no_till' ? 1.8 : params.technology === 'min_till' ? 2.6 : 3.8;
  const totalMachineHours = Math.round(machineHoursPerHa * fieldArea * 10) / 10;
  const co2Tons = Math.round((totalFuelLiters * 2.68) / 1000 * 100) / 100; // 2.68 kg CO2 per liter diesel

  return {
    fuelLiterPerHa: fuelPerHa,
    totalFuelLiters,
    estimatedMachineHours: totalMachineHours,
    co2EstimateTons: co2Tons,
    breakdown: {
      tillageLiters: tillage,
      sowingLiters: sowing,
      sprayingLiters: spraying,
      harvestingLiters: harvesting,
      transportLiters: transport,
    },
  };
}

export interface CalculateEconomicsParams {
  cropId: string;
  fieldAreaHa: number;
  targetYield: number; // t/ha
  marketPriceUSD: number; // $/t
  fertilizerCostUSDHa: number;
  seedCostUSDHa: number;
  cropProtectionUSDHa: number;
  fuelMachineryUSDHa: number;
  rentAndOtherUSDHa: number;
}

export interface EconomicsResult {
  grossRevenueUSDHa: number;
  totalDirectCostUSDHa: number;
  netMarginUSDHa: number;
  totalFarmProfitUSD: number;
  breakEvenYieldTonHa: number;
  roiPercent: number;
}

export function calculateEconomics(params: CalculateEconomicsParams): EconomicsResult {
  const targetYield = Math.max(0, Number.isNaN(params.targetYield) ? 0 : params.targetYield);
  const marketPrice = Math.max(0, Number.isNaN(params.marketPriceUSD) ? 0 : params.marketPriceUSD);
  const fieldArea = Math.max(0, Number.isNaN(params.fieldAreaHa) ? 0 : params.fieldAreaHa);

  const fertCost = Math.max(0, params.fertilizerCostUSDHa || 0);
  const seedCost = Math.max(0, params.seedCostUSDHa || 0);
  const protCost = Math.max(0, params.cropProtectionUSDHa || 0);
  const fuelCost = Math.max(0, params.fuelMachineryUSDHa || 0);
  const rentCost = Math.max(0, params.rentAndOtherUSDHa || 0);

  const grossRev = targetYield * marketPrice;
  const directCost = fertCost + seedCost + protCost + fuelCost + rentCost;

  const netMarginHa = grossRev - directCost;
  const totalProfit = netMarginHa * fieldArea;
  const breakEvenYield = marketPrice > 0 ? directCost / marketPrice : 0;
  const roi = directCost > 0 ? (netMarginHa / directCost) * 100 : 0;

  return {
    grossRevenueUSDHa: Math.round(grossRev),
    totalDirectCostUSDHa: Math.round(directCost),
    netMarginUSDHa: Math.round(netMarginHa),
    totalFarmProfitUSD: Math.round(totalProfit),
    breakEvenYieldTonHa: Math.round(breakEvenYield * 100) / 100,
    roiPercent: Math.round(roi * 10) / 10,
  };
}
