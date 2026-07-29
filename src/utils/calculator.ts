import { CompanyInfo, QuantitativeData, DiagnosticResult } from '../types';
import { DIAGNOSTIC_PILLARS, DIAGNOSTIC_QUESTIONS } from '../data/defaultDiagnostic';

export function calculateDiagnosticResult(
  company: CompanyInfo,
  quant: QuantitativeData,
  answers: Record<string, number> // questionId -> score (0-10)
): DiagnosticResult {
  // 1. Calculate score per pillar
  const pillarScores: Record<string, number> = {};

  DIAGNOSTIC_PILLARS.forEach((pillar) => {
    const pillarQuestions = DIAGNOSTIC_QUESTIONS.filter((q) => q.pillarId === pillar.id);
    if (pillarQuestions.length === 0) {
      pillarScores[pillar.id] = 50;
      return;
    }

    let sum = 0;
    let count = 0;
    pillarQuestions.forEach((q) => {
      const selectedValue = answers[q.id];
      if (selectedValue !== undefined) {
        sum += selectedValue;
        count++;
      }
    });

    // Score in percentage (0 - 100%)
    const average = count > 0 ? (sum / (count * 10)) * 100 : 50;
    pillarScores[pillar.id] = Math.round(average);
  });

  // 2. Calculate Overall Score weighted
  let overallSum = 0;
  let totalWeight = 0;

  DIAGNOSTIC_PILLARS.forEach((p) => {
    const score = pillarScores[p.id] ?? 50;
    overallSum += score * p.weight;
    totalWeight += p.weight;
  });

  const overallScore = Math.round(overallSum / (totalWeight || 1));

  // Determine Status
  let status: DiagnosticResult['status'] = 'Atenção';
  if (overallScore < 40) status = 'Crítico';
  else if (overallScore < 65) status = 'Atenção';
  else if (overallScore < 85) status = 'Saudável';
  else status = 'Excelente';

  // 3. Calculate Quantitative Financial Metrics
  const revenue = quant.monthlyRevenue || 1; // avoid divide by zero
  const grossProfit = revenue - quant.variableCosts;
  const grossMargin = Math.round((grossProfit / revenue) * 100);
  const netProfit = grossProfit - quant.fixedCosts;
  const netMargin = Math.round((netProfit / revenue) * 100);

  // Contribution Margin ratio
  const contributionMarginRatio = grossProfit / revenue;
  const breakEvenPoint = contributionMarginRatio > 0 ? Math.round(quant.fixedCosts / contributionMarginRatio) : 0;

  // Runway in months based on cash reserve and net burn
  const monthlyBurnRate = netProfit < 0 ? Math.abs(netProfit) : 0;
  const runwayMonths = monthlyBurnRate > 0 ? Number((quant.cashReserve / monthlyBurnRate).toFixed(1)) : 12;

  const debtToRevenueRatio = Math.round((quant.totalDebt / (revenue * 12)) * 100);

  // 4. Generate SWOT Analysis
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const opportunities: string[] = [];
  const threats: string[] = [];

  if (grossMargin >= 40) strengths.push(`Margem Bruta forte de ${grossMargin}% no modelo de negócio.`);
  else weaknesses.push(`Margem Bruta comprimida (${grossMargin}%). Revisar precificação ou custos variáveis.`);

  if (runwayMonths >= 3) strengths.push(`Caixa de emergência satisfatório (${runwayMonths} meses de fôlego).`);
  else threats.push(`Reserva de caixa reduzida (${runwayMonths} meses). Risco em flutuações de demanda.`);

  if (debtToRevenueRatio > 30) threats.push(`Nível de endividamento elevado (${debtToRevenueRatio}% do faturamento anual).`);
  else strengths.push(`Endividamento sob controle (${debtToRevenueRatio}% da receita anual).`);

  if (pillarScores['orcamento'] < 50) opportunities.push('Estruturar Orçamento Anual e controle Previsto x Realizado para dar previsibilidade.');
  if (pillarScores['governanca'] < 50) opportunities.push('Profissionalizar governança com separação total de contas físicas e jurídicas.');

  if (strengths.length === 0) strengths.push('Comprometimento da liderança em realizar o diagnóstico financeiro.');
  if (opportunities.length === 0) opportunities.push('Expansão de margens através de otimização tributária e de custos fixos.');

  // 5. Recommendations
  const recommendations: DiagnosticResult['recommendations'] = [];

  DIAGNOSTIC_PILLARS.forEach((p) => {
    const score = pillarScores[p.id] ?? 50;
    if (score < 50) {
      recommendations.push({
        pillarTitle: p.title,
        action: `Plano de Intervenção para ${p.title}: Mapear gargalos imediatos e implantar rotina de controle semanal.`,
        priority: 'Alta',
      });
    } else if (score < 75) {
      recommendations.push({
        pillarTitle: p.title,
        action: `Melhoria Contínua em ${p.title}: Automatizar processos e definir indicadores de acompanhamento (KPIs).`,
        priority: 'Média',
      });
    }
  });

  if (recommendations.length === 0) {
    recommendations.push({
      pillarTitle: 'Estratégia e Expansão',
      action: 'Manter a excelência operacional e avaliar novos investimentos com retorno sobre capital (ROIC).',
      priority: 'Baixa',
    });
  }

  return {
    overallScore,
    status,
    pillarScores,
    swotAnalysis: {
      strengths,
      weaknesses,
      opportunities,
      threats,
    },
    recommendations,
    calculatedMetrics: {
      grossMargin,
      netMargin,
      breakEvenPoint,
      runwayMonths,
      debtToRevenueRatio,
    },
  };
}
