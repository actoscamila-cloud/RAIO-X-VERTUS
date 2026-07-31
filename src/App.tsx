import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import LandingPage from "./components/LandingPage";
import LeadForm from "./components/LeadForm";
import DiagnosisFlow from "./components/DiagnosisFlow";
import Dashboard from "./components/Dashboard";
import ActionPlan from "./components/ActionPlan";
import AdminPanel from "./components/AdminPanel";
import TrainingModules from "./components/TrainingModules";
import VertusAssistant from "./components/VertusAssistant";
import AboutVertus from "./components/AboutVertus";
import AuthScreen from "./components/AuthScreen";
import BpoVertusDetail from "./components/BpoVertusDetail";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { Lead, DiagnosisResponse } from "./types";
import { storage } from "./lib/storage";
import { auth, db } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { VERTUS_WHATSAPP_LINK, VIX_WHATSAPP_LINK, ADMIN_EMAILS } from "./constants";

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-vertus-black flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-6">
            <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 mx-auto">
              <span className="text-red-500 text-4xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Ops! Algo deu errado.</h2>
            <p className="text-white/40 text-sm leading-relaxed">
              Ocorreu um erro inesperado no sistema. Por favor, tente recarregar a página ou entre em contato com o suporte Vertus.
            </p>
            <pre className="p-4 bg-white/5 border border-white/10 rounded-xl text-[10px] text-red-400 overflow-auto text-left max-h-40">
              {this.state.error?.message}
            </pre>
            <button 
              onClick={() => window.location.href = "/"}
              className="px-8 py-3 bg-gold text-vertus-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 transition-all"
            >
              Voltar para o Início
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

type AppState = "landing" | "login" | "lead-form" | "diagnosis" | "dashboard" | "training" | "action-plan" | "admin" | "bpo-vertus";

