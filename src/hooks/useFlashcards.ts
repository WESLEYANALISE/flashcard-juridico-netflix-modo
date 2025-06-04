
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SupabaseFlashcard {
  id: number;
  pergunta: string;
  resposta: string;
  area: string;
  tema: string;
}

export const useFlashcards = () => {
  return useQuery({
    queryKey: ['flashcards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flash_cards')
        .select('*')
        .order('area', { ascending: true });

      if (error) {
        console.error('Error fetching flashcards:', error);
        throw error;
      }

      return data as SupabaseFlashcard[];
    },
  });
};

export const useFlashcardsByArea = (area: string) => {
  return useQuery({
    queryKey: ['flashcards', area],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flash_cards')
        .select('*')
        .eq('area', area)
        .order('tema', { ascending: true });

      if (error) {
        console.error('Error fetching flashcards by area:', error);
        throw error;
      }

      return data as SupabaseFlashcard[];
    },
    enabled: !!area,
  });
};

export const useFlashcardAreas = () => {
  return useQuery({
    queryKey: ['flashcard-areas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flash_cards')
        .select('area')
        .order('area', { ascending: true });

      if (error) {
        console.error('Error fetching areas:', error);
        throw error;
      }

      // Get unique areas
      const uniqueAreas = [...new Set(data.map(item => item.area))];
      return uniqueAreas;
    },
  });
};
