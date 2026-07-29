import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ShieldCheck, ArrowRight, CheckCircle2, TrendingUp, BarChart3, PieChart, X, MessageSquare, Sparkles, Users, Award, Briefcase, Target, Cpu, Zap, LayoutDashboard, Database, Activity, BrainCircuit, Bot } from "lucide-react";
import { cn } from "../lib/utils";
import { VERTUS_WHATSAPP_LINK, VIX_WHATSAPP_LINK } from "../constants";
import { ref, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { storage, db } from "../lib/firebase";

import marciaImg from "../assets/marcia.jpg";
import kaueImg from "../assets/kaue.jpg";
import felipeImg from "../assets/felipe.jpg";

interface AboutVertusProps {
  onClose: () => void;
}

export default function AboutVertus({ onClose }: AboutVertusProps) {
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({
    marcia: marciaImg
  });

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({
    marcia: false
  });

  const [loading, setLoading] = useState<Record<string, boolean>>({
    marcia: false
  });

  useEffect(() => {
    const fetchImages = async () => {
      const names = ["marcia"];
      const extensions = [".jpg", ".png", ".jpeg", ".webp"];
      const folders = ["", "specialists/", "assets/"];

      // Check Firestore and Storage for Marcia
      await Promise.all(names.map(async (name) => {
        let found = false;

        // 1. Try Firestore first
        try {
          const specDoc = await getDoc(doc(db, "specialists", name));
          if (specDoc.exists()) {
            const data = specDoc.data();
            const imageUrl = data.imageUrl || data[" imageUrl"] || data["ImageUrl"] || data["imageURL"];
            if (imageUrl) {
              setImageUrls(prev => ({ ...prev, [name]: imageUrl }));
              setImageErrors(prev => ({ ...prev, [name]: false }));
              found = true;
            }
          }
        } catch (e) {
          // Ignore error
        }

        // 2. Try Firebase Storage
        if (!found) {
          for (const folder of folders) {
            if (found) break;
            for (const ext of extensions) {
              try {
                const storageRef = ref(storage, `${folder}${name}${ext}`);
                const url = await getDownloadURL(storageRef);
                setImageUrls(prev => ({ ...prev, [name]: url }));
                setImageErrors(prev => ({ ...prev, [name]: false }));
                found = true;
                break;
              } catch (e) {
                // Ignore and try next
              }
            }
          }
        }
      }));
    };

    fetchImages();
  }, []);

  const specialists = [
    {
      id: "marcia",
      name: "Marcia Nunes",
      role: "Estrategista Financeira & Especialista em Processos",
      experience: "17+ anos de experiência",
      bio: "Estrategista financeira e especialista em estruturação e organização da gestão financeira empresarial. Com mais de 17 anos de experiência nas áreas de planejamento, faturamento, processos e gestão administrativa, construiu sua carreira ajudando empresas a organizarem suas operações financeiras e tomarem decisões mais seguras e estratégicas.",
      details: "Formada em Administração com pós-graduações em gestão, liderou processos de organização financeira e eficiência operacional em agronegócio, educação e serviços. Seu foco é transformar a área financeira em um pilar estratégico do negócio.",
      image: imageUrls.marcia
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-vertus-black overflow-y-auto selection:bg-gold selection:text-vertus-black"
    >
      {/* Navigation / Header */}
      <div className="sticky top-0 z-[110] bg-vertus-black/90 backdrop-blur-xl border-b border-white/5 px-4 sm:px-8 py-3.5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black italic text-gold tracking-tighter">VERTUS</span>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Conheça a Vertus</span>
        </div>
        <button 
          onClick={onClose}
          className="p-2 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 group"
        >
          <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Fechar</span>
          <X size={18} />
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] bg-gold opacity-[0.04] blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-gold opacity-[0.04] blur-[120px] rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black tracking-[0.3em] uppercase"
          >
            <ShieldCheck size={14} />
            Autoridade em Gestão Financeira
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight max-w-3xl mx-auto"
          >
            A Engenharia por trás do seu <span className="text-transparent bg-clip-text bg-gradient-to-br from-gold via-gold-light to-gold-dark">Lucro</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm md:text-base text-white/50 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Não somos apenas uma consultoria. Somos o braço estratégico que transforma o caos financeiro em uma operação de alta performance, previsível e escalável.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4"
          >
            <button 
              onClick={() => window.open(VERTUS_WHATSAPP_LINK + "?text=Olá!%20Gostaria%20de%20falar%20com%20um%20estrategista%20Vertus.", "_blank")}
              className="group relative px-8 py-3.5 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl hover:scale-[1.01] transition-all shadow-xl shadow-gold/20 flex items-center gap-3 mx-auto overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full -skew-x-12 animate-shine pointer-events-none" />
              Falar com um Estrategista Vertus
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* The Board / Specialists Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 relative">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-6">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
                Estrategista Responsável <span className="text-gold">VERTUS</span>
              </h2>
              <p className="text-white/40 text-xs sm:text-sm font-medium">
                Mais de 17 anos de experiência em finanças corporativas, estruturação e eficiência operacional à frente da sua entrega.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-center">
                <p className="text-lg font-black text-gold">17+</p>
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Anos de Expertise</p>
              </div>
              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-center">
                <p className="text-lg font-black text-gold">50+</p>
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Empresas Atendidas</p>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            {specialists.map((spec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-vertus-gray border border-white/10 rounded-2xl overflow-hidden p-5 sm:p-8 hover:border-gold/30 transition-all shadow-xl"
              >
                <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-center">
                  {/* Photo Column */}
                  <div className="md:col-span-5 relative">
                    <div className="aspect-[3/4] max-w-xs mx-auto md:max-w-none rounded-xl overflow-hidden relative bg-white/5 border border-white/10 shadow-lg group">
                      {loading[spec.id] ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/5 animate-pulse">
                          <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
                        </div>
                      ) : imageErrors[spec.id] ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white/20"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                      ) : (
                        <img 
                          key={spec.image}
                          src={spec.image} 
                          alt={spec.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-all duration-500"
                          onError={() => {
                            setImageErrors(prev => ({ ...prev, [spec.id]: true }));
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="inline-block px-2.5 py-1 bg-gold text-vertus-black text-[9px] font-black uppercase tracking-widest rounded-full shadow-md">
                          {spec.experience}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio & Information Column */}
                  <div className="md:col-span-7 space-y-4 flex flex-col justify-center">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-full text-gold text-[9px] font-black tracking-[0.2em] uppercase mb-2">
                        Liderança Estratégica
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
                        {spec.name}
                      </h3>
                      <p className="text-gold text-xs font-black uppercase tracking-[0.15em] mt-0.5">
                        {spec.role}
                      </p>
                    </div>

                    <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-normal">
                      {spec.bio}
                    </p>

                    <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl space-y-1">
                      <p className="text-[10px] text-gold uppercase font-bold tracking-wider">Formação & Experiência de Campo</p>
                      <p className="text-xs text-white/60 leading-relaxed font-medium">
                        {spec.details}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className="p-2.5 bg-white/5 border border-white/5 rounded-lg text-center">
                        <p className="text-xs font-bold text-white uppercase tracking-wider">17+ Anos</p>
                        <p className="text-[9px] text-white/40 uppercase">Experiência</p>
                      </div>
                      <div className="p-2.5 bg-white/5 border border-white/5 rounded-lg text-center">
                        <p className="text-xs font-bold text-white uppercase tracking-wider">Processos</p>
                        <p className="text-[9px] text-white/40 uppercase">Especialista</p>
                      </div>
                      <div className="p-2.5 bg-white/5 border border-white/5 rounded-lg text-center">
                        <p className="text-xs font-bold text-white uppercase tracking-wider">Decisões</p>
                        <p className="text-[9px] text-white/40 uppercase">Segurança</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VertusFinance Technology Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-[9px] font-black tracking-[0.25em] uppercase"
                >
                  <Cpu size={12} />
                  Diferencial Tecnológico
                </motion.div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                  VertusFinance: A Inteligência que <span className="text-gold">Simplifica</span> o Complexo
                </h2>
                <p className="text-white/40 text-xs sm:text-sm font-medium leading-relaxed">
                  Criamos uma tecnologia proprietária que traduz a complexidade financeira em uma interface intuitiva. O VertusFinance não é apenas um software; é o cérebro operacional do seu negócio.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Zap, title: "Automação Total", desc: "Elimine tarefas manuais e foque no estratégico." },
                  { icon: LayoutDashboard, title: "Gestão Intuitiva", desc: "Processos técnicos simplificados para gerir." },
                  { icon: Activity, title: "Real-Time Data", desc: "Saúde financeira atualizada continuamente." },
                  { icon: Database, title: "Segurança Bancária", desc: "Dados protegidos com criptografia de ponta." }
                ].map((item, i) => (
                  <div key={i} className="space-y-1.5 p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-gold/20 transition-all group">
                    <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center text-gold group-hover:scale-105 transition-transform">
                      <item.icon size={16} />
                    </div>
                    <h4 className="text-xs font-black text-white uppercase tracking-tight">{item.title}</h4>
                    <p className="text-[11px] text-white/30 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10 aspect-video sm:aspect-square bg-vertus-gray border border-white/10 rounded-2xl p-5 shadow-xl overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-50" />
                
                {/* Mockup UI Elements */}
                <div className="h-full w-full flex flex-col gap-4 relative z-10">
                  <div className="flex justify-between items-center">
                    <div className="h-3 w-24 bg-white/10 rounded-full" />
                    <div className="w-7 h-7 bg-gold/20 rounded-lg border border-gold/30" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-16 bg-white/5 rounded-xl border border-white/5 p-3 flex flex-col justify-between">
                      <div className="h-1 w-6 bg-gold/40 rounded-full" />
                      <div className="h-2 w-12 bg-gold rounded-full" />
                    </div>
                    <div className="h-16 bg-white/5 rounded-xl border border-white/5 p-3 flex flex-col justify-between">
                      <div className="h-1 w-6 bg-white/10 rounded-full" />
                      <div className="h-2 w-12 bg-white/20 rounded-full" />
                    </div>
                    <div className="h-16 bg-white/5 rounded-xl border border-white/5 p-3 flex flex-col justify-between">
                      <div className="h-1 w-6 bg-white/10 rounded-full" />
                      <div className="h-2 w-12 bg-white/20 rounded-full" />
                    </div>
                  </div>

                  <div className="flex-1 bg-white/5 rounded-xl border border-white/5 p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="h-2 w-20 bg-white/20 rounded-full" />
                      <div className="h-1.5 w-10 bg-white/10 rounded-full" />
                    </div>
                    <div className="space-y-3">
                      {[80, 60, 90, 40].map((w, i) => (
                        <div key={i} className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${w}%` }}
                            transition={{ duration: 1, delay: 0.3 + (i * 0.1) }}
                            className="h-full bg-gold/40" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Integration Banner - The Vertus Intelligence */}
      <section className="py-10 sm:py-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-gold/15 via-gold/5 to-transparent border border-gold/25 rounded-2xl p-6 sm:p-10 overflow-hidden group shadow-xl">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-15 transition-opacity pointer-events-none">
              <BrainCircuit size={120} className="text-gold" />
            </div>
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold text-vertus-black rounded-full text-[9px] font-black uppercase tracking-wider">
                  <Bot size={14} />
                  IA Full-Time em todos os produtos
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-snug">
                  Inteligência Artificial <br />
                  <span className="text-gold">em cada decisão.</span>
                </h2>
                <p className="text-white/60 text-xs sm:text-sm font-medium leading-relaxed">
                  Na VERTUS, tecnologia é base estratégica. Todos os nossos produtos contam com uma IA treinada pela equipe VERTUS, pronta para atender você a qualquer momento, como um suporte financeiro ativo dentro da sua empresa.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {["Análise Preditiva", "Insights 24/7", "Automação de Dados"].map((tag, i) => (
                    <div key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-white/50 uppercase tracking-wider">
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-vertus-black/50 backdrop-blur-md border border-white/10 rounded-xl space-y-2">
                  <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center text-gold">
                    <Sparkles size={16} />
                  </div>
                  <h4 className="text-xs font-black text-white uppercase tracking-tight">Suporte Full-Time</h4>
                  <p className="text-[11px] text-white/40 leading-relaxed">Respostas claras sempre que surgir uma dúvida. Um especialista Vertus no seu dia a dia.</p>
                </div>
                <div className="p-4 bg-vertus-black/50 backdrop-blur-md border border-white/10 rounded-xl space-y-2">
                  <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center text-gold">
                    <TrendingUp size={16} />
                  </div>
                  <h4 className="text-xs font-black text-white uppercase tracking-tight">Decisões Seguras</h4>
                  <p className="text-[11px] text-white/40 leading-relaxed">Valide caminhos financeiros com base na metodologia Vertus. Menos dúvida, mais segurança.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Ecossistema de Soluções</h2>
            <p className="text-white/40 text-xs sm:text-sm font-medium">Arquitetura financeira sob medida para o seu momento.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* BPO VERTUS - HIGHLIGHTED */}
            <div className="bg-vertus-gray border-2 border-gold rounded-2xl p-6 flex flex-col space-y-5 relative overflow-hidden shadow-xl shadow-gold/10">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-gold text-vertus-black text-[9px] font-black uppercase tracking-wider rounded-bl-xl">
                Destaque
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">BPO VERTUS</h3>
                <p className="text-gold text-[9px] font-black uppercase tracking-widest">Operação e Controle</p>
              </div>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-medium">
                A VERTUS assume integralmente a rotina do seu setor financeiro: contas a pagar, contas a receber, conciliação e fluxo de caixa.
              </p>
              <ul className="space-y-2 pt-2">
                {["Contas a Pagar & Receber", "Conciliação Financeira", "Fluxo de Caixa Atualizado", "Organização Operacional Estrita"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-[11px] text-white/80 font-bold">
                    <CheckCircle2 className="text-gold shrink-0" size={14} />
                    {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => window.open(VERTUS_WHATSAPP_LINK + "?text=Olá!%20Gostaria%20de%20uma%20proposta%20para%20o%20BPO%20Vertus.", "_blank")}
                className="mt-auto w-full py-3 bg-gradient-to-br from-gold to-gold-dark text-vertus-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-[1.01] transition-all shadow-md shadow-gold/20"
              >
                Solicitar Proposta →
              </button>
            </div>

            {/* VERTUS FINANCE */}
            <div className="bg-vertus-gray border border-white/10 rounded-2xl p-6 flex flex-col space-y-5 hover:border-white/20 transition-all shadow-lg">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Vertus Finance</h3>
                <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Sistema Financeiro Inteligente</p>
              </div>
              <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-medium">
                Seu departamento financeiro estratégico. Fluxo de caixa projetado, precificação dinâmica e DRE gerencial.
              </p>
              <ul className="space-y-2 pt-2">
                {["Indicadores em Tempo Real", "Conciliação Inteligente", "Suporte Consultivo Semanal", "IA Estratégica Full-Time"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-[11px] text-white/50 font-bold">
                    <CheckCircle2 className="text-gold/60 shrink-0" size={14} />
                    {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => window.open(VERTUS_WHATSAPP_LINK + "?text=Olá!%20Gostaria%20de%20uma%20proposta%20para%20o%20Vertus%20Finance.", "_blank")}
                className="mt-auto w-full py-3 bg-gradient-to-br from-gold to-gold-dark text-vertus-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-[1.01] transition-all shadow-md shadow-gold/20"
              >
                Solicitar Proposta →
              </button>
            </div>

            {/* CONTROLE 45 DIAS */}
            <div className="bg-vertus-gray border border-white/10 rounded-2xl p-6 flex flex-col space-y-5 hover:border-white/20 transition-all shadow-lg">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Controle 45 Dias</h3>
                <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Auditoria e Organização Acelerada</p>
              </div>
              <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-medium">
                Organização financeira intensiva, com auditoria completa do setor e estruturação dos números para clareza em 45 dias.
              </p>
              <ul className="space-y-2 pt-2">
                {["Auditoria Setorial Completa", "Organização de Números", "Clareza e Previsibilidade", "Suporte de IA Integrado"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-[11px] text-white/50 font-bold">
                    <CheckCircle2 className="text-gold/60 shrink-0" size={14} />
                    {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => window.open(VERTUS_WHATSAPP_LINK + "?text=Olá!%20Gostaria%20de%20uma%20proposta%20para%20o%20Controle%2045%20Dias.", "_blank")}
                className="mt-auto w-full py-3 bg-gradient-to-br from-gold to-gold-dark text-vertus-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-[1.01] transition-all shadow-md shadow-gold/20"
              >
                Solicitar Proposta →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 text-center relative overflow-hidden border-t border-white/5">
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-snug">
              Sua empresa não precisa de mais faturamento. <br />
              <span className="text-gold">Ela precisa de mais Gestão.</span>
            </h2>
            <p className="text-white/40 text-xs sm:text-sm font-medium max-w-xl mx-auto">
              Agende uma conversa estratégica com um de nossos especialistas e descubra como a VERTUS pode transformar seu financeiro em uma máquina de lucro.
            </p>
          </div>
          
          <button 
            onClick={() => window.open(VERTUS_WHATSAPP_LINK + "?text=Olá!%20Gostaria%20de%20agendar%20uma%20conversa%20estratégica.", "_blank")}
            className="group relative px-8 py-4 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl hover:scale-[1.01] transition-all shadow-xl shadow-gold/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full -skew-x-12 animate-shine pointer-events-none" />
            Agendar Agora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 bg-black/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black italic text-gold tracking-tighter">VERTUS</span>
                <span className="text-xs font-black uppercase tracking-widest text-white/80">Raio-X Financeiro</span>
              </div>
              <p className="text-white/40 text-xs font-medium leading-relaxed max-w-sm">
                A VERTUS ajuda empresas a saírem do caos financeiro e tomarem decisões seguras todos os dias através de inteligência de dados e processos de elite.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">Soluções</h4>
              <ul className="space-y-2 text-xs font-bold text-white/40 uppercase tracking-wider">
                <li><a href="#" className="hover:text-gold transition-colors">BPO Vertus</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Vertus Finance</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Controle 45 Dias</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">Legal</h4>
              <ul className="space-y-2 text-xs font-bold text-white/40 uppercase tracking-wider">
                <li><a href="#" className="hover:text-gold transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
              © 2026 VERTUS Consultoria Financeira. Todos os direitos reservados.
            </p>
            <div className="flex gap-4">
              <div 
                onClick={() => window.open(VERTUS_WHATSAPP_LINK, "_blank")}
                className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 text-white/20 hover:text-gold hover:border-gold/30 transition-all cursor-pointer"
              >
                <MessageSquare size={14} />
              </div>
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 text-white/20 hover:text-gold hover:border-gold/30 transition-all cursor-pointer">
                <ShieldCheck size={14} />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}

export const AboutVix = AboutVertus;
