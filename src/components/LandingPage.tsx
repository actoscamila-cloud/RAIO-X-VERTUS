import React from "react";
import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, TrendingUp, BarChart3, PieChart, Lock } from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
  onContinue?: () => void;
}

export default function LandingPage({ onStart, onContinue }: LandingPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 lg:pt-14 pb-16 sm:pb-24 lg:pb-32 min-w-0">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-w-0">
        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-7 space-y-5 sm:space-y-7 min-w-0"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black tracking-[0.15em] uppercase shrink-0">
            <ShieldCheck size={14} className="shrink-0" />
            <span>Diagnóstico Estratégico VERTUS</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-black tracking-tight leading-[1.2] text-white uppercase break-words">
            Descubra o verdadeiro estado do seu <span className="text-transparent bg-clip-text bg-gradient-to-br from-gold via-gold-light to-gold-dark">financeiro</span> em menos de 5 minutos
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base text-white/50 leading-relaxed max-w-xl font-medium">
            Análise estratégica + plano de otimização + recomendações automáticas personalizadas. A VERTUS transforma caos financeiro em clareza e previsibilidade para decisões seguras todos os dias.
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={onStart}
              className="group relative px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-br from-gold-light via-gold to-gold-dark rounded-xl text-vertus-black font-black text-sm sm:text-base tracking-tight uppercase shadow-xl shadow-gold/20 hover:shadow-gold/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 overflow-hidden shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full -skew-x-12 animate-shine pointer-events-none" />
              <span className="relative z-10 whitespace-nowrap">INICIAR MEU RAIO-X</span>
              <ArrowRight className="relative z-10 group-hover:translate-x-1.5 transition-transform shrink-0" size={18} />
            </button>

            {onContinue && (
              <button
                onClick={onContinue}
                className="group px-5 py-3 sm:py-3.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-wider hover:bg-gold/10 hover:border-gold/30 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <span className="whitespace-nowrap">Continuar de onde parei</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            )}
            
            <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-1 sm:pt-0 shrink-0">
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 shrink-0">
                <Lock size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/60 whitespace-nowrap">Acesso Seguro</span>
                <span className="text-[9px] font-medium text-white/30 uppercase tracking-widest whitespace-nowrap">Dados Criptografados</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Visual Elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative hidden lg:block lg:col-span-5 min-w-0"
        >
          {/* Main Card Mockup */}
          <div className="relative z-10 w-full bg-vertus-gray border border-white/10 rounded-2xl lg:rounded-3xl p-6 shadow-2xl overflow-hidden min-w-0">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-white/10 to-gold opacity-30" />
            
            <div className="flex justify-between items-center mb-6 min-w-0">
              <div className="space-y-1.5">
                <div className="h-3 w-28 bg-white/10 rounded-full" />
                <div className="h-6 w-36 bg-white/20 rounded-full" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center border border-gold/30 shadow-lg shadow-gold/10 shrink-0">
                <TrendingUp className="text-gold" size={22} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-stretch min-w-0">
              <div className="space-y-3 flex flex-col justify-between min-w-0">
                <div className="bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col justify-between gap-2.5 min-w-0 group hover:bg-white/10 transition-colors">
                  <BarChart3 className="text-white/40 shrink-0" size={18} />
                  <div className="space-y-1.5 min-w-0">
                    <div className="h-1.5 w-10 bg-white/10 rounded-full" />
                    <div className="h-3.5 w-20 bg-gold rounded-full" />
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col justify-between gap-2.5 min-w-0 group hover:bg-white/10 transition-colors">
                  <PieChart className="text-white/40 shrink-0" size={18} />
                  <div className="space-y-1.5 min-w-0">
                    <div className="h-1.5 w-10 bg-white/10 rounded-full" />
                    <div className="h-3.5 w-20 bg-white/30 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl border border-white/5 p-4 sm:p-5 flex flex-col items-center justify-center gap-3 min-w-0 group hover:bg-white/10 transition-colors">
                <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="68" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                    <motion.circle 
                      initial={{ strokeDashoffset: 427 }}
                      animate={{ strokeDashoffset: 427 - (427 * 0.72) }}
                      transition={{ duration: 1.5, delay: 0.3 }}
                      cx="80" cy="80" r="68" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="427" className="text-gold" 
                    />
                  </svg>
                  <span className="absolute text-2xl font-black text-white">72%</span>
                </div>
                <span className="text-[10px] font-black tracking-[0.15em] uppercase text-white/40 text-center whitespace-nowrap">Índice VERTUS</span>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-gold to-gold-dark rounded-full opacity-10 blur-2xl"
          />
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-8 -left-8 w-48 h-48 bg-gold rounded-full opacity-5 blur-2xl"
          />
        </motion.div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 sm:mt-20 lg:mt-24 min-w-0">
        {[
          { title: "Diagnóstico 360°", desc: "Análise profunda de 6 pilares estratégicos do seu financeiro.", icon: BarChart3 },
          { title: "Score de Previsibilidade", desc: "Entenda o nível de segurança e maturidade do seu negócio.", icon: ShieldCheck },
          { title: "Plano de Ação com IA", desc: "Receba recomendações automáticas geradas por inteligência artificial.", icon: TrendingUp },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * i }}
            className="p-6 sm:p-8 bg-vertus-gray border border-white/10 rounded-2xl hover:border-gold/30 transition-all group relative overflow-hidden shadow-xl shadow-transparent hover:shadow-gold/5 min-w-0"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors shrink-0">
              <feature.icon className="text-white/40 group-hover:text-gold transition-colors w-6 h-6 shrink-0" />
            </div>
            <h3 className="text-base sm:text-xl font-black mb-2 text-white group-hover:text-gold transition-colors uppercase tracking-tight break-words">{feature.title}</h3>
            <p className="text-xs sm:text-sm text-white/40 leading-relaxed font-medium">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-12 sm:mt-20 pt-6 sm:pt-8 border-t border-white/5 flex flex-col items-center gap-2">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 text-center">VERTUS SISTEMAS ESTRATÉGICOS</p>
      </div>
    </div>
  );
}
