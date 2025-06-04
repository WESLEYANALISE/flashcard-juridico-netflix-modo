
import { z } from 'zod';

export const SupabaseFlashcardSchema = z.object({
  id: z.number(),
  area: z.string(),
  pergunta: z.string(),
  resposta: z.string(),
  tema: z.string(),
});

export type SupabaseFlashcard = z.infer<typeof SupabaseFlashcardSchema>;
