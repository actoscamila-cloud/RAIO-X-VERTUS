import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QUESTIONS, BLOCKS } from "../constants";
import { DiagnosisResponse, Question } from "../types";
import { ArrowRight, ArrowLeft, AlertTriangle, Info, ShieldCheck, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";

interface DiagnosisFlowProps {
  leadId: string;
  onComplete: (diagnosis: DiagnosisResponse) => void;
  onProgress: (progress: number) => void;
}

export default function DiagnosisFlow({ leadId, onComplete, onProgress }: DiagnosisFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [showBlockInsight, setShowBlockInsight] = useState(false);

  const totalQuestions = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentStep];
  const currentBlock = BLOCKS.find(b => b.id === currentQuestion.block)!;
  
  const progress = ((currentStep + 1) / totalQuestions) * 100;

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
      onProgress(((nextIdx + 1) / totalQuestions) * 100);
    } else {
      calculateAndComplete(currentResponses);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1;
      setCurrentStep(prevIdx);
      onProgress(((prevIdx + 1) / totalQuestions) * 100);
      setShowBlockInsight(false);
    }
  };

  const calculateAndComplete = (finalResponses: Record<string, any>) => {
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

    onComplete({
      leadId,
      responses: finalResponses,
      score: finalScore,
      dimensions,
      classification,
      monthlyLoss,
      benchmark: Math.max(10, Math.round(finalScore * 0.8)),
      createdAt: new Date().toISOString(),
    });
  };

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
            Diagnóstico <span className="text-gold">VERTUS</span>
          </h3>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">
            Questão {currentStep + 1} / {totalQuestions}
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
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-white leading-snug uppercase tracking-tight">
                {currentQuestion.text}
              </h2>
            </div>

            <div className="grid gap-2.5 sm:gap-3">
              {currentQuestion.type === "select" && currentQuestion.options?.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.value)}
                  className="group p-3.5 sm:p-4 rounded-xl border border-white/5 bg-white/[0.02] text-left transition-all hover:border-gold/40 hover:bg-gold/5 flex justify-between items-center shadow-md shadow-transparent hover:shadow-gold/5 gap-3"
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
              disabled={currentStep === 0}
              className="flex items-center gap-1.5 text-white/30 hover:text-white transition-colors disabled:opacity-0 font-black uppercase tracking-widest text-[9px]"
            >
              <ArrowLeft size={13} />
              Voltar
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
                    className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black font-black rounded-xl uppercase tracking-wider text-xs hover:scale-102 transition-all flex items-center justify-center gap-2.5 mx-auto shadow-xl shadow-gold/20 overflow-hidden"
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
