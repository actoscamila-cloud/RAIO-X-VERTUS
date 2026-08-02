import React from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Bot, 
  Users, 
  Check, 
  Compass, 
  HelpCircle, 
  Clock, 
  TrendingUp, 
  Target, 
  LineChart, 
  FolderKanban, 
  FileText, 
  ChevronRight, 
  ArrowRight,
  Zap,
  Activity,
  Layers,
  Building2,
  X,
  Lock,
  Eye,
  Award,
  BarChart3,
  CheckSquare,
  ArrowUpRight
} from "lucide-react";
import { VERTUS_WHATSAPP_LINK } from "../constants";

interface BpoVertusDetailProps {
  onBack: () => void;
  onNavigateToDiagnosis?: () => void;
  onNavigateToAboutVertus?: () => void;
}

export default function BpoVertusDetail({ 
  onBack, 
  onNavigateToDiagnosis,
  onNavigateToAboutVertus 
}: BpoVertusDetailProps) {

  const handleNavigateDiagnosis = () => {
    if (onNavigateToDiagnosis) {
      onNavigateToDiagnosis();
    } else {
      window.dispatchEvent(new CustomEvent("navigate-to-diagnosis"));
      onBack();
    }
  };

  const handleNavigateAbout = () => {
    if (onNavigateToAboutVertus) {
      onNavigateToAboutVertus();
    } else {
      window.dispatchEvent(new CustomEvent("open-about-vertus"));
    }
  };

  const handleWhatsAppDirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = "Olá! Gostaria de entender mais detalhes sobre como funciona a operação financeira estruturada da VERTUS para minha empresa.";
    window.open(`${VERTUS_WHATSAPP_LINK}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const SectionDivider = () => (
    <div className="w-full flex items-center justify-center py-1.5">
      <div className="h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
    </div>
  );

  const scrollToHowItWorks = () => {
    const el = document.getElementById("como-funciona");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-9 sm:space-y-11 relative font-sans text-white">
      
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 sm:px-3 sm:py-2 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-gold hover:bg-white/10 hover:border-gold/30 transition-all group flex items-center gap-2 text-xs font-bold cursor-pointer"
            id="bpo_vertus_back_btn"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-gold" />
            <span className="hidden sm:inline">Voltar</span>
          </button>
          <div className="h-5 w-px bg-white/15" />
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold block">
              Atuação Estruturada
            </span>
            <h1 className="text-xs sm:text-sm font-black uppercase tracking-tight text-white flex items-center gap-1.5">
              <span>VERTUS Performance</span>
              <span className="px-2 py-0.5 rounded bg-gold/15 text-gold text-[9px] font-extrabold uppercase tracking-widest border border-gold/30">
                Como Trabalhamos
              </span>
            </h1>
          </div>
        </div>

        <button 
          onClick={handleNavigateDiagnosis}
          className="px-3.5 py-2 bg-gradient-to-r from-gold/20 via-gold/10 to-transparent border border-gold/40 hover:border-gold rounded-xl text-xs font-bold text-gold hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-gold/5"
        >
          <span className="text-[10px] uppercase font-black tracking-wider">Ir ao Diagnóstico</span>
          <ChevronRight size={14} className="text-gold" />
        </button>
      </header>

      {/* BLOCO 1 — HERO */}
      <section className="relative text-center pt-2 pb-2 space-y-5">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/10 blur-[130px] rounded-full pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 border border-gold/40 rounded-full text-gold text-[10px] font-black tracking-[0.25em] uppercase shadow-[0_0_20px_rgba(212,175,55,0.15)]"
        >
          <Sparkles size={14} className="animate-pulse text-gold" />
          NOSSA FORMA DE ATUAÇÃO PRÁTICA
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[1.12] text-white">
            Você continua conduzindo o seu negócio.
          </h2>
          <p className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-gold-dark leading-snug">
            A Vertus estrutura a operação financeira para que ela funcione com organização, previsibilidade e segurança.
          </p>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="text-xs sm:text-sm text-white/70 max-w-3xl mx-auto font-medium leading-relaxed"
        >
          Empresas crescem quando deixam de depender do improviso financeiro. Nossa equipe organiza processos, conduz a operação financeira e acompanha continuamente sua evolução para que você tenha informações confiáveis e possa tomar decisões com tranquilidade.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="pt-2 space-y-4"
        >
          <div className="flex justify-center">
            <button 
              onClick={scrollToHowItWorks}
              className="px-8 py-3.5 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-[1.03] active:scale-[0.98] transition-all shadow-xl shadow-gold/25 flex items-center gap-2.5 cursor-pointer group"
            >
              <span>Ver as 6 Etapas do Nosso Processo</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto pt-2">
            {[
              { label: "Método Exclusivo", desc: "Processos sem improvisos", icon: ShieldCheck },
              { label: "Equipe Especializada", desc: "Time dedicado à operação", icon: Users },
              { label: "Tecnologia como Apoio", desc: "Plataforma Vertus + IA", icon: Cpu },
              { label: "Visão 30/60/90 Dias", desc: "DFC projetado contínuo", icon: LineChart }
            ].map((pillar, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -3, scale: 1.02 }}
                className="p-3 bg-white/[0.03] border border-white/10 hover:border-gold/40 rounded-xl text-left space-y-1 transition-all group"
              >
                <div className="flex items-center gap-2 text-gold">
                  <pillar.icon size={15} className="group-hover:scale-110 transition-transform shrink-0" />
                  <span className="text-[11px] font-black uppercase text-white tracking-tight">{pillar.label}</span>
                </div>
                <p className="text-[10px] text-white/50 leading-tight pl-5">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* BLOCO 2 — IDENTIFICAÇÃO COM A REALIDADE */}
      <SectionDivider />

      <section className="bg-vertus-gray/90 border border-white/10 rounded-2xl p-5 sm:p-7 space-y-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[90px] rounded-full pointer-events-none" />
        
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">A Realidade do Empresário</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-tight">
            O empresário não deveria ser o responsável por manter o financeiro funcionando.
          </h3>
          <p className="text-xs text-white/60">
            Identifica algum destes gargalos operacionais no seu dia a dia?
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { title: "Acompanhamento de Pagamentos", desc: "Conferir vencimentos diários, comprovantes e autorizar cada saída manualmente." },
            { title: "Resolução de Pendências", desc: "Correr atrás de boletos, notas fiscais perdidas e cobranças de fornecedores." },
            { title: "Busca por Informações", desc: "Tentar entender para onde o dinheiro foi no meio de extratos bancários misturados." },
            { title: "Organização de Planilhas", desc: "Manter planilhas paralelas atualizadas que raramente batem com o saldo real do banco." },
            { title: "Margem Desconhecida", desc: "Descobrir apenas no fim do mês quanto sobrou ou se a empresa operou no prejuízo." },
            { title: "Desvio de Foco Estratégico", desc: "Deixar de vender, negociar e expandir para resolver tarefas operacionais repetitivas." }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              whileHover={{ y: -4, scale: 1.015 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="bg-black/50 border border-white/10 hover:border-gold/50 rounded-xl p-4 space-y-2 group transition-all duration-300 shadow-md hover:shadow-gold/5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="w-7 h-7 rounded-lg bg-gold/10 border border-gold/25 text-gold flex items-center justify-center group-hover:bg-gold group-hover:text-vertus-black transition-colors">
                    <HelpCircle size={15} />
                  </div>
                  <span className="text-[9px] font-mono text-white/30 uppercase">Gargalo #{idx + 1}</span>
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-tight group-hover:text-gold transition-colors">{item.title}</h4>
                <p className="text-[11px] text-white/60 leading-relaxed font-normal">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-4 bg-gradient-to-r from-gold/15 via-gold/5 to-transparent border-l-4 border-gold rounded-r-xl">
          <p className="text-xs text-white font-medium leading-relaxed">
            Quando a operação depende exclusivamente do dono, <strong className="text-gold font-bold">o financeiro deixa de apoiar o crescimento</strong> e passa a consumir tempo e energia vitais do negócio.
          </p>
        </div>
      </section>

      {/* BLOCO 3 — O PRINCÍPIO VERTUS */}
      <SectionDivider />

      <section className="relative bg-gradient-to-br from-gold/15 via-vertus-black to-vertus-gray border-2 border-gold/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="space-y-2 max-w-3xl relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">Princípio de Atuação</span>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
            Você não contrata horas de trabalho. <span className="text-gold">Contrata uma operação financeira estruturada.</span>
          </h3>
        </div>

        <div className="grid md:grid-cols-12 gap-6 items-center relative z-10">
          <div className="md:col-span-7 space-y-3 text-xs sm:text-sm text-white/80 leading-relaxed">
            <p>
              A Vertus não atua como uma profissional alocada para receber tarefas soltas sob demanda. Estruturamos processos, definimos rotinas e conduzimos as atividades acordadas conforme prioridades e prazos estabelecidos.
            </p>
            <p className="text-white font-semibold">
              O empresário continua responsável pelas decisões estratégicas. A Vertus assume a condução com rigor técnico e consistência.
            </p>
          </div>

          <div className="md:col-span-5 p-5 bg-vertus-black/90 border-2 border-gold/50 rounded-xl shadow-xl space-y-2 text-center relative">
            <span className="text-[9px] font-black text-gold uppercase tracking-[0.3em] block">Compromisso VERTUS</span>
            <p className="text-sm sm:text-base font-black text-white uppercase tracking-wide leading-snug">
              “Sua empresa com rotinas diárias, previsibilidade de caixa e números 100% confiáveis.”
            </p>
            <div className="pt-2 flex justify-center gap-3 text-[10px] text-gold font-bold">
              <span>✓ Processos</span>
              <span>•</span>
              <span>✓ Prazos</span>
              <span>•</span>
              <span>✓ Previsibilidade</span>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO 4 — COMO FUNCIONA (6 ETAPAS DO PROCESSO) — DESTAQUE MÁXIMO */}
      <SectionDivider />

      <section id="como-funciona" className="space-y-6 scroll-mt-24">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 bg-gold/15 border border-gold/40 rounded-full text-gold text-[10px] font-black tracking-[0.25em] uppercase"
          >
            <Layers size={14} />
            SEQUÊNCIA DE OPERAÇÃO METÓDICA
          </motion.div>
          
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Como Trabalhamos: As 6 Etapas do Processo Vertus
          </h3>
          <p className="text-xs sm:text-sm text-white/60 max-w-2xl mx-auto">
            Não aplicamos uma implantação genérica. Processos, cadências, responsabilidades e canais são definidos sob medida para a sua operação:
          </p>
        </div>

        {/* Dynamic Connected Process Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 relative">
          {[
            {
              step: "01",
              title: "Diagnóstico Inicial",
              badge: "Mapeamento 360°",
              icon: Target,
              desc: "Mapeamento completo das entradas, saídas, rotinas existentes e identificação dos gargalos que geram perdas financeiras."
            },
            {
              step: "02",
              title: "Estruturação de Processos",
              badge: "Regras & Calendário",
              icon: Layers,
              desc: "Definição de fluxos de trabalho, regras de categorização (Plano de Contas), atribuição de responsabilidades e calendário de rotinas."
            },
            {
              step: "03",
              title: "Implantação Segura",
              badge: "Integração & Ajustes",
              icon: Zap,
              desc: "Organização dos canais de informação, integração com ferramentas de gestão e transição segura da operação sem travar o negócio."
            },
            {
              step: "04",
              title: "Operação Financeira",
              badge: "BPO Vertus na Prática",
              icon: Activity,
              desc: "A equipe Vertus assume as rotinas acordadas conforme prioridades, processos, cadências diárias e prazos estabelecidos."
            },
            {
              step: "05",
              title: "Acompanhamento Contínuo",
              badge: "DFC 30/60/90 Dias",
              icon: LineChart,
              desc: "Relatórios claros de caixa, projeção financeira de curto e médio prazo e alinhamentos constantes com o empresário."
            },
            {
              step: "06",
              title: "Evolução Estratégica",
              badge: "Crescimento Sustentável",
              icon: TrendingUp,
              desc: "Aperfeiçoamento constante dos indicadores e processos para acompanhar e sustentar a expansão do seu negócio."
            }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className="bg-vertus-gray/95 border border-white/10 hover:border-gold/60 rounded-2xl p-4 sm:p-5 space-y-3 relative group transition-all duration-300 shadow-lg hover:shadow-[0_10px_30px_rgba(212,175,55,0.12)] flex flex-col justify-between"
            >
              {/* Top Card Badge Header */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-gold/15 border border-gold/30 text-gold text-xs font-black flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.2)] group-hover:bg-gold group-hover:text-vertus-black transition-colors">
                      {item.step}
                    </span>
                    <span className="text-[9px] font-bold text-gold/90 uppercase bg-gold/10 border border-gold/20 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>
                  <item.icon size={18} className="text-white/30 group-hover:text-gold transition-colors" />
                </div>

                <h4 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-gold transition-colors pt-1">
                  {item.title}
                </h4>

                <p className="text-xs text-white/65 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 font-mono">
                <span>VERTUS METHODOLOGY</span>
                <CheckCircle2 size={13} className="text-gold/40 group-hover:text-gold transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BLOCO 5 — MÉTODO DE GESTÃO E FLUXO */}
      <SectionDivider />

      <section className="bg-vertus-gray/90 border border-white/10 rounded-2xl p-5 sm:p-7 space-y-5 shadow-xl">
        <div className="space-y-2 max-w-3xl">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">Cadência e Método</span>
          <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            Organização não depende de disponibilidade diária do dono. Depende de método.
          </h3>
          <p className="text-xs text-white/70">
            Confira a sequência de cadência operacional aplicada na rotina da sua empresa:
          </p>
        </div>

        {/* Compact Horizontal Pipeline */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            { step: "Passo 1", title: "Organização", desc: "Estruturação prévia dos fluxos" },
            { step: "Passo 2", title: "Execução", desc: "Condução com rigor técnico" },
            { step: "Passo 3", title: "Conferência", desc: "Conciliação diária 24h" },
            { step: "Passo 4", title: "Comunicação", desc: "Canais diretos e objetivos" },
            { step: "Passo 5", title: "Evolução", desc: "Ajustes e projeções DFC" }
          ].map((f, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -3, scale: 1.02 }}
              className="p-3 bg-black/50 border border-white/10 hover:border-gold/40 rounded-xl text-center space-y-1 transition-all flex flex-col justify-between"
            >
              <span className="text-[9px] font-mono text-gold font-bold uppercase block">{f.step}</span>
              <p className="text-xs font-black text-white uppercase tracking-tight">{f.title}</p>
              <p className="text-[10px] text-white/50 leading-tight">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BLOCO 6 — O QUE MUDA (TRANSFORMAÇÃO REAL) */}
      <SectionDivider />

      <section className="space-y-5">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">Resultados Práticos</span>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Quando a estrutura financeira funciona, você ganha liberdade para crescer
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { title: "Clareza sobre o Caixa", desc: "Saber com exatidão o saldo disponível, os compromissos futuros e a margem real." },
            { title: "Processos Organizados", desc: "Reduzir o caos com fluxos padronizados de registro, conferência e autorização." },
            { title: "Informações Confiáveis", desc: "Números validados diariamente que refletem a real saúde da sua operação." },
            { title: "Previsibilidade 30/60/90 Dias", desc: "Antecipar o comportamento do caixa e evitar surpresas no fim do mês." },
            { title: "Segurança para Decidir", desc: "Base sólida para contratar, investir, negociar ou expandir com tranquilidade." },
            { title: "Menos Urgências Operacionais", desc: "Mais tempo livre e energia para focar nas estratégias de crescimento." }
          ].map((card, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              whileHover={{ y: -4, scale: 1.015 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="p-4 bg-vertus-gray border border-white/10 hover:border-gold/50 rounded-xl space-y-2 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-7 h-7 rounded-lg bg-gold/15 border border-gold/30 text-gold flex items-center justify-center">
                  <CheckCircle2 size={16} />
                </div>
                <h4 className="text-xs font-black text-white uppercase tracking-tight">{card.title}</h4>
                <p className="text-xs text-white/60 leading-relaxed">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BLOCO 7 — TECNOLOGIA & EQUIPE HUMANA */}
      <SectionDivider />

      <section className="bg-vertus-gray/90 border border-white/10 rounded-2xl p-5 sm:p-7 space-y-5 shadow-xl">
        <div className="space-y-2 max-w-3xl">
          <span className="text-[10px] font-black text-gold uppercase tracking-[0.25em]">Tecnologia & Pessoas</span>
          <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            Tecnologia acelera processos. Especialistas constroem decisões.
          </h3>
          <p className="text-xs text-white/70">
            Toda a operação é apoiada pelo <strong className="text-white">Vertus Finance</strong>. A tecnologia organiza, a IA identifica padrões e a equipe especialista traduz tudo para você.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {[
            { icon: Cpu, label: "Vertus Finance", text: "Organização e centralização de dados" },
            { icon: Bot, label: "IA Vertus", text: "Identificação de padrões e inconsistências" },
            { icon: Users, label: "Especialistas", text: "Interpretação e orientação estratégica" },
            { icon: ShieldCheck, label: "Empresário", text: "Decisão segura e fundamentada" }
          ].map((step, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ y: -3, scale: 1.02 }}
              className="bg-black/50 border border-white/10 hover:border-gold/40 p-3.5 rounded-xl space-y-2 flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-lg bg-gold/15 border border-gold/30 text-gold flex items-center justify-center mx-auto">
                <step.icon size={16} />
              </div>
              <h4 className="text-xs font-black text-white uppercase">{step.label}</h4>
              <p className="text-[10px] text-white/50 leading-relaxed">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BLOCO 8 — COMPARAÇÃO ANTES X COM VERTUS */}
      <SectionDivider />

      <section className="space-y-5">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">Comparativo Real</span>
          <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            A diferença entre o improviso e uma operação estruturada
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* ANTES */}
          <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-black text-xs uppercase tracking-wider border-b border-red-500/20 pb-2.5">
              <X size={16} />
              <span>Sem Estrutura Metódica</span>
            </div>
            <ul className="space-y-2.5">
              {[
                { title: "Dependência de Pessoas", text: "O financeiro para quando o responsável se ausenta ou acumula tarefas." },
                { title: "Informações Desconectadas", text: "Cada decisão exige procurar dados em arquivos, e-mails e planilhas soltas." },
                { title: "Gestão de Urgências", text: "O empresário passa o dia apagando incêndios e aprovando pagamentos em cima da hora." }
              ].map((item, idx) => (
                <li key={idx} className="space-y-0.5">
                  <p className="text-xs font-bold text-red-300 uppercase">{item.title}</p>
                  <p className="text-[11px] text-white/60 leading-relaxed">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* COM VERTUS */}
          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-wider border-b border-emerald-500/20 pb-2.5">
              <Check size={16} />
              <span>Com Operação Vertus</span>
            </div>
            <ul className="space-y-2.5">
              {[
                { title: "Processos Padronizados", text: "Rotinas claras e prazos definidos mantêm a operação funcionando sempre." },
                { title: "Informações Prontas", text: "Dados atualizados diariamente e disponíveis para apoiar suas decisões." },
                { title: "Foco no Crescimento", text: "O empresário ganha tempo e tranquilidade para focar nas vendas e na expansão." }
              ].map((item, idx) => (
                <li key={idx} className="space-y-0.5">
                  <p className="text-xs font-bold text-emerald-300 uppercase">{item.title}</p>
                  <p className="text-[11px] text-white/80 leading-relaxed">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* BLOCO 9 — CTA FINAL */}
      <SectionDivider />

      <section className="relative bg-gradient-to-br from-gold/20 via-vertus-gray to-vertus-black border-2 border-gold/50 rounded-2xl p-6 sm:p-10 text-center space-y-5 shadow-2xl overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="space-y-2 max-w-2xl mx-auto relative z-10">
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-snug">
            O primeiro passo para transformar o seu financeiro é <span className="text-gold">compreender sua operação atual</span>.
          </h3>
          <p className="text-xs sm:text-sm text-white/70 font-medium leading-relaxed">
            Responda às perguntas rápidas do nosso diagnóstico e descubra os gargalos e oportunidades da sua empresa em poucos minutos.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
          <button 
            onClick={handleNavigateDiagnosis}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-[1.03] active:scale-[0.98] transition-all shadow-xl shadow-gold/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Ir para o Diagnóstico Financeiro</span>
            <ArrowRight size={16} />
          </button>

          <button 
            onClick={handleWhatsAppDirect}
            className="w-full sm:w-auto px-6 py-3.5 bg-white/5 border border-white/15 hover:border-gold/40 text-white/80 hover:text-gold font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Falar com um Estrategista</span>
            <ArrowUpRight size={15} className="text-gold" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 pt-6 pb-2 text-center">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
          © 2026 VERTUS Performance. Todos os direitos reservados.
        </p>
      </footer>

    </div>
  );
}

export const BpoVixDetail = BpoVertusDetail;
