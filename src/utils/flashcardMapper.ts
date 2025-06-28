
import { SupabaseFlashcard } from '@/hooks/useFlashcards';
import { Flashcard, Category } from '@/types/flashcard';

// Map Supabase flashcard to our app's flashcard format with enhanced validation
export const mapSupabaseFlashcard = (supabaseCard: SupabaseFlashcard): Flashcard => {
  console.log('🔄 Mapping Supabase card:', supabaseCard);

  // Enhanced answer validation and fallback logic
  let answer = '';
  let answerSource = '';
  
  if (supabaseCard.resposta && supabaseCard.resposta.trim() !== '' && supabaseCard.resposta !== 'Resposta não disponível') {
    answer = supabaseCard.resposta.trim();
    answerSource = 'resposta';
    console.log(`✅ Using resposta for card ${supabaseCard.id}`);
  } else if (supabaseCard.explicacao && supabaseCard.explicacao.trim() !== '') {
    answer = supabaseCard.explicacao.trim();
    answerSource = 'explicacao';
    console.log(`⚠️ Using explicacao as fallback for card ${supabaseCard.id}`);
  } else {
    answer = 'Conteúdo não disponível para este flashcard';
    answerSource = 'fallback';
    console.error(`❌ No valid answer found for card ${supabaseCard.id}`);
  }

  const mappedCard = {
    id: supabaseCard.id.toString(),
    question: supabaseCard.pergunta || 'Pergunta não disponível',
    answer: answer,
    category: supabaseCard.area || 'Categoria não especificada',
    difficulty: 'Médio' as const, // Default difficulty since not in DB
    studied: false,
    correctAnswers: 0,
    totalAttempts: 0,
    answerSource // Track where the answer came from for debugging
  };

  console.log('✅ Mapped card result:', mappedCard);
  return mappedCard;
};

// Generate categories from flashcard areas
export const generateCategoriesFromAreas = (areas: string[]): Category[] => {
  const categoryIcons: Record<string, string> = {
    'Direito Civil': '⚖️',
    'Direito Penal': '🔒',
    'Direito Constitucional': '📜',
    'Direito Administrativo': '🏛️',
    'Direito Trabalhista': '👷',
    'Direito Empresarial': '🏢',
    'Direito Tributário': '💰',
    'Direito Processual': '📋',
    'Direito Internacional': '🌍',
    'Direito Ambiental': '🌱',
  };

  const categoryColors: Record<string, string> = {
    'Direito Civil': '#E50914',
    'Direito Penal': '#FFD700',
    'Direito Constitucional': '#00D4AA',
    'Direito Administrativo': '#FF6B35',
    'Direito Trabalhista': '#8B5CF6',
    'Direito Empresarial': '#06B6D4',
    'Direito Tributário': '#F59E0B',
    'Direito Processual': '#EF4444',
    'Direito Internacional': '#10B981',
    'Direito Ambiental': '#22C55E',
  };

  return areas.map((area, index) => ({
    id: area.toLowerCase().replace(/\s+/g, '-'),
    name: area,
    icon: categoryIcons[area] || '📚',
    color: categoryColors[area] || `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
    description: `Flashcards de ${area}`,
  }));
};
