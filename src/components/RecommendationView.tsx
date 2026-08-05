import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Calendar,
  Shield,
  RotateCcw,
  Printer,
  Download,
  BookmarkPlus,
  Scale,
  Fuel,
  Droplet,
} from 'lucide-react';
import { RecommendationResponse, Language } from '../types';
import { getTranslation } from '../i18n/translations';

interface RecommendationViewProps {
  data: RecommendationResponse;
  currentLang: Language;
  onSave: () => void;
  isSaved?: boolean;
}

export const RecommendationView: React.FC<RecommendationViewProps> = ({
  data,
  currentLang,
  onSave,
  isSaved,
}) => {
  const t = getTranslation(currentLang);
  const rec = data.data;
  const baseline = data.baseline;

  const handleDownloadHtml = () => {
    const reportElement = document.getElementById('printable-report');
    if (!reportElement) return;

    const clone = reportElement.cloneNode(true) as HTMLElement;
    const hideable = clone.querySelectorAll('.print\\:hidden');
    hideable.forEach((el) => el.remove());

    const htmlContent = `<!DOCTYPE html>
<html lang="${currentLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agronomic_Protocol_AI_Agronomist_${new Date().toISOString().slice(0, 10)}</title>
  <style>
    @media print {
      body { background: #ffffff !important; color: #111111 !important; margin: 0; padding: 10mm; }
      .no-print { display: none !important; }
      #report-content * { background: transparent !important; color: #111 !important; border-color: #d1d5db !important; }
    }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #0f0f11;
      color: #e4e4e7;
      margin: 0;
      padding: 24px;
      line-height: 1.5;
    }
    .print-bar {
      background: #18181b;
      border: 1px solid #27272a;
      padding: 12px 20px;
      margin-bottom: 24px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .btn-print {
      background: #84a98c;
      color: #0a0a0b;
      border: none;
      padding: 8px 18px;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
      font-size: 14px;
    }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #27272a; padding: 8px 12px; text-align: left; font-size: 13px; }
    th { background: #18181b; color: #84a98c; }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <span style="font-size: 14px; font-weight: 600; color: #84a98c;">🌾 AI Agronomist — Precision Protocol Export</span>
    <button class="btn-print" onclick="window.print()">🖨️ ${t.exportPdf}</button>
  </div>
  <div id="report-content">
    ${clone.innerHTML}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Agronomic_Protocol_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (err) {
      console.warn("Direct window.print() blocked or unavailable, downloading HTML file fallback:", err);
      handleDownloadHtml();
    }
  };

  const score = rec.yieldFeasibility?.scorePercent || 85;
  let scoreColor = 'text-[#84A98C] bg-[#1C2C1E] border-[#84A98C]/40';
  if (score < 60) scoreColor = 'text-amber-400 bg-amber-950/40 border-amber-800/50';
  if (score < 40) scoreColor = 'text-rose-400 bg-rose-950/40 border-rose-800/50';

  return (
    <div id="printable-report" className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="bg-[#0F0F11] border border-[#27272A] rounded-xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:shadow-none print:border-slate-300">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded bg-[#18181B] border border-[#27272A] flex items-center justify-center text-[#84A98C]">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-serif italic text-[#F4F4F5]">{t.protocolHeader}</h2>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                  data.source === 'gemini_hybrid'
                    ? 'bg-[#1C2C1E] text-[#84A98C] border-[#84A98C]/40'
                    : 'bg-[#18181B] text-[#A1A1AA] border-[#27272A]'
                }`}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {data.source === 'gemini_hybrid' ? t.sourceGemini : t.sourceFallback}
              </span>
            </div>
            <p className="text-[11px] text-[#71717A] font-mono mt-0.5">
              ID: 0x48FA2 • Generated at {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Print & Download & Save Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 print:hidden">
          <button
            onClick={onSave}
            disabled={isSaved}
            className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded text-xs font-mono border transition ${
              isSaved
                ? 'bg-[#18181B] text-[#52525B] border-[#27272A]'
                : 'bg-[#18181B] hover:bg-[#27272A] text-[#84A98C] border-[#27272A]'
            }`}
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>{isSaved ? t.savedNotice : t.saveProtocol}</span>
          </button>

          <button
            onClick={handleDownloadHtml}
            title="Download formatted printable HTML file"
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded bg-[#18181B] hover:bg-[#27272A] text-[#E4E4E7] border border-[#27272A] font-mono text-xs transition"
          >
            <Download className="w-4 h-4 text-[#84A98C]" />
            <span>{t.downloadFile}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded bg-[#84A98C] hover:bg-[#A3C4AC] text-[#0A0A0B] font-bold text-xs uppercase tracking-wider transition shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>{t.exportPdf}</span>
          </button>
        </div>
      </div>

      {/* Yield Feasibility & Executive Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Feasibility Gauge */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#52525B] font-semibold block mb-2">
              {t.yieldFeasibility}
            </span>
            <div className="flex items-baseline space-x-3 my-2">
              <span className="text-4xl font-mono font-bold text-[#F4F4F5]">{score}%</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider border ${scoreColor}`}>
                {rec.yieldFeasibility?.rating || 'Achievable'}
              </span>
            </div>
          </div>
          <p className="text-xs text-[#A1A1AA] leading-relaxed italic mt-3 pt-3 border-t border-[#27272A]">
            {rec.yieldFeasibility?.comment}
          </p>
        </div>

        {/* Executive Summary */}
        <div className="md:col-span-2 bg-[#18181B] border border-[#27272A] rounded-xl p-5">
          <span className="text-[10px] uppercase tracking-[0.15em] text-[#52525B] font-semibold block mb-2">
            {t.execSummary}
          </span>
          <p className="text-sm text-[#D4D4D8] leading-relaxed italic">{rec.executiveSummary}</p>
        </div>
      </div>

      {/* Deterministic NPK Nutrient Balance */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
        <div className="flex items-center space-x-2 pb-4 border-b border-[#27272A]">
          <Scale className="w-4 h-4 text-[#84A98C]" />
          <h3 className="text-base font-serif italic text-[#F4F4F5]">{t.npkTitle}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
          <div className="bg-[#0A0A0B] border border-[#27272A] p-4 rounded text-center">
            <span className="text-[10px] uppercase tracking-widest text-[#52525B] block mb-1">{t.nitrogen}</span>
            <span className="text-2xl font-mono font-bold text-[#84A98C]">
              {rec.deterministicNPK?.nKgHa ?? baseline?.fertilizer?.nNeedKgHa ?? 0}{' '}
              <span className="text-xs text-[#71717A] font-sans font-normal">kg/ha</span>
            </span>
          </div>

          <div className="bg-[#0A0A0B] border border-[#27272A] p-4 rounded text-center">
            <span className="text-[10px] uppercase tracking-widest text-[#52525B] block mb-1">{t.phosphorus}</span>
            <span className="text-2xl font-mono font-bold text-[#84A98C]">
              {rec.deterministicNPK?.pKgHa ?? baseline?.fertilizer?.p2o5NeedKgHa ?? 0}{' '}
              <span className="text-xs text-[#71717A] font-sans font-normal">kg/ha</span>
            </span>
          </div>

          <div className="bg-[#0A0A0B] border border-[#27272A] p-4 rounded text-center">
            <span className="text-[10px] uppercase tracking-widest text-[#52525B] block mb-1">{t.potassium}</span>
            <span className="text-2xl font-mono font-bold text-[#84A98C]">
              {rec.deterministicNPK?.kKgHa ?? baseline?.fertilizer?.k2oNeedKgHa ?? 0}{' '}
              <span className="text-xs text-[#71717A] font-sans font-normal">kg/ha</span>
            </span>
          </div>
        </div>

        {/* Commercial Physical Products */}
        {baseline?.fertilizer?.suggestedProducts && (
          <div className="mt-4 pt-4 border-t border-[#27272A]">
            <h4 className="text-[10px] uppercase tracking-[0.15em] text-[#52525B] font-semibold mb-3">
              {t.suggestedCommercialProducts}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#0A0A0B] p-3 rounded border border-[#27272A] text-xs">
                <span className="text-[#71717A] text-[11px] block mb-0.5">{t.mapFert}</span>
                <span className="font-mono font-bold text-[#D4D4D8] text-sm">
                  {baseline.fertilizer.suggestedProducts.mapKgHa} kg/ha
                </span>
              </div>
              <div className="bg-[#0A0A0B] p-3 rounded border border-[#27272A] text-xs">
                <span className="text-[#71717A] text-[11px] block mb-0.5">{t.anFert}</span>
                <span className="font-mono font-bold text-[#D4D4D8] text-sm">
                  {baseline.fertilizer.suggestedProducts.ammoniumNitrateKgHa} kg/ha
                </span>
              </div>
              <div className="bg-[#0A0A0B] p-3 rounded border border-[#27272A] text-xs">
                <span className="text-[#71717A] text-[11px] block mb-0.5">{t.ureaFert}</span>
                <span className="font-mono font-bold text-[#D4D4D8] text-sm">
                  {baseline.fertilizer.suggestedProducts.ureaKgHa} kg/ha
                </span>
              </div>
              <div className="bg-[#0A0A0B] p-3 rounded border border-[#27272A] text-xs">
                <span className="text-[#71717A] text-[11px] block mb-0.5">{t.kclFert}</span>
                <span className="font-mono font-bold text-[#D4D4D8] text-sm">
                  {baseline.fertilizer.suggestedProducts.potassiumChlorideKgHa} kg/ha
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Fuel & Work Baseline */}
        {baseline?.fuel && (
          <div className="mt-4 pt-4 border-t border-[#27272A] flex flex-wrap items-center justify-between text-xs text-[#A1A1AA] gap-4 font-mono">
            <div className="flex items-center space-x-2">
              <Fuel className="w-4 h-4 text-[#84A98C]" />
              <span>
                <strong>Diesel Budget:</strong> {baseline.fuel.fuelLiterPerHa} L/ha ({baseline.fuel.totalFuelLiters} L total)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Droplet className="w-4 h-4 text-[#84A98C]" />
              <span>
                <strong>Est. Machine Hours:</strong> {baseline.fuel.estimatedMachineHours} hrs
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Phenology Operational Calendar */}
      {rec.phenologyStages && rec.phenologyStages.length > 0 && (
        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
          <div className="flex items-center space-x-2 pb-4 border-b border-[#27272A]">
            <Calendar className="w-4 h-4 text-[#84A98C]" />
            <h3 className="text-base font-serif italic text-[#F4F4F5]">{t.phenologyTitle}</h3>
          </div>

          <div className="mt-5 space-y-4">
            {rec.phenologyStages.map((stage, idx) => (
              <div key={idx} className="bg-[#0A0A0B] border border-[#27272A] rounded p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#27272A]">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded bg-[#18181B] text-[#84A98C] border border-[#27272A] flex items-center justify-center text-xs font-mono font-bold">
                      {idx + 1}
                    </span>
                    <h4 className="font-serif italic text-[#D4D4D8] text-sm">{stage.stageName}</h4>
                  </div>
                  <span className="text-xs font-mono text-[#84A98C] bg-[#1C2C1E] px-2.5 py-0.5 rounded border border-[#84A98C]/30">
                    🗓️ {stage.windowMonths}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs">
                  <div>
                    <span className="font-semibold text-[#71717A] uppercase text-[10px] tracking-wider block mb-1">🌱 Key Field Tasks:</span>
                    <ul className="list-disc list-inside space-y-1 text-[#D4D4D8]">
                      {stage.keyTasks?.map((task, tIdx) => (
                        <li key={tIdx}>{task}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-[#18181B] p-2.5 rounded border border-[#27272A]">
                      <span className="font-mono text-[#84A98C] text-[11px] block mb-0.5">🧪 Fertilizer Timing:</span>
                      <p className="text-[#D4D4D8]">{stage.fertilizerAction}</p>
                    </div>

                    <div className="bg-[#18181B] p-2.5 rounded border border-[#27272A]">
                      <span className="font-mono text-[#A1A1AA] text-[11px] block mb-0.5">🛡️ Plant Protection:</span>
                      <p className="text-[#D4D4D8]">{stage.protectionAction}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integrated Pest Protection (IPPM) */}
      {rec.protectionProtocol && rec.protectionProtocol.length > 0 && (
        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
          <div className="flex items-center space-x-2 pb-4 border-b border-[#27272A]">
            <Shield className="w-4 h-4 text-[#84A98C]" />
            <h3 className="text-base font-serif italic text-[#F4F4F5]">{t.protectionTitle}</h3>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#27272A] bg-[#0A0A0B] text-[#52525B] font-semibold text-[10px] uppercase tracking-wider">
                  <th className="p-3">Phase / Stage</th>
                  <th className="p-3">Target Pests / Diseases / Weeds</th>
                  <th className="p-3">Active Ingredients / Products</th>
                  <th className="p-3">Agronomic Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A] text-[#D4D4D8]">
                {rec.protectionProtocol.map((prot, idx) => (
                  <tr key={idx} className="hover:bg-[#0A0A0B]/50">
                    <td className="p-3 font-serif italic text-[#E4E4E7]">{prot.stage}</td>
                    <td className="p-3 text-[#A1A1AA]">{prot.targetPestDiseaseWeed}</td>
                    <td className="p-3 font-mono text-[#84A98C]">{prot.activeIngredient}</td>
                    <td className="p-3 text-[#71717A] text-[11px]">{prot.agronomicNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Risk Management & Rotation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risks */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
          <div className="flex items-center space-x-2 pb-4 border-b border-[#27272A]">
            <AlertTriangle className="w-4 h-4 text-[#84A98C]" />
            <h3 className="text-base font-serif italic text-[#F4F4F5]">{t.riskTitle}</h3>
          </div>

          <div className="mt-4 space-y-3">
            {rec.riskManagement?.map((risk, idx) => (
              <div key={idx} className="bg-[#0A0A0B] border border-[#27272A] p-3.5 rounded text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif italic text-[#E4E4E7] text-sm">{risk.riskName}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider ${
                      risk.level === 'high'
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                        : risk.level === 'medium'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                        : 'bg-[#1C2C1E] text-[#84A98C] border border-[#84A98C]/40'
                    }`}
                  >
                    {risk.level}
                  </span>
                </div>
                <p className="text-[#71717A] mt-1">{risk.mitigationStrategy}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rotation */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-4 border-b border-[#27272A]">
              <RotateCcw className="w-4 h-4 text-[#84A98C]" />
              <h3 className="text-base font-serif italic text-[#F4F4F5]">{t.rotationTitle}</h3>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="bg-[#0A0A0B] p-3.5 rounded border border-[#27272A]">
                <span className="text-[#52525B] uppercase text-[10px] tracking-wider font-semibold block mb-1">Phytosanitary Status:</span>
                <span className="text-[#84A98C] font-mono font-bold text-sm">
                  {rec.rotationEvaluation?.phytosanitaryStatus || 'Satisfactory'}
                </span>
              </div>

              <div className="bg-[#0A0A0B] p-3.5 rounded border border-[#27272A]">
                <span className="text-[#52525B] uppercase text-[10px] tracking-wider font-semibold block mb-1">Predecessor Evaluation:</span>
                <p className="text-[#D4D4D8] leading-relaxed italic">
                  {rec.rotationEvaluation?.predecessorComment}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Disclaimer Notice */}
      <div className="p-3 border-l-2 border-[#84A98C] bg-[#18181B] rounded text-xs flex items-start space-x-3">
        <CheckCircle2 className="w-4 h-4 text-[#84A98C] flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-serif italic text-[#E4E4E7] block mb-0.5">{t.disclaimerTitle}</span>
          <p className="text-[#A1A1AA] text-[11px] leading-normal italic">{rec.agronomicDisclaimer}</p>
        </div>
      </div>
    </div>
  );
};
