import React, { useState } from "react";
import { 
  Instagram, 
  Linkedin, 
  MessageSquare, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Share2, 
  ExternalLink, 
  Image as ImageIcon, 
  FileText, 
  Send, 
  Zap, 
  ShieldCheck, 
  Info,
  RefreshCw
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

// Import generated marketing assets
import instaFeedImg from "../assets/images/vertus_insta_feed_1785624433629.jpg";
import instaStoryImg from "../assets/images/vertus_insta_story_1785624446123.jpg";
import linkedinBannerImg from "../assets/images/vertus_linkedin_banner_1785624460332.jpg";
import promoBannerImg from "../assets/images/vertus_promo_banner_1785624246271.jpg";

export default function MarketingKit() {
  const [activeTab, setActiveTab] = useState<"instagram" | "linkedin" | "whatsapp" | "generator">("instagram");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // AI Generator state
  const [niche, setNiche] = useState("Empresas de Serviços e Tecnologia");
  const [targetPlatform, setTargetPlatform] = useState<"Instagram" | "LinkedIn" | "WhatsApp">("Instagram");
  const [tone, setTone] = useState("Consultivo Executivo");
  const [generatedCopy, setGeneratedCopy] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const diagnosisUrl = `${window.location.origin}`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(diagnosisUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const handleGenerateCopy = async () => {
    setIsGenerating(true);
    setGeneratedCopy("");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Atue como um Especialista em Copywriting de Alto Nível da VERTUS (empresa referência em BPO Financeiro e Gestão Estratégica).

TAREFA: Escreva um post/legenda promocional para divulgar o "Raio-X Financeiro Gratuito da Vertus" direcionado para empresários do segmento: ${niche}.

Parâmetros:
- Canal: ${targetPlatform}
- Tom de Voz: ${tone}
- Objetivo: Fazer o empresário clicar no link e realizar o Diagnóstico Financeiro em menos de 3 minutos.

Diretrizes da Vertus:
1. Comece com um gancho forte (Hook) que prenda a atenção da persona.
2. Destaque dores reais como: mistura de contas PJ e PF, margem invisível, falta de DFC, hemorragia financeira silenciosa e decisões sem previsibilidade.
3. Apresente o Raio-X Financeiro como uma ferramenta diagnóstica gratuita, rápida e precisa.
4. Finalize com um Call to Action (CTA) claro instruindo a acessar o link.
5. Se for Instagram, inclua hashtags estratégicas no final. Se for LinkedIn, use parágrafos bem espaçados no formato executivo. Se for WhatsApp, formate com asteriscos para negrito.`;

      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite-preview",
            contents: prompt,
            config: {
              systemInstruction: "Você é o especialista de Growth Marketing e Comunicação da Vertus Financial Performance."
            }
          });

          setGeneratedCopy(response.text || "Erro ao gerar copy.");
          return;
        } catch (err: any) {
          if (err.message?.includes("503") || err.message?.includes("high demand")) {
            attempts++;
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
              continue;
            }
          }
          throw err;
        }
      }
    } catch (error) {
      console.error("Erro na geração de copy:", error);
      setGeneratedCopy("Não foi possível gerar a copy no momento. Por favor, tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const instagramPosts = [
    {
      id: "insta-1",
      title: "Legenda 1 — Hemorragia Financeira Invisível",
      focus: "Conscientização & Dor Financeira",
      text: `🚨 Sua empresa fatura bem, mas no fim do mês você não vê a cor do dinheiro?

A maioria dos empresários confunde faturamento com lucro real. Sem uma DFC (Demonstração de Fluxo de Caixa) diária e conciliação rigorosa, pequenos vazamentos estancam o crescimento do seu negócio.

A Vertus criou o Raio-X Financeiro: uma avaliação diagnóstica online e gratuita que mapeia em menos de 3 minutos os 6 pilares cruciais da sua operação.

Descubra:
✅ Seu nível real de previsibilidade
✅ Se há margem invisível escapando na precificação
✅ Se o seu financeiro é estratégico ou apenas apagador de incêndio

👉 Faça o seu diagnóstico gratuito no link da bio!

#BPOFinanceiro #GestaoFinanceira #VertusFinanceiro #RaioXFinanceiro #PME #FinancasCorporativas #Lucratividade`
    },
    {
      id: "insta-2",
      title: "Legenda 2 — Mudar de Apagador de Incêndio para CEO",
      focus: "Transformação da Rotina do Empresário",
      text: `Quantas horas da sua semana você perde resolvendo pendências bancárias em vez de focar nas vendas da sua empresa? 📊

O BPO Financeiro da Vertus entrega muito mais que conciliação: entregamos clareza e previsibilidade para você tomar decisões de contratação, investimento e expansão sem medo.

Saiba exatamente o grau de maturidade do seu financeiro hoje.

🔗 Acesse o link da nossa bio e faça o Raio-X Financeiro gratuito em 3 minutos!`
    }
  ];

  const linkedinPosts = [
    {
      id: "linkedin-1",
      title: "Post LinkedIn 1 — O Dilema do CEO entre Lucro e Caixa",
      focus: "Tom Executivo & Decisão Estratégica",
      text: `A maior armadilha no crescimento de uma PME é gerenciar a empresa pelo saldo bancário.

Muitos executivos e sócios veem o DRE apontar lucro, mas enfrentam sufoco constante no caixa. Por quê?
1. Prazos médios de recebimento e pagamento desalinhados.
2. Mistura involuntária de despesas operacionais com investimentos.
3. Falta de categorização estratégica de custos fixos vs. variáveis.

Na VERTUS, acreditamos que o financeiro não deve ser um setor passivo que apenas emite boletos e paga contas, mas sim a bússola estratégica do negócio.

Desenvolvemos o Raio-X Financeiro Vertus — um diagnóstico gratuito e objetivo desenhado para lideranças que buscam clareza operacional.

Em apenas 3 minutos, você recebe uma pontuação precisa dos 6 pilares financeiros da sua empresa.

Acesse e avalie sua operação: ${diagnosisUrl}`
    },
    {
      id: "linkedin-2",
      title: "Post LinkedIn 2 — BPO Financeiro Operacional vs. Estratégico",
      focus: "Posicionamento Vertus & Governança",
      text: `Ter um financeiro funcionando não significa ter um financeiro eficiente.

Se sua equipe só avisa sobre problemas depois que eles acontecem, você está operando no escuro. A gestão financeira moderna exige dados em tempo real, previsibilidade de fluxo e indicadores que direcionem o crescimento.

Com o Raio-X Financeiro VERTUS, você identifica instantaneamente as vulnerabilidades de caixa e governança do seu negócio.

Quer saber em qual nível de maturidade sua empresa se encontra hoje?

Confira em: ${diagnosisUrl}`
    }
  ];

  const whatsappMessages = [
    {
      id: "wa-1",
      title: "Mensagem para Clientes / Contatos da Rede (WhatsApp)",
      focus: "Abordagem Direta e Amigável",
      text: `Olá! Tudo bem?

Passando para compartilhar algo que estamos oferecendo aqui na VERTUS e que tem ajudado muitos empresários a organizarem o caixa.

Desenvolvemos o *Raio-X Financeiro Vertus* — uma ferramenta diagnóstica gratuita que avalia em 3 minutos os 6 pilares financeiros da empresa e aponta onde pode estar ocorrendo vazamento de margem.

Achei que seria super útil para o seu momento:
👉 ${diagnosisUrl}

Se quiser trocar uma ideia sobre o resultado depois, estou à disposição!`
    },
    {
      id: "wa-2",
      title: "Mensagem para Parceiros & Contadores",
      focus: "Parceria e Indicação",
      text: `Olá! Como vai?

Estamos disponibilizando o *Diagnóstico Financeiro Vertus* gratuitamente para parceiros e suas redes de contatos empresariais.

O diagnóstico analisa conciliação, fluxo de caixa, precificação e previsibilidade em menos de 3 minutos, gerando um score imediato para a gestão.

Você pode conferir aqui: ${diagnosisUrl}

Qualquer dúvida ou se quiser indicar para algum cliente, conte conosco!`
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-gold/15 via-gold/5 to-transparent border border-gold/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-gold/20 border border-gold/40 text-gold rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck size={12} /> Acesso Exclusivo Equipe Vertus
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Kit de Divulgação do Diagnóstico
            </h2>
            <p className="text-xs text-white/60 max-w-2xl leading-relaxed">
              Material oficial de marketing e vendas para campanhas no Instagram, LinkedIn e abordagens no WhatsApp. Utilize os criativos em alta definição e as legendas estratégicas pré-aprovadas.
            </p>
          </div>

          <div className="bg-black/60 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="text-left">
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Link Oficial do Diagnóstico</p>
              <p className="text-xs font-mono text-gold truncate max-w-[200px] sm:max-w-[260px]">{diagnosisUrl}</p>
            </div>
            <button
              onClick={handleCopyLink}
              className={cn(
                "px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shrink-0",
                linkCopied ? "bg-green-500 text-white" : "bg-gold text-vertus-black hover:scale-105"
              )}
            >
              {linkCopied ? (
                <>
                  <Check size={14} /> Copiado!
                </>
              ) : (
                <>
                  <Copy size={14} /> Copiar Link
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab("instagram")}
          className={cn(
            "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2.5",
            activeTab === "instagram"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-pink-500/20"
              : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
          )}
        >
          <Instagram size={16} /> Instagram (Feed & Stories)
        </button>

        <button
          onClick={() => setActiveTab("linkedin")}
          className={cn(
            "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2.5",
            activeTab === "linkedin"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
          )}
        >
          <Linkedin size={16} /> LinkedIn Executivo
        </button>

        <button
          onClick={() => setActiveTab("whatsapp")}
          className={cn(
            "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2.5",
            activeTab === "whatsapp"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
              : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
          )}
        >
          <MessageSquare size={16} /> WhatsApp / Direct
        </button>

        <button
          onClick={() => setActiveTab("generator")}
          className={cn(
            "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2.5",
            activeTab === "generator"
              ? "bg-gold text-vertus-black shadow-lg shadow-gold/20"
              : "bg-gold/10 text-gold hover:bg-gold/20"
          )}
        >
          <Sparkles size={16} /> Gerador de Copy com IA
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "instagram" && (
          <motion.div
            key="instagram"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-10"
          >
            {/* Visual Assets Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                    <ImageIcon size={18} className="text-pink-500" /> Artes Oficiais para Instagram
                  </h3>
                  <p className="text-xs text-white/40">Imagens otimizadas nos formatos Feed (1:1 e 4:5) e Stories/Reels (9:16)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Image 1: Feed 1:1 */}
                <div className="bg-vertus-gray border border-white/10 rounded-2xl p-4 space-y-3 flex flex-col justify-between hover:border-gold/40 transition-all">
                  <div className="space-y-2">
                    <div className="relative rounded-xl overflow-hidden aspect-square border border-white/10 bg-black">
                      <img src={instaFeedImg} alt="Vertus Instagram Feed" className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-gold border border-gold/30">
                        Feed 1:1 Quadrado
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white uppercase tracking-tight pt-1">Artes para Feed — Diagnóstico</p>
                    <p className="text-[10px] text-white/50">Ideal para post de carrossel ou post único no feed do Instagram.</p>
                  </div>
                  <a
                    href={instaFeedImg}
                    download="vertus_instagram_feed.jpg"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-white/10 hover:bg-gold hover:text-vertus-black text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={14} /> Baixar Imagem (Alta Res)
                  </a>
                </div>

                {/* Image 2: Story 9:16 */}
                <div className="bg-vertus-gray border border-white/10 rounded-2xl p-4 space-y-3 flex flex-col justify-between hover:border-gold/40 transition-all">
                  <div className="space-y-2">
                    <div className="relative rounded-xl overflow-hidden aspect-[9/16] max-h-[320px] border border-white/10 bg-black mx-auto">
                      <img src={instaStoryImg} alt="Vertus Instagram Story" className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-pink-400 border border-pink-500/30">
                        Stories / Reels 9:16
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white uppercase tracking-tight pt-1">Arte para Stories e Status</p>
                    <p className="text-[10px] text-white/50">Formato vertical com área para sticker de link do Instagram.</p>
                  </div>
                  <a
                    href={instaStoryImg}
                    download="vertus_instagram_story.jpg"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-white/10 hover:bg-gold hover:text-vertus-black text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={14} /> Baixar Imagem Story
                  </a>
                </div>

                {/* Image 3: Promo Banner 1:1 */}
                <div className="bg-vertus-gray border border-white/10 rounded-2xl p-4 space-y-3 flex flex-col justify-between hover:border-gold/40 transition-all">
                  <div className="space-y-2">
                    <div className="relative rounded-xl overflow-hidden aspect-square border border-white/10 bg-black">
                      <img src={promoBannerImg} alt="Vertus Banner Promo" className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-gold border border-gold/30">
                        Banner Premium Gold
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white uppercase tracking-tight pt-1">Capa Promocional — Raio-X</p>
                    <p className="text-[10px] text-white/50">Estética dark luxo com gráficos financeiros para feed executivo.</p>
                  </div>
                  <a
                    href={promoBannerImg}
                    download="vertus_promo_banner.jpg"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-white/10 hover:bg-gold hover:text-vertus-black text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={14} /> Baixar Imagem Banner
                  </a>
                </div>
              </div>
            </div>

            {/* Captions Grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                <FileText size={18} className="text-gold" /> Legendas Prontas para Instagram
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {instagramPosts.map((post) => (
                  <div key={post.id} className="bg-vertus-gray border border-white/10 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-black text-white uppercase tracking-tight">{post.title}</h4>
                        <span className="px-2.5 py-1 bg-gold/10 border border-gold/20 text-gold rounded-lg text-[9px] font-bold uppercase tracking-wider shrink-0">
                          {post.focus}
                        </span>
                      </div>
                      <div className="bg-black/60 border border-white/5 rounded-xl p-4 text-xs font-mono text-white/80 whitespace-pre-wrap leading-relaxed max-h-[280px] overflow-y-auto">
                        {post.text}
                      </div>
                    </div>

                    <button
                      onClick={() => copyToClipboard(post.text, post.id)}
                      className={cn(
                        "w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                        copiedId === post.id ? "bg-green-500 text-white" : "bg-gold/20 hover:bg-gold text-gold hover:text-vertus-black"
                      )}
                    >
                      {copiedId === post.id ? (
                        <>
                          <Check size={14} /> Copiado para a Área de Transferência!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copiar Legenda Completa
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "linkedin" && (
          <motion.div
            key="linkedin"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-10"
          >
            {/* Visual Asset LinkedIn */}
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                <ImageIcon size={18} className="text-blue-500" /> Arte Otimizada para LinkedIn (16:9 / Banner)
              </h3>

              <div className="bg-vertus-gray border border-white/10 rounded-2xl p-6 space-y-4 max-w-3xl">
                <div className="relative rounded-xl overflow-hidden aspect-[16/9] border border-white/10 bg-black">
                  <img src={linkedinBannerImg} alt="Vertus LinkedIn Banner" className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-blue-400 border border-blue-500/30">
                    LinkedIn Post / Banner 16:9
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-tight">Banner Executivo — Diagnóstico Vertus</p>
                    <p className="text-xs text-white/50">Formato horizontal profissional para artigos ou posts no LinkedIn.</p>
                  </div>
                  <a
                    href={linkedinBannerImg}
                    download="vertus_linkedin_banner.jpg"
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shrink-0"
                  >
                    <Download size={14} /> Baixar Arte LinkedIn
                  </a>
                </div>
              </div>
            </div>

            {/* LinkedIn Posts Grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                <FileText size={18} className="text-blue-400" /> Posts Prontos no Tom Executivo (LinkedIn)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {linkedinPosts.map((post) => (
                  <div key={post.id} className="bg-vertus-gray border border-white/10 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-black text-white uppercase tracking-tight">{post.title}</h4>
                        <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-[9px] font-bold uppercase tracking-wider shrink-0">
                          {post.focus}
                        </span>
                      </div>
                      <div className="bg-black/60 border border-white/5 rounded-xl p-4 text-xs font-sans text-white/80 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                        {post.text}
                      </div>
                    </div>

                    <button
                      onClick={() => copyToClipboard(post.text, post.id)}
                      className={cn(
                        "w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                        copiedId === post.id ? "bg-green-500 text-white" : "bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white"
                      )}
                    >
                      {copiedId === post.id ? (
                        <>
                          <Check size={14} /> Texto Copiado!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copiar Post para LinkedIn
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "whatsapp" && (
          <motion.div
            key="whatsapp"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                <Send size={18} className="text-emerald-500" /> Abordagem Direta via WhatsApp & E-mail
              </h3>
              <p className="text-xs text-white/50">Mensagens objetivas para enviar individualmente a empresários da sua rede de relacionamentos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {whatsappMessages.map((msg) => (
                <div key={msg.id} className="bg-vertus-gray border border-white/10 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-black text-white uppercase tracking-tight">{msg.title}</h4>
                      <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[9px] font-bold uppercase tracking-wider shrink-0">
                        {msg.focus}
                      </span>
                    </div>
                    <div className="bg-black/60 border border-white/5 rounded-xl p-4 text-xs font-sans text-white/90 whitespace-pre-wrap leading-relaxed">
                      {msg.text}
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(msg.text, msg.id)}
                    className={cn(
                      "w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                      copiedId === msg.id ? "bg-green-500 text-white" : "bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white"
                    )}
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check size={14} /> Mensagem Copiada!
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copiar Mensagem para WhatsApp
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "generator" && (
          <motion.div
            key="generator"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="bg-vertus-gray border border-gold/30 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <span className="px-3 py-1 bg-gold/10 border border-gold/30 text-gold rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5">
                  <Sparkles size={12} /> Inteligência Artificial Vertus
                </span>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Gerador Personalizado de Copy</h3>
                <p className="text-xs text-white/50">Gere postagens exclusivas adaptadas para nichos específicos de mercado.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Nicho / Segmento do Cliente</label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="Ex: Clínicas Médicas, Indústria Plástica..."
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:border-gold outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Rede Social / Canal</label>
                  <select
                    value={targetPlatform}
                    onChange={(e: any) => setTargetPlatform(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:border-gold outline-none"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Tom de Voz</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:border-gold outline-none"
                  >
                    <option value="Consultivo Executivo">Consultivo Executivo</option>
                    <option value="Provocativo e Alerta de Margem">Provocativo (Alerta de Hemorragia)</option>
                    <option value="Educacional e Didático">Educacional e Didático</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateCopy}
                disabled={isGenerating}
                className={cn(
                  "w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                  isGenerating ? "bg-white/10 text-white/40 cursor-wait" : "bg-gold text-vertus-black hover:scale-[1.01] shadow-xl shadow-gold/20"
                )}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Escrevendo Copy com IA Vertus...
                  </>
                ) : (
                  <>
                    <Zap size={16} /> Gerar Postagem Personalizada
                  </>
                )}
              </button>

              {generatedCopy && (
                <div className="bg-black/70 border border-gold/30 rounded-2xl p-6 space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gold uppercase tracking-widest">Copy Gerada pela IA</span>
                    <button
                      onClick={() => copyToClipboard(generatedCopy, "ai-copy")}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                        copiedId === "ai-copy" ? "bg-green-500 text-white" : "bg-white/10 hover:bg-gold hover:text-vertus-black text-white"
                      )}
                    >
                      {copiedId === "ai-copy" ? (
                        <>
                          <Check size={14} /> Copiado!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copiar Copy
                        </>
                      )}
                    </button>
                  </div>

                  <div className="prose prose-invert max-w-none text-xs text-white/90 leading-relaxed font-sans bg-white/5 p-4 rounded-xl border border-white/5 whitespace-pre-wrap">
                    <ReactMarkdown>{generatedCopy}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
