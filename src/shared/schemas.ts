import { z } from "zod";

export const recommendationRequestSchema = z.object({
  crop: z.string().default("wheat"),
  region: z.string().default("Central Steppe / Poltava"),
  predecessor: z.string().default("legumes"),
  soilType: z.string().default("chernozem"),
  fieldArea: z.number().positive().default(100),
  targetYield: z.number().positive().default(6.0),
  organicMatter: z.number().min(0.5).max(12).default(3.2),
  budgetLevel: z.enum(["low_input", "standard", "intensive"]).default("standard"),
  technology: z.enum(["conventional", "min_till", "no_till"]).default("conventional"),
  language: z.enum(["en", "uk", "ru"]).default("uk"),
});

export type RecommendationRequestInput = z.infer<typeof recommendationRequestSchema>;

export const calculateRequestSchema = z.object({
  crop: z.string().default("wheat"),
  targetYield: z.number().positive().default(6.0),
  soilType: z.string().default("chernozem"),
  predecessor: z.string().default("winter_wheat"),
  organicMatter: z.number().min(0.5).max(12).default(3.2),
  fieldArea: z.number().positive().default(100),
  technology: z.enum(["conventional", "min_till", "no_till"]).default("conventional"),
});

export type CalculateRequestInput = z.infer<typeof calculateRequestSchema>;
