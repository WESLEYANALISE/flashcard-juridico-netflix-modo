
import { useState, useEffect } from 'react';
import { ArrowLeft, Shuffle, Scale, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Flashcard } from '@/types/flashcard';
import { useFlashcards, useFlashcardAreas, SupabaseFlashcard } from '@/hooks/useFlashcards';
import { useFlashcardsByAreaAndThemes } from '@/hooks/useFlashcardsByArea';
import { useUpdateFlashcardProgress, useLastStudySession, useCreateStudySession, useUpdateStudySession } from '@/hooks/useRealUserProgress';
import { generateCategoriesFromAreas, mapSupabaseFlashcard } from '@/utils/flashcardMapper';
import { useErrorHandling } from '@/hooks/useErrorHandling';
import { CardSkeleton, CategoryCardSkeleton } from '@/components/ui/card-skeleton';
import CategoryCard from './CategoryCard';
import ImprovedThemeSelector from './ImprovedThemeSelector';
import ImprovedAnimatedFlashCard from './ImprovedAnimatedFlashCard';
import StudyModeModal from './StudyModeModal';
import SessionStats from './SessionStats';
import GeneralSummary from './GeneralSummary';
import ErrorBoundary from './ErrorBoundary';

interface StudyViewProps {
  flashcards: Flashcard[];
  onUpdateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
  onHideNavbar?: (hide: boolean) => void;
}

type StudyStep = 'categories' | 'themes' | 'study-mode' | 'studying';

