
import { useState } from 'react';
import { Brain, Clock, Target, TrendingUp, Play, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCardsNeedingReview } from '@/hooks/useRealUserProgress';
import { useFlashcards } from '@/hooks/useFlashcards';

const ReviewView = () => {
  const { data: reviewCards = [] } = useCardsNeedingReview();
  const { data: allFlashcards = [] } = useFlashcards();

  // Group cards by area for review playlists
  const reviewByArea = reviewCards.reduce((acc, card) => {
    const area = card.area;
    if (!acc[area]) {
      acc[area] = [];
    }
    acc[area].push(card);
    return acc;
  }, {} as Record<string, typeof reviewCards>);

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

  // Calculate review urgency based on last studied date
  const getUrgencyLevel = (lastStudied: string) => {
    const daysSince = Math.floor((Date.now() - new Date(lastStudied).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince >= 7) return { level: 'high', text: 'Urgente', color: 'text-red-400' };
    if (daysSince >= 3) return { level: 'medium', text: 'Moderado', color: 'text-yellow-400' };
    return { level: 'low', text: 'Recente', color: 'text-green-400' };
  };

  const handleStartReview = (area: string) => {
    // This would navigate to study view with review mode
    console.log('Starting review for area:', area);
  };

  const totalReviewCards = reviewCards.length;
  const areasWithReview = Object.keys(reviewByArea).length;

  return (
    <div className="min-h-screen bg-netflix-black px-2 sm:px-4 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4">
            Central de <span className="text-netflix-red">Revisão</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Playlists automáticas para fortalecer seu conhecimento
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-netflix-dark/50 border-white/10 p-4 text-center">
            <Brain className="w-8 h-8 text-netflix-red mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{totalReviewCards}</div>
            <div className="text-sm text-gray-400">Cards para revisar</div>
          </Card>
          
          <Card className="bg-netflix-dark/50 border-white/10 p-4 text-center">
            <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{areasWithReview}</div>
            <div className="text-sm text-gray-400">Áreas com revisão</div>
          </Card>
          
          <Card className="bg-netflix-dark/50 border-white/10 p-4 text-center">
            <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {Math.ceil(totalReviewCards * 2.5)}min
            </div>
            <div className="text-sm text-gray-400">Tempo estimado</div>
          </Card>
          
          <Card className="bg-netflix-dark/50 border-white/10 p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {totalReviewCards > 0 ? Math.round((1 - totalReviewCards / allFlashcards.length) * 100) : 100}%
            </div>
            <div className="text-sm text-gray-400">Taxa de domínio</div>
          </Card>
        </div>

        {totalReviewCards === 0 ? (
          /* No Review Needed */
          <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 p-8 text-center">
            <Brain className="w-16 h-16 text-green-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold text-white mb-2">Parabéns!</h3>
            <p className="text-gray-300 mb-4">
              Você não tem cards para revisar no momento. Continue estudando novos conteúdos!
            </p>
            <Button 
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => window.location.href = '/'}
            >
              Estudar Novos Cards
            </Button>
          </Card>
        ) : (
          /* Review Playlists */
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Playlists de Revisão</h2>
            
            {Object.entries(reviewByArea).map(([area, cards], index) => {
              const areaColor = categoryColors[area] || '#E50914';
              const urgentCards = cards.filter(card => getUrgencyLevel(card.last_studied).level === 'high').length;
              const avgDaysAgo = Math.round(
                cards.reduce((sum, card) => 
                  sum + Math.floor((Date.now() - new Date(card.last_studied).getTime()) / (1000 * 60 * 60 * 24))
                , 0) / cards.length
              );

              return (
                <Card 
                  key={area}
                  className="bg-netflix-dark/50 border-white/10 p-6 hover:border-white/30 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: areaColor }}
                        />
                        <h3 className="text-xl font-semibold text-white">{area}</h3>
                        {urgentCards > 0 && (
                          <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">
                            {urgentCards} urgente{urgentCards > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-2xl font-bold text-white">{cards.length}</div>
                          <div className="text-sm text-gray-400">Cards para revisar</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-yellow-400">{avgDaysAgo}</div>
                          <div className="text-sm text-gray-400">Dias em média</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-400">
                            {Math.ceil(cards.length * 2.5)}min
                          </div>
                          <div className="text-sm text-gray-400">Tempo estimado</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold" style={{ color: areaColor }}>
                            {Math.round((cards.length / reviewCards.length) * 100)}%
                          </div>
                          <div className="text-sm text-gray-400">Do total</div>
                        </div>
                      </div>

                      {/* Recent Review Cards Preview */}
                      <div className="flex items-center space-x-2 mb-4">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">
                          Últimos estudados: {
                            cards
                              .sort((a, b) => new Date(b.last_studied).getTime() - new Date(a.last_studied).getTime())
                              .slice(0, 3)
                              .map(card => {
                                const daysSince = Math.floor((Date.now() - new Date(card.last_studied).getTime()) / (1000 * 60 * 60 * 24));
                                return `${daysSince}d atrás`;
                              })
                              .join(', ')
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={() => handleStartReview(area)}
                        className="bg-netflix-red hover:bg-netflix-red/80 text-white flex items-center space-x-2"
                        style={{ backgroundColor: areaColor }}
                      >
                        <Play className="w-4 h-4" />
                        <span>Iniciar Revisão</span>
                      </Button>
                      
                      <div className="text-center">
                        <div className={`text-sm font-medium ${getUrgencyLevel(
                          cards.sort((a, b) => new Date(a.last_studied).getTime() - new Date(b.last_studied).getTime())[0]?.last_studied || ''
                        ).color}`}>
                          {getUrgencyLevel(
                            cards.sort((a, b) => new Date(a.last_studied).getTime() - new Date(b.last_studied).getTime())[0]?.last_studied || ''
                          ).text}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewView;
