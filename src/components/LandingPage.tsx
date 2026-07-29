import React from "react";
import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, TrendingUp, BarChart3, PieChart, Lock } from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
  onContinue?: () => void;
}

export default function LandingPage({ onStart, onContinue }: LandingPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-16 lg:pt-24 pb-16 sm:pb-24 lg:pb-32">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-24 items-center">
        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 sm:space-y-8"
        >
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black tracking-[0.2em] uppercase mb-1 sm:mb-2">
            <ShieldCheck size={14} />
            Diagnóstico Estratégico VERTUS
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.15] sm:leading-[1.1] text-white uppercase max-w-4xl break-words">
            Descubra o verdadeiro estado do seu <span className="text-transparent bg-clip-text bg-gradient-to-br from-gold via-gold-light to-gold-dark">financeiro</span> em menos de 5 minutos
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-white/40 leading-relaxed max-w-2xl font-medium">
            Análise estratégica + plano de otimização + recomendações automáticas personalizadas. A VERTUS transforma caos financeiro em clareza e previsibilidade para decisões seguras todos os dias.
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-8 pt-4 sm:pt-6">
            <button
              onClick={onStart}
              className="group relative w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 bg-gradient-to-br from-gold-light via-gold to-gold-dark rounded-2xl text-vertus-black font-black text-base sm:text-xl tracking-tight uppercase shadow-2xl shadow-gold/20 hover:shadow-gold/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 sm:gap-4 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full -skew-x-12 animate-shine pointer-events-none" />
              <span className="relative z-10">INICIAR MEU RAIO-X</span>
              <ArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform shrink-0" size={20} />
            </button>

            {onContinue && (
              <button
                onClick={onContinue}
                className="group w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-xs sm:text-sm uppercase tracking-widest hover:bg-gold/10 hover:border-gold/30 transition-all flex items-center justify-center gap-3"
              >
                Continuar de onde parei
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-2 sm:pt-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 shrink-0">
                <Lock size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Acesso Seguro</span>
                <span className="text-[10px] font-medium text-white/30 uppercase tracking-widest">Dados Criptografados</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Visual Elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          {/* Main Card Mockup */}
          <div className="relative z-10 w-full aspect-[4/3] bg-vertus-gray border border-white/10 rounded-[48px] p-12 shadow-3xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-white/10 to-gold opacity-30" />
            
            <div className="flex justify-between items-start mb-16">
              <div className="space-y-3">
                <div className="h-5 w-40 bg-white/10 rounded-full" />
                <div className="h-10 w-64 bg-white/20 rounded-full" />
              </div>
              <div className="w-20 h-20 rounded-3xl bg-gold/20 flex items-center justify-center border border-gold/30 shadow-xl shadow-gold/10">
                <TrendingUp className="text-gold" size={40} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="h-36 w-full bg-white/5 rounded-3xl border border-white/5 p-8 flex flex-col justify-between group hover:bg-white/10 transition-colors">
                  <BarChart3 className="text-white/40" size={24} />
                  <div className="space-y-3">
                    <div className="h-2.5 w-16 bg-white/10 rounded-full" />
                    <div className="h-5 w-28 bg-gold rounded-full" />
                  </div>
                </div>
                <div className="h-36 w-full bg-white/5 rounded-3xl border border-white/5 p-8 flex flex-col justify-between group hover:bg-white/10 transition-colors">
                  <PieChart className="text-white/40" size={24} />
                  <div className="space-y-3">
                    <div className="h-2.5 w-16 bg-white/10 rounded-full" />
                    <div className="h-5 w-28 bg-white/30 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="h-full w-full bg-white/5 rounded-3xl border border-white/5 p-10 flex flex-col items-center justify-center gap-8 group hover:bg-white/10 transition-colors">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                    <motion.circle 
                      initial={{ strokeDashoffset: 465 }}
                      animate={{ strokeDashoffset: 465 - (465 * 0.72) }}
                      transition={{ duration: 2, delay: 0.5 }}
                      cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="465" className="text-gold" 
                    />
                  </svg>
                  <span className="absolute text-4xl font-black text-white">72%</span>
                </div>
                <span className="text-xs font-black tracking-[0.2em] uppercase text-white/40">Índice VERTUS</span>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-gold to-gold-dark rounded-full opacity-10 blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 30, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-16 -left-16 w-72 h-72 bg-gold rounded-full opacity-5 blur-3xl"
          />
        </motion.div>
      </div>

      {/* Trust Badges */}
      <div className="grid md:grid-cols-3 gap-6 sm:gap-10 lg:gap-16 mt-16 sm:mt-28 lg:mt-40">
        {[
          { title: "Diagnóstico 360°", desc: "Análise profunda de 6 pilares estratégicos do seu financeiro.", icon: BarChart3 },
          { title: "Score de Previsibilidade", desc: "Entenda o nível de segurança e maturidade do seu negócio.", icon: ShieldCheck },
          { title: "Plano de Ação com IA", desc: "Receba recomendações automáticas geradas por inteligência artificial.", icon: TrendingUp },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + (i * 0.1) }}
            className="p-6 sm:p-8 lg:p-12 bg-vertus-gray border border-white/10 rounded-2xl sm:rounded-3xl lg:rounded-[40px] hover:border-gold/30 transition-all group relative overflow-hidden shadow-2xl shadow-transparent hover:shadow-gold/5"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/5 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:bg-gold/20 transition-colors shrink-0">
              <feature.icon className="text-white/40 group-hover:text-gold transition-colors w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-lg sm:text-2xl font-black mb-2 sm:mb-4 text-white group-hover:text-gold transition-colors uppercase tracking-tight">{feature.title}</h3>
            <p className="text-xs sm:text-sm text-white/40 leading-relaxed font-medium">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-16 sm:mt-32 pt-8 sm:pt-12 border-t border-white/5 flex flex-col items-center gap-4">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/5 text-center">VERTUS SISTEMAS ESTRATÉGICOS</p>
      </div>
    </div>
  );
}
