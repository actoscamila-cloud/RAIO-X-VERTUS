import { Question, Block, ActionMovement } from "./types";

export const VERTUS_WHATSAPP_LINK = "https://wa.me/5543991197319";
export const VIX_WHATSAPP_LINK = VERTUS_WHATSAPP_LINK;

export const ADMIN_EMAILS = [
  "actosmentoria@gmail.com",
  "vertus.sfinancas@gmail.com",
  "vix.sfinancas@gmail.com",
  "actoscamila@gmail.com"
];

export const BLOCKS: Block[] = [
  { id: 1, title: "Visibilidade e Controle", insight: "⚠️ O 'vôo cego' financeiro é a causa nº 1 de quebra de PMEs no Brasil. Sem prever o caixa em 90 dias, você não governa sua empresa, apenas reage a ela." },
  { id: 2, title: "Margem e Equilíbrio", insight: "⚠️ Faturamento é vaidade, lucro é sanidade, mas caixa é realidade. Vender sem conhecer sua margem real é acelerar o fim da sua operação." },
  { id: 3, title: "Saúde e Previsibilidade", insight: "⚠️ O problema que te tira o sono hoje não é a falta de dinheiro, é a falta de um processo financeiro que gere previsibilidade e segurança." },
];

export const QUESTIONS: Question[] = [
  // Bloco 1
  { 
    id: "q2", block: 1, text: "Com que frequência você atualiza o controle financeiro?", type: "select",
    options: [
      { label: "Diário", value: 100 },
      { label: "Semanal", value: 60 },
      { label: "Mensal", value: 30 },
      { label: "Raramente/Nunca", value: 0 }
    ],
    dimension: "controle", weight: 1.0
  },
  { 
    id: "q3", block: 1, text: "Você sabe exatamente quanto terá em caixa nos próximos 30/60/90 dias?", type: "select",
    options: [
      { label: "Sim, com precisão", value: 100 },
      { label: "Apenas os próximos 30 dias", value: 50 },
      { label: "Não tenho essa visão", value: 0 }
    ],
    dimension: "previsibilidade", weight: 1.5
  },
  // Bloco 2
  { 
    id: "q4", block: 2, text: "Suas contas pessoais e da empresa estão 100% separadas?", type: "select",
    options: [
      { label: "Sim, totalmente", value: 100 },
      { label: "Misturo algumas coisas", value: 30 },
      { label: "Não, é tudo junto", value: 0 }
    ],
    dimension: "processos", weight: 1.0
  },
  { 
    id: "q5", block: 2, text: "Sua precificação considera todos os custos reais + margem mínima desejada?", type: "select",
    options: [
      { label: "Sim, uso método técnico", value: 100 },
      { label: "Baseio-me no mercado", value: 40 },
      { label: "Não tenho certeza dos custos", value: 0 }
    ],
    dimension: "precificacao", weight: 1.5
  },
  { 
    id: "q6", block: 2, text: "Você conhece o ponto de equilíbrio mensal da empresa?", type: "select",
    options: [
      { label: "Sei o valor exato", value: 100 },
      { label: "Tenho uma ideia aproximada", value: 40 },
      { label: "Não sei", value: 0 }
    ],
    dimension: "custosRentabilidade", weight: 1.0
  },
  // Bloco 3
  { 
    id: "q7", block: 3, text: "Qual % aproximado da receita vira lucro líquido real?", type: "select",
    options: [
      { label: "Mais de 20%", value: 100 },
      { label: "10% a 20%", value: 70 },
      { label: "5% a 10%", value: 40 },
      { label: "Menos de 5%", value: 10 },
      { label: "Não sei/Prejuízo", value: 0 }
    ],
    dimension: "custosRentabilidade", weight: 1.5
  },
  { 
    id: "q8", block: 3, text: "Você tem DRE atualizado e confiável?", type: "select",
    options: [
      { label: "Sim, mensalmente", value: 100 },
      { label: "O contador manda", value: 30 },
      { label: "Não possuo", value: 0 }
    ],
    dimension: "fluxoCaixa", weight: 1.0
  },
  { 
    id: "q9", block: 3, text: "Qual o maior problema financeiro que mais te tira o sono hoje?", type: "select",
    options: [
      { label: "Caixa imprevisível", value: "caixa" },
      { label: "Precificação errada", value: "preco" },
      { label: "Custos fora de controle", value: "custos" },
      { label: "Falta de previsibilidade", value: "previsibilidade" },
      { label: "Dívidas/Antecipações", value: "dividas" },
      { label: "Outro", value: "outro" }
    ],
    dimension: "none", weight: 0
  }
];

export const REVENUE_OPTIONS = [
  "Até R$ 50k",
  "R$ 50k - 100k",
  "R$ 100k - 200k",
  "Até R$ 500k",
  "Acima de R$ 500k",
];

export const EMPLOYEE_OPTIONS = [
  "1 - 5",
  "6 - 15",
  "16 - 50",
  "Acima de 50",
];

export const SEGMENTS = [
  "Varejo",
  "Serviços",
  "Indústria",
  "Saúde",
  "Tecnologia",
  "Outros",
];

