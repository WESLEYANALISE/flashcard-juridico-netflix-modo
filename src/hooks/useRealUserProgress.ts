
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

export interface UserStudySession {
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

export const useUserProgress = () => {
  return useQuery({
    queryKey: ['user-progress'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_flashcard_progress')
        .select('*');

      if (error) throw error;
      return data as UserFlashcardProgress[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserProgressByArea = (area: string) => {
  return useQuery({
    queryKey: ['user-progress-area', area],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_flashcard_progress')
        .select('*')
        .eq('area', area);

      if (error) throw error;
      return data as UserFlashcardProgress[];
    },
    enabled: !!area,
    staleTime: 5 * 60 * 1000,
  });
};

export const useLastStudySession = (area: string) => {
  return useQuery({
    queryKey: ['last-study-session', area],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_study_sessions')
        .select('*')
        .eq('area', area)
        .eq('completed', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as UserStudySession | null;
    },
    enabled: !!area,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateFlashcardProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      flashcardId, 
      area, 
      tema,
      correct 
    }: { 
      flashcardId: number; 
      area: string; 
      tema?: string;
      correct: boolean; 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // First, get current progress
      const { data: existing } = await supabase
        .from('user_flashcard_progress')
        .select('*')
        .eq('flashcard_id', flashcardId)
        .eq('user_id', user.id)
        .maybeSingle();

      const newCorrectAnswers = (existing?.correct_answers || 0) + (correct ? 1 : 0);
      const newTotalAttempts = (existing?.total_attempts || 0) + 1;
      const newStreakCount = correct ? (existing?.streak_count || 0) + 1 : 0;
      const accuracy = newTotalAttempts > 0 ? (newCorrectAnswers / newTotalAttempts) : 0;
      
      // Determine mastery level
      let masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'mastered' = 'beginner';
      if (accuracy >= 0.9 && newTotalAttempts >= 3) masteryLevel = 'mastered';
      else if (accuracy >= 0.75 && newTotalAttempts >= 2) masteryLevel = 'advanced';
      else if (accuracy >= 0.5 && newTotalAttempts >= 2) masteryLevel = 'intermediate';

      const progressData = {
        user_id: user.id,
        flashcard_id: flashcardId,
        area,
        tema,
        correct_answers: newCorrectAnswers,
        total_attempts: newTotalAttempts,
        last_studied: new Date().toISOString(),
        needs_review: !correct || accuracy < 0.7,
        mastery_level: masteryLevel,
        streak_count: newStreakCount,
      };

      if (existing) {
        const { data, error } = await supabase
          .from('user_flashcard_progress')
          .update(progressData)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('user_flashcard_progress')
          .insert([progressData])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      queryClient.invalidateQueries({ queryKey: ['user-progress-area'] });
      queryClient.invalidateQueries({ queryKey: ['cards-needing-review'] });
    },
  });
};

export const useCreateStudySession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      area,
      temas,
      totalCards,
      sessionType = 'normal'
    }: {
      area: string;
      temas: string[];
      totalCards: number;
      sessionType?: 'normal' | 'review' | 'random';
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_study_sessions')
        .insert([{
          user_id: user.id,
          area,
          temas,
          total_cards: totalCards,
          session_type: sessionType,
        }])
        .select()
        .single();

      if (error) throw error;
      return data as UserStudySession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['last-study-session'] });
    },
  });
};

export const useUpdateStudySession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      sessionId,
      lastCardIndex,
      correctAnswers,
      cardsReviewed,
      completed = false
    }: {
      sessionId: string;
      lastCardIndex?: number;
      correctAnswers?: number;
      cardsReviewed?: number;
      completed?: boolean;
    }) => {
      const updateData: any = {};
      if (lastCardIndex !== undefined) updateData.last_card_index = lastCardIndex;
      if (correctAnswers !== undefined) updateData.correct_answers = correctAnswers;
      if (cardsReviewed !== undefined) updateData.cards_reviewed = cardsReviewed;
      if (completed !== undefined) updateData.completed = completed;

      const { data, error } = await supabase
        .from('user_study_sessions')
        .update(updateData)
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data as UserStudySession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['last-study-session'] });
    },
  });
};

export const useCardsNeedingReview = () => {
  return useQuery({
    queryKey: ['cards-needing-review'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_flashcard_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('needs_review', true)
        .order('last_studied', { ascending: true });

      if (error) throw error;
      return data as UserFlashcardProgress[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserStatistics = () => {
  const { data: allProgress = [] } = useUserProgress();
  
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
      
      // Group by area
      const areaStats = allProgress.reduce((acc, progress) => {
        if (!acc[progress.area]) {
          acc[progress.area] = {
            total: 0,
            studied: 0,
            mastered: 0,
            needsReview: 0,
            accuracy: 0,
            totalCorrect: 0,
            totalAttempts: 0
          };
        }
        
        acc[progress.area].studied++;
        if (progress.mastery_level === 'mastered') acc[progress.area].mastered++;
        if (progress.needs_review) acc[progress.area].needsReview++;
        acc[progress.area].totalCorrect += progress.correct_answers;
        acc[progress.area].totalAttempts += progress.total_attempts;
        
        return acc;
      }, {} as Record<string, any>);

      // Calculate accuracy per area
      Object.keys(areaStats).forEach(area => {
        const stats = areaStats[area];
        stats.accuracy = stats.totalAttempts > 0 ? 
          Math.round((stats.totalCorrect / stats.totalAttempts) * 100) : 0;
      });

      return {
        totalStudied,
        totalCorrect,
        totalAttempts,
        needsReview,
        mastered,
        accuracy: Math.round(accuracy),
        currentStreak,
        areaStats
      };
    },
    enabled: true,
  });
};

export const useResetUserProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Delete all user progress
      const { error: progressError } = await supabase
        .from('user_flashcard_progress')
        .delete()
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      // Delete all user sessions
      const { error: sessionsError } = await supabase
        .from('user_study_sessions')
        .delete()
        .eq('user_id', user.id);

      if (sessionsError) throw sessionsError;

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      queryClient.invalidateQueries({ queryKey: ['user-progress-area'] });
      queryClient.invalidateQueries({ queryKey: ['cards-needing-review'] });
      queryClient.invalidateQueries({ queryKey: ['last-study-session'] });
      queryClient.invalidateQueries({ queryKey: ['user-statistics'] });
    },
  });
};
