
import { SupabaseFlashcardSchema } from '@/schemas/flashcard';

export interface SupabaseFlashcard {
  id: number;
  area: string;
  pergunta: string;
  resposta: string;
  tema: string;
}

export const validateFlashcards = (data: any[]): SupabaseFlashcard[] => {
  const validFlashcards: SupabaseFlashcard[] = [];
  
  data.forEach((item, index) => {
    try {
      // Check if item has all required fields with proper types
      if (item && 
          typeof item === 'object' && 
          typeof item.id === 'number' && 
          typeof item.area === 'string' && item.area.length > 0 &&
          typeof item.pergunta === 'string' && item.pergunta.length > 0 &&
          typeof item.resposta === 'string' && item.resposta.length > 0 &&
          typeof item.tema === 'string' && item.tema.length > 0) {
        
        const validatedItem: SupabaseFlashcard = {
          id: item.id,
          area: item.area,
          pergunta: item.pergunta,
          resposta: item.resposta,
          tema: item.tema
        };
        
        validFlashcards.push(validatedItem);
      } else {
        console.warn(`Skipping flashcard at index ${index}: missing or invalid required fields`);
      }
    } catch (error) {
      console.warn(`Invalid flashcard at index ${index}:`, error);
    }
  });
  
  return validFlashcards;
};
