import React from 'react';
import { ShieldCheck, FileCode, CheckCircle, Cpu, Users } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../i18n/translations';

interface AdrGovernanceModalProps {
  currentLang: Language;
}

export const AdrGovernanceModal: React.FC<AdrGovernanceModalProps> = ({ currentLang }) => {
  const t = getTranslation(currentLang);

  return (
    <div className="bg-[#0F0F11] border border-[#27272A] rounded-xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272A]">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#84A98C]" />
            <h2 className="text-xl font-serif italic text-[#F4F4F5]">{t.adrTitle}</h2>
          </div>
          <p className="text-xs text-[#71717A] font-sans mt-1">
            System Architecture & AI Governance Document ADR-0001
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1 rounded bg-[#1C2C1E] text-[#84A98C] border border-[#84A98C]/40 font-mono text-xs uppercase font-bold tracking-wider">
            {t.adrStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="bg-[#18181B] border border-[#27272A] p-4 rounded">
          <span className="text-[#52525B] font-semibold text-[10px] uppercase block mb-1">Decision ID</span>
          <span className="text-[#E4E4E7] text-sm font-bold">ADR-0001</span>
        </div>
        <div className="bg-[#18181B] border border-[#27272A] p-4 rounded">
          <span className="text-[#52525B] font-semibold text-[10px] uppercase block mb-1">Approval Date</span>
          <span className="text-[#E4E4E7] text-sm font-bold">2026-08-04</span>
        </div>
        <div className="bg-[#18181B] border border-[#27272A] p-4 rounded">
          <span className="text-[#52525B] font-semibold text-[10px] uppercase block mb-1">Participants</span>
          <span className="text-[#84A98C] font-sans text-xs">{t.adrParticipants}</span>
        </div>
      </div>

      {/* Decision Summary */}
      <div className="space-y-4 text-xs text-[#D4D4D8]">
        <div className="bg-[#18181B] border border-[#27272A] p-4 rounded">
          <h4 className="font-serif italic text-[#F4F4F5] text-sm mb-2 flex items-center">
            <Cpu className="w-4 h-4 mr-2 text-[#84A98C]" />
            1. Hybrid Architecture & Protection Against LLM Hallucinations
          </h4>
          <p className="leading-relaxed text-[#A1A1AA] italic">
            All heavy engineering calculations (fertilizer active substances NPK, seeding density, fuel balance, and equipment operations) are computed in a strictly deterministic domain layer. The Gemini API model interprets and contextualizes these baselines into structured agronomic protocols without hallucinating core numerical safety norms.
          </p>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] p-4 rounded">
          <h4 className="font-serif italic text-[#F4F4F5] text-sm mb-2 flex items-center">
            <FileCode className="w-4 h-4 mr-2 text-[#84A98C]" />
            2. Tri-lingual Internationalization Strategy (i18n: EN / UK / RU)
          </h4>
          <p className="leading-relaxed text-[#A1A1AA] italic">
            UI dictionaries are powered by localized translations. AI prompt instructions enforce strict language outputs across the recommendation schema to serve both global markets and local regional farmers.
          </p>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] p-4 rounded">
          <h4 className="font-serif italic text-[#F4F4F5] text-sm mb-2 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-[#84A98C]" />
            3. Scope Boundaries & Validation Protocol
          </h4>
          <p className="leading-relaxed text-[#A1A1AA] italic">
            MVP excludes complex GIS mapping, external payment gateways, and authentication to maximize fast execution. Zod schema validation guards all server parameters and environment variables.
          </p>
        </div>
      </div>
    </div>
  );
};
