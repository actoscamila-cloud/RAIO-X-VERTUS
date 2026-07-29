import React, { useState } from 'react';
import { DIAGNOSTIC_PILLARS, DIAGNOSTIC_QUESTIONS } from '../data/defaultDiagnostic';
import { CheckCircle2, ChevronRight, ChevronLeft, HelpCircle, ArrowRight } from 'lucide-react';

interface PillarsQuestionnaireProps {
  answers: Record<string, number>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  onFinish: () => void;
  onBack: () => void;
}

export const PillarsQuestionnaire: React.FC<PillarsQuestionnaireProps> = ({
  answers,
  setAnswers,
  onFinish,
  onBack,
}) => {
  const [activePillarIndex, setActivePillarIndex] = useState(0);

  const currentPillar = DIAGNOSTIC_PILLARS[activePillarIndex];
  const currentQuestions = DIAGNOSTIC_QUESTIONS.filter((q) => q.pillarId === currentPillar.id);

  const handleOptionSelect = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = DIAGNOSTIC_QUESTIONS.length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const isCurrentPillarComplete = currentQuestions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Progress Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Etapa 2 de 3: Questionário de Gestão
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {answeredCount} de {totalQuestions} perguntas respondidas
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Avaliação dos 5 Pilares de Saúde Financeira
          </h2>
        </div>

        <div className="w-full md:w-64 space-y-1.5">
          <div className="flex justify-between text-xs text-slate-600 font-medium">
            <span>Progresso Geral</span>
            <span className="font-bold text-teal-700">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
            <div
              className="bg-teal-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Pillars Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin">
        {DIAGNOSTIC_PILLARS.map((pillar, idx) => {
          const pillarQuestions = DIAGNOSTIC_QUESTIONS.filter((q) => q.pillarId === pillar.id);
          const isComplete = pillarQuestions.every((q) => answers[q.id] !== undefined);
          const isActive = idx === activePillarIndex;

          return (
            <button
              key={pillar.id}
              onClick={() => setActivePillarIndex(idx)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : isComplete
                  ? 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100/60'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  isActive
                    ? 'bg-teal-500 text-white'
                    : isComplete
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isComplete ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
              </span>
              <div>
                <div className="whitespace-nowrap">{pillar.title}</div>
                <div className={`text-[10px] font-normal ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                  Peso: {pillar.weight * 100}%
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Pillar Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
            Pilar {activePillarIndex + 1} de {DIAGNOSTIC_PILLARS.length}
          </div>
          <h3 className="text-xl font-bold text-slate-900">{currentPillar.title}</h3>
          <p className="text-sm text-slate-600 mt-0.5">{currentPillar.description}</p>
        </div>

        {/* Questions List */}
        <div className="space-y-8">
          {currentQuestions.map((question, qIdx) => (
            <div key={question.id} className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  Q{qIdx + 1}
                </span>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">{question.question}</h4>
                  {question.description && (
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      {question.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Options Radio List */}
              <div className="grid grid-cols-1 gap-2.5 pt-2">
                {question.options.map((option, optIdx) => {
                  const isSelected = answers[question.id] === option.value;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleOptionSelect(question.id, option.value)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-teal-50/90 border-teal-600 text-teal-950 font-medium ring-1 ring-teal-600 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/50'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div className="flex-1">
                        <span>{option.label}</span>
                        {isSelected && option.recommendation && (
                          <div className="mt-1.5 text-xs text-teal-800 font-normal bg-teal-100/60 p-2 rounded-lg border border-teal-200/50">
                            💡 <span className="font-semibold">Sugestão Vertus:</span> {option.recommendation}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <button
            onClick={() => {
              if (activePillarIndex > 0) setActivePillarIndex(activePillarIndex - 1);
              else onBack();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {activePillarIndex === 0 ? 'Voltar para Dados' : 'Pilar Anterior'}
          </button>

          {activePillarIndex < DIAGNOSTIC_PILLARS.length - 1 ? (
            <button
              onClick={() => setActivePillarIndex(activePillarIndex + 1)}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow transition-all"
            >
              Próximo Pilar ({DIAGNOSTIC_PILLARS[activePillarIndex + 1].title})
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onFinish}
              className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all"
            >
              Gerar Relatório & Score Vertus
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
