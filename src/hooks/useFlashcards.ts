
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseFlashcardSchema } from '@/schemas/flashcard';
import { z } from 'zod';

export interface SupabaseFlashcard {
  id: number;
  pergunta: string;
  resposta: string;
  area: string;
  tema: string;
}

const validateFlashcards = (data: unknown[]): SupabaseFlashcard[] => {
  return data.map((item, index) => {
    try {
      return SupabaseFlashcardSchema.parse(item);
    } catch (error) {
      console.warn(`Invalid flashcard at index ${index}:`, error);
      throw new Error(`Dados inválidos no flashcard ${index + 1}`);
    }
  });
};

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

        if (!data) {
          throw new Error('Nenhum dado retornado do servidor');
        }

        return validateFlashcards(data);
      } catch (error) {
        console.error('Error in useFlashcards:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useFlashcardsByArea = (area: string) => {
  return useQuery({
    queryKey: ['flashcards', area],
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

        // Validate and get unique areas
        const uniqueAreas = [...new Set(data.map(item => {
          if (typeof item.area !== 'string' || !item.area.trim()) {
            throw new Error('Área inválida encontrada nos dados');
          }
          return item.area;
        }))];

        return uniqueAreas;
      } catch (error) {
        console.error('Error in useFlashcardAreas:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 10 * 60 * 1000, // 10 minutes (areas change less frequently)
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};
