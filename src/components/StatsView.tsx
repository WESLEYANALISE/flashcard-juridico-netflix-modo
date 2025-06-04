
import { useMemo } from 'react';
import { TrendingUp, Target, Award, Clock, BookOpen, Brain, Zap, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Flashcard } from '@/types/flashcard';
import { categories } from '@/data/flashcards';

interface StatsViewProps {
  flashcards: Flashcard[];
}

const StatsView = ({ flashcards }: StatsViewProps) => {
  const stats = useMemo(() => {
    const totalCards = flashcards.length;
    const studiedCards = flashcards.filter(card => card.studied).length;
    const totalCorrect = flashcards.reduce((sum, card) => sum + card.correctAnswers, 0);
    const totalAttempts = flashcards.reduce((sum, card) => sum + card.totalAttempts, 0);
    const accuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

    // Calculate streak (simplified - consecutive correct answers)
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    flashcards.forEach(card => {
      if (card.totalAttempts > 0) {
        const cardAccuracy = (card.correctAnswers / card.totalAttempts) * 100;
        if (cardAccuracy >= 75) {
          tempStreak++;
          maxStreak = Math.max(maxStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }
    });

    currentStreak = tempStreak;

    // Category breakdown
    const categoryStats = categories.map(category => {
      const categoryCards = flashcards.filter(card => card.category === category.id);
      const categoryStudied = categoryCards.filter(card => card.studied).length;
      const categoryCorrect = categoryCards.reduce((sum, card) => sum + card.correctAnswers, 0);
      const categoryAttempts = categoryCards.reduce((sum, card) => sum + card.totalAttempts, 0);
      
      return {
        ...category,
        total: categoryCards.length,
        studied: categoryStudied,
        accuracy: categoryAttempts > 0 ? (categoryCorrect / categoryAttempts) * 100 : 0,
        progress: categoryCards.length > 0 ? (categoryStudied / categoryCards.length) * 100 : 0
      };
    });

    // Performance by difficulty
    const difficultyStats = ['Fácil', 'Médio', 'Difícil'].map(difficulty => {
      const difficultyCards = flashcards.filter(card => card.difficulty === difficulty);
      const correct = difficultyCards.reduce((sum, card) => sum + card.correctAnswers, 0);
      const attempts = difficultyCards.reduce((sum, card) => sum + card.totalAttempts, 0);
      
      return {
        difficulty,
        accuracy: attempts > 0 ? (correct / attempts) * 100 : 0,
        total: difficultyCards.length,
        studied: difficultyCards.filter(card => card.studied).length
      };
    });

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
  }, [flashcards]);

  const StatCard = ({ icon: Icon, title, value, subtitle, color, gradient }: any) => (
    <Card className="bg-netflix-dark/50 border-white/10 p-6 hover-lift glass-effect">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`p-3 rounded-lg ${gradient}`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="text-sm text-gray-400">{subtitle}</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{value}</div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-netflix-black px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Suas <span className="text-netflix-red">Estatísticas</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Acompanhe seu progresso e performance nos estudos jurídicos
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          <Card className="bg-netflix-dark/50 border-white/10 p-6 glass-effect">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Brain className="w-6 h-6 mr-3 text-purple-400" />
              Performance por Dificuldade
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.difficultyStats.map((difficulty, index) => {
                const colors = [
                  { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
                  { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
                  { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' }
                ];
                const color = colors[index];
                
                return (
                  <div key={difficulty.difficulty} className={`p-4 rounded-lg border ${color.bg} ${color.border}`}>
                    <div className="text-center">
                      <h4 className={`font-semibold ${color.text} mb-2`}>{difficulty.difficulty}</h4>
                      <div className={`text-2xl font-bold ${color.text} mb-1`}>
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
          <Card className="bg-netflix-dark/50 border-white/10 p-6 glass-effect">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Trophy className="w-6 h-6 mr-3 text-netflix-gold" />
              Progresso por Categoria
            </h3>
            
            <div className="space-y-6">
              {stats.categoryStats.map((category) => (
                <div key={category.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h4 className="font-semibold text-white">{category.name}</h4>
                        <p className="text-sm text-gray-400">
                          {category.studied}/{category.total} cards • {Math.round(category.accuracy)}% precisão
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">
                        {Math.round(category.progress)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-700"
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
          <Card className="bg-gradient-to-r from-netflix-red/20 to-netflix-gold/20 border-netflix-red/30 p-8 glass-effect">
            <Trophy className="w-16 h-16 text-netflix-gold mx-auto mb-4 animate-glow" />
            <h3 className="text-2xl font-bold text-white mb-2">Continue Estudando!</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
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