export const TRAINING_MODULES = [
  {
    id: "m1",
    title: "Módulo 1 – Fluxo de Caixa Básico",
    content: "Fluxo de caixa não é só olhar o saldo do banco. É prever entradas e saídas diárias. Erro nº 1 das PMEs: misturar PF/PJ e não atualizar diariamente. Resultado: você acha que tem lucro, mas o caixa some.",
    example: "Uma loja de roupas que vende R$ 50k/mês, mas paga fornecedores à vista e recebe parcelado em 10x sem antecipação. O lucro existe no papel, mas o caixa quebra em 3 meses.",
    quiz: [
      {
        question: "Qual o erro nº 1 das PMEs brasileiras no fluxo de caixa?",
        options: ["Vender pouco", "Misturar PF/PJ e não atualizar diariamente", "Pagar impostos em dia"],
        correctIndex: 1
      },
      {
        question: "O que acontece quando você tem lucro no papel mas não tem caixa?",
        options: ["A empresa cresce mais rápido", "A empresa pode quebrar por falta de liquidez", "Não faz diferença"],
        correctIndex: 1
      }
    ],
    completed: false
  },
  {
    id: "m2",
    title: "Módulo 2 – Precificação Estratégica",
    content: "Precificar errado é o erro mais caro. Inclua todos os custos (fixos + variáveis + impostos + margem mínima). Sem ponto de equilíbrio você trabalha para pagar contas.",
    example: "Um restaurante que precifica o prato baseado no vizinho, sem considerar que o aluguel dele é 3x maior. Ele vende muito, mas cada prato vendido gera um prejuízo de R$ 2,00.",
    quiz: [
      {
        question: "O que deve ser considerado na precificação correta?",
        options: ["Apenas o preço do concorrente", "Custos fixos, variáveis, impostos e margem mínima", "Apenas o custo do produto"],
        correctIndex: 1
      },
      {
        question: "O que é o ponto de equilíbrio?",
        options: ["Quando o faturamento é igual ao lucro", "Quanto você precisa faturar para cobrir todos os custos", "O saldo final do banco"],
        correctIndex: 1
      }
    ],
    completed: false
  },
  {
    id: "m3",
    title: "Módulo 3 – Previsibilidade de Lucro",
    content: "Sem DRE real e projeção de caixa você toma decisões no escuro. Previsibilidade = segurança para crescer sem quebrar.",
    example: "Uma empresa de serviços que decide contratar 3 novos funcionários porque o saldo do banco está alto hoje, sem projetar que nos próximos 2 meses terá uma queda sazonal de 40% na receita.",
    quiz: [
      {
        question: "Para que serve o DRE atualizado?",
        options: ["Para pagar menos impostos", "Para tomar decisões baseadas em dados reais de lucro", "Para mostrar ao banco"],
        correctIndex: 1
      },
      {
        question: "O que gera segurança para crescer sem quebrar?",
        options: ["Faturar o dobro", "Previsibilidade e projeção de caixa", "Ter muitos funcionários"],
        correctIndex: 1
      }
    ],
    completed: false
  }
];

export const ACTION_MOVEMENTS: ActionMovement[] = [
  {
    id: "Movimento 1",
    title: "Saneamento e Separação",
    description: "Separar 100% das contas PF e PJ, listar todas as dívidas e taxas de antecipação, e implementar conciliação bancária diária.",
    objective: "Eliminar a confusão patrimonial e ter clareza real do saldo operacional.",
    steps: [
      "Abrir conta PJ separada (se ainda não tiver)",
      "Listar todas as despesas pessoais pagas pela empresa",
      "Definir um pró-labore fixo para os sócios",
      "Implementar rotina de conciliação bancária diária (15 min/dia)"
    ],
    expectedResult: "Redução imediata de 15% em gastos 'invisíveis' e clareza total do caixa."
  },
  {
    id: "Movimento 2",
    title: "Mapeamento de Margem",
    description: "Recalcular precificação dos 5 principais produtos/serviços, identificar o ponto de equilíbrio real e cortar 10% de custos fixos não estratégicos.",
    objective: "Garantir que cada venda gere lucro real e não apenas faturamento.",
    steps: [
      "Identificar os 5 produtos/serviços que mais faturam",
      "Calcular a Margem de Contribuição real de cada um",
      "Identificar o Ponto de Equilíbrio (Break-even) mensal",
      "Revisar contratos de custos fixos (aluguel, sistemas, serviços)"
    ],
    expectedResult: "Aumento médio de 8% na margem líquida global da operação."
  },
  {
    id: "Movimento 3",
    title: "Estruturação de Processos",
    description: "Criar rotina de fechamento semanal, montar o primeiro DRE gerencial e definir metas de lucro por segmento.",
    objective: "Sair do operacional e começar a gerir a empresa por indicadores.",
    steps: [
      "Estabelecer reunião de fechamento toda sexta-feira",
      "Classificar todas as saídas por categorias (Custos, Despesas, Investimentos)",
      "Montar o DRE (Demonstrativo de Resultados) do último mês",
      "Definir meta de lucro líquido desejada (ex: 20%)"
    ],
    expectedResult: "Domínio total dos números e fim da sensação de 'trabalhar e não ver a cor do dinheiro'."
  },
  {
    id: "Movimento 4",
    title: "Previsibilidade e Expansão",
    description: "Projetar fluxo de caixa para os próximos 90 dias, definir política de antecipação de recebíveis e agendar consultoria de diagnóstico profundo Vertus.",
    objective: "Antecipar problemas de caixa antes que eles aconteçam e planejar o crescimento.",
    steps: [
      "Lançar todas as previsões de entradas e saídas para 90 dias",
      "Analisar necessidade de capital de giro",
      "Reduzir dependência de antecipação de cartões/boletos",
      "Agendar Reunião Estratégica com consultor Vertus"
    ],
    expectedResult: "Segurança total para investir e expandir sem risco de quebra por falta de liquidez."
  }
];
