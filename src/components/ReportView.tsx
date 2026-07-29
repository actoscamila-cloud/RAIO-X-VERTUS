import React, { useState } from 'react';
import { CompanyInfo, QuantitativeData, DiagnosticResult, VertusConfig } from '../types';
import { DIAGNOSTIC_PILLARS } from '../data/defaultDiagnostic';
import { MessageSquare, Printer, CheckCircle, AlertTriangle, XCircle, Award, Sparkles, Building2, TrendingUp, ShieldAlert, ArrowUpRight, DollarSign, PieChart } from 'lucide-react';

interface ReportViewProps {
  company: CompanyInfo;
  quant: QuantitativeData;
  result: DiagnosticResult;
  config: VertusConfig;
  onEditData: () => void;
  onEditQuestions: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  company,
  quant,
  result,
  config,
  onEditData,
  onEditQuestions,
}) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const getStatusBadge = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'Excelente':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Excelente</span>;
      case 'Saudável':
        return <span className="bg-teal-100 text-teal-800 border border-teal-300 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Saudável</span>;
      case 'Atenção':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Atenção Necessária</span>;
      case 'Crítico':
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" /> Risco Crítico</span>;
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleWhatsAppShare = () => {
    let cleanPhone = config.whatsappNumber.replace(/\D/g, '');
    if (!cleanPhone.startsWith('55') && cleanPhone.length <= 11) {
      cleanPhone = '55' + cleanPhone;
    }

    const message = config.whatsappMessageTemplate
      .replace('{company_name}', company.name || 'minha empresa')
      .replace('{score}', String(result.overallScore))
      .replace('{status}', result.status);

    const encodedMessage = encodeURIComponent(
      `*Diagnóstico Financeiro Empresarial - ${config.companyName}*\n\n` +
      `🏢 *Empresa:* ${company.name || 'Não informada'}\n` +
      `📊 *Score Vertus:* ${result.overallScore}% (${result.status})\n` +
      `💰 *Faturamento Mensal:* ${formatCurrency(quant.monthlyRevenue)}\n` +
      `📈 *Margem Bruta:* ${result.calculatedMetrics.grossMargin}%\n` +
      `⚖️ *Ponto de Equilíbrio:* ${formatCurrency(result.calculatedMetrics.breakEvenPoint)}\n` +
      `🛡️ *Fôlego de Caixa (Runway):* ${result.calculatedMetrics.runwayMonths} meses\n\n` +
      `${message}`
    );

    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
  };

  const handleGenerateAiInsight = async () => {
    setLoadingAi(true);
    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, quant, result }),
      });
      if (response.ok) {
        const data = await response.json();
        setAiInsight(data.analysis);
      } else {
        setAiInsight(
          `Análise Estratégica Vertus para ${company.name || 'sua empresa'}:\n\n` +
          `1. Destaque Operacional: Sua margem bruta está em ${result.calculatedMetrics.grossMargin}%. Recomenda-se focar na eliminação de desperdícios em despesas variáveis.\n` +
          `2. Gestão de Caixa: Com ${result.calculatedMetrics.runwayMonths} meses de fôlego financeiro, a prioridade é formar uma reserva de emergência equivalente a no mínimo 3 meses de custos fixos (${formatCurrency(quant.fixedCosts * 3)}).\n` +
          `3. Próximo Passo Vertus: Agendar reunião diagnóstica presencial ou online com nossos consultores para estruturar o DRE gerencial e o fluxo de caixa projetado.`
        );
      }
    } catch {
      setAiInsight(
        `Recomendação Executiva Vertus para ${company.name || 'sua empresa'}:\n\n` +
        `Com base na nota de ${result.overallScore}% e status de "${result.status}", recomendamos priorizar ações no pilar de menor desempenho. Agende uma consultoria com a equipe Vertus pelo WhatsApp para estruturação do plano de ação de 90 dias.`
      );
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Banner & Quick Actions */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Award className="w-80 h-80 text-teal-400" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="bg-teal-500/20 text-teal-300 text-xs px-3 py-1 rounded-full border border-teal-500/30 font-semibold">
                Relatório Diagnóstico Concluído
              </span>
              {getStatusBadge(result.status)}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {company.name || 'Sua Empresa'} — Avaliação {config.companyName}
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed">
              Resumo analítico de maturidade financeira, estrutura de custos e direcionamento estratégico para alavancagem de resultados.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 pt-1">
              <span><strong>Setor:</strong> {company.sector || 'N/I'}</span>
              <span><strong>Porte:</strong> {company.size}</span>
              <span><strong>Cidade:</strong> {company.cityState || 'N/I'}</span>
              <span><strong>Gestor:</strong> {company.contactName || 'N/I'}</span>
            </div>
          </div>

          {/* Big Score Card */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 text-center flex flex-col items-center justify-center min-w-[220px]">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Score Geral Vertus
            </span>
            <div className="text-5xl font-black text-teal-400 font-mono tracking-tight">
              {result.overallScore}<span className="text-2xl font-bold text-slate-400">%</span>
            </div>
            <p className="text-xs font-semibold text-slate-300 mt-2">
              Nível {result.status}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onEditData}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
            >
              Editar Dados Financeiros
            </button>
            <button
              onClick={onEditQuestions}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
            >
              Editar Respostas dos Pilares
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              Imprimir / Salvar PDF
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg transition-all"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              Enviar Diagnóstico no WhatsApp Vertus
            </button>
          </div>
        </div>
      </div>

      {/* Calculated Financial Key Metrics Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-teal-700" />
          Indicadores Quantitativos Calculados
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Margem Bruta Operacional</span>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {result.calculatedMetrics.grossMargin}%
            </div>
            <p className="text-[11px] text-slate-500">
              Sobrou R$ {formatCurrency(quant.monthlyRevenue - quant.variableCosts)} após custos variáveis.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Margem Líquida Estimada</span>
            <div className={`text-2xl font-bold font-mono ${result.calculatedMetrics.netMargin >= 10 ? 'text-emerald-700' : 'text-amber-700'}`}>
              {result.calculatedMetrics.netMargin}%
            </div>
            <p className="text-[11px] text-slate-500">
              Resultado operacional mensal estimado de R$ {formatCurrency((quant.monthlyRevenue - quant.variableCosts) - quant.fixedCosts)}.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Ponto de Equilíbrio (Break-Even)</span>
            <div className="text-xl font-bold font-mono text-slate-900">
              {formatCurrency(result.calculatedMetrics.breakEvenPoint)}
            </div>
            <p className="text-[11px] text-slate-500">
              Faturamento mínimo para cobrir todos os custos sem prejuízo.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Runway (Fôlego de Caixa)</span>
            <div className="text-2xl font-bold font-mono text-teal-700">
              {result.calculatedMetrics.runwayMonths} meses
            </div>
            <p className="text-[11px] text-slate-500">
              Caixa livre dividido pelos custos fixos sem novas receitas.
            </p>
          </div>
        </div>
      </div>

      {/* Pillar Scores Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-teal-700" />
          Desempenho por Pilar Estratégico (0 - 100%)
        </h2>

        <div className="space-y-4">
          {DIAGNOSTIC_PILLARS.map((pillar) => {
            const score = result.pillarScores[pillar.id] ?? 0;
            let barColor = 'bg-rose-500';
            if (score >= 75) barColor = 'bg-emerald-600';
            else if (score >= 50) barColor = 'bg-amber-500';

            return (
              <div key={pillar.id} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-slate-800">
                  <span>{pillar.title}</span>
                  <span className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {score}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className={`${barColor} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SWOT Matrix */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Matriz SWOT Financeira</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              Forças (Pontos Fortes)
            </h3>
            <ul className="space-y-1.5">
              {result.swotAnalysis.strengths.map((item, idx) => (
                <li key={idx} className="text-xs text-emerald-900 flex items-start gap-1.5">
                  <span className="text-emerald-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-rose-950 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-700" />
              Fraquezas (Gargalos Internos)
            </h3>
            <ul className="space-y-1.5">
              {result.swotAnalysis.weaknesses.map((item, idx) => (
                <li key={idx} className="text-xs text-rose-900 flex items-start gap-1.5">
                  <span className="text-rose-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-teal-950 flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-teal-700" />
              Oportunidades de Melhoria
            </h3>
            <ul className="space-y-1.5">
              {result.swotAnalysis.opportunities.map((item, idx) => (
                <li key={idx} className="text-xs text-teal-900 flex items-start gap-1.5">
                  <span className="text-teal-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              Ameaças & Riscos Externos
            </h3>
            <ul className="space-y-1.5">
              {result.swotAnalysis.threats.map((item, idx) => (
                <li key={idx} className="text-xs text-amber-900 flex items-start gap-1.5">
                  <span className="text-amber-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* AI Assistant Insight Box */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-2xl p-6 text-white border border-teal-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-teal-300" />
            <h3 className="font-bold text-base text-white">Análise Executiva Automatizada (Vertus AI)</h3>
          </div>
          <button
            onClick={handleGenerateAiInsight}
            disabled={loadingAi}
            className="bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow disabled:opacity-50"
          >
            {loadingAi ? 'Gerando Análise...' : aiInsight ? 'Regerar Análise' : 'Gerar Parecer Executivo'}
          </button>
        </div>

        {aiInsight ? (
          <div className="bg-slate-950/60 p-4 rounded-xl text-xs sm:text-sm text-slate-200 whitespace-pre-line border border-slate-800 leading-relaxed">
            {aiInsight}
          </div>
        ) : (
          <p className="text-xs text-slate-300">
            Clique no botão acima para sintetizar as métricas financeiras e gerar um plano sintético de recomendação estratégica Vertus.
          </p>
        )}
      </div>

      {/* Priority Recommendations */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Plano de Ação Recomendado Vertus</h2>

        <div className="space-y-3">
          {result.recommendations.map((rec, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-xs text-slate-900">{rec.pillarTitle}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rec.priority === 'Alta'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : rec.priority === 'Média'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-teal-100 text-teal-800 border border-teal-200'
                    }`}
                  >
                    Prioridade {rec.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{rec.action}</p>
              </div>

              <button
                onClick={handleWhatsAppShare}
                className="flex items-center gap-1.5 text-xs text-teal-700 hover:text-teal-900 font-semibold whitespace-nowrap"
              >
                Tratar com Consultor
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
