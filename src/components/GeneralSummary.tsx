
import { BookOpen, Target, Award, TrendingUp } from 'lucide-react';
import { Flashcard, Category } from '@/types/flashcard';
import { useUserStatistics } from '@/hooks/useRealUserProgress';
import { useFlashcards } from '@/hooks/useFlashcards';

interface GeneralSummaryProps {
  flashcards: Flashcard[];
  categories: Category[];
}

const GeneralSummary = ({ flashcards, categories }: GeneralSummaryProps) => {
  const { data: userStats } = useUserStatistics();
  const { data: allFlashcards = [] } = useFlashcards();

  // Use real statistics from the database
  const totalCards = allFlashcards.length;
  const studiedCards = userStats?.totalStudied || 0;
  const accuracy = userStats?.accuracy || 0;
  const progress = totalCards > 0 ? Math.round((studiedCards / totalCards) * 100) : 0;

  return (
    <div className="bg-netflix-dark/50 rounded-2xl p-4 sm:p-6 glass-effect animate-fade-in mb-8 sm:mb-12">
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 text-center">Resumo Geral</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="text-center p-3 sm:p-4 bg-blue-500/20 rounded-xl">
          <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-xl sm:text-2xl font-bold text-blue-400">
            {totalCards}
          </div>
          <div className="text-xs sm:text-sm text-gray-400">Total de Cards</div>
        </div>
        
        <div className="text-center p-3 sm:p-4 bg-green-500/20 rounded-xl">
          <Target className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mx-auto mb-2" />
          <div className="text-xl sm:text-2xl font-bold text-green-400">
            {studiedCards}
          </div>
          <div className="text-xs sm:text-sm text-gray-400">Estudados</div>
        </div>
        
        <div className="text-center p-3 sm:p-4 bg-netflix-red/20 rounded-xl">
          <Award className="w-6 h-6 sm:w-8 sm:h-8 text-netflix-red mx-auto mb-2" />
          <div className="text-xl sm:text-2xl font-bold text-netflix-red">
            {accuracy}%
          </div>
          <div className="text-xs sm:text-sm text-gray-400">Precisão</div>
        </div>
        
        <div className="text-center p-3 sm:p-4 bg-netflix-gold/20 rounded-xl">
          <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-netflix-gold mx-auto mb-2" />
          <div className="text-xl sm:text-2xl font-bold text-netflix-gold">
            {progress}%
          </div>
          <div className="text-xs sm:text-sm text-gray-400">Progresso</div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSummary;
