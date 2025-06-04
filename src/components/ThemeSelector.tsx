
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Scale, Search } from 'lucide-react';
import { SupabaseFlashcard } from '@/hooks/useFlashcards';

interface ThemeSelectorProps {
  area: string;
  areaColor: string;
  flashcards: SupabaseFlashcard[];
  onThemesSelected: (themes: string[]) => void;
  onBack: () => void;
}

const ThemeSelector = ({ area, areaColor, flashcards, onThemesSelected, onBack }: ThemeSelectorProps) => {
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique themes for this area
  const areaFlashcards = flashcards.filter(card => card.area === area);
  const allThemes = [...new Set(areaFlashcards.map(card => card.tema))].filter(Boolean);
  
  // Filter themes based on search
  const filteredThemes = allThemes.filter(theme => 
    theme.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev => 
      prev.includes(theme) 
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
  };

  const selectAll = () => {
    setSelectedThemes(filteredThemes);
  };

  const clearAll = () => {
    setSelectedThemes([]);
  };

  const getThemeCardCount = (theme: string) => {
    return areaFlashcards.filter(card => card.tema === theme).length;
  };

  return (
    <div className="min-h-screen bg-netflix-black px-2 sm:px-4 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 sm:mb-8 animate-fade-in">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex items-center space-x-3">
            <Scale 
              className="w-8 h-8 animate-pulse" 
              style={{ color: areaColor }}
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Escolha os Temas
              </h1>
              <p className="text-gray-400">{area}</p>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="mb-6 space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar temas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-netflix-dark/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              {selectedThemes.length} de {filteredThemes.length} temas selecionados
            </div>
            <div className="space-x-2">
              <Button
                onClick={selectAll}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Selecionar Todos
              </Button>
              <Button
                onClick={clearAll}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Limpar
              </Button>
            </div>
          </div>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredThemes.map((theme, index) => (
            <div
              key={theme}
              className="animate-fade-in hover-lift"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => toggleTheme(theme)}
            >
              <div
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                  selectedThemes.includes(theme)
                    ? 'border-netflix-red bg-netflix-red/20 shadow-lg'
                    : 'border-white/20 bg-netflix-dark/50 hover:border-white/40'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      selectedThemes.includes(theme)
                        ? 'bg-netflix-red border-netflix-red'
                        : 'border-white/40'
                    }`}
                  >
                    {selectedThemes.includes(theme) && (
                      <div className="w-2 h-2 bg-white rounded-full animate-scale-in" />
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Cards</div>
                    <div className="text-lg font-semibold text-white">
                      {getThemeCardCount(theme)}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-white font-medium leading-tight">
                  {theme}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        {selectedThemes.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 animate-slide-up">
            <Button
              onClick={() => onThemesSelected(selectedThemes)}
              className="bg-netflix-red hover:bg-netflix-red/80 text-white font-semibold py-4 px-8 rounded-xl shadow-2xl transition-all duration-300 flex items-center space-x-2"
            >
              <span>Estudar {selectedThemes.length} tema{selectedThemes.length > 1 ? 's' : ''}</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSelector;
