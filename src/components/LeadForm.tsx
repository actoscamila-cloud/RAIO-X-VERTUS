import React, { useState } from "react";
import { motion } from "motion/react";
import { REVENUE_OPTIONS, EMPLOYEE_OPTIONS } from "../constants";
import { Lead } from "../types";
import { ArrowRight, Building2, User, Phone, Briefcase, Users, ShieldCheck } from "lucide-react";

interface LeadFormProps {
  onSubmit: (lead: Lead) => void;
  userEmail?: string;
}

export default function LeadForm({ onSubmit, userEmail }: LeadFormProps) {
  const [formData, setFormData] = useState<Partial<Lead>>({
    companyName: "",
    responsibleName: "",
    whatsapp: "",
    email: userEmail || "",
    location: "Brasil",
    monthlyRevenue: "",
    employeeCount: "",
    segment: "Geral",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      email: formData.email || userEmail || "",
      createdAt: new Date().toISOString()
    } as Lead);
  };

  const inputClasses = "w-full bg-vertus-black border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/20 focus:border-gold/50 focus:ring-2 focus:ring-gold/10 outline-none transition-all font-medium shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]";
  const labelClasses = "block text-[9px] font-black tracking-[0.15em] uppercase text-gold/70 mb-1.5 flex items-center gap-1.5";

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-vertus-gray border border-white/10 rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden"
      >
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-[9px] font-black tracking-[0.15em] uppercase mb-1">
            <ShieldCheck size={12} />
            Diagnóstico VERTUS
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white uppercase">
            Identificação da <span className="text-gold">Empresa</span>
          </h2>
          <p className="text-white/50 font-medium text-xs">
            Preencha os dados básicos para iniciar o seu Raio-X.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClasses}><Building2 size={12} /> Empresa</label>
            <input 
              required 
              name="companyName" 
              value={formData.companyName} 
              onChange={handleChange} 
              className={inputClasses} 
              placeholder="Nome da empresa" 
            />
          </div>

          <div>
            <label className={labelClasses}><User size={12} /> Responsável</label>
            <input 
              required 
              name="responsibleName" 
              value={formData.responsibleName} 
              onChange={handleChange} 
              className={inputClasses} 
              placeholder="Seu nome completo" 
            />
          </div>

          <div>
            <label className={labelClasses}><Phone size={12} /> WhatsApp para entrega do diagnóstico</label>
            <input 
              required 
              name="whatsapp" 
              value={formData.whatsapp} 
              onChange={handleChange} 
              className={inputClasses} 
              placeholder="(00) 00000-0000" 
            />
          </div>

          <div>
            <label className={labelClasses}><Briefcase size={12} /> Faturamento Mensal</label>
            <select 
              required 
              name="monthlyRevenue" 
              value={formData.monthlyRevenue} 
              onChange={handleChange} 
              className={inputClasses}
            >
              <option value="" disabled className="bg-vertus-gray">Selecione uma faixa</option>
              {REVENUE_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-vertus-gray">{opt}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClasses}><Users size={12} /> Número de Funcionários</label>
            <select 
              required 
              name="employeeCount" 
              value={formData.employeeCount} 
              onChange={handleChange} 
              className={inputClasses}
            >
              <option value="" disabled className="bg-vertus-gray">Selecione uma faixa</option>
              {EMPLOYEE_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-vertus-gray">{opt}</option>)}
            </select>
          </div>

          <button
            type="submit"
            className="group relative w-full py-3.5 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl shadow-xl shadow-gold/20 hover:shadow-gold/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 mt-6 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full -skew-x-12 animate-shine pointer-events-none" />
            <span className="relative z-10">INICIAR PERGUNTAS DO RAIO-X</span>
            <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
