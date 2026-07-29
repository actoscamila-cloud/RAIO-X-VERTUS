import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, X, Bot, User, Sparkles, Lock } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import { cn } from "../lib/utils";
import { storage } from "../lib/storage";

interface Message {
  role: "user" | "model";
  text: string;
}

interface VertusAssistantProps {
  isLocked?: boolean;
  onNavigateToTraining?: () => void;
  inline?: boolean;
}

export default function VertusAssistant({ isLocked, onNavigateToTraining, inline }: VertusAssistantProps) {
  const [isOpen, setIsOpen] = useState(inline || false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "Olá! Sou a mentora estratégica da Vertus. Como posso ajudar com o seu diagnóstico financeiro hoje?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inline) setIsOpen(true);
  }, [inline]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      const settings = await storage.getSettings();
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey || apiKey === "undefined" || apiKey === "") {
        throw new Error("GEMINI_API_KEY is missing");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Retry logic for 503 errors
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          const chat = ai.chats.create({
            model: "gemini-3.1-flash-lite-preview",
            config: {
              systemInstruction: `
                ${settings.aiPrompt}
                
                CONTEÚDO BASE VERTUS:
                ${settings.financialContent}
                
                DIRETRIZES ESTRATÉGICAS:
                ${settings.strategicGuidelines}
              `,
            },
          });

          const response = await chat.sendMessage({ message: userMsg });
          setMessages(prev => [...prev, { role: "model", text: response.text || "Desculpe, tive um problema ao processar sua dúvida." }]);
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
    } catch (error: any) {
      console.error("AI Assistant Error:", error);
      let errorMsg = "Estou com dificuldades técnicas no momento devido à alta demanda nos servidores da IA. Por favor, tente novamente em alguns segundos.";
      
      if (error.message === "GEMINI_API_KEY is missing") {
        errorMsg = "A chave da API (GEMINI_API_KEY) não foi configurada. Por favor, verifique se a variável de ambiente está definida corretamente no Railway.";
      } else if (error.message?.includes("API_KEY_INVALID")) {
        errorMsg = "A chave da API configurada é inválida. Por favor, verifique sua GEMINI_API_KEY.";
      }
      
      setMessages(prev => [...prev, { role: "model", text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const chatContent = (
    <div className={cn(
      "bg-vertus-gray border border-white/10 rounded-2xl shadow-xl flex flex-col overflow-hidden",
      inline ? "w-full h-[420px] sm:h-[450px]" : "absolute bottom-20 right-0 w-[360px] h-[500px]"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-gold/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20 shadow-md shadow-gold/10 shrink-0">
            <Sparkles className="text-gold" size={20} />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-tight">Mentora Vertus</h4>
            <span className="text-[9px] text-gold font-black uppercase tracking-widest block">IA Estratégica em Tempo Real</span>
          </div>
        </div>
        {!inline && (
          <button onClick={() => setIsOpen(false)} className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-white transition-all">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth relative custom-scrollbar">
        {isLocked && (
          <div className="absolute inset-0 z-10 bg-vertus-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center border border-gold/20 shadow-xl shadow-gold/10">
              <Lock className="text-gold" size={28} />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-white uppercase tracking-tight">Acesso <span className="text-gold">Bloqueado</span></h4>
              <p className="text-white/50 text-xs leading-relaxed font-medium max-w-xs">
                Sua Mentora Financeira Vertus será liberada assim que você concluir os 3 módulos de treinamento obrigatórios.
              </p>
            </div>
            <button 
              onClick={() => {
                if (!inline) setIsOpen(false);
                onNavigateToTraining?.();
              }}
              className="px-6 py-2.5 bg-gradient-to-br from-gold to-gold-dark text-vertus-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-102 transition-all shadow-lg shadow-gold/20"
            >
              Ir para o Treinamento
            </button>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border shadow-md",
              msg.role === "user" ? "bg-white/5 border-white/10" : "bg-gold/10 border-gold/20"
            )}>
              {msg.role === "user" ? <User size={14} className="text-white/40" /> : <Bot size={14} className="text-gold" />}
            </div>
            <div className={cn(
              "max-w-[85%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed font-medium shadow-lg",
              msg.role === "user" ? "bg-white/5 text-white/80 rounded-tr-none border border-white/5" : "bg-gold/5 text-white/90 rounded-tl-none border border-gold/10"
            )}>
              <div className="prose prose-invert prose-xs sm:prose-sm prose-gold max-w-none">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center animate-pulse">
              <Bot size={14} className="text-gold" />
            </div>
            <div className="bg-gold/5 border border-gold/10 p-3.5 rounded-2xl rounded-tl-none">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3.5 sm:p-4 border-t border-white/5 bg-vertus-black/50 backdrop-blur-md">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Tire sua dúvida financeira estratégica..."
            className="w-full bg-vertus-black border border-white/10 rounded-xl pl-4 pr-12 py-3 text-xs sm:text-sm text-white placeholder:text-white/20 focus:border-gold/50 focus:ring-2 focus:ring-gold/10 outline-none transition-all font-medium shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-br from-gold to-gold-dark text-vertus-black rounded-lg hover:scale-102 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-md shadow-gold/20"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  if (inline) return chatContent;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            {chatContent}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all border",
          isOpen ? "bg-white/5 border-white/10 text-white/40" : "bg-gold border-gold-dark text-vertus-black"
        )}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </motion.button>
    </div>
  );
}

export const VixAssistant = VertusAssistant;
