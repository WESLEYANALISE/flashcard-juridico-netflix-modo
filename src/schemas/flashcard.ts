
import { z } from 'zod';

export const SupabaseFlashcardSchema = z.object({
  id: z.number(),
  pergunta: z.string().min(1, 'Pergunta é obrigatória'),
  resposta: z.string().min(1, 'Resposta é obrigatória'),
  area: z.string().min(1, 'Área é obrigatória'),
  tema: z.string().min(1, 'Tema é obrigatório'),
});

export const FlashcardSchema = z.object({
  id: z.string(),
  question: z.string().min(1, 'Pergunta é obrigatória'),
  answer: z.string().min(1, 'Resposta é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  difficulty: z.enum(['Fácil', 'Médio', 'Difícil']),
  studied: z.boolean().default(false),
  correctAnswers: z.number().min(0).default(0),
  totalAttempts: z.number().min(0).default(0),
  lastStudied: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
});

export const SessionStatsSchema = z.object({
  correct: z.number().min(0),
  total: z.number().min(0),
  streak: z.number().min(0),
  maxStreak: z.number().min(0),
  completed: z.boolean(),
});

export type SupabaseFlashcard = z.infer<typeof SupabaseFlashcardSchema>;
export type ValidatedFlashcard = z.infer<typeof FlashcardSchema>;
export type ValidatedSessionStats = z.infer<typeof SessionStatsSchema>;
