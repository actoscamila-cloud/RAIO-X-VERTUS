import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TRAINING_MODULES } from "../constants";
import { TrainingModule } from "../types";
import { BookOpen, CheckCircle2, Play, ArrowRight, HelpCircle, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

interface TrainingModulesProps {
  onComplete: () => void;
  isAlreadyComplete?: boolean;
  onBack?: () => void;
}

export default function TrainingModules({ onComplete, isAlreadyComplete, onBack }: TrainingModulesProps) {
  React.useEffect(() => {
    console.log("TrainingModules mounted");
  }, []);

  const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizFeedback, setQuizFeedback] = useState<boolean | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const currentModule = TRAINING_MODULES[currentModuleIdx];
  const isLastModule = currentModuleIdx === TRAINING_MODULES.length - 1;

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setQuizAnswers([]);
    setQuizFeedback(null);
  };

  const handleQuizAnswer = (questionIdx: number, answerIdx: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIdx] = answerIdx;
    setQuizAnswers(newAnswers);
  };

  const handleSubmitQuiz = () => {
    const isCorrect = currentModule.quiz.every((q, i) => q.correctIndex === quizAnswers[i]);
    setQuizFeedback(isCorrect);
    
    if (isCorrect) {
      if (!completedModules.includes(currentModule.id)) {
        setCompletedModules([...completedModules, currentModule.id]);
      }
    }
  };

  const handleNext = () => {
    if (isLastModule) {
      onComplete();
    } else {
      setCurrentModuleIdx(prev => prev + 1);
      setShowQuiz(false);
      setQuizFeedback(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="mb-12 text-center space-y-4">
        <div className="flex justify-between items-center mb-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="text-white/40 hover:text-white transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest"
            >
              <ArrowRight size={16} className="rotate-180" />
              Voltar
            </button>
          )}
          {isAlreadyComplete && (
            <button 
              onClick={onComplete}
              className="px-4 py-2 bg-gold/10 border border-gold/20 rounded-xl text-gold text-[10px] font-black tracking-widest uppercase hover:bg-gold/20 transition-all"
            >
              Pular para o Plano de Ação
            </button>
          )}
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black tracking-widest uppercase">
          <BookOpen size={12} />
          Treinamento Financeiro Progressivo
        </div>
        <h2 className="text-3xl font-bold text-white uppercase tracking-tight">
          Capacitação <span className="text-gold">Estratégica</span>
        </h2>
        <div className="flex justify-center gap-2 mt-6">
          {TRAINING_MODULES.map((m, i) => (
            <div 
              key={m.id}
              className={cn(
                "h-1 w-12 rounded-full transition-all",
                i === currentModuleIdx ? "bg-gold w-20" : 
                completedModules.includes(m.id) ? "bg-gold/40" : "bg-white/10"
              )}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentModule.id + (showQuiz ? "-quiz" : "-content")}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-vertus-gray border border-white/10 rounded-[40px] p-12 shadow-2xl relative overflow-hidden"
        >
          {!showQuiz ? (
            <div className="space-y-10">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{currentModule.title}</h3>
                <p className="text-white/60 leading-relaxed text-lg">{currentModule.content}</p>
              </div>

              <div className="bg-gold/5 border border-gold/10 rounded-2xl p-6 space-y-3">
                <h4 className="text-xs font-black text-gold uppercase tracking-widest flex items-center gap-2">
                  <Play size={14} /> Exemplo Prático
                </h4>
                <p className="text-white/80 italic text-sm leading-relaxed">"{currentModule.example}"</p>
              </div>

              <button
                onClick={handleStartQuiz}
                className="group relative w-full py-6 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black font-black text-sm tracking-widest uppercase rounded-2xl shadow-2xl shadow-gold/20 hover:shadow-gold/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-4 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full -skew-x-12 animate-shine pointer-events-none" />
                <span className="relative z-10">TESTAR MEU CONHECIMENTO</span>
                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
                  <HelpCircle className="text-gold" size={24} />
                  Quiz de Validação
                </h3>
                <p className="text-white/40 text-sm">Responda corretamente para desbloquear o próximo nível.</p>
              </div>

              <div className="space-y-8">
                {currentModule.quiz.map((q, qIdx) => (
                  <div key={qIdx} className="space-y-4">
                    <p className="text-white font-medium">{qIdx + 1}. {q.question}</p>
                    <div className="grid gap-3">
                      {q.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleQuizAnswer(qIdx, oIdx)}
                          className={cn(
                            "p-4 rounded-xl border text-left text-sm transition-all",
                            quizAnswers[qIdx] === oIdx 
                              ? "bg-gold/20 border-gold text-white" 
                              : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {quizFeedback === null ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={quizAnswers.length < currentModule.quiz.length || quizAnswers.includes(undefined as any)}
                  className="w-full py-4 bg-white/10 border border-white/10 text-white font-black text-sm tracking-widest uppercase rounded-xl hover:bg-white/20 transition-all disabled:opacity-50"
                >
                  VALIDAR RESPOSTAS
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-6 rounded-2xl border flex flex-col items-center text-center gap-4",
                    quizFeedback ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
                  )}
                >
                  {quizFeedback ? (
                    <>
                      <CheckCircle2 className="text-green-500" size={40} />
                      <div>
                        <h4 className="text-green-500 font-bold uppercase tracking-widest text-sm">Excelente!</h4>
                        <p className="text-white/60 text-sm mt-1">Você absorveu os conceitos fundamentais deste módulo.</p>
                      </div>
                      <button
                        onClick={handleNext}
                        className="group relative w-full py-6 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black font-black text-sm tracking-widest uppercase rounded-2xl shadow-2xl shadow-gold/20 hover:shadow-gold/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-4 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full -skew-x-12 animate-shine pointer-events-none" />
                        <span className="relative z-10">{isLastModule ? "VER MEU PLANO DE AÇÃO" : "PRÓXIMO MÓDULO"}</span>
                        <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                      </button>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="text-red-500" size={40} />
                      <div>
                        <h4 className="text-red-500 font-bold uppercase tracking-widest text-sm">Ops, quase lá!</h4>
                        <p className="text-white/60 text-sm mt-1">Revise o conteúdo e tente novamente para garantir sua clareza.</p>
                      </div>
                      <button
                        onClick={() => setQuizFeedback(null)}
                        className="w-full py-4 bg-white/10 border border-white/10 text-white font-black text-sm tracking-widest uppercase rounded-xl hover:bg-white/20 transition-all"
                      >
                        TENTAR NOVAMENTE
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
