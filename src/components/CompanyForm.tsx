import React from 'react';
import { CompanyInfo, QuantitativeData } from '../types';
import { Building2, DollarSign, Calculator, UserCheck, ArrowRight } from 'lucide-react';

interface CompanyFormProps {
  company: CompanyInfo;
  setCompany: React.Dispatch<React.SetStateAction<CompanyInfo>>;
  quant: QuantitativeData;
  setQuant: React.Dispatch<React.SetStateAction<QuantitativeData>>;
  onNext: () => void;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({
  company,
  setCompany,
  quant,
  setQuant,
  onNext,
}) => {
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuant((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-teal-900/50 shadow-lg">
        <div className="max-w-3xl">
          <span className="inline-block bg-teal-500/20 text-teal-300 text-xs px-3 py-1 rounded-full border border-teal-500/30 font-semibold mb-3">
            Etapa 1 de 3: Perfil & Números Base
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Diagnóstico Financeiro Empresarial Vertus
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Preencha os dados da sua empresa e os valores financeiros médios mensais para calcularmos indicadores de margem, ponto de equilíbrio e fôlego de caixa antes da avaliação dos pilares.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Company Identification */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Identificação da Empresa</h2>
              <p className="text-xs text-slate-500">Dados cadastrais básicos para personalizar o relatório Vertus</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Nome da Empresa / Razão Social *
              </label>
              <input
                type="text"
                name="name"
                value={company.name}
                onChange={handleCompanyChange}
                placeholder="Ex: Vertus Soluções Empresariais"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  CNPJ (opcional)
                </label>
                <input
                  type="text"
                  name="cnpj"
                  value={company.cnpj}
                  onChange={handleCompanyChange}
                  placeholder="00.000.000/0001-00"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Porte da Empresa
                </label>
                <select
                  name="size"
                  value={company.size}
                  onChange={handleCompanyChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-sm bg-white"
                >
                  <option value="Micro">Microempresa (até R$ 360k/ano)</option>
                  <option value="Pequena">Pequena Empresa (até R$ 4,8M/ano)</option>
                  <option value="Média">Média Empresa (até R$ 300M/ano)</option>
                  <option value="Grande">Grande Empresa</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Setor / Ramo de Atuação
                </label>
                <input
                  type="text"
                  name="sector"
                  value={company.sector}
                  onChange={handleCompanyChange}
                  placeholder="Ex: Serviços, Comércio, Indústria, TI"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Cidade / Estado
                </label>
                <input
                  type="text"
                  name="cityState"
                  value={company.cityState}
                  onChange={handleCompanyChange}
                  placeholder="São Paulo - SP"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs mb-3">
                <UserCheck className="w-4 h-4 text-teal-600" />
                Contato do Gestor / Sócio
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Nome do Gestor</label>
                  <input
                    type="text"
                    name="contactName"
                    value={company.contactName}
                    onChange={handleCompanyChange}
                    placeholder="Carlos Silva"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    value={company.email}
                    onChange={handleCompanyChange}
                    placeholder="carlos@empresa.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">WhatsApp de Contato</label>
                  <input
                    type="text"
                    name="phone"
                    value={company.phone}
                    onChange={handleCompanyChange}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quantitative Financial Metrics */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Números Financeiros Médios Mensais</h2>
                <p className="text-xs text-slate-500">Valores em Reais (R$) praticados nos últimos 3 a 6 meses</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Faturamento Mensal Médio (R$)
                </label>
                <input
                  type="number"
                  name="monthlyRevenue"
                  value={quant.monthlyRevenue || ''}
                  onChange={handleQuantChange}
                  placeholder="150000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Custos e Despesas Variáveis (R$)
                </label>
                <input
                  type="number"
                  name="variableCosts"
                  value={quant.variableCosts || ''}
                  onChange={handleQuantChange}
                  placeholder="60000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono text-sm"
                />
                <span className="text-[11px] text-slate-400">Insumos, impostos diretos, comissões</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Custos e Despesas Fixas (R$)
                </label>
                <input
                  type="number"
                  name="fixedCosts"
                  value={quant.fixedCosts || ''}
                  onChange={handleQuantChange}
                  placeholder="50000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono text-sm"
                />
                <span className="text-[11px] text-slate-400">Folha de pagto, aluguel, software, pro-labore</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Reserva / Caixa Livre Atual (R$)
                </label>
                <input
                  type="number"
                  name="cashReserve"
                  value={quant.cashReserve || ''}
                  onChange={handleQuantChange}
                  placeholder="100000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono text-sm"
                />
                <span className="text-[11px] text-slate-400">Saldo acumulado em contas/aplicações</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Total de Dívidas / Empréstimos (R$)
                </label>
                <input
                  type="number"
                  name="totalDebt"
                  value={quant.totalDebt || ''}
                  onChange={handleQuantChange}
                  placeholder="80000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">A Receber 30d</label>
                  <input
                    type="number"
                    name="accountsReceivable30d"
                    value={quant.accountsReceivable30d || ''}
                    onChange={handleQuantChange}
                    placeholder="40000"
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">A Pagar 30d</label>
                  <input
                    type="number"
                    name="accountsPayable30d"
                    value={quant.accountsPayable30d || ''}
                    onChange={handleQuantChange}
                    placeholder="35000"
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calculator className="w-4 h-4 text-teal-600" />
              <span>Cálculos automáticos de Margem Bruta e Ponto de Equilíbrio na próxima etapa.</span>
            </div>

            <button
              onClick={onNext}
              className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md transition-all text-sm"
            >
              Ir para os Pilares
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
