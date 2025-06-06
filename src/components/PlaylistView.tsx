import { useState } from 'react';
import { ArrowLeft, Plus, Save, Music, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFlashcardAreas } from '@/hooks/useFlashcards';
import { useFlashcards } from '@/hooks/useFlashcards';
import { generateCategoriesFromAreas } from '@/utils/flashcardMapper';
import CategoryCard from './CategoryCard';
import { CardSkeleton } from '@/components/ui/card-skeleton';

interface PlaylistViewProps {
  onClose: () => void;
  onStudyPlaylist: (playlistId: string) => void;
}

type PlaylistStep = 'area-selection' | 'theme-selection' | 'playlist-creation';

interface SelectedAreaThemes {
  area: string;
  themes: string[];
  color: string;
}

const PlaylistView = ({ onClose, onStudyPlaylist }: PlaylistViewProps) => {
  const [currentStep, setCurrentStep] = useState<PlaylistStep>('area-selection');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedAreaThemes, setSelectedAreaThemes] = useState<SelectedAreaThemes[]>([]);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');

  const { data: areas = [], isLoading: areasLoading } = useFlashcardAreas();
  const { data: flashcards = [], isLoading: flashcardsLoading } = useFlashcards();
  const categories = generateCategoriesFromAreas(areas);

  // Get all flashcards for selected areas and themes
  const getAllSelectedFlashcards = () => {
    let allFlashcards: any[] = [];
    selectedAreaThemes.forEach(({ area, themes }) => {
      const areaFlashcards = flashcards.filter(card => card.area === area);
      const filteredCards = areaFlashcards.filter(card => themes.length === 0 || themes.includes(card.tema || ''));
      allFlashcards = [...allFlashcards, ...filteredCards];
    });
    return allFlashcards;
  };

  const handleAreaToggle = (areaName: string) => {
    setSelectedAreas(prev => {
      const isSelected = prev.includes(areaName);
      if (isSelected) {
        // Remove area and its themes
        setSelectedAreaThemes(prevThemes => 
          prevThemes.filter(item => item.area !== areaName)
        );
        return prev.filter(area => area !== areaName);
      } else {
        // Add area
        return [...prev, areaName];
      }
    });
  };

  const handleProceedToThemes = () => {
    // Initialize theme selection for all selected areas
    const initialThemes = selectedAreas.map(area => {
      const category = categories.find(cat => cat.name === area);
      return {
        area,
        themes: [],
        color: category?.color || '#E50914'
      };
    });
    setSelectedAreaThemes(initialThemes);
    setCurrentStep('theme-selection');
  };

  const handleThemeToggle = (area: string, theme: string) => {
    setSelectedAreaThemes(prev => 
      prev.map(item => {
        if (item.area === area) {
          const isSelected = item.themes.includes(theme);
          return {
            ...item,
            themes: isSelected 
              ? item.themes.filter(t => t !== theme)
              : [...item.themes, theme]
          };
        }
        return item;
      })
    );
  };

  const handleSelectAllThemes = (area: string, allThemes: string[]) => {
    setSelectedAreaThemes(prev => 
      prev.map(item => 
        item.area === area 
          ? { ...item, themes: allThemes }
          : item
      )
    );
  };

  const handleClearAreaThemes = (area: string) => {
    setSelectedAreaThemes(prev => 
      prev.map(item => 
        item.area === area 
          ? { ...item, themes: [] }
          : item
      )
    );
  };

  const handleProceedToCreation = () => {
    setCurrentStep('playlist-creation');
    // Auto-generate playlist name
    const areasText = selectedAreas.length > 2 
      ? `${selectedAreas.slice(0, 2).join(', ')} e mais ${selectedAreas.length - 2}`
      : selectedAreas.join(' e ');
    
    const totalThemes = selectedAreaThemes.reduce((sum, item) => sum + item.themes.length, 0);
    setPlaylistName(`Mix de ${areasText} (${totalThemes} temas)`);
  };

  const handleBackToAreas = () => {
    setCurrentStep('area-selection');
    setSelectedAreas([]);
    setSelectedAreaThemes([]);
    setPlaylistName('');
    setPlaylistDescription('');
  };

  const handleBackToThemes = () => {
    setCurrentStep('theme-selection');
    setPlaylistName('');
    setPlaylistDescription('');
  };

  const handleCreatePlaylist = () => {
    const totalCards = getAllSelectedFlashcards().length;
    console.log('Creating playlist:', {
      name: playlistName,
      description: playlistDescription,
      areas: selectedAreas,
      areaThemes: selectedAreaThemes,
      totalCards
    });
    
    onClose();
  };

  const getTotalSelectedThemes = () => {
    return selectedAreaThemes.reduce((sum, item) => sum + item.themes.length, 0);
  };

  const getTotalSelectedCards = () => {
    return getAllSelectedFlashcards().length;
  };

  if (areasLoading || flashcardsLoading) {
    return (
      <div className="min-h-screen bg-netflix-black px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Theme Selection Step
  if (currentStep === 'theme-selection') {
    return (
      <div className="min-h-screen bg-netflix-black px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8 py-6">
            <Button 
              onClick={handleBackToAreas} 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </Button>
          </div>

          {/* Title */}
          <div className="text-center mb-6 sm:mb-8 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Selecione os <span className="text-netflix-red">Temas</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-400 mb-6">
              Escolha os temas de cada área que deseja estudar
            </p>
          </div>

          {/* Areas and Themes */}
          <div className="space-y-8 mb-24">
            {selectedAreaThemes.map((areaItem) => {
              const areaFlashcards = flashcards.filter(card => card.area === areaItem.area);
              const themes = [...new Set(areaFlashcards.map(card => card.tema).filter(Boolean))].sort();
              
              return (
                <div key={areaItem.area} className="bg-netflix-dark/40 rounded-2xl border border-white/10 p-6">
                  {/* Area Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: areaItem.color }}
                      />
                      <h2 className="text-xl font-bold text-white">{areaItem.area}</h2>
                      <span className="text-sm text-gray-400">
                        ({areaItem.themes.length}/{themes.length} temas)
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleSelectAllThemes(areaItem.area, themes)} 
                        variant="outline" 
                        size="sm" 
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs"
                      >
                        Todos
                      </Button>
                      <Button 
                        onClick={() => handleClearAreaThemes(areaItem.area)} 
                        variant="outline" 
                        size="sm" 
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs"
                      >
                        Limpar
                      </Button>
                    </div>
                  </div>

                  {/* Themes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {themes.map((theme) => {
                      const isSelected = areaItem.themes.includes(theme);
                      const themeCards = areaFlashcards.filter(card => card.tema === theme);
                      
                      return (
                        <div 
                          key={theme}
                          onClick={() => handleThemeToggle(areaItem.area, theme)}
                          className={`
                            relative p-4 rounded-xl cursor-pointer transition-all duration-300 
                            bg-netflix-dark/60 border-2 hover:scale-[1.02] transform-gpu
                            ${isSelected 
                              ? 'border-white shadow-lg bg-white/10' 
                              : 'border-white/10 hover:border-white/20'
                            }
                          `}
                        >
                          {/* Selection Indicator */}
                          <div className="absolute top-3 right-3">
                            <div className={`
                              w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
                              ${isSelected 
                                ? 'border-white bg-white' 
                                : 'border-white/50'
                              }
                            `}>
                              {isSelected && (
                                <CheckCircle 
                                  className="w-3 h-3" 
                                  style={{ color: areaItem.color }} 
                                />
                              )}
                            </div>
                          </div>

                          <h3 className="text-sm font-semibold text-white mb-2 pr-8 leading-tight">
                            {theme}
                          </h3>
                          
                          <div className="text-xs text-gray-400">
                            {themeCards.length} cards
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fixed Continue Button */}
          {getTotalSelectedThemes() > 0 && (
            <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-xs sm:max-w-sm">
              <Button
                onClick={handleProceedToCreation}
                className="w-full bg-netflix-red hover:bg-netflix-red/80 text-white px-6 py-3 text-base font-semibold 
                           flex items-center justify-center space-x-2 rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 
                           border-2 border-netflix-red/50"
              >
                <Music className="w-5 h-5" />
                <span>Criar Playlist ({getTotalSelectedThemes()})</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Playlist Creation Step
  if (currentStep === 'playlist-creation') {
    return (
      <div className="min-h-screen bg-netflix-black px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <Button 
              onClick={handleBackToThemes} 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </Button>
          </div>

          {/* Create Playlist Card */}
          <div className="bg-netflix-dark/60 rounded-2xl border border-white/20 p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-netflix-red/20 flex items-center justify-center">
                <Music className="w-8 h-8 text-netflix-red" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Criar Nova Playlist
              </h1>
              <p className="text-gray-400">
                {selectedAreas.length} área{selectedAreas.length > 1 ? 's' : ''} • {getTotalSelectedThemes()} tema{getTotalSelectedThemes() > 1 ? 's' : ''} • {getTotalSelectedCards()} cards
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nome da Playlist *
                </label>
                <Input
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder="Digite o nome da playlist..."
                  className="bg-white/5 border-white/20 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Descrição (opcional)
                </label>
                <Textarea
                  value={playlistDescription}
                  onChange={(e) => setPlaylistDescription(e.target.value)}
                  placeholder="Adicione uma descrição para sua playlist..."
                  className="bg-white/5 border-white/20 text-white placeholder-gray-400 min-h-[100px]"
                />
              </div>

              {/* Selected Details */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-white font-medium mb-3">Conteúdo Selecionado</h3>
                
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{selectedAreas.length}</div>
                    <div className="text-xs text-gray-400">Área{selectedAreas.length > 1 ? 's' : ''}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{getTotalSelectedThemes()}</div>
                    <div className="text-xs text-gray-400">Tema{getTotalSelectedThemes() > 1 ? 's' : ''}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{getTotalSelectedCards()}</div>
                    <div className="text-xs text-gray-400">Cards</div>
                  </div>
                </div>
                
                {/* Areas and Themes Breakdown */}
                <div className="space-y-3 pt-3 border-t border-white/10">
                  {selectedAreaThemes.map((areaItem) => (
                    <div key={areaItem.area} className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: areaItem.color }}
                        />
                        <span className="text-white font-medium">{areaItem.area}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-300">{areaItem.themes.length} temas</div>
                        <div className="text-xs text-gray-500">
                          {areaItem.themes.slice(0, 2).join(', ')}
                          {areaItem.themes.length > 2 && ` +${areaItem.themes.length - 2}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-4">
                <Button
                  onClick={handleCreatePlaylist}
                  disabled={!playlistName.trim()}
                  className="flex-1 bg-netflix-red hover:bg-netflix-red/80 text-white py-3 font-semibold"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Criar Playlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Area Selection Step (Default)
  return (
    <div className="min-h-screen bg-netflix-black px-2 sm:px-4 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Button 
            onClick={onClose} 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Button>
        </div>

        {/* Title */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4">
            Criar <span className="text-netflix-red">Playlist</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Escolha uma ou várias áreas para criar sua playlist personalizada
          </p>
        </div>

        {/* Selection Summary */}
        {selectedAreas.length > 0 && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2 bg-netflix-red/20 border border-netflix-red/30 rounded-full px-4 py-2">
              <span className="text-white font-medium">{selectedAreas.length} área{selectedAreas.length > 1 ? 's' : ''} selecionada{selectedAreas.length > 1 ? 's' : ''}</span>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-24">
          {categories.map((category, index) => {
            const isSelected = selectedAreas.includes(category.name);
            
            return (
              <div 
                key={category.id}
                className="animate-fade-in relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="w-6 h-6 bg-netflix-red rounded-full flex items-center justify-center border-2 border-white">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                
                <div className={`transform transition-all duration-300 ${isSelected ? 'ring-2 ring-netflix-red scale-105' : ''}`}>
                  <CategoryCard
                    category={category}
                    cardCount={0}
                    studiedCount={0}
                    isSelected={isSelected}
                    onClick={() => handleAreaToggle(category.name)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Fixed Continue Button */}
        {selectedAreas.length > 0 && (
          <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-xs sm:max-w-sm">
            <Button
              onClick={handleProceedToThemes}
              className="w-full bg-netflix-red hover:bg-netflix-red/80 text-white px-6 py-3 text-base font-semibold 
                         flex items-center justify-center space-x-2 rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 
                         border-2 border-netflix-red/50"
            >
              <Plus className="w-5 h-5" />
              <span>Continuar ({selectedAreas.length})</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistView;
