
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserFlashcardProgress {
  id: string;
  user_id: string;
  flashcard_id: number;
  area: string;
  correct_answers: number;
  total_attempts: number;
  last_studied?: string;
  needs_review: boolean;
  mastery_level: 'beginner' | 'intermediate' | 'advanced' | 'mastered';
  streak_count: number;
  created_at: string;
  updated_at: string;
}

export const useUserFlashcardProgress = (flashcardId?: number) => {
  return useQuery({
    queryKey: ['user-flashcard-progress', flashcardId],
    queryFn: async () => {
      // For now, return mock data until we implement the real database tables
      const mockProgress: UserFlashcardProgress[] = [];
      
      // This will be replaced with real Supabase query once tables are created
      return mockProgress;
    },
    enabled: !!flashcardId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAllUserProgress = () => {
  return useQuery({
    queryKey: ['all-user-progress'],
    queryFn: async () => {
      // Mock data for demonstration
      const mockData: UserFlashcardProgress[] = [];
      return mockData;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateUserProgress = () => {
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
      // For now, just log the progress until we have real tables
      console.log('User progress update:', {
        flashcardId,
        area,
        correct,
        timeSpent,
        timestamp: new Date().toISOString()
      });
      
      // This will be replaced with real Supabase mutation
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-flashcard-progress'] });
      queryClient.invalidateQueries({ queryKey: ['all-user-progress'] });
    },
  });
};

// Hook para calcular estatísticas reais do usuário
export const useUserStatistics = () => {
  const { data: allProgress = [] } = useAllUserProgress();
  
  return useQuery({
    queryKey: ['user-statistics', allProgress],
    queryFn: () => {
      const totalStudied = allProgress.length;
      const totalCorrect = allProgress.reduce((sum, p) => sum + p.correct_answers, 0);
      const totalAttempts = allProgress.reduce((sum, p) => sum + p.total_attempts, 0);
      const needsReview = allProgress.filter(p => p.needs_review).length;
      const mastered = allProgress.filter(p => p.mastery_level === 'mastered').length;
      
      const accuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;
      const currentStreak = Math.max(...allProgress.map(p => p.streak_count), 0);
      
      return {
        totalStudied,
        totalCorrect,
        totalAttempts,
        needsReview,
        mastered,
        accuracy: Math.round(accuracy),
        currentStreak,
        areas: {} // Will be populated with area-specific stats
      };
    },
    enabled: true,
  });
};
