
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
            className="bg-netflix-dark/80 border-white/20 text-white hover:bg-netflix-dark hover:border-white/40 flex items-center space-x-2 backdrop-blur-sm"
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
          <p className="text-lg text-gray-300 mb-6">
            Escolha os temas de {area} que deseja estudar
          </p>
          
          {/* Quick Actions */}
          <div className="flex justify-center space-x-4 mb-8">
            <Button 
              onClick={handleSelectAll} 
              variant="outline" 
              size="sm"
              className="bg-netflix-dark/80 border-white/20 text-white hover:bg-netflix-dark hover:border-white/40 backdrop-blur-sm"
            >
              Selecionar Todos
            </Button>
            <Button 
              onClick={handleClearAll} 
              variant="outline" 
              size="sm"
              className="bg-netflix-dark/80 border-white/20 text-white hover:bg-netflix-dark hover:border-white/40 backdrop-blur-sm"
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
                  bg-netflix-dark/60 border-2 backdrop-blur-sm
                  ${isSelected 
                    ? 'border-opacity-100 shadow-2xl ring-4 ring-opacity-30' 
                    : 'border-white/10 hover:border-white/20 hover:scale-105'
                  }
                `}
                style={{
                  ...(isSelected && { 
                    borderColor: areaColor,
                    '--tw-ring-color': `${areaColor}50`
                  }),
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Selection Indicator */}
                <div className="absolute top-4 right-4">
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                    ${isSelected 
                      ? 'border-white bg-white' 
                      : 'border-gray-400'
                    }
                  `}>
                    {isSelected && (
                      <CheckCircle className="w-4 h-4" style={{ color: areaColor }} />
                    )}
                  </div>
                </div>

                {/* Theme Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-3 pr-8 leading-tight">
                    {theme}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div className="text-gray-300">
                      <span className="block text-xs text-gray-400">Cards</span>
                      <span className="font-medium">{stats.total}</span>
                    </div>
                    <div className="text-gray-300">
                      <span className="block text-xs text-gray-400">Estudados</span>
                      <span className="font-medium">{stats.studied}</span>
                    </div>
                    {stats.accuracy > 0 && (
                      <div className="text-gray-300 col-span-2">
                        <span className="block text-xs text-gray-400">Precisão</span>
                        <span className="font-medium">{stats.accuracy}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-netflix-gray/50 rounded-full h-2 mb-2">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: areaColor
                    }}
                  />
                </div>
                
                <div className="text-xs text-gray-400">
                  {Math.round(progress)}% completo
                </div>

                {/* Accent Border when Selected */}
                {isSelected && (
                  <div 
                    className="absolute top-0 left-0 w-full h-1 rounded-t-xl"
                    style={{ backgroundColor: areaColor }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Start Study Button */}
        <div className="text-center">
          <Button
            onClick={handleStartStudy}
            disabled={selectedThemes.length === 0}
            className="bg-netflix-red hover:bg-netflix-red/80 text-white px-8 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto transition-all duration-300"
          >
            <Play className="w-5 h-5" />
            <span>Iniciar Estudo ({selectedThemes.length} temas)</span>
          </Button>
          
          {selectedThemes.length === 0 && (
            <p className="text-gray-400 text-sm mt-3">
              Selecione pelo menos um tema para começar
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImprovedThemeSelector;
