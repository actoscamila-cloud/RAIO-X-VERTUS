import { DiagnosticPillar, DiagnosticQuestion, VertusConfig } from '../types';

export const DEFAULT_VERTUS_CONFIG: VertusConfig = {
  companyName: 'Vertus Consultoria Financeira',
  whatsappNumber: '5543991197319',
  whatsappMessageTemplate: 'Olá, Vertus! Realizei o diagnóstico financeiro da minha empresa {company_name} no sistema e obtive uma nota geral de {score}%. Gostaria de agendar uma consultoria para analisar os resultados.',
  consultantName: 'Equipe de Gestão Vertus',
  consultantEmail: 'contato@vertusconsultoria.com.br',
  website: 'https://vertusconsultoria.com.br',
  primaryColor: '#0f766e', // Teal 700
  enableGeminiAI: true,
};

export const DIAGNOSTIC_PILLARS: DiagnosticPillar[] = [
  {
    id: 'fluxo_caixa',
    title: 'Gestão de Fluxo de Caixa',
    description: 'Controle diário de entradas, saídas, conciliação e projeções de caixa.',
    iconName: 'Wallet',
    weight: 0.25,
  },
  {
    id: 'lucratividade',
    title: 'Margens e DRE',
    description: 'Acompanhamento do resultado operacional, margem de contribuição e ponto de equilíbrio.',
    iconName: 'TrendingUp',
    weight: 0.25,
  },
  {
    id: 'endividamento',
    title: 'Estrutura de Capital e Dívidas',
    description: 'Nível de endividamento, perfil de vencimentos e custo médio de capital.',
    iconName: 'ShieldAlert',
    weight: 0.20,
  },
  {
    id: 'orcamento',
    title: 'Planejamento e Orçamento',
    description: 'Existência de metas financeiras, orçamento anual e controle de desvios.',
    iconName: 'PieChart',
    weight: 0.15,
  },
  {
    id: 'governanca',
    title: 'Processos e Governança',
    description: 'Uso de ERP/sistemas, separação das contas físicas/jurídicas e rotinas de auditoria.',
    iconName: 'Sliders',
    weight: 0.15,
  },
];

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  // Fluxo de Caixa
  {
    id: 'q_caixa_1',
    pillarId: 'fluxo_caixa',
    question: 'Como é feito o registro e controle das movimentações de caixa na empresa?',
    description: 'Avalia a frequência e a ferramentas utilizadas no controle financeiro diário.',
    options: [
      { label: 'Não há registro formal ou é feito esporadicamente em papel.', value: 2, recommendation: 'Implementar planilha de fluxo de caixa ou sistema ERP para registro diário.' },
      { label: 'Registros em planilhas simples com atualização semanal.', value: 5, recommendation: 'Automatizar registros diários com conciliação bancária.' },
      { label: 'Fluxo de caixa diário conciliado em sistema com projeções para 30+ dias.', value: 8, recommendation: 'Manter a consistência e estender a projeção para 90 dias.' },
      { label: 'Projeção contínua de caixa de 90 dias integrada com conciliação automática.', value: 10, recommendation: 'Excelente prática. Revisar cenários otimistas e pessimistas regularmente.' },
    ],
  },
  {
    id: 'q_caixa_2',
    pillarId: 'fluxo_caixa',
    question: 'A empresa possui reserva de emergência/capital de giro para cobrir custos fixos?',
    description: 'Mede a segurança da empresa contra oscilações de faturamento.',
    options: [
      { label: 'Sem reserva; caixa zerado ou dependente de cheque especial.', value: 1, recommendation: 'Prioridade máxima: constituir reserva imediata de ao menos 1 mês de custos fixos.' },
      { label: 'Reserva suficiente para cobrir até 1 mês de custos fixos.', value: 4, recommendation: 'Aumentar a reserva gradualmente até atingir 3 a 6 meses de liquidez.' },
      { label: 'Reserva suficiente para 2 a 4 meses de operação.', value: 7, recommendation: 'Boa reserva. Avaliar otimização de rendimentos de curto prazo.' },
      { label: 'Reserva confortável de 6 ou mais meses de custos fixos em aplicações líquidas.', value: 10, recommendation: 'Nível excelente de liquidez e segurança financeira.' },
    ],
  },

  // Margens e DRE
  {
    id: 'q_lucro_1',
    pillarId: 'lucratividade',
    question: 'A empresa elabora a Demonstrativo do Resultado do Exercício (DRE) gerencial mensalmente?',
    description: 'Avalia se os gestores enxergam a real lucratividade operacional.',
    options: [
      { label: 'Não sabe se a empresa teve lucro ou prejuízo no mês.', value: 1, recommendation: 'Estruturar o DRE Gerencial separando receita, custos variáveis e fixos.' },
      { label: 'Calcula o resultado apenas pelo saldo do extrato bancário (Regime de Caixa).', value: 4, recommendation: 'Adotar o DRE em Regime de Competência para visão real de rentabilidade.' },
      { label: 'DRE elaborado mensalmente com acompanhamento de margem bruta e líquida.', value: 8, recommendation: 'Detalhar margens por linha de produto/serviço.' },
      { label: 'DRE detalhado por centro de custo, produto e margem de contribuição com análise histórica.', value: 10, recommendation: 'Análise madura. Usar dados para precificação estratégica.' },
    ],
  },
  {
    id: 'q_lucro_2',
    pillarId: 'lucratividade',
    question: 'Como é formulado o preço de venda dos produtos ou serviços?',
    description: 'Verifica a precisão no cálculo de custos e margens no preço praticado.',
    options: [
      { label: 'Baseado apenas no preço da concorrência ou intuição.', value: 2, recommendation: 'Calcular o Markup técnico e validar margem de contribuição real.' },
      { label: 'Aplica uma porcentagem fixa sobre o custo direto (Markup simples).', value: 5, recommendation: 'Incluir impostos, despesas variáveis e rateio de custos fixos no preço.' },
      { label: 'Precificação baseada em custos diretos, indiretos, tributos e margem desejada.', value: 8, recommendation: 'Realizar simulações periódicas de elasticidade de preço.' },
      { label: 'Precificação científica com margem de contribuição por canal e teste de elasticidade.', value: 10, recommendation: 'Excelente precificação estratégica.' },
    ],
  },

  // Endividamento
  {
    id: 'q_divida_1',
    pillarId: 'endividamento',
    question: 'Qual o peso atual das parcelas de empréstimos e financiamentos no faturamento?',
    description: 'Indica se o faturamento está comprometido com pagamentos financeiros.',
    options: [
      { label: 'Mais de 30% do faturamento bruto está comprometido com dívidas.', value: 2, recommendation: 'Ação urgente: renegociar prazos e taxas ou estruturar alongamento de dívida.' },
      { label: 'Entre 15% e 30% do faturamento bruto comprometido.', value: 5, recommendation: 'Monitorar custo do capital e buscar amortização prioritária dos juros altos.' },
      { label: 'Entre 5% e 15% do faturamento bruto comprometido.', value: 8, recommendation: 'Endividamento saudável e sob controle.' },
      { label: 'Sem dívidas onerosas ou menos de 5% do faturamento em financiamentos.', value: 10, recommendation: 'Excelente saúde financeira e baixa alavancagem risco.' },
    ],
  },

  // Orçamento
  {
    id: 'q_orc_1',
    pillarId: 'orcamento',
    question: 'A empresa possui um Orçamento Anual aprovado com metas financeiras claras?',
    description: 'Avalia a previsibilidade estratégica do negócio.',
    options: [
      { label: 'Sem planejamento financeiro prévio; gestão 100% reativa.', value: 2, recommendation: 'Criar o primeiro orçamento anual simplificado para despesas fixas.' },
      { label: 'Possui metas informais, mas não compara o Previsto x Realizado.', value: 5, recommendation: 'Formalizar o acompanhamento mensal de variação orçamentária.' },
      { label: 'Orçamento anual construído e comparado mensalmente.', value: 8, recommendation: 'Ajustar projeções trimestrais (Forecast contínuo).' },
      { label: 'Orçamento matricial com acompanhamento de KPIs de desempenho em tempo real.', value: 10, recommendation: 'Prática de governança avançada.' },
    ],
  },

  // Governança e Processos
  {
    id: 'q_gov_1',
    pillarId: 'governanca',
    question: 'Houve a separação total entre as contas pessoais dos sócios e as contas da empresa?',
    description: 'Verifica a disciplina financeira e conformidade da entidade.',
    options: [
      { label: 'Mistura constante: despesas pessoais dos sócios são pagas na conta da empresa.', value: 1, recommendation: 'Urgente: fixar Pro-labore definido para os sócios e zerar retiradas informais.' },
      { label: 'Ocorre com pouca frequência, registrado como adiantamento de lucros.', value: 5, recommendation: 'Eliminar pagamentos pessoais pelo caixa da empresa.' },
      { label: 'Totalmente separadas; sócios recebem Pro-labore fixo e distribuição formal.', value: 10, recommendation: 'Excelente maturidade societária e fiscal.' },
    ],
  },
];
