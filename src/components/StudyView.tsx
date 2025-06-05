
import { useState, useEffect } from 'react';
import { ArrowLeft, Shuffle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Flashcard } from '@/types/flashcard';
import { useFlashcards, useFlashcardAreas } from '@/hooks/useFlashcards';
import { useFlashcardsByAreaAndThemes } from '@/hooks/useFlashcardsByArea';
import { useUpdateProgress, useStudySessions, useCreateStudySession, useUpdateStudySession } from '@/hooks/useRealUserProgress';
import { generateCategoriesFromAreas, mapSupabaseFlashcard } from '@/utils/flashcardMapper';
import { useErrorHandling } from '@/hooks/useErrorHandling';
import { CardSkeleton, CategoryCardSkeleton } from '@/components/ui/card-skeleton';
import CategoryCard from './CategoryCard';
import ImprovedThemeSelector from './ImprovedThemeSelector';
import ImprovedAnimatedFlashCard from './ImprovedAnimatedFlashCard';
import SessionStats from './SessionStats';
import GeneralSummary from './GeneralSummary';
import StudyModeModal from './StudyModeModal';
import ErrorBoundary from './ErrorBoundary';

interface StudyViewProps {
  flashcards: Flashcard[];
  onUpdateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
  onHideNavbar?: (hide: boolean) => void;
}

type StudyStep = 'categories' | 'themes' | 'studying';
type StudyMode = 'continue' | 'start' | 'random';

const StudyView = ({
  onUpdateFlashcard,
  onHideNavbar
}: StudyViewProps) => {
  const [currentStep, setCurrentStep] = useState<StudyStep>('categories');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [studyMode, setStudyMode] = useState<StudyMode>('start');
  const [showModeModal, setShowModeModal] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isCardExiting, setIsCardExiting] = useState(false);
  const [isCardEntering, setIsCardEntering] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right'>('right');
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    total: 0,
    streak: 0,
    maxStreak: 0,
    completed: false
  });
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());

  const {
    handleError,
    retry,
    canRetry
  } = useErrorHandling();

  const updateProgress = useUpdateProgress();
  const createSession = useCreateStudySession();
  const updateSession = useUpdateStudySession();
  const { data: studySessions = [] } = useStudySessions();

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
    if (studyMode === 'random') {
      cards = cards.sort(() => Math.random() - 0.5);
    }
    return cards;
  };

  const currentCards = getCurrentCards();
  const currentCard = currentCards[currentCardIndex];
  const currentSupabaseCard = selectedFlashcards[currentCardIndex];
  const selectedCategory = categories.find(cat => cat.name === selectedArea);

  // Check for existing sessions
  const hasProgress = selectedArea ? studySessions.some(session => 
    session.area === selectedArea && 
    selectedThemes.every(theme => session.temas.includes(theme)) &&
    !session.completed
  ) : false;

  const lastStudiedThemes = selectedArea ? 
    studySessions
      .filter(session => session.area === selectedArea && !session.completed)
      .slice(0, 1)
      .flatMap(session => session.temas) : [];

  // Reset when changing steps
  useEffect(() => {
    if (currentStep === 'studying') {
      setSessionStats({
        correct: 0,
        total: 0,
        streak: 0,
        maxStreak: 0,
        completed: false
      });
      setSessionStartTime(Date.now());
      setIsCardEntering(true);
      setTimeout(() => setIsCardEntering(false), 50);
    }
  }, [currentStep, selectedThemes]);

  const handleAreaSelect = (areaName: string) => {
    setSelectedArea(areaName);
    setCurrentStep('themes');
  };

  const handleThemesSelected = (themes: string[]) => {
    setSelectedThemes(themes);
    
    // Check if there's existing progress
    const existingSession = studySessions.find(session => 
      session.area === selectedArea && 
      themes.every(theme => session.temas.includes(theme)) &&
      !session.completed
    );

    if (existingSession) {
      setShowModeModal(true);
    } else {
      handleStartStudy('start');
    }
  };

  const handleStartStudy = async (mode: StudyMode) => {
    setStudyMode(mode);
    setShowModeModal(false);
    
    // Create or update session
    try {
      if (mode === 'continue') {
        const existingSession = studySessions.find(session => 
          session.area === selectedArea && 
          selectedThemes.every(theme => session.temas.includes(theme)) &&
          !session.completed
        );
        if (existingSession) {
          setCurrentSessionId(existingSession.id);
          setCurrentCardIndex(existingSession.last_card_index);
        }
      } else {
        const sessionData = await createSession.mutateAsync({
          area: selectedArea!,
          temas: selectedThemes,
          total_cards: studyCards.length,
          session_type: mode === 'random' ? 'random' : 'normal'
        });
        setCurrentSessionId(sessionData.id);
        setCurrentCardIndex(0);
      }
    } catch (error) {
      console.error('Error managing session:', error);
    }
    
    setCurrentStep('studying');
  };

  const handleAnswer = async (correct: boolean) => {
    if (!currentCard || !selectedArea) return;

    const timeSpent = Math.floor((Date.now() - sessionStartTime) / 1000);
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
        correct,
        timeSpent: Math.floor(timeSpent / currentCards.length)
      });

      // Update session progress
      if (currentSessionId) {
        await updateSession.mutateAsync({
          sessionId: currentSessionId,
          updates: {
            cards_reviewed: newStats.total,
            correct_answers: newStats.correct,
            last_card_index: currentCardIndex + 1
          }
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
        // Mark session as completed
        if (currentSessionId) {
          updateSession.mutateAsync({
            sessionId: currentSessionId,
            updates: { completed: true }
          });
        }
        setSessionStats(prev => ({
          ...prev,
          completed: true
        }));
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
              <Button onClick={() => window.location.reload()} className="bg-netflix-red hover:bg-netflix-red/80 text-white">
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

  // Study session with improved animations
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

            {/* Flashcard with improved animations */}
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

        {/* Study Mode Modal */}
        <StudyModeModal 
          isOpen={showModeModal}
          onClose={() => setShowModeModal(false)}
          onStart={handleStartStudy}
          hasProgress={hasProgress}
          lastStudiedThemes={lastStudiedThemes}
          categoryName={selectedArea || ''}
        />
      </ErrorBoundary>
    );
  }

  // Categories overview (default)
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
