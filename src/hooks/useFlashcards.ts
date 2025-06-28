
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

      // Map the database fields to our interface with better validation
      const mappedData = (data || []).map(item => {
        console.log(`Processing flashcard ID ${item.id}:`, {
          pergunta: item.pergunta,
          resposta: item.resposta,
          area: item.area,
          tema: item.tema,
          exemplo: item.exemplo
        });

        // Debug specifically for empty resposta fields
        if (!item.resposta || item.resposta.trim() === '') {
          console.warn(`⚠️ Empty resposta for card ${item.id} (${item.area}):`, {
            resposta: item.resposta,
            exemplo: item.exemplo,
            hasExemplo: !!item.exemplo
          });
        }

        return {
          id: item.id.toString(),
          pergunta: item.pergunta || 'Pergunta não disponível',
          resposta: item.resposta || item.exemplo || 'Resposta não disponível', // Use exemplo as fallback
          area: item.area || 'Área não especificada',
          tema: item.tema || undefined,
          explicacao: item.exemplo || undefined,
          created_at: item.created_at
        };
      }) as SupabaseFlashcard[];

      console.log('Mapped flashcards data:', mappedData);
      
      // Filter out completely empty cards but be more lenient
      const validCards = mappedData.filter(card => {
        const hasValidQuestion = card.pergunta && card.pergunta !== 'Pergunta não disponível';
        const hasValidAnswer = card.resposta && card.resposta !== 'Resposta não disponível';
        
        if (!hasValidQuestion || !hasValidAnswer) {
          console.warn(`Filtering out invalid card ${card.id}:`, {
            hasValidQuestion,
            hasValidAnswer,
            area: card.area
          });
        }
        
        return hasValidQuestion && hasValidAnswer;
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
