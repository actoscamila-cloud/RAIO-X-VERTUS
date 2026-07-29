export interface Lead {
  id?: string;
  userId?: string;
  companyName: string;
  responsibleName: string;
  whatsapp: string;
  email: string;
  location: string; // City / State
  monthlyRevenue: string;
  employeeCount: string;
  segment: string;
  createdAt: string | any;
  accessExpiresAt?: string;
  accessStatus?: "active" | "expired" | "suspended";
  accessDurationType?: string;
}

export interface DiagnosisResponse {
  id?: string;
  leadId: string;
  score: number;
  classification: "Crítica" | "Atenção" | "Saudável";
  dimensions: {
    fluxoCaixa: number;
    precificacao: number;
    controle: number;
    previsibilidade: number;
    custosRentabilidade: number;
    processos: number;
  };
  responses: Record<string, any>;
  monthlyLoss: number; // Estimated financial hemorrhage
  benchmark: number; // Better than X% of companies
  createdAt: string | any;
}

export interface Question {
  id: string;
  block: number;
  text: string;
  type: "select" | "scale" | "multiple";
  options?: { label: string; value: any }[];
  dimension: keyof DiagnosisResponse["dimensions"] | "none";
  weight: number;
}

export interface Block {
  id: number;
  title: string;
  insight: string;
}

export interface ActionMovement {
  id: string;
  title: string;
  description: string;
  objective?: string;
  steps?: string[];
  expectedResult?: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  content: string;
  example: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
  completed: boolean;
}

export interface AdminSettings {
  aiPrompt: string;
  financialContent: string;
  strategicGuidelines: string;
}

export interface VertusConfig {
  companyName: string;
  whatsappNumber: string;
  contactEmail?: string;
  consultantName?: string;
  consultantEmail?: string;
  whatsappMessageTemplate?: string;
  website?: string;
  enableGeminiAI?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  systemName?: string;
}

export interface CompanyInfo {
  name: string;
  segment: string;
  sector?: string;
  size: string;
  responsibleName: string;
  contactName?: string;
  email: string;
  phone: string;
  cnpj?: string;
  cityState?: string;
}

export interface QuantitativeData {
  monthlyRevenue: number;
  fixedCosts: number;
  variableCosts: number;
  totalDebt: number;
  cashReserve: number;
  accountsReceivable30d?: number;
  accountsPayable30d?: number;
}

export interface DiagnosticResult {
  overallScore: number;
  status: 'Crítico' | 'Atenção' | 'Saudável' | 'Excelente';
  pillarScores: Record<string, number>;
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  recommendations: {
    pillarTitle: string;
    action: string;
    priority: 'Alta' | 'Média' | 'Baixa';
  }[];
  calculatedMetrics: {
    grossMargin: number;
    netMargin: number;
    breakEvenPoint: number;
    runwayMonths: number;
    debtToRevenueRatio: number;
  };
}

export interface DiagnosticPillar {
  id: string;
  title: string;
  weight: number;
  description: string;
  iconName?: string;
}

export interface DiagnosticQuestion {
  id: string;
  pillarId: string;
  question: string;
  description?: string;
  options: { label: string; score?: number; value?: number; recommendation?: string }[];
}
