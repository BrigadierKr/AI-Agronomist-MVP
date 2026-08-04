export type Language = 'en' | 'uk' | 'ru';

export type BudgetLevel = 'low_input' | 'standard' | 'intensive';
export type TillageTech = 'conventional' | 'min_till' | 'no_till';

export interface FarmInputs {
  crop: string;
  region: string;
  predecessor: string;
  soilType: string;
  fieldArea: number; // ha
  targetYield: number; // t/ha
  organicMatter: number; // %
  budgetLevel: BudgetLevel;
  technology: TillageTech;
  language: Language;
}

export interface PhenologyStage {
  stageName: string;
  windowMonths: string;
  keyTasks: string[];
  fertilizerAction: string;
  protectionAction: string;
}

export interface ProtectionItem {
  stage: string;
  targetPestDiseaseWeed: string;
  activeIngredient: string;
  agronomicNote: string;
}

export interface RiskItem {
  riskName: string;
  level: 'low' | 'medium' | 'high' | string;
  mitigationStrategy: string;
}

export interface YieldFeasibility {
  scorePercent: number;
  rating: string;
  comment: string;
}

export interface DeterministicNPK {
  nKgHa: number;
  pKgHa: number;
  kKgHa: number;
  explanation: string;
}

export interface RecommendationData {
  executiveSummary: string;
  yieldFeasibility: YieldFeasibility;
  deterministicNPK: DeterministicNPK;
  phenologyStages: PhenologyStage[];
  protectionProtocol: ProtectionItem[];
  riskManagement: RiskItem[];
  rotationEvaluation: {
    phytosanitaryStatus: string;
    predecessorComment: string;
  };
  agronomicDisclaimer: string;
}

export interface RecommendationResponse {
  success: boolean;
  source: 'gemini_hybrid' | 'deterministic_fallback';
  data: RecommendationData;
  baseline: {
    fertilizer: any;
    fuel: any;
  };
}

export interface SavedProtocol {
  id: string;
  timestamp: string;
  inputs: FarmInputs;
  result: RecommendationResponse;
}
