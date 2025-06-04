
export interface DailyMission {
  id: string;
  title: string;
  description: string;
  type: 'study_cards' | 'correct_answers' | 'complete_area' | 'study_streak';
  target: number;
  current: number;
  completed: boolean;
  points: number;
  icon: string;
}

export interface UserProgress {
  level: number;
  totalPoints: number;
  dailyStreak: number;
  lastStudyDate: Date | null;
}
