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
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-16 relative">
      {/* Back button and title bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-gold hover:border-gold/30 transition-all group"
            id="bpo_vix_back_btn"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-gold uppercase tracking-[0.4em]">Soluções Exclusivas</span>
              <span className="w-1.5 h-1.5 bg-gold rounded-full animate-ping" />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mt-1">
              BPO <span className="text-gold">VERTUS</span>
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-xs font-bold uppercase tracking-widest hidden lg:inline">
            Estruturação Financeira Empresarial
          </span>
          <button
            onClick={() => window.open(VERTUS_WHATSAPP_LINK + "?text=Olá!%20Gostaria%20de%20uma%20proposta%20para%20o%20BPO%20Vertus.", "_blank")}
            className="px-6 py-3 bg-gold text-vertus-black text-xs font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-gold/20"
            id="bpo_vix_top_cta"
          >
            <MessageSquare size={14} />
            Solicitar Proposta
          </button>
        </div>
      </div>

      {/* Hero section */}
      <div className="grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-block px-4 py-1 bg-gold/10 border border-gold/30 rounded-full text-gold text-[10px] font-black uppercase tracking-widest">
            Destaque do Portfólio
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
            BPO <br className="hidden md:inline" />
            <span className="text-gold">FINANCEIRO</span>
          </h1>
          <p className="text-xl text-white/80 font-bold tracking-tight">
            Organização e controle de excelência para a operação financeira da sua empresa.
          </p>
          <p className="text-white/60 text-base leading-relaxed max-w-xl font-medium">
            Assumimos integralmente toda a rotina financeira do seu negócio. Cuidamos das tarefas operacionais repetitivas com precisão cirúrgica e compliance rigoroso, garantindo que você foque 100% no crescimento do seu negócio enquanto nós blindamos o seu caixa.
          </p>
          
          {/* Tagline Box */}
          <div className="p-6 bg-vertus-gray/30 border border-white/5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gold" />
            <p className="text-white/90 text-sm italic font-semibold leading-relaxed">
              &ldquo;Assumimos a rotina financeira da sua empresa para garantir organização, previsibilidade e segurança no dia a dia.&rdquo;
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 p-8 bg-vertus-gray border border-white/10 rounded-[40px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 px-8 py-3 bg-gold text-vertus-black text-[10px] font-black uppercase tracking-widest rounded-bl-3xl">
            Solução Completa
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-6">
            O QUE FAZEMOS
          </h3>
          <div className="space-y-6">
            {whatWeDo.map((item, i) => {
              const IconComp = item.icon;
              return (
                <div key={i} className="flex gap-4 items-start group/item">
                  <div className="p-3 bg-gold/10 border border-gold/20 rounded-xl text-gold group-hover/item:bg-gold group-hover/item:text-vertus-black transition-colors shrink-0">
                    <IconComp size={18} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-white uppercase tracking-wider">{item.title}</h4>
                    <p className="text-xs text-white/50 leading-relaxed font-semibold">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits section */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch pt-8">
        <div className="lg:col-span-5 p-8 md:p-10 bg-vertus-gray/30 border border-white/5 rounded-[40px] flex flex-col justify-between space-y-10">
          <div className="space-y-6">
            <div className="w-12 h-12 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center text-gold">
              <Sparkles size={24} />
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
              O QUE A SUA EMPRESA GANHA
            </h3>
            <p className="text-white/70 text-base md:text-lg font-semibold leading-relaxed">
              Ao delegar o operacional financeiro da sua empresa para os especialistas de elite da Vertus, todo o cenário de gestão de caixa, contas e processos muda imediatamente para melhor — com segurança e eficiência máxima.
            </p>
          </div>
          <div className="p-6 md:p-8 bg-gold text-vertus-black rounded-3xl space-y-1.5 shadow-xl shadow-gold/10">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Nosso Compromisso</p>
            <p className="text-lg md:text-xl font-black uppercase tracking-tight leading-snug">
              Você cuida do crescimento. Nós cuidamos do financeiro.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 grid md:grid-cols-2 gap-6">
          {gains.map((gain, i) => {
            const IconComp = gain.icon;
            return (
              <div key={i} className="p-6 bg-vertus-gray border border-white/10 rounded-3xl flex flex-col justify-between hover:border-white/20 transition-all space-y-4">
                <div className="p-2.5 bg-gold/10 border border-gold/20 rounded-xl text-gold w-fit">
                  <IconComp size={20} />
                </div>
                <p className="text-sm font-black text-white uppercase tracking-wide leading-relaxed">
                  {gain.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Big Action Box */}
      <div className="p-8 md:p-12 bg-gradient-to-br from-vertus-gray to-black border-2 border-gold/40 rounded-[48px] text-center space-y-8 relative overflow-hidden shadow-2xl shadow-gold/5 max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-full h-full -skew-x-12 animate-shine pointer-events-none" />
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none">
            TRANSFORME O CAOS FINANCEIRO EM CONTROLE AGORA MESMO!
          </h3>
          <p className="text-white/60 text-sm md:text-base font-semibold max-w-lg mx-auto">
            Fale diretamente com os nossos analistas estratégicos e receba uma proposta customizada para o BPO VERTUS, desenhada sob medida para o tamanho da sua operação.
          </p>
        </div>
        <button
          onClick={() => window.open(VERTUS_WHATSAPP_LINK + "?text=Olá!%20Gostaria%20de%20organizar%20minha%20operação%20financeira%20com%20o%20BPO%20Vertus.", "_blank")}
          className="px-12 py-6 bg-gradient-to-br from-gold to-gold-dark text-vertus-black font-black text-base uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-gold/20 inline-flex items-center gap-3"
          id="bpo_vix_footer_cta"
        >
          <MessageSquare size={18} />
          <span>FALAR COM NOSSO TIME NO WHATSAPP</span>
        </button>
      </div>
    </div>
  );
}

export const BpoVixDetail = BpoVertusDetail;
