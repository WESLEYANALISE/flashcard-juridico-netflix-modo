
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseFlashcardSchema } from '@/schemas/flashcard';
import { SupabaseFlashcard } from './useFlashcards';

const validateFlashcards = (data: any[]): SupabaseFlashcard[] => {
  const validFlashcards: SupabaseFlashcard[] = [];
  
  data.forEach((item, index) => {
    try {
      // Only validate items that have all required fields
      if (item && typeof item === 'object' && 
          item.id !== undefined && 
          item.area && 
          item.pergunta && 
          item.resposta && 
          item.tema) {
        const validatedItem = SupabaseFlashcardSchema.parse(item);
        validFlashcards.push(validatedItem);
      } else {
        console.warn(`Skipping flashcard at index ${index}: missing required fields`);
      }
    } catch (error) {
      console.warn(`Invalid flashcard at index ${index}:`, error);
      // Skip invalid items instead of throwing
    }
  });
  
  return validFlashcards;
};

export const useFlashcardsByArea = (area: string) => {
  return useQuery({
    queryKey: ['flashcards-by-area', area],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('flash_cards')
          .select('*')
          .eq('area', area)
          .order('tema', { ascending: true });

        if (error) {
          console.error('Error fetching flashcards by area:', error);
          throw new Error(`Erro ao buscar flashcards da área ${area}: ${error.message}`);
        }

        if (!data) {
          return [];
        }

        return validateFlashcards(data);
      } catch (error) {
        console.error('Error in useFlashcardsByArea:', error);
        throw error;
      }
    },
    enabled: !!area,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useFlashcardsByAreaAndThemes = (area: string, themes: string[]) => {
  return useQuery({
    queryKey: ['flashcards-by-area-themes', area, themes],
    queryFn: async () => {
      try {
        if (!area || themes.length === 0) {
          return [];
        }

        const { data, error } = await supabase
          .from('flash_cards')
          .select('*')
          .eq('area', area)
          .in('tema', themes)
          .order('tema', { ascending: true });

        if (error) {
          console.error('Error fetching flashcards by area and themes:', error);
          throw new Error(`Erro ao buscar flashcards: ${error.message}`);
        }

        if (!data) {
          return [];
        }

        return validateFlashcards(data);
      } catch (error) {
        console.error('Error in useFlashcardsByAreaAndThemes:', error);
        throw error;
      }
    },
    enabled: !!area && themes.length > 0,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
