
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

  const summaryItems = [
    {
      icon: BookOpen,
      value: totalCards,
      label: 'Total de Cards',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/15',
      borderColor: 'border-blue-500/30'
    },
    {
      icon: Target,
      value: studiedCards,
      label: 'Estudados',
      color: 'text-green-400',
      bgColor: 'bg-green-500/15',
      borderColor: 'border-green-500/30'
    },
    {
      icon: Award,
      value: `${accuracy}%`,
      label: 'Precisão',
      color: 'text-netflix-red',
      bgColor: 'bg-netflix-red/15',
      borderColor: 'border-netflix-red/30'
    },
    {
      icon: TrendingUp,
      value: `${progress}%`,
      label: 'Progresso',
      color: 'text-netflix-gold',
      bgColor: 'bg-netflix-gold/15',
      borderColor: 'border-netflix-gold/30'
    }
  ];

  return (
    <div className="bg-netflix-dark/80 rounded-2xl p-6 border border-white/10 backdrop-blur-sm animate-fade-in mb-8 sm:mb-12">
      <h3 className="text-xl font-semibold text-white mb-6 text-center">Resumo Geral</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.label}
              className={`
                text-center p-4 rounded-xl border transition-all duration-300 hover:scale-105
                ${item.bgColor} ${item.borderColor}
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${item.color} mx-auto mb-3`} />
              <div className={`text-2xl sm:text-3xl font-bold ${item.color} mb-1`}>
                {item.value}
              </div>
              <div className="text-sm text-gray-300 font-medium">{item.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GeneralSummary;
