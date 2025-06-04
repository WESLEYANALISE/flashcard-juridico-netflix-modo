
import { SupabaseFlashcard } from '@/hooks/useFlashcards';
import { Flashcard, Category } from '@/types/flashcard';

// Map Supabase flashcard to our app's flashcard format
export const mapSupabaseFlashcard = (supabaseCard: SupabaseFlashcard): Flashcard => {
  return {
    id: supabaseCard.id.toString(),
    question: supabaseCard.pergunta,
    answer: supabaseCard.resposta,
    category: supabaseCard.area,
    difficulty: 'Médio' as const, // Default difficulty since not in DB
    studied: false,
    correctAnswers: 0,
    totalAttempts: 0,
  };
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
