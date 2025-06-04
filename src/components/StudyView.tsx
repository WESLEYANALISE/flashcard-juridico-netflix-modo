
import { useState, useEffect } from 'react';
import { ArrowLeft, Shuffle, TrendingUp, Award, Target, Plus, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Flashcard } from '@/types/flashcard';
import { useFlashcardAreas } from '@/hooks/useFlashcards';
import { generateCategoriesFromAreas } from '@/utils/flashcardMapper';
import CategoryCard from './CategoryCard';
import FlashCard from './FlashCard';
import PlaylistManager from './PlaylistManager';
import SessionStats from './SessionStats';
import GeneralSummary from './GeneralSummary';

interface StudyViewProps {
  flashcards: Flashcard[];
  onUpdateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
}

const StudyView = ({ flashcards, onUpdateFlashcard }: StudyViewProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [showPlaylistManager, setShowPlaylistManager] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    total: 0,
    streak: 0,
    maxStreak: 0,
    completed: false
  });

  const { data: areas = [] } = useFlashcardAreas();
  const categories = generateCategoriesFromAreas(areas);

  const categoryStats = categories.map(category => {
    const categoryCards = flashcards.filter(card => card.category === category.name);
    const studiedCards = categoryCards.filter(card => card.studied);
    return {
      ...category,
      cardCount: categoryCards.length,
      studiedCount: studiedCards.length
    };
  });

  const getCurrentCards = () => {
    if (!selectedCategory) return [];
    let cards = flashcards.filter(card => card.category === selectedCategory);
    if (isShuffled) {
      cards = [...cards].sort(() => Math.random() - 0.5);
    }
    return cards;
  };

  const currentCards = getCurrentCards();
  const currentCard = currentCards[currentCardIndex];

  useEffect(() => {
    setCurrentCardIndex(0);
    setSessionStats({ correct: 0, total: 0, streak: 0, maxStreak: 0, completed: false });
  }, [selectedCategory, isShuffled]);

  const handleAnswer = (correct: boolean) => {
    if (!currentCard) return;

    const newStats = {
      correct: sessionStats.correct + (correct ? 1 : 0),
      total: sessionStats.total + 1,
      streak: correct ? sessionStats.streak + 1 : 0,
      maxStreak: correct ? Math.max(sessionStats.streak + 1, sessionStats.maxStreak) : sessionStats.maxStreak,
      completed: false
    };
    setSessionStats(newStats);

    onUpdateFlashcard(currentCard.id, {
      studied: true,
      correctAnswers: currentCard.correctAnswers + (correct ? 1 : 0),
      totalAttempts: currentCard.totalAttempts + 1,
      lastStudied: new Date()
    });

    // Move to next card
    setTimeout(() => {
      if (currentCardIndex < currentCards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        // End of deck - mark as completed
        setSessionStats(prev => ({ ...prev, completed: true }));
      }
    }, 1000);
  };

  const handleFinishSession = () => {
    setSelectedCategory(null);
    setCurrentCardIndex(0);
    setSessionStats({ correct: 0, total: 0, streak: 0, maxStreak: 0, completed: false });
  };

  const handleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setCurrentCardIndex(0);
    setSessionStats({ correct: 0, total: 0, streak: 0, maxStreak: 0, completed: false });
  };

  if (showPlaylistManager) {
    return (
      <PlaylistManager
        flashcards={flashcards}
        categories={categories}
        onClose={() => setShowPlaylistManager(false)}
      />
    );
  }

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-netflix-black px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* General Summary - Always at top */}
          <GeneralSummary flashcards={flashcards} categories={categories} />

          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4">
              Escolha uma <span className="text-netflix-red">Categoria</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-4">
              Selecione a área do direito que deseja estudar e domine os conceitos fundamentais
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 justify-center">
            <Button
              onClick={() => setShowPlaylistManager(true)}
              className="bg-netflix-red hover:bg-netflix-red/80 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Playlist
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
            >
              <List className="w-5 h-5 mr-2" />
              Minhas Playlists
            </Button>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {categoryStats.map((category, index) => (
              <div
                key={category.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CategoryCard
                  category={category}
                  cardCount={category.cardCount}
                  studiedCount={category.studiedCount}
                  isSelected={false}
                  onClick={() => setSelectedCategory(category.name)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show session completion stats
  if (sessionStats.completed) {
    return (
      <SessionStats
        stats={sessionStats}
        categoryName={selectedCategory}
        onFinish={handleFinishSession}
        onContinue={() => setSessionStats(prev => ({ ...prev, completed: false }))}
      />
    );
  }

  const selectedCategoryData = categories.find(cat => cat.name === selectedCategory);

  return (
    <div className="min-h-screen bg-netflix-black px-2 sm:px-4 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 animate-fade-in space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Button
              onClick={handleBack}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                {selectedCategoryData?.name}
              </h1>
              <p className="text-sm sm:text-base text-gray-400">
                Card {currentCardIndex + 1} de {currentCards.length}
              </p>
            </div>
          </div>

          <Button
            onClick={handleShuffle}
            variant="outline"
            size="sm"
            className={`${
              isShuffled 
                ? 'bg-netflix-red/20 border-netflix-red/50 text-netflix-red' 
                : 'bg-white/10 border-white/20 text-white'
            } hover:bg-netflix-red/30`}
          >
            <Shuffle className="w-4 h-4 mr-2" />
            {isShuffled ? 'Embaralhado' : 'Embaralhar'}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm text-gray-400">Progresso da Sessão</span>
            <span className="text-xs sm:text-sm text-gray-400">
              {Math.round(((currentCardIndex + 1) / currentCards.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="h-2 bg-gradient-to-r from-netflix-red to-netflix-gold rounded-full transition-all duration-500"
              style={{ width: `${((currentCardIndex + 1) / currentCards.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        {currentCard && (
          <div className="animate-scale-in">
            <FlashCard
              flashcard={currentCard}
              onAnswer={handleAnswer}
              showAnswerByDefault={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyView;
