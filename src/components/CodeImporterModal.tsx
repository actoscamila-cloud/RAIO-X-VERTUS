import React, { useState } from 'react';
import { VertusConfig, CompanyInfo, QuantitativeData } from '../types';
import { X, Code, Upload, Check, AlertCircle } from 'lucide-react';

interface CodeImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: VertusConfig;
  setConfig: React.Dispatch<React.SetStateAction<VertusConfig>>;
  setCompany: React.Dispatch<React.SetStateAction<CompanyInfo>>;
  setQuant: React.Dispatch<React.SetStateAction<QuantitativeData>>;
}

export const CodeImporterModal: React.FC<CodeImporterModalProps> = ({
  isOpen,
  onClose,
  config,
  setConfig,
  setCompany,
  setQuant,
}) => {
  const [pastedCode, setPastedCode] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleProcessCode = () => {
    setStatusMessage(null);
    if (!pastedCode.trim()) {
      setStatusMessage({ type: 'error', text: 'Por favor, cole o código ou JSON antes de importar.' });
      return;
    }

    try {
      // 1. Try to parse as JSON first
      const parsed = JSON.parse(pastedCode);

      if (parsed.companyName || parsed.whatsappNumber || parsed.whatsapp) {
        setConfig((prev) => ({
          ...prev,
          companyName: parsed.companyName || prev.companyName,
          whatsappNumber: parsed.whatsappNumber || parsed.whatsapp || prev.whatsappNumber,
          consultantName: parsed.consultantName || prev.consultantName,
          consultantEmail: parsed.consultantEmail || prev.consultantEmail,
        }));
      }

      if (parsed.company) {
        setCompany((prev) => ({ ...prev, ...parsed.company }));
      }

      if (parsed.quant || parsed.financials) {
        setQuant((prev) => ({ ...prev, ...(parsed.quant || parsed.financials) }));
      }

      setStatusMessage({
        type: 'success',
        text: 'Estrutura JSON importada com sucesso e aplicada ao Diagnóstico Vertus!',
      });
    } catch {
      // 2. Fallback regex analysis for code string (React/JS/HTML)
      let countExtracted = 0;

      // Extract phone / whatsapp
      const phoneMatch = pastedCode.match(/(?:whatsapp|telefone|phone|celular)["']?\s*[:=]\s*["']?(\+?55\d{10,11}|\d{10,11})["']?/i);
      if (phoneMatch && phoneMatch[1]) {
        setConfig((prev) => ({ ...prev, whatsappNumber: phoneMatch[1].replace(/\D/g, '') }));
        countExtracted++;
      }

      // Extract company name
      const nameMatch = pastedCode.match(/(?:companyName|nomeEmpresa|empresa|razaoSocial)["']?\s*[:=]\s*["']([^"']+)["']/i);
      if (nameMatch && nameMatch[1]) {
        setCompany((prev) => ({ ...prev, name: nameMatch[1] }));
        countExtracted++;
      }

      // Extract monthly revenue
      const revenueMatch = pastedCode.match(/(?:monthlyRevenue|faturamento|receita|faturamentoMensal)["']?\s*[:=]\s*["']?(\d+)/i);
      if (revenueMatch && revenueMatch[1]) {
        setQuant((prev) => ({ ...prev, monthlyRevenue: parseFloat(revenueMatch[1]) }));
        countExtracted++;
      }

      if (countExtracted > 0) {
        setStatusMessage({
          type: 'success',
          text: `Análise de código concluída! ${countExtracted} variáveis (empresa, whatsapp, faturamento) foram identificadas e atualizadas no sistema.`,
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: 'Não foi possível extrair dados estruturados automaticamente deste código. Tente colar um arquivo JSON ou ajustar as variáveis manualmente no painel Vertus.',
        });
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setPastedCode(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Code className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base">Importador de Código / JSON do Sistema Anterior</h3>
              <p className="text-xs text-slate-400">Cole o código do seu projeto antigo para adaptarmos à Vertus</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs text-slate-600 leading-relaxed">
            💡 <strong>Instruções:</strong> Você pode colar qualquer trecho de código (React, TypeScript, JSON) contendo dados de empresas, telefones de WhatsApp, ou perguntas de diagnósticos. O sistema da Vertus vai analisar o conteúdo e mapear as informações.
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Cole o código ou JSON aqui:</label>
              <label className="cursor-pointer text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                Carregar Arquivo (.js/.ts/.json)
                <input type="file" accept=".js,.ts,.tsx,.jsx,.json,.txt" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            <textarea
              rows={8}
              value={pastedCode}
              onChange={(e) => setPastedCode(e.target.value)}
              placeholder={`// Exemplo de código ou JSON antigo:\n{\n  "companyName": "Vertus Consultoria",\n  "whatsappNumber": "5511999998888",\n  "faturamento": 180000\n}`}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 focus:outline-none font-mono text-xs text-slate-800 bg-slate-900 text-slate-100"
            />
          </div>

          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Fechar
          </button>
          <button
            onClick={handleProcessCode}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2 rounded-xl text-xs shadow transition-all"
          >
            Analisar e Mapear para Vertus
          </button>
        </div>
      </div>
    </div>
  );
};
