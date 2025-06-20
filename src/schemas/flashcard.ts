
import { z } from 'zod';

export const SupabaseFlashcardSchema = z.object({
  id: z.string(),
  area: z.string().min(1, "Area é obrigatória"),
  pergunta: z.string().min(1, "Pergunta é obrigatória"),
  resposta: z.string().min(1, "Resposta é obrigatória"),
  tema: z.string().min(1, "Tema é obrigatório"),
  explicacao: z.string().optional(),
});

export type SupabaseFlashcard = z.infer<typeof SupabaseFlashcardSchema>;
