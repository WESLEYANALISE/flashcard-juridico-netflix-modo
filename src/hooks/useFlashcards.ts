import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SupabaseFlashcard {
  id: string;
  pergunta: string;
  resposta: string;
  area: string;
  tema?: string;
  explicacao?: string; // This maps to the "exemplo" field from flash_cards table
  created_at?: string;
}

export const useFlashcards = () => {
  return useQuery({
    queryKey: ['flashcards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flash_cards')
        .select('*');

      if (error) {
        console.error('Error fetching flashcards:', error);
        throw error;
      }

      console.log('Raw flashcards data from Supabase:', data);

      // Map the database fields to our interface with enhanced validation
      const mappedData = (data || []).map(item => {
        console.log(`Processing flashcard ID ${item.id}:`, {
          pergunta: item.pergunta,
          resposta: item.resposta,
          area: item.area,
          tema: item.tema,
          exemplo: item.exemplo
        });

        // Enhanced fallback logic for empty answers
        let finalAnswer = '';
        let hasValidAnswer = false;

        if (item.resposta && item.resposta.trim() !== '') {
          finalAnswer = item.resposta.trim();
          hasValidAnswer = true;
          console.log(`✅ Using resposta for card ${item.id}`);
        } else if (item.exemplo && item.exemplo.trim() !== '') {
          finalAnswer = item.exemplo.trim();
          hasValidAnswer = true;
          console.log(`⚠️ Using exemplo as fallback for card ${item.id}`);
        } else {
          finalAnswer = 'Resposta não disponível';
          hasValidAnswer = false;
          console.warn(`❌ No valid answer found for card ${item.id}`);
        }

        return {
          id: item.id.toString(),
          pergunta: item.pergunta || 'Pergunta não disponível',
          resposta: finalAnswer,
          area: item.area || 'Área não especificada',
          tema: item.tema || undefined,
          explicacao: item.exemplo || undefined,
          created_at: item.created_at,
          hasValidAnswer // Add flag to track answer validity
        };
      }) as (SupabaseFlashcard & { hasValidAnswer: boolean })[];

      console.log('Mapped flashcards data:', mappedData);
      
      // Filter out cards without valid answers
      const validCards = mappedData.filter(card => {
        const hasValidQuestion = card.pergunta && card.pergunta !== 'Pergunta não disponível';
        const hasValidAnswerFlag = card.hasValidAnswer;
        
        if (!hasValidQuestion || !hasValidAnswerFlag) {
          console.warn(`Filtering out invalid card ${card.id}:`, {
            hasValidQuestion,
            hasValidAnswer: hasValidAnswerFlag,
            area: card.area
          });
        }
        
        return hasValidQuestion && hasValidAnswerFlag;
      }).map(card => {
        // Remove the temporary flag before returning
        const { hasValidAnswer, ...cleanCard } = card;
        return cleanCard;
      });

      console.log(`✅ Final valid cards: ${validCards.length}/${mappedData.length}`);
      console.log('Cards by area:', validCards.reduce((acc, card) => {
        acc[card.area] = (acc[card.area] || 0) + 1;
        return acc;
      }, {} as Record<string, number>));
      
      return validCards;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFlashcardAreas = () => {
  return useQuery({
    queryKey: ['flashcard-areas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flash_cards')
        .select('area')
        .not('area', 'is', null);

      if (error) {
        console.error('Error fetching flashcard areas:', error);
        throw error;
      }

      // Get unique areas
      const uniqueAreas = [...new Set(data?.map(item => item.area))];
      return uniqueAreas.filter(Boolean) as string[];
    },
    staleTime: 5 * 60 * 1000,
  });
};