const StudyView = ({
  onUpdateFlashcard,
  onHideNavbar
}: StudyViewProps) => {
  const [currentStep, setCurrentStep] = useState<StudyStep>('categories');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [studyMode, setStudyMode] = useState<'normal' | 'continue' | 'random'>('normal');
  const [isShuffled, setIsShuffled] = useState(false);
  const [isCardExiting, setIsCardExiting] = useState(false);
  const [isCardEntering, setIsCardEntering] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right'>('right');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    total: 0,
    streak: 0,
    maxStreak: 0,
    completed: false
  });

  const {
    handleError,
    retry,
    canRetry
  } = useErrorHandling();

  const updateProgress = useUpdateFlashcardProgress();
  const createSession = useCreateStudySession();
  const updateSession = useUpdateStudySession();

  // Queries com tratamento de erro melhorado
  const {
    data: areas = [],
    isLoading: areasLoading,
    error: areasError
  } = useFlashcardAreas();
  
  const {
    data: allFlashcards = [],
    isLoading: allFlashcardsLoading,
    error: allFlashcardsError
  } = useFlashcards();
  
  const {
    data: selectedFlashcards = [],
    isLoading: selectedFlashcardsLoading,
    error: selectedFlashcardsError
  } = useFlashcardsByAreaAndThemes(selectedArea || '', selectedThemes);

  const { data: lastSession } = useLastStudySession(selectedArea || '');

  // Control navbar visibility based on study step
  useEffect(() => {
    if (onHideNavbar) {
      onHideNavbar(currentStep === 'studying');
    }
  }, [currentStep, onHideNavbar]);

  // Error handling
  useEffect(() => {
    if (areasError) handleError(areasError, 'Carregamento de áreas');
    if (allFlashcardsError) handleError(allFlashcardsError, 'Carregamento de flashcards');
    if (selectedFlashcardsError) handleError(selectedFlashcardsError, 'Carregamento de flashcards selecionados');
  }, [areasError, allFlashcardsError, selectedFlashcardsError, handleError]);

  const categories = generateCategoriesFromAreas(areas);
  const categoryStats = categories.map(category => {
    const categoryCards = allFlashcards.filter(card => card.area === category.name);
    return {
      ...category,
      cardCount: categoryCards.length,
      studiedCount: 0
    };
  });

  const studyCards: Flashcard[] = selectedFlashcards.map(mapSupabaseFlashcard);
  
  const getCurrentCards = () => {
    let cards = [...studyCards];
    if (isShuffled || studyMode === 'random') {
      cards = cards.sort(() => Math.random() - 0.5);
    }
    return cards;
  };

  const currentCards = getCurrentCards();
  const currentCard = currentCards[currentCardIndex];
  const currentSupabaseCard = selectedFlashcards[currentCardIndex];
  const selectedCategory = categories.find(cat => cat.name === selectedArea);

  const handleAreaSelect = (areaName: string) => {
    setSelectedArea(areaName);
    setCurrentStep('themes');
  };

  const handleThemesSelected = (themes: string[]) => {
    setSelectedThemes(themes);
    setCurrentStep('study-mode');
  };

  const handleStudyModeSelect = async (mode: 'normal' | 'continue' | 'random') => {
    setStudyMode(mode);
    
    // Create new session
    try {
      const session = await createSession.mutateAsync({
        area: selectedArea!,
        temas: selectedThemes,
        totalCards: studyCards.length,
        sessionType: mode === 'random' ? 'random' : 'normal'
      });
      setCurrentSessionId(session.id);
    } catch (error) {
      console.error('Error creating session:', error);
    }

    // Set starting index based on mode
    let startIndex = 0;
    if (mode === 'continue' && lastSession) {
      startIndex = lastSession.last_card_index;
    } else if (mode === 'random') {
      setIsShuffled(true);
    }
    
    setCurrentCardIndex(startIndex);
    setCurrentStep('studying');
    setSessionStats({
      correct: 0,
      total: 0,
      streak: 0,
      maxStreak: 0,
      completed: false
    });
    setIsCardEntering(true);
    setTimeout(() => setIsCardEntering(false), 50);
  };

  const handleAnswer = async (correct: boolean) => {
    if (!currentCard || !selectedArea) return;

    const newStats = {
      correct: sessionStats.correct + (correct ? 1 : 0),
      total: sessionStats.total + 1,
      streak: correct ? sessionStats.streak + 1 : 0,
      maxStreak: correct ? Math.max(sessionStats.streak + 1, sessionStats.maxStreak) : sessionStats.maxStreak,
      completed: false
    };
    setSessionStats(newStats);

    // Update progress in database
    try {
      await updateProgress.mutateAsync({
        flashcardId: parseInt(currentCard.id),
        area: selectedArea,
        tema: currentSupabaseCard?.tema,
        correct
      });

      // Update session progress
      if (currentSessionId) {
        await updateSession.mutateAsync({
          sessionId: currentSessionId,
          lastCardIndex: currentCardIndex + 1,
          correctAnswers: newStats.correct,
          cardsReviewed: newStats.total,
          completed: currentCardIndex >= currentCards.length - 1
        });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }

    // Update local state for immediate feedback
    onUpdateFlashcard(currentCard.id, {
      studied: true,
      correctAnswers: currentCard.correctAnswers + (correct ? 1 : 0),
      totalAttempts: currentCard.totalAttempts + 1,
      lastStudied: new Date()
    });

    setExitDirection(correct ? 'right' : 'left');
    setIsCardExiting(true);
    
    setTimeout(() => {
      setIsCardExiting(false);
      if (currentCardIndex < currentCards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setIsCardEntering(true);
        setTimeout(() => setIsCardEntering(false), 50);
      } else {
        setSessionStats(prev => ({ ...prev, completed: true }));
      }
    }, 300);
  };

  const handleBackToCategories = () => {
    setCurrentStep('categories');
    setSelectedArea(null);
    setSelectedThemes([]);
    setCurrentCardIndex(0);
    setCurrentSessionId(null);
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
    setCurrentSessionId(null);
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

  // Loading states
  if (areasLoading || allFlashcardsLoading) {
    return (
      <div className="min-h-screen bg-netflix-black px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error states with retry option
  if (areasError || allFlashcardsError) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-2xl p-8 border border-neutral-700/50">
            <AlertCircle className="w-16 h-16 text-netflix-red mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Erro ao Carregar</h2>
            <p className="text-neutral-400 mb-6">
              Não foi possível carregar os dados. Verifique sua conexão e tente novamente.
            </p>
            {canRetry && (
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-netflix-red hover:bg-netflix-red/80 text-white"
              >
                Tentar Novamente
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Session completion
  if (sessionStats.completed && currentStep === 'studying') {
    return (
      <ErrorBoundary>
        <SessionStats 
          stats={sessionStats} 
          categoryName={`${selectedArea} - ${selectedThemes.join(', ')}`} 
          onFinish={handleFinishSession} 
          onContinue={handleContinueSession} 
        />
      </ErrorBoundary>
    );
  }

  // Study mode selection
  if (currentStep === 'study-mode' && selectedArea) {
    const hasProgress = lastSession && lastSession.last_card_index > 0;
    return (
      <StudyModeModal
        isOpen={true}
        onClose={() => setCurrentStep('themes')}
        onContinue={() => handleStudyModeSelect('continue')}
        onStartOver={() => handleStudyModeSelect('normal')}
        onRandom={() => handleStudyModeSelect('random')}
        hasProgress={hasProgress}
        lastStudiedIndex={lastSession?.last_card_index || 0}
        totalCards={studyCards.length}
      />
    );
  }

  // Theme selection
  if (currentStep === 'themes' && selectedArea) {
    return (
      <ErrorBoundary>
        <ImprovedThemeSelector 
          area={selectedArea} 
          areaColor={selectedCategory?.color || '#E50914'} 
          onThemesSelected={handleThemesSelected} 
          onBack={handleBackToCategories} 
        />
      </ErrorBoundary>
    );
  }

  // Study session with improved animations and features
  if (currentStep === 'studying' && selectedArea && currentCard) {
    if (selectedFlashcardsLoading) {
      return (
        <div className="min-h-screen bg-netflix-black">
          <div className="px-2 sm:px-4 py-4 sm:py-8">
            <div className="max-w-2xl mx-auto">
              <CardSkeleton />
            </div>
          </div>
        </div>
      );
    }

    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-netflix-black">
          <div className="sm:px-4 sm:py-8 py-[8px] my-0 mx-0 px-0">
            {/* Compact Top Controls */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="flex items-center justify-between">
                <Button 
                  onClick={handleBackToThemes} 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center space-x-2 backdrop-blur-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Voltar</span>
                </Button>
                
                <div className="flex items-center space-x-4">
                  <Button 
                    onClick={handleShuffle} 
                    variant="outline" 
                    size="sm" 
                    className={`${
                      isShuffled 
                        ? 'bg-netflix-red/20 border-netflix-red/50 text-netflix-red' 
                        : 'bg-white/10 border-white/20 text-white'
                    } hover:bg-netflix-red/30 flex items-center space-x-2 backdrop-blur-sm`}
                  >
                    <Shuffle className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {isShuffled ? 'Embaralhado' : 'Embaralhar'}
                    </span>
                  </Button>
                  
                  <div className="text-white text-sm bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                    {currentCardIndex + 1}/{currentCards.length}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-700/30 rounded-full h-1">
                  <div 
                    className="h-1 rounded-full transition-all duration-300" 
                    style={{
                      width: `${((currentCardIndex + 1) / currentCards.length) * 100}%`,
                      background: `linear-gradient(90deg, ${selectedCategory?.color || '#E50914'}, ${selectedCategory?.color || '#E50914'}80)`
                    }} 
                  />
                </div>
              </div>
            </div>

            {/* Improved Flashcard */}
            <div className="max-w-2xl mx-auto">
              <ImprovedAnimatedFlashCard 
                flashcard={currentCard} 
                onAnswer={handleAnswer} 
                areaColor={selectedCategory?.color || '#E50914'} 
                isExiting={isCardExiting} 
                exitDirection={exitDirection} 
                tema={currentSupabaseCard?.tema} 
                isEntering={isCardEntering} 
                exemplo={currentSupabaseCard?.explicacao} 
              />
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // Categories overview (default) with real flashcard data
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-netflix-black px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <GeneralSummary flashcards={allFlashcards.map(mapSupabaseFlashcard)} categories={categories} />

          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4">
              Escolha uma <span className="text-netflix-red">Área</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-4">
              Selecione a área do direito que deseja estudar e escolha os temas específicos
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {categoryStats.map((category, index) => (
              <div key={category.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CategoryCard 
                  category={category} 
                  cardCount={category.cardCount} 
                  studiedCount={category.studiedCount} 
                  isSelected={false} 
                  onClick={() => handleAreaSelect(category.name)} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default StudyView;