export default function App() {
  const [state, setState] = useState<AppState>("landing");
  const [user, setUser] = useState<{ email: string; name: string, role?: string } | null>(null);
  const [lead, setLead] = useState<Lead | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResponse | null>(null);
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isTrainingComplete, setIsTrainingComplete] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let role = "user";
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            role = userDoc.data()?.role || "user";
          }
        } catch (e) {
          console.error("App: error fetching user role:", e);
        }

        const userData = { 
          email: firebaseUser.email || "", 
          name: firebaseUser.displayName || "Usuário Vertus",
          role
        };
        setUser(userData);
        
        // Try to restore state from Firestore
        const cloudSession = await storage.getLatestUserState(firebaseUser.uid);
        if (cloudSession) {
          setLead(cloudSession.lead);
          setDiagnosis(cloudSession.diagnosis);
          setState(cloudSession.state === "training" ? "action-plan" : cloudSession.state as AppState);
          setProgress(100);
        }
      } else {
        setUser(null);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Load session on mount
  useEffect(() => {
    if (!isAuthReady) return;

    const params = new URLSearchParams(window.location.search);
    const isForceAdmin = params.get("admin") === "true";
    
    if (isForceAdmin && user?.email && (ADMIN_EMAILS.includes(user.email) || user.role === "admin")) {
      setState("admin");
      return;
    }

    const savedSession = storage.getSession(user?.email);
    if (savedSession) {
      setLead(savedSession.lead);
      setDiagnosis(savedSession.diagnosis);
      setState(savedSession.state === "training" ? "action-plan" : savedSession.state as AppState);
      
      // Set progress based on state
      if (savedSession.state === "diagnosis") setProgress(10);
      if (savedSession.state === "dashboard") setProgress(100);
      if (savedSession.state === "training") setProgress(100);
      if (savedSession.state === "action-plan") setProgress(100);
    }
  }, [isAuthReady, user]);

  // Check access restriction
  useEffect(() => {
    if (!isAuthReady) return;

    const isUserAdmin = !!user?.email && (ADMIN_EMAILS.includes(user.email) || user.role === "admin");
    if (isUserAdmin) {
      setIsBlocked(false);
      return;
    }

    // Do not block unauthenticated guests so they can view the landing page and login
    if (!user) {
      setIsBlocked(false);
      return;
    }

    if (lead) {
      if (lead.accessStatus === "suspended" || lead.accessStatus === "expired") {
        setIsBlocked(true);
        return;
      }

      if (lead.accessExpiresAt) {
        const expiryDate = new Date(lead.accessExpiresAt);
        if (!isNaN(expiryDate.getTime())) {
          if (new Date() > expiryDate) {
            setIsBlocked(true);
            return;
          } else {
            setIsBlocked(false);
            return;
          }
        }
      }

      let createdTime = null;
      if (lead.createdAt) {
        if (lead.createdAt.seconds) {
          createdTime = lead.createdAt.seconds * 1000;
        } else if (typeof lead.createdAt.toMillis === "function") {
          createdTime = lead.createdAt.toMillis();
        } else {
          createdTime = new Date(lead.createdAt).getTime();
        }
      }

      if (createdTime && !isNaN(createdTime)) {
        const diffDays = (new Date().getTime() - createdTime) / (1000 * 60 * 60 * 24);
        if (diffDays > 30) {
          setIsBlocked(true);
        } else {
          setIsBlocked(false);
        }
        return;
      }
    } else {
      // If user is logged in but doesn't have a lead profile yet, do not block so they can complete registration
      setIsBlocked(false);
      return;
    }

    if (!storage.checkAccess()) {
      setIsBlocked(true);
    } else {
      setIsBlocked(false);
    }
  }, [isAuthReady, user, lead]);

  // Save session on changes
  useEffect(() => {
    if (state !== "admin" && state !== "landing" && state !== "login") {
      storage.saveSession(lead, diagnosis, state, user?.email);
    }
  }, [lead, diagnosis, state, user]);

  const handleStart = () => {
    if (user) {
      setState("lead-form");
      setProgress(0);
    } else {
      setState("login");
    }
  };

  const handleAuthComplete = async (userData: { email: string; name: string }) => {
    console.log("App.handleAuthComplete: Starting process for", userData.email);
    try {
      await storage.saveUser(userData);
      setUser(userData);
      
      // Check for user-specific session
      console.log("App.handleAuthComplete: Checking for existing session...");
      const userSession = storage.getSession(userData.email);
      if (userSession && userSession.state !== "login") {
        console.log("App.handleAuthComplete: Valid session found, restoring state:", userSession.state);
        setLead(userSession.lead);
        setDiagnosis(userSession.diagnosis);
        setState(userSession.state === "training" ? "action-plan" : userSession.state as AppState);
        
        if (userSession.state === "diagnosis") setProgress(10);
        if (userSession.state === "dashboard") setProgress(100);
        if (userSession.state === "training") setProgress(100);
        if (userSession.state === "action-plan") setProgress(100);
      } else {
        console.log("App.handleAuthComplete: No valid session found, redirecting to lead-form");
        setState("lead-form");
        setProgress(0);
      }
    } catch (error) {
      console.error("App.handleAuthComplete: Error during post-auth setup:", error);
    }
  };

  const handleLeadSubmit = async (newLead: Lead) => {
    console.log("Submitting lead:", newLead);
    const id = await storage.saveLead(newLead);
    console.log("Lead saved with ID:", id);
    const leadWithId = { ...newLead, id };
    setLead(leadWithId);
    setState("diagnosis");
    setProgress(5);
  };

  const handleDiagnosisComplete = async (newDiagnosis: DiagnosisResponse) => {
    console.log("Submitting diagnosis:", newDiagnosis);
    const id = await storage.saveDiagnosis(newDiagnosis);
    console.log("Diagnosis saved with ID:", id);
    const diagnosisWithId = { ...newDiagnosis, id };
    setDiagnosis(diagnosisWithId);
    storage.setLastAccess(); // Start the 30-day block
    setState("dashboard");
    setProgress(100);
  };

  const handleNextToTraining = () => {
    setState("action-plan");
  };

  const handleBack = () => {
    if (state === "login") setState("landing");
    else if (state === "lead-form") {
      setState("landing");
      storage.clearSession(user?.email);
    }
    else if (state === "diagnosis") setState("lead-form");
    else if (state === "dashboard") setState("diagnosis");
    else if (state === "training") setState("dashboard");
    else if (state === "action-plan") setState("dashboard");
    else if (state === "bpo-vertus") {
      if (user && lead) {
        setState("dashboard");
      } else {
        setState("landing");
      }
    }
    else if (state === "admin") setState("landing");
  };

  const handleTrainingComplete = () => {
    setIsTrainingComplete(true);
    localStorage.setItem("vertus_training_complete", "true");
    localStorage.setItem("vix_training_complete", "true");
    setState("action-plan");
  };

  const handleLogout = async () => {
    await auth.signOut();
    storage.clearSession(user?.email);
    localStorage.removeItem("vertus_training_complete");
    localStorage.removeItem("vix_training_complete");
    setLead(null);
    setDiagnosis(null);
    setUser(null);
    setState("landing");
  };

  const isAdmin = !!user?.email && (ADMIN_EMAILS.includes(user.email) || user.role === "admin");

  if (isBlocked && !isAdmin && state !== "login" && state !== "landing") {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 space-y-12">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 shadow-2xl shadow-red-500/10">
            <span className="text-red-500 text-4xl">🔒</span>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white uppercase tracking-tight leading-none">
              Acesso <span className="text-red-500">Expirado</span>
            </h2>
            <p className="text-white/30 max-w-lg mx-auto text-base font-medium leading-relaxed">
              Seu período de avaliação estratégica de 30 dias terminou. Para continuar tendo clareza financeira e previsibilidade total, solicite seu upgrade agora.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl">
            {["BPO VERTUS", "Vertus Finance", "Controle 45 dias"].map(prod => (
              <div key={prod} className="p-8 bg-vertus-gray/50 border border-white/5 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">{prod}</h3>
                <button 
                  onClick={() => window.open(VERTUS_WHATSAPP_LINK + `?text=Olá!%20Meu%20acesso%20expirou%20e%20tenho%20interesse%20no%20${prod}.`, "_blank")}
                  className="w-full py-3 bg-gold text-vertus-black font-black rounded-lg uppercase tracking-widest text-[10px] hover:scale-105 transition-transform"
                >
                  SOLICITAR AGORA
                </button>
              </div>
            ))}
          </div>

          <div className="pt-12 border-t border-white/5 w-full flex flex-col items-center gap-4 justify-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/5">
              VERTUS SISTEMAS
            </p>
            <button 
              onClick={() => setState("login")}
              className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-gold transition-all"
            >
              Área Administrativa / Login
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <ErrorBoundary>
      <Layout 
        progress={progress} 
        onBack={state !== "landing" ? handleBack : undefined}
        onLogout={state !== "landing" ? handleLogout : undefined}
        hideHeader={state === "admin"}
        hideFooter={state === "admin" || showAbout}
        isAdmin={isAdmin}
        onAdminClick={() => setState("admin")}
        onBpoClick={() => { setShowAbout(false); setState("bpo-vertus"); }}
        onVertusFinanceClick={() => setShowAbout(true)}
      >
        <AnimatePresence mode="wait">
          {state === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <LandingPage 
                onStart={handleStart} 
                onContinue={storage.getSession(user?.email) ? () => {
                  const session = storage.getSession(user?.email);
                  if (session) {
                    setLead(session.lead);
                    setDiagnosis(session.diagnosis);
                    setState(session.state === "training" ? "action-plan" : session.state as AppState);
                    if (session.state === "diagnosis") setProgress(10);
                    if (session.state === "dashboard") setProgress(100);
                    if (session.state === "training") setProgress(100);
                    if (session.state === "action-plan") setProgress(100);
                  }
                } : undefined}
              />
            </motion.div>
          )}
          {state === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <AuthScreen 
                onAuthComplete={handleAuthComplete} 
                onBack={() => setState("landing")} 
              />
            </motion.div>
          )}
          {state === "lead-form" && (
            <motion.div
              key="lead-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LeadForm onSubmit={handleLeadSubmit} userEmail={user?.email} />
            </motion.div>
          )}
          {state === "diagnosis" && lead && (
            <motion.div
              key="diagnosis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DiagnosisFlow 
                leadId={lead.id!} 
                onComplete={handleDiagnosisComplete} 
                onProgress={setProgress}
              />
            </motion.div>
          )}
          {state === "dashboard" && lead && diagnosis && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <Dashboard 
                lead={lead} 
                diagnosis={diagnosis} 
                onNext={handleNextToTraining}
                isTrainingComplete={isTrainingComplete}
              />
              <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-6 space-y-6">
                <VertusAssistant 
                  inline 
                  isLocked={!isTrainingComplete} 
                  onNavigateToTraining={handleNextToTraining} 
                />
                <div className="flex justify-center pt-2">
                  <button 
                    onClick={() => setShowAbout(true)}
                    className="group relative px-8 py-4 sm:px-10 sm:py-4.5 bg-gradient-to-br from-gold-light via-gold to-gold-dark rounded-2xl text-vertus-black flex items-center justify-center gap-3 font-black uppercase tracking-wider text-xs sm:text-sm shadow-xl shadow-gold/20 hover:scale-[1.01] transition-all overflow-hidden border border-white/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full -skew-x-12 animate-shine pointer-events-none" />
                    <Sparkles size={18} className="relative z-10 shrink-0" />
                    <div className="flex flex-col items-start text-left relative z-10">
                      <span className="text-xs sm:text-sm font-black leading-tight">Conheça a VERTUS</span>
                      <span className="text-[9px] font-black tracking-widest opacity-70">Especialista em performance empresarial</span>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          {state === "training" && (
            <motion.div
              key="training"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TrainingModules 
                onComplete={handleTrainingComplete} 
                isAlreadyComplete={isTrainingComplete}
                onBack={() => setState("dashboard")}
              />
            </motion.div>
          )}
          {state === "action-plan" && lead && diagnosis && (
            <motion.div
              key="action-plan"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <ActionPlan 
                lead={lead} 
                diagnosis={diagnosis} 
                isLocked={!isTrainingComplete} 
                onNavigateToTraining={handleNextToTraining}
                onBackToDashboard={() => setState("dashboard")}
              />
            </motion.div>
          )}
          {state === "bpo-vertus" && (
            <motion.div
              key="bpo-vertus"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <BpoVertusDetail onBack={handleBack} />
            </motion.div>
          )}
          {state === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AdminPanel onLogout={handleLogout} />
            </motion.div>
          )}
        </AnimatePresence>
      </Layout>
      <AnimatePresence>
        {showAbout && <AboutVertus onClose={() => setShowAbout(false)} />}
      </AnimatePresence>
    </ErrorBoundary>
  );
}
