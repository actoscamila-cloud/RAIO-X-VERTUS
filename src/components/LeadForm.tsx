import React, { useState } from "react";
import { motion } from "motion/react";
import { REVENUE_OPTIONS, EMPLOYEE_OPTIONS, SEGMENTS } from "../constants";
import { Lead } from "../types";
import { ArrowRight, Building2, User, Phone, Mail, MapPin, Briefcase, Users, Target, ShieldCheck } from "lucide-react";
import { cn } from "../lib/utils";

interface LeadFormProps {
  onSubmit: (lead: Lead) => void;
}

export default function LeadForm({ onSubmit }: LeadFormProps) {
  const [formData, setFormData] = useState<Partial<Lead>>({
    companyName: "",
    responsibleName: "",
    whatsapp: "",
    email: "",
    location: "",
    monthlyRevenue: "",
    employeeCount: "",
    segment: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, createdAt: new Date().toISOString() } as Lead);
  };

  const inputClasses = "w-full bg-vertus-black border border-white/10 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-white/20 focus:border-gold/50 focus:ring-4 focus:ring-gold/5 outline-none transition-all font-medium shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:shadow-[0_0_20px_rgba(212,175,119,0.1)]";
  const labelClasses = "block text-[10px] font-black tracking-[0.2em] uppercase text-gold/60 mb-3 flex items-center gap-2";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-vertus-gray border border-white/10 rounded-2xl sm:rounded-3xl lg:rounded-[40px] p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black tracking-[0.2em] uppercase mb-2">
            <ShieldCheck size={14} />
            Diagnóstico VERTUS
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white uppercase">
            Identificação da <span className="text-gold">Empresa</span>
          </h2>
          <p className="text-white/40 font-medium text-sm">
            Dados básicos para personalizar seu diagnóstico estratégico.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className={labelClasses}><Building2 size={12} /> Empresa</label>
                <input required name="companyName" value={formData.companyName} onChange={handleChange} className={inputClasses} placeholder="Nome da empresa" />
              </div>
              <div>
                <label className={labelClasses}><User size={12} /> Responsável</label>
                <input required name="responsibleName" value={formData.responsibleName} onChange={handleChange} className={inputClasses} placeholder="Seu nome" />
              </div>
              <div>
                <label className={labelClasses}><Phone size={12} /> WhatsApp</label>
                <input required name="whatsapp" value={formData.whatsapp} onChange={handleChange} className={inputClasses} placeholder="(00) 00000-0000" />
              </div>
              <div>
                <label className={labelClasses}><Mail size={12} /> Email</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputClasses} placeholder="seu@email.com" />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className={labelClasses}><MapPin size={12} /> Cidade / Estado</label>
                <input required name="location" value={formData.location} onChange={handleChange} className={inputClasses} placeholder="Ex: São Paulo / SP" />
              </div>
              <div>
                <label className={labelClasses}><Briefcase size={12} /> Faturamento Mensal</label>
                <select required name="monthlyRevenue" value={formData.monthlyRevenue} onChange={handleChange} className={inputClasses}>
                  <option value="" disabled className="bg-vertus-gray">Selecione</option>
                  {REVENUE_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-vertus-gray">{opt}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClasses}><Users size={12} /> Funcionários</label>
                <select required name="employeeCount" value={formData.employeeCount} onChange={handleChange} className={inputClasses}>
                  <option value="" disabled className="bg-vertus-gray">Selecione</option>
                  {EMPLOYEE_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-vertus-gray">{opt}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClasses}><Target size={12} /> Segmento</label>
                <select required name="segment" value={formData.segment} onChange={handleChange} className={inputClasses}>
                  <option value="" disabled className="bg-vertus-gray">Selecione</option>
                  {SEGMENTS.map(opt => <option key={opt} value={opt} className="bg-vertus-gray">{opt}</option>)}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full py-6 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-vertus-black font-black text-sm tracking-widest uppercase rounded-2xl shadow-2xl shadow-gold/20 hover:shadow-gold/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-4 mt-8 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full -skew-x-12 animate-shine pointer-events-none" />
            <span className="relative z-10">INICIAR MEU RAIO-X FINANCEIRO</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
