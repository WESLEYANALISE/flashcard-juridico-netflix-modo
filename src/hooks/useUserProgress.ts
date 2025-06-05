
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
        .from('user_flashcard_progress')
        .select('*')
        .order('last_studied', { ascending: false });

      if (error) throw error;
      return data as UserFlashcardProgress[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserOverallProgress = () => {
  return useQuery({
    queryKey: ['user-overall-progress'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_overall_progress')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as UserOverallProgress | null;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserStudySessions = () => {
  return useQuery({
    queryKey: ['user-study-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_study_sessions')
        .select('*')
        .order('session_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as UserStudySession[];
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
      // Get current progress
      const { data: currentProgress } = await supabase
        .from('user_flashcard_progress')
        .select('*')
        .eq('flashcard_id', flashcardId)
        .single();

      const newCorrectAnswers = (currentProgress?.correct_answers || 0) + (correct ? 1 : 0);
      const newTotalAttempts = (currentProgress?.total_attempts || 0) + 1;
      const newStreakCount = correct ? (currentProgress?.streak_count || 0) + 1 : 0;

      // Upsert flashcard progress
      const { error: progressError } = await supabase
        .from('user_flashcard_progress')
        .upsert({
          flashcard_id: flashcardId,
          flashcard_area: area,
          studied: true,
          correct_answers: newCorrectAnswers,
          total_attempts: newTotalAttempts,
          last_studied: new Date().toISOString(),
          streak_count: newStreakCount,
        });

      if (progressError) throw progressError;

      // Create study session entry
      const { error: sessionError } = await supabase
        .from('user_study_sessions')
        .insert({
          area,
          total_cards: 1,
          correct_answers: correct ? 1 : 0,
          total_time: timeSpent,
          streak_achieved: newStreakCount,
        });

      if (sessionError) throw sessionError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-flashcard-progress'] });
      queryClient.invalidateQueries({ queryKey: ['user-overall-progress'] });
      queryClient.invalidateQueries({ queryKey: ['user-study-sessions'] });
    },
  });
};
