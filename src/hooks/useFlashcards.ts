
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { validateFlashcards } from '@/utils/flashcardValidator';
import type { SupabaseFlashcard } from '@/utils/flashcardValidator';

export type { SupabaseFlashcard };

export const useFlashcards = () => {
  return useQuery({
    queryKey: ['flashcards'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('flash_cards')
          .select('*')
          .order('area', { ascending: true });

        if (error) {
          console.error('Error fetching flashcards:', error);
          throw new Error(`Erro ao buscar flashcards: ${error.message}`);
        }

        if (!data || data.length === 0) {
          return [];
        }

        return validateFlashcards(data);
      } catch (error) {
        console.error('Error in useFlashcards:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useFlashcardAreas = () => {
  return useQuery({
    queryKey: ['flashcard-areas'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('flash_cards')
          .select('area')
          .order('area', { ascending: true });

        if (error) {
          console.error('Error fetching areas:', error);
          throw new Error(`Erro ao buscar áreas: ${error.message}`);
        }

        if (!data) {
          return [];
        }

        const uniqueAreas = [...new Set(data.map(item => item.area))].filter(Boolean);
        return uniqueAreas;
      } catch (error) {
        console.error('Error in useFlashcardAreas:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
