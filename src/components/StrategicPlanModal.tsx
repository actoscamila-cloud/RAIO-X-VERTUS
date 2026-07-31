import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, MessageSquare, Sparkles, ShieldCheck, ArrowRight, CheckCircle2, Clock, Users, Building2 } from "lucide-react";
import { Lead, DiagnosisResponse } from "../types";
import { VERTUS_WHATSAPP_LINK } from "../constants";

interface StrategicPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  diagnosis?: DiagnosisResponse;
  onOpenAboutVertus?: () => void;
}

export default function StrategicPlanModal({ isOpen, onClose, lead, diagnosis, onOpenAboutVertus }: StrategicPlanModalProps) {
  const [activeTab, setActiveTab] = useState<"calendly" | "whatsapp">("calendly");

  const handleAboutClick = () => {
    if (onOpenAboutVertus) {
      onOpenAboutVertus();
    }
    window.dispatchEvent(new CustomEvent("open-about-vertus"));
  };

  if (!isOpen) return null;

  const companyName = lead.companyName || "Sua Empresa";
  const responsibleName = lead.responsibleName || "Gestor";
  const score = diagnosis?.score ?? 0;
  const monthlyLoss = diagnosis?.monthlyLoss ?? 0;

  const whatsappMessage = encodeURIComponent(
    `Olá! Sou ${responsibleName}, da empresa ${companyName}. Fiz o Raio-X Financeiro VERTUS (Score: ${score}/100) e gostaria de agendar a entrega personalizada do meu Plano de Ação Estratégico!`
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 pt-20 sm:pt-24 pb-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-vertus-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-vertus-gray border border-gold/30 rounded-2xl shadow-2xl overflow-hidden my-auto z-10 text-left"
        >
          {/* Top Bar */}
          <div className="bg-white/[0.03] border-b border-white/10 px-4 sm:px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center border border-gold/20 text-gold shrink-0">
                <Sparkles size={16} />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gold block">
                  Sessão Estratégica VERTUS
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-tight">
                  Seu Plano de Ação Personalizado Está Pronto
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-5">
            {/* Context Notice & Value Frame */}
            <div className="bg-gradient-to-br from-gold/15 via-gold/5 to-transparent border border-gold/25 rounded-xl p-4 sm:p-5 space-y-3.5">
              <div className="flex items-center gap-2 text-gold">
                <ShieldCheck size={16} />
                <span className="text-xs font-black uppercase tracking-wider">
                  Atendimento Estratégico Personalizado
                </span>
              </div>

              {/* Value Highlight Notice */}
              <div className="bg-vertus-black/60 border border-gold/20 rounded-lg px-3.5 py-2.5 text-[11px] text-gold/90 font-medium flex items-start gap-2">
                <Sparkles size={14} className="text-gold shrink-0 mt-0.5" />
                <span>
                  <strong>Entrega Exclusiva:</strong> Esta sessão individual normalmente faz parte dos nossos projetos corporativos de consultoria, mas foi disponibilizada gratuitamente como continuidade do seu diagnóstico financeiro.
                </span>
              </div>

              <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-medium">
                Você já identificou os principais gargalos da sua empresa. Agora, um estrategista da VERTUS irá transformar esse diagnóstico em um plano executável para que você saiba exatamente:
              </p>

              <ul className="space-y-1.5 text-xs text-white/90 font-medium pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-gold font-bold">•</span>
                  <span><strong>O que precisa ser corrigido primeiro:</strong> Estancamento rápido dos gargalos operacionais e financeiros.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold font-bold">•</span>
                  <span><strong>Quais ações geram resultado mais rápido:</strong> Foco em margem de lucro e otimização de caixa.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold font-bold">•</span>
                  <span><strong>Plano prático de 30, 60 e 90 dias:</strong> Cronograma estruturado e aplicável à realidade do seu negócio.</span>
                </li>
              </ul>

              {/* 3 Benefit Cards */}
              <div className="grid sm:grid-cols-3 gap-2 pt-2">
                <div className="p-2.5 bg-vertus-black/50 border border-white/10 rounded-lg flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-gold shrink-0" />
                  <span className="text-[10px] font-bold text-white/90 uppercase">Priorização dos Gargalos</span>
                </div>
                <div className="p-2.5 bg-vertus-black/50 border border-white/10 rounded-lg flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-gold shrink-0" />
                  <span className="text-[10px] font-bold text-white/90 uppercase">Plano de Ação 30/60/90 Dias</span>
                </div>
                <div className="p-2.5 bg-vertus-black/50 border border-white/10 rounded-lg flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-gold shrink-0" />
                  <span className="text-[10px] font-bold text-white/90 uppercase">Estratégia de Execução</span>
                </div>
              </div>
            </div>

            {/* What happens in this meeting section */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-gold flex items-center gap-2">
                <Clock size={14} />
                O que acontece nesta reunião?
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Durante aproximadamente 30 minutos, um especialista da VERTUS apresentará seu diagnóstico detalhado, explicará os principais riscos identificados e entregará seu plano de ação personalizado para os próximos 30, 60 e 90 dias. Ao final, você poderá decidir se prefere implementar o plano por conta própria ou contar com o apoio da nossa equipe.
              </p>
            </div>

            {/* Trust / Authority CTA for hesitant leads */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-gold/15 via-gold/5 to-transparent border border-gold/30 p-3.5 sm:p-4 rounded-xl shadow-md">
              <div className="flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-lg bg-gold/20 border border-gold/40 flex items-center justify-center text-gold shrink-0">
                  <Building2 size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Quer entender mais sobre quem é a VERTUS?</span>
                  <span className="text-[10px] text-white/60 block">Conheça nossa autoridade, metodologia e os estrategistas por trás da sua entrega.</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAboutClick}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black font-black text-[11px] uppercase tracking-wider rounded-lg hover:scale-[1.02] transition-all shrink-0 flex items-center justify-center gap-2 border border-white/20 shadow-md cursor-pointer"
              >
                <Sparkles size={14} />
                <span>Conheça a VERTUS</span>
              </button>
            </div>

            {/* Action Toggles */}
            <div className="space-y-4">
              <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab("calendly")}
                  className={`flex-1 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    activeTab === "calendly"
                      ? "bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black shadow-lg"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <Calendar size={15} />
                  Agendar Reunião no Calendly
                </button>
                <button
                  onClick={() => setActiveTab("whatsapp")}
                  className={`flex-1 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    activeTab === "whatsapp"
                      ? "bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black shadow-lg"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <MessageSquare size={15} />
                  Agendar via WhatsApp
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "calendly" ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs text-white/50">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-gold" />
                      Escolha o melhor dia e horário para sua empresa
                    </span>
                    <a
                      href="https://calendly.com/vertus-mnunes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:underline text-[10px] font-bold uppercase tracking-wider"
                    >
                      Abrir em nova aba ↗
                    </a>
                  </div>

                  {/* Calendly Embedded Iframe */}
                  <div className="w-full h-[480px] bg-white rounded-xl overflow-hidden border border-white/10 shadow-inner">
                    <iframe
                      src="https://calendly.com/vertus-mnunes?embed_domain=vertus.com&embed_type=Inline"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      title="Agendamento Calendly Vertus"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-vertus-black/60 border border-white/10 rounded-xl p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500">
                    <MessageSquare size={22} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white uppercase tracking-tight">Atendimento Direto com Estrategista</h4>
                    <p className="text-xs text-white/60 max-w-md mx-auto">
                      Se preferir um contato imediato para combinar o horário da entrega personalizada, fale diretamente com nossa equipe no WhatsApp.
                    </p>
                  </div>

                  <a
                    href={`${VERTUS_WHATSAPP_LINK}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-green-600 hover:bg-green-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:scale-[1.01]"
                  >
                    <MessageSquare size={16} />
                    Falar no WhatsApp Agora
                    <ArrowRight size={14} />
                  </a>
                </div>
              )}

              {/* Trust / Authority CTA right below scheduling frame */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-gold/15 via-gold/5 to-transparent border border-gold/30 p-4 rounded-xl shadow-md">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-lg bg-gold/20 border border-gold/40 flex items-center justify-center text-gold shrink-0">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Quer entender mais sobre quem é a VERTUS?</span>
                    <span className="text-[10px] text-white/60 block">Conheça nossa autoridade, metodologia e os estrategistas por trás da sua entrega.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAboutClick}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black font-black text-[11px] uppercase tracking-wider rounded-lg hover:scale-[1.02] transition-all shrink-0 flex items-center justify-center gap-2 border border-white/20 shadow-md cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>Conheça a VERTUS</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
