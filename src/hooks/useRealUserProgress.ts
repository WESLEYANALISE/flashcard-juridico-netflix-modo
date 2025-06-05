
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserFlashcardProgress {
  id: string;
  user_id: string;
  flashcard_id: number;
  area: string;
  tema?: string;
  correct_answers: number;
  total_attempts: number;
  last_studied: string;
  needs_review: boolean;
  mastery_level: 'beginner' | 'intermediate' | 'advanced' | 'mastered';
  streak_count: number;
  created_at: string;
  updated_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  area: string;
  temas: string[];
  total_cards: number;
  correct_answers: number;
  cards_reviewed: number;
  last_card_index: number;
  session_type: 'normal' | 'review' | 'random';
  completed: boolean;
  session_date: string;
  created_at: string;
  updated_at: string;
}

export const useUserProgress = (flashcardId?: number) => {
  return useQuery({
    queryKey: ['user-progress', flashcardId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_flashcard_progress')
        .select('*')
        .eq('flashcard_id', flashcardId!)
        .maybeSingle();

      if (error) throw error;
      return data as UserFlashcardProgress | null;
    },
    enabled: !!flashcardId,
  });
};

export const useAllUserProgress = () => {
  return useQuery({
    queryKey: ['all-user-progress'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_flashcard_progress')
        .select('*')
        .order('last_studied', { ascending: false });

      if (error) throw error;
      return data as UserFlashcardProgress[];
    },
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      flashcardId,
      area,
      tema,
      correct,
      timeSpent = 0
    }: {
      flashcardId: number;
      area: string;
      tema?: string;
      correct: boolean;
      timeSpent?: number;
    }) => {
      // First, get existing progress
      const { data: existing } = await supabase
        .from('user_flashcard_progress')
        .select('*')
        .eq('flashcard_id', flashcardId)
        .maybeSingle();

      const updateData = {
        flashcard_id: flashcardId,
        area,
        tema: tema || null,
        correct_answers: (existing?.correct_answers || 0) + (correct ? 1 : 0),
        total_attempts: (existing?.total_attempts || 0) + 1,
        last_studied: new Date().toISOString(),
        needs_review: !correct,
        mastery_level: correct ? (
          existing?.correct_answers >= 2 ? 'mastered' : 'intermediate'
        ) : 'beginner',
        streak_count: correct ? (existing?.streak_count || 0) + 1 : 0,
      };

      const { data, error } = await supabase
        .from('user_flashcard_progress')
        .upsert(updateData, { 
          onConflict: 'user_id,flashcard_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      queryClient.invalidateQueries({ queryKey: ['all-user-progress'] });
      queryClient.invalidateQueries({ queryKey: ['study-sessions'] });
    },
  });
};

export const useStudySessions = () => {
  return useQuery({
    queryKey: ['study-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_study_sessions')
        .select('*')
        .order('session_date', { ascending: false });

      if (error) throw error;
      return data as StudySession[];
    },
  });
};

export const useCreateStudySession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sessionData: {
      area: string;
      temas: string[];
      total_cards: number;
      session_type: 'normal' | 'review' | 'random';
    }) => {
      const { data, error } = await supabase
        .from('user_study_sessions')
        .insert({
          ...sessionData,
          session_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sessions'] });
    },
  });
};

export const useUpdateStudySession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      sessionId,
      updates
    }: {
      sessionId: string;
      updates: Partial<StudySession>;
    }) => {
      const { data, error } = await supabase
        .from('user_study_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sessions'] });
    },
  });
};

export const useCardsNeedingReview = () => {
  return useQuery({
    queryKey: ['cards-needing-review'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_flashcard_progress')
        .select('*')
        .eq('needs_review', true)
        .order('last_studied', { ascending: true });

      if (error) throw error;
      return data as UserFlashcardProgress[];
    },
  });
};
