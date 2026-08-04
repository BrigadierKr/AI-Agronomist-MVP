import React from 'react';
import { History, Trash2, ArrowRight, Calendar, MapPin } from 'lucide-react';
import { SavedProtocol, Language } from '../types';
import { getTranslation } from '../i18n/translations';

interface HistoryDrawerProps {
  protocols: SavedProtocol[];
  currentLang: Language;
  onSelect: (protocol: SavedProtocol) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  protocols,
  currentLang,
  onSelect,
  onDelete,
  onClear,
}) => {
  const t = getTranslation(currentLang);

  if (protocols.length === 0) {
    return (
      <div className="bg-[#0F0F11] border border-[#27272A] rounded-xl p-12 text-center">
        <History className="w-10 h-10 text-[#52525B] mx-auto mb-3" />
        <h3 className="text-base font-serif italic text-[#F4F4F5]">No Saved Reports Yet</h3>
        <p className="text-xs text-[#71717A] mt-1 font-sans">
          Generated agronomic reports saved to local history will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0F0F11] border border-[#27272A] rounded-xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#27272A]">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-[#84A98C]" />
          <h2 className="text-lg font-serif italic text-[#F4F4F5]">{t.tabHistory} ({protocols.length})</h2>
        </div>

        <button
          onClick={onClear}
          className="text-xs text-rose-400 hover:text-rose-300 font-mono flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {protocols.map((item) => (
          <div
            key={item.id}
            className="bg-[#18181B] border border-[#27272A] hover:border-[#84A98C] rounded p-4 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#71717A] mb-2 font-mono">
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1 text-[#84A98C]" />
                  {item.timestamp}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#0A0A0B] border border-[#27272A] font-mono uppercase text-[10px] text-[#84A98C]">
                  {item.inputs.crop}
                </span>
              </div>

              <h4 className="font-serif italic text-[#F4F4F5] text-sm mb-1">
                {item.inputs.targetYield} t/ha — {item.inputs.region}
              </h4>

              <div className="flex items-center text-xs text-[#A1A1AA] space-x-2 my-2 font-mono">
                <MapPin className="w-3 h-3 text-[#84A98C]" />
                <span>{item.inputs.fieldArea} ha ({item.inputs.technology})</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#27272A]">
              <button
                onClick={() => onDelete(item.id)}
                className="text-[#52525B] hover:text-rose-400 text-xs transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelect(item)}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded bg-[#1C2C1E] hover:bg-[#253A28] text-[#84A98C] font-mono text-xs border border-[#84A98C]/40 transition"
              >
                <span>View Protocol</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
