import React from 'react';
import { VertusConfig } from '../types';
import { Building2, MessageSquare, Settings, FileCode, Award, BarChart3, RotateCcw } from 'lucide-react';

interface HeaderProps {
  config: VertusConfig;
  onOpenSettings: () => void;
  onOpenImporter: () => void;
  activeTab: 'form' | 'pillars' | 'report';
  setActiveTab: (tab: 'form' | 'pillars' | 'report') => void;
  onReset: () => void;
  overallScore?: number;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onOpenSettings,
  onOpenImporter,
  activeTab,
  setActiveTab,
  onReset,
  overallScore,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Company Name */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl shadow-inner text-white"
              style={{ backgroundColor: config.primaryColor || '#0f766e' }}
            >
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">
                  {config.companyName || 'Vertus Consultoria'}
                </span>
                <span className="bg-teal-500/20 text-teal-300 text-xs px-2 py-0.5 rounded-full border border-teal-500/30 font-medium">
                  Diagnóstico
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Avaliação de Saúde e Performance Financeira Empresarial
              </p>
            </div>
          </div>

          {/* Center Navigation Steps */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'form'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              1. Empresa & Métricas
            </button>
            <button
              onClick={() => setActiveTab('pillars')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'pillars'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              2. Questionário de Pilares
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'report'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              3. Relatório & Score Vertus
              {overallScore !== undefined && (
                <span className="ml-1 bg-slate-900/60 px-1.5 py-0.5 rounded text-[10px] font-semibold text-teal-300">
                  {overallScore}%
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenImporter}
              title="Importar Código ou Dados Anteriores"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
            >
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span className="hidden lg:inline">Subir Código / JSON</span>
            </button>

            <button
              onClick={onOpenSettings}
              title="Configurações da Vertus e WhatsApp"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-300" />
              <span className="hidden sm:inline">Personalizar Vertus</span>
            </button>

            <button
              onClick={onReset}
              title="Novo Diagnóstico"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
