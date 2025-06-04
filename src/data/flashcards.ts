
import { Flashcard, Category } from '@/types/flashcard';

export const categories: Category[] = [
  {
    id: 'civil',
    name: 'Direito Civil',
    icon: '⚖️',
    color: '#E50914',
    description: 'Contratos, responsabilidade civil, família'
  },
  {
    id: 'penal',
    name: 'Direito Penal',
    icon: '🔒',
    color: '#FFD700',
    description: 'Crimes, penas, processo penal'
  },
  {
    id: 'constitucional',
    name: 'Direito Constitucional',
    icon: '📜',
    color: '#00D4AA',
    description: 'Princípios constitucionais, direitos fundamentais'
  },
  {
    id: 'administrativo',
    name: 'Direito Administrativo',
    icon: '🏛️',
    color: '#FF6B35',
    description: 'Atos administrativos, licitações, serviços públicos'
  },
  {
    id: 'trabalhista',
    name: 'Direito Trabalhista',
    icon: '👷',
    color: '#8B5CF6',
    description: 'CLT, contratos de trabalho, direitos trabalhistas'
  },
  {
    id: 'empresarial',
    name: 'Direito Empresarial',
    icon: '🏢',
    color: '#06B6D4',
    description: 'Sociedades, falência, títulos de crédito'
  }
];

export const flashcards: Flashcard[] = [
  // Direito Civil
  {
    id: '1',
    question: 'O que é capacidade jurídica?',
    answer: 'É a aptidão para ser titular de direitos e obrigações. Toda pessoa física tem capacidade jurídica desde o nascimento com vida.',
    category: 'civil',
    difficulty: 'Fácil',
    studied: false,
    correctAnswers: 0,
    totalAttempts: 0
  },
  {
    id: '2',
    question: 'Quais são os elementos essenciais do contrato?',
    answer: 'Agente capaz, objeto lícito, possível, determinado ou determinável, e forma prescrita ou não defesa em lei.',
    category: 'civil',
    difficulty: 'Médio',
    studied: false,
    correctAnswers: 0,
    totalAttempts: 0
  },
  
  // Direito Penal
  {
    id: '3',
    question: 'O que é dolo eventual?',
    answer: 'Ocorre quando o agente assume o risco de produzir o resultado, ou seja, prevê como possível o resultado e, mesmo assim, prossegue com a conduta.',
    category: 'penal',
    difficulty: 'Difícil',
    studied: false,
    correctAnswers: 0,
    totalAttempts: 0
  },
  {
    id: '4',
    question: 'Quais são as excludentes de ilicitude?',
    answer: 'Estado de necessidade, legítima defesa, estrito cumprimento de dever legal e exercício regular de direito.',
    category: 'penal',
    difficulty: 'Médio',
    studied: false,
    correctAnswers: 0,
    totalAttempts: 0
  },
  
  // Direito Constitucional
  {
    id: '5',
    question: 'O que são direitos fundamentais de primeira geração?',
    answer: 'São os direitos civis e políticos, que representam as liberdades clássicas, como direito à vida, liberdade, propriedade e participação política.',
    category: 'constitucional',
    difficulty: 'Médio',
    studied: false,
    correctAnswers: 0,
    totalAttempts: 0
  },
  {
    id: '6',
    question: 'O que é o princípio da supremacia da Constituição?',
    answer: 'Significa que a Constituição ocupa o topo da hierarquia normativa, e todas as demais normas devem estar em conformidade com ela.',
    category: 'constitucional',
    difficulty: 'Fácil',
    studied: false,
    correctAnswers: 0,
    totalAttempts: 0
  },
  
  // Direito Administrativo
  {
    id: '7',
    question: 'Quais são os atributos dos atos administrativos?',
    answer: 'Presunção de legitimidade, imperatividade, autoexecutoriedade e tipicidade.',
    category: 'administrativo',
    difficulty: 'Médio',
    studied: false,
    correctAnswers: 0,
    totalAttempts: 0
  },
  {
    id: '8',
    question: 'O que é o princípio da impessoalidade?',
    answer: 'A Administração deve atuar sem favoritismo ou perseguição, tratando todos os administrados de forma igualitária.',
    category: 'administrativo',
    difficulty: 'Fácil',
    studied: false,
    correctAnswers: 0,
    totalAttempts: 0
  },
  
  // Direito Trabalhista
  {
    id: '9',
    question: 'O que é adicional noturno?',
    answer: 'É o acréscimo de 20% sobre o valor da hora diurna para trabalho realizado entre 22h e 5h.',
    category: 'trabalhista',
    difficulty: 'Fácil',
    studied: false,
    correctAnswers: 0,
    totalAttempts: 0
  },
  {
    id: '10',
    question: 'Qual o prazo para pagamento das verbas rescisórias?',
    answer: 'Até o primeiro dia útil imediato ao término do contrato ou até o décimo dia, contado da data da notificação da demissão.',
    category: 'trabalhista',
    difficulty: 'Médio',
    studied: false,
    correctAnswers: 0,
    totalAttempts: 0
  },
  
  // Direito Empresarial
  {
    id: '11',
    question: 'O que caracteriza o empresário individual?',
    answer: 'Pessoa física que exerce profissionalmente atividade econômica organizada para a produção ou circulação de bens ou serviços.',
    category: 'empresarial',
    difficulty: 'Médio',
    studied: false,
    correctAnswers: 0,
    totalAttempts: 0
  },
  {
    id: '12',
    question: 'O que é falência?',
    answer: 'É a execução concursal do devedor empresário que não possui condições de pagar suas dívidas.',
    category: 'empresarial',
    difficulty: 'Médio',
    studied: false,
    correctAnswers: 0,
    totalAttempts: 0
  }
];
