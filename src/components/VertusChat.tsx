import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import { cn } from "../lib/utils";

import { DiagnosisResponse } from "../types";

interface Message {
  role: "user" | "model";
  text: string;
}

interface VertusChatProps {
  companyName?: string;
  diagnosis?: DiagnosisResponse;
}

export default function VertusChat({ companyName, diagnosis }: VertusChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "Olá! Sou a mentora estratégica da Vertus. Como posso ajudar com o seu diagnóstico financeiro hoje?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      // Retry logic for 503 errors
      let attempts = 0;
      const maxAttempts = 3;
      let lastError = null;

      while (attempts < maxAttempts) {
        try {
          const chat = ai.chats.create({
            model: "gemini-3.1-flash-lite-preview",
            config: {
              systemInstruction: `Você é a mentora estratégica do Raio-X Financeiro Vertus. 
              Seu tom é consultivo, didático, estratégico e direto. 
              Você fala como um dono de empresa experiente para outro dono de empresa brasileiro.
              Seu objetivo é educar sobre finanças (fluxo de caixa, DRE, precificação, lucro) e mostrar como a Vertus resolve esses problemas.
              Sempre sugira ações práticas e explique o "porquê" técnico por trás dos problemas financeiros.
              Use Markdown para formatar suas respostas.
              ${companyName ? `A empresa que você está analisando é a ${companyName}.` : ""}
              ${diagnosis ? `Dados do Diagnóstico:
              - Score Geral: ${diagnosis.score}/100
              - Classificação: ${diagnosis.classification}
              - Hemorragia Mensal: R$ ${diagnosis.monthlyLoss}
              - Dimensões: ${JSON.stringify(diagnosis.dimensions)}` : ""}`,
            },
          });

          const response = await chat.sendMessage({ message: userMsg });
          setMessages(prev => [...prev, { role: "model", text: response.text || "Desculpe, tive um problema ao processar sua dúvida." }]);
          return; // Success!
        } catch (err: any) {
          lastError = err;
          if (err.message?.includes("503") || err.message?.includes("high demand")) {
            attempts++;
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 2000 * attempts)); // Exponential backoff
              continue;
            }
          }
          throw err; // Not a 503 or max attempts reached
        }
      }
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setMessages(prev => [...prev, { role: "model", text: "Estou com dificuldades técnicas no momento devido à alta demanda nos servidores da IA. Por favor, tente novamente em alguns segundos." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[400px]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border",
              msg.role === "user" ? "bg-white/5 border-white/10" : "bg-gold/10 border-gold/20"
            )}>
              {msg.role === "user" ? <User size={14} className="text-white/40" /> : <Bot size={14} className="text-gold" />}
            </div>
            <div className={cn(
              "max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed",
              msg.role === "user" ? "bg-white/5 text-white/80 rounded-tr-none" : "bg-gold/5 text-white/90 rounded-tl-none border border-white/5"
            )}>
              <div className="prose prose-invert prose-sm prose-gold max-w-none text-[11px]">
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
            <div className="bg-gold/5 border border-white/5 p-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-gold rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1 h-1 bg-gold rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-white/[0.01]">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Tire sua dúvida financeira..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-xs text-white placeholder:text-white/20 focus:border-gold outline-none transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gold text-vertus-black rounded-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export const VixChat = VertusChat;
