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
    <div className="max-w-3xl mx-auto px-6 py-20">
      {/* Header Info */}
      <div className="mb-12 flex justify-between items-end">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black tracking-[0.2em] uppercase">
            <ShieldCheck size={14} />
            Bloco {currentBlock.id}: {currentBlock.title}
          </div>
          <h3 className="text-2xl font-bold text-white uppercase tracking-tight">
            Diagnóstico <span className="text-gold">VERTUS</span>
          </h3>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
            Questão {currentStep + 1} / {totalQuestions}
          </span>
          <div className="text-2xl font-black text-white">
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
          className="bg-vertus-gray border border-white/10 rounded-[40px] p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight uppercase tracking-tight">
                {currentQuestion.text}
              </h2>
            </div>

            <div className="grid gap-4">
              {currentQuestion.type === "select" && currentQuestion.options?.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.value)}
                  className="group p-8 rounded-[24px] border border-white/5 bg-white/[0.02] text-left transition-all hover:border-gold/40 hover:bg-gold/5 flex justify-between items-center shadow-2xl shadow-transparent hover:shadow-gold/5"
                >
                  <span className="text-lg font-medium text-white/60 group-hover:text-white transition-colors">{opt.label}</span>
                  <div className="w-8 h-8 rounded-full border border-white/10 group-hover:border-gold group-hover:bg-gold/20 transition-all flex items-center justify-center">
                    <div className="w-3 h-3 bg-gold rounded-full scale-0 group-hover:scale-100 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-10 flex items-center gap-6">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 text-white/20 hover:text-white transition-colors disabled:opacity-0 font-black uppercase tracking-widest text-[10px]"
            >
              <ArrowLeft size={14} />
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
                className="absolute inset-0 bg-vertus-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-10"
              >
                <div className="max-w-md text-center space-y-8">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center border border-gold/20 mx-auto">
                    <AlertTriangle className="text-gold" size={32} />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-gold">Insight Estratégico VERTUS</h4>
                    <p className="text-xl font-bold text-white leading-relaxed uppercase tracking-tight">
                      {currentBlock.insight}
                    </p>
                  </div>
            <button
              onClick={() => nextStep()}
              className="group relative px-12 py-5 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black font-black rounded-2xl uppercase tracking-widest text-xs hover:scale-105 transition-all flex items-center gap-4 mx-auto shadow-2xl shadow-gold/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full -skew-x-12 animate-shine pointer-events-none" />
              <span className="relative z-10">CONTINUAR DIAGNÓSTICO</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform" />
            </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* UX Feedback */}
      <div className="mt-12 flex justify-center gap-12 text-white/20 text-[10px] font-black tracking-[0.2em] uppercase">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={16} className="text-gold" />
          Autoridade VERTUS
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 size={16} className="text-gold" />
          Diagnóstico Técnico
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 size={16} className="text-gold" />
          Análise Estratégica
        </div>
      </div>
    </div>
  );
}
