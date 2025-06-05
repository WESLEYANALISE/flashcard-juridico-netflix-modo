
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
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  
  const {
    data: flashcards = [],
    isLoading
  } = useFlashcardsByArea(area);
  
  const {
    data: userProgress = []
  } = useUserProgressByArea(area);

  // Get unique themes and sort them alphabetically
  const themes = [...new Set(flashcards.map(card => card.tema).filter(Boolean))].sort();

  // Show floating button when themes are selected
  useEffect(() => {
    setShowFloatingButton(selectedThemes.length > 0);
  }, [selectedThemes]);

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
        ? Math.round(themeProgress.reduce((sum, p) => sum + p.correct_answers, 0) / themeProgress.reduce((sum, p) => sum + p.total_attempts, 0) * 100) || 0 
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
    <div className="min-h-screen bg-netflix-black px-2 sm:px-4 py-4 sm:py-8 relative">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 py-[24px]">
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
        <div className="text-center mb-8 px-[6px]">
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
            const progress = stats.total > 0 ? stats.studied / stats.total * 100 : 0;
            
            return (
              <div 
                key={theme}
                onClick={() => handleThemeToggle(theme)}
                className={`
                  relative p-6 rounded-xl cursor-pointer transition-all duration-300 
                  bg-netflix-dark/60 border-2 hover:scale-[1.02] transform-gpu
                  animate-fade-in hover:shadow-lg
                  ${isSelected 
                    ? `border-2 shadow-lg` 
                    : 'border-white/10 hover:border-white/20'
                  }
                `}
                style={{
                  borderColor: isSelected ? areaColor : undefined,
                  boxShadow: isSelected ? `0 0 20px ${areaColor}40` : undefined,
                  animationDelay: `${index * 0.05}s`,
                  animationFillMode: 'both'
                }}
              >
                {/* Selection Indicator */}
                <div className="absolute top-4 right-4">
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                    ${isSelected 
                      ? 'border-white bg-white' 
                      : 'border-white/50'
                    }
                  `}>
                    {isSelected && (
                      <CheckCircle 
                        className="w-4 h-4" 
                        style={{ color: areaColor }} 
                      />
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
              </div>
            );
          })}
        </div>

        {/* Floating Start Study Button */}
        {showFloatingButton && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
            <Button
              onClick={handleStartStudy}
              className="bg-netflix-red hover:bg-netflix-red/80 text-white px-8 py-4 text-lg font-semibold 
                         flex items-center space-x-3 rounded-full shadow-2xl hover:scale-105 
                         transition-all duration-300 border-2 border-netflix-red/50"
              style={{
                boxShadow: '0 10px 30px rgba(229, 9, 20, 0.4)'
              }}
            >
              <Play className="w-6 h-6" />
              <span>Iniciar Estudo ({selectedThemes.length})</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImprovedThemeSelector;
