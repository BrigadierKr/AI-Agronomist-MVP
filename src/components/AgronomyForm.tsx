import React, { useState } from 'react';
import { Sparkles, Layers, Sliders, Globe, Wheat, MapPin, Zap } from 'lucide-react';
import { FarmInputs, Language, BudgetLevel, TillageTech } from '../types';
import { getTranslation } from '../i18n/translations';
import { CROP_PROFILES, SOIL_TYPES, PREDECESSOR_CROPS } from '../shared/agronomyCalculators';

interface AgronomyFormProps {
  currentLang: Language;
  onSubmit: (inputs: FarmInputs) => void;
  isLoading: boolean;
}

export const AgronomyForm: React.FC<AgronomyFormProps> = ({
  currentLang,
  onSubmit,
  isLoading,
}) => {
  const t = getTranslation(currentLang);

  const [inputs, setInputs] = useState<FarmInputs>({
    crop: 'wheat',
    region: 'Poltava / Central Forest-Steppe',
    predecessor: 'legumes',
    soilType: 'chernozem',
    fieldArea: 120,
    targetYield: 6.5,
    organicMatter: 3.4,
    budgetLevel: 'standard',
    technology: 'conventional',
    language: currentLang,
  });

  const handleInputChange = (field: keyof FarmInputs, value: any) => {
    setInputs((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto adjust target yield default if crop changes
      if (field === 'crop' && CROP_PROFILES[value]) {
        updated.targetYield = CROP_PROFILES[value].defaultYieldTarget;
      }
      return updated;
    });
  };

  const applyPreset = (presetType: 'wheat' | 'sunflower' | 'corn') => {
    if (presetType === 'wheat') {
      setInputs({
        crop: 'wheat',
        region: 'Poltava Region (Forest-Steppe)',
        predecessor: 'legumes',
        soilType: 'chernozem',
        fieldArea: 150,
        targetYield: 7.2,
        organicMatter: 3.8,
        budgetLevel: 'intensive',
        technology: 'conventional',
        language: currentLang,
      });
    } else if (presetType === 'sunflower') {
      setInputs({
        crop: 'sunflower',
        region: 'Steppe Zone (Dnipropetrovsk / Zaporizhzhia)',
        predecessor: 'winter_wheat',
        soilType: 'sandy_loam',
        fieldArea: 200,
        targetYield: 3.4,
        organicMatter: 2.8,
        budgetLevel: 'standard',
        technology: 'no_till',
        language: currentLang,
      });
    } else {
      setInputs({
        crop: 'corn',
        region: 'Vinnytsia / Central Chernozem',
        predecessor: 'rapeseed',
        soilType: 'chernozem',
        fieldArea: 180,
        targetYield: 10.5,
        organicMatter: 3.6,
        budgetLevel: 'intensive',
        technology: 'min_till',
        language: currentLang,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...inputs, language: currentLang });
  };

  return (
    <div className="bg-[#0F0F11] border border-[#27272A] rounded-xl p-6 shadow-xl print:hidden">
      {/* Header and presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#27272A]">
        <div>
          <h2 className="text-xl font-serif italic text-[#F4F4F5] flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-[#84A98C]" />
            <span>{t.farmParameters}</span>
          </h2>
          <p className="text-xs text-[#71717A] mt-1 font-sans">
            MVP: Гібридний аналіз детермінованих моделей та LLM-інтерпретації.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-[#52525B] font-semibold flex items-center mr-1">
            <Zap className="w-3.5 h-3.5 text-[#84A98C] mr-1" />
            {t.presetLabel}
          </span>
          <button
            type="button"
            onClick={() => applyPreset('wheat')}
            className="text-xs px-3 py-1 bg-[#18181B] hover:bg-[#27272A] text-[#D4D4D8] font-mono rounded border border-[#27272A] transition hover:border-[#84A98C]"
          >
            🌾 {t.presetWheat}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('sunflower')}
            className="text-xs px-3 py-1 bg-[#18181B] hover:bg-[#27272A] text-[#D4D4D8] font-mono rounded border border-[#27272A] transition hover:border-[#84A98C]"
          >
            🌻 {t.presetSunflower}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('corn')}
            className="text-xs px-3 py-1 bg-[#18181B] hover:bg-[#27272A] text-[#D4D4D8] font-mono rounded border border-[#27272A] transition hover:border-[#84A98C]"
          >
            🌽 {t.presetCorn}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Target Crop */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase tracking-widest text-[#52525B] font-semibold">
              <Wheat className="w-3.5 h-3.5 inline mr-1 text-[#84A98C]" />
              {t.crop}
            </label>
            <select
              value={inputs.crop}
              onChange={(e) => handleInputChange('crop', e.target.value)}
              className="w-full bg-[#18181B] border border-[#27272A] rounded px-4 py-2.5 text-sm text-[#E4E4E7] outline-none focus:border-[#84A98C] transition"
            >
              {Object.entries(CROP_PROFILES).map(([key, crop]) => (
                <option key={key} value={key} className="bg-[#18181B] text-[#E4E4E7]">
                  {crop.names[currentLang] || crop.names.en}
                </option>
              ))}
            </select>
          </div>

          {/* Region */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase tracking-widest text-[#52525B] font-semibold">
              <MapPin className="w-3.5 h-3.5 inline mr-1 text-[#84A98C]" />
              {t.region}
            </label>
            <input
              type="text"
              value={inputs.region}
              onChange={(e) => handleInputChange('region', e.target.value)}
              placeholder="e.g. Poltava / Central Forest-Steppe"
              className="w-full bg-[#18181B] border border-[#27272A] rounded px-4 py-2.5 text-sm text-[#E4E4E7] outline-none focus:border-[#84A98C] transition"
            />
          </div>

          {/* Predecessor */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase tracking-widest text-[#52525B] font-semibold">
              {t.predecessor}
            </label>
            <select
              value={inputs.predecessor}
              onChange={(e) => handleInputChange('predecessor', e.target.value)}
              className="w-full bg-[#18181B] border border-[#27272A] rounded px-4 py-2.5 text-sm text-[#E4E4E7] outline-none focus:border-[#84A98C] transition"
            >
              {Object.entries(PREDECESSOR_CROPS).map(([key, pred]) => (
                <option key={key} value={key} className="bg-[#18181B] text-[#E4E4E7]">
                  {pred.names[currentLang] || pred.names.en}
                </option>
              ))}
            </select>
          </div>

          {/* Soil Type */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase tracking-widest text-[#52525B] font-semibold">
              {t.soilType}
            </label>
            <select
              value={inputs.soilType}
              onChange={(e) => handleInputChange('soilType', e.target.value)}
              className="w-full bg-[#18181B] border border-[#27272A] rounded px-4 py-2.5 text-sm text-[#E4E4E7] outline-none focus:border-[#84A98C] transition"
            >
              {Object.entries(SOIL_TYPES).map(([key, soil]) => (
                <option key={key} value={key} className="bg-[#18181B] text-[#E4E4E7]">
                  {soil.names[currentLang] || soil.names.en}
                </option>
              ))}
            </select>
          </div>

          {/* Organic Matter % */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase tracking-widest text-[#52525B] font-semibold">
              {t.organicMatter}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="12"
                value={inputs.organicMatter}
                onChange={(e) => handleInputChange('organicMatter', parseFloat(e.target.value) || 3.0)}
                className="w-full bg-[#18181B] border border-[#27272A] rounded px-4 py-2.5 text-sm text-[#E4E4E7] font-mono outline-none focus:border-[#84A98C] transition"
              />
              <span className="absolute right-4 top-2.5 text-xs font-mono text-[#52525B]">%</span>
            </div>
          </div>

          {/* Field Area ha */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase tracking-widest text-[#52525B] font-semibold">
              {t.fieldArea}
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="10000"
                value={inputs.fieldArea}
                onChange={(e) => handleInputChange('fieldArea', parseFloat(e.target.value) || 100)}
                className="w-full bg-[#18181B] border border-[#27272A] rounded px-4 py-2.5 text-sm text-[#E4E4E7] font-mono outline-none focus:border-[#84A98C] transition"
              />
              <span className="absolute right-4 top-2.5 text-xs font-mono text-[#52525B]">ha</span>
            </div>
          </div>

          {/* Target Yield t/ha */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase tracking-widest text-[#52525B] font-semibold">
              {t.targetYield}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="1"
                max="20"
                value={inputs.targetYield}
                onChange={(e) => handleInputChange('targetYield', parseFloat(e.target.value) || 5.0)}
                className="w-full bg-[#18181B] border border-[#27272A] rounded px-4 py-2.5 text-sm text-[#84A98C] font-mono font-bold outline-none focus:border-[#84A98C] transition"
              />
              <span className="absolute right-4 top-2.5 text-xs font-mono text-[#52525B]">т/га</span>
            </div>
          </div>

          {/* Tillage Technology */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase tracking-widest text-[#52525B] font-semibold">
              <Layers className="w-3.5 h-3.5 inline mr-1 text-[#84A98C]" />
              {t.tillageTechnology}
            </label>
            <select
              value={inputs.technology}
              onChange={(e) => handleInputChange('technology', e.target.value as TillageTech)}
              className="w-full bg-[#18181B] border border-[#27272A] rounded px-4 py-2.5 text-sm text-[#E4E4E7] outline-none focus:border-[#84A98C] transition"
            >
              <option value="conventional" className="bg-[#18181B]">{t.conventional}</option>
              <option value="min_till" className="bg-[#18181B]">{t.min_till}</option>
              <option value="no_till" className="bg-[#18181B]">{t.no_till}</option>
            </select>
          </div>

          {/* Budget Level */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase tracking-widest text-[#52525B] font-semibold">
              {t.budgetLevel}
            </label>
            <select
              value={inputs.budgetLevel}
              onChange={(e) => handleInputChange('budgetLevel', e.target.value as BudgetLevel)}
              className="w-full bg-[#18181B] border border-[#27272A] rounded px-4 py-2.5 text-sm text-[#E4E4E7] outline-none focus:border-[#84A98C] transition"
            >
              <option value="low_input" className="bg-[#18181B]">{t.low_input}</option>
              <option value="standard" className="bg-[#18181B]">{t.standard}</option>
              <option value="intensive" className="bg-[#18181B]">{t.intensive}</option>
            </select>
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-4 border-t border-[#27272A] flex items-center justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#84A98C] text-[#0A0A0B] px-8 py-3 rounded font-bold text-xs uppercase tracking-widest hover:bg-[#A3C4AC] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? t.generating : t.generateBtn}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
