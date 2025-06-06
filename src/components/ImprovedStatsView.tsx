import React, { useMemo } from 'react';
import { TrendingUp, Target, Award, Clock, BookOpen, Brain, Zap, Trophy, AlertTriangle, CheckCircle2, BarChart3, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFlashcards, useFlashcardAreas } from '@/hooks/useFlashcards';
import { useUserStatistics } from '@/hooks/useRealUserProgress';
import { generateCategoriesFromAreas } from '@/utils/flashcardMapper';
import GeneralSummary from './GeneralSummary';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface ImprovedStatsViewProps {
  onBack?: () => void;
}

const ImprovedStatsView = ({ onBack }: ImprovedStatsViewProps) => {
  const { data: supabaseFlashcards = [], isLoading } = useFlashcards();
  const { data: areas = [] } = useFlashcardAreas();
  const { data: userStats } = useUserStatistics();

  const chartData = useMemo(() => {
    if (!userStats?.areaStats) return [];

    return Object.entries(userStats.areaStats).map(([area, stats]: [string, any]) => ({
      area: area.length > 15 ? area.substring(0, 15) + '...' : area,
      fullArea: area,
      studied: stats.studied,
      mastered: stats.mastered,
      needsReview: stats.needsReview,
      accuracy: stats.accuracy,
    }));
  }, [userStats]);

  const pieData = useMemo(() => {
    if (!userStats) return [];

    return [
      { name: 'Dominados', value: userStats.mastered, color: '#22C55E' },
      { name: 'Precisa Revisar', value: userStats.needsReview, color: '#F59E0B' },
      { name: 'Não Estudados', value: Math.max(0, supabaseFlashcards.length - userStats.totalStudied), color: '#6B7280' },
    ].filter(item => item.value > 0);
  }, [userStats, supabaseFlashcards]);

  const progressData = useMemo(() => {
    if (!userStats?.areaStats) return [];

    return Object.entries(userStats.areaStats).map(([area, stats]: [string, any]) => ({
      area: area.length > 12 ? area.substring(0, 12) + '...' : area,
      progress: stats.studied > 0 ? Math.round((stats.mastered / stats.studied) * 100) : 0,
    }));
  }, [userStats]);

  // Convert to flashcard format for GeneralSummary
  const flashcardsForSummary = supabaseFlashcards.map(card => ({
    id: card.id.toString(),
    question: card.pergunta,
    answer: card.resposta,
    category: card.area,
    difficulty: 'Médio' as const,
    studied: false, // Will be updated with real data
    correctAnswers: 0,
    totalAttempts: 0,
    lastStudied: undefined,
  }));

  const categoriesForSummary = areas.map(area => {
    const categoryIcons: Record<string, string> = {
      'Direito Civil': '⚖️',
      'Direito Penal': '🔒',
      'Direito Constitucional': '📜',
      'Direito Administrativo': '🏛️',
      'Direito Trabalhista': '👷',
      'Direito Empresarial': '🏢',
      'Direito Tributário': '💰',
      'Direito Processual': '📋',
      'Direito Internacional': '🌍',
      'Direito Ambiental': '🌱',
    };

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

    return {
      id: area,
      name: area,
      icon: categoryIcons[area] || '📚',
      color: categoryColors[area] || '#E50914',
      description: `Flashcards de ${area}`
    };
  });

  const StatCard = ({ icon: Icon, title, value, subtitle, color, gradient, trend }: any) => (
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
          <div className="flex items-center space-x-2">
            <div className="text-2xl sm:text-3xl font-bold text-white group-hover:scale-105 transition-transform duration-300">{value}</div>
            {trend && (
              <div className={`text-xs px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </div>
            )}
          </div>
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
        {/* Back Button */}
        {onBack && (
          <div className="mb-6">
            <Button 
              onClick={onBack} 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </Button>
          </div>
        )}

        <GeneralSummary flashcards={flashcardsForSummary} categories={categoriesForSummary} />

        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4">
            Suas <span className="text-netflix-red">Estatísticas</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Acompanhe seu progresso real nos estudos jurídicos
          </p>
        </div>

        {/* Stats Cards com dados reais */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <StatCard
              icon={BookOpen}
              title="Total de Cards"
              value={supabaseFlashcards.length}
              subtitle="Disponíveis"
              color="text-blue-400"
              gradient="bg-blue-500/20"
            />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <StatCard
              icon={Target}
              title="Estudados"
              value={userStats?.totalStudied || 0}
              subtitle={`${userStats?.totalStudied ? Math.round((userStats.totalStudied / supabaseFlashcards.length) * 100) : 0}% do total`}
              color="text-green-400"
              gradient="bg-green-500/20"
            />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <StatCard
              icon={Award}
              title="Precisão"
              value={`${userStats?.accuracy || 0}%`}
              subtitle={`${userStats?.totalCorrect || 0}/${userStats?.totalAttempts || 0} acertos`}
              color="text-netflix-red"
              gradient="bg-red-500/20"
            />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <StatCard
              icon={Zap}
              title="Sequência"
              value={userStats?.currentStreak || 0}
              subtitle="Acertos consecutivos"
              color="text-netflix-gold"
              gradient="bg-yellow-500/20"
            />
          </div>
        </div>

        {/* Cards que Domina vs Precisa Revisar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <Card className="bg-netflix-dark/50 border-white/10 p-6 glass-effect">
            <div className="flex items-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Cards que Domina</h3>
            </div>
            <div className="text-3xl font-bold text-green-400 mb-2">{userStats?.mastered || 0}</div>
            <p className="text-gray-400 text-sm">
              {userStats?.totalStudied ? Math.round((userStats.mastered / userStats.totalStudied) * 100) : 0}% dos cards estudados
            </p>
            <div className="mt-4 w-full bg-gray-700 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700"
                style={{ 
                  width: `${userStats?.totalStudied ? (userStats.mastered / userStats.totalStudied) * 100 : 0}%` 
                }}
              />
            </div>
          </Card>

          <Card className="bg-netflix-dark/50 border-white/10 p-6 glass-effect">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Precisa Revisar</h3>
            </div>
            <div className="text-3xl font-bold text-amber-400 mb-2">{userStats?.needsReview || 0}</div>
            <p className="text-gray-400 text-sm">
              {userStats?.totalStudied ? Math.round((userStats.needsReview / userStats.totalStudied) * 100) : 0}% dos cards estudados
            </p>
            <div className="mt-4 w-full bg-gray-700 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700"
                style={{ 
                  width: `${userStats?.totalStudied ? (userStats.needsReview / userStats.totalStudied) * 100 : 0}%` 
                }}
              />
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {/* Bar Chart - Cards por Área */}
          <Card className="bg-netflix-dark/50 border-white/10 p-6 glass-effect">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-3 text-netflix-gold" />
              Cards Estudados por Área
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="area" 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                    formatter={(value, name) => [value, name === 'studied' ? 'Estudados' : name === 'mastered' ? 'Dominados' : 'Precisa Revisar']}
                    labelFormatter={(label) => {
                      const item = chartData.find(d => d.area === label);
                      return item?.fullArea || label;
                    }}
                  />
                  <Bar dataKey="studied" fill="#3B82F6" name="studied" />
                  <Bar dataKey="mastered" fill="#22C55E" name="mastered" />
                  <Bar dataKey="needsReview" fill="#F59E0B" name="needsReview" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Pie Chart - Distribuição Geral */}
          <Card className="bg-netflix-dark/50 border-white/10 p-6 glass-effect">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-3 text-netflix-gold" />
              Distribuição dos Cards
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Progress by Category com dados reais */}
        <div className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <Card className="bg-netflix-dark/50 border-white/10 p-4 sm:p-6 glass-effect">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-6 flex items-center">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-netflix-gold" />
              Progresso Detalhado por Categoria
            </h3>
            
            <div className="space-y-4 sm:space-y-6">
              {Object.entries(userStats?.areaStats || {}).map(([areaName, stats]: [string, any]) => {
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

                const categoryIcons: Record<string, string> = {
                  'Direito Civil': '⚖️',
                  'Direito Penal': '🔒',
                  'Direito Constitucional': '📜',
                  'Direito Administrativo': '🏛️',
                  'Direito Trabalhista': '👷',
                  'Direito Empresarial': '🏢',
                  'Direito Tributário': '💰',
                  'Direito Processual': '📋',
                  'Direito Internacional': '🌍',
                  'Direito Ambiental': '🌱',
                };

                const color = categoryColors[areaName] || '#E50914';
                const icon = categoryIcons[areaName] || '📚';
                const totalCardsInArea = supabaseFlashcards.filter(card => card.area === areaName).length;
                const progress = totalCardsInArea > 0 ? (stats.studied / totalCardsInArea) * 100 : 0;

                return (
                  <div key={areaName} className="space-y-3 group hover:bg-white/5 p-3 rounded-lg transition-all duration-300 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
                        <div>
                          <h4 className="font-semibold text-white text-sm sm:text-base group-hover:text-netflix-red transition-colors duration-300">{areaName}</h4>
                          <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-400">
                            <span>{stats.studied}/{totalCardsInArea} estudados</span>
                            <span className="text-green-400">{stats.mastered} dominados</span>
                            <span className="text-amber-400">{stats.needsReview} para revisar</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base sm:text-lg font-bold text-white group-hover:scale-110 transition-transform duration-300">
                          {Math.round(progress)}%
                        </div>
                        <div className="text-xs text-gray-400">
                          {stats.accuracy}% precisão
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
                      <div
                        className="h-2 sm:h-3 rounded-full transition-all duration-700 group-hover:animate-pulse"
                        style={{
                          width: `${progress}%`,
                          background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <Card className="bg-gradient-to-r from-netflix-red/20 to-netflix-gold/20 border-netflix-red/30 p-6 sm:p-8 glass-effect hover:scale-105 transition-all duration-300 cursor-pointer group">
            <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-netflix-gold mx-auto mb-4 animate-glow group-hover:animate-bounce" />
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-netflix-red transition-colors duration-300">Continue Estudando!</h3>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
              Você está progredindo bem! 
              {(userStats?.needsReview || 0) > 0 
                ? ` Você tem ${userStats?.needsReview} cards para revisar e fortalecer seu conhecimento.` 
                : ' Continue assim para dominar todas as áreas do direito!'
              }
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImprovedStatsView;
