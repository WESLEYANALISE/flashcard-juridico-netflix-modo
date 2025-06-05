
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserFlashcardProgress {
  id: string;
  user_id: string;
  flashcard_id: number;
  flashcard_area: string;
  studied: boolean;
  correct_answers: number;
  total_attempts: number;
  last_studied?: string;
  streak_count: number;
}

export interface UserStudySession {
  id: string;
  user_id: string;
  session_date: string;
  area: string;
  total_cards: number;
  correct_answers: number;
  total_time: number;
  streak_achieved: number;
}

export interface UserOverallProgress {
  id: string;
  user_id: string;
  total_cards_studied: number;
  total_correct_answers: number;
  total_study_time: number;
  current_streak: number;
  max_streak: number;
  last_study_date?: string;
}

export const useUserFlashcardProgress = () => {
  return useQuery({
    queryKey: ['user-flashcard-progress'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('list_tables', { prefix: 'user_flashcard_progress' });

      if (error) {
        console.log('Table not exists, returning empty array');
        return [] as UserFlashcardProgress[];
      }
      
      // For now, return empty array until tables are properly created
      return [] as UserFlashcardProgress[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserOverallProgress = () => {
  return useQuery({
    queryKey: ['user-overall-progress'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('list_tables', { prefix: 'user_overall_progress' });

      if (error) {
        console.log('Table not exists, returning null');
        return null;
      }
      
      // For now, return null until tables are properly created
      return null;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserStudySessions = () => {
  return useQuery({
    queryKey: ['user-study-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('list_tables', { prefix: 'user_study_sessions' });

      if (error) {
        console.log('Table not exists, returning empty array');
        return [] as UserStudySession[];
      }
      
      // For now, return empty array until tables are properly created
      return [] as UserStudySession[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateFlashcardProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      flashcardId, 
      area, 
      correct, 
      timeSpent = 0 
    }: { 
      flashcardId: number; 
      area: string; 
      correct: boolean; 
      timeSpent?: number;
    }) => {
      // For now, just log the action until tables are properly created
      console.log('Updating flashcard progress:', { flashcardId, area, correct, timeSpent });
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-flashcard-progress'] });
      queryClient.invalidateQueries({ queryKey: ['user-overall-progress'] });
      queryClient.invalidateQueries({ queryKey: ['user-study-sessions'] });
    },
  });
};
