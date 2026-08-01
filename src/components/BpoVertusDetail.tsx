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
  X
} from "lucide-react";

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

  const SectionDivider = () => (
    <div className="w-full flex items-center justify-center py-2">
      <div className="h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </div>
  );

  const scrollToHowItWorks = () => {
    const el = document.getElementById("como-funciona");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-16 sm:space-y-20 relative font-sans text-white">
      
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-gold hover:bg-white/10 hover:border-gold/30 transition-all group flex items-center gap-2 text-xs font-bold cursor-pointer"
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
            <h1 className="text-sm sm:text-base font-black uppercase tracking-tight text-white">
              Vertus Performance
            </h1>
          </div>
        </div>

        <button 
          onClick={handleNavigateDiagnosis}
          className="px-4 py-2 bg-white/5 border border-white/15 hover:border-gold/40 rounded-xl text-xs font-bold text-white/80 hover:text-gold transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="text-[10px] uppercase font-black tracking-wider">Ir ao Diagnóstico</span>
          <ChevronRight size={14} className="text-gold" />
        </button>
      </header>

      {/* BLOCO 1 — HERO */}
      <section className="relative text-center pt-2 pb-4 space-y-6">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/30 rounded-full text-gold text-[10px] font-black tracking-[0.25em] uppercase shadow-inner"
        >
          <ShieldCheck size={14} />
          NOSSA FORMA DE ATUAÇÃO
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[1.15] text-white">
            Você continua conduzindo o seu negócio.
          </h2>
          <p className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-gold-dark leading-snug">
            A Vertus estrutura a operação financeira para que ela funcione com organização, previsibilidade e segurança.
          </p>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xs sm:text-sm md:text-base text-white/70 max-w-3xl mx-auto font-medium leading-relaxed"
        >
          Empresas crescem quando deixam de depender do improviso financeiro. Nossa equipe organiza processos, conduz a operação financeira e acompanha continuamente sua evolução para que você tenha informações confiáveis e possa tomar decisões com tranquilidade.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-3 space-y-5"
        >
          <div className="flex justify-center">
            <button 
              onClick={scrollToHowItWorks}
              className="px-8 py-4 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-[1.02] transition-all shadow-xl shadow-gold/20 flex items-center gap-2.5 cursor-pointer"
            >
              <span>Quero entender como funciona</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-[10px] sm:text-xs text-white/60 font-semibold pt-2">
            <span className="flex items-center gap-1.5"><Check size={14} className="text-gold" /> Método próprio</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-gold" /> Equipe financeira especializada</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-gold" /> Tecnologia como apoio</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-gold" /> Acompanhamento estruturado</span>
          </div>
        </motion.div>
      </section>

      {/* BLOCO 2 — IDENTIFICAÇÃO */}
      <SectionDivider />

      <section className="bg-vertus-gray border border-white/10 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
        <div className="space-y-3 max-w-3xl">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">A Realidade do Empresário</span>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
            O empresário não deveria ser o responsável por manter o financeiro funcionando.
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { title: "Acompanhamento de Pagamentos", desc: "Conferir vencimentos e autorizar pagamentos." },
            { title: "Resolução de Pendências", desc: "Correr atrás de boletos, notas fiscais perdidas e fornecedores cobrando." },
            { title: "Busca por Informações", desc: "Tentar entender para onde o dinheiro foi no meio de extratos misturados." },
            { title: "Organização de Planilhas", desc: "Manter planilhas paralelas atualizadas que raramente batem com o saldo real." },
            { title: "Margem Desconhecida", desc: "Descobrir apenas no fim do mês quanto realmente sobrou ou se houve prejuízo." },
            { title: "Desvio de Foco", desc: "Deixar de vender, planejar e expandir o negócio para gerenciar tarefas operacionais." }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-2 hover:border-gold/30 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-gold/10 border border-gold/20 text-gold flex items-center justify-center">
                <HelpCircle size={15} />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-tight">{item.title}</h4>
              <p className="text-[11px] text-white/60 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="p-5 bg-gold/10 border border-gold/30 rounded-2xl text-center max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
            Quando a operação depende exclusivamente do empresário, <strong className="text-gold font-bold">o financeiro deixa de apoiar o crescimento</strong> e passa a consumir tempo e energia.
          </p>
        </div>
      </section>

      {/* BLOCO 3 — COMO A VERTUS PENSA */}
      <SectionDivider />

      <section className="relative bg-gradient-to-br from-gold/15 via-gold/5 to-transparent border border-gold/30 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl overflow-hidden">
        <div className="space-y-3 max-w-3xl relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">Posicionamento Vertus</span>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
            Você não contrata horas de trabalho. <span className="text-gold">Contrata uma operação financeira estruturada.</span>
          </h3>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-white/80 leading-relaxed max-w-3xl font-medium relative z-10">
          <p>
            A Vertus não atua como uma profissional alocada para receber tarefas sob demanda. Estruturamos processos, definimos rotinas e conduzimos as atividades acordadas conforme prioridades e prazos estabelecidos para a operação.
          </p>
          <p>
            Nosso compromisso é construir uma operação organizada, com processos definidos, responsabilidades claras e uma rotina capaz de manter o financeiro funcionando de forma consistente e segura.
          </p>
          <p className="text-white font-bold">
            O empresário continua responsável pelas decisões estratégicas do negócio. A Vertus assume a responsabilidade pela estrutura financeira construída em conjunto.
          </p>
        </div>

        {/* Manifesto Visual */}
        <div className="p-6 bg-vertus-black/90 border-2 border-gold/50 rounded-2xl shadow-2xl text-center space-y-2 relative z-10">
          <span className="text-[9px] font-black text-gold uppercase tracking-[0.3em] block">Princípio Fundamental</span>
          <p className="text-base sm:text-xl font-black text-white uppercase tracking-wide leading-snug">
            “Você não contrata horas da nossa equipe. <span className="text-gold">Contrata uma operação financeira organizada.”</span>
          </p>
        </div>
      </section>

      {/* BLOCO 4 — COMO FUNCIONA */}
      <SectionDivider />

      <section id="como-funciona" className="space-y-8 pt-2">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">Etapas do Processo</span>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Cada empresa possui uma dinâmica financeira diferente. Por isso, nossa atuação começa pela compreensão da operação.
          </h3>
          <p className="text-xs sm:text-sm text-white/60">
            Não aplicamos uma implantação genérica. Processos, cadências, responsabilidades e canais são definidos conforme a realidade e a complexidade de cada empresa.
          </p>
        </div>

        {/* Timeline Horizontal / Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              step: "01",
              title: "Diagnóstico",
              desc: "Mapeamento completo das entradas, saídas, rotinas existentes e dos gargalos operacionais da empresa."
            },
            {
              step: "02",
              title: "Estruturação",
              desc: "Definição de fluxos de trabalho, regras de categorização, responsabilidades e calendário de rotinas."
            },
            {
              step: "03",
              title: "Implantação",
              desc: "Organização dos canais de informação, integração de ferramentas e transição segura da operação."
            },
            {
              step: "04",
              title: "Operação Financeira",
              desc: "A equipe Vertus passa a conduzir as rotinas acordadas conforme prioridades, processos, cadências e prazos definidos para a operação."
            },
            {
              step: "05",
              title: "Acompanhamento Contínuo",
              desc: "Relatórios de caixa, projeção de fluxo e reuniões de alinhamento para garantir consistência e alinhamento."
            },
            {
              step: "06",
              title: "Evolução",
              desc: "Aperfeiçoamento constante dos processos para acompanhar o crescimento sustentável da empresa."
            }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-vertus-gray border border-white/10 rounded-2xl p-5 space-y-3 relative group hover:border-gold/40 transition-all"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-gold bg-gold/10 border border-gold/20 px-2.5 py-1 rounded-lg">
                  {item.step}
                </span>
                <ChevronRight size={16} className="text-white/20 group-hover:text-gold transition-colors" />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">{item.title}</h4>
              <p className="text-xs text-white/60 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BLOCO 5 — NOSSA FORMA DE TRABALHAR */}
      <SectionDivider />

      <section className="bg-vertus-gray border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl">
        <div className="space-y-3 max-w-3xl">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">Método de Gestão</span>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
            Organização não depende de disponibilidade. Depende de método.
          </h3>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-medium">
            A atuação da Vertus acontece através de uma rotina estruturada, construída conforme a realidade da empresa e conduzida pela nossa equipe. As atividades seguem prioridades, processos e prazos previamente definidos.
          </p>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-medium">
            Nosso compromisso não é ocupar uma cadeira dentro da empresa. Nosso compromisso é garantir que a operação financeira funcione.
          </p>
        </div>

        {/* Fluxo Visual Sem Horários */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {[
            { step: "Organização", desc: "Estruturação prévia de cada processo" },
            { step: "Execução", desc: "Condução com rigor técnico" },
            { step: "Acompanhamento", desc: "Conferência e prevenção" },
            { step: "Comunicação", desc: "Canais diretos e objetivos" },
            { step: "Evolução", desc: "Ajustes contínuos de fluxo" }
          ].map((f, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="p-3.5 bg-black/40 border border-white/10 rounded-xl text-center space-y-1 hover:border-gold/30 transition-all flex flex-col justify-between"
            >
              <span className="text-[10px] font-black text-gold uppercase tracking-wider block">Passo {i + 1}</span>
              <p className="text-xs font-bold text-white uppercase tracking-tight">{f.step}</p>
              <p className="text-[10px] text-white/50 leading-snug">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BLOCO 6 — O QUE MUDA PARA O EMPRESÁRIO */}
      <SectionDivider />

      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">Transformação Real</span>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Quando a estrutura financeira funciona, o empresário ganha liberdade para administrar o negócio.
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { title: "Clareza sobre o caixa", desc: "Saber o saldo disponível, os compromissos futuros e o resultado da operação." },
            { title: "Processos organizados", desc: "Reduzir a desordem com fluxos claros de registro, conferência e autorização." },
            { title: "Informações confiáveis", desc: "Números validados que refletem com precisão a saúde financeira da empresa." },
            { title: "Previsibilidade", desc: "Acompanhar antecipadamente o comportamento do caixa para os próximos 30, 60 e 90 dias." },
            { title: "Segurança para decidir", desc: "Base sólida para contratar, investir, negociar com fornecedores ou expandir." },
            { title: "Menos envolvimento com urgências operacionais", desc: "Mais tempo e energia para se concentrar nas decisões estratégicas e no crescimento da empresa." }
          ].map((card, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: idx * 0.07 }}
              className="p-5 bg-vertus-gray border border-white/10 rounded-2xl space-y-2.5 hover:border-gold/40 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 text-gold flex items-center justify-center">
                <CheckCircle2 size={16} />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-tight">{card.title}</h4>
              <p className="text-xs text-white/60 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BLOCO 7 — COMO ISSO ACONTECE */}
      <SectionDivider />

      <section className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2 max-w-3xl">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">Consequência da Metodologia</span>
          <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            Para manter essa estrutura funcionando, nossa equipe conduz atividades como:
          </h3>
          <p className="text-xs text-gold/90 font-medium">
            As atividades são definidas conforme o escopo contratado, o volume da operação e as necessidades identificadas na implantação.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            "Organização das contas a pagar",
            "Organização das contas a receber",
            "Conciliação periódica das movimentações",
            "Atualização e projeção do fluxo financeiro",
            "Organização documental",
            "Relatórios financeiros em cadência definida",
            "Indicadores operacionais e gerenciais",
            "Acompanhamento de pendências e pontos de atenção"
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="p-3 bg-black/40 border border-white/10 rounded-xl flex items-center gap-2"
            >
              <Check size={14} className="text-gold shrink-0" />
              <span className="text-xs text-white/80 font-medium">{item}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BLOCO 8 — TECNOLOGIA */}
      <SectionDivider />

      <section className="bg-vertus-gray border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="space-y-3 max-w-3xl">
          <span className="text-[10px] font-black text-gold uppercase tracking-[0.25em]">Tecnologia & Pessoas</span>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Tecnologia acelera processos. Especialistas constroem decisões.
          </h3>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-medium">
            Toda a operação é apoiada pelo <strong className="text-white">Vertus Finance</strong>. A plataforma organiza dados, a inteligência artificial identifica padrões e inconsistências, nossa equipe interpreta essas informações e o empresário recebe clareza para decidir.
          </p>
        </div>

        {/* Fluxo Visual da Tecnologia */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {[
            { icon: Cpu, label: "Vertus Finance", text: "Organização e centralização dos dados" },
            { icon: Bot, label: "Inteligência Artificial", text: "Identificação de padrões e inconsistências" },
            { icon: Users, label: "Especialistas", text: "Interpretação e orientação estratégica" },
            { icon: ShieldCheck, label: "Empresário", text: "Decisão segura com clareza" }
          ].map((step, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="bg-black/50 border border-white/10 p-4 rounded-2xl space-y-2 flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-lg bg-gold/15 border border-gold/30 text-gold flex items-center justify-center mx-auto">
                <step.icon size={16} />
              </div>
              <h4 className="text-xs font-bold text-white uppercase">{step.label}</h4>
              <p className="text-[10px] text-white/50 leading-relaxed">{step.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-xs text-white/70 font-medium text-center">
            A tecnologia fortalece o trabalho realizado sem nunca substituir o olhar humano e a estratégia dos nossos especialistas.
          </p>
        </div>
      </section>

      {/* BLOCO 9 — PARA QUEM ESSA ESTRUTURA FAZ SENTIDO */}
      <SectionDivider />

      <section className="bg-gradient-to-br from-gold/10 via-vertus-gray to-vertus-black border border-gold/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="space-y-2 max-w-3xl">
          <span className="text-[10px] font-black text-gold uppercase tracking-[0.25em]">Perfil de Operação</span>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Empresas diferentes possuem necessidades diferentes.
          </h3>
          <p className="text-xs sm:text-sm text-white/70 font-medium">
            Essa estrutura costuma gerar mais valor para empresas que:
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {[
            "Cresceram rapidamente e a estrutura financeira não acompanhou o ritmo;",
            "Perderam a organização financeira e acumularam retrabalho e inconsistências;",
            "Dependem do dono para controlar, aprovar e resolver cada detalhe do dia a dia;",
            "Desejam profissionalizar a gestão financeira com processos bem definidos;",
            "Buscam previsibilidade real de caixa para continuar expandindo com segurança."
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.3, delay: idx * 0.06 }}
              className="p-4 bg-black/60 border border-white/10 rounded-2xl flex items-start gap-3"
            >
              <CheckCircle2 size={16} className="text-gold shrink-0 mt-0.5" />
              <p className="text-xs text-white/90 font-medium leading-relaxed">{item}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BLOCO 10 — ANTES × DEPOIS */}
      <SectionDivider />
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">Matriz de Transformação</span>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            A diferença entre improviso e operação estruturada
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* ANTES */}
          <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-400 font-black text-xs uppercase tracking-wider border-b border-red-500/20 pb-3">
              <X size={16} />
              <span>Sem Estrutura Metódica</span>
            </div>
            <ul className="space-y-4">
              {[
                { title: "Dependência de pessoas específicas", text: "O funcionamento do financeiro depende da memória, da disponibilidade e do conhecimento concentrado em poucas pessoas." },
                { title: "Busca constante por dados", text: "Cada decisão exige procurar informações espalhadas em arquivos e extratos." },
                { title: "Gestão de urgências", text: "O empresário passa o dia resolvendo imprevistos e liberando pagamentos de última hora." }
              ].map((item, idx) => (
                <li key={idx} className="space-y-1">
                  <p className="text-xs font-bold text-red-300 uppercase">{item.title}</p>
                  <p className="text-xs text-white/60 leading-relaxed">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* DEPOIS */}
          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-wider border-b border-emerald-500/20 pb-3">
              <Check size={16} />
              <span>Com Operação Vertus</span>
            </div>
            <ul className="space-y-4">
              {[
                { title: "Processos que reduzem a dependência individual", text: "Rotinas, regras, responsáveis e informações organizadas tornam a operação mais consistente e previsível." },
                { title: "Informações prontas", text: "As informações já estão organizadas e atualizadas para apoiar a decisão." },
                { title: "Planejamento de crescimento", text: "O empresário ganha tempo para focar nas estratégias e na expansão do negócio." }
              ].map((item, idx) => (
                <li key={idx} className="space-y-1">
                  <p className="text-xs font-bold text-emerald-300 uppercase">{item.title}</p>
                  <p className="text-xs text-white/80 leading-relaxed">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* BLOCO 11 — NOSSO COMPROMISSO */}
      <SectionDivider />

      <section className="bg-vertus-gray border border-white/10 rounded-3xl p-6 sm:p-10 space-y-4 shadow-xl">
        <div className="space-y-2 max-w-3xl">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">Relacionamento Contínuo</span>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
            Nosso trabalho não termina quando a estrutura é implantada. <span className="text-gold">É justamente aí que ele começa.</span>
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-medium max-w-3xl">
          A Vertus acompanha continuamente a operação financeira para garantir que os processos permaneçam organizados, que as informações continuem confiáveis e que a empresa evolua sem perder controle. Nosso compromisso é construir uma estrutura que acompanhe o crescimento do seu negócio.
        </p>
      </section>

      {/* BLOCO 12 — CONEXÃO COM O DIAGNÓSTICO */}
      <SectionDivider />

      <section className="bg-gradient-to-r from-gold/15 via-gold/5 to-transparent border border-gold/30 rounded-3xl p-6 sm:p-10 space-y-4 shadow-xl">
        <div className="space-y-3 max-w-3xl">
          <span className="text-[10px] font-black text-gold uppercase tracking-[0.25em]">Fundamento do Nosso Método</span>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
            Antes de organizar uma empresa, nós procuramos entendê-la.
          </h3>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
            Foi exatamente por isso que desenvolvemos o Diagnóstico Financeiro Vertus. Acreditamos que nenhuma estrutura financeira faz sentido quando é construída sem compreender a realidade da empresa.
          </p>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
            O objetivo do diagnóstico é ajudar o empresário a enxergar com mais clareza sua operação, identificar oportunidades de organização e compreender os principais desafios da gestão financeira.
          </p>
          <p className="text-xs sm:text-sm font-bold text-gold pt-1">
            Boas decisões começam com um bom diagnóstico.
          </p>
        </div>
      </section>

      {/* BLOCO 13 — CTA FINAL */}
      <SectionDivider />
      <section className="relative bg-gradient-to-br from-gold/15 via-gold/5 to-transparent border border-gold/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl overflow-hidden">
        <div className="space-y-3 max-w-2xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-snug">
            O próximo passo não é contratar uma solução.
            <span className="block text-gold">É compreender melhor a realidade financeira da sua empresa.</span>
          </h3>
          <p className="text-xs sm:text-sm text-white/70 font-medium leading-relaxed">
            Conclua o Diagnóstico Financeiro para visualizar o cenário atual da sua operação e identificar os principais pontos que merecem atenção.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={handleNavigateDiagnosis}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-[1.02] transition-all shadow-xl shadow-gold/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continuar meu Diagnóstico</span>
            <ArrowRight size={16} />
          </button>

          <button 
            onClick={handleNavigateAbout}
            className="w-full sm:w-auto px-6 py-4 bg-white/5 border border-white/15 text-white/80 hover:text-white hover:bg-white/10 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            Conhecer a Metodologia Vertus
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 pt-8 pb-4 text-center">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
          © 2026 VERTUS Performance. Todos os direitos reservados.
        </p>
      </footer>

    </div>
  );
}

export const BpoVixDetail = BpoVertusDetail;
