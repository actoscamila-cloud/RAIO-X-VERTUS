import React, { useState } from 'react';
import { VertusConfig } from '../types';
import { X, Save, MessageSquare, Building, Mail, RefreshCw } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: VertusConfig;
  setConfig: React.Dispatch<React.SetStateAction<VertusConfig>>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  setConfig,
}) => {
  const [formData, setFormData] = useState<VertusConfig>({ ...config });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setConfig(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Building className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="font-bold text-base">Personalizar Dados da Vertus</h3>
              <p className="text-xs text-slate-400">Ajuste o nome, número do WhatsApp e modelos de mensagem</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nome da Consultoria / Empresa</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Número do WhatsApp (com DDD)</label>
              <div className="relative">
                <input
                  type="text"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  placeholder="5511999998888"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 focus:outline-none font-mono"
                />
                <MessageSquare className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
              </div>
              <span className="text-[11px] text-slate-400">Incluir 55 + DDD + Número</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nome do Consultor Responsável</label>
              <input
                type="text"
                name="consultantName"
                value={formData.consultantName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">E-mail de Contato da Vertus</label>
            <div className="relative">
              <input
                type="email"
                name="consultantEmail"
                value={formData.consultantEmail}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Modelo de Mensagem Enviada no WhatsApp</label>
            <textarea
              name="whatsappMessageTemplate"
              rows={4}
              value={formData.whatsappMessageTemplate}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 focus:outline-none font-mono text-xs"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Variáveis disponíveis: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">{'{company_name}'}</code> e <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">{'{score}'}</code>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold px-5 py-2 rounded-xl text-xs shadow transition-all"
          >
            <Save className="w-4 h-4" />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};
