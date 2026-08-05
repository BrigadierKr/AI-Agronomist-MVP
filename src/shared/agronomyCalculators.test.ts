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
        organicMatterPercent: 6.0,
      });

      const resultOM45 = calculateFertilizerRequirements({
        cropId: 'wheat',
        targetYield: 6.0,
        soilTypeId: 'chernozem',
        predecessorId: 'winter_wheat',
        organicMatterPercent: 4.5,
      });

      expect(resultHighOM.nNeedKgHa).toEqual(resultOM45.nNeedKgHa);
    });

    it('handles edge case: zero or negative organic matter safely', () => {
      const resultZero = calculateFertilizerRequirements({
        cropId: 'barley',
        targetYield: 4.5,
        soilTypeId: 'sandy',
        predecessorId: 'sunflower',
        organicMatterPercent: 0,
      });

      const resultNeg = calculateFertilizerRequirements({
        cropId: 'barley',
        targetYield: 4.5,
        soilTypeId: 'sandy',
        predecessorId: 'sunflower',
        organicMatterPercent: -3,
      });

      expect(resultZero.nNeedKgHa).toBeGreaterThan(0);
      expect(resultNeg.nNeedKgHa).toEqual(resultZero.nNeedKgHa);
    });

    it('handles edge case: zero target yield without crashing or returning NaN', () => {
      const result = calculateFertilizerRequirements({
        cropId: 'corn',
        targetYield: 0,
        soilTypeId: 'podzolic',
        predecessorId: 'corn',
        organicMatterPercent: 1.5,
      });

      expect(result.nNeedKgHa).toBe(0);
      expect(result.p2o5NeedKgHa).toBe(0);
      expect(result.k2oNeedKgHa).toBe(0);
      expect(result.suggestedProducts.mapKgHa).toBe(0);
      expect(result.suggestedProducts.ureaKgHa).toBe(0);
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

    it('falls back gracefully if invalid soilTypeId or predecessorId provided', () => {
      const result = calculateFertilizerRequirements({
        cropId: 'rapeseed',
        targetYield: 3.5,
        soilTypeId: 'unknown_soil_type',
        predecessorId: 'unknown_predecessor',
        organicMatterPercent: 2.5,
      });

      expect(result).toBeDefined();
      expect(Number.isNaN(result.nNeedKgHa)).toBe(false);
      expect(Number.isNaN(result.p2o5NeedKgHa)).toBe(false);
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

    it('handles edge case: 0% germination or purity safely without Infinity/NaN', () => {
      const resultZeroGerm = calculateSeedingRate({
        cropId: 'soybean',
        targetDensityPlantsM2: 60,
        tkwGrams: 160,
        germinationPercent: 0,
        purityPercent: 98,
        fieldEmergenceLossPercent: 10,
      });

      expect(Number.isFinite(resultZeroGerm.seedRateKgHa)).toBe(true);
      expect(resultZeroGerm.seedRateKgHa).toBeGreaterThan(0);
    });

    it('handles small TKW values for small-seeded crops like rapeseed', () => {
      const resultRapeseed = calculateSeedingRate({
        cropId: 'rapeseed',
        targetDensityPlantsM2: 50,
        tkwGrams: 4.5,
        germinationPercent: 90,
        purityPercent: 97,
        fieldEmergenceLossPercent: 12,
      });

      expect(resultRapeseed.seedRateKgHa).toBeGreaterThan(1.5);
      expect(resultRapeseed.seedRateKgHa).toBeLessThan(10);
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

    it('handles edge case: zero or negative area', () => {
      const resultZero = calculateFuelAndWork({ fieldAreaHa: 0, technology: 'conventional' });
      const resultNeg = calculateFuelAndWork({ fieldAreaHa: -50, technology: 'conventional' });

      expect(resultZero.totalFuelLiters).toBe(0);
      expect(resultZero.co2EstimateTons).toBe(0);
      expect(resultNeg.totalFuelLiters).toBe(0);
    });

    it('falls back to conventional technology when invalid tech provided', () => {
      const result = calculateFuelAndWork({ fieldAreaHa: 100, technology: 'space_till' as any });

      expect(result.fuelLiterPerHa).toBeGreaterThan(0);
      expect(result.totalFuelLiters).toBeGreaterThan(0);
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

      expect(result.grossRevenueUSDHa).toBe(1408);
      expect(result.totalDirectCostUSDHa).toBe(560);
      expect(result.netMarginUSDHa).toBe(848);
      expect(result.totalFarmProfitUSD).toBe(848 * 50);
      expect(result.roiPercent).toBeGreaterThan(100);
      expect(result.breakEvenYieldTonHa).toBeCloseTo(560 / 440, 1);
    });

    it('handles edge case: zero direct costs without dividing by zero', () => {
      const result = calculateEconomics({
        cropId: 'wheat',
        fieldAreaHa: 10,
        targetYield: 5.0,
        marketPriceUSD: 200,
        fertilizerCostUSDHa: 0,
        seedCostUSDHa: 0,
        cropProtectionUSDHa: 0,
        fuelMachineryUSDHa: 0,
        rentAndOtherUSDHa: 0,
      });

      expect(result.totalDirectCostUSDHa).toBe(0);
      expect(result.netMarginUSDHa).toBe(1000);
      expect(Number.isFinite(result.roiPercent)).toBe(true);
      expect(result.breakEvenYieldTonHa).toBe(0);
    });

    it('handles edge case: zero market price', () => {
      const result = calculateEconomics({
        cropId: 'wheat',
        fieldAreaHa: 10,
        targetYield: 5.0,
        marketPriceUSD: 0,
        fertilizerCostUSDHa: 100,
        seedCostUSDHa: 0,
        cropProtectionUSDHa: 0,
        fuelMachineryUSDHa: 0,
        rentAndOtherUSDHa: 0,
      });

      expect(result.grossRevenueUSDHa).toBe(0);
      expect(result.netMarginUSDHa).toBe(-100);
      expect(result.breakEvenYieldTonHa).toBe(0);
    });
  });
});
