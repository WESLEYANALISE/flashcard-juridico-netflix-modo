
import { Trophy, Target, Award, TrendingUp, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SessionStatsProps {
  stats: {
    correct: number;
    total: number;
    streak: number;
    maxStreak: number;
  };
  categoryName: string;
  onFinish: () => void;
  onContinue: () => void;
}

const SessionStats = ({ stats, categoryName, onFinish, onContinue }: SessionStatsProps) => {
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return { message: "Excelente! Você domina esta área!", color: "text-green-400" };
    if (accuracy >= 75) return { message: "Muito bem! Continue assim!", color: "text-blue-400" };
    if (accuracy >= 50) return { message: "Bom trabalho! Pode melhorar!", color: "text-yellow-400" };
    return { message: "Continue estudando! Você vai conseguir!", color: "text-orange-400" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-netflix-dark/50 rounded-2xl p-6 glass-effect animate-scale-in text-center">
          {/* Trophy Icon */}
          <div className="mb-6">
            <Trophy className="w-16 h-16 text-netflix-gold mx-auto animate-glow" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2">Sessão Concluída!</h2>
          <p className="text-gray-400 mb-6">{categoryName}</p>

          {/* Performance Message */}
          <div className="mb-6">
            <p className={`text-lg font-semibold ${performance.color}`}>
              {performance.message}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-500/20 rounded-lg p-4">
              <Award className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">{stats.correct}</div>
              <div className="text-xs text-gray-400">Acertos</div>
            </div>
            
            <div className="bg-blue-500/20 rounded-lg p-4">
              <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
            
            <div className="bg-orange-500/20 rounded-lg p-4">
              <TrendingUp className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-400">{stats.maxStreak}</div>
              <div className="text-xs text-gray-400">Sequência</div>
            </div>
            
            <div className="bg-purple-500/20 rounded-lg p-4">
              <Award className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400">{accuracy}%</div>
              <div className="text-xs text-gray-400">Precisão</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onContinue}
              className="w-full bg-netflix-red hover:bg-netflix-red/80 text-white font-semibold py-3 rounded-xl transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Estudar Novamente
            </Button>
            
            <Button
              onClick={onFinish}
              variant="outline"
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 font-semibold py-3 rounded-xl transition-all duration-300"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Escolher Nova Categoria
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionStats;
