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
      <div className="sticky top-0 z-[110] bg-vertus-black/80 backdrop-blur-xl border-b border-white/5 px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-3xl font-black italic text-gold tracking-tighter">VERTUS</span>
          <div className="h-6 w-px bg-white/10" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Conheça a Vertus</span>
        </div>
        <button 
          onClick={onClose}
          className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 group"
        >
          <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Fechar</span>
          <X size={20} />
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-20%] w-[70%] h-[70%] bg-gold opacity-[0.05] blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-20%] w-[70%] h-[70%] bg-gold opacity-[0.05] blur-[150px] rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto text-center space-y-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 bg-gold/10 border border-gold/20 rounded-full text-gold text-[11px] font-black tracking-[0.4em] uppercase"
          >
            <ShieldCheck size={16} />
            Autoridade em Gestão Financeira
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[1.1] max-w-5xl mx-auto"
          >
            A Engenharia por trás do seu <span className="text-transparent bg-clip-text bg-gradient-to-br from-gold via-gold-light to-gold-dark">Lucro</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/40 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Não somos apenas uma consultoria. Somos o braço estratégico que transforma o caos financeiro em uma operação de alta performance, previsível e escalável.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-12"
          >
            <button 
              onClick={() => window.open(VERTUS_WHATSAPP_LINK + "?text=Olá!%20Gostaria%20de%20falar%20com%20um%20estrategista%20Vertus.", "_blank")}
              className="group relative px-16 py-8 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black font-black text-lg tracking-widest uppercase rounded-[32px] hover:scale-[1.05] transition-all shadow-[0_20px_50px_rgba(212,175,119,0.3)] flex items-center gap-6 mx-auto overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full -skew-x-12 animate-shine pointer-events-none" />
              Falar com um Estrategista Vertus
              <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* The Board / Specialists Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                Estrategista Responsável <span className="text-gold">VERTUS</span>
              </h2>
              <p className="text-white/40 text-lg font-medium">
                Mais de 17 anos de experiência em finanças corporativas, estruturação e eficiência operacional à frente da sua entrega.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-center">
                <p className="text-2xl font-black text-gold">17+</p>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Anos de Expertise</p>
              </div>
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-center">
                <p className="text-2xl font-black text-gold">50+</p>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Empresas Atendidas</p>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            {specialists.map((spec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-vertus-gray border border-white/10 rounded-[36px] overflow-hidden p-6 md:p-10 hover:border-gold/30 transition-all shadow-2xl"
              >
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Photo Column */}
                  <div className="lg:col-span-5 relative">
                    <div className="aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-[28px] overflow-hidden relative bg-white/5 border border-white/10 shadow-xl group">
                      {loading[spec.id] ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/5 animate-pulse">
                          <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
                        </div>
                      ) : imageErrors[spec.id] ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white/20"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                      ) : (
                        <img 
                          key={spec.image}
                          src={spec.image} 
                          alt={spec.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-all duration-700"
                          onError={() => {
                            setImageErrors(prev => ({ ...prev, [spec.id]: true }));
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="inline-block px-3 py-1.5 bg-gold text-vertus-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                          {spec.experience}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio & Information Column */}
                  <div className="lg:col-span-7 space-y-6 flex flex-col justify-center">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gold text-[10px] font-black tracking-[0.2em] uppercase mb-3">
                        Liderança Estratégica
                      </div>
                      <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight">
                        {spec.name}
                      </h3>
                      <p className="text-gold text-xs md:text-sm font-black uppercase tracking-[0.2em] mt-1">
                        {spec.role}
                      </p>
                    </div>

                    <p className="text-white/80 text-base md:text-lg leading-relaxed font-normal">
                      {spec.bio}
                    </p>

                    <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl space-y-2">
                      <p className="text-xs text-gold uppercase font-bold tracking-wider">Formação & Experiência de Campo</p>
                      <p className="text-sm text-white/70 leading-relaxed font-medium">
                        {spec.details}
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
                        <p className="text-xs font-bold text-white uppercase tracking-wider">17+ Anos</p>
                        <p className="text-[10px] text-white/40 uppercase">Experiência</p>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
                        <p className="text-xs font-bold text-white uppercase tracking-wider">Processos</p>
                        <p className="text-[10px] text-white/40 uppercase">Especialista</p>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
                        <p className="text-xs font-bold text-white uppercase tracking-wider">Decisões Seguras</p>
                        <p className="text-[10px] text-white/40 uppercase">Foco Estratégico</p>
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
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gold opacity-[0.03] blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto space-y-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black tracking-[0.3em] uppercase"
                >
                  <Cpu size={14} />
                  Diferencial Tecnológico
                </motion.div>
                <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[1.1]">
                  VertusFinance: A Inteligência que <span className="text-gold">Simplifica</span> o Complexo
                </h2>
                <p className="text-white/40 text-lg font-medium leading-relaxed">
                  Criamos uma tecnologia proprietária que traduz a complexidade financeira em uma interface intuitiva. O VertusFinance não é apenas um software; é o cérebro operacional do seu negócio.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { icon: Zap, title: "Automação Total", desc: "Elimine 90% das tarefas manuais e foque no que importa." },
                  { icon: LayoutDashboard, title: "Gestão Intuitiva", desc: "Processos técnicos simplificados para qualquer pessoa gerir." },
                  { icon: Activity, title: "Real-Time Data", desc: "Sua saúde financeira atualizada a cada segundo." },
                  { icon: Database, title: "Segurança Bancária", desc: "Dados protegidos com criptografia de nível militar." }
                ].map((item, i) => (
                  <div key={i} className="space-y-3 p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-gold/20 transition-all group">
                    <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                      <item.icon size={20} />
                    </div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">{item.title}</h4>
                    <p className="text-xs text-white/30 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10 aspect-square bg-vertus-gray border border-white/10 rounded-[60px] p-8 shadow-3xl overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-50" />
                
                {/* Mockup UI Elements */}
                <div className="h-full w-full flex flex-col gap-6 relative z-10">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-32 bg-white/10 rounded-full" />
                    <div className="w-10 h-10 bg-gold/20 rounded-xl border border-gold/30" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-white/5 rounded-2xl border border-white/5 p-4 flex flex-col justify-between">
                      <div className="h-1.5 w-8 bg-gold/40 rounded-full" />
                      <div className="h-3 w-16 bg-gold rounded-full" />
                    </div>
                    <div className="h-24 bg-white/5 rounded-2xl border border-white/5 p-4 flex flex-col justify-between">
                      <div className="h-1.5 w-8 bg-white/10 rounded-full" />
                      <div className="h-3 w-16 bg-white/20 rounded-full" />
                    </div>
                    <div className="h-24 bg-white/5 rounded-2xl border border-white/5 p-4 flex flex-col justify-between">
                      <div className="h-1.5 w-8 bg-white/10 rounded-full" />
                      <div className="h-3 w-16 bg-white/20 rounded-full" />
                    </div>
                  </div>

                  <div className="flex-1 bg-white/5 rounded-3xl border border-white/5 p-6 space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="h-3 w-24 bg-white/20 rounded-full" />
                      <div className="h-2 w-12 bg-white/10 rounded-full" />
                    </div>
                    <div className="space-y-4">
                      {[80, 60, 90, 40].map((w, i) => (
                        <div key={i} className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${w}%` }}
                            transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                            className="h-full bg-gold/40" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="h-20 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center gap-4">
                    <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
                      <TrendingUp size={16} className="text-vertus-black" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 w-20 bg-gold/40 rounded-full" />
                      <div className="h-3 w-32 bg-gold rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Floating Tech Elements */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gold/20 blur-3xl rounded-full animate-pulse" />
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 blur-3xl rounded-full" />
              </motion.div>

              {/* Decorative Rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-white/[0.02] rounded-full pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Methodology / Value Prop */}
      <section className="py-32 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
                Por que a VERTUS é a escolha das <span className="text-gold">Médias Empresas</span>?
              </h2>
              <p className="text-white/40 text-lg font-medium leading-relaxed">
                Empresas de médio porte sofrem com o "limbo da gestão": faturam muito para serem pequenas, mas não têm a estrutura de processos de uma multinacional. A VERTUS preenche esse gap.
              </p>
            </div>

            <div className="grid gap-8">
              {[
                { icon: Target, title: "Foco em Resultado Real", desc: "Não entregamos planilhas, entregamos margem e caixa." },
                { icon: Award, title: "Visão Multidisciplinar", desc: "Unimos Administração, Direito e Inteligência de Dados." },
                { icon: Briefcase, title: "Experiência CSC", desc: "Processos padronizados com eficiência de grandes corporações." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold/30 transition-all">
                    <item.icon className="text-gold" size={28} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-white uppercase tracking-tight">{item.title}</h4>
                    <p className="text-white/40 text-sm font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-gold/20 to-transparent rounded-[60px] border border-gold/20 p-1">
              <div className="w-full h-full bg-vertus-black rounded-[58px] border border-white/10 p-12 flex flex-col justify-center space-y-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gold opacity-10 blur-3xl" />
                
                <div className="space-y-2">
                  <p className="text-gold text-[10px] font-black uppercase tracking-widest">O Impacto Vertus</p>
                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Resultados Mensuráveis</h3>
                </div>

                <div className="space-y-8">
                  <div className="flex justify-between items-end border-b border-white/5 pb-4">
                    <span className="text-white/40 text-sm font-medium uppercase tracking-widest">Margem Recuperada</span>
                    <span className="text-3xl font-black text-gold">+R$ 8.200/mês</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/5 pb-4">
                    <span className="text-white/40 text-sm font-medium uppercase tracking-widest">Clareza de Caixa</span>
                    <span className="text-3xl font-black text-white">100%</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/5 pb-4">
                    <span className="text-white/40 text-sm font-medium uppercase tracking-widest">Previsibilidade</span>
                    <span className="text-3xl font-black text-white">90 dias+</span>
                  </div>
                </div>

                <p className="text-xs text-white/30 italic leading-relaxed">
                  *Médias baseadas em clientes do programa Vertus Finance no primeiro trimestre de implantação.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Integration Banner - The Vertus Intelligence */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-br from-gold/20 via-gold/5 to-transparent border border-gold/30 rounded-[60px] p-12 md:p-20 overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
              <BrainCircuit size={200} className="text-gold" />
            </div>
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-gold text-vertus-black rounded-full text-[10px] font-black uppercase tracking-widest">
                  <Bot size={16} />
                  IA Full-Time em todos os produtos
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                  Inteligência Artificial <br />
                  <span className="text-gold">em cada decisão.</span>
                </h2>
                <p className="text-white/60 text-lg font-medium leading-relaxed max-w-xl">
                  Na VERTUS, tecnologia não é acessório, é base estratégica. <br />
                  Todos os nossos produtos contam com uma IA treinada pela equipe VERTUS, pronta para atender você a qualquer momento, como um verdadeiro suporte financeiro dentro da sua empresa. <br /><br />
                  Tire dúvidas, valide decisões e receba orientações com a segurança de quem entende da sua realidade, sempre que precisar!
                </p>
                <div className="flex flex-wrap gap-4">
                  {["Análise Preditiva", "Insights 24/7", "Automação de Dados"].map((tag, i) => (
                    <div key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white/40 uppercase tracking-widest">
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-8 bg-vertus-black/40 backdrop-blur-md border border-white/10 rounded-[40px] space-y-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold">
                    <Sparkles size={24} />
                  </div>
                  <h4 className="text-lg font-black text-white uppercase tracking-tight">Suporte Full-Time</h4>
                  <p className="text-xs text-white/40 leading-relaxed">Tenha acesso imediato a respostas claras sempre que surgir uma dúvida. Como ter um especialista da Vertus disponível dentro da sua empresa todos os dias.</p>
                </div>
                <div className="p-8 bg-vertus-black/40 backdrop-blur-md border border-white/10 rounded-[40px] space-y-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold">
                    <TrendingUp size={24} />
                  </div>
                  <h4 className="text-lg font-black text-white uppercase tracking-tight">Decisões Seguras</h4>
                  <p className="text-xs text-white/40 leading-relaxed">Antes de agir, consulte a IA e valide caminhos financeiros com base no método da Vertus. Menos dúvida, menos risco e muito mais confiança nas suas escolhas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Ecossistema de Soluções</h2>
            <p className="text-white/40 text-lg font-medium">Arquitetura financeira sob medida para o seu momento.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* BPO VERTUS - HIGHLIGHTED */}
            <div className="lg:col-span-1 bg-vertus-gray border-2 border-gold rounded-[48px] p-12 flex flex-col space-y-8 relative overflow-hidden shadow-2xl shadow-gold/10">
              <div className="absolute top-0 right-0 px-8 py-3 bg-gold text-vertus-black text-[10px] font-black uppercase tracking-widest rounded-bl-3xl">
                Destaque
              </div>
              <div className="space-y-3">
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter">BPO VERTUS</h3>
                <p className="text-gold text-[10px] font-black uppercase tracking-[0.3em]">Operação e Controle</p>
              </div>
              <p className="text-white/80 text-base leading-relaxed font-semibold">
                A VERTUS assume integralmente a rotina do seu setor financeiro: contas a pagar, contas a receber, conciliação financeira, acompanhamento de fluxo de caixa e organização operacional completa.
              </p>
              <ul className="space-y-3 pt-4">
                {["Contas a Pagar & Receber", "Conciliação Financeira", "Fluxo de Caixa Atualizado", "Organização Operacional Estrita"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-white/80 font-bold">
                    <CheckCircle2 className="text-gold" size={16} />
                    {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => window.open(VERTUS_WHATSAPP_LINK + "?text=Olá!%20Gostaria%20de%20uma%20proposta%20para%20o%20BPO%20Vertus.", "_blank")}
                className="mt-auto w-full py-6 bg-gradient-to-br from-gold to-gold-dark text-vertus-black font-black text-sm uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-gold/20"
              >
                Solicitar Proposta →
              </button>
            </div>

            {/* VERTUS FINANCE */}
            <div className="bg-vertus-gray border border-white/10 rounded-[48px] p-12 flex flex-col space-y-8 hover:border-white/20 transition-all">
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Vertus Finance</h3>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.25em]">Sistema Financeiro Inteligente</p>
              </div>
              <p className="text-white/60 text-sm leading-relaxed font-medium">
                Seu departamento financeiro estratégico. Fluxo de caixa projetado, precificação dinâmica, DRE gerencial e alertas de proteção de caixa.
              </p>
              <ul className="space-y-3 pt-4">
                {["Indicadores em Tempo Real", "Conciliação Inteligente", "Suporte Consultivo Semanal", "IA Estratégica Full-Time"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-white/40 font-bold">
                    <CheckCircle2 className="text-gold/50" size={16} />
                    {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => window.open(VERTUS_WHATSAPP_LINK + "?text=Olá!%20Gostaria%20de%20uma%20proposta%20para%20o%20Vertus%20Finance.", "_blank")}
                className="mt-auto w-full py-6 bg-gradient-to-br from-gold to-gold-dark text-vertus-black font-black text-sm uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-gold/20"
              >
                Solicitar Proposta →
              </button>
            </div>

            {/* CONTROLE 45 DIAS */}
            <div className="bg-vertus-gray border border-white/10 rounded-[48px] p-12 flex flex-col space-y-8 hover:border-white/20 transition-all">
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Controle 45 Dias</h3>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.25em]">Auditoria e Organização Acelerada</p>
              </div>
              <p className="text-white/60 text-sm leading-relaxed font-medium">
                Produto voltado para organização financeira intensiva, com auditoria completa do setor e estruturação dos números para clareza e previsibilidade em 45 dias. Flexibilidade para suporte com ou sem sistema.
              </p>
              <ul className="space-y-3 pt-4">
                {["Auditoria Setorial Completa", "Organização de Números", "Clareza e Previsibilidade", "Suporte de IA Integrado"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-white/40 font-bold">
                    <CheckCircle2 className="text-gold/50" size={16} />
                    {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => window.open(VERTUS_WHATSAPP_LINK + "?text=Olá!%20Gostaria%20de%20uma%20proposta%20para%20o%20Controle%2045%20Dias.", "_blank")}
                className="mt-auto w-full py-6 bg-gradient-to-br from-gold to-gold-dark text-vertus-black font-black text-sm uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-gold/20"
              >
                Solicitar Proposta →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-48 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gold opacity-[0.02] blur-[150px] rounded-full" />
        </div>
        
        <div className="max-w-4xl mx-auto space-y-16 relative z-10">
          <div className="space-y-6">
            <h2 className="text-6xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[1.1]">
              Sua empresa não precisa de mais faturamento. <br />
              <span className="text-gold">Ela precisa de mais Gestão.</span>
            </h2>
            <p className="text-white/40 text-xl font-medium max-w-2xl mx-auto">
              Agende uma conversa estratégica com um de nossos especialistas e descubra como a VERTUS pode transformar seu financeiro em uma máquina de lucro.
            </p>
          </div>
          
          <button 
            onClick={() => window.open(VERTUS_WHATSAPP_LINK + "?text=Olá!%20Gostaria%20de%20agendar%20uma%20conversa%20estratégica.", "_blank")}
            className="group relative px-20 py-10 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black font-black text-2xl tracking-widest uppercase rounded-[40px] hover:scale-[1.05] transition-all shadow-[0_30px_60px_rgba(212,175,119,0.4)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full h-full -skew-x-12 animate-shine pointer-events-none" />
            Agendar Agora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-20 py-20 bg-black/40">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-16">
            <div className="col-span-2 space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black italic text-gold tracking-tighter">VERTUS</span>
                <span className="text-sm font-black uppercase tracking-widest text-white/80">Raio-X Financeiro</span>
              </div>
              <p className="text-white/40 text-sm font-medium leading-relaxed max-w-sm">
                A VERTUS ajuda empresas a saírem do caos financeiro e tomarem decisões seguras todos os dias através de inteligência de dados e processos de elite.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Soluções</h4>
              <ul className="space-y-4 text-xs font-bold text-white/40 uppercase tracking-widest">
                <li><a href="#" className="hover:text-gold transition-colors">BPO Vertus</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Vertus Finance</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Controle 45 Dias</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Legal</h4>
              <ul className="space-y-4 text-xs font-bold text-white/40 uppercase tracking-widest">
                <li><a href="#" className="hover:text-gold transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-20 mt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
              © 2026 VERTUS Consultoria Financeira. Todos os direitos reservados.
            </p>
            <div className="flex gap-8">
              <div 
                onClick={() => window.open(VERTUS_WHATSAPP_LINK, "_blank")}
                className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 text-white/20 hover:text-gold hover:border-gold/30 transition-all cursor-pointer"
              >
                <MessageSquare size={18} />
              </div>
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 text-white/20 hover:text-gold hover:border-gold/30 transition-all cursor-pointer">
                <ShieldCheck size={18} />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}

export const AboutVix = AboutVertus;
