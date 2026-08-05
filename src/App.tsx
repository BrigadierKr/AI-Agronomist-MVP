/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AgronomyForm } from './components/AgronomyForm';
import { RecommendationView } from './components/RecommendationView';
import { CalculatorsTab } from './components/CalculatorsTab';
import { AdrGovernanceModal } from './components/AdrGovernanceModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { Language, FarmInputs, RecommendationResponse, SavedProtocol } from './types';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('uk');
  const [activeTab, setActiveTab] = useState<'generator' | 'calculators' | 'governance' | 'history'>('generator');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [currentInputs, setCurrentInputs] = useState<FarmInputs | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedProtocols, setSavedProtocols] = useState<SavedProtocol[]>([]);
  const [isCurrentSaved, setIsCurrentSaved] = useState(false);

  // Load saved protocols from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ai_agronomist_history');
      if (stored) {
        setSavedProtocols(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse history from localStorage', e);
    }
  }, []);

  const handleGenerate = async (inputs: FarmInputs) => {
    setIsLoading(true);
    setError(null);
    setCurrentInputs(inputs);
    setIsCurrentSaved(false);

    try {
      const res = await fetch('/api/agronomy/recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to generate recommendation');
      }

      const data: RecommendationResponse = await res.json();
      setRecommendation(data);
    } catch (err: any) {
      console.error('Recommendation API error:', err);
      setError(err.message || 'An error occurred while generating the report.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProtocol = () => {
    if (!recommendation || !currentInputs) return;

    const newProtocol: SavedProtocol = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      inputs: currentInputs,
      result: recommendation,
    };

    const updated = [newProtocol, ...savedProtocols];
    setSavedProtocols(updated);
    setIsCurrentSaved(true);
    try {
      localStorage.setItem('ai_agronomist_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save protocol to localStorage', e);
    }
  };

  const handleDeleteSaved = (id: string) => {
    const updated = savedProtocols.filter((p) => p.id !== id);
    setSavedProtocols(updated);
    try {
      localStorage.setItem('ai_agronomist_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update localStorage', e);
    }
  };

  const handleClearHistory = () => {
    setSavedProtocols([]);
    localStorage.removeItem('ai_agronomist_history');
  };

  const handleSelectHistoryItem = (item: SavedProtocol) => {
    setRecommendation(item.result);
    setCurrentInputs(item.inputs);
    setActiveTab('generator');
    setIsCurrentSaved(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Header
        currentLang={currentLang}
        onSelectLang={(lang) => {
          setCurrentLang(lang);
        }}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedCount={savedProtocols.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {activeTab === 'generator' && (
          <>
            <AgronomyForm
              currentLang={currentLang}
              onSubmit={handleGenerate}
              isLoading={isLoading}
            />

            {error && (
              <div className="bg-rose-950/80 border border-rose-800 rounded-2xl p-4 text-rose-200 text-xs flex items-center space-x-3 print:hidden">
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <div>
                  <span className="font-bold block mb-0.5">Calculation Error</span>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {recommendation && (
              <RecommendationView
                data={recommendation}
                currentLang={currentLang}
                onSave={handleSaveProtocol}
                isSaved={isCurrentSaved}
              />
            )}
          </>
        )}

        {activeTab === 'calculators' && <CalculatorsTab currentLang={currentLang} />}

        {activeTab === 'governance' && <AdrGovernanceModal currentLang={currentLang} />}

        {activeTab === 'history' && (
          <HistoryDrawer
            protocols={savedProtocols}
            currentLang={currentLang}
            onSelect={handleSelectHistoryItem}
            onDelete={handleDeleteSaved}
            onClear={handleClearHistory}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 text-slate-500 text-xs py-6 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 AI Agronomist MVP. Built with Gemini AI + Deterministic Agro Engine.</p>
          <div className="flex items-center space-x-4 text-slate-400 font-medium">
            <span>i18n: EN / UK / RU</span>
            <span>•</span>
            <span>ADR-0001 Accepted</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
