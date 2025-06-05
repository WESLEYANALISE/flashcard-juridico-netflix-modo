
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SupabaseFlashcard } from '@/hooks/useFlashcards';
import { useFlashcardsByArea } from '@/hooks/useFlashcardsByArea';

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
  const [searchTerm, setSearchTerm] = useState('');
  const { data: flashcards = [], isLoading } = useFlashcardsByArea(area);

  const themes = useMemo(() => {
    const themeMap = new Map<string, number>();
    
    flashcards.forEach(card => {
      if (card.tema) {
        themeMap.set(card.tema, (themeMap.get(card.tema) || 0) + 1);
      }
    });

    return Array.from(themeMap.entries())
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => a.theme.localeCompare(b.theme));
  }, [flashcards]);

  const filteredThemes = useMemo(() => {
    return themes.filter(({ theme }) =>
      theme.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [themes, searchTerm]);

  const handleThemeToggle = (theme: string) => {
    setSelectedThemes(prev =>
      prev.includes(theme)
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
  };

  const handleSelectAll = () => {
    setSelectedThemes(filteredThemes.map(({ theme }) => theme));
  };

  const handleClearAll = () => {
    setSelectedThemes([]);
  };

  const totalSelectedCards = selectedThemes.reduce((total, theme) => {
    const themeData = themes.find(t => t.theme === theme);
    return total + (themeData?.count || 0);
  }, 0);

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
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Escolha os <span style={{ color: areaColor }}>Temas</span>
            </h1>
            <p className="text-gray-400 mt-1">{area}</p>
          </div>
          <div className="w-20"></div>
        </div>

        {/* Search and Filters */}
        <div className="bg-netflix-dark/50 rounded-xl p-4 mb-6 border border-white/10">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar temas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-netflix-red"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleSelectAll}
                variant="outline"
                size="sm"
                className="bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30"
              >
                Selecionar Todos
              </Button>
              <Button
                onClick={handleClearAll}
                variant="outline"
                size="sm"
                className="bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
              >
                Limpar
              </Button>
            </div>
          </div>

          {/* Selection Summary */}
          <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">
                {selectedThemes.length} tema(s) selecionado(s)
              </span>
              <span className="text-netflix-red font-semibold">
                {totalSelectedCards} cards
              </span>
            </div>
          </div>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredThemes.map(({ theme, count }, index) => {
            const isSelected = selectedThemes.includes(theme);
            
            return (
              <div
                key={theme}
                onClick={() => handleThemeToggle(theme)}
                className={`
                  relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 
                  animate-fade-in hover:scale-105 active:scale-95
                  ${isSelected
                    ? `border-[${areaColor}] bg-gradient-to-br from-white/10 to-transparent shadow-lg`
                    : 'border-white/20 bg-netflix-dark/50 hover:border-white/40'
                  }
                `}
                style={{
                  animationDelay: `${index * 0.05}s`,
                  borderColor: isSelected ? areaColor : undefined,
                  boxShadow: isSelected ? `0 0 20px ${areaColor}30` : undefined
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white text-sm leading-tight">
                    {theme}
                  </h3>
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                    ${isSelected ? 'bg-white border-white' : 'border-white/40'}
                  `}>
                    {isSelected && (
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: areaColor }} />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {count} card{count !== 1 ? 's' : ''}
                  </span>
                  <div className={`
                    text-xs px-2 py-1 rounded-full
                    ${isSelected ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-400'}
                  `}>
                    {Math.round((count / flashcards.length) * 100)}%
                  </div>
                </div>

                {/* Selection Animation */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <Button
            onClick={() => onThemesSelected(selectedThemes)}
            disabled={selectedThemes.length === 0}
            className={`
              px-8 py-4 text-lg font-bold rounded-full transition-all duration-300
              ${selectedThemes.length > 0
                ? 'bg-netflix-red hover:bg-netflix-red/80 hover:scale-105 text-white shadow-2xl'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Iniciar Estudo
            {selectedThemes.length > 0 && (
              <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-sm">
                {totalSelectedCards}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImprovedThemeSelector;
