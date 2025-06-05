
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SupabaseFlashcard {
  id: string;
  pergunta: string;
  resposta: string;
  area: string;
  tema?: string;
  explicacao?: string; // This maps to the "exemplo" field from flash_cards table
  created_at?: string;
}

export const useFlashcards = () => {
  return useQuery({
    queryKey: ['flashcards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flash_cards')
        .select('*');

      if (error) {
        console.error('Error fetching flashcards:', error);
        throw error;
      }

      // Map the database fields to our interface
      return (data || []).map(item => ({
        id: item.id.toString(),
        pergunta: item.pergunta || '',
        resposta: item.resposta || '',
        area: item.area || '',
        tema: item.tema || undefined,
        explicacao: item.exemplo || undefined, // Map the "exemplo" column to "explicacao" property
        created_at: item.created_at
      })) as SupabaseFlashcard[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFlashcardAreas = () => {
  return useQuery({
    queryKey: ['flashcard-areas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flash_cards')
        .select('area')
        .not('area', 'is', null);

      if (error) {
        console.error('Error fetching flashcard areas:', error);
        throw error;
      }

      // Get unique areas
      const uniqueAreas = [...new Set(data?.map(item => item.area))];
      return uniqueAreas.filter(Boolean) as string[];
    },
    staleTime: 5 * 60 * 1000,
  });
};
