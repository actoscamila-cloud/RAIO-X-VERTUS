import React, { useState, useEffect } from "react";
import { storage } from "../lib/storage";
import { Lead, DiagnosisResponse } from "../types";
import { ADMIN_EMAILS } from "../constants";
import { Users, FileText, Trash2, Download, Search, Filter, ArrowRight, ShieldCheck, BarChart3, AlertCircle, MessageSquare, X, ExternalLink, TrendingDown, Lock, LogOut, Mail, MapPin, DollarSign, Briefcase, Target, LayoutGrid, Sparkles } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface AdminPanelProps {
  onLogout: () => void;
}

const DIMENSION_NAMES: Record<string, string> = {
  fluxoCaixa: "Fluxo de Caixa",
  precificacao: "Precificação e Margem",
  controle: "Controle e Conciliação",
  previsibilidade: "Previsibilidade e Planejamento",
  custosRentabilidade: "Custos e Rentabilidade",
  processos: "Processos e Tomada de Decisão",
};

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [diagnoses, setDiagnoses] = useState<DiagnosisResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [aiScript, setAiScript] = useState<string>("");
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [view, setView] = useState<"leads" | "intelligence" | "users">("leads");
  const [cloudUsers, setCloudUsers] = useState<any[]>([]);
  const [settings, setSettings] = useState({
    aiPrompt: "",
    financialContent: "",
    strategicGuidelines: ""
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingRole, setIsUpdatingRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("AdminPanel: Fetching data...");
      setIsLoading(true);
      try {
        const [leadsData, diagnosesData, settingsData, cloudUsersData] = await Promise.all([
          storage.getLeads(),
          storage.getDiagnoses(),
          storage.getSettings(),
          storage.getCloudUsers()
        ]);
        console.log("AdminPanel: Data fetched:", { leads: leadsData.length, diagnoses: diagnosesData.length, users: cloudUsersData.length });
        setLeads(leadsData);
        setDiagnoses(diagnosesData);
        setSettings(settingsData);
        setCloudUsers(cloudUsersData);
      } catch (error) {
        console.error("Error loading admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    await storage.saveSettings(settings);
    setTimeout(() => setIsSavingSettings(false), 1000);
  };

  const handleToggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    setIsUpdatingRole(userId);
    try {
      await storage.updateUserRole(userId, newRole);
      setCloudUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Error updating user role in AdminPanel:", error);
    } finally {
      setIsUpdatingRole(null);
    }
  };

  const handleDeleteLead = (id: string) => {
    setLeadToDelete(id);
  };

  const confirmDelete = async () => {
    if (leadToDelete) {
      await storage.deleteLead(leadToDelete);
      setLeads(await storage.getLeads());
      setDiagnoses(await storage.getDiagnoses());
      setLeadToDelete(null);
    }
  };

  const handleUpdateLeadAccess = async (leadId: string, updates: Partial<Lead>) => {
    try {
      await storage.updateLead(leadId, updates);
      const [leadsData, diagnosesData] = await Promise.all([
        storage.getLeads(),
        storage.getDiagnoses()
      ]);
      setLeads(leadsData);
      setDiagnoses(diagnosesData);
      
      const updated = leadsData.find(l => l.id === leadId);
      if (updated) setSelectedLead(updated);
    } catch (error) {
      console.error("Error updating lead access:", error);
    }
  };

  const getAccessStatusBadge = (leadItem: Lead) => {
    const status = leadItem.accessStatus || "active";
    if (status === "suspended") {
      return <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-[9px] font-black uppercase tracking-wider">Suspenso</span>;
    }
    
    let isExpired = false;
    let expiryDateStr = "";
    
    if (leadItem.accessExpiresAt) {
      const expiryDate = new Date(leadItem.accessExpiresAt);
      if (!isNaN(expiryDate.getTime())) {
        isExpired = new Date() > expiryDate;
        expiryDateStr = expiryDate.toLocaleDateString("pt-BR");
      }
    } else if (leadItem.createdAt) {
      let createdTime = null;
      if (leadItem.createdAt.seconds) {
        createdTime = leadItem.createdAt.seconds * 1000;
      } else if (typeof leadItem.createdAt.toMillis === "function") {
        createdTime = leadItem.createdAt.toMillis();
      } else {
        createdTime = new Date(leadItem.createdAt).getTime();
      }
      
      if (createdTime && !isNaN(createdTime)) {
        const expiryDate = new Date(createdTime + 30 * 24 * 60 * 60 * 1000);
        isExpired = new Date() > expiryDate;
        expiryDateStr = expiryDate.toLocaleDateString("pt-BR");
      }
    }
    
    if (isExpired) {
      return (
        <div className="flex flex-col gap-0.5">
          <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg text-[9px] font-black uppercase tracking-wider w-fit">Expirado</span>
          {expiryDateStr && <span className="text-[8px] text-white/30 font-bold">{expiryDateStr}</span>}
        </div>
      );
    }
    
    return (
      <div className="flex flex-col gap-0.5">
        <span className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-[9px] font-black uppercase tracking-wider w-fit">Ativo</span>
        {expiryDateStr && <span className="text-[8px] text-white/40 font-bold">Até {expiryDateStr}</span>}
      </div>
    );
  };

  const filteredLeads = leads.filter(l => 
    l.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.responsibleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const worstDiagnoses = Array.isArray(diagnoses) 
    ? [...diagnoses].sort((a, b) => a.score - b.score).slice(0, 10)
    : [];

  const dimensionStats = Array.isArray(diagnoses) 
    ? diagnoses.reduce((acc, d) => {
        if (d.dimensions) {
          Object.entries(d.dimensions).forEach(([key, value]) => {
            if (!acc[key]) acc[key] = { total: 0, count: 0 };
            acc[key].total += value;
            acc[key].count += 1;
          });
        }
        return acc;
      }, {} as Record<string, { total: number, count: number }>)
    : {};

  const heatmap = Object.entries(dimensionStats)
    .map(([key, stat]) => ({
      name: DIMENSION_NAMES[key] || key,
      average: Math.round(stat.total / stat.count),
      failures: diagnoses.filter(d => d.dimensions && (d.dimensions as any)[key] < 50).length
    }))
    .sort((a, b) => a.average - b.average);

  const stats = {
    totalLeads: leads.length,
    totalUsers: cloudUsers.length,
    marketAverage: diagnoses.length > 0 ? Math.round(diagnoses.reduce((acc, d) => acc + d.score, 0) / diagnoses.length) : 0,
    operationalChaos: diagnoses.filter(d => d.classification === "Crítica").length,
    falseControl: diagnoses.filter(d => d.classification === "Atenção").length
  };

  const generateContactScript = async (lead: Lead, diagnosis: DiagnosisResponse) => {
    setAiScript("");
    setIsGeneratingScript(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const worstDimension = diagnosis.dimensions 
        ? Object.entries(diagnosis.dimensions).sort((a, b) => a[1] - b[1])[0]?.[0] || "Geral"
        : "Geral";

      const prompt = `TAREFA: Crie um script de abordagem comercial (WhatsApp e Ligação) para o lead ${lead.responsibleName} da empresa ${lead.companyName}.
        
        Dados do Lead:
        - Score: ${diagnosis.score}/100
        - Pior Dimensão: ${DIMENSION_NAMES[worstDimension] || worstDimension}
        - Hemorragia Mensal: R$ ${diagnosis.monthlyLoss.toLocaleString("pt-BR")}
        
        O script deve ser:
        1. Altamente personalizado e direto.
        2. Focar na "dor" da hemorragia financeira identificada no diagnóstico.
        3. Usar autoridade VERTUS para marcar uma reunião estratégica de 15 minutos.
        4. Tom consultivo e profissional.`;

      // Retry logic for 503 errors
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite-preview",
            contents: prompt,
            config: {
              systemInstruction: `
                ${settings.aiPrompt}
                
                DIRETRIZES ESTRATÉGICAS:
                ${settings.strategicGuidelines}
                
                CONTEÚDO BASE VERTUS:
                ${settings.financialContent}
              `
            }
          });

          setAiScript(response.text || "Erro ao gerar script.");
          return; // Success!
        } catch (err: any) {
          if (err.message?.includes("503") || err.message?.includes("high demand")) {
            attempts++;
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
              continue;
            }
          }
          throw err;
        }
      }
    } catch (error) {
      console.error("Erro na geração do script:", error);
      setAiScript("Erro ao gerar script devido à alta demanda nos servidores da IA. Por favor, tente novamente em alguns instantes.");
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const [modalTab, setModalTab] = useState<"overview" | "actionPlan">("overview");
  const [aiActionPlan, setAiActionPlan] = useState<string>("");
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const generateActionPlanForAdmin = async (lead: Lead, diagnosis: DiagnosisResponse) => {
    setAiActionPlan("");
    setIsGeneratingPlan(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `TAREFA: Gere um PLANO DE AÇÃO ESTRATÉGICO COMPLETO E DOSSIÊ DE REUNIÃO CONSULTIVA para os consultores da VERTUS utilizarem na reunião com a empresa ${lead.companyName}.
        
        Dados da Empresa:
        - Responsável: ${lead.responsibleName} (${lead.whatsapp}, ${lead.email})
        - Faturamento Mensal: ${lead.monthlyRevenue}
        - Funcionários: ${lead.employeeCount}
        - Score do Raio-X: ${diagnosis.score}/100 (${diagnosis.classification})
        - Hemorragia Financeira Estimada: R$ ${diagnosis.monthlyLoss.toLocaleString("pt-BR")}/mês
        - Dimensões Avaliadas: ${JSON.stringify(diagnosis.dimensions)}
        
        Gere um relatório estruturado em Markdown com as seguintes seções claras:

        ### 🎯 1. DIAGNÓSTICO TÉCNICO & GARGALO PRINCIPAL
        - Resumo do momento financeiro da empresa.
        - Identificação exata da maior vulnerabilidade (ex: precificação incorreta, falta de DFC, falta de conciliação diária).

        ### 🚀 2. PLANO DE AÇÃO ESTRATÉGICO (30, 60 e 90 DIAS)
        - **Primeiros 30 Dias (Estancamento de Hemorragia):** 3 ações práticas e imediatas.
        - **60 Dias (Estruturação e Governança):** 2 ações de processos e controles.
        - **90 Dias (Escala e Margem):** 2 ações para otimização de rentabilidade.

        ### 💼 3. DOSSIÊ DA REUNIÃO CONSULTIVA (PITCH VERTUS)
        - **Perguntas de Impacto para a Call:** 3 perguntas chave para o consultor fazer ao empresário durante a apresentação.
        - **Proposta de Solução Ideal:** Recomende qual solução VERTUS faz mais sentido (BPO Financeiro, Consultoria de Precificação, Governança).
        - **Como Quebrar Objeções:** Dicas para contornar objeções típicas deste perfil de faturamento.`;

      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite-preview",
            contents: prompt,
            config: {
              systemInstruction: `${settings.aiPrompt}\n\nDIRETRIZES VERTUS:\n${settings.strategicGuidelines}`
            }
          });

          setAiActionPlan(response.text || "Erro ao gerar Plano de Ação.");
          return;
        } catch (err: any) {
          if (err.message?.includes("503") || err.message?.includes("high demand")) {
            attempts++;
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
              continue;
            }
          }
          throw err;
        }
      }
    } catch (error) {
      console.error("Erro ao gerar plano de ação:", error);
      setAiActionPlan("Não foi possível gerar o plano de ação no momento. Tente novamente clicando no botão de atualizar.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const openLeadDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setModalTab("overview");
    const diagnosis = diagnoses.find(d => d.leadId === lead.id);
    if (diagnosis) {
      generateContactScript(lead, diagnosis);
      generateActionPlanForAdmin(lead, diagnosis);
    }
  };

  const exportCSV = () => {
    const headers = ["Empresa", "Responsável", "WhatsApp", "Email", "Localização", "Faturamento", "Score", "Classificação", "Perda Mensal"];
    const rows = leads.map(l => {
      const d = diagnoses.find(diag => diag.leadId === l.id);
      return [
        l.companyName,
        l.responsibleName,
        l.whatsapp,
        l.email,
        l.location,
        l.monthlyRevenue,
        d?.score || "N/A",
        d?.classification || "N/A",
        d?.monthlyLoss || "N/A"
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads_vertus.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-vertus-black text-white p-10 space-y-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl shadow-gold/20">
            <div className="w-8 h-8 border-2 border-vertus-black/40 rotate-45 rounded-sm" />
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">VERTUS</h1>
              <h1 className="text-3xl font-black tracking-tighter text-white uppercase">RAIO-X FINANCEIRO</h1>
            </div>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">Consultoria Estratégica</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex">
            <button 
              onClick={() => setView("leads")}
              className={cn(
                "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                view === "leads" ? "bg-gold text-vertus-black" : "text-white/40 hover:text-white"
              )}
            >
              Leads & Dados
            </button>
            <button 
              onClick={() => setView("users")}
              className={cn(
                "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                view === "users" ? "bg-gold text-vertus-black" : "text-white/40 hover:text-white"
              )}
            >
              Logins / Contas
            </button>
            <button 
              onClick={() => setView("intelligence")}
              className={cn(
                "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                view === "intelligence" ? "bg-gold text-vertus-black" : "text-white/40 hover:text-white"
              )}
            >
              Inteligência VERTUS
            </button>
          </div>

          <button 
            onClick={() => {
              localStorage.removeItem("vertus_training_complete");
              window.location.reload();
            }}
            className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-red-500"
          >
            <Lock size={14} />
            Resetar Treinamento
          </button>

          <button 
            onClick={exportCSV}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
          >
            <Download size={14} />
            Exportar CSV
          </button>

          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gold/10 border border-gold/20 rounded-xl hover:bg-gold/20 transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-gold"
          >
            <Sparkles size={14} />
            Atualizar Dados
          </button>

          <button 
            onClick={onLogout}
            className="px-6 py-3 text-white/40 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
          >
            <LogOut size={14} />
            Sair
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
          <p className="text-gold text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Sincronizando Dados VERTUS...</p>
        </div>
      ) : view === "intelligence" ? (
        <div className="space-y-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* AI Training Space */}
            <div className="lg:col-span-2 bg-vertus-gray/50 border border-white/5 rounded-[40px] p-10 space-y-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Treinamento da IA VERTUS</h3>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Personalize o comportamento estratégico</p>
                  </div>
                </div>
                <button 
                  onClick={handleSaveSettings}
                  disabled={isSavingSettings}
                  className={cn(
                    "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    isSavingSettings ? "bg-green-500 text-white" : "bg-gold text-vertus-black hover:scale-[1.02]"
                  )}
                >
                  {isSavingSettings ? "Salvo com Sucesso!" : "Salvar Configurações"}
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Prompt do Sistema (Personalidade)</label>
                  <textarea 
                    value={settings.aiPrompt}
                    onChange={(e) => setSettings({ ...settings, aiPrompt: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white/80 focus:border-gold outline-none transition-all min-h-[150px] resize-none"
                    placeholder="Defina como a IA deve se comportar..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Conteúdo Financeiro Base</label>
                    <textarea 
                      value={settings.financialContent}
                      onChange={(e) => setSettings({ ...settings, financialContent: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white/80 focus:border-gold outline-none transition-all min-h-[200px] resize-none"
                      placeholder="Conhecimento técnico da VERTUS..."
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Diretrizes Estratégicas</label>
                    <textarea 
                      value={settings.strategicGuidelines}
                      onChange={(e) => setSettings({ ...settings, strategicGuidelines: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white/80 focus:border-gold outline-none transition-all min-h-[200px] resize-none"
                      placeholder="Regras de negócio e tom de voz..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Heatmap */}
              <div className="bg-vertus-gray/50 border border-white/5 rounded-3xl p-8 space-y-8">
                <div className="flex items-center gap-3">
                  <TrendingDown className="text-gold" size={20} />
                  <h3 className="text-xl font-bold uppercase tracking-tight">Heatmap de Erros</h3>
                </div>
                <div className="space-y-6">
                  {heatmap.map((item, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">{item.name}</p>
                        <span className="text-[10px] font-black text-gold uppercase tracking-widest">{item.failures} falhas</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${100 - item.average}%` }}
                          className="h-full bg-gold"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : view === "users" ? (
        <div className="space-y-12">
          {/* Stats Grid for Users */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-vertus-gray/50 border border-white/5 rounded-3xl p-8 flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest font-mono">Contas Registradas</p>
                <p className="text-4xl font-bold">{cloudUsers.length}</p>
              </div>
              <Users className="text-emerald-400" size={20} />
            </div>
            <div className="bg-vertus-gray/50 border border-white/5 rounded-3xl p-8 flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest font-mono">Administradores</p>
                <p className="text-4xl font-bold">{cloudUsers.filter(u => u.role === "admin" || ADMIN_EMAILS.includes(u.email)).length}</p>
              </div>
              <ShieldCheck className="text-gold" size={20} />
            </div>
            <div className="bg-vertus-gray/50 border border-white/5 rounded-3xl p-8 flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest font-mono">Apenas Login (Sem Diagnóstico)</p>
                <p className="text-4xl font-bold">
                  {cloudUsers.filter(u => !leads.some(l => l.email?.toLowerCase() === u.email?.toLowerCase() || l.userId === u.id)).length}
                </p>
              </div>
              <AlertCircle className="text-yellow-500" size={20} />
            </div>
          </div>

          <div className="bg-vertus-gray/50 border border-white/5 rounded-3xl overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar logins por nome ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/20 focus:border-gold outline-none transition-all text-sm"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Usuário / Cadastro</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">E-mail</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Privilégio</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Último Acesso</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Status do Diagnóstico</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {cloudUsers.filter(u => 
                    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4 text-white/20">
                          <Users size={40} />
                          <p className="text-xs font-black uppercase tracking-widest">Nenhum login registrado</p>
                        </div>
                      </td>
                    </tr>
                  ) : cloudUsers.filter(u => 
                    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((u) => {
                    const associatedLead = leads.find(l => l.email?.toLowerCase() === u.email?.toLowerCase() || l.userId === u.id);
                    const associatedDiagnosis = associatedLead ? diagnoses.find(d => d.leadId === associatedLead.id) : null;
                    
                    let accessDateStr = "N/A";
                    if (u.lastAccess) {
                      const d = u.lastAccess.seconds ? new Date(u.lastAccess.seconds * 1000) : new Date(u.lastAccess);
                      if (!isNaN(d.getTime())) {
                        accessDateStr = d.toLocaleString("pt-BR");
                      }
                    }

                    const isMasterAdmin = ADMIN_EMAILS.includes(u.email);
                    const isAdminRole = u.role === "admin" || isMasterAdmin;

                    return (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-8 py-6">
                          <p className="text-sm font-bold text-white uppercase tracking-tight">{u.name || "Sem Nome"}</p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-xs text-white/60">{u.email}</p>
                        </td>
                        <td className="px-8 py-6">
                          {isMasterAdmin ? (
                            <span className="px-2.5 py-1 bg-gold/10 border border-gold/25 text-gold rounded-lg text-[9px] font-black uppercase tracking-wider select-none cursor-default" title="Administrador Principal (Não Editável)">Master Admin</span>
                          ) : (
                            <button
                              onClick={() => handleToggleUserRole(u.id, u.role || "user")}
                              disabled={isUpdatingRole !== null}
                              className={cn(
                                "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all",
                                isAdminRole 
                                  ? "bg-gold text-vertus-black hover:bg-gold/80" 
                                  : "bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white"
                              )}
                            >
                              {isUpdatingRole === u.id 
                                ? "Atualizando..." 
                                : isAdminRole ? "Administrador" : "Usuário"}
                            </button>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-xs font-medium text-white/60">{accessDateStr}</p>
                        </td>
                        <td className="px-8 py-6">
                          {associatedLead ? (
                            <div className="flex flex-col gap-1">
                              <span className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-[9px] font-black uppercase tracking-wider w-fit">
                                Diagnóstico Iniciado
                              </span>
                              <p className="text-[10px] text-white/40 font-bold uppercase tracking-tight">
                                {associatedLead.companyName} {associatedDiagnosis ? `(${associatedDiagnosis.score}%)` : "(Pendente)"}
                              </p>
                            </div>
                          ) : (
                            <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg text-[9px] font-black uppercase tracking-wider w-fit">
                              Apenas Criou Conta
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[
              { label: "Total de Leads", value: stats.totalLeads, icon: Users, color: "text-blue-400" },
              { label: "Contas Criadas", value: stats.totalUsers, icon: ShieldCheck, color: "text-emerald-400" },
              { label: "Média do Mercado", value: `${stats.marketAverage}%`, icon: BarChart3, color: "text-gold" },
              { label: "Caos Operacional", value: stats.operationalChaos, icon: AlertCircle, color: "text-red-500" },
              { label: "Falso Controle", value: stats.falseControl, icon: TrendingDown, color: "text-yellow-500" }
            ].map((stat, i) => (
              <div key={i} className="bg-vertus-gray/50 border border-white/5 rounded-3xl p-8 flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-4xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={stat.color} size={20} />
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-vertus-gray/50 border border-white/5 rounded-3xl overflow-hidden">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <input 
                    type="text" 
                    placeholder="Buscar por clínica ou proprietário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/20 focus:border-gold outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5">
                      <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Clínica / Proprietário</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Contato</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Acesso</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Faturamento</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Perda Mensal</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Score</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center gap-4 text-white/20">
                            <FileText size={40} />
                            <p className="text-xs font-black uppercase tracking-widest">Nenhum lead encontrado no sistema</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredLeads.map((lead) => {
                      const diagnosis = diagnoses.find(d => d.leadId === lead.id);
                      return (
                        <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-white uppercase tracking-tight">{lead.companyName}</p>
                              <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">{lead.responsibleName}</p>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-white">{lead.whatsapp}</p>
                              <p className="text-[10px] text-white/40">{lead.email}</p>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            {getAccessStatusBadge(lead)}
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-xs font-bold text-white uppercase tracking-tight">{lead.monthlyRevenue}</p>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-xs font-black text-red-500">R$ {diagnosis?.monthlyLoss?.toLocaleString("pt-BR") || "0"}</span>
                          </td>
                          <td className="px-8 py-6">
                            {diagnosis ? (
                              <div className="flex items-center gap-3">
                                <div className="h-1.5 w-12 bg-white/5 rounded-full overflow-hidden">
                                  <div 
                                    className={cn("h-full", diagnosis.score < 50 ? "bg-red-500" : "bg-gold")}
                                    style={{ width: `${diagnosis.score}%` }}
                                  />
                                </div>
                                <span className="text-xs font-black">{diagnosis.score}%</span>
                              </div>
                            ) : (
                              <span className="text-[9px] font-black text-white/10 uppercase tracking-widest">Incompleto</span>
                            )}
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => openLeadDetails(lead)}
                                className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-gold transition-all"
                              >
                                <ExternalLink size={14} />
                              </button>
                              <button 
                                onClick={() => handleDeleteLead(lead.id!)}
                                className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-red-500 transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top 10 Piores */}
            <div className="bg-vertus-gray/50 border border-white/5 rounded-3xl p-8 space-y-8">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-500" size={20} />
                <h3 className="text-xl font-bold uppercase tracking-tight">Top 10 — Críticos</h3>
              </div>
              <div className="space-y-4">
                {worstDiagnoses.map((d, i) => {
                  const lead = leads.find(l => l.id === d.leadId);
                  return (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                      <div className="flex items-center gap-4">
                        <span className="text-white/20 font-black text-xs">#{i + 1}</span>
                        <div>
                          <p className="text-sm font-bold uppercase tracking-tight truncate max-w-[120px]">{lead?.companyName || "Lead Excluído"}</p>
                          <p className="text-[10px] text-white/40">{lead?.whatsapp || "N/A"}</p>
                        </div>
                      </div>
                      <span className={cn(
                        "text-lg font-black",
                        d.score < 50 ? "text-red-500" : "text-gold"
                      )}>{d.score}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lead Details Modal */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="absolute inset-0 bg-vertus-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-vertus-gray border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 sm:p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.02]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gold">Dossiê do Lead</span>
                    {selectedLead.companyName && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-gold/10 text-gold rounded border border-gold/20">
                        VERTUS Raio-X
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">{selectedLead.companyName}</h3>
                  <p className="text-xs text-white/40 font-medium">{selectedLead.responsibleName} • {selectedLead.whatsapp}</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex w-full sm:w-auto">
                    <button
                      onClick={() => setModalTab("overview")}
                      className={cn(
                        "flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5",
                        modalTab === "overview" ? "bg-gold text-vertus-black shadow-md" : "text-white/40 hover:text-white"
                      )}
                    >
                      <LayoutGrid size={13} />
                      Visão Geral & Script
                    </button>
                    <button
                      onClick={() => setModalTab("actionPlan")}
                      className={cn(
                        "flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5",
                        modalTab === "actionPlan" ? "bg-gold text-vertus-black shadow-md" : "text-gold/70 hover:text-gold"
                      )}
                    >
                      <Sparkles size={13} />
                      Plano de Ação (IA)
                    </button>
                  </div>

                  <button 
                    onClick={() => setSelectedLead(null)}
                    className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-10 custom-scrollbar">
                {(() => {
                  const diagnosis = diagnoses.find(d => d.leadId === selectedLead.id);

                  if (modalTab === "actionPlan") {
                    return (
                      <div className="space-y-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gold/10 border border-gold/20 p-5 rounded-2xl">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gold">
                              <Sparkles size={16} />
                              <span className="text-xs font-black uppercase tracking-wider">Plano de Ação Estratégico para Reunião</span>
                            </div>
                            <p className="text-xs text-white/70 max-w-xl">
                              Análise aprofundada gerada pela IA para os consultores da VERTUS conduzirem a reunião de entrega com a <strong className="text-white">{selectedLead.companyName}</strong>.
                            </p>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => diagnosis && generateActionPlanForAdmin(selectedLead, diagnosis)}
                              disabled={isGeneratingPlan}
                              className="px-4 py-2.5 bg-gold/20 border border-gold/40 text-gold hover:bg-gold hover:text-vertus-black font-black text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                              <Sparkles size={13} />
                              {isGeneratingPlan ? "Gerando..." : "Regerar Análise"}
                            </button>

                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(aiActionPlan);
                                alert("Plano de Ação copiado para a área de transferência!");
                              }}
                              className="px-4 py-2.5 bg-white/5 border border-white/10 text-white hover:bg-white/10 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                              <FileText size={13} />
                              Copiar Dossiê
                            </button>
                          </div>
                        </div>

                        {/* Action Plan Content */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
                          {isGeneratingPlan ? (
                            <div className="space-y-4 animate-pulse py-12 text-center">
                              <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4" />
                              <p className="text-xs font-black text-gold uppercase tracking-widest">Sintetizando Plano de Ação Estratégico com a IA VERTUS...</p>
                              <p className="text-[10px] text-white/40">Analisando indicadores, hemorragia financeira e plano de 30/60/90 dias.</p>
                            </div>
                          ) : (
                            <div className="prose prose-invert max-w-none text-white/80 text-sm leading-relaxed prose-gold">
                              <ReactMarkdown>{aiActionPlan || "Nenhum plano gerado ainda. Clique no botão de gerar."}</ReactMarkdown>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="grid lg:grid-cols-3 gap-10">
                      {/* Left Column: Lead Info & Diagnosis Summary */}
                      <div className="space-y-10">
                        {/* Lead Profile */}
                        <div className="space-y-6">
                          <h4 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <Users size={14} />
                            Perfil do Lead
                          </h4>
                          <div className="space-y-4 bg-white/5 border border-white/5 rounded-2xl p-6">
                            <div className="flex items-center gap-3">
                              <Mail size={14} className="text-gold shrink-0" />
                              <p className="text-xs text-white/60 truncate">{selectedLead.email}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <MapPin size={14} className="text-gold shrink-0" />
                              <p className="text-xs text-white/60">{selectedLead.location}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <DollarSign size={14} className="text-gold shrink-0" />
                              <p className="text-xs text-white/60">{selectedLead.monthlyRevenue}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Users size={14} className="text-gold shrink-0" />
                              <p className="text-xs text-white/60">{selectedLead.employeeCount} Funcionários</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Briefcase size={14} className="text-gold shrink-0" />
                              <p className="text-xs text-white/60">{selectedLead.segment}</p>
                            </div>
                          </div>
                        </div>

                        {/* Diagnosis Summary */}
                        {diagnosis && (
                          <div className="space-y-6">
                            <h4 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                              <Target size={14} />
                              Resumo do Diagnóstico
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Score</p>
                                <p className="text-lg font-bold text-white">{diagnosis.score}%</p>
                              </div>
                              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Classificação</p>
                                <p className={cn("text-[10px] font-black uppercase", 
                                  diagnosis.classification === "Crítica" ? "text-red-500" : 
                                  diagnosis.classification === "Atenção" ? "text-yellow-500" : 
                                  "text-green-500"
                                )}>
                                  {diagnosis.classification}
                                </p>
                              </div>
                              <div className="p-4 bg-white/5 rounded-xl border border-white/5 col-span-2">
                                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Hemorragia Mensal</p>
                                <p className="text-lg font-bold text-red-500">R$ {diagnosis.monthlyLoss.toLocaleString("pt-BR")},00</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Gestão de Acesso */}
                        <div className="space-y-6">
                          <h4 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <Lock size={14} />
                            Gestão de Acesso VERTUS
                          </h4>
                          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-6">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-white/50 uppercase tracking-tight">Status Atual:</span>
                              {(() => {
                                const status = selectedLead.accessStatus || "active";
                                if (status === "suspended") {
                                  return <span className="px-3 py-1.5 bg-red-500/10 border border-red-500/25 text-red-500 rounded-lg text-[10px] font-black uppercase tracking-wider">Suspenso</span>;
                                }
                                
                                let isExpired = false;
                                if (selectedLead.accessExpiresAt) {
                                  const expiryDate = new Date(selectedLead.accessExpiresAt);
                                  isExpired = !isNaN(expiryDate.getTime()) && new Date() > expiryDate;
                                } else if (selectedLead.createdAt) {
                                  let createdTime = selectedLead.createdAt?.seconds ? selectedLead.createdAt.seconds * 1000 : new Date(selectedLead.createdAt).getTime();
                                  if (!isNaN(createdTime)) {
                                    isExpired = new Date() > new Date(createdTime + 30 * 24 * 60 * 60 * 1000);
                                  }
                                }
                                
                                if (isExpired) {
                                  return <span className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/25 text-amber-500 rounded-lg text-[10px] font-black uppercase tracking-wider">Expirado</span>;
                                }
                                
                                return <span className="px-3 py-1.5 bg-green-500/10 border border-green-500/25 text-green-500 rounded-lg text-[10px] font-black uppercase tracking-wider">Ativo</span>;
                              })()}
                            </div>

                            <div className="space-y-2">
                              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Expira em:</span>
                              <p className="text-xs font-bold text-white uppercase tracking-tight">
                                {(() => {
                                  if (selectedLead.accessExpiresAt) {
                                    const d = new Date(selectedLead.accessExpiresAt);
                                    return !isNaN(d.getTime()) ? d.toLocaleDateString("pt-BR") : "Personalizado";
                                  } else if (selectedLead.createdAt) {
                                    let createdTime = selectedLead.createdAt?.seconds ? selectedLead.createdAt.seconds * 1000 : new Date(selectedLead.createdAt).getTime();
                                    if (!isNaN(createdTime)) {
                                      return new Date(createdTime + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR") + " (Padrão 30 dias)";
                                    }
                                  }
                                  return "30 dias após início";
                                })()}
                              </p>
                            </div>

                            <div className="space-y-3">
                              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block">Definir Período:</span>
                              {(() => {
                                const currentDurationType = selectedLead.accessDurationType || (
                                  selectedLead.accessExpiresAt ? (() => {
                                    const expiry = new Date(selectedLead.accessExpiresAt);
                                    if (isNaN(expiry.getTime())) return "custom";
                                    const diffYears = expiry.getFullYear() - new Date().getFullYear();
                                    if (diffYears >= 5) return "unlimited";
                                    
                                    const diffMs = expiry.getTime() - new Date().getTime();
                                    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
                                    
                                    if (diffDays >= 85 && diffDays <= 95) return "90";
                                    if (diffDays >= 40 && diffDays <= 50) return "45";
                                    if (diffDays >= 25 && diffDays <= 35) return "30";
                                    
                                    return "custom";
                                  })() : ""
                                );

                                const getBtnClass = (type: string) => {
                                  const isActive = currentDurationType === type;
                                  return cn(
                                    "py-2.5 px-3 border rounded-xl font-black uppercase tracking-widest transition-all text-[9px] flex items-center justify-center text-center leading-tight",
                                    isActive
                                      ? "bg-gold/20 border-gold text-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                                      : "bg-white/5 border-white/10 text-white/50 hover:bg-gold/15 hover:border-gold/30 hover:text-gold"
                                  );
                                };

                                return (
                                  <div className="grid grid-cols-2 gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const futureDate = new Date();
                                        futureDate.setDate(futureDate.getDate() + 30);
                                        handleUpdateLeadAccess(selectedLead.id!, {
                                          accessStatus: "active",
                                          accessExpiresAt: futureDate.toISOString(),
                                          accessDurationType: "30"
                                        });
                                      }}
                                      className={getBtnClass("30")}
                                    >
                                      +30 Dias
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const futureDate = new Date();
                                        futureDate.setDate(futureDate.getDate() + 45);
                                        handleUpdateLeadAccess(selectedLead.id!, {
                                          accessStatus: "active",
                                          accessExpiresAt: futureDate.toISOString(),
                                          accessDurationType: "45"
                                        });
                                      }}
                                      className={getBtnClass("45")}
                                    >
                                      +45 Dias
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const futureDate = new Date();
                                        futureDate.setDate(futureDate.getDate() + 90);
                                        handleUpdateLeadAccess(selectedLead.id!, {
                                          accessStatus: "active",
                                          accessExpiresAt: futureDate.toISOString(),
                                          accessDurationType: "90"
                                        });
                                      }}
                                      className={getBtnClass("90")}
                                    >
                                      +90 Dias
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const futureDate = new Date();
                                        futureDate.setFullYear(futureDate.getFullYear() + 10);
                                        handleUpdateLeadAccess(selectedLead.id!, {
                                          accessStatus: "active",
                                          accessExpiresAt: futureDate.toISOString(),
                                          accessDurationType: "unlimited"
                                        });
                                      }}
                                      className={getBtnClass("unlimited")}
                                    >
                                      Sem Limite
                                    </button>
                                  </div>
                                );
                              })()}
                            </div>

                            <div className="space-y-2">
                              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block">Data Customizada:</span>
                              <input
                                type="date"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white uppercase tracking-wider focus:border-gold outline-none"
                                value={selectedLead.accessExpiresAt ? selectedLead.accessExpiresAt.substring(0, 10) : ""}
                                onChange={(e) => {
                                  if (e.target.value) {
                                    const selectedDate = new Date(e.target.value + "T23:59:59");
                                    handleUpdateLeadAccess(selectedLead.id!, {
                                      accessStatus: "active",
                                      accessExpiresAt: selectedDate.toISOString(),
                                      accessDurationType: "custom"
                                    });
                                  }
                                }}
                              />
                            </div>

                            <div className="pt-4 border-t border-white/5 flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  handleUpdateLeadAccess(selectedLead.id!, {
                                    accessStatus: "suspended"
                                  });
                                }}
                                className="flex-1 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500/20 transition-all text-[9px] font-black uppercase tracking-widest"
                              >
                                Bloquear
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const futureDate = new Date();
                                  futureDate.setDate(futureDate.getDate() + 30);
                                  handleUpdateLeadAccess(selectedLead.id!, {
                                    accessStatus: "active",
                                    accessExpiresAt: futureDate.toISOString()
                                  });
                                }}
                                className="flex-1 py-2.5 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl hover:bg-green-500/20 transition-all text-[9px] font-black uppercase tracking-widest"
                              >
                                Ativar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>


                      {/* Middle Column: AI Script */}
                      <div className="space-y-6">
                        <h4 className="text-xs font-black text-gold uppercase tracking-widest flex items-center gap-2">
                          <MessageSquare size={14} />
                          Script de Abordagem IA
                        </h4>
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 h-[400px] overflow-y-auto custom-scrollbar">
                          {isGeneratingScript ? (
                            <div className="space-y-3 animate-pulse">
                              <div className="h-3 w-full bg-white/5 rounded-full" />
                              <div className="h-3 w-[90%] bg-white/5 rounded-full" />
                              <div className="h-3 w-[95%] bg-white/5 rounded-full" />
                            </div>
                          ) : (
                            <div className="prose prose-invert prose-sm max-w-none text-white/60 leading-relaxed text-xs prose-gold">
                              <ReactMarkdown>{aiScript || "Nenhum script gerado."}</ReactMarkdown>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Column: Dimensions */}
                      <div className="space-y-6">
                        <h4 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                          <LayoutGrid size={14} />
                          Maturidade por Dimensão
                        </h4>
                        <div className="grid gap-4">
                          {diagnosis?.dimensions && 
                            Object.entries(diagnosis.dimensions).map(([key, val]) => (
                            <div key={key} className="p-4 bg-white/5 rounded-xl border border-white/5">
                              <div className="flex justify-between items-end mb-2">
                                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">
                                  {DIMENSION_NAMES[key] || key}
                                </p>
                                <span className="text-xs font-bold text-white">{val}%</span>
                              </div>
                              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div 
                                  className={cn("h-full", val < 50 ? "bg-red-500" : "bg-gold")}
                                  style={{ width: `${val}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Confirmation Modal */}
      <AnimatePresence>
        {leadToDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLeadToDelete(null)}
              className="absolute inset-0 bg-vertus-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-vertus-gray border border-white/10 rounded-[32px] shadow-2xl overflow-hidden p-8 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={32} className="text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Confirmar Exclusão</h3>
                <p className="text-sm text-white/40">
                  Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita e todos os dados do diagnóstico serão perdidos.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setLeadToDelete(null)}
                  className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 font-bold hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
