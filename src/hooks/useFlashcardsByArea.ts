
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseFlashcard } from './useFlashcards';

export const useFlashcardsByArea = (area: string) => {
  return useQuery({
    queryKey: ['flashcards-by-area', area],
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

export const useFlashcardsByAreaAndThemes = (area: string, themes: string[]) => {
  return useQuery({
    queryKey: ['flashcards-by-area-themes', area, themes],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flash_cards')
        .select('*')
        .eq('area', area)
        .in('tema', themes)
        .order('tema', { ascending: true });

      if (error) {
        console.error('Error fetching flashcards by area and themes:', error);
        throw error;
      }

      return data as SupabaseFlashcard[];
    },
    enabled: !!area && themes.length > 0,
  });
};
