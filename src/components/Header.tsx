import React from 'react';
import { Sprout, Cpu, FileText, Calculator, ShieldCheck, History } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../i18n/translations';

interface HeaderProps {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  activeTab: 'generator' | 'calculators' | 'governance' | 'history';
  onSelectTab: (tab: 'generator' | 'calculators' | 'governance' | 'history') => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onSelectLang,
  activeTab,
  onSelectTab,
  savedCount,
}) => {
  const t = getTranslation(currentLang);

  return (
    <header className="bg-[#0F0F11] border-b border-[#27272A] text-[#E4E4E7] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded bg-[#84A98C] flex items-center justify-center text-[#0A0A0B] font-bold font-serif shadow-sm">
            <Sprout className="w-5 h-5 text-[#0A0A0B]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-serif italic tracking-tight text-[#D4D4D8]">
                {t.appTitle}
              </h1>
              <span className="font-mono text-xs text-[#71717A] not-italic px-2 py-0.5 rounded bg-[#18181B] border border-[#27272A]">
                v0.1.0-alpha
              </span>
            </div>
            <p className="text-[11px] text-[#71717A] font-medium tracking-wide">{t.appSubTitle}</p>
          </div>
        </div>

        {/* Tab Controls */}
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => onSelectTab('generator')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'generator'
                ? 'bg-[#18181B] text-[#84A98C] border border-[#27272A] shadow-sm'
                : 'text-[#71717A] hover:text-[#D4D4D8] hover:bg-[#18181B]/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.tabGenerator}</span>
          </button>

          <button
            onClick={() => onSelectTab('calculators')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'calculators'
                ? 'bg-[#18181B] text-[#84A98C] border border-[#27272A] shadow-sm'
                : 'text-[#71717A] hover:text-[#D4D4D8] hover:bg-[#18181B]/50'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{t.tabCalculators}</span>
          </button>

          <button
            onClick={() => onSelectTab('governance')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'governance'
                ? 'bg-[#18181B] text-[#84A98C] border border-[#27272A] shadow-sm'
                : 'text-[#71717A] hover:text-[#D4D4D8] hover:bg-[#18181B]/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.tabGovernance}</span>
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-[#18181B] text-[#84A98C] border border-[#27272A] shadow-sm'
                : 'text-[#71717A] hover:text-[#D4D4D8] hover:bg-[#18181B]/50'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{t.tabHistory}</span>
            {savedCount > 0 && (
              <span className="ml-1 bg-[#1C2C1E] text-[#84A98C] font-mono text-[10px] px-1.5 py-0.2 rounded border border-[#84A98C]/40">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Language selector & Server status */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#71717A]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
            Server: Active
          </div>

          <div className="flex items-center space-x-1 bg-[#18181B] p-1 rounded-md border border-[#27272A]">
            <button
              onClick={() => onSelectLang('en')}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-all ${
                currentLang === 'en'
                  ? 'bg-[#27272A] text-[#84A98C]'
                  : 'text-[#52525B] hover:text-[#D4D4D8]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onSelectLang('uk')}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-all ${
                currentLang === 'uk'
                  ? 'bg-[#27272A] text-[#84A98C]'
                  : 'text-[#52525B] hover:text-[#D4D4D8]'
              }`}
            >
              UK
            </button>
            <button
              onClick={() => onSelectLang('ru')}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-all ${
                currentLang === 'ru'
                  ? 'bg-[#27272A] text-[#84A98C]'
                  : 'text-[#52525B] hover:text-[#D4D4D8]'
              }`}
            >
              RU
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
