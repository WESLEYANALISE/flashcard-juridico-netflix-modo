import { useState, useEffect } from 'react';
import { ArrowLeft, Shuffle, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Flashcard } from '@/types/flashcard';
import { useFlashcards, useFlashcardAreas } from '@/hooks/useFlashcards';
import { useFlashcardsByAreaAndThemes } from '@/hooks/useFlashcardsByArea';
import { generateCategoriesFromAreas, mapSupabaseFlashcard } from '@/utils/flashcardMapper';
import CategoryCard from './CategoryCard';
import ThemeSelector from './ThemeSelector';
import AnimatedFlashCard from './AnimatedFlashCard';
import SessionStats from './SessionStats';
import GeneralSummary from './GeneralSummary';
interface StudyViewProps {
  flashcards: Flashcard[];
  onUpdateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
}
type StudyStep = 'categories' | 'themes' | 'studying';
const StudyView = ({
  onUpdateFlashcard
}: StudyViewProps) => {
  const [currentStep, setCurrentStep] = useState<StudyStep>('categories');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isCardExiting, setIsCardExiting] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right'>('right');
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    total: 0,
    streak: 0,
    maxStreak: 0,
    completed: false
  });

  // Queries
  const {
    data: areas = []
  } = useFlashcardAreas();
  const {
    data: allFlashcards = []
  } = useFlashcards();
  const {
    data: selectedFlashcards = []
  } = useFlashcardsByAreaAndThemes(selectedArea || '', selectedThemes);
  const categories = generateCategoriesFromAreas(areas);

  // Get category stats for the overview
  const categoryStats = categories.map(category => {
    const categoryCards = allFlashcards.filter(card => card.area === category.name);
    return {
      ...category,
      cardCount: categoryCards.length,
      studiedCount: 0 // Since we don't track this in Supabase yet
    };
  });

  // Convert selected flashcards to our format
  const studyCards: Flashcard[] = selectedFlashcards.map(mapSupabaseFlashcard);

  // Shuffle cards if needed
  const getCurrentCards = () => {
    let cards = [...studyCards];
    if (isShuffled) {
      cards = cards.sort(() => Math.random() - 0.5);
    }
    return cards;
  };
  const currentCards = getCurrentCards();
  const currentCard = currentCards[currentCardIndex];
  const selectedCategory = categories.find(cat => cat.name === selectedArea);

  // Reset when changing steps
  useEffect(() => {
    if (currentStep === 'studying') {
      setCurrentCardIndex(0);
      setSessionStats({
        correct: 0,
        total: 0,
        streak: 0,
        maxStreak: 0,
        completed: false
      });
    }
  }, [currentStep, selectedThemes, isShuffled]);
  const handleAreaSelect = (areaName: string) => {
    setSelectedArea(areaName);
    setCurrentStep('themes');
  };
  const handleThemesSelected = (themes: string[]) => {
    setSelectedThemes(themes);
    setCurrentStep('studying');
  };
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

    // Animate card exit
    setExitDirection(correct ? 'right' : 'left');
    setIsCardExiting(true);
    setTimeout(() => {
      setIsCardExiting(false);
      if (currentCardIndex < currentCards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        setSessionStats(prev => ({
          ...prev,
          completed: true
        }));
      }
    }, 500);
  };
  const handleBackToCategories = () => {
    setCurrentStep('categories');
    setSelectedArea(null);
    setSelectedThemes([]);
    setCurrentCardIndex(0);
    setSessionStats({
      correct: 0,
      total: 0,
      streak: 0,
      maxStreak: 0,
      completed: false
    });
  };
  const handleBackToThemes = () => {
    setCurrentStep('themes');
    setSelectedThemes([]);
    setCurrentCardIndex(0);
    setSessionStats({
      correct: 0,
      total: 0,
      streak: 0,
      maxStreak: 0,
      completed: false
    });
  };
  const handleFinishSession = () => {
    handleBackToCategories();
  };
  const handleContinueSession = () => {
    setCurrentCardIndex(0);
    setSessionStats(prev => ({
      ...prev,
      completed: false
    }));
  };
  const handleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  // Show session completion stats
  if (sessionStats.completed && currentStep === 'studying') {
    return <SessionStats stats={sessionStats} categoryName={`${selectedArea} - ${selectedThemes.join(', ')}`} onFinish={handleFinishSession} onContinue={handleContinueSession} />;
  }

  // Theme selection step
  if (currentStep === 'themes' && selectedArea) {
    return <ThemeSelector area={selectedArea} areaColor={selectedCategory?.color || '#E50914'} flashcards={allFlashcards} onThemesSelected={handleThemesSelected} onBack={handleBackToCategories} />;
  }

  // Study session step
  if (currentStep === 'studying' && selectedArea && currentCard) {
    return <div className="min-h-screen bg-netflix-black px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 animate-fade-in space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Button onClick={handleBackToThemes} variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Temas
              </Button>
              
              <div className="flex items-center space-x-3">
                <Scale className="w-6 h-6 animate-pulse" style={{
                color: selectedCategory?.color
              }} />
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                    {selectedArea}
                  </h1>
                  
                </div>
              </div>
            </div>

            <Button onClick={handleShuffle} variant="outline" size="sm" className={`${isShuffled ? 'bg-netflix-red/20 border-netflix-red/50 text-netflix-red' : 'bg-white/10 border-white/20 text-white'} hover:bg-netflix-red/30`}>
              <Shuffle className="w-4 h-4 mr-2" />
              {isShuffled ? 'Embaralhado' : 'Embaralhar'}
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 sm:mb-8 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm text-gray-400">Progresso da Sessão</span>
              <span className="text-xs sm:text-sm text-gray-400">
                {Math.round((currentCardIndex + 1) / currentCards.length * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="h-2 rounded-full transition-all duration-500" style={{
              width: `${(currentCardIndex + 1) / currentCards.length * 100}%`,
              background: `linear-gradient(90deg, ${selectedCategory?.color || '#E50914'}, ${selectedCategory?.color || '#E50914'}80)`
            }} />
            </div>
          </div>

          {/* Flashcard */}
          <AnimatedFlashCard flashcard={currentCard} onAnswer={handleAnswer} showAnswerByDefault={false} areaColor={selectedCategory?.color || '#E50914'} isExiting={isCardExiting} exitDirection={exitDirection} tema={selectedFlashcards[currentCardIndex]?.tema} />
        </div>
      </div>;
  }

  // Categories overview (default)
  return <div className="min-h-screen bg-netflix-black px-2 sm:px-4 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto">
        {/* General Summary - Always at top */}
        <GeneralSummary flashcards={[]} categories={categories} />

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4">
            Escolha uma <span className="text-netflix-red">Área</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Selecione a área do direito que deseja estudar e escolha os temas específicos
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {categoryStats.map((category, index) => <div key={category.id} className="animate-fade-in" style={{
          animationDelay: `${index * 0.1}s`
        }}>
              <CategoryCard category={category} cardCount={category.cardCount} studiedCount={category.studiedCount} isSelected={false} onClick={() => handleAreaSelect(category.name)} />
            </div>)}
        </div>
      </div>
    </div>;
};
export default StudyView;