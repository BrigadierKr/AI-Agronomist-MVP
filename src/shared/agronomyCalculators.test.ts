import { describe, it, expect } from 'vitest';
import {
  calculateFertilizerRequirements,
  calculateSeedingRate,
  calculateFuelAndWork,
  calculateEconomics,
  CROP_PROFILES,
  SOIL_TYPES,
  PREDECESSOR_CROPS,
} from './agronomyCalculators.js';

describe('Agronomy Calculators Engine', () => {
  describe('calculateFertilizerRequirements', () => {
    it('calculates correct NPK for Winter Wheat on Chernozem with Legumes predecessor', () => {
      const result = calculateFertilizerRequirements({
        cropId: 'wheat',
        targetYield: 6.0,
        soilTypeId: 'chernozem',
        predecessorId: 'legumes',
        organicMatterPercent: 3.2,
      });

      // Base N removal = 28 * 6.0 = 168
      // OM Credit = min(45, 3.2 * 10) = 32
      // Legumes credit = 35
      // Net N before soil efficiency = 168 - 32 - 35 = 101
      // Soil efficiency (chernozem) = 0.85 -> 101 * 0.85 = 85.85 -> rounded to 85.9
      expect(result.nNeedKgHa).toBeCloseTo(85.9, 1);
      expect(result.p2o5NeedKgHa).toBeGreaterThan(0);
      expect(result.k2oNeedKgHa).toBeGreaterThan(0);
      expect(result.suggestedProducts.mapKgHa).toBeGreaterThan(0);
      expect(result.suggestedProducts.ureaKgHa).toBeGreaterThan(0);
    });

    it('handles high organic matter capping (OM credit capped at 45 kg N)', () => {
      const resultHighOM = calculateFertilizerRequirements({
        cropId: 'wheat',
        targetYield: 6.0,
        soilTypeId: 'chernozem',
        predecessorId: 'winter_wheat',
        organicMatterPercent: 6.0, // 6.0 * 10 = 60, should be capped at 45
      });

      const resultOM45 = calculateFertilizerRequirements({
        cropId: 'wheat',
        targetYield: 6.0,
        soilTypeId: 'chernozem',
        predecessorId: 'winter_wheat',
        organicMatterPercent: 4.5, // 4.5 * 10 = 45
      });

      expect(resultHighOM.nNeedKgHa).toEqual(resultOM45.nNeedKgHa);
    });

    it('falls back gracefully to default crop profile if invalid cropId provided', () => {
      const result = calculateFertilizerRequirements({
        cropId: 'invalid_crop_xyz',
        targetYield: 5.0,
        soilTypeId: 'chernozem',
        predecessorId: 'winter_wheat',
        organicMatterPercent: 3.0,
      });

      expect(result).toBeDefined();
      expect(result.nNeedKgHa).toBeGreaterThan(0);
    });
  });

  describe('calculateSeedingRate', () => {
    it('calculates expected seed rate in kg/ha and bag count for wheat', () => {
      const result = calculateSeedingRate({
        cropId: 'wheat',
        targetDensityPlantsM2: 450,
        tkwGrams: 42,
        germinationPercent: 95,
        purityPercent: 98,
        fieldEmergenceLossPercent: 8,
      });

      expect(result.seedRateKgHa).toBeGreaterThan(150);
      expect(result.seedRateKgHa).toBeLessThan(300);
      expect(result.seedsPerM2).toBeGreaterThan(450);
      expect(result.bagsHa50kg).toBe(Math.ceil(result.seedRateKgHa / 50));
    });

    it('handles emergence loss boundaries correctly', () => {
      const resultLowLoss = calculateSeedingRate({
        cropId: 'corn',
        targetDensityPlantsM2: 7.5,
        tkwGrams: 310,
        germinationPercent: 98,
        purityPercent: 99,
        fieldEmergenceLossPercent: 2,
      });

      const resultHighLoss = calculateSeedingRate({
        cropId: 'corn',
        targetDensityPlantsM2: 7.5,
        tkwGrams: 310,
        germinationPercent: 98,
        purityPercent: 99,
        fieldEmergenceLossPercent: 25,
      });

      expect(resultHighLoss.seedRateKgHa).toBeGreaterThan(resultLowLoss.seedRateKgHa);
    });
  });

  describe('calculateFuelAndWork', () => {
    it('reduces fuel and machine hours significantly for No-Till technology', () => {
      const conv = calculateFuelAndWork({ fieldAreaHa: 100, technology: 'conventional' });
      const minTill = calculateFuelAndWork({ fieldAreaHa: 100, technology: 'min_till' });
      const noTill = calculateFuelAndWork({ fieldAreaHa: 100, technology: 'no_till' });

      expect(conv.fuelLiterPerHa).toBeGreaterThan(minTill.fuelLiterPerHa);
      expect(minTill.fuelLiterPerHa).toBeGreaterThan(noTill.fuelLiterPerHa);
      expect(noTill.breakdown.tillageLiters).toBe(0);
      expect(noTill.co2EstimateTons).toBeLessThan(conv.co2EstimateTons);
    });
  });

  describe('calculateEconomics', () => {
    it('computes realistic gross revenue, net profit, and ROI for sunflower', () => {
      const result = calculateEconomics({
        cropId: 'sunflower',
        fieldAreaHa: 50,
        targetYield: 3.2,
        marketPriceUSD: 440,
        fertilizerCostUSDHa: 180,
        seedCostUSDHa: 60,
        cropProtectionUSDHa: 90,
        fuelMachineryUSDHa: 110,
        rentAndOtherUSDHa: 120,
      });

      // Gross revenue = 3.2 * 440 = 1408
      // Direct cost = 180 + 60 + 90 + 110 + 120 = 560
      // Net margin = 1408 - 560 = 848
      expect(result.grossRevenueUSDHa).toBe(1408);
      expect(result.totalDirectCostUSDHa).toBe(560);
      expect(result.netMarginUSDHa).toBe(848);
      expect(result.totalFarmProfitUSD).toBe(848 * 50);
      expect(result.roiPercent).toBeGreaterThan(100);
      expect(result.breakEvenYieldTonHa).toBeCloseTo(560 / 440, 1);
    });
  });
});
