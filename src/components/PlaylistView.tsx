
import { useState } from 'react';
import { ArrowLeft, Plus, Save, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFlashcardAreas } from '@/hooks/useFlashcards';
import { useFlashcardsByAreaAndThemes } from '@/hooks/useFlashcardsByArea';
import { generateCategoriesFromAreas } from '@/utils/flashcardMapper';
import CategoryCard from './CategoryCard';
import ImprovedThemeSelector from './ImprovedThemeSelector';
import { CardSkeleton } from '@/components/ui/card-skeleton';

interface PlaylistViewProps {
  onClose: () => void;
  onStudyPlaylist: (playlistId: string) => void;
}

type PlaylistStep = 'area-selection' | 'theme-selection' | 'playlist-creation';

const PlaylistView = ({ onClose, onStudyPlaylist }: PlaylistViewProps) => {
  const [currentStep, setCurrentStep] = useState<PlaylistStep>('area-selection');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');

  const { data: areas = [], isLoading: areasLoading } = useFlashcardAreas();
  const { data: selectedFlashcards = [] } = useFlashcardsByAreaAndThemes(
    selectedArea || '', 
    selectedThemes
  );

  const categories = generateCategoriesFromAreas(areas);

  const handleAreaSelect = (areaName: string) => {
    setSelectedArea(areaName);
    setCurrentStep('theme-selection');
  };

  const handleThemesSelected = (themes: string[]) => {
    setSelectedThemes(themes);
    setCurrentStep('playlist-creation');
    // Auto-generate playlist name
    const themesText = themes.length > 2 
      ? `${themes.slice(0, 2).join(', ')} e mais ${themes.length - 2}`
      : themes.join(' e ');
    setPlaylistName(`${selectedArea} - ${themesText}`);
  };

  const handleBackToAreas = () => {
    setCurrentStep('area-selection');
    setSelectedArea(null);
    setSelectedThemes([]);
    setPlaylistName('');
    setPlaylistDescription('');
  };

  const handleBackToThemes = () => {
    setCurrentStep('theme-selection');
    setSelectedThemes([]);
    setPlaylistName('');
    setPlaylistDescription('');
  };

  const handleCreatePlaylist = () => {
    // Here you would typically save the playlist
    console.log('Creating playlist:', {
      name: playlistName,
      description: playlistDescription,
      area: selectedArea,
      themes: selectedThemes,
      flashcardIds: selectedFlashcards.map(f => f.id)
    });
    
    // For now, just close and show success
    onClose();
  };

  if (areasLoading) {
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
  if (currentStep === 'theme-selection' && selectedArea) {
    const selectedCategory = categories.find(cat => cat.name === selectedArea);
    
    return (
      <ImprovedThemeSelector
        area={selectedArea}
        areaColor={selectedCategory?.color || '#E50914'}
        onThemesSelected={handleThemesSelected}
        onBack={handleBackToAreas}
      />
    );
  }

  // Playlist Creation Step
  if (currentStep === 'playlist-creation' && selectedArea) {
    const selectedCategory = categories.find(cat => cat.name === selectedArea);

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
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                   style={{ backgroundColor: `${selectedCategory?.color}20` }}>
                <Music className="w-8 h-8" style={{ color: selectedCategory?.color }} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Criar Nova Playlist
              </h1>
              <p className="text-gray-400">
                {selectedThemes.length} tema{selectedThemes.length > 1 ? 's' : ''} • {selectedFlashcards.length} cards
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
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Área:</span>
                    <span className="text-white">{selectedArea}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Temas:</span>
                    <span className="text-white">{selectedThemes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cards:</span>
                    <span className="text-white">{selectedFlashcards.length}</span>
                  </div>
                </div>
                
                {/* Theme List */}
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {selectedThemes.map((theme) => (
                      <span 
                        key={theme}
                        className="px-2 py-1 text-xs rounded-full bg-white/10 text-gray-300"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
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
            Escolha uma área para começar a criar sua playlist personalizada
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <div 
              key={category.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CategoryCard
                category={category}
                cardCount={0}
                studiedCount={0}
                isSelected={false}
                onClick={() => handleAreaSelect(category.name)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistView;
