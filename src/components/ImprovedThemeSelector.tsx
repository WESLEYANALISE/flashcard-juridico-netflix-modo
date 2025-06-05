
import { useState, useMemo } from 'react';
import { ArrowLeft, Search, Check, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFlashcardsByArea } from '@/hooks/useFlashcardsByArea';
import { useAllUserProgress } from '@/hooks/useRealUserProgress';

interface ImprovedThemeSelectorProps {
  area: string;
  areaColor: string;
  onThemesSelected: (themes: string[]) => void;
  onBack: () => void;
}

const ImprovedThemeSelector = ({ area, areaColor, onThemesSelected, onBack }: ImprovedThemeSelectorProps) => {
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'studied' | 'not-studied'>('all');
  
  const { data: flashcards = [] } = useFlashcardsByArea(area);
  const { data: userProgress = [] } = useAllUserProgress();

  const themeStats = useMemo(() => {
    const themes = [...new Set(flashcards.map(card => card.tema).filter(Boolean))];
    
    return themes.map(tema => {
      const themeCards = flashcards.filter(card => card.tema === tema);
      const studiedCards = themeCards.filter(card => 
        userProgress.some(p => p.flashcard_id === parseInt(card.id))
      );
      const masteredCards = themeCards.filter(card => 
        userProgress.some(p => p.flashcard_id === parseInt(card.id) && p.mastery_level === 'mastered')
      );
      const needReviewCards = themeCards.filter(card => 
        userProgress.some(p => p.flashcard_id === parseInt(card.id) && p.needs_review)
      );

      return {
        name: tema,
        total: themeCards.length,
        studied: studiedCards.length,
        mastered: masteredCards.length,
        needReview: needReviewCards.length,
        progress: themeCards.length > 0 ? (studiedCards.length / themeCards.length) * 100 : 0
      };
    });
  }, [flashcards, userProgress]);

  const filteredThemes = useMemo(() => {
    let filtered = themeStats;
    
    if (searchTerm) {
      filtered = filtered.filter(theme => 
        theme.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterBy === 'studied') {
      filtered = filtered.filter(theme => theme.studied > 0);
    } else if (filterBy === 'not-studied') {
      filtered = filtered.filter(theme => theme.studied === 0);
    }
    
    return filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [themeStats, searchTerm, filterBy]);

  const handleThemeToggle = (themeName: string) => {
    setSelectedThemes(prev => 
      prev.includes(themeName)
        ? prev.filter(t => t !== themeName)
        : [...prev, themeName]
    );
  };

  const handleSelectAll = () => {
    if (selectedThemes.length === filteredThemes.length) {
      setSelectedThemes([]);
    } else {
      setSelectedThemes(filteredThemes.map(t => t.name).filter(Boolean));
    }
  };

  const handleStart = () => {
    if (selectedThemes.length > 0) {
      onThemesSelected(selectedThemes);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-netflix-black px-4 py-8">
      <div className="max-w-4xl mx-auto">
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
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Selecione os <span style={{ color: areaColor }}>Temas</span>
            </h1>
            <p className="text-gray-400">{area}</p>
          </div>
          
          <div className="w-20" />
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar temas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/10 border-white/20 text-white pl-10 placeholder-gray-400"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={filterBy === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('all')}
              className={filterBy === 'all' ? 'bg-netflix-red' : 'bg-white/10 border-white/20 text-white'}
            >
              Todos
            </Button>
            <Button
              variant={filterBy === 'studied' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('studied')}
              className={filterBy === 'studied' ? 'bg-netflix-red' : 'bg-white/10 border-white/20 text-white'}
            >
              Estudados
            </Button>
            <Button
              variant={filterBy === 'not-studied' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('not-studied')}
              className={filterBy === 'not-studied' ? 'bg-netflix-red' : 'bg-white/10 border-white/20 text-white'}
            >
              Não estudados
            </Button>
          </div>
          
          <Button
            onClick={handleSelectAll}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {selectedThemes.length === filteredThemes.length ? 'Desmarcar todos' : 'Selecionar todos'}
          </Button>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredThemes.map((theme) => (
            <div
              key={theme.name}
              onClick={() => theme.name && handleThemeToggle(theme.name)}
              className={`bg-netflix-dark/50 border rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedThemes.includes(theme.name || '')
                  ? 'border-netflix-red bg-netflix-red/20'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white text-sm">{theme.name}</h3>
                {selectedThemes.includes(theme.name || '') && (
                  <Check className="w-5 h-5 text-netflix-red" />
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{theme.total} cards</span>
                  <span>{Math.round(theme.progress)}% estudado</span>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(theme.progress)}`}
                    style={{ width: `${theme.progress}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-green-400">{theme.mastered} dominados</span>
                  <span className="text-orange-400">{theme.needReview} para revisar</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleStart}
            disabled={selectedThemes.length === 0}
            className="bg-netflix-red hover:bg-netflix-red/80 text-white px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: selectedThemes.length > 0 ? areaColor : undefined }}
          >
            Iniciar Estudo ({selectedThemes.length} tema{selectedThemes.length !== 1 ? 's' : ''})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImprovedThemeSelector;
