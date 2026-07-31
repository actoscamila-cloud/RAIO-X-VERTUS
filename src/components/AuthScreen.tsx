import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Lock, Mail, User, ArrowRight, ShieldCheck, Sparkles, Chrome, CheckCircle2, AlertTriangle, Copy, Check, ExternalLink, Wifi } from "lucide-react";
import { storage } from "../lib/storage";
import { auth, googleProvider, db } from "../lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, getDocFromServer } from "firebase/firestore";

interface AuthScreenProps {
  onAuthComplete: (user: { email: string; name: string }) => void;
  onBack: () => void;
}

type AuthMode = "login" | "register" | "forgot-password";

export default function AuthScreen({ onAuthComplete, onBack }: AuthScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Auth state management
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Real-time Firebase connection diagnostics
  const [connectionState, setConnectionState] = useState<"checking" | "connected" | "failed">("checking");
  const [connectionMsg, setConnectionMsg] = useState<string>("");
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);

  // Exact domain to authorize
  const currentDomain = typeof window !== "undefined" ? window.location.hostname : "";
  const altDomain = currentDomain.startsWith("ais-dev-") 
    ? currentDomain.replace("ais-dev-", "ais-pre-") 
    : currentDomain.startsWith("ais-pre-")
      ? currentDomain.replace("ais-pre-", "ais-dev-")
      : currentDomain;

  useEffect(() => {
    async function diagnoseConnection() {
      try {
        // Attempt an unauthenticated getDoc request onto the public 'settings' document to see if Firestore is alive
        const testDocRef = doc(db, "settings", "_connection_test_");
        await getDocFromServer(testDocRef);
        setConnectionState("connected");
        setConnectionMsg("Conectado com sucesso ao Firestore! Banco ativo e respondendo.");
      } catch (err: any) {
        console.log("Diagnóstico Firebase Connection:", err.code || err.message);
        // If the error code exists or is 'permission-denied', it means the Firebase servers responded to us correctly (and parsed our request), which proves we are connected!
        if (err?.code === "permission-denied" || err?.message?.includes("permissions") || err?.code) {
          setConnectionState("connected");
          setConnectionMsg("Conexão ativa! Firebase Firestore está respondendo com sucesso.");
        } else {
          setConnectionState("failed");
          setConnectionMsg(err?.message || "Sem resposta física do banco Firebase.");
        }
      }
    }
    diagnoseConnection();
  }, []);

  const handleCopy = (domain: string) => {
    navigator.clipboard.writeText(domain);
    setCopiedDomain(domain);
    setTimeout(() => setCopiedDomain(null), 2000);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (authMode === "register") {
        if (!name.trim()) throw new Error("Insira seu nome para cadastro");
        if (password.length < 6) throw new Error("A senha precisa ter no mínimo 6 caracteres");

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        
        setSuccessMsg("Conta criada com sucesso! Redirecionando...");
        setTimeout(() => {
          onAuthComplete({
            email: userCredential.user.email || "",
            name: name
          });
        }, 1500);

      } else if (authMode === "login") {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onAuthComplete({
          email: userCredential.user.email || "",
          name: userCredential.user.displayName || userCredential.user.email?.split("@")[0] || "Usuário"
        });

      } else if (authMode === "forgot-password") {
        await sendPasswordResetEmail(auth, email);
        setSuccessMsg("E-mail de recuperação enviado com sucesso. Verifique sua caixa de entrada!");
        setAuthMode("login");
      }
    } catch (err: any) {
      const isExpectedAuthError = [
        "auth/email-already-in-use",
        "auth/invalid-credential",
        "auth/wrong-password",
        "auth/user-not-found",
        "auth/invalid-email"
      ].includes(err.code || "");
      
      if (isExpectedAuthError) {
        console.warn("Expected Firebase Email Auth Issue:", err.code);
      } else {
        console.error("Firebase Email Auth Error:", err.code, err.message);
      }

      if (err.code === "auth/email-already-in-use") {
        setError("Este e-mail já está sendo utilizado.");
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("E-mail ou senha incorretos.");
      } else if (err.code === "auth/invalid-email") {
        setError("E-mail com formato inválido.");
      } else {
        setError(err.message || "Ocorreu um erro ao processar. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("AuthScreen: Starting Google Login Popup...");
      const result = await signInWithPopup(auth, googleProvider);
      console.log("AuthScreen: Google Login Success for", result.user.email);
      
      onAuthComplete({ 
        email: result.user.email || "", 
        name: result.user.displayName || "Usuário VERTUS" 
      });
    } catch (err: any) {
      const isExpectedGoogleError = [
        "auth/popup-closed-by-user",
        "auth/popup-blocked"
      ].includes(err.code || "");

      if (isExpectedGoogleError) {
        console.warn("Expected Google Auth Issue:", err.code);
      } else {
        console.error("Google Auth Error:", err.code, err.message);
      }

      if (err.code === "auth/unauthorized-domain") {
        setError(`O domínio "${window.location.hostname}" ainda não está nas configurações de domínios autorizados do seu console Firebase.`);
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("A janela de login foi fechada antes de concluir.");
      } else if (err.code === "auth/popup-blocked") {
        setError("O seu navegador bloqueou o pop-up de login. Por favor, libere pop-ups para este site.");
      } else {
        setError(`Erro de autenticação (${err?.code || "desconhecido"}): ${err?.message || "Tente novamente."}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-vertus-gray/50 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden space-y-8">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/5 blur-3xl rounded-full -ml-16 -mb-16" />

          <div className="text-center space-y-6 relative z-10">
            <div className="w-20 h-20 bg-gold/10 rounded-2xl flex items-center justify-center border border-gold/20 mx-auto">
              <ShieldCheck className="text-gold" size={40} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white uppercase tracking-tight">
                Acesso <span className="text-gold">Estratégico</span>
              </h2>
              <p className="text-white/40 text-sm font-medium leading-relaxed">
                Utilize e-mail/senha ou sua conta Google institucional para acessar nossa plataforma.
              </p>
            </div>

            {error && (
              <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-left space-y-3">
                <div className="flex gap-2 text-red-500 font-bold text-xs uppercase tracking-wider items-start">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <span>Erro de Acesso</span>
                </div>
                <p className="text-white/70 text-[11px] leading-relaxed font-medium">
                  {error}
                </p>

                {error.includes("domínio") && currentDomain && (
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <p className="text-[10px] text-gold font-bold uppercase tracking-wider">
                      Domínio atual para copiar:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 text-white/90 text-[10px] font-mono break-all flex-1">
                        {currentDomain}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopy(currentDomain)}
                        className="px-3 py-1.5 bg-gold/10 border border-gold/30 hover:bg-gold hover:text-black text-gold font-bold text-[10px] rounded-lg transition-all flex items-center gap-1 shrink-0"
                      >
                        {copiedDomain === currentDomain ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedDomain === currentDomain ? "Copiado!" : "Copiar"}</span>
                      </button>
                    </div>

                    <div className="text-[10px] text-white/50 space-y-1 pt-1 leading-normal">
                      <p className="font-semibold text-white/70">Como liberar no Console do Firebase:</p>
                      <ol className="list-decimal list-inside space-y-0.5 pl-1">
                        <li>Acesse o <strong className="text-white/80">Console Firebase</strong> &gt; seu projeto</li>
                        <li>Vá em <strong className="text-white/80">Authentication</strong> &gt; aba <strong className="text-white/80">Settings / Configurações</strong></li>
                        <li>Em <strong className="text-white/80">Domínios Autorizados</strong>, clique em <strong className="text-white/80">Adicionar Domínio</strong></li>
                        <li>Cole o domínio copiado acima e salve</li>
                      </ol>
                      <p className="pt-1 text-white/40 italic">
                        Dica: O login por E-mail e Senha abaixo funciona sem precisar autorizar domínios!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {successMsg && (
              <div className="p-4 bg-green-500/10 border border-green-500/25 rounded-2xl text-left space-y-1">
                <div className="flex gap-2 text-green-400 font-bold text-xs uppercase tracking-wider items-center">
                  <CheckCircle2 size={16} />
                  <span>{successMsg}</span>
                </div>
              </div>
            )}

            {/* Dynamic Interactive Email / Password Forms */}
            <form onSubmit={handleEmailAuth} className="text-left space-y-4 pt-2">
              {authMode === "register" && (
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest pl-1">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Camila Actos"
                      required
                      className="w-full bg-black/40 border border-white/10 hover:border-white/25 focus:border-gold outline-none rounded-2xl py-4.5 pl-12 pr-4 text-sm text-white font-medium transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] text-white/40 font-black uppercase tracking-widest pl-1">E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="empresa@grupovertus.com"
                    required
                    className="w-full bg-black/40 border border-white/10 hover:border-white/25 focus:border-gold outline-none rounded-2xl py-4.5 pl-12 pr-4 text-sm text-white font-medium transition-colors"
                  />
                </div>
              </div>

              {authMode !== "forgot-password" && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] text-white/40 font-black uppercase tracking-widest">Senha de Acesso</label>
                    {authMode === "login" && (
                      <button
                        type="button"
                        onClick={() => { setAuthMode("forgot-password"); setError(null); }}
                        className="text-[10px] text-gold/60 hover:text-gold font-bold transition-colors"
                      >
                        Esqueceu?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 caracteres"
                      required={true}
                      className="w-full bg-black/40 border border-white/10 hover:border-white/25 focus:border-gold outline-none rounded-2xl py-4.5 pl-12 pr-4 text-sm text-white font-medium transition-colors"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-4.5 bg-gold text-vertus-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-gold-light hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 mt-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-vertus-black/30 border-t-vertus-black rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {authMode === "login" ? "Entrar na Plataforma" : authMode === "register" ? "Cadastrar Minha Conta" : "Enviar E-mail de Recuperação"}
                    </span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="flex justify-center gap-6 pt-1 text-xs">
              {authMode === "login" ? (
                <p className="text-white/40 font-medium">
                  Novo por aqui?{" "}
                  <button
                    onClick={() => { setAuthMode("register"); setError(null); }}
                    className="text-gold font-bold hover:underline transition-all"
                  >
                    Crie uma conta grátis
                  </button>
                </p>
              ) : (
                <p className="text-white/40 font-medium">
                  Já possui conta?{" "}
                  <button
                    onClick={() => { setAuthMode("login"); setError(null); }}
                    className="text-gold font-bold hover:underline transition-all"
                  >
                    Faça login
                  </button>
                </p>
              )}
            </div>

            {/* Separator */}
            <div className="flex items-center my-6 z-10 relative">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="px-3 text-[9px] text-white/20 font-black uppercase tracking-widest">OU SE PREFERIR</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <div className="space-y-4">
              <button 
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="group relative w-full flex items-center justify-center gap-4 py-4 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white hover:text-vertus-black hover:scale-[1.01] active:scale-[0.99] transition-all overflow-hidden disabled:opacity-50"
              >
                <Chrome size={18} />
                <span>Entrar com Google</span>
              </button>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5">
              <button 
                onClick={onBack}
                className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white/60 transition-colors"
              >
                Voltar para a Home
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-white/10">
          <Sparkles size={14} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">VERTUS Performance</span>
        </div>
      </motion.div>
    </div>
  );
}
