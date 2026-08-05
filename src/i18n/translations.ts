import { Language } from '../types';

export const translations = {
  en: {
    appTitle: 'AI Agronomist',
    appSubTitle: 'Hybrid Precision Agronomy Engine & Calculators',
    badgeHybrid: 'Hybrid AI + Deterministic Model',
    tabGenerator: 'Protocol Generator',
    tabCalculators: 'Standalone Calculators',
    tabGovernance: 'ADR-0001 Governance',
    tabHistory: 'Saved Reports',
    
    // Form
    farmParameters: 'Farm & Field Parameters',
    presetLabel: 'Quick Presets:',
    presetWheat: 'Poltava Winter Wheat (High Yield)',
    presetSunflower: 'Steppe Sunflower (No-Till)',
    presetCorn: 'Central Corn (Intensive)',
    crop: 'Target Crop',
    region: 'Region / Microclimate Zone',
    predecessor: 'Predecessor Crop',
    soilType: 'Soil Type',
    organicMatter: 'Soil Organic Matter (%)',
    fieldArea: 'Field Area (hectares)',
    targetYield: 'Target Yield (t/ha)',
    tillageTechnology: 'Tillage Technology',
    budgetLevel: 'Budget & Input Level',
    outputLanguage: 'AI Protocol Language',
    generateBtn: 'Generate Precision Agronomic Protocol',
    generating: 'Calculating Agronomic Model...',
    
    // Tillage options
    conventional: 'Conventional (Plowing)',
    min_till: 'Minimum Tillage (Mini-Till)',
    no_till: 'Direct Seeding (No-Till)',

    // Budget options
    low_input: 'Low-Input / Economic',
    standard: 'Standard Balanced',
    intensive: 'Intensive High-Yield',

    // Results
    protocolHeader: 'Agronomic Protocol & Recommendations',
    sourceGemini: 'Powered by Gemini AI + Engineering Engine',
    sourceFallback: 'Deterministic Engineering Engine',
    yieldFeasibility: 'Yield Feasibility Index',
    feasibilityScore: 'Feasibility Score',
    execSummary: 'Executive Agronomic Strategy',
    npkTitle: 'Deterministic NPK Active Nutrient Balance',
    nitrogen: 'Nitrogen (N)',
    phosphorus: 'Phosphorus (P₂O₅)',
    potassium: 'Potassium (K₂O)',
    suggestedCommercialProducts: 'Commercial Product Norm Estimates',
    mapFert: 'MAP (12-52-0)',
    anFert: 'Ammonium Nitrate (34.4% N)',
    ureaFert: 'Urea (46% N)',
    kclFert: 'Potassium Chloride (60% K₂O)',
    phenologyTitle: 'Phenology & Operational Calendar',
    protectionTitle: 'Integrated Pest & Disease Protection (IPPM)',
    riskTitle: 'Risk Management & Soil Conservation',
    rotationTitle: 'Crop Rotation & Phytosanitary Assessment',
    disclaimerTitle: 'Agronomic Disclaimer',
    exportPdf: 'Print / Export Report',
    downloadFile: 'Download (.html / PDF)',
    saveProtocol: 'Save to History',
    savedNotice: 'Protocol saved to local history!',

    // Calculators
    calcFertTitle: 'NPK Fertilizer Demand Calculator',
    calcSeedTitle: 'Seeding Norm Calculator',
    calcFuelTitle: 'Fuel & Machinery Work Estimator',
    calcEconTitle: 'Gross Margin & ROI Predictor',
    calculateNow: 'Calculate Now',

    // Governance
    adrTitle: 'ADR-0001 Decision Record',
    adrStatus: 'Status: Accepted',
    adrParticipants: 'Participants: Human Founder & AI Council',
  },
  uk: {
    appTitle: 'AI Агроном',
    appSubTitle: 'Гібридна система точного землеробства та агрокалькулятори',
    badgeHybrid: 'Гібридна модель: ШІ + Детерміновані розрахунки',
    tabGenerator: 'Генератор протоколу',
    tabCalculators: 'Агрокалькулятори',
    tabGovernance: 'Управління ADR-0001',
    tabHistory: 'Збережені звіти',

    // Form
    farmParameters: 'Параметри поля та культури',
    presetLabel: 'Швидкі пресети:',
    presetWheat: 'Полтавська пшениця озима (Висока врожайність)',
    presetSunflower: 'Степовий соняшник (No-Till)',
    presetCorn: 'Центральна кукурудза (Інтенсив)',
    crop: 'Цільова культура',
    region: 'Регіон / Мікрокліматична зона',
    predecessor: 'Попередник у сівозміні',
    soilType: 'Тип ґрунту',
    organicMatter: 'Вміст гумусу (%)',
    fieldArea: 'Площа поля (гектарів)',
    targetYield: 'Цільова врожайність (т/га)',
    tillageTechnology: 'Технологія обробітку ґрунту',
    budgetLevel: 'Рівень інвестицій та бюджету',
    outputLanguage: 'Мова AI-протоколу',
    generateBtn: 'Згенерувати агрономічний протокол',
    generating: 'Розрахунок агрономічної моделі...',

    // Tillage options
    conventional: 'Традиційний (Оранка)',
    min_till: 'Мінімальний (Mini-Till)',
    no_till: 'Прямий посів (No-Till)',

    // Budget options
    low_input: 'Економний / Низьковитратний',
    standard: 'Стандартний збалансований',
    intensive: 'Інтенсивний високоврожайний',

    // Results
    protocolHeader: 'Агрономічний протокол та рекомендації',
    sourceGemini: 'Працює на Gemini AI + Інженерний шар',
    sourceFallback: 'Детермінований інженерний шар',
    yieldFeasibility: 'Індекс реалістичності врожаю',
    feasibilityScore: 'Оцінка реалістичності',
    execSummary: 'Стратегічне резюме агронома',
    npkTitle: 'Детермінований баланс NPK у діючій речовині',
    nitrogen: 'Азот (N)',
    phosphorus: 'Фосфор (P₂O₅)',
    potassium: 'Калій (K₂O)',
    suggestedCommercialProducts: 'Орієнтовні норми комерційних добрив',
    mapFert: 'МАФ / MAP (12-52-0)',
    anFert: 'Аміачна селітра (34.4% N)',
    ureaFert: 'Карбамід (46% N)',
    kclFert: 'Калій хлористий (60% K₂O)',
    phenologyTitle: 'Фенологічний календар та технологічні операції',
    protectionTitle: 'Інтегрована система захисту рослин (ІСЗР)',
    riskTitle: 'Управління ризиками та збереження ґрунту',
    rotationTitle: 'Оцінка сівозміни та фітосанітарного стану',
    disclaimerTitle: 'Застереження агронома',
    exportPdf: 'Друк / Експорт звіту',
    downloadFile: 'Завантажити файл (.html / PDF)',
    saveProtocol: 'Зберегти в історію',
    savedNotice: 'Протокол збережено в локальну історію!',

    // Calculators
    calcFertTitle: 'Калькулятор потреби в добривах NPK',
    calcSeedTitle: 'Калькулятор норми висіву насіння',
    calcFuelTitle: 'Оцінка витрати пального та мотогодин',
    calcEconTitle: 'Прогноз маржинальності та ROI',
    calculateNow: 'Розрахувати зараз',

    // Governance
    adrTitle: 'Документ рішень ADR-0001',
    adrStatus: 'Статус: Прийнято (Accepted)',
    adrParticipants: 'Учасники: Засновник (Human) та Рада ШІ',
  },
  ru: {
    appTitle: 'AI Агроном',
    appSubTitle: 'Гибридная система точного земледелия и агрокалькуляторы',
    badgeHybrid: 'Гибридная модель: ИИ + Детерминированные расчёты',
    tabGenerator: 'Генератор протокола',
    tabCalculators: 'Агрокалькуляторы',
    tabGovernance: 'Управление ADR-0001',
    tabHistory: 'Сохранённые отчёты',

    // Form
    farmParameters: 'Параметры поля и культуры',
    presetLabel: 'Быстрые пресеты:',
    presetWheat: 'Полтавская озимая пшеница (Высокая урожайность)',
    presetSunflower: 'Степной подсолнечник (No-Till)',
    presetCorn: 'Центральная кукуруза (Интенсив)',
    crop: 'Целевая культура',
    region: 'Регион / Микроклиматическая зона',
    predecessor: 'Предшественник в севообороте',
    soilType: 'Тип почвы',
    organicMatter: 'Содержание гумуса (%)',
    fieldArea: 'Площадь поля (гектров)',
    targetYield: 'Целевая урожайность (т/га)',
    tillageTechnology: 'Технология обработки почвы',
    budgetLevel: 'Уровень инвестиций и бюджета',
    outputLanguage: 'Язык AI-протокола',
    generateBtn: 'Сгенерировать агрономический протокол',
    generating: 'Расчёт агрономической модели...',

    // Tillage options
    conventional: 'Традиционный (Вспашка)',
    min_till: 'Минимальный (Mini-Till)',
    no_till: 'Прямой посев (No-Till)',

    // Budget options
    low_input: 'Экономный / Низкозатратный',
    standard: 'Стандартный balanced',
    intensive: 'Интенсивный высокоурожайный',

    // Results
    protocolHeader: 'Агрономический протокол и рекомендации',
    sourceGemini: 'Работает на Gemini AI + Инженерный слой',
    sourceFallback: 'Детерминированный инженерный слой',
    yieldFeasibility: 'Индекс реалистичности урожая',
    feasibilityScore: 'Оценка реалистичности',
    execSummary: 'Стратегическое резюме агронома',
    npkTitle: 'Детерминированный баланс NPK в действующем веществе',
    nitrogen: 'Азот (N)',
    phosphorus: 'Фосфор (P₂O₅)',
    potassium: 'Калий (K₂O)',
    suggestedCommercialProducts: 'Ориентировочные нормы коммерческих удобрений',
    mapFert: 'МАФ / MAP (12-52-0)',
    anFert: 'Аммиачная селитра (34.4% N)',
    ureaFert: 'Карбамид (46% N)',
    kclFert: 'Калий хлористый (60% K₂O)',
    phenologyTitle: 'Фенологический календарь и технологические операции',
    protectionTitle: 'Интегрированная система защиты растений (ИСЗР)',
    riskTitle: 'Управление рисками и сохранение почвы',
    rotationTitle: 'Оценка севооборота и фитосанитарного состояния',
    disclaimerTitle: 'Предостережение агронома',
    exportPdf: 'Печать / Экспорт отчёта',
    downloadFile: 'Скачать файл (.html / PDF)',
    saveProtocol: 'Сохранить в историю',
    savedNotice: 'Протокол сохранён в локальную историю!',

    // Calculators
    calcFertTitle: 'Калькулятор потребности в удобрениях NPK',
    calcSeedTitle: 'Калькулятор нормы высева семян',
    calcFuelTitle: 'Оценка расхода топлива и моточасов',
    calcEconTitle: 'Прогноз маржинальности и ROI',
    calculateNow: 'Рассчитать сейчас',

    // Governance
    adrTitle: 'Документ решений ADR-0001',
    adrStatus: 'Статус: Принято (Accepted)',
    adrParticipants: 'Участники: Основатель (Human) и Совет ИИ',
  },
};

export function getTranslation(lang: Language) {
  return translations[lang] || translations.en;
}
