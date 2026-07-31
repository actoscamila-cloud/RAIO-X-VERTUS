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
import StrategicPlanModal from "./StrategicPlanModal";

interface ActionPlanProps {
  diagnosis: DiagnosisResponse;
  lead: Lead;
  isLocked?: boolean;
  onNavigateToTraining?: () => void;
  onBackToDashboard?: () => void;
  onOpenAboutVertus?: () => void;
}

export default function ActionPlan({ diagnosis, lead, isLocked, onNavigateToTraining, onBackToDashboard, onOpenAboutVertus }: ActionPlanProps) {
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<ActionMovement | null>(null);
  const [showStrategicModal, setShowStrategicModal] = useState(false);

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 relative">
      <div className="flex justify-between items-center">
        <button 
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-gold transition-colors group"
        >
          <ArrowRight size={13} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
          Voltar para o Dashboard
        </button>
      </div>

      <div id="vertus-action-plan-content" className="space-y-6">
        {isLocked && (
        <div className="absolute inset-0 z-20 bg-vertus-black/80 backdrop-blur-md rounded-2xl flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full bg-vertus-gray border border-white/10 rounded-2xl p-5 sm:p-8 text-center space-y-5 shadow-2xl">
            <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center border border-gold/20 mx-auto shadow-xl shadow-gold/10">
              <Lock className="text-gold" size={26} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg sm:text-2xl font-bold text-white uppercase tracking-tight">Plano de Ação <span className="text-gold">Bloqueado</span></h3>
              <p className="text-white/50 text-xs leading-relaxed font-medium">
                Para acessar seu Plano de Ação personalizado e as recomendações estratégicas, você precisa concluir o treinamento obrigatório primeiro.
              </p>
            </div>
            <button 
              onClick={onNavigateToTraining}
              className="w-full py-3 sm:py-4 bg-gradient-to-br from-gold to-gold-dark text-vertus-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-[1.01] transition-all shadow-xl shadow-gold/20"
            >
              INICIAR TREINAMENTO AGORA
            </button>
          </div>
        </div>
      )}

      {/* AI Assistant Section */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-vertus-gray border border-white/10 rounded-2xl p-4 sm:p-6 space-y-6 relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-gold via-white/20 to-gold opacity-30" />
            
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center border border-gold/20 shrink-0">
                <Sparkles className="text-gold" size={20} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">Análise Estratégica VERTUS</h3>
                <p className="text-gold text-[9px] font-black uppercase tracking-widest mt-0.5">Inteligência Artificial em Tempo Real</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-3 max-h-[350px] custom-scrollbar">
              <div className="prose prose-invert prose-sm max-w-none">
                {isGenerating ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-3.5 w-full bg-white/5 rounded-full" />
                    <div className="h-3.5 w-[90%] bg-white/5 rounded-full" />
                    <div className="h-3.5 w-[95%] bg-white/5 rounded-full" />
                  </div>
                ) : (
                  <div className="text-white/70 leading-relaxed space-y-3 font-medium text-xs sm:text-sm">
                    <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* 30 Day Plan Visualizer */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                <Calendar className="text-gold" size={16} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight">Plano de Ação: 30 Dias</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {ACTION_MOVEMENTS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (i * 0.05) }}
                  onClick={() => setSelectedMovement(step)}
                  className="bg-vertus-gray border border-white/10 rounded-2xl p-5 space-y-3 hover:border-gold/30 transition-all group cursor-pointer shadow-lg"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gold">{step.id}</span>
                    <CheckCircle2 className="text-white/20 group-hover:text-gold transition-colors" size={15} />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-tight">{step.title}</h4>
                  <p className="text-xs text-white/50 leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Recommendations & Urgency */}
        <div className="space-y-5">
          {/* Main Recommendation */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "rounded-2xl p-5 sm:p-7 space-y-5 relative overflow-hidden shadow-xl",
              rec.highlight 
                ? "bg-gradient-to-br from-gold to-gold-dark text-vertus-black" 
                : "bg-vertus-gray border border-white/10 text-white"
            )}
          >
            <div className="flex justify-between items-start">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border shrink-0", rec.highlight ? "bg-vertus-black/10 border-vertus-black/10" : "bg-gold/10 border-gold/20")}>
                <TrendingUp size={20} className={rec.highlight ? "text-vertus-black" : "text-gold"} />
              </div>
              <div className={cn("px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest", rec.highlight ? "bg-vertus-black/10" : "bg-white/10")}>
                OFERTA EXCLUSIVA • BPO VERTUS
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold uppercase leading-snug tracking-tight">{rec.title}</h3>
              <p className={cn("text-xs font-medium leading-relaxed whitespace-pre-line", rec.highlight ? "opacity-90" : "text-white/60")}>
                {rec.desc}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button 
                onClick={() => setShowStrategicModal(true)}
                className="group relative w-full py-3 bg-vertus-black text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-black/80 transition-all flex items-center justify-center gap-2 border border-white/20 shadow-lg"
              >
                <Calendar size={15} className="text-gold" />
                <span>Agendar Apresentação (Calendly)</span>
              </button>

              <button 
                onClick={() => {
                  const company = lead?.companyName ? `da ${lead.companyName}` : "da minha empresa";
                  const scoreInfo = diagnosis?.score !== undefined ? ` (Score: ${diagnosis.score}/100)` : "";
                  const text = encodeURIComponent(`Olá! Sou ${lead?.responsibleName || ''} ${company}${scoreInfo}. Fiz o Raio-X Financeiro VERTUS e tenho interesse no BPO VERTUS!`);
                  window.open(`${VERTUS_WHATSAPP_LINK}?text=${text}`, "_blank");
                }}
                className={cn(
                "group relative w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all hover:scale-[1.01] flex items-center justify-center gap-2 overflow-hidden shadow-lg",
                rec.highlight ? "bg-vertus-black text-gold border border-gold/30" : "bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black"
              )}>
                {!rec.highlight && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full -skew-x-12 animate-shine pointer-events-none" />}
                <span className="relative z-10">{rec.btn}</span>
                <ArrowRight size={15} className="relative z-10" />
              </button>
              <p className={cn("text-[8px] font-black uppercase tracking-widest text-center", rec.highlight ? "opacity-70" : "text-white/40")}>
                Vagas limitadas para esta semana
              </p>
            </div>
          </motion.div>

          <StrategicPlanModal
            isOpen={showStrategicModal}
            onClose={() => setShowStrategicModal(false)}
            lead={lead}
            diagnosis={diagnosis}
            onOpenAboutVertus={onOpenAboutVertus}
          />

          {/* Support Info */}
          <div className="p-5 bg-gold/5 border border-gold/10 rounded-2xl space-y-2">
            <h4 className="text-[9px] font-black text-gold uppercase tracking-widest">Suporte Estratégico</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Dúvidas sobre seu plano? Use o Assistente VERTUS em tempo real para clareza imediata sobre qualquer ponto do diagnóstico.
            </p>
          </div>

          {/* Conheça a Vertus Card in Sidebar */}
          <button
            onClick={() => {
              if (onOpenAboutVertus) onOpenAboutVertus();
              window.dispatchEvent(new CustomEvent("open-about-vertus"));
            }}
            className="group relative w-full p-4 bg-gradient-to-br from-gold/15 via-gold/5 to-transparent border border-gold/30 hover:border-gold rounded-2xl flex items-center justify-between gap-3 text-left transition-all hover:scale-[1.01] shadow-lg cursor-pointer"
          >
              <div className="space-y-0.5">
                <span className="text-[9px] font-black text-gold uppercase tracking-widest block">Autoridade & Resultados</span>
                <h4 className="text-xs font-bold text-white uppercase tracking-tight">Conheça a VERTUS</h4>
                <p className="text-[10px] text-white/50 leading-tight">Especialista em performance empresarial</p>
              </div>
            <div className="w-8 h-8 rounded-xl bg-gold/20 text-gold flex items-center justify-center shrink-0 border border-gold/30 group-hover:scale-110 transition-transform">
              <Sparkles size={16} />
            </div>
          </button>
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
