import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  ShieldCheck, ArrowRight, CheckCircle2, TrendingUp, X, 
  Sparkles, Users, Award, Briefcase, Cpu, Zap, Activity, 
  BrainCircuit, Bot, Clock, ArrowDownRight, Layers, Lock, 
  Building2, HelpCircle, Check, Compass, Eye, Target, 
  ChevronRight, ArrowUpRight, AlertCircle, FileText
} from "lucide-react";
import { VERTUS_WHATSAPP_LINK } from "../constants";
import { ref, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { storage, db } from "../lib/firebase";

import marciaImg from "../assets/marcia.jpg";

interface AboutVertusProps {
  onClose: () => void;
  hasCompletedDiagnosis?: boolean;
  onNavigateToActionPlan?: () => void;
  onNavigateToDiagnosis?: () => void;
}

export default function AboutVertus({ 
  onClose, 
  hasCompletedDiagnosis = false,
  onNavigateToActionPlan,
  onNavigateToDiagnosis
}: AboutVertusProps) {
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({
    marcia: marciaImg
  });

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({
    marcia: false
  });

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const specDoc = await getDoc(doc(db, "specialists", "marcia"));
        if (specDoc.exists()) {
          const data = specDoc.data();
          const imageUrl = data.imageUrl || data[" imageUrl"] || data["ImageUrl"] || data["imageURL"];
          if (imageUrl) {
            setImageUrls(prev => ({ ...prev, marcia: imageUrl }));
            setImageErrors(prev => ({ ...prev, marcia: false }));
            return;
          }
        }
      } catch (e) {
        // Fallback to storage or static import
      }

      // Try Firebase Storage
      const extensions = [".jpg", ".png", ".jpeg", ".webp"];
      const folders = ["", "specialists/", "assets/"];

      for (const folder of folders) {
        for (const ext of extensions) {
          try {
            const storageRef = ref(storage, `${folder}marcia${ext}`);
            const url = await getDownloadURL(storageRef);
            setImageUrls(prev => ({ ...prev, marcia: url }));
            setImageErrors(prev => ({ ...prev, marcia: false }));
            return;
          } catch (e) {
            // Keep looking
          }
        }
      }
    };

    fetchImages();
  }, []);

  const handleConsultantClick = () => {
    onClose();
    if (hasCompletedDiagnosis) {
      if (onNavigateToActionPlan) {
        onNavigateToActionPlan();
      } else {
        window.dispatchEvent(new CustomEvent("navigate-to-action-plan"));
      }
    } else {
      if (onNavigateToDiagnosis) {
        onNavigateToDiagnosis();
      } else {
        window.dispatchEvent(new CustomEvent("navigate-to-diagnosis"));
      }
    }
  };

  const handleDirectWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = "Olá! Gostaria de conversar com um estrategista da VERTUS sobre o meu diagnóstico financeiro e entender como estruturar a operação da minha empresa.";
    window.open(`${VERTUS_WHATSAPP_LINK}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const SectionDivider = () => (
    <div className="w-full flex items-center justify-center py-2">
      <div className="h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] bg-vertus-black overflow-y-auto selection:bg-gold selection:text-vertus-black font-sans"
    >
      {/* Top Bar / Navigation */}
      <header className="sticky top-0 z-[260] bg-vertus-black/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black italic text-gold tracking-tighter">VERTUS</span>
          <div className="h-4 w-px bg-white/15" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50">Autoridade & Metodologia</span>
        </div>
        
        <button 
          onClick={onClose}
          className="px-3.5 py-1.5 bg-white/5 border border-white/15 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 text-xs font-bold group cursor-pointer"
        >
          <span className="text-[10px] uppercase font-black tracking-widest text-white/50 group-hover:text-gold transition-colors">Voltar ao Diagnóstico</span>
          <X size={16} className="text-gold" />
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-20">

        {/* SEÇÃO 1 — HERO: POSICIONAMENTO E IDENTIFICAÇÃO */}
        <section className="relative text-center pt-6 pb-4 space-y-6">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/25 rounded-full text-gold text-[10px] font-black tracking-[0.25em] uppercase shadow-inner"
          >
            <ShieldCheck size={14} />
            Gestão Financeira Estruturada para Empresas
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3 max-w-4xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-[1.15]">
              Sua empresa pode vender todos os meses e, ainda assim, não ter controle sobre o próprio dinheiro.
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-gold-dark">
              É isso que a Vertus ajuda a transformar.
            </p>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Estruturamos a operação financeira da sua empresa para que você saiba o que entra, o que sai, quanto realmente sobra e como tomar decisões com mais segurança.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-2 flex flex-col items-center gap-3"
          >
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={handleConsultantClick}
                className="px-7 py-3.5 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-[1.02] transition-all shadow-xl shadow-gold/15 flex items-center gap-2.5 cursor-pointer"
              >
                <span>{hasCompletedDiagnosis ? "Ver Meu Plano de Ação & Agendar" : "Responder Diagnóstico para Agendar"}</span>
                <ArrowRight size={16} />
              </button>
              <button 
                onClick={onClose}
                className="px-6 py-3.5 bg-white/5 border border-white/15 text-white/80 hover:text-white hover:bg-white/10 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                {hasCompletedDiagnosis ? "Voltar ao Painel" : "Voltar ao Diagnóstico"}
              </button>
            </div>
            <p className="text-[11px] text-gold/80 font-medium">
              {hasCompletedDiagnosis 
                ? "✓ Diagnóstico concluído — Direcionando para seu Plano de Ação & Agendamento" 
                : " Responda às perguntas rápidas para liberar o agendamento gratuito"}
            </p>
          </motion.div>
        </section>

        {/* SEÇÃO 2 — IDENTIFICAÇÃO COM A REALIDADE DO EMPRESÁRIO */}
        <SectionDivider />

        <section className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">Realidade Empresarial</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Você trabalha, vende e movimenta a empresa. Mas consegue responder a estas perguntas com segurança?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Quanto a sua empresa realmente lucrou no último mês?",
              "Você sabe como estará o seu caixa daqui a 30, 60 ou 90 dias?",
              "Você consegue identificar exatamente onde o dinheiro está sendo perdido?",
              "Você sabe quanto pode investir sem comprometer a operação?",
              "As decisões são tomadas com informações ou apenas olhando o saldo bancário?",
              "O financeiro ajuda você a decidir ou apenas resolve urgências diárias?"
            ].map((question, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3 hover:border-gold/40 transition-all hover:bg-white/[0.04] flex flex-col justify-between"
              >
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 text-gold flex items-center justify-center shrink-0">
                  <HelpCircle size={18} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">{question}</p>
              </motion.div>
            ))}
          </div>

          <div className="p-5 bg-gold/10 border border-gold/30 rounded-2xl text-center max-w-3xl mx-auto space-y-1">
            <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
              Se algumas dessas respostas ainda não estão claras, <strong className="text-gold font-bold">o problema pode não estar na falta de vendas</strong>. Pode estar na estrutura financeira que sustenta a empresa.
            </p>
          </div>
        </section>

        {/* SEÇÃO 3 — O PROBLEMA NÃO É APENAS FINANCEIRO */}
        <SectionDivider />

        <section className="bg-vertus-gray border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-3 max-w-3xl">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">Impacto na Gestão</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Quando os números não são confiáveis, todas as decisões ficam mais difíceis.
            </h2>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
              Sem uma rotina financeira estruturada, o empresário passa a decidir pelo que enxerga na conta bancária, reage aos problemas conforme eles aparecem e dificilmente consegue planejar o futuro com segurança.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              "Contratações de pessoal",
              "Novos investimentos",
              "Formação de preços",
              "Compras de fornecedores",
              "Expansão do negócio",
              "Retiradas dos sócios",
              "Planejamento de caixa",
              "Tranquilidade pessoal"
            ].map((area, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="p-3 bg-black/40 border border-white/10 rounded-xl flex items-center gap-2.5"
              >
                <AlertCircle size={15} className="text-gold shrink-0" />
                <span className="text-xs text-white/80 font-medium">{area}</span>
              </motion.div>
            ))}
          </div>

          <div className="p-4 bg-gradient-to-r from-gold/15 via-gold/5 to-transparent border-l-4 border-gold rounded-r-xl">
            <p className="text-xs sm:text-sm font-bold text-white">
              Princípio VERTUS: <span className="text-gold font-normal">Controle financeiro não serve apenas para olhar o passado. Ele serve para construir o futuro da empresa.</span>
            </p>
          </div>
        </section>

        {/* SEÇÃO 4 — A VISÃO DA VERTUS */}
        <SectionDivider />

        <section className="relative bg-gradient-to-br from-gold/15 via-gold/5 to-transparent border border-gold/30 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Compass size={220} className="text-gold" />
          </div>

          <div className="space-y-3 max-w-3xl relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">Direção & Visão</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
              O financeiro não deve apenas registrar o que aconteceu. <span className="text-gold">Ele deve mostrar o que fazer a partir de agora.</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
              Na Vertus, acreditamos que o setor financeiro precisa ser uma fonte de direção para o empresário. Por isso, não organizamos apenas documentos, contas ou planilhas. Estruturamos rotinas, informações e processos para que a empresa consiga tomar decisões com mais clareza e previsibilidade.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            {[
              "Informações confiáveis geram decisões mais seguras.",
              "Organização financeira reduz improvisos e incertezas.",
              "Tecnologia acelera processos, mas a estratégia continua sendo humana.",
              "O empresário precisa entender seus números, não apenas recebê-los."
            ].map((p, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="bg-black/50 border border-white/10 p-4 rounded-2xl space-y-2 flex flex-col justify-between"
              >
                <CheckCircle2 size={16} className="text-gold" />
                <p className="text-xs text-white/90 leading-snug font-medium">{p}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SEÇÃO 5 — AUTORIDADE DA MARCIA NUNES */}
        <section className="bg-vertus-gray border border-white/10 rounded-3xl p-6 sm:p-8 space-y-8 hover:border-gold/30 transition-all shadow-xl">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Foto Marcia */}
            <div className="md:col-span-5 relative">
              <div className="aspect-[3/4] max-w-xs mx-auto md:max-w-none rounded-2xl overflow-hidden relative border border-white/15 shadow-2xl bg-white/5 group">
                {imageErrors.marcia ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/5 text-white/30 text-xs font-bold">
                    Marcia Nunes
                  </div>
                ) : (
                  <img 
                    src={imageUrls.marcia} 
                    alt="Marcia Nunes - Estrategista Financeira"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-all duration-500"
                    onError={() => setImageErrors(prev => ({ ...prev, marcia: true }))}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-3 py-1 bg-gold text-vertus-black text-[9px] font-black uppercase tracking-widest rounded-full shadow-md">
                    17+ Anos de Atuação Prática
                  </span>
                </div>
              </div>
            </div>

            {/* Informações Marcia */}
            <div className="md:col-span-7 space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-gold uppercase tracking-[0.25em]">Experiência Prática & Método</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Uma metodologia construída por quem conhece a realidade financeira das empresas</h2>
                <div className="pt-2">
                  <h3 className="text-lg font-black text-white">MARCIA NUNES</h3>
                  <p className="text-gold text-xs font-bold uppercase tracking-wider">Estrategista financeira e especialista em estruturação de processos</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
                Ao longo de mais de 17 anos de atuação prática, Marcia Nunes acompanhou empresas em diferentes momentos de organização, crescimento e reestruturação financeira.
              </p>
              
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
                Essa experiência permitiu identificar um padrão: muitos empresários não precisam apenas de mais relatórios. Precisam de uma estrutura que organize a rotina, torne os números confiáveis e transforme informações em decisões. Foi a partir dessa vivência que nasceu a metodologia aplicada pela Vertus.
              </p>

              <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-1.5 border-l-2 border-l-gold">
                <p className="text-xs text-white/90 leading-relaxed font-medium italic">
                  "O empresário não deveria gastar energia tentando decifrar a própria operação financeira. Nosso papel é transformar números em clareza para que ele consiga se concentrar no crescimento."
                </p>
                <span className="text-[10px] text-gold uppercase font-bold tracking-wider block pt-1">— Marcia Nunes</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-center">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-base font-black text-gold">17+ Anos</p>
                  <p className="text-[9px] text-white/50 uppercase font-bold tracking-wider">Experiência Prática</p>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-base font-black text-gold">30+ Empresas</p>
                  <p className="text-[9px] text-white/50 uppercase font-bold tracking-wider">Atendidas</p>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl col-span-2 sm:col-span-1">
                  <p className="text-base font-black text-gold">Gestão Prática</p>
                  <p className="text-[9px] text-white/50 uppercase font-bold tracking-wider">Processos e Organização</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 6 — COMO A VERTUS TRANSFORMA A OPERAÇÃO FINANCEIRA */}
        <SectionDivider />

        <section className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">Sequência de Transformação</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Como transformamos um financeiro desorganizado em uma operação previsível
            </h2>
            <p className="text-white/50 text-xs sm:text-sm">
              Uma metodologia executada passo a passo para conduzir sua empresa com segurança:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { 
                step: "Etapa 1", 
                title: "Entendemos a realidade da empresa", 
                desc: "Mapeamos como o dinheiro entra, como sai, quais rotinas existem e onde estão os principais gargalos." 
              },
              { 
                step: "Etapa 2", 
                title: "Encontramos perdas e riscos", 
                desc: "Identificamos desperdícios, falhas de controle, atrasos, informações inconsistentes e pontos que reduzem a margem ou comprometem o caixa." 
              },
              { 
                step: "Etapa 3", 
                title: "Organizamos a rotina financeira", 
                desc: "Definimos processos, responsáveis, categorias, registros, controles e uma rotina clara de acompanhamento." 
              },
              { 
                step: "Etapa 4", 
                title: "Assumimos e estruturamos a operação", 
                subtitle: "Operação financeira estruturada — BPO Vertus",
                desc: "A equipe Vertus passa a conduzir as rotinas financeiras combinadas, mantendo contas, registros, conciliações e controles atualizados." 
              },
              { 
                step: "Etapa 5", 
                title: "Transformamos números em informações úteis", 
                desc: "Organizamos relatórios, projeções e indicadores em uma linguagem que o empresário consegue compreender e utilizar." 
              },
              { 
                step: "Etapa 6", 
                title: "Acompanhamos e evoluímos continuamente", 
                desc: "A estrutura não é abandonada após a implantação. A Vertus acompanha a operação, identifica melhorias e ajuda o financeiro a evoluir junto com a empresa." 
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="bg-vertus-gray border border-white/10 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-gold/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gold uppercase tracking-widest bg-gold/10 border border-gold/20 px-2.5 py-1 rounded-lg">
                      {item.step}
                    </span>
                    <CheckCircle2 size={16} className="text-white/20 group-hover:text-gold transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-tight pt-1">{item.title}</h3>
                  {item.subtitle && (
                    <span className="text-[10px] font-bold text-gold block bg-gold/5 px-2 py-0.5 rounded border border-gold/20">
                      {item.subtitle}
                    </span>
                  )}
                  <p className="text-xs text-white/60 leading-relaxed pt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SEÇÃO 7 — COMO A ATUAÇÃO ACONTECE NA PRÁTICA (BPO VERTUS) */}
        <SectionDivider />

        <section className="bg-gradient-to-br from-gold/10 via-vertus-gray to-vertus-black border-2 border-gold/50 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 max-w-3xl">
            <span className="text-[10px] font-black text-gold uppercase tracking-[0.25em]">Atuação Prática Vertus</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Na prática, a Vertus assume a organização financeira ao lado da sua empresa.
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
              Por meio do <strong className="text-gold font-bold">BPO Financeiro</strong>, nossa equipe assume as rotinas acordadas, estrutura processos, mantém os controles atualizados e organiza as informações necessárias para que o empresário acompanhe a empresa com clareza.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-3">
            {[
              "Organização das contas a pagar e a receber",
              "Controle das entradas e saídas diárias",
              "Conciliação das movimentações bancárias",
              "Atualização do fluxo financeiro projetado",
              "Rotinas diárias, semanais e mensais seguras",
              "Relatórios claros e periódicos de caixa",
              "Acompanhamento preventivo do saldo",
              "Organização de informações para decisões",
              "Suporte especializado direto ao empresário",
              "Evolução contínua da operação financeira"
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="p-3.5 bg-black/50 border border-white/10 rounded-xl flex items-start gap-2"
              >
                <CheckCircle2 size={15} className="text-gold shrink-0 mt-0.5" />
                <span className="text-xs text-white/90 font-medium leading-snug">{item}</span>
              </motion.div>
            ))}
          </div>

          <div className="p-4 bg-black/60 border border-gold/30 rounded-2xl text-center max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm font-bold text-white">
              Você continua no controle da empresa. <span className="text-gold font-normal">A Vertus cuida para que a operação financeira funcione.</span>
            </p>
          </div>
        </section>

        {/* SEÇÃO 8 — TECNOLOGIA E INTELIGÊNCIA ARTIFICIAL COMO APOIO */}
        <SectionDivider />

        <section className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] font-black text-gold uppercase tracking-[0.25em]">Tecnologia & Pessoas</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              A tecnologia acelera o processo. Nossos especialistas dão direção.
            </h2>
            <p className="text-white/60 text-xs sm:text-sm font-medium leading-relaxed">
              Na Vertus, a inteligência artificial organiza informações, identifica padrões e apoia análises. Mas cada orientação é construída por especialistas que entendem a realidade e os objetivos da empresa.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Zap, label: "A Plataforma Organiza", text: "Centraliza registros, movimentações, contas e informações financeiras." },
              { icon: Bot, label: "A IA Identifica", text: "Ajuda a encontrar padrões, inconsistências, riscos e oportunidades de análise." },
              { icon: Users, label: "Especialistas Interpretam", text: "Transformam os dados em orientações coerentes com a realidade da empresa." },
              { icon: ShieldCheck, label: "O Empresário Decide", text: "Recebe informações mais claras para contratar, investir, reduzir custos ou planejar." }
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="bg-black/40 border border-white/10 p-4 rounded-xl space-y-2"
              >
                <div className="w-8 h-8 rounded-lg bg-gold/15 border border-gold/30 text-gold flex items-center justify-center">
                  <item.icon size={16} />
                </div>
                <h3 className="text-xs font-bold text-white uppercase">{item.label}</h3>
                <p className="text-[11px] text-white/50 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <Cpu size={20} className="text-gold shrink-0" />
              <p className="text-xs text-white/70">
                Toda essa operação é apoiada pelo <strong className="text-white font-bold">Vertus Finance</strong>, a plataforma desenvolvida para integrar rotina, controle, análise e acompanhamento financeiro em um só ambiente.
              </p>
            </div>
          </div>
        </section>

        {/* SEÇÃO 9 — SITUAÇÕES DE ORGANIZAÇÃO INTENSIVA */}
        <SectionDivider />

        <section className="bg-vertus-gray border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold/15 border border-gold/30 text-gold flex items-center justify-center shrink-0">
              <Clock size={18} />
            </div>
            <div>
              <span className="text-[10px] font-black text-gold uppercase tracking-widest block">Formatos Específicos de Entrada</span>
              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                Quando a empresa precisa colocar o financeiro em ordem com mais velocidade
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            Algumas empresas chegam à Vertus em um momento de desorganização intensa, com informações atrasadas, ausência de controle, dificuldades de conciliação ou pouca clareza sobre o caixa. Nesses casos, podemos aplicar uma <strong className="text-gold font-bold">estruturação intensiva de 45 dias</strong> para mapear a situação, corrigir os principais gargalos e criar uma base financeira mais organizada.
          </p>
        </section>

        {/* SEÇÃO 10 — O QUE MUDA QUANDO O EMPRESÁRIO VOLTA A CONFIAR NOS NÚMEROS DA EMPRESA */}
        <SectionDivider />

        <section className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">Comparativo Real</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              O que muda quando o empresário volta a confiar nos números da empresa
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* ANTES */}
            <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-red-400 font-black text-xs uppercase tracking-wider border-b border-red-500/20 pb-3">
                <X size={16} />
                <span>Antes da Vertus</span>
              </div>
              <ul className="space-y-3">
                {[
                  "O dinheiro entra, mas não existe clareza sobre quanto realmente sobra",
                  "As decisões são tomadas olhando apenas o saldo bancário do dia",
                  "O empresário resolve urgências financeiras todos os dias",
                  "Investir, contratar ou expandir gera insegurança",
                  "Cada mês traz novas surpresas e sobressaltos",
                  "As informações chegam atrasadas ou não são confiáveis"
                ].map((text, idx) => (
                  <motion.li 
                    key={idx} 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="flex items-start gap-2 text-xs text-white/60"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
                    <span>{text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* COM A ESTRUTURA VERTUS */}
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-wider border-b border-emerald-500/20 pb-3">
                <Check size={16} />
                <span>Com a estrutura Vertus</span>
              </div>
              <ul className="space-y-3">
                {[
                  "Clareza sobre entradas, saídas e resultado real da operação",
                  "Visão do caixa projetado para os próximos meses",
                  "Rotinas organizadas e responsáveis definidos",
                  "Informações claras para apoiar decisões estratégicas",
                  "Mais segurança para investir, contratar ou crescer",
                  "Menos tempo gasto tentando organizar o financeiro"
                ].map((text, idx) => (
                  <motion.li 
                    key={idx} 
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="flex items-start gap-2 text-xs text-white/80 font-medium"
                  >
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SEÇÃO 11 — BENEFÍCIOS CONCRETOS */}
        <SectionDivider />

        <section className="bg-vertus-gray border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">Resultados de Gestão</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              O Que Você Ganha na Prática
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { label: "Organização", desc: "Uma rotina financeira que funciona sem depender de improvisos" },
              { label: "Previsibilidade", desc: "Mais clareza sobre compromissos, entradas e comportamento do caixa" },
              { label: "Controle", desc: "Informações atualizadas para acompanhar a realidade da empresa" },
              { label: "Clareza", desc: "Números apresentados de forma compreensível" },
              { label: "Segurança", desc: "Mais confiança para contratar, investir e planejar" },
              { label: "Tempo", desc: "Menos energia gasta apagando incêndios financeiros" }
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="p-4 bg-white/5 border border-white/10 rounded-xl text-center space-y-1 hover:border-gold/30 transition-all flex flex-col justify-between"
              >
                <p className="text-xs font-bold text-white uppercase tracking-tight">{item.label}</p>
                <p className="text-[10px] text-white/50 leading-tight">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SEÇÃO 12 — CONEXÃO DIRETA COM O DIAGNÓSTICO */}
        <SectionDivider />

        <section className="bg-gradient-to-r from-gold/15 via-gold/5 to-transparent border border-gold/30 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="space-y-2 max-w-3xl">
            <span className="text-[10px] font-black text-gold uppercase tracking-[0.25em]">Continuidade Natural</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              O diagnóstico mostra onde sua empresa está. <span className="text-gold">A estrutura Vertus mostra como começar a mudar.</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              As respostas fornecidas no diagnóstico ajudam a construir uma fotografia do momento financeiro da sua empresa. O próximo passo é transformar esse mapeamento em prioridades claras, ações práticas e uma estrutura que possa ser executada de acordo com a realidade do negócio.
            </p>
            <p className="text-xs sm:text-sm text-gold font-medium">
              É justamente por isso que, após a conclusão do diagnóstico, você poderá reservar um horário para receber gratuitamente o seu plano de ação.
            </p>
          </div>
        </section>

        {/* SEÇÃO 13 — ENCERRAMENTO E CTA */}
        <SectionDivider />
        <section className="relative bg-gradient-to-br from-gold/15 via-gold/5 to-transparent border border-gold/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-snug">
              Você não precisa continuar tomando decisões importantes sem confiar nos números da sua empresa.
            </h2>
            <p className="text-xs sm:text-sm text-white/70 font-medium leading-relaxed">
              O diagnóstico financeiro é o primeiro passo. A conversa com um especialista transforma as informações levantadas em um plano de ação claro para os próximos 30 dias.
            </p>
          </div>

          <div className="pt-2 flex flex-col items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <button 
                onClick={handleConsultantClick}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-[1.02] transition-all shadow-xl shadow-gold/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{hasCompletedDiagnosis ? "Reservar Horário no Plano de Ação" : "Responder Diagnóstico e Agendar"}</span>
                <ArrowRight size={16} />
              </button>

              <button 
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3.5 bg-white/5 border border-white/15 text-white/80 hover:text-white hover:bg-white/10 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                {hasCompletedDiagnosis ? "Voltar ao Painel" : "Voltar ao Diagnóstico"}
              </button>
            </div>

            <div className="space-y-1.5 text-center">
              <p className="text-xs text-gold font-bold">
                {hasCompletedDiagnosis 
                  ? "✓ Você já respondeu ao diagnóstico! Direcionando para o seu plano personalizado para agendar com o estrategista."
                  : " Responda às perguntas rápidas do diagnóstico para desbloquear seu Plano de Ação e agendar com um especialista."}
              </p>
              <button 
                onClick={handleDirectWhatsAppClick}
                className="text-[11px] text-white/40 hover:text-white/80 underline decoration-white/20 transition-colors cursor-pointer"
              >
                Ou se preferir, converse diretamente com nossa equipe no WhatsApp
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-4 text-[10px] text-white/50 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-gold" /> Plano de ação personalizado</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-gold" /> Conversa orientativa</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-gold" /> Sem compromisso</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-gold" /> Baseada nas respostas do seu diagnóstico</span>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 bg-black/40 text-center">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
          © 2026 VERTUS Performance. Todos os direitos reservados.
        </p>
      </footer>
    </motion.div>
  );
}

export const AboutVix = AboutVertus;
