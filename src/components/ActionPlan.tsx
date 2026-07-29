import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { DiagnosisResponse, Lead } from "../types";
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Calendar, CheckCircle2, ArrowRight, TrendingUp, Download, Lock, X, MessageSquare } from "lucide-react";
import { cn } from "../lib/utils";
import ReactMarkdown from "react-markdown";
import { ACTION_MOVEMENTS, VERTUS_WHATSAPP_LINK, VIX_WHATSAPP_LINK } from "../constants";
import { pdfService } from "../services/pdfService";
import { ActionMovement } from "../types";
import { AnimatePresence } from "motion/react";
import { storage } from "../lib/storage";

interface ActionPlanProps {
  diagnosis: DiagnosisResponse;
  lead: Lead;
  isLocked?: boolean;
  onNavigateToTraining?: () => void;
  onBackToDashboard?: () => void;
}

export default function ActionPlan({ diagnosis, lead, isLocked, onNavigateToTraining, onBackToDashboard }: ActionPlanProps) {
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<ActionMovement | null>(null);

  useEffect(() => {
    const generateAIAnalysis = async () => {
      setIsGenerating(true);
      try {
        const settings = await storage.getSettings();
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const prompt = `Analise os resultados do Raio-X Financeiro da empresa ${lead.companyName}.
          
          Dados da Empresa:
          - Faturamento: ${lead.monthlyRevenue}
          - Funcionários: ${lead.employeeCount}
          - Segmento: ${lead.segment}
          - Localização: ${lead.location}
          
          Resultados do Diagnóstico:
          - Score Geral: ${diagnosis.score}/100
          - Classificação: ${diagnosis.classification}
          - Hemorragia Mensal: R$ ${diagnosis.monthlyLoss}
          - Dimensões: ${JSON.stringify(diagnosis.dimensions)}
          
          Sua análise deve:
          1. Explicar o "POR QUÊ" técnico da hemorragia financeira detectada.
          2. Ser direta, estratégica e autoritária.
          3. Focar em como a VERTUS pode estancar essa perda em 30 dias.
          
          Estrutura da resposta:
          - Panorama Estratégico (impacto real no caixa)
          - Diagnóstico de Riscos (o que está drenando o lucro)
          - Próximos Passos (foco em 30 dias)
          
          Use Markdown para formatação.`;

        // Retry logic for 503 errors
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
          try {
            const response = await ai.models.generateContent({
              model: "gemini-3.1-flash-lite-preview",
              contents: prompt,
              config: {
                systemInstruction: `
                  ${settings.aiPrompt}
                  
                  CONTEÚDO BASE VERTUS:
                  ${settings.financialContent}
                  
                  DIRETRIZES ESTRATÉGICAS:
                  ${settings.strategicGuidelines}
                `
              }
            });

            setAiAnalysis(response.text || "Não foi possível gerar a análise no momento.");
            return; // Success!
          } catch (err: any) {
            if (err.message?.includes("503") || err.message?.includes("high demand")) {
              attempts++;
              if (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
                continue;
              }
            }
            throw err;
          }
        }
      } catch (error) {
        console.error("AI Error:", error);
        setAiAnalysis("Erro ao gerar análise estratégica devido à alta demanda nos servidores da IA. Por favor, tente recarregar a página em alguns instantes.");
      } finally {
        setIsGenerating(false);
      }
    };

    generateAIAnalysis();
  }, [diagnosis, lead]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await pdfService.generateReport("vertus-action-plan-content", lead, diagnosis);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const getRecommendation = () => {
    return {
      title: "BPO VERTUS – Operação e Gestão Financeira de Elite",
      desc: "A melhor solução para empresas que buscam focar 100% no seu core business. A VERTUS assume integralmente toda a rotina operacional do seu financeiro: contas a pagar, contas a receber, conciliação bancária diária e relatórios de fluxo de caixa atualizado.\n\nEmpresas que contratam o BPO VERTUS reduzem custos operacionais em até 30% e economizam em média 15 horas semanais da diretoria.",
      btn: "QUERO BPO VERTUS AGORA",
      highlight: true
    };
  };

  const rec = getRecommendation();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-8 sm:space-y-12 relative">
      <div className="flex justify-between items-center">
        <button 
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-gold transition-colors group"
        >
          <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
          Voltar para o Dashboard
        </button>
      </div>

      <div id="vertus-action-plan-content" className="space-y-8 sm:space-y-12">
        {isLocked && (
        <div className="absolute inset-0 z-20 bg-vertus-black/80 backdrop-blur-md rounded-2xl sm:rounded-[40px] flex items-center justify-center p-4 sm:p-10">
          <div className="max-w-md w-full bg-vertus-gray border border-white/10 rounded-2xl sm:rounded-3xl lg:rounded-[40px] p-6 sm:p-10 lg:p-12 text-center space-y-6 sm:space-y-8 shadow-2xl">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gold/10 rounded-2xl sm:rounded-3xl flex items-center justify-center border border-gold/20 mx-auto shadow-2xl shadow-gold/10">
              <Lock className="text-gold" size={32} />
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-xl sm:text-3xl font-bold text-white uppercase tracking-tight">Plano de Ação <span className="text-gold">Bloqueado</span></h3>
              <p className="text-white/40 text-xs sm:text-sm leading-relaxed font-medium">
                Para acessar seu Plano de Ação personalizado e as recomendações estratégicas, você precisa concluir o treinamento obrigatório primeiro.
              </p>
            </div>
            <button 
              onClick={onNavigateToTraining}
              className="w-full py-4 sm:py-6 bg-gradient-to-br from-gold to-gold-dark text-vertus-black font-black text-xs sm:text-sm uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all shadow-2xl shadow-gold/20"
            >
              INICIAR TREINAMENTO AGORA
            </button>
          </div>
        </div>
      )}

      {/* AI Assistant Section */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">
        <div className="lg:col-span-2 space-y-8 sm:space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-vertus-gray border border-white/10 rounded-2xl sm:rounded-3xl lg:rounded-[40px] p-5 sm:p-8 lg:p-10 space-y-6 sm:space-y-10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-white/20 to-gold opacity-30" />
            
            <div className="flex items-center gap-4 border-b border-white/5 pb-8">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center border border-gold/20">
                <Sparkles className="text-gold" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Análise Estratégica VERTUS</h3>
                <p className="text-gold text-[10px] font-black uppercase tracking-widest mt-1">Inteligência Artificial em Tempo Real</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-4 max-h-[450px] custom-scrollbar">
              <div className="prose prose-invert prose-sm max-w-none">
                {isGenerating ? (
                  <div className="space-y-6 animate-pulse">
                    <div className="h-4 w-full bg-white/5 rounded-full" />
                    <div className="h-4 w-[90%] bg-white/5 rounded-full" />
                    <div className="h-4 w-[95%] bg-white/5 rounded-full" />
                    <div className="pt-6 space-y-3">
                      <div className="h-4 w-32 bg-white/5 rounded-full" />
                      <div className="h-4 w-full bg-white/5 rounded-full" />
                    </div>
                  </div>
                ) : (
                  <div className="text-white/60 leading-relaxed space-y-4 font-medium">
                    <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* 30 Day Plan Visualizer */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                <Calendar className="text-gold" size={20} />
              </div>
              <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Plano de Ação: 30 Dias</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {ACTION_MOVEMENTS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  onClick={() => setSelectedMovement(step)}
                  className="bg-vertus-gray border border-white/10 rounded-[32px] p-8 space-y-4 hover:border-gold/30 transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gold">{step.id}</span>
                    <CheckCircle2 className="text-white/10 group-hover:text-gold transition-colors" size={16} />
                  </div>
                  <h4 className="text-lg font-bold text-white uppercase tracking-tight">{step.title}</h4>
                  <p className="text-xs text-white/40 leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Recommendations & Urgency */}
        <div className="space-y-8">
          {/* Main Recommendation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "rounded-[40px] p-10 space-y-8 relative overflow-hidden",
              rec.highlight 
                ? "bg-gradient-to-br from-gold to-gold-dark text-vertus-black shadow-2xl shadow-gold/20" 
                : "bg-vertus-gray border border-white/10 text-white"
            )}
          >
            <div className="flex justify-between items-start">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", rec.highlight ? "bg-vertus-black/10 border-vertus-black/10" : "bg-gold/10 border-gold/20")}>
                <TrendingUp size={24} className={rec.highlight ? "text-vertus-black" : "text-gold"} />
              </div>
              <div className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest", rec.highlight ? "bg-vertus-black/10" : "bg-white/10")}>
                OFERTA EXCLUSIVA • BPO VERTUS
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-3xl font-bold uppercase leading-none tracking-tight">{rec.title}</h3>
              <p className={cn("text-sm font-medium leading-relaxed whitespace-pre-line", rec.highlight ? "opacity-80" : "text-white/60")}>
                {rec.desc}
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <button 
                onClick={() => {
                  const company = lead?.companyName ? `da ${lead.companyName}` : "da minha empresa";
                  const scoreInfo = diagnosis?.score !== undefined ? ` (Score: ${diagnosis.score}/100)` : "";
                  const text = encodeURIComponent(`Olá! Sou ${lead?.responsibleName || ''} ${company}${scoreInfo}. Fiz o Raio-X Financeiro VERTUS e tenho interesse no BPO VERTUS!`);
                  window.open(`${VERTUS_WHATSAPP_LINK}?text=${text}`, "_blank");
                }}
                className={cn(
                "group relative w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] flex items-center justify-center gap-3 overflow-hidden",
                rec.highlight ? "bg-vertus-black text-white" : "bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black"
              )}>
                {!rec.highlight && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full -skew-x-12 animate-shine pointer-events-none" />}
                <span className="relative z-10">{rec.btn}</span>
                <ArrowRight size={20} className="relative z-10" />
              </button>
              <p className={cn("text-[9px] font-black uppercase tracking-widest text-center", rec.highlight ? "opacity-60" : "text-white/40")}>
                Vagas limitadas para esta semana
              </p>
            </div>
          </motion.div>

          {/* Support Info */}
          <div className="p-8 bg-gold/5 border border-gold/10 rounded-3xl space-y-4">
            <h4 className="text-[10px] font-black text-gold uppercase tracking-widest">Suporte Estratégico</h4>
            <p className="text-xs text-white/40 leading-relaxed">
              Dúvidas sobre seu plano? Use o Assistente VERTUS em tempo real para clareza imediata sobre qualquer ponto do diagnóstico.
            </p>
          </div>
        </div>
      </div>
    </div>
    {/* Movement Modal */}
    <AnimatePresence>
        {selectedMovement && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMovement(null)}
              className="absolute inset-0 bg-vertus-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-vertus-gray border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-gold uppercase tracking-widest">{selectedMovement.id}</span>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">{selectedMovement.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedMovement(null)}
                  className="p-2 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Objetivo Detalhado</h4>
                  <p className="text-sm text-white/80 leading-relaxed font-medium">{selectedMovement.objective}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Passo a Passo Completo</h4>
                  <ul className="space-y-2">
                    {selectedMovement.steps?.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs text-white/60 leading-relaxed font-medium">
                        <div className="w-1.5 h-1.5 bg-gold rounded-full mt-1.5 flex-shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-gold/5 border border-gold/10 rounded-2xl space-y-2">
                  <h4 className="text-[10px] font-black text-gold uppercase tracking-widest">Resultado Esperado</h4>
                  <p className="text-xs text-white/80 font-bold">{selectedMovement.expectedResult}</p>
                </div>

                <button 
                  onClick={() => window.open(VERTUS_WHATSAPP_LINK + `?text=Olá!%20Gostaria%20de%20executar%20o%20${selectedMovement.title}%20com%20a%20VERTUS.`, "_blank")}
                  className="w-full py-4 bg-gold text-vertus-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                >
                  <MessageSquare size={16} />
                  Executar com VERTUS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
