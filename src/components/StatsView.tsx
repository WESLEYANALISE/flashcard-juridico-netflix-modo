
import { useMemo } from 'react';
import { TrendingUp, Target, Award, Clock, BookOpen, Brain, Zap, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useFlashcards, useFlashcardAreas } from '@/hooks/useFlashcards';
import GeneralSummary from './GeneralSummary';

const StatsView = () => {
  const { data: supabaseFlashcards = [], isLoading } = useFlashcards();
  const { data: areas = [] } = useFlashcardAreas();

  const stats = useMemo(() => {
    if (!supabaseFlashcards.length) {
      return {
        totalCards: 0,
        studiedCards: 0,
        accuracy: 0,
        currentStreak: 0,
        maxStreak: 0,
        categoryStats: [],
        difficultyStats: [],
        totalCorrect: 0,
        totalAttempts: 0
      };
    }

    const totalCards = supabaseFlashcards.length;
    
    // Simulate some study progress for demonstration
    const studiedCards = Math.floor(totalCards * 0.4); // 40% studied
    const totalAttempts = studiedCards * 2; // Average 2 attempts per studied card
    const totalCorrect = Math.floor(totalAttempts * 0.75); // 75% accuracy
    const accuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

    // Category breakdown by areas
    const categoryStats = areas.map(area => {
      const areaCards = supabaseFlashcards.filter(card => card.area === area);
      const areaStudied = Math.floor(areaCards.length * (0.3 + Math.random() * 0.4)); // 30-70% studied
      const areaAttempts = areaStudied * 2;
      const areaCorrect = Math.floor(areaAttempts * (0.6 + Math.random() * 0.3)); // 60-90% accuracy
      
      // Generate category icons and colors
      const categoryIcons = ['⚖️', '📋', '🏛️', '🔒', '👥', '💼', '🏠', '🚗'];
      const categoryColors = ['#E50914', '#4C7BF4', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4', '#84CC16'];
      
      return {
        id: area,
        name: area,
        icon: categoryIcons[Math.floor(Math.random() * categoryIcons.length)],
        color: categoryColors[Math.floor(Math.random() * categoryColors.length)],
        total: areaCards.length,
        studied: areaStudied,
        accuracy: areaAttempts > 0 ? (areaCorrect / areaAttempts) * 100 : 0,
        progress: areaCards.length > 0 ? (areaStudied / areaCards.length) * 100 : 0
      };
    });

    // Performance by difficulty (simulated)
    const difficultyStats = ['Fácil', 'Médio', 'Difícil'].map((difficulty, index) => {
      const difficultyCards = Math.floor(totalCards / 3);
      const studied = Math.floor(difficultyCards * (0.5 - index * 0.1)); // Easier = more studied
      const attempts = studied * 2;
      const correct = Math.floor(attempts * (0.9 - index * 0.15)); // Easier = higher accuracy
      
      return {
        difficulty,
        accuracy: attempts > 0 ? (correct / attempts) * 100 : 0,
        total: difficultyCards,
        studied
      };
    });

    // Simple streak calculation
    const currentStreak = Math.floor(Math.random() * 15) + 1;
    const maxStreak = currentStreak + Math.floor(Math.random() * 10);

    return {
      totalCards,
      studiedCards,
      accuracy,
      currentStreak,
      maxStreak,
      categoryStats,
      difficultyStats,
      totalCorrect,
      totalAttempts
    };
  }, [supabaseFlashcards, areas]);

  // Convert to flashcard format for GeneralSummary
  const flashcardsForSummary = supabaseFlashcards.map(card => ({
    id: card.id.toString(),
    question: card.pergunta,
    answer: card.resposta,
    category: card.area,
    difficulty: 'Médio' as const,
    studied: Math.random() > 0.6, // Random studied status
    correctAnswers: Math.floor(Math.random() * 3),
    totalAttempts: Math.floor(Math.random() * 5) + 1,
    lastStudied: undefined,
  }));

  const categoriesForSummary = areas.map(area => ({
    id: area,
    name: area,
    icon: '⚖️',
    color: '#E50914',
    description: `Flashcards de ${area}`
  }));

  const StatCard = ({ icon: Icon, title, value, subtitle, color, gradient }: any) => (
    <Card className="bg-netflix-dark/50 border-white/10 p-4 sm:p-6 hover-lift glass-effect group cursor-pointer active:scale-95 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`p-2 sm:p-3 rounded-lg ${gradient} group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color} group-hover:animate-pulse`} />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm sm:text-base group-hover:text-netflix-red transition-colors duration-300">{title}</h3>
              <p className="text-xs sm:text-sm text-gray-400">{subtitle}</p>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white group-hover:scale-105 transition-transform duration-300">{value}</div>
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-white text-xl">Carregando estatísticas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black px-2 sm:px-4 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto">
        {/* General Summary at top */}
        <GeneralSummary flashcards={flashcardsForSummary} categories={categoriesForSummary} />

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4">
            Suas <span className="text-netflix-red">Estatísticas</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Acompanhe seu progresso e performance nos estudos jurídicos
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <StatCard
              icon={BookOpen}
              title="Total de Cards"
              value={stats.totalCards}
              subtitle="Cards disponíveis"
              color="text-blue-400"
              gradient="bg-blue-500/20"
            />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <StatCard
              icon={Target}
              title="Cards Estudados"
              value={stats.studiedCards}
              subtitle={`${Math.round((stats.studiedCards / stats.totalCards) * 100) || 0}% do total`}
              color="text-green-400"
              gradient="bg-green-500/20"
            />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <StatCard
              icon={Award}
              title="Precisão"
              value={`${Math.round(stats.accuracy)}%`}
              subtitle={`${stats.totalCorrect}/${stats.totalAttempts} acertos`}
              color="text-netflix-red"
              gradient="bg-red-500/20"
            />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <StatCard
              icon={Zap}
              title="Sequência Atual"
              value={stats.currentStreak}
              subtitle={`Máxima: ${stats.maxStreak}`}
              color="text-netflix-gold"
              gradient="bg-yellow-500/20"
            />
          </div>
        </div>

        {/* Performance by Difficulty */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <Card className="bg-netflix-dark/50 border-white/10 p-4 sm:p-6 glass-effect">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-6 flex items-center">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-purple-400" />
              Performance por Dificuldade
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {stats.difficultyStats.map((difficulty, index) => {
                const colors = [
                  { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
                  { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
                  { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' }
                ];
                const color = colors[index];
                
                return (
                  <div key={difficulty.difficulty} className={`p-4 rounded-lg border ${color.bg} ${color.border} hover:scale-105 transition-transform duration-300 cursor-pointer group`}>
                    <div className="text-center">
                      <h4 className={`font-semibold ${color.text} mb-2 group-hover:animate-pulse`}>{difficulty.difficulty}</h4>
                      <div className={`text-xl sm:text-2xl font-bold ${color.text} mb-1`}>
                        {Math.round(difficulty.accuracy)}%
                      </div>
                      <p className="text-xs text-gray-400">
                        {difficulty.studied}/{difficulty.total} estudados
                      </p>
                      
                      <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-700 ${
                            index === 0 ? 'bg-green-400' : 
                            index === 1 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${difficulty.accuracy}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Progress by Category */}
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Card className="bg-netflix-dark/50 border-white/10 p-4 sm:p-6 glass-effect">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-6 flex items-center">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-netflix-gold" />
              Progresso por Categoria
            </h3>
            
            <div className="space-y-4 sm:space-y-6">
              {stats.categoryStats.map((category) => (
                <div key={category.id} className="space-y-3 group hover:bg-white/5 p-3 rounded-lg transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300">{category.icon}</span>
                      <div>
                        <h4 className="font-semibold text-white text-sm sm:text-base group-hover:text-netflix-red transition-colors duration-300">{category.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-400">
                          {category.studied}/{category.total} cards • {Math.round(category.accuracy)}% precisão
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-bold text-white group-hover:scale-110 transition-transform duration-300">
                        {Math.round(category.progress)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
                    <div
                      className="h-2 sm:h-3 rounded-full transition-all duration-700 group-hover:animate-pulse"
                      style={{
                        width: `${category.progress}%`,
                        background: `linear-gradient(90deg, ${category.color} 0%, ${category.color}80 100%)`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Achievement Section */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <Card className="bg-gradient-to-r from-netflix-red/20 to-netflix-gold/20 border-netflix-red/30 p-6 sm:p-8 glass-effect hover:scale-105 transition-all duration-300 cursor-pointer group">
            <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-netflix-gold mx-auto mb-4 animate-glow group-hover:animate-bounce" />
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-netflix-red transition-colors duration-300">Continue Estudando!</h3>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
              Você está no caminho certo para dominar o direito. 
              {stats.studiedCards === stats.totalCards 
                ? ' Parabéns! Você completou todos os flashcards!' 
                : ` Faltam apenas ${stats.totalCards - stats.studiedCards} cards para completar 100%!`
              }
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StatsView;
