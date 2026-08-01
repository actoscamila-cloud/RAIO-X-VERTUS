import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, LogOut, ShieldCheck } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  progress?: number;
  onBack?: () => void;
  onLogout?: () => void;
  hideHeader?: boolean;
  hideFooter?: boolean;
  isAdmin?: boolean;
  onAdminClick?: () => void;
  onBpoClick?: () => void;
  onVertusFinanceClick?: () => void;
}

export default function Layout({ 
  children, 
  progress, 
  onBack, 
  onLogout, 
  hideHeader, 
  hideFooter, 
  isAdmin, 
  onAdminClick,
  onBpoClick,
  onVertusFinanceClick
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-vertus-black text-white font-sans selection:bg-gold selection:text-vertus-black overflow-x-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold opacity-[0.03] blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold opacity-[0.03] blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
      </div>

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="fixed top-0 left-0 w-full h-1.5 bg-white/5 z-50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-gold via-gold-light to-gold"
          />
        </div>
      )}

      {/* Header */}
      {!hideHeader && (
        <header className="sticky top-0 z-30 border-b border-white/5 backdrop-blur-xl bg-vertus-black/90 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5 opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex justify-between items-center relative z-10 min-w-0">
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            {onBack && (
              <button 
                onClick={onBack}
                className="p-2 sm:p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-gold hover:border-gold/30 transition-all group shrink-0"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              </button>
            )}
            <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
              <span className="text-xl sm:text-3xl font-black italic text-gold tracking-tighter leading-none shrink-0">VERTUS</span>
              <div className="flex flex-col justify-center shrink-0">
                <div className="text-xs sm:text-lg font-black tracking-tighter uppercase leading-tight text-white whitespace-nowrap">
                  Raio-X <span className="text-gold">Financeiro</span>
                </div>
                <p className="text-[8px] sm:text-[9px] font-black text-gold/50 uppercase tracking-[0.2em] mt-0.5 whitespace-nowrap">
                  Performance Empresarial
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <nav className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/50 shrink-0">
              <button 
                onClick={onBpoClick} 
                className="hover:text-gold transition-all font-black bg-transparent border-none cursor-pointer uppercase py-1 whitespace-nowrap"
              >
                COMO TRABALHAMOS
              </button>
              <button 
                onClick={onVertusFinanceClick} 
                className="hover:text-gold transition-all font-black bg-transparent border-none cursor-pointer uppercase py-1 whitespace-nowrap"
              >
                CONHEÇA A VERTUS
              </button>
              <div className="h-4 w-px bg-white/10 shrink-0" />
              <span className="text-gold flex items-center gap-2 whitespace-nowrap">
                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse shrink-0" />
                Diagnóstico VERTUS
              </span>
            </nav>

            <div className="flex items-center gap-2 relative z-10 shrink-0">
              {isAdmin && onAdminClick && (
                <button 
                  onClick={onAdminClick}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-gold/10 border border-gold/25 rounded-xl text-gold hover:bg-gold/20 transition-all group text-[9px] sm:text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
                >
                  <ShieldCheck size={14} className="group-hover:scale-110 transition-transform shrink-0" />
                  <span className="hidden sm:inline">Painel Admin</span>
                </button>
              )}
              {onLogout && (
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-red-500 hover:border-red-500/30 transition-all group text-[9px] sm:text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
                >
                  <LogOut size={14} className="group-hover:scale-110 transition-transform shrink-0" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      )}

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      {!hideFooter && (
        <footer className="relative z-10 border-t border-white/5 mt-12 sm:mt-20 py-10 sm:py-16 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-3 gap-8 sm:gap-12 items-center text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-white font-black text-lg italic">VERTUS</span>
                </div>
                <span className="text-xs sm:text-sm font-black tracking-tight uppercase">
                  Raio-X Financeiro
                </span>
              </div>
              <div className="text-center space-y-2">
                <p className="text-white/40 text-xs font-medium max-w-sm mx-auto">
                  A VERTUS ajuda empresas a saírem do caos financeiro e tomarem decisões seguras todos os dias.
                </p>
                <p className="text-white/20 text-[10px]">
                  © 2026 Vertus Performance. Todos os direitos reservados.
                </p>
              </div>
              <div className="flex justify-center md:justify-end gap-6 text-[10px] font-black uppercase tracking-widest text-white/40">
                <a href="#" className="hover:text-white transition-colors">Privacidade</a>
                <span className="text-white/10">•</span>
                <a href="#" className="hover:text-white transition-colors">Termos</a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
