
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

        return {
          id: item.id.toString(),
          pergunta: item.pergunta || 'Pergunta não disponível',
          resposta: item.resposta || item.exemplo || 'Resposta não disponível', // Fallback to exemplo if resposta is empty
          area: item.area || 'Área não especificada',
          tema: item.tema || undefined,
          explicacao: item.exemplo || undefined,
          created_at: item.created_at
        };
      }) as SupabaseFlashcard[];

      console.log('Mapped flashcards data:', mappedData);
      
      // Filter out completely empty cards
      const validCards = mappedData.filter(card => 
        card.pergunta && card.pergunta !== 'Pergunta não disponível' &&
        card.resposta && card.resposta !== 'Resposta não disponível'
      );

      console.log(`Filtered ${mappedData.length - validCards.length} invalid cards`);
      
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
