import React, { useState } from 'react';
import { Calculator, Fuel, Scale, DollarSign, Wheat, Sprout } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../i18n/translations';
import {
  calculateFertilizerRequirements,
  calculateSeedingRate,
  calculateFuelAndWork,
  calculateEconomics,
  CROP_PROFILES,
  SOIL_TYPES,
  PREDECESSOR_CROPS,
} from '../shared/agronomyCalculators';

interface CalculatorsTabProps {
  currentLang: Language;
}

export const CalculatorsTab: React.FC<CalculatorsTabProps> = ({ currentLang }) => {
  const t = getTranslation(currentLang);
  const [activeCalc, setActiveCalc] = useState<'npk' | 'seed' | 'fuel' | 'econ'>('npk');

  // NPK state
  const [npkCrop, setNpkCrop] = useState('wheat');
  const [npkYield, setNpkYield] = useState(6.0);
  const [npkSoil, setNpkSoil] = useState('chernozem');
  const [npkPred, setNpkPred] = useState('legumes');
  const [npkOm, setNpkOm] = useState(3.4);

  const fertResult = calculateFertilizerRequirements({
    cropId: npkCrop,
    targetYield: npkYield,
    soilTypeId: npkSoil,
    predecessorId: npkPred,
    organicMatterPercent: npkOm,
  });

  // Seed State
  const [seedCrop, setSeedCrop] = useState('wheat');
  const [seedTargetDensity, setSeedTargetDensity] = useState(450); // plants/m2
  const [seedTKW, setSeedTKW] = useState(42);
  const [seedGerm, setSeedGerm] = useState(95);
  const [seedPurity, setSeedPurity] = useState(98);
  const [seedLoss, setSeedLoss] = useState(8);

  const seedResult = calculateSeedingRate({
    cropId: seedCrop,
    targetDensityPlantsM2: seedTargetDensity,
    tkwGrams: seedTKW,
    germinationPercent: seedGerm,
    purityPercent: seedPurity,
    fieldEmergenceLossPercent: seedLoss,
  });

  // Fuel State
  const [fuelArea, setFuelArea] = useState(100);
  const [fuelTech, setFuelTech] = useState<'conventional' | 'min_till' | 'no_till'>('conventional');

  const fuelResult = calculateFuelAndWork({
    fieldAreaHa: fuelArea,
    technology: fuelTech,
  });

  // Econ State
  const [econCrop, setEconCrop] = useState('wheat');
  const [econArea, setEconArea] = useState(100);
  const [econYield, setEconYield] = useState(6.0);
  const [econPrice, setEconPrice] = useState(215);
  const [econFert, setEconFert] = useState(280);
  const [econSeed, setEconSeed] = useState(90);
  const [econProtect, setEconProtect] = useState(95);
  const [econFuel, setEconFuel] = useState(120);
  const [econRent, setEconRent] = useState(130);

  const econResult = calculateEconomics({
    cropId: econCrop,
    fieldAreaHa: econArea,
    targetYield: econYield,
    marketPriceUSD: econPrice,
    fertilizerCostUSDHa: econFert,
    seedCostUSDHa: econSeed,
    cropProtectionUSDHa: econProtect,
    fuelMachineryUSDHa: econFuel,
    rentAndOtherUSDHa: econRent,
  });

  return (
    <div className="space-y-6">
      {/* Calculator Navigation Bar */}
      <div className="bg-[#0F0F11] border border-[#27272A] rounded-xl p-3 shadow-xl flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCalc('npk')}
          className={`flex items-center space-x-2 px-4 py-2 rounded font-mono text-xs font-medium transition ${
            activeCalc === 'npk'
              ? 'bg-[#18181B] text-[#84A98C] border border-[#27272A] shadow-sm'
              : 'text-[#71717A] hover:text-[#D4D4D8]'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>{t.calcFertTitle}</span>
        </button>

        <button
          onClick={() => setActiveCalc('seed')}
          className={`flex items-center space-x-2 px-4 py-2 rounded font-mono text-xs font-medium transition ${
            activeCalc === 'seed'
              ? 'bg-[#18181B] text-[#84A98C] border border-[#27272A] shadow-sm'
              : 'text-[#71717A] hover:text-[#D4D4D8]'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>{t.calcSeedTitle}</span>
        </button>

        <button
          onClick={() => setActiveCalc('fuel')}
          className={`flex items-center space-x-2 px-4 py-2 rounded font-mono text-xs font-medium transition ${
            activeCalc === 'fuel'
              ? 'bg-[#18181B] text-[#84A98C] border border-[#27272A] shadow-sm'
              : 'text-[#71717A] hover:text-[#D4D4D8]'
          }`}
        >
          <Fuel className="w-4 h-4" />
          <span>{t.calcFuelTitle}</span>
        </button>

        <button
          onClick={() => setActiveCalc('econ')}
          className={`flex items-center space-x-2 px-4 py-2 rounded font-mono text-xs font-medium transition ${
            activeCalc === 'econ'
              ? 'bg-[#18181B] text-[#84A98C] border border-[#27272A] shadow-sm'
              : 'text-[#71717A] hover:text-[#D4D4D8]'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>{t.calcEconTitle}</span>
        </button>
      </div>

      {/* 1. NPK Calculator */}
      {activeCalc === 'npk' && (
        <div className="bg-[#0F0F11] border border-[#27272A] rounded-xl p-6 shadow-xl">
          <h3 className="text-lg font-serif italic text-[#F4F4F5] flex items-center space-x-2 pb-4 border-b border-[#27272A]">
            <Scale className="w-5 h-5 text-[#84A98C]" />
            <span>{t.calcFertTitle}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Inputs */}
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#52525B] font-semibold block">{t.crop}</label>
                <select
                  value={npkCrop}
                  onChange={(e) => setNpkCrop(e.target.value)}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2.5 text-[#E4E4E7] outline-none focus:border-[#84A98C]"
                >
                  {Object.entries(CROP_PROFILES).map(([k, c]) => (
                    <option key={k} value={k} className="bg-[#18181B]">{c.names[currentLang] || c.names.en}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#52525B] font-semibold block">{t.targetYield} (t/ha)</label>
                <input
                  type="number"
                  step="0.1"
                  value={npkYield}
                  onChange={(e) => setNpkYield(parseFloat(e.target.value) || 5.0)}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2.5 text-[#84A98C] font-mono font-bold outline-none focus:border-[#84A98C]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#52525B] font-semibold block">{t.soilType}</label>
                <select
                  value={npkSoil}
                  onChange={(e) => setNpkSoil(e.target.value)}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2.5 text-[#E4E4E7] outline-none focus:border-[#84A98C]"
                >
                  {Object.entries(SOIL_TYPES).map(([k, s]) => (
                    <option key={k} value={k} className="bg-[#18181B]">{s.names[currentLang] || s.names.en}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#52525B] font-semibold block">{t.predecessor}</label>
                <select
                  value={npkPred}
                  onChange={(e) => setNpkPred(e.target.value)}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2.5 text-[#E4E4E7] outline-none focus:border-[#84A98C]"
                >
                  {Object.entries(PREDECESSOR_CROPS).map(([k, p]) => (
                    <option key={k} value={k} className="bg-[#18181B]">{p.names[currentLang] || p.names.en}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#52525B] font-semibold block">{t.organicMatter} (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={npkOm}
                  onChange={(e) => setNpkOm(parseFloat(e.target.value) || 3.0)}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2.5 text-[#E4E4E7] font-mono font-bold outline-none focus:border-[#84A98C]"
                />
              </div>
            </div>

            {/* Results */}
            <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#52525B] font-semibold block mb-4">
                  Calculated Active Ingredient Demand
                </span>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded bg-[#0A0A0B] border border-[#27272A]">
                    <span className="text-xs font-medium text-[#D4D4D8]">{t.nitrogen}</span>
                    <span className="text-xl font-mono font-bold text-[#84A98C]">{fertResult.nNeedKgHa} kg/ha</span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded bg-[#0A0A0B] border border-[#27272A]">
                    <span className="text-xs font-medium text-[#D4D4D8]">{t.phosphorus}</span>
                    <span className="text-xl font-mono font-bold text-[#84A98C]">{fertResult.p2o5NeedKgHa} kg/ha</span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded bg-[#0A0A0B] border border-[#27272A]">
                    <span className="text-xs font-medium text-[#D4D4D8]">{t.potassium}</span>
                    <span className="text-xl font-mono font-bold text-[#84A98C]">{fertResult.k2oNeedKgHa} kg/ha</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#27272A] text-xs">
                <span className="text-[10px] uppercase tracking-widest text-[#52525B] font-semibold block mb-2">{t.suggestedCommercialProducts}</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 bg-[#0A0A0B] rounded border border-[#27272A] text-[#A1A1AA]">
                    MAP: <strong className="text-[#84A98C]">{fertResult.suggestedProducts.mapKgHa} kg/ha</strong>
                  </div>
                  <div className="p-2 bg-[#0A0A0B] rounded border border-[#27272A] text-[#A1A1AA]">
                    Ammonium Nitrate: <strong className="text-[#84A98C]">{fertResult.suggestedProducts.ammoniumNitrateKgHa} kg/ha</strong>
                  </div>
                  <div className="p-2 bg-[#0A0A0B] rounded border border-[#27272A] text-[#A1A1AA]">
                    Urea: <strong className="text-[#84A98C]">{fertResult.suggestedProducts.ureaKgHa} kg/ha</strong>
                  </div>
                  <div className="p-2 bg-[#0A0A0B] rounded border border-[#27272A] text-[#A1A1AA]">
                    KCl: <strong className="text-[#84A98C]">{fertResult.suggestedProducts.potassiumChlorideKgHa} kg/ha</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Seed Norm Calculator */}
      {activeCalc === 'seed' && (
        <div className="bg-[#0F0F11] border border-[#27272A] rounded-xl p-6 shadow-xl">
          <h3 className="text-lg font-serif italic text-[#F4F4F5] flex items-center space-x-2 pb-4 border-b border-[#27272A]">
            <Sprout className="w-5 h-5 text-[#84A98C]" />
            <span>{t.calcSeedTitle}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#52525B] font-semibold block">Target Plant Density (plants/m²)</label>
                <input
                  type="number"
                  value={seedTargetDensity}
                  onChange={(e) => setSeedTargetDensity(parseFloat(e.target.value) || 400)}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2.5 text-[#E4E4E7] font-mono font-bold outline-none focus:border-[#84A98C]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#52525B] font-semibold block">1000 Seed Weight - TKW (grams)</label>
                <input
                  type="number"
                  step="0.1"
                  value={seedTKW}
                  onChange={(e) => setSeedTKW(parseFloat(e.target.value) || 40)}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2.5 text-[#E4E4E7] font-mono font-bold outline-none focus:border-[#84A98C]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-[#52525B] font-semibold block">Germ. %</label>
                  <input
                    type="number"
                    value={seedGerm}
                    onChange={(e) => setSeedGerm(parseFloat(e.target.value) || 95)}
                    className="w-full bg-[#18181B] border border-[#27272A] rounded p-2 text-[#E4E4E7] font-mono outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-[#52525B] font-semibold block">Purity %</label>
                  <input
                    type="number"
                    value={seedPurity}
                    onChange={(e) => setSeedPurity(parseFloat(e.target.value) || 98)}
                    className="w-full bg-[#18181B] border border-[#27272A] rounded p-2 text-[#E4E4E7] font-mono outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-[#52525B] font-semibold block">Loss %</label>
                  <input
                    type="number"
                    value={seedLoss}
                    onChange={(e) => setSeedLoss(parseFloat(e.target.value) || 8)}
                    className="w-full bg-[#18181B] border border-[#27272A] rounded p-2 text-[#E4E4E7] font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#52525B] font-semibold block mb-4">
                  Calculated Seeding Rate Results
                </span>

                <div className="space-y-4">
                  <div className="p-4 bg-[#0A0A0B] border border-[#27272A] rounded">
                    <span className="text-[10px] uppercase tracking-widest text-[#52525B] block">Sowing Rate (kg/ha)</span>
                    <span className="text-3xl font-mono font-bold text-[#84A98C]">{seedResult.seedRateKgHa} kg/ha</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 bg-[#0A0A0B] rounded border border-[#27272A]">
                      <span className="text-[#52525B] block text-[10px] uppercase">Seeds / m²</span>
                      <span className="text-base font-bold text-[#D4D4D8]">{seedResult.seedsPerM2} seeds</span>
                    </div>

                    <div className="p-3 bg-[#0A0A0B] rounded border border-[#27272A]">
                      <span className="text-[#52525B] block text-[10px] uppercase">50kg Bags / ha</span>
                      <span className="text-base font-bold text-[#84A98C]">{seedResult.bagsHa50kg} bags</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Fuel & Work Calculator */}
      {activeCalc === 'fuel' && (
        <div className="bg-[#0F0F11] border border-[#27272A] rounded-xl p-6 shadow-xl">
          <h3 className="text-lg font-serif italic text-[#F4F4F5] flex items-center space-x-2 pb-4 border-b border-[#27272A]">
            <Fuel className="w-5 h-5 text-[#84A98C]" />
            <span>{t.calcFuelTitle}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#52525B] font-semibold block">{t.fieldArea} (ha)</label>
                <input
                  type="number"
                  value={fuelArea}
                  onChange={(e) => setFuelArea(parseFloat(e.target.value) || 100)}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2.5 text-[#E4E4E7] font-mono font-bold outline-none focus:border-[#84A98C]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#52525B] font-semibold block">{t.tillageTechnology}</label>
                <select
                  value={fuelTech}
                  onChange={(e) => setFuelTech(e.target.value as any)}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2.5 text-[#E4E4E7] outline-none focus:border-[#84A98C]"
                >
                  <option value="conventional" className="bg-[#18181B]">{t.conventional}</option>
                  <option value="min_till" className="bg-[#18181B]">{t.min_till}</option>
                  <option value="no_till" className="bg-[#18181B]">{t.no_till}</option>
                </select>
              </div>
            </div>

            <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-5 space-y-4">
              <div className="p-4 bg-[#0A0A0B] border border-[#27272A] rounded">
                <span className="text-[10px] uppercase tracking-widest text-[#52525B] block">Total Diesel Fuel Budget</span>
                <span className="text-3xl font-mono font-bold text-[#84A98C]">
                  {fuelResult.totalFuelLiters} <span className="text-xs font-normal">Liters</span>
                </span>
                <span className="text-xs font-mono text-[#71717A] block mt-1">({fuelResult.fuelLiterPerHa} L/ha)</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-[#0A0A0B] rounded border border-[#27272A]">
                  <span className="text-[#52525B] block text-[10px] uppercase">Est. Machine Hours</span>
                  <span className="text-base font-bold text-[#D4D4D8]">{fuelResult.estimatedMachineHours} hrs</span>
                </div>
                <div className="p-3 bg-[#0A0A0B] rounded border border-[#27272A]">
                  <span className="text-[#52525B] block text-[10px] uppercase">CO₂ Footprint</span>
                  <span className="text-base font-bold text-[#84A98C]">{fuelResult.co2EstimateTons} tons</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Economics Calculator */}
      {activeCalc === 'econ' && (
        <div className="bg-[#0F0F11] border border-[#27272A] rounded-xl p-6 shadow-xl">
          <h3 className="text-lg font-serif italic text-[#F4F4F5] flex items-center space-x-2 pb-4 border-b border-[#27272A]">
            <DollarSign className="w-5 h-5 text-[#84A98C]" />
            <span>{t.calcEconTitle}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#52525B] font-semibold block">{t.targetYield} (t/ha)</label>
                <input
                  type="number"
                  step="0.1"
                  value={econYield}
                  onChange={(e) => setEconYield(parseFloat(e.target.value) || 6.0)}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2 text-[#84A98C] font-mono font-bold outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#52525B] font-semibold block">Market Price ($/t)</label>
                <input
                  type="number"
                  value={econPrice}
                  onChange={(e) => setEconPrice(parseFloat(e.target.value) || 200)}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2 text-[#E4E4E7] font-mono font-bold outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#52525B] font-semibold block">Fertilizer ($/ha)</label>
                <input
                  type="number"
                  value={econFert}
                  onChange={(e) => setEconFert(parseFloat(e.target.value) || 250)}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2 text-[#E4E4E7] font-mono outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#52525B] font-semibold block">Seed Cost ($/ha)</label>
                <input
                  type="number"
                  value={econSeed}
                  onChange={(e) => setEconSeed(parseFloat(e.target.value) || 90)}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2 text-[#E4E4E7] font-mono outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#52525B] font-semibold block">Crop Protection ($/ha)</label>
                <input
                  type="number"
                  value={econProtect}
                  onChange={(e) => setEconProtect(parseFloat(e.target.value) || 90)}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2 text-[#E4E4E7] font-mono outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#52525B] font-semibold block">Fuel & Machine ($/ha)</label>
                <input
                  type="number"
                  value={econFuel}
                  onChange={(e) => setEconFuel(parseFloat(e.target.value) || 110)}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2 text-[#E4E4E7] font-mono outline-none"
                />
              </div>
            </div>

            <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-5 space-y-4">
              <div className="p-4 bg-[#0A0A0B] border border-[#27272A] rounded">
                <span className="text-[10px] uppercase tracking-widest text-[#52525B] block">Projected Total Net Profit</span>
                <span className="text-3xl font-mono font-bold text-[#84A98C]">${econResult.totalFarmProfitUSD}</span>
                <span className="text-xs font-mono text-[#71717A] block mt-1">(${econResult.netMarginUSDHa} / ha)</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-[#0A0A0B] rounded border border-[#27272A]">
                  <span className="text-[#52525B] block text-[10px] uppercase">Break-even Yield</span>
                  <span className="text-base font-bold text-[#D4D4D8]">{econResult.breakEvenYieldTonHa} t/ha</span>
                </div>
                <div className="p-3 bg-[#0A0A0B] rounded border border-[#27272A]">
                  <span className="text-[#52525B] block text-[10px] uppercase">Estimated ROI</span>
                  <span className="text-base font-bold text-[#84A98C]">{econResult.roiPercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
