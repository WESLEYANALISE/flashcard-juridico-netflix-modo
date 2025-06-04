
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  studied: boolean;
  correctAnswers: number;
  totalAttempts: number;
  lastStudied?: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface StudyStats {
  totalCards: number;
  studiedCards: number;
  correctAnswers: number;
  totalAttempts: number;
  accuracy: number;
  streak: number;
  timeSpent: number;
}
