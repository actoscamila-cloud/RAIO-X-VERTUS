import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { DiagnosisResponse, Lead } from "../types";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import { 
  Download, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  BarChart3, 
  PieChart, 
  DollarSign, 
  Clock, 
  Award, 
  Zap, 
  Target, 
  Send, 
  HelpCircle,
  ChevronRight,
  TrendingDown,
  Layers,
  Lock,
  RefreshCw,
  Check,
  User,
  Bot
} from "lucide-react";
import { cn } from "../lib/utils";
import { pdfService } from "../services/pdfService";
import { storage } from "../lib/storage";
import AboutVertus from "./AboutVertus";
import StrategicPlanModal from "./StrategicPlanModal";

interface DashboardProps {
  diagnosis: DiagnosisResponse;
  lead: Lead;
  onNext: () => void;
  isTrainingComplete?: boolean;
  onOpenAboutVertus?: () => void;
}

const DIMENSION_NAMES: Record<keyof DiagnosisResponse["dimensions"], string> = {
  fluxoCaixa: "Fluxo de Caixa",
  precificacao: "Precificação e Margem",
  controle: "Controle e Conciliação",
  previsibilidade: "Previsibilidade e Planejamento",
  custosRentabilidade: "Custos e Rentabilidade",
  processos: "Processos e Tomada de Decisão",
};

const DIMENSION_DESCRIPTIONS: Record<keyof DiagnosisResponse["dimensions"], string> = {
  fluxoCaixa: "Visibilidade em tempo real das entradas e saídas de caixa diárias.",
  precificacao: "Margem de contribuição real por produto ou serviço sem subsídios cruzados.",
  controle: "Conciliação bancária diária rigorosa sem divergências pendentes.",
  previsibilidade: "Projeção de caixa para os próximos 30, 60 e 90 dias com orçamento base.",
  custosRentabilidade: "Separação clara entre custos fixos operacionais e despesas variáveis.",
  processos: "Governança financeira e rotinas estruturadas para tomada de decisão.",
};

// Micro-interaction Animated Counter Component
function AnimatedNumber({ value, duration = 1200, formatter }: { value: number; duration?: number; formatter?: (val: number) => string }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(eased * value));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCurrent(value);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <>{formatter ? formatter(current) : current.toLocaleString("pt-BR")}</>;
}

