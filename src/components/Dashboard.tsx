import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { DiagnosisResponse, Lead } from "../types";
import { GoogleGenAI } from "@google/genai";
import { Download, Share2, Calendar, CheckCircle2, AlertCircle, TrendingUp, ArrowRight, Sparkles, FileText, ShieldCheck, BarChart3, PieChart } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { cn } from "../lib/utils";

interface DashboardProps {
  diagnosis: DiagnosisResponse;
  lead: Lead;
  onNext: () => void;
  isTrainingComplete?: boolean;
}

const DIMENSION_NAMES: Record<keyof DiagnosisResponse["dimensions"], string> = {
  fluxoCaixa: "Fluxo de Caixa",
  precificacao: "Precificação e Margem",
  controle: "Controle e Conciliação",
  previsibilidade: "Previsibilidade e Planejamento",
  custosRentabilidade: "Custos e Rentabilidade",
  processos: "Processos e Tomada de Decisão",
};

import { pdfService } from "../services/pdfService";
import AboutVertus from "./AboutVertus";
import StrategicPlanModal from "./StrategicPlanModal";
import { AnimatePresence } from "motion/react";

export default function Dashboard({ diagnosis, lead, onNext, isTrainingComplete }: DashboardProps) {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showStrategicModal, setShowStrategicModal] = useState(false);

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

  const radarData = Object.entries(diagnosis.dimensions).map(([key, value]) => ({
    subject: DIMENSION_NAMES[key as keyof typeof DIMENSION_NAMES],
    A: value,
    fullMark: 100,
  }));

  const getClassificationColor = () => {
    if (diagnosis.classification === "Saudável") return "text-green-500";
    if (diagnosis.classification === "Atenção") return "text-yellow-500";
    return "text-red-500";
  };

  const getClassificationBg = () => {
    if (diagnosis.classification === "Saudável") return "bg-green-500/10 border-green-500/20";
    if (diagnosis.classification === "Atenção") return "bg-yellow-500/10 border-yellow-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  const getClassificationText = () => {
    if (diagnosis.classification === "Saudável") return "Zona Saudável (Bom, mas ainda pode dominar)";
    if (diagnosis.classification === "Atenção") return "Zona de Atenção (Desorganizado)";
    return "Zona Crítica (Caos Financeiro)";
  };

  const criticalPoints = Object.entries(diagnosis.dimensions)
    .filter(([_, value]) => value < 50)
    .sort(([_, a], [__, b]) => a - b)
    .slice(0, 3);

  const benchmarkPercent = Math.max(5, Math.min(95, Math.round(diagnosis.score * 0.8 + Math.random() * 10)));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6" ref={dashboardRef} id="vertus-dashboard-content">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-[9px] font-black tracking-[0.15em] uppercase mb-1">
            <ShieldCheck size={12} />
            Diagnóstico Estratégico VERTUS
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white uppercase tracking-tight leading-snug break-words">
            {lead.companyName}
          </h2>
          <p className="text-white/40 text-xs font-medium tracking-wide">
            Responsável: {lead.responsibleName} • {lead.location}
          </p>
        </div>
      </div>

      {/* Main Score Grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 bg-vertus-gray border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-gold to-transparent opacity-30" />
          
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 224 224">
              <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-white/5" />
              <motion.circle
                initial={{ strokeDashoffset: 628 }}
                animate={{ strokeDashoffset: 628 - (628 * diagnosis.score) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="112"
                cy="112"
                r="100"
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                strokeDasharray="628"
                className="text-gold"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl sm:text-5xl font-black text-white">{diagnosis.score}</span>
              <span className="text-[8px] font-black tracking-[0.25em] uppercase text-white/40">Índice VERTUS</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-[8px] font-black tracking-widest uppercase text-white/40">Maturidade Financeira</h3>
            <div className={cn("px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-wider shadow-lg", getClassificationBg(), getClassificationColor())}>
              {getClassificationText()}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 w-full">
            <p className="text-white/40 text-xs font-medium leading-relaxed">
              Sua empresa está melhor que <span className="text-white font-bold">{diagnosis.benchmark}%</span> do mercado.
            </p>
          </div>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-vertus-gray border border-white/10 rounded-2xl p-4 sm:p-6 relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-gold to-transparent opacity-30" />
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">Radar de Maturidade</h3>
            <div className="flex items-center gap-1.5 text-[8px] font-black text-white/40 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 bg-gold rounded-full" />
              Sua Empresa
            </div>
          </div>
          
          <div className="h-[240px] sm:h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 8.5, fontWeight: 700 }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Sua Empresa"
                  dataKey="A"
                  stroke="#D4AF77"
                  fill="#D4AF77"
                  fillOpacity={0.3}
                  animationDuration={1500}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Hemorrhage & AI Analysis */}
      <div className="grid md:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-vertus-gray border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/20 shrink-0">
              <AlertCircle className="text-red-500" size={16} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">Hemorragia Mensal Estimada</h3>
          </div>
          <div className="space-y-1">
            <p className="text-xl sm:text-3xl font-bold text-red-500 break-words">
              R$ {diagnosis.monthlyLoss?.toLocaleString("pt-BR")},00
            </p>
            <p className="text-white/40 text-xs leading-relaxed">
              Este é o valor aproximado que sua empresa deixa de lucrar todos os meses devido às ineficiências detectadas no diagnóstico.
            </p>
          </div>
          <div className="pt-3 border-t border-red-500/10">
            <div className="text-[9px] font-black uppercase tracking-widest text-red-500/70 flex items-center gap-1.5">
              <TrendingUp size={12} />
              Impacto Anual: R$ {(diagnosis.monthlyLoss! * 12).toLocaleString("pt-BR")},00
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-vertus-gray border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col min-h-[220px] sm:h-[260px] shadow-xl"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center border border-gold/20 shrink-0">
              <Sparkles className="text-gold" size={16} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">Análise Estratégica VERTUS</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-3 space-y-3 custom-scrollbar">
            <p className="text-white/70 text-xs leading-relaxed italic">
              "Seu diagnóstico revela uma empresa com potencial, mas operando sob alto risco de caixa. A falta de processos claros em {criticalPoints[0]?.[0] ? DIMENSION_NAMES[criticalPoints[0][0] as keyof typeof DIMENSION_NAMES] : "suas finanças"} está drenando sua margem líquida."
            </p>
            <p className="text-white/40 text-[11px] leading-relaxed">
              A VERTUS recomenda uma intervenção imediata nos processos de conciliação e fluxo de caixa para estancar a perda de capital.
            </p>
            <p className="text-white/40 text-[11px] leading-relaxed">
              Com base nos dados coletados, sua empresa apresenta um gap crítico de execução que pode ser corrigido com a metodologia VERTUS de clareza e previsibilidade.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Next Step Button */}
      <div className="flex flex-col items-center gap-3 pt-4">
        <button
          onClick={() => {
            console.log("Opening Strategic Plan Modal...");
            setShowStrategicModal(true);
          }}
          className="group relative px-8 sm:px-10 py-3.5 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3 shadow-xl shadow-gold/20 overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full -skew-x-12 animate-shine pointer-events-none" />
          <span className="relative z-10">
            VER MEU PLANO DE AÇÃO
          </span>
          <ArrowRight className="relative z-10 group-hover:translate-x-1.5 transition-transform" size={16} />
        </button>
        <p className="text-white/30 text-[9px] font-black uppercase tracking-widest">Plano estratégico personalizado para estancar a hemorragia financeira</p>
      </div>

      <StrategicPlanModal 
        isOpen={showStrategicModal}
        onClose={() => {
          setShowStrategicModal(false);
        }}
        lead={lead}
        diagnosis={diagnosis}
      />
    </div>
  );
}
