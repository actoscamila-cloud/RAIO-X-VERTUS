import React from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  CheckCircle2, 
  CreditCard, 
  TrendingUp, 
  Scale, 
  LineChart, 
  FolderKanban, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  MessageSquare
} from "lucide-react";
import { VERTUS_WHATSAPP_LINK, VIX_WHATSAPP_LINK } from "../constants";

interface BpoVertusDetailProps {
  onBack: () => void;
}

export default function BpoVertusDetail({ onBack }: BpoVertusDetailProps) {
  const whatWeDo = [
    {
      title: "Gestão de Contas a Pagar",
      desc: "Pagamentos em dia e controle total dos seus compromissos, eliminando atrasos e multas.",
      icon: CreditCard,
    },
    {
      title: "Gestão de Contas a Receber",
      desc: "Acompanhamento rigoroso dos recebimentos futuros, faturamento em dia e redução ativa da inadimplência.",
      icon: TrendingUp,
    },
    {
      title: "Conciliação Financeira",
      desc: "Conferência minuciosa de todas as movimentações bancárias para garantir 100% de precisão nos números.",
      icon: Scale,
    },
    {
      title: "Análise de Fluxo de Caixa",
      desc: "Atualização diária e projeção futura do caixa para você saber exatamente o fôlego financeiro da sua empresa.",
      icon: LineChart,
    },
    {
      title: "Organização Financeira Geral",
      desc: "Sua documentação e relatórios estruturados de forma centralizada e organizada com ferramentas de ponta.",
      icon: FolderKanban,
    },
  ];

  const gains = [
    { text: "Controle financeiro absoluto da operação", icon: ShieldCheck },
    { text: "Prevenção de erros operacionais e retrabalho", icon: Zap },
    { text: "Muito mais previsibilidade do fluxo de caixa", icon: LineChart },
    { text: "Painel com informações financeiras sempre atualizadas", icon: Sparkles },
    { text: "Garante muito mais tempo livre para você focar no core business", icon: Clock },
    { text: "Segurança total e tranquilidade plena no dia a dia", icon: ShieldCheck },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10 relative">
      {/* Back button and title bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-gold hover:border-gold/30 transition-all group"
            id="bpo_vix_back_btn"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">Soluções Exclusivas</span>
              <span className="w-1.5 h-1.5 bg-gold rounded-full animate-ping" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-0.5">
              BPO <span className="text-gold">VERTUS</span>
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-xs font-bold uppercase tracking-wider hidden lg:inline">
            Estruturação Financeira Empresarial
          </span>
          <button
            onClick={() => window.open(VERTUS_WHATSAPP_LINK + "?text=Olá!%20Gostaria%20de%20uma%20proposta%20para%20o%20BPO%20Vertus.", "_blank")}
            className="px-4 py-2.5 bg-gold text-vertus-black text-xs font-black uppercase tracking-wider rounded-xl hover:scale-102 transition-all flex items-center gap-2 shadow-md shadow-gold/20"
            id="bpo_vix_top_cta"
          >
            <MessageSquare size={14} />
            Solicitar Proposta
          </button>
        </div>
      </div>

      {/* Hero section */}
      <div className="grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-block px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-gold text-[9px] font-black uppercase tracking-widest">
            Destaque do Portfólio
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            BPO <span className="text-gold">FINANCEIRO</span>
          </h1>
          <p className="text-base sm:text-lg text-white/80 font-bold tracking-tight">
            Organização e controle de excelência para a operação financeira da sua empresa.
          </p>
          <p className="text-white/60 text-xs sm:text-sm leading-relaxed max-w-xl font-medium">
            Assumimos integralmente toda a rotina financeira do seu negócio. Cuidamos das tarefas operacionais repetitivas com precisão cirúrgica e compliance rigoroso, garantindo que você foque 100% no crescimento do seu negócio enquanto nós blindamos o seu caixa.
          </p>
          
          {/* Tagline Box */}
          <div className="p-4 bg-vertus-gray/30 border border-white/5 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gold" />
            <p className="text-white/90 text-xs italic font-semibold leading-relaxed">
              &ldquo;Assumimos a rotina financeira da sua empresa para garantir organização, previsibilidade e segurança no dia a dia.&rdquo;
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 p-5 sm:p-6 bg-vertus-gray border border-white/10 rounded-2xl shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 px-5 py-2 bg-gold text-vertus-black text-[9px] font-black uppercase tracking-widest rounded-bl-2xl">
            Solução Completa
          </div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4">
            O QUE FAZEMOS
          </h3>
          <div className="space-y-4">
            {whatWeDo.map((item, i) => {
              const IconComp = item.icon;
              return (
                <div key={i} className="flex gap-3 items-start group/item">
                  <div className="p-2 bg-gold/10 border border-gold/20 rounded-lg text-gold group-hover/item:bg-gold group-hover/item:text-vertus-black transition-colors shrink-0">
                    <IconComp size={16} />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">{item.title}</h4>
                    <p className="text-[11px] text-white/50 leading-relaxed font-semibold">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits section */}
      <div className="grid lg:grid-cols-12 gap-6 items-stretch pt-4">
        <div className="lg:col-span-5 p-6 sm:p-8 bg-vertus-gray/30 border border-white/5 rounded-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-10 h-10 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center text-gold">
              <Sparkles size={20} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-snug">
              O QUE A SUA EMPRESA GANHA
            </h3>
            <p className="text-white/70 text-xs sm:text-sm font-semibold leading-relaxed">
              Ao delegar o operacional financeiro da sua empresa para os especialistas de elite da Vertus, todo o cenário de gestão de caixa, contas e processos muda imediatamente para melhor — com segurança e eficiência máxima.
            </p>
          </div>
          <div className="p-5 bg-gold text-vertus-black rounded-2xl space-y-1 shadow-lg shadow-gold/10">
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Nosso Compromisso</p>
            <p className="text-base sm:text-lg font-black uppercase tracking-tight leading-snug">
              Você cuida do crescimento. Nós cuidamos do financeiro.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 grid md:grid-cols-2 gap-4">
          {gains.map((gain, i) => {
            const IconComp = gain.icon;
            return (
              <div key={i} className="p-4 bg-vertus-gray border border-white/10 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-all space-y-3 shadow-md">
                <div className="p-2 bg-gold/10 border border-gold/20 rounded-lg text-gold w-fit">
                  <IconComp size={16} />
                </div>
                <p className="text-xs font-black text-white uppercase tracking-wide leading-relaxed">
                  {gain.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Big Action Box */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-vertus-gray to-black border border-gold/30 rounded-2xl text-center space-y-5 relative overflow-hidden shadow-xl max-w-3xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-full h-full -skew-x-12 animate-shine pointer-events-none" />
        <div className="max-w-xl mx-auto space-y-2">
          <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-snug">
            TRANSFORME O CAOS FINANCEIRO EM CONTROLE AGORA MESMO!
          </h3>
          <p className="text-white/60 text-xs sm:text-sm font-semibold max-w-lg mx-auto">
            Fale diretamente com os nossos analistas estratégicos e receba uma proposta customizada para o BPO VERTUS, desenhada sob medida para o tamanho da sua operação.
          </p>
        </div>
        <button
          onClick={() => window.open(VERTUS_WHATSAPP_LINK + "?text=Olá!%20Gostaria%20de%20organizar%20minha%20operação%20financeira%20com%20o%20BPO%20Vertus.", "_blank")}
          className="px-8 py-3.5 bg-gradient-to-br from-gold to-gold-dark text-vertus-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-102 transition-all shadow-lg shadow-gold/20 inline-flex items-center gap-2.5"
          id="bpo_vix_footer_cta"
        >
          <MessageSquare size={16} />
          <span>FALAR COM NOSSO TIME NO WHATSAPP</span>
        </button>
      </div>
    </div>
  );
}

export const BpoVixDetail = BpoVertusDetail;
