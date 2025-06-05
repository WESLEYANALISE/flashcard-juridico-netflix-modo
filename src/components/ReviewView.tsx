
import React, { useState, useMemo } from 'react';
import { ArrowLeft, RefreshCw, Target, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCardsNeedingReview, useUserProgressByArea } from '@/hooks/useRealUserProgress';
import { useFlashcards } from '@/hooks/useFlashcards';
import { generateCategoriesFromAreas, mapSupabaseFlashcard } from '@/utils/flashcardMapper';

interface ReviewViewProps {
  onStudyReview: (area: string, themes: string[]) => void;
  onBack: () => void;
}

const ReviewView = ({ onStudyReview, onBack }: ReviewViewProps) => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const { data: cardsNeedingReview = [] } = useCardsNeedingReview();
  const { data: allFlashcards = [] } = useFlashcards();

  // Group cards by area
  const reviewByArea = useMemo(() => {
    const areaMap = new Map<string, any>();
    
    cardsNeedingReview.forEach(progress => {
      if (!areaMap.has(progress.area)) {
        areaMap.set(progress.area, {
          area: progress.area,
          cards: [],
          themes: new Set<string>(),
          urgentCount: 0,
          oldestDate: progress.last_studied
        });
      }
      
      const areaData = areaMap.get(progress.area)!;
      areaData.cards.push(progress);
      if (progress.tema) areaData.themes.add(progress.tema);
      
      // Check if card is urgent (low accuracy or old)
      const accuracy = progress.total_attempts > 0 ? 
        (progress.correct_answers / progress.total_attempts) : 0;
      const daysSinceStudied = Math.floor(
        (Date.now() - new Date(progress.last_studied).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (accuracy < 0.5 || daysSinceStudied > 7) {
        areaData.urgentCount++;
      }
      
      // Track oldest date
      if (new Date(progress.last_studied) < new Date(areaData.oldestDate)) {
        areaData.oldestDate = progress.last_studied;
      }
    });

    return Array.from(areaMap.values()).map(area => ({
      ...area,
      themes: Array.from(area.themes),
      daysSinceOldest: Math.floor(
        (Date.now() - new Date(area.oldestDate).getTime()) / (1000 * 60 * 60 * 24)
      )
    }));
  }, [cardsNeedingReview]);

  const totalCardsNeedingReview = cardsNeedingReview.length;
  const urgentCards = reviewByArea.reduce((sum, area) => sum + area.urgentCount, 0);

  const getAreaColor = (areaName: string) => {
    const categoryColors: Record<string, string> = {
      'Direito Civil': '#E50914',
      'Direito Penal': '#FFD700',
      'Direito Constitucional': '#00D4AA',
      'Direito Administrativo': '#FF6B35',
      'Direito Trabalhista': '#8B5CF6',
      'Direito Empresarial': '#06B6D4',
      'Direito Tributário': '#F59E0B',
      'Direito Processual': '#EF4444',
      'Direito Internacional': '#10B981',
      'Direito Ambiental': '#22C55E',
    };
    return categoryColors[areaName] || '#E50914';
  };

  const getPriorityLevel = (area: any) => {
    if (area.urgentCount > area.cards.length * 0.7) return 'high';
    if (area.urgentCount > area.cards.length * 0.4) return 'medium';
    return 'low';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-600 to-red-500';
      case 'medium': return 'from-yellow-600 to-yellow-500';
      case 'low': return 'from-green-600 to-green-500';
      default: return 'from-gray-600 to-gray-500';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta Prioridade';
      case 'medium': return 'Prioridade Média';
      case 'low': return 'Prioridade Baixa';
      default: return 'Revisar';
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black px-2 sm:px-4 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4">
              Área de <span className="text-netflix-red">Revisão</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-4">
              Revise os cards que precisam de mais atenção
            </p>
          </div>
          <div className="w-20"></div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card className="bg-netflix-dark/50 border-white/10 p-6 text-center">
            <RefreshCw className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {totalCardsNeedingReview}
            </div>
            <div className="text-sm text-gray-400">Cards para Revisar</div>
          </Card>

          <Card className="bg-netflix-dark/50 border-white/10 p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-red-400 mb-1">
              {urgentCards}
            </div>
            <div className="text-sm text-gray-400">Urgentes</div>
          </Card>

          <Card className="bg-netflix-dark/50 border-white/10 p-6 text-center">
            <Target className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-400 mb-1">
              {reviewByArea.length}
            </div>
            <div className="text-sm text-gray-400">Áreas</div>
          </Card>
        </div>

        {/* Review Areas */}
        {totalCardsNeedingReview === 0 ? (
          <Card className="bg-netflix-dark/50 border-white/10 p-8 text-center">
            <Target className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Parabéns! 🎉
            </h3>
            <p className="text-gray-400 text-lg">
              Você não tem cards para revisar no momento. Continue estudando para manter seu progresso!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviewByArea.map((area, index) => {
              const priority = getPriorityLevel(area);
              const areaColor = getAreaColor(area.area);
              
              return (
                <Card
                  key={area.area}
                  className="bg-netflix-dark/50 border-white/10 p-6 hover:scale-105 transition-all duration-300 cursor-pointer group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => onStudyReview(area.area, area.themes)}
                >
                  {/* Priority Badge */}
                  <div className={`
                    inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4
                    bg-gradient-to-r ${getPriorityColor(priority)} text-white
                  `}>
                    {getPriorityText(priority)}
                  </div>

                  {/* Area Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-netflix-red transition-colors">
                    {area.area}
                  </h3>

                  {/* Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Cards para revisar:</span>
                      <span className="text-yellow-400 font-semibold">{area.cards.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Urgentes:</span>
                      <span className="text-red-400 font-semibold">{area.urgentCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Temas:</span>
                      <span className="text-gray-300">{area.themes.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Último estudo:</span>
                      <span className="text-gray-300">{area.daysSinceOldest} dias</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min((area.urgentCount / area.cards.length) * 100, 100)}%`,
                        background: `linear-gradient(90deg, ${areaColor}, ${areaColor}80)`
                      }}
                    />
                  </div>

                  {/* Themes Preview */}
                  {area.themes.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs text-gray-400">Temas principais:</div>
                      <div className="flex flex-wrap gap-1">
                        {area.themes.slice(0, 3).map((theme: string) => (
                          <span
                            key={theme}
                            className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-300"
                          >
                            {theme}
                          </span>
                        ))}
                        {area.themes.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-400">
                            +{area.themes.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    className={`
                      w-full mt-4 font-semibold transition-all duration-300
                      bg-gradient-to-r ${getPriorityColor(priority)}
                      hover:scale-105 text-white
                    `}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Revisar Agora
                  </Button>
                </Card>
              );
            })}
          </div>
        )}

        {/* Review Tips */}
        <Card className="mt-8 bg-gradient-to-r from-netflix-red/20 to-netflix-gold/20 border-netflix-red/30 p-6 sm:p-8">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-netflix-gold mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Dicas para uma Revisão Eficaz
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm text-gray-300">
              <div className="text-center">
                <Clock className="w-6 h-6 text-netflix-gold mx-auto mb-2" />
                <div className="font-semibold mb-1">Revisão Espaçada</div>
                <div>Revise cards antigos regularmente para fortalecer a memória</div>
              </div>
              <div className="text-center">
                <Target className="w-6 h-6 text-netflix-gold mx-auto mb-2" />
                <div className="font-semibold mb-1">Foque no Difícil</div>
                <div>Priorize cards com baixa taxa de acerto</div>
              </div>
              <div className="text-center">
                <RefreshCw className="w-6 h-6 text-netflix-gold mx-auto mb-2" />
                <div className="font-semibold mb-1">Prática Consistente</div>
                <div>Revise um pouco todos os dias</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReviewView;
