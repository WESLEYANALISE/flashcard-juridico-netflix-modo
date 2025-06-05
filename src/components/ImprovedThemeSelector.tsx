
import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlashcardsByArea } from '@/hooks/useFlashcardsByArea';
import { useUserProgressByArea } from '@/hooks/useRealUserProgress';

interface ImprovedThemeSelectorProps {
  area: string;
  areaColor: string;
  onThemesSelected: (themes: string[]) => void;
  onBack: () => void;
}

const ImprovedThemeSelector = ({
  area,
  areaColor,
  onThemesSelected,
  onBack
}: ImprovedThemeSelectorProps) => {
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const { data: flashcards = [], isLoading } = useFlashcardsByArea(area);
  const { data: userProgress = [] } = useUserProgressByArea(area);

  // Get unique themes and sort them alphabetically
  const themes = [...new Set(flashcards.map(card => card.tema).filter(Boolean))].sort();

  const handleThemeToggle = (theme: string) => {
    setSelectedThemes(prev => 
      prev.includes(theme) 
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
  };

  const handleSelectAll = () => {
    setSelectedThemes(themes);
  };

  const handleClearAll = () => {
    setSelectedThemes([]);
  };

  const handleStartStudy = () => {
    if (selectedThemes.length > 0) {
      onThemesSelected(selectedThemes);
    }
  };

  const getThemeStats = (theme: string) => {
    const themeCards = flashcards.filter(card => card.tema === theme);
    const themeProgress = userProgress.filter(p => p.tema === theme);
    
    return {
      total: themeCards.length,
      studied: themeProgress.length,
      accuracy: themeProgress.length > 0 
        ? Math.round((themeProgress.reduce((sum, p) => sum + p.correct_answers, 0) / 
           themeProgress.reduce((sum, p) => sum + p.total_attempts, 0)) * 100) || 0
        : 0
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-white text-xl">Carregando temas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black px-2 sm:px-4 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={onBack} 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Selecione os <span style={{ color: areaColor }}>Temas</span>
          </h1>
          <p className="text-lg text-gray-400 mb-6">
            Escolha os temas de {area} que deseja estudar
          </p>
          
          {/* Quick Actions */}
          <div className="flex justify-center space-x-4 mb-8">
            <Button 
              onClick={handleSelectAll} 
              variant="outline" 
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Selecionar Todos
            </Button>
            <Button 
              onClick={handleClearAll} 
              variant="outline" 
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Limpar Seleção
            </Button>
          </div>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {themes.map((theme, index) => {
            const isSelected = selectedThemes.includes(theme);
            const stats = getThemeStats(theme);
            const progress = stats.total > 0 ? (stats.studied / stats.total) * 100 : 0;
            
            return (
              <div
                key={theme}
                onClick={() => handleThemeToggle(theme)}
                className={`
                  relative p-6 rounded-xl cursor-pointer transition-all duration-300 hover-lift animate-fade-in
                  ${isSelected 
                    ? 'ring-2 shadow-2xl' 
                    : 'hover:scale-105'
                  }
                `}
                style={{
                  background: `linear-gradient(135deg, ${areaColor}20 0%, ${areaColor}10 100%)`,
                  ...(isSelected && { '--tw-ring-color': areaColor }),
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Selection Indicator */}
                <div className="absolute top-4 right-4">
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                    ${isSelected 
                      ? 'border-white bg-white' 
                      : 'border-white/50'
                    }
                  `}>
                    {isSelected && (
                      <CheckCircle className="w-4 h-4" style={{ color: areaColor }} />
                    )}
                  </div>
                </div>

                {/* Theme Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2 pr-8">
                    {theme}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <span>{stats.total} cards</span>
                    <span>{stats.studied} estudados</span>
                    {stats.accuracy > 0 && (
                      <span>{stats.accuracy}% precisão</span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, ${areaColor}, ${areaColor}80)`
                    }}
                  />
                </div>
                
                <div className="text-xs text-gray-500 mt-2">
                  {Math.round(progress)}% completo
                </div>

                {/* Hover Effect */}
                <div 
                  className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-xl pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${areaColor} 0%, transparent 70%)`
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Start Study Button */}
        <div className="text-center">
          <Button
            onClick={handleStartStudy}
            disabled={selectedThemes.length === 0}
            className="bg-netflix-red hover:bg-netflix-red/80 text-white px-8 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
          >
            <Play className="w-5 h-5" />
            <span>Iniciar Estudo ({selectedThemes.length} temas)</span>
          </Button>
          
          {selectedThemes.length === 0 && (
            <p className="text-gray-400 text-sm mt-2">
              Selecione pelo menos um tema para começar
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImprovedThemeSelector;
