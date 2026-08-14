import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QUESTIONS, BLOCKS, REVENUE_OPTIONS, SEGMENTS, EMPLOYEE_OPTIONS } from "../constants";
import { DiagnosisResponse, Question, Lead } from "../types";
import { 
  ArrowRight, 
  ArrowLeft, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  Briefcase, 
  Lock, 
  Check, 
  TrendingUp,
  Cpu,
  BarChart3,
  Target,
  LineChart,
  BrainCircuit,
  KeyRound,
  FileText
} from "lucide-react";
import { cn } from "../lib/utils";

interface DiagnosisFlowProps {
  leadId?: string;
  onComplete: (diagnosis: DiagnosisResponse, leadData: Partial<Lead>) => void;
  onProgress: (progress: number) => void;
  onBackToLanding?: () => void;
  userEmail?: string;
  userName?: string;
  initialLead?: Lead | null;
}

export default function DiagnosisFlow({ 
  leadId, 
  onComplete, 
  onProgress, 
  onBackToLanding,
  userEmail,
  userName,
  initialLead 
}: DiagnosisFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [showBlockInsight, setShowBlockInsight] = useState(false);
  const [flowPhase, setFlowPhase] = useState<"questions" | "calculating" | "lead-capture">("questions");
  const [calcStepIndex, setCalcStepIndex] = useState(0);
  const [calculatedDiag, setCalculatedDiag] = useState<DiagnosisResponse | null>(null);

  // Lead Form state
  const [leadForm, setLeadForm] = useState<Partial<Lead>>({
    companyName: initialLead?.companyName || "",
    responsibleName: initialLead?.responsibleName || userName || "",
    whatsapp: initialLead?.whatsapp || "",
    email: initialLead?.email || userEmail || "",
    monthlyRevenue: initialLead?.monthlyRevenue || "R$ 50k - 100k",
    employeeCount: initialLead?.employeeCount || "1 - 5",
    segment: initialLead?.segment || "Serviços",
    location: initialLead?.location || "Brasil",
  });

  const totalQuestions = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentStep];
  const currentBlock = BLOCKS.find(b => b.id === currentQuestion?.block) || BLOCKS[0];
  
  const progress = flowPhase === "questions" 
    ? ((currentStep + 1) / (totalQuestions + 1)) * 100 
    : 95;

  const handleAnswer = (value: any) => {
    const newResponses = { ...responses, [currentQuestion.id]: value };
    setResponses(newResponses);
    
    // Check if it's the end of a block
    const isEndOfBlock = currentStep < totalQuestions - 1 && QUESTIONS[currentStep + 1].block !== currentQuestion.block;
    
    if (isEndOfBlock) {
      setShowBlockInsight(true);
      return;
    }

    nextStep(newResponses);
  };

  const nextStep = (currentResponses = responses) => {
    setShowBlockInsight(false);
    if (currentStep < totalQuestions - 1) {
      const nextIdx = currentStep + 1;
      setCurrentStep(nextIdx);
      onProgress(((nextIdx + 1) / (totalQuestions + 1)) * 100);
    } else {
      startCalculation(currentResponses);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1;
      setCurrentStep(prevIdx);
      onProgress(((prevIdx + 1) / (totalQuestions + 1)) * 100);
      setShowBlockInsight(false);
    } else if (onBackToLanding) {
      onBackToLanding();
    }
  };

  const startCalculation = (finalResponses: Record<string, any>) => {
    const dimensions: DiagnosisResponse["dimensions"] = {
      fluxoCaixa: 0,
      precificacao: 0,
      controle: 0,
      previsibilidade: 0,
      custosRentabilidade: 0,
      processos: 0,
    };

    const dimensionWeights: Record<keyof typeof dimensions, number> = {
      fluxoCaixa: 0,
      precificacao: 0,
      controle: 0,
      previsibilidade: 0,
      custosRentabilidade: 0,
      processos: 0,
    };

    QUESTIONS.forEach(q => {
      if (q.dimension !== "none") {
        const value = finalResponses[q.id] || 0;
        dimensions[q.dimension] += value * q.weight;
        dimensionWeights[q.dimension] += 100 * q.weight;
      }
    });

    // Normalize dimensions to 0-100
    Object.keys(dimensions).forEach(key => {
      const k = key as keyof typeof dimensions;
      if (dimensionWeights[k] > 0) {
        dimensions[k] = Math.round((dimensions[k] / dimensionWeights[k]) * 100);
      } else {
        dimensions[k] = 100;
      }
    });

    // Final Score Calculation (Weighted Average)
    const finalScore = Math.round(
      dimensions.fluxoCaixa * 0.25 +
      dimensions.precificacao * 0.20 +
      dimensions.controle * 0.15 +
      dimensions.previsibilidade * 0.15 +
      dimensions.custosRentabilidade * 0.15 +
      dimensions.processos * 0.10
    );

    let classification: DiagnosisResponse["classification"] = "Crítica";
    if (finalScore >= 70) classification = "Saudável";
    else if (finalScore >= 40) classification = "Atenção";

    // Estimate monthly loss (hemorrhage)
    const monthlyLoss = Math.round((100 - finalScore) * 150); 

    const result: DiagnosisResponse = {
      leadId: leadId || "temp_lead",
      responses: finalResponses,
      score: finalScore,
      dimensions,
      classification,
      monthlyLoss,
      benchmark: Math.max(10, Math.round(finalScore * 0.8)),
      createdAt: new Date().toISOString(),
    };

    setCalculatedDiag(result);
    setFlowPhase("calculating");
  };

  // Step ticker for calculation animation
  useEffect(() => {
    if (flowPhase === "calculating") {
      const timer1 = setTimeout(() => setCalcStepIndex(1), 500);
      const timer2 = setTimeout(() => setCalcStepIndex(2), 1100);
      const timer3 = setTimeout(() => setCalcStepIndex(3), 1600);
      const timer4 = setTimeout(() => {
        setFlowPhase("lead-capture");
      }, 2100);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [flowPhase]);

  // Format Brazilian phone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 11) val = val.substring(0, 11);
    if (val.length > 10) {
      val = val.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    } else if (val.length > 6) {
      val = val.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
    } else if (val.length > 2) {
      val = val.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
    }
    setLeadForm({ ...leadForm, whatsapp: val });
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calculatedDiag) return;
    
    onComplete(calculatedDiag, {
      ...leadForm,
      createdAt: new Date().toISOString()
    });
  };

  const inputClasses = "w-full bg-vertus-black border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/20 focus:border-gold/50 focus:ring-2 focus:ring-gold/10 outline-none transition-all font-medium shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]";
  const labelClasses = "block text-[9px] font-black tracking-[0.15em] uppercase text-gold/80 mb-1.5 flex items-center gap-1.5";

  // 1. CALCULATING ANIMATION PHASE
  if (flowPhase === "calculating") {
    const calcSteps = [
      "Consolidando respostas e métricas financeiras...",
      "Analisando 6 pilares de governança (Fluxo, DRE, Margem e Previsibilidade)...",
      "Calculando Índice de Maturidade e Estimativa de Perda Oculta...",
      "Estruturando Painel Executivo e Plano de Ação para 30 dias..."
    ];

    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-vertus-gray border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden space-y-8"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-white to-gold opacity-50 animate-pulse" />
          
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-gold/20 animate-ping" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/40 flex items-center justify-center shadow-lg shadow-gold/20">
              <Cpu className="text-gold animate-spin" style={{ animationDuration: "6s" }} size={30} />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black tracking-[0.25em] uppercase text-gold">Inteligência Vertus</span>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Processando Diagnóstico Estratégico
            </h2>
            <p className="text-white/50 text-xs sm:text-sm max-w-md mx-auto">
              Cruzando seus dados com a metodologia de eficiência e rentabilidade Vertus...
            </p>
          </div>

          <div className="space-y-3 max-w-md mx-auto text-left bg-black/30 border border-white/5 rounded-2xl p-4 sm:p-5">
            {calcSteps.map((step, idx) => {
              const isDone = idx < calcStepIndex;
              const isCurrent = idx === calcStepIndex;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: idx <= calcStepIndex ? 1 : 0.25, x: 0 }}
                  className="flex items-center gap-3 text-xs"
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black transition-all",
                    isDone ? "bg-gold text-vertus-black" : isCurrent ? "bg-gold/20 text-gold border border-gold/40 animate-pulse" : "bg-white/5 text-white/20"
                  )}>
                    {isDone ? <Check size={11} /> : idx + 1}
                  </div>
                  <span className={cn(
                    "font-medium transition-colors leading-tight",
                    isDone ? "text-white/90" : isCurrent ? "text-gold font-bold" : "text-white/30"
                  )}>
                    {step}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <div className="pt-2 text-[10px] text-white/30 font-mono tracking-widest uppercase">
            VERTUS FINANCIAL ANALYTICS • QUASE PRONTO
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. LEAD UNLOCK / CAPTURE PHASE
  if (flowPhase === "lead-capture") {
    const isFormValid = Boolean(
      leadForm.responsibleName && 
      leadForm.responsibleName.trim().length >= 2 && 
      leadForm.whatsapp && 
      leadForm.whatsapp.trim().length >= 10
    );

    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-vertus-gray/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-9 shadow-2xl relative overflow-hidden space-y-6"
        >
          {/* Subtle Ambient Background Light */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

          {/* Header */}
          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-gold/10 border border-gold/25 rounded-full text-gold text-[9px] font-black tracking-[0.22em] uppercase shadow-[0_0_15px_rgba(212,175,55,0.15)]">
              <Sparkles size={12} className="text-gold animate-pulse" />
              ANÁLISE ESTRATÉGICA CONCLUÍDA
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase leading-none pt-1">
              SEU DIAGNÓSTICO <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark">
                ESTÁ PRONTO
              </span>
            </h2>

            <p className="text-base sm:text-lg font-bold text-gold/95 tracking-tight">
              Para onde devemos enviar seu resultado?
            </p>

            <p className="text-white/60 font-medium text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Preencha seus dados para uma análise personalizada e acesso ao seu <strong className="text-white font-bold">Plano de Ação de 30 dias</strong>.
            </p>
          </div>

          {/* Value Deliverables / Executive Access Cards */}
          <div className="bg-black/50 border border-gold/20 rounded-2xl p-4 sm:p-5 space-y-3 shadow-inner">
            <div className="text-[10px] font-black text-gold uppercase tracking-[0.2em] flex items-center gap-2">
              <CheckCircle2 size={13} className="text-gold" />
              VOCÊ TERÁ ACESSO EXCLUSIVO A:
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <motion.div 
                whileHover={{ scale: 1.015, borderColor: "rgba(212,175,55,0.4)" }}
                className="flex items-start gap-2.5 bg-white/[0.02] hover:bg-gold/[0.04] p-3 rounded-xl border border-white/5 transition-all duration-200 group"
              >
                <div className="w-7 h-7 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 text-gold group-hover:bg-gold/20 transition-colors">
                  <BarChart3 size={14} />
                </div>
                <div className="leading-snug text-[11px] text-white/70">
                  <strong className="text-white block font-bold group-hover:text-gold transition-colors">Raio-X dos 6 Pilares</strong>
                  Fluxo, DRE, Margem e Previsibilidade
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.015, borderColor: "rgba(212,175,55,0.4)" }}
                className="flex items-start gap-2.5 bg-white/[0.02] hover:bg-gold/[0.04] p-3 rounded-xl border border-white/5 transition-all duration-200 group"
              >
                <div className="w-7 h-7 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 text-gold group-hover:bg-gold/20 transition-colors">
                  <LineChart size={14} />
                </div>
                <div className="leading-snug text-[11px] text-white/70">
                  <strong className="text-white block font-bold group-hover:text-gold transition-colors">Estimativa de Perdas</strong>
                  Oportunidades ocultas de caixa
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.015, borderColor: "rgba(212,175,55,0.4)" }}
                className="flex items-start gap-2.5 bg-white/[0.02] hover:bg-gold/[0.04] p-3 rounded-xl border border-white/5 transition-all duration-200 group"
              >
                <div className="w-7 h-7 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 text-gold group-hover:bg-gold/20 transition-colors">
                  <Target size={14} />
                </div>
                <div className="leading-snug text-[11px] text-white/70">
                  <strong className="text-white block font-bold group-hover:text-gold transition-colors">Plano de Ação 30d</strong>
                  Prioridades práticas para sua rotina
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.015, borderColor: "rgba(212,175,55,0.4)" }}
                className="flex items-start gap-2.5 bg-white/[0.02] hover:bg-gold/[0.04] p-3 rounded-xl border border-white/5 transition-all duration-200 group"
              >
                <div className="w-7 h-7 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 text-gold group-hover:bg-gold/20 transition-colors">
                  <BrainCircuit size={14} />
                </div>
                <div className="leading-snug text-[11px] text-white/70">
                  <strong className="text-white block font-bold group-hover:text-gold transition-colors">Mentora Vertus IA</strong>
                  Orientação executiva contínua
                </div>
              </motion.div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLeadSubmit} className="space-y-4 pt-1">
            {/* Nome */}
            <div>
              <label className={labelClasses}><User size={12} /> Seu Nome *</label>
              <input 
                required 
                name="responsibleName" 
                value={leadForm.responsibleName} 
                onChange={(e) => setLeadForm({ ...leadForm, responsibleName: e.target.value })} 
                className={inputClasses} 
                placeholder="Como prefere ser chamado(a)?" 
              />
            </div>

            {/* WhatsApp */}
            <div className="space-y-1.5">
              <label className={labelClasses}><Phone size={12} /> WhatsApp *</label>
              <input 
                required 
                type="tel"
                name="whatsapp" 
                value={leadForm.whatsapp} 
                onChange={handlePhoneChange} 
                className={cn(inputClasses, "border-gold/30 focus:border-gold")} 
                placeholder="(00) 00000-0000" 
              />
              <div className="flex items-center gap-2 text-[10px] text-gold/90 font-medium bg-gold/10 border border-gold/20 px-3 py-2 rounded-xl">
                <KeyRound size={13} className="shrink-0 text-gold" />
                <span>Para gerar chave de acesso aos seus resultados e envio do relatório em PDF.</span>
              </div>
            </div>

            {/* E-mail Opcional */}
            <div>
              <label className={labelClasses}><Mail size={12} /> E-mail (opcional para envio de cópia em PDF)</label>
              <input 
                type="email"
                name="email" 
                value={leadForm.email} 
                onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })} 
                className={inputClasses} 
                placeholder="seu.email@exemplo.com.br" 
              />
            </div>

            {/* Nome da Empresa Opcional */}
            <div>
              <label className={labelClasses}><Building2 size={12} /> Nome da Empresa (opcional para personalização do diagnóstico)</label>
              <input 
                name="companyName" 
                value={leadForm.companyName} 
                onChange={(e) => setLeadForm({ ...leadForm, companyName: e.target.value })} 
                className={inputClasses} 
                placeholder="Ex: Minha Empresa" 
              />
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={cn(
                "group relative w-full py-4 font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-3 mt-6 overflow-hidden",
                isFormValid 
                  ? "bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black shadow-xl shadow-gold/25 hover:shadow-gold/40 hover:scale-[1.01] active:scale-98 cursor-pointer" 
                  : "bg-white/10 text-white/30 border border-white/5 cursor-not-allowed"
              )}
            >
              {isFormValid && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full -skew-x-12 animate-shine pointer-events-none" />
              )}
              <span className="relative z-10 font-black">ACESSAR MEU DIAGNÓSTICO</span>
              <ArrowRight size={16} className={cn("relative z-10 transition-transform duration-200", isFormValid && "group-hover:translate-x-1.5")} />
            </button>
          </form>

          {/* Trust points */}
          <div className="pt-3 border-t border-white/5 flex flex-wrap justify-center gap-4 sm:gap-6 text-white/40 text-[9px] font-black uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <Check size={12} className="text-gold" /> 100% Gratuito
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={12} className="text-gold" /> Acesso Imediato
            </span>
            <span className="flex items-center gap-1.5">
              <Lock size={12} className="text-gold" /> Sigilo Total de Dados
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  // 3. QUESTIONS PHASE
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header Info */}
      <div className="mb-6 flex justify-between items-end">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-[9px] font-black tracking-[0.15em] uppercase">
            <ShieldCheck size={12} />
            Bloco {currentBlock.id}: {currentBlock.title}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight">
            Raio-X <span className="text-gold">VERTUS</span>
          </h3>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
            ⏱️ 2 min • Questão {currentStep + 1} de {totalQuestions}
          </span>
          <div className="text-lg font-black text-white">
            {Math.round(progress)}%
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-vertus-gray border border-white/10 rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden"
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-gold/80 block">
                Pergunta {currentStep + 1} de {totalQuestions}
              </span>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-white leading-snug uppercase tracking-tight">
                {currentQuestion.text}
              </h2>
            </div>

            <div className="grid gap-2.5 sm:gap-3">
              {currentQuestion.type === "select" && currentQuestion.options?.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.value)}
                  className="group p-3.5 sm:p-4 rounded-xl border border-white/5 bg-white/[0.02] text-left transition-all hover:border-gold/40 hover:bg-gold/5 flex justify-between items-center shadow-md shadow-transparent hover:shadow-gold/5 gap-3 cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-medium text-white/70 group-hover:text-white transition-colors leading-snug">{opt.label}</span>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-white/10 group-hover:border-gold group-hover:bg-gold/20 transition-all flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 bg-gold rounded-full scale-0 group-hover:scale-100 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-5 flex items-center gap-4">
            <button
              onClick={prevStep}
              className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors font-black uppercase tracking-widest text-[9px] cursor-pointer"
            >
              <ArrowLeft size={13} />
              {currentStep === 0 ? "Voltar ao Início" : "Questão Anterior"}
            </button>
          </div>

          {/* Insight Overlay */}
          <AnimatePresence>
            {showBlockInsight && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-vertus-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-6"
              >
                <div className="max-w-md text-center space-y-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 rounded-full flex items-center justify-center border border-gold/20 mx-auto">
                    <AlertTriangle className="text-gold" size={22} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[9px] font-black tracking-[0.25em] uppercase text-gold">Insight Estratégico VERTUS</h4>
                    <p className="text-sm sm:text-base font-bold text-white leading-relaxed uppercase tracking-tight">
                      {currentBlock.insight}
                    </p>
                  </div>
                  <button
                    onClick={() => nextStep()}
                    className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black font-black rounded-xl uppercase tracking-wider text-xs hover:scale-102 transition-all flex items-center justify-center gap-2.5 mx-auto shadow-xl shadow-gold/20 overflow-hidden cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full -skew-x-12 animate-shine pointer-events-none" />
                    <span className="relative z-10">CONTINUAR DIAGNÓSTICO</span>
                    <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1.5 transition-transform shrink-0" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* UX Feedback */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 sm:gap-8 text-white/30 text-[9px] font-black tracking-[0.15em] uppercase">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-gold" />
          Autoridade VERTUS
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-gold" />
          Diagnóstico Técnico
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-gold" />
          Análise Estratégica
        </div>
      </div>
    </div>
  );
}