export default function Dashboard({ diagnosis, lead, onNext, isTrainingComplete, onOpenAboutVertus }: DashboardProps) {
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  // Animation state for consolidation
  const [isConsolidating, setIsConsolidating] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Modals & Exporting
  const [isExporting, setIsExporting] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showStrategicModal, setShowStrategicModal] = useState(false);
  const [hoveredDimension, setHoveredDimension] = useState<keyof DiagnosisResponse["dimensions"] | null>(null);

  // Mentora Vertus IA state
  interface AiChatMessage {
    role: "user" | "model";
    text: string;
  }

  const [aiQuestion, setAiQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState<AiChatMessage[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const aiScrollRef = useRef<HTMLDivElement>(null);

  const firstname = lead.responsibleName?.split(" ")[0] || lead.responsibleName || "Empresário";
  const company = lead.companyName || "Sua Empresa";

  // Dimensions array sorted by score
  const sortedDimensions = Object.entries(diagnosis.dimensions)
    .map(([key, value]) => ({
      key: key as keyof DiagnosisResponse["dimensions"],
      name: DIMENSION_NAMES[key as keyof DiagnosisResponse["dimensions"]],
      score: value,
    }))
    .sort((a, b) => b.score - a.score);

  const highestDimension = sortedDimensions[0];
  const lowestDimension = sortedDimensions[sortedDimensions.length - 1];

  const radarData = Object.entries(diagnosis.dimensions).map(([key, value]) => ({
    subject: DIMENSION_NAMES[key as keyof typeof DIMENSION_NAMES],
    A: value,
    fullMark: 100,
  }));

  // Maturity classification info with score tier colors
  const getMaturityInfo = () => {
    if (diagnosis.score >= 80) {
      return {
        label: "Maturidade Financeira Excelente",
        badgeBg: "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
        scoreColor: "text-emerald-400",
        scoreBorder: "border-emerald-500/30",
        scoreGlow: "shadow-[0_0_30px_rgba(16,185,129,0.15)]",
        desc: `${company} possui bases de governança consolidadas. O foco agora é otimização contínua de margem e expansão acelerada com previsibilidade.`,
        riskLevel: "Baixo",
        riskColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        predictability: "Alta",
        predictabilityColor: "text-emerald-400",
        control: "Estruturado",
        decision: "Orientada a Dados",
      };
    }
    if (diagnosis.score >= 60) {
      return {
        label: "Maturidade Financeira Intermediária",
        badgeBg: "bg-gold/15 border-gold/40 text-gold",
        scoreColor: "text-gold",
        scoreBorder: "border-gold/30",
        scoreGlow: "shadow-[0_0_30px_rgba(212,175,55,0.15)]",
        desc: `${company} já possui bases importantes, porém ainda apresenta falhas de processo que comprometem a previsibilidade e o crescimento sustentável.`,
        riskLevel: "Médio",
        riskColor: "text-gold bg-gold/10 border-gold/20",
        predictability: "Intermediária",
        predictabilityColor: "text-gold",
        control: "Parcial",
        decision: "Mista (Sensação + Dados)",
      };
    }
    if (diagnosis.score >= 40) {
      return {
        label: "Maturidade Financeira em Desenvolvimento",
        badgeBg: "bg-amber-500/15 border-amber-500/40 text-amber-400",
        scoreColor: "text-amber-400",
        scoreBorder: "border-amber-500/30",
        scoreGlow: "shadow-[0_0_30px_rgba(245,158,11,0.15)]",
        desc: `${company} necessita de melhorias relevantes. A ausência de rotinas financeiras diárias gera vulnerabilidades diretas no fluxo de caixa.`,
        riskLevel: "Elevado",
        riskColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        predictability: "Baixa",
        predictabilityColor: "text-amber-400",
        control: "Instável",
        decision: "Sensação / Intuição",
      };
    }
    return {
      label: "Maturidade Financeira Crítica",
      badgeBg: "bg-rose-500/15 border-rose-500/40 text-rose-400",
      scoreColor: "text-rose-400",
      scoreBorder: "border-rose-500/30",
      scoreGlow: "shadow-[0_0_30px_rgba(244,63,94,0.15)]",
      desc: `${company} opera sob risco elevado por ausência de controles formais. Há urgência na estancagem de vazamentos de caixa.`,
      riskLevel: "Crítico",
      riskColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      predictability: "Muito Baixa",
      predictabilityColor: "text-rose-400",
      control: "Frágil",
      decision: "Reativa",
    };
  };

  const maturity = getMaturityInfo();

  // Scroll chat on updates
  useEffect(() => {
    if (aiScrollRef.current) {
      aiScrollRef.current.scrollTop = aiScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isAiLoading]);

  // Initial consolidation sequence (2.5 seconds animation)
  useEffect(() => {
    const steps = [0, 1, 2, 3, 4, 5, 6];
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, step]);
      }, 300 * (idx + 1));
    });

    const timer = setTimeout(() => {
      setIsConsolidating(false);
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await pdfService.generateReport("vertus-dashboard-content", lead, diagnosis);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  // AI Mentor custom query handler
  const handleAskAi = async (customPrompt?: string) => {
    const questionToAsk = customPrompt || aiQuestion;
    if (!questionToAsk.trim() || isAiLoading) return;

    const userQuery = questionToAsk.trim();
    setAiQuestion("");
    setChatMessages((prev) => [...prev, { role: "user", text: userQuery }]);
    setIsAiLoading(true);

    try {
      const settings = await storage.getSettings();
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === "undefined" || apiKey === "") {
        throw new Error("GEMINI_API_KEY is missing");
      }

      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `Você é a Mentora Vertus IA, uma consultora e mentora de inteligência financeira humana, extremamente didática, atenciosa e estratégica.

SEU OBJETIVO E TOM DE VOZ:
- Seu papel é ser uma mentora prática de finanças empresariais para ${firstname}, responsável pela ${company}.
- Você DEVE responder dúvidas, orientar, ensinar e estruturar roteiros práticos sobre gestão financeira (fluxo de caixa, conciliação diária, DRE gerencial, precificação, margens, capital de giro, ponto de equilíbrio).
- NUNCA tente vender serviços da Vertus, NUNCA seja comercial ou apelativa, e NUNCA aja como vendedora de BPO. O atendimento é 100% focado na orientação e mentoria do empresário, indiferente se ele é cliente ou não.
- Converse com tom humano, acolhedor, profissional e encorajador, como um verdadeiro braço direito estratégico do empresário.

DIRETRIZES DE HUMANIZAÇÃO E LINGUAGEM CONSULTIVA:
1. Inicie SEMPRE sua resposta contextualizando o cenário real da empresa, por exemplo:
   "Analisando especificamente os dados da ${company} e o comportamento identificado no seu diagnóstico..."
   ou "Pelo cenário mapeado para a ${company}..."
2. Desenvolva a orientação técnica de forma didática e em passos claros.
3. Conclua SEMPRE sua resposta com uma pergunta consultiva que estimule a reflexão do empresário sobre sua rotina, por exemplo:
   "Hoje isso já acontece na sua rotina na ${company}?" ou "Esse cenário faz sentido para a realidade atual do seu negócio?"

CONTEXTO DO DIAGNÓSTICO DA EMPRESA ${company}:
- Score Vertus: ${diagnosis.score}/100 (${maturity.label})
- Oportunidade de Ganho / Desperdício Estimado: R$ ${diagnosis.monthlyLoss.toLocaleString("pt-BR")}/mês (R$ ${(diagnosis.monthlyLoss * 12).toLocaleString("pt-BR")}/ano)
- Maior Ponto Forte: ${highestDimension.name} (${highestDimension.score}/100)
- Maior Gargalo: ${lowestDimension.name} (${lowestDimension.score}/100)
- Dimensões Analisadas: ${JSON.stringify(diagnosis.dimensions)}

CONHECIMENTO DA METODOLOGIA VERTUS:
${settings?.aiPrompt || "Você é o Assistente Financeiro Vertus, um consultor estratégico de elite."}
${settings?.financialContent || "Foco em fluxo de caixa, DRE gerencial, precificação, margem e conciliação bancária diária."}
${settings?.strategicGuidelines || "Foco em clareza, previsibilidade e tomada de decisão embasada em dados."}

DIRETRIZES RIGOROSAS DE FORMATAÇÃO:
- Apresente-se como **Mentora Financeira Vertus** ou **Assistente Financeiro Vertus**.
- Trate sempre pelo nome (${firstname}) e cite a empresa (${company}).
- Formate suas respostas em Markdown rico:
  * Destaque em **negrito** os termos-chave, conceitos estratégicos e valores importantes.
  * Use títulos numerados destacados para estruturar passos práticos.
  * Mantenha parágrafos curtos, bem organizados e fáceis de ler.`;

      // Build history for multi-turn chat
      const chatHistory = chatMessages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          const chat = ai.chats.create({
            model: "gemini-3.1-flash-lite-preview",
            config: {
              systemInstruction,
            },
            history: chatHistory,
          });

          const response = await chat.sendMessage({ message: userQuery });
          const replyText = response.text || "Desculpe, tive um problema ao processar sua dúvida.";

          setChatMessages((prev) => [...prev, { role: "model", text: replyText }]);
          return;
        } catch (err: any) {
          if (err.message?.includes("503") || err.message?.includes("high demand")) {
            attempts++;
            if (attempts < maxAttempts) {
              await new Promise((res) => setTimeout(res, 2000 * attempts));
              continue;
            }
          }
          throw err;
        }
      }
    } catch (error) {
      console.error("AI Mentor error:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: `Analisando especificamente os dados da **${company}**, entendo perfeitamente o seu desafio. Como **Mentora Financeira Vertus**, meu papel é te orientar para transformar o fluxo de caixa em uma ferramenta de clareza real.\n\nPara organizarmos as finanças da **${company}**, recomendo focarmos em quatro etapas fundamentais:\n\n**1. A Estrutura Básica**\nSegregação total entre as contas da empresa e as despesas pessoais dos sócios.\n\n**2. Conciliação Bancária Diária**\nRegistrar e conferir cada centavo no banco diariamente sem deixar acúmulos.\n\n**3. Categorização por Centro de Custo**\nDividir saídas entre custos fixos e despesas variáveis para enxergar a margem real.\n\n**4. Projeção de Caixa (DFC 30/60/90 Dias)**\nAnalisar os compromissos futuros com antecedência para tomar decisões com total segurança.\n\nHoje essa rotina de conciliação diária já acontece no dia a dia da **${company}**?`,
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const consolidationItems = [
    "Fluxo de Caixa",
    "Estrutura Financeira",
    "Custos & Margens",
    "Processos Operacionais",
    "Lucratividade Real",
    "Maturidade Financeira",
    "Oportunidades de Crescimento",
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-8" ref={dashboardRef} id="vertus-dashboard-content">
      {/* 1. INITIAL CONSOLIDATION SEQUENCE ANIMATION */}
      <AnimatePresence>
        {isConsolidating && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-vertus-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="max-w-md w-full space-y-8">
              {/* Spinning Logo / Icon */}
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-gold/20 animate-ping opacity-25" />
                <div className="absolute inset-0 rounded-full border-2 border-t-gold border-r-transparent border-b-gold/20 border-l-transparent animate-spin" />
                <ShieldCheck size={36} className="text-gold relative z-10" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 bg-gold/10 border border-gold/30 text-gold rounded-full text-[9px] font-black uppercase tracking-widest">
                  Processamento Estratégico
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  Estamos consolidando seu Diagnóstico Financeiro
                </h2>
                <p className="text-xs text-white/50">
                  Analisando a estrutura operacional de <span className="text-gold font-bold">{company}</span>...
                </p>
              </div>

              {/* Step Checklist */}
              <div className="bg-vertus-gray/80 border border-white/10 rounded-2xl p-5 space-y-2.5 text-left">
                {consolidationItems.map((item, idx) => {
                  const isDone = completedSteps.includes(idx);
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: isDone ? 1 : 0.3, x: 0 }}
                      className="flex items-center justify-between text-xs font-medium"
                    >
                      <span className={cn(isDone ? "text-white font-bold" : "text-white/40")}>
                        {item}
                      </span>
                      {isDone ? (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase text-gold">
                          <Check size={12} className="text-gold" /> Concluído
                        </span>
                      ) : (
                        <span className="text-[10px] text-white/20 uppercase">Aguardando</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <button
                onClick={() => setIsConsolidating(false)}
                className="text-[10px] font-black text-white/40 hover:text-gold uppercase tracking-widest transition-colors cursor-pointer"
              >
                Pular Animação →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SENSAÇÃO DE CONQUISTA AO FINALIZAR O DIAGNÓSTICO */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 text-xs text-emerald-300 font-medium shadow-lg shadow-emerald-500/5"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
            <CheckCircle2 size={16} />
          </div>
          <p className="leading-snug text-xs sm:text-sm">
            <strong className="text-white font-black uppercase tracking-wide">✓ Diagnóstico concluído com sucesso.</strong>{" "}
            <span className="text-emerald-200/90 font-sans">Seu Painel Executivo foi gerado utilizando a metodologia de análise financeira Vertus para <strong className="text-white underline decoration-emerald-500/50">{company}</strong>.</span>
          </p>
        </div>
        <span className="hidden md:inline-block px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-[10px] font-black text-emerald-300 uppercase tracking-widest shrink-0">
          Relatório Ativo
        </span>
      </motion.div>

      {/* HEADER & PERSONALIZED GREETING */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/15 border border-gold/30 rounded-full text-gold text-[9px] font-black tracking-[0.2em] uppercase">
            <ShieldCheck size={12} />
            Diagnóstico Concluído • Vertus Financial
          </div>
          <p className="text-xs font-bold text-gold uppercase tracking-widest">
            {firstname}, analisamos a realidade financeira da <span className="text-white underline decoration-gold/50 underline-offset-4">{company}</span>
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight leading-none">
            Painel Executivo de Maturidade
          </h1>
          <p className="text-white/40 text-xs font-medium">
            Responsável: {lead.responsibleName} • {lead.location} • Segmento: {lead.segment || "Empresarial"}
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shrink-0 shadow-md hover:border-gold/30 cursor-pointer"
        >
          {isExporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
          Exportar Relatório PDF
        </button>
      </div>

      {/* 2. HERO DO RESULTADO — HEADLINE DOMINANTE & HIERARQUIA VISUAL CLARA */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gold/20 via-vertus-gray to-vertus-black border-2 border-gold/40 rounded-3xl p-6 sm:p-10 space-y-6 shadow-[0_0_40px_rgba(212,175,55,0.12)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-gold text-vertus-black rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
            Diagnóstico Concluído
          </span>
          <span className="text-[10px] text-white/40 font-mono">ID: #{lead.id?.slice(0, 8) || "VT-2026"}</span>
        </div>

        {/* Headline DOMINANTE */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight leading-snug max-w-4xl">
          {firstname}, identificamos uma empresa com alto potencial de crescimento em <span className="text-gold underline decoration-gold/40 underline-offset-8">{company}</span>.
          <br className="hidden sm:inline" /> Mas hoje sua estrutura financeira limita parte desse resultado.
        </h2>

        {/* Resumo do Cenário Antes dos Indicadores */}
        <p className="text-xs sm:text-base text-white/80 leading-relaxed max-w-3xl font-sans border-l-2 border-gold/50 pl-4 py-0.5">
          Após analisar detalhadamente todas as respostas da <strong className="text-white">{company}</strong>, identificamos oportunidades estratégicas decisivas para aumentar a previsibilidade, estancar perdas invisíveis e dar total segurança à tomada de decisão. A boa notícia é que esses gargalos são mapeados e resolvidos através de rotinas e método.
        </p>
      </motion.div>

      {/* 3. RESUMO EXECUTIVO (PAINEL DE KPIS E GOVERNANÇA) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-white/50 uppercase tracking-[0.2em] flex items-center gap-2">
            <Layers size={14} className="text-gold" /> Resumo Executivo de Governança
          </h3>
          <span className="text-[10px] text-white/30 font-medium">Visão Sintética Operacional</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-vertus-gray border border-white/10 rounded-2xl p-4 space-y-1 hover:border-gold/30 transition-all shadow-md">
            <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Nível de Risco</p>
            <p className={cn("text-xs font-black uppercase tracking-wider px-2 py-1 rounded-lg border inline-block", maturity.riskColor)}>
              {maturity.riskLevel}
            </p>
            <p className="text-[9px] text-white/30 pt-1">Exposição do Caixa</p>
          </div>

          <div className="bg-vertus-gray border border-white/10 rounded-2xl p-4 space-y-1 hover:border-gold/30 transition-all shadow-md">
            <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Previsibilidade</p>
            <p className={cn("text-sm font-black uppercase tracking-tight", maturity.predictabilityColor)}>
              {maturity.predictability}
            </p>
            <p className="text-[9px] text-white/30 pt-1">Projeção 30/60/90d</p>
          </div>

          <div className="bg-vertus-gray border border-white/10 rounded-2xl p-4 space-y-1 hover:border-gold/30 transition-all shadow-md">
            <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Controle Financeiro</p>
            <p className="text-sm font-black uppercase text-white">
              {maturity.control}
            </p>
            <p className="text-[9px] text-white/30 pt-1">Conciliação Diária</p>
          </div>

          <div className="bg-vertus-gray border border-white/10 rounded-2xl p-4 space-y-1 hover:border-gold/30 transition-all shadow-md">
            <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Tomada de Decisão</p>
            <p className="text-xs font-bold text-white/90 leading-tight">
              {maturity.decision}
            </p>
            <p className="text-[9px] text-white/30 pt-1">Base nos Números</p>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-vertus-gray border border-emerald-500/20 rounded-2xl p-4 space-y-1 hover:border-emerald-500/40 transition-all shadow-md">
            <p className="text-[9px] font-black uppercase text-emerald-400 tracking-widest">Potencial Evolutivo</p>
            <p className="text-sm font-black uppercase text-emerald-400 flex items-center gap-1">
              <TrendingUp size={14} /> Alto
            </p>
            <p className="text-[9px] text-emerald-400/60 pt-1">Com BPO Vertus</p>
          </div>
        </div>
      </div>

      {/* 4. ÍNDICE VERTUS + HEMORRAGIA FINANCEIRA GRID */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* ÍNDICE VERTUS CARD (5 cols) COM REFORÇO VISUAL DE FAXA DE MATURIDADE */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "lg:col-span-5 bg-gradient-to-br border rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-500",
            maturity.scoreBorder,
            maturity.scoreGlow,
            "from-vertus-gray via-black to-vertus-black"
          )}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border", maturity.badgeBg)}>
                Índice Vertus
              </span>
              <span className="text-[10px] text-white/40 font-mono">0 a 100 PONTOS</span>
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-baseline justify-center sm:justify-start gap-2">
                <span className={cn("text-5xl sm:text-6xl font-black tracking-tight", maturity.scoreColor)}>
                  <AnimatedNumber value={diagnosis.score} />
                </span>
                <span className="text-xl font-bold text-white/40">/ 100 pts</span>
              </div>
              <div className={cn("inline-block px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border", maturity.badgeBg)}>
                {maturity.label}
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-sans">
              {maturity.desc}
            </p>
          </div>

          {/* VISUAL BENCHMARK PROGRESS BAR */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex justify-between items-center text-[10px] font-bold text-white/40 uppercase tracking-widest">
              <span>Posição Atual ({diagnosis.score} pts)</span>
              <span className="text-gold font-black">Meta Recomendada: 80+</span>
            </div>

            <div className="relative w-full bg-black/60 h-4 rounded-full p-0.5 border border-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-500 via-gold to-emerald-400 transition-all duration-1000 shadow-lg"
                style={{ width: `${Math.max(10, diagnosis.score)}%` }}
              />
            </div>

            {/* Benchmark ticks colorized */}
            <div className="flex justify-between text-[9px] font-mono px-1">
              <span className="text-rose-400">0 (Crítico)</span>
              <span className="text-amber-400">40</span>
              <span className="text-gold">60</span>
              <span className="text-emerald-400 font-bold">80 (Excelente)</span>
            </div>

            <p className="text-[10px] text-white/50 text-center sm:text-left pt-1">
              A <strong className="text-white">{company}</strong> está melhor posicionada que <span className="text-gold font-bold">{diagnosis.benchmark}%</span> das empresas do mesmo segmento.
            </p>
          </div>
        </motion.div>

        {/* HEMORRAGIA FINANCEIRA CARD TANGÍVEL (7 cols) */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 bg-gradient-to-br from-amber-950/40 via-vertus-gray to-vertus-black border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="px-3 py-1 bg-amber-500/15 border border-amber-500/40 text-amber-400 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                <AlertCircle size={12} /> Oportunidade / Desperdício Estimado
              </span>
              <span className="text-[10px] text-amber-400/80 font-bold uppercase tracking-widest">Alerta de Caixa</span>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-white/60 uppercase tracking-wider">
                Sua empresa pode estar deixando aproximadamente
              </p>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-3xl sm:text-5xl font-black text-amber-400 tracking-tight">
                  R$ <AnimatedNumber value={diagnosis.monthlyLoss} />
                </span>
                <span className="text-sm font-bold text-white/60 uppercase tracking-widest">por mês</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
              Em apenas <strong className="text-amber-400">12 meses</strong>, esse desvio contínuo representa aproximadamente <strong className="text-amber-300 font-mono text-base">R$ {(diagnosis.monthlyLoss * 12).toLocaleString("pt-BR")}</strong> que deixam de fortalecer o caixa e a liquidez da <strong className="text-white">{company}</strong>.
            </p>
          </div>

          {/* VISUAL CUMULATIVE LOSS TIMELINE STEPS */}
          <div className="space-y-3 pt-3 border-t border-amber-500/20">
            <p className="text-[10px] font-black uppercase text-amber-400/80 tracking-widest">
              Evolução da Perda Acumulada Sem Correção de Processos:
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-black/50 border border-amber-500/20 rounded-xl p-2.5 space-y-0.5">
                <p className="text-[9px] text-white/40 font-bold uppercase">3 Meses</p>
                <p className="text-xs font-black text-amber-400 font-mono">
                  R$ <AnimatedNumber value={diagnosis.monthlyLoss * 3} />
                </p>
              </div>
              <div className="bg-black/60 border border-amber-500/30 rounded-xl p-2.5 space-y-0.5">
                <p className="text-[9px] text-white/40 font-bold uppercase">6 Meses</p>
                <p className="text-xs font-black text-amber-400 font-mono">
                  R$ <AnimatedNumber value={diagnosis.monthlyLoss * 6} />
                </p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/40 rounded-xl p-2.5 space-y-0.5 shadow-md">
                <p className="text-[9px] text-amber-300 font-bold uppercase">12 Meses (Total)</p>
                <p className="text-sm font-black text-amber-400 font-mono">
                  R$ <AnimatedNumber value={diagnosis.monthlyLoss * 12} />
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 5. RADAR DE MATURIDADE PROTAGONISTA & ANALÍTICO */}
      <div className="bg-vertus-gray border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em] bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
              Coração Analítico • Visão 360º Operacional
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight pt-2">
              Radar de Maturidade Financeira por Pilar
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gold bg-black/60 px-3.5 py-2 rounded-xl border border-gold/30 shadow-md">
            <div className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
            Desempenho Atual da {company}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Radar Chart Component (7 cols) - ENLARGED AREA & HIGH CONTRAST */}
          <div className="lg:col-span-7 h-[340px] sm:h-[400px] w-full bg-black/60 border border-gold/20 rounded-2xl p-4 relative shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="rgba(212, 175, 55, 0.25)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#FFFFFF", fontSize: 11, fontWeight: 700 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Sua Empresa"
                  dataKey="A"
                  stroke="#D4AF37"
                  strokeWidth={2.5}
                  fill="#D4AF37"
                  fillOpacity={0.45}
                  animationDuration={1400}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Highlights & Dimension Details (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Maior Ponto Forte */}
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-1 shadow-md">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
                <CheckCircle2 size={16} /> Maior Maturidade Atual
              </div>
              <p className="text-base font-black text-white">{highestDimension.name}</p>
              <p className="text-xs text-white/70 font-mono">Pontuação: <strong className="text-emerald-400">{highestDimension.score} / 100 pts</strong></p>
            </div>

            {/* Maior Oportunidade */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-1 shadow-md">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                <AlertCircle size={16} /> Maior Oportunidade de Ganho
              </div>
              <p className="text-base font-black text-white">{lowestDimension.name}</p>
              <p className="text-xs text-white/70 font-mono">Pontuação: <strong className="text-amber-400">{lowestDimension.score} / 100 pts</strong></p>
            </div>

            {/* Interactive Dimension Hover Explanation */}
            <div className="p-4 bg-black/60 border border-white/10 rounded-2xl space-y-2">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                Selecione um Pilar para Detalhar:
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(diagnosis.dimensions).map(([key, val]) => (
                  <button
                    key={key}
                    onMouseEnter={() => setHoveredDimension(key as any)}
                    onClick={() => setHoveredDimension(key as any)}
                    className={cn(
                      "p-2 rounded-lg border text-left transition-all text-[10px] font-bold flex justify-between items-center cursor-pointer",
                      hoveredDimension === key
                        ? "bg-gold/25 border-gold text-gold shadow-md"
                        : "bg-white/5 border-white/5 text-white/70 hover:border-white/20"
                    )}
                  >
                    <span className="truncate pr-1">{DIMENSION_NAMES[key as keyof typeof DIMENSION_NAMES]}</span>
                    <span className="font-mono text-white">{val}%</span>
                  </button>
                ))}
              </div>

              {hoveredDimension && (
                <div className="pt-2 border-t border-white/10 text-[11px] text-gold/90 leading-snug animate-fadeIn">
                  <strong>{DIMENSION_NAMES[hoveredDimension]}:</strong> {DIMENSION_DESCRIPTIONS[hoveredDimension]}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 6. ANÁLISE ESTRATÉGICA DETALHADA */}
      <div className="bg-vertus-gray border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">Parecer da Consultoria</span>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Análise Estratégica Vertus</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* O que encontramos */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-black text-gold uppercase tracking-wider flex items-center gap-2">
              <Target size={16} /> O que encontramos na {company}:
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-gold font-bold">•</span>
                <span>Falta de visibilidade clara do fluxo de caixa projetado nos próximos 30 a 60 dias.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold font-bold">•</span>
                <span>Dificuldade de mensurar a margem de contribuição real por serviço ou produto vendido.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold font-bold">•</span>
                <span>Rotinas operacionais dependentes de intervenção manual direta do empresário.</span>
              </li>
            </ul>
          </div>

          {/* O impacto disso */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <TrendingDown size={16} /> O impacto direto na operação:
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>Sensação constante de faturar bem mas não ver a cor do dinheiro ao final do mês.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>Insegurança ao tomar decisões de contratação, investimento em marketing ou ampliação.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>Desperdício de horas valiosas do empresário em tarefas burocráticas e pagamento de contas.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* PRIORITY #1 HIGHLIGHT BOX */}
        <div className="bg-gradient-to-r from-gold/20 via-gold/10 to-transparent border-2 border-gold/40 rounded-2xl p-5 sm:p-6 space-y-2 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-black text-gold uppercase tracking-widest">
            <Zap size={16} /> Prioridade Número 1 Recomendada pela Vertus
          </div>
          <p className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
            Estruturar a Conciliação Bancária Diária e o Fluxo de Caixa Projetado
          </p>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
            Para a realidade da <strong className="text-white">{company}</strong>, a implementação de processos padronizados de conciliação diária e DFC gerencial é a ação que tende a gerar o maior ganho de controle e alívio de caixa imediato.
          </p>
        </div>
      </div>

      {/* 7. MENTORA VERTUS IA — HUMANIZADA E CONSULTIVA */}
      <div className="bg-gradient-to-br from-vertus-gray via-black to-vertus-black border border-gold/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Header Badge & Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-gold text-[9px] font-black uppercase tracking-widest">
              <Sparkles size={12} /> CONSULTORIA FINANCEIRA EM TEMPO REAL
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Mentora Vertus IA</h3>
            <p className="text-xs text-white/60">Análise Inteligente e Orientação Prática para <strong className="text-gold">{company}</strong></p>
          </div>
        </div>

        {/* Quick Question Chips */}
        <div className="space-y-2">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">PERGUNTAS FREQUENTES DO EMPRESÁRIO:</p>
          <div className="flex flex-wrap gap-2">
            {[
              `Qual o maior risco do caixa da ${company} hoje?`,
              `Por onde devo começar a organização financeira?`,
              `Como recuperar a margem de lucro perdida?`
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleAskAi(chip)}
                disabled={isAiLoading}
                className="px-3.5 py-2 bg-black/60 hover:bg-gold/20 hover:border-gold/50 border border-white/10 text-white/80 hover:text-white rounded-xl text-xs font-medium transition-all text-left flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <span>💡</span> {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Input & PERGUNTAR Button */}
        <div className="flex items-center gap-2 bg-black/80 border border-white/15 rounded-2xl p-2 focus-within:border-gold transition-colors shadow-inner">
          <input
            type="text"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAskAi()}
            placeholder={`Tire sua dúvida com a Mentora Financeira sobre a ${company}...`}
            className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-white px-3 placeholder-white/30 font-medium"
          />
          <button
            onClick={() => handleAskAi()}
            disabled={!aiQuestion.trim() || isAiLoading}
            className="px-5 py-3 bg-gradient-to-br from-gold via-gold to-gold-dark text-vertus-black font-black text-xs uppercase tracking-wider rounded-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center gap-2 shrink-0 shadow-md shadow-gold/20 cursor-pointer"
          >
            {isAiLoading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
            PERGUNTAR
          </button>
        </div>

        {/* Continuous Chat Response Stream */}
        <div 
          ref={aiScrollRef}
          className="bg-black/80 border border-gold/30 rounded-2xl p-4 sm:p-6 max-h-[520px] overflow-y-auto space-y-4 custom-scrollbar scroll-smooth"
        >
          {chatMessages.length === 0 && !isAiLoading && (
            <div className="flex flex-col items-center justify-center text-center py-8 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shadow-lg shadow-gold/10">
                <Sparkles size={24} />
              </div>
              <div className="space-y-1 max-w-md">
                <h4 className="text-sm font-black text-white uppercase tracking-wide">
                  A Mentora Vertus IA aguarda sua dúvida
                </h4>
                <p className="text-xs text-white/60 leading-relaxed font-sans">
                  Clique em uma das perguntas acima ou digite sua pergunta para receber uma orientação financeira consultiva e personalizada para a <strong className="text-gold">{company}</strong>.
                </p>
              </div>
            </div>
          )}

          {chatMessages.map((msg, idx) => (
            <div key={idx} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-md",
                msg.role === "user" ? "bg-white/10 border-white/20" : "bg-gold/15 border-gold/30"
              )}>
                {msg.role === "user" ? <User size={15} className="text-white/60" /> : <Sparkles size={15} className="text-gold" />}
              </div>

              <div className={cn(
                "max-w-[92%] sm:max-w-[88%] p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg font-sans",
                msg.role === "user"
                  ? "bg-white/10 text-white/90 rounded-tr-none border border-white/10"
                  : "bg-black/90 text-white/90 rounded-tl-none border border-gold/20 space-y-3"
              )}>
                {msg.role === "model" && (
                  <div className="flex items-center gap-2 text-[10px] font-black text-gold uppercase tracking-widest border-b border-white/10 pb-2.5 mb-2">
                    <Sparkles size={12} /> ORIENTAÇÃO CONSULTIVA DA MENTORA VERTUS:
                  </div>
                )}
                <div className="prose prose-invert prose-xs sm:prose-sm prose-gold max-w-none text-white/90 leading-relaxed font-sans space-y-2">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {isAiLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center animate-pulse shrink-0">
                <Bot size={15} className="text-gold" />
              </div>
              <div className="bg-black/90 border border-gold/20 p-4 rounded-2xl rounded-tl-none">
                <div className="flex items-center gap-2 text-xs text-gold/90 font-medium">
                  <RefreshCw size={14} className="animate-spin text-gold" />
                  <span>Mentora Vertus IA elaborando orientação consultiva para {company}...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 8. O QUE SUA EMPRESA GANHA (BENEFÍCIOS CONCRETOS) */}
      <div className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">Resultados Práticos</span>
          <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            O que a {company} ganha com a estruturação Vertus
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { title: "Mais Previsibilidade", desc: "Saber com antecedência exatamente o saldo e compromissos dos próximos 90 dias.", icon: TrendingUp },
            { title: "Mais Clareza", desc: "Acompanhar a margem de lucro real e o ponto de equilíbrio sem adivinhações.", icon: PieChart },
            { title: "Mais Controle", desc: "Eliminação total de divergências de caixa e erros de conciliação bancária.", icon: ShieldCheck },
            { title: "Mais Segurança", desc: "Decisões embasadas por números para contratar, investir e expandir.", icon: Award },
            { title: "Mais Tempo", desc: "Liderança liberada das tarefas operacionais para focar em vendas e estratégia.", icon: Clock },
            { title: "Mais Lucro", desc: "Recuperação das margens invisíveis e eliminação do desperdício recorrente.", icon: DollarSign },
          ].map((item, idx) => (
            <div key={idx} className="bg-vertus-gray border border-white/10 rounded-2xl p-5 space-y-2 hover:border-gold/40 transition-all flex flex-col justify-between group shadow-md">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 text-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                  <item.icon size={18} />
                </div>
                <h4 className="text-xs font-black text-white uppercase tracking-tight">{item.title}</h4>
                <p className="text-[11px] text-white/50 leading-relaxed font-sans">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 9. CHAMADA PARA O PLANO DE AÇÃO & CTA PRINCIPAL */}
      <div className="bg-gradient-to-br from-gold/20 via-vertus-gray to-vertus-black border-2 border-gold/50 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-black text-gold uppercase tracking-[0.25em]">Continuidade Natural</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-snug">
            Agora que entendemos a realidade da {company}...
            <br />
            <span className="text-gold">o próximo passo é transformar esse diagnóstico em um plano de execução.</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
            O diagnóstico mostrou onde estão as vulnerabilidades e oportunidades. O Plano de Ação Estratégico mostra exatamente por onde começar nos próximos 30 dias.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 pt-2">
          <button
            onClick={() => setShowStrategicModal(true)}
            className="group relative px-8 sm:px-12 py-4 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black font-black text-xs sm:text-sm tracking-wider uppercase rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-gold/30 overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full -skew-x-12 animate-shine pointer-events-none" />
            <span className="relative z-10">VER MEU PLANO DE AÇÃO</span>
            <ArrowRight className="relative z-10 group-hover:translate-x-1.5 transition-transform" size={18} />
          </button>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">
            Plano estratégico personalizado para os próximos 30 dias
          </p>
        </div>
      </div>

      {/* STRATEGIC PLAN MODAL */}
      <StrategicPlanModal
        isOpen={showStrategicModal}
        onClose={() => setShowStrategicModal(false)}
        lead={lead}
        diagnosis={diagnosis}
        onOpenAboutVertus={onOpenAboutVertus || (() => setShowAbout(true))}
      />

      {/* ABOUT VERTUS MODAL */}
      <AnimatePresence>
        {showAbout && (
          <AboutVertus
            onClose={() => setShowAbout(false)}
            hasCompletedDiagnosis={true}
            onNavigateToActionPlan={() => {
              setShowAbout(false);
              setShowStrategicModal(true);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

