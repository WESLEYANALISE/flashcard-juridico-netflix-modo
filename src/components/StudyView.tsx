
import { useState, useEffect } from 'react';
import { ArrowLeft, Shuffle, TrendingUp, Award, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Flashcard } from '@/types/flashcard';
import { useFlashcardAreas } from '@/hooks/useFlashcards';
import { generateCategoriesFromAreas } from '@/utils/flashcardMapper';
import CategoryCard from './CategoryCard';
import FlashCard from './FlashCard';

interface StudyViewProps {
  flashcards: Flashcard[];
  onUpdateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
}

const StudyView = ({ flashcards, onUpdateFlashcard }: StudyViewProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    total: 0,
    streak: 0,
    maxStreak: 0
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
  }, [selectedCategory, isShuffled]);

  const handleAnswer = (correct: boolean) => {
    if (!currentCard) return;

    const newStats = {
      correct: sessionStats.correct + (correct ? 1 : 0),
      total: sessionStats.total + 1,
      streak: correct ? sessionStats.streak + 1 : 0,
      maxStreak: correct ? Math.max(sessionStats.streak + 1, sessionStats.maxStreak) : sessionStats.maxStreak
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
        // End of deck - show completion
        alert(`Parabéns! Você completou esta categoria!\n\nAcertos: ${newStats.correct}/${newStats.total}\nSequência máxima: ${newStats.maxStreak}`);
        setSelectedCategory(null);
        setSessionStats({ correct: 0, total: 0, streak: 0, maxStreak: 0 });
      }
    }, 1000);
  };

  const handleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setCurrentCardIndex(0);
    setSessionStats({ correct: 0, total: 0, streak: 0, maxStreak: 0 });
  };

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-netflix-black px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Escolha uma <span className="text-netflix-red">Categoria</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Selecione a área do direito que deseja estudar e domine os conceitos fundamentais
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

          {/* Quick Stats */}
          <div className="bg-netflix-dark/50 rounded-2xl p-6 glass-effect animate-fade-in">
            <h3 className="text-xl font-semibold text-white mb-4">Resumo Geral</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-netflix-red">
                  {flashcards.length}
                </div>
                <div className="text-sm text-gray-400">Total de Cards</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {flashcards.filter(card => card.studied).length}
                </div>
                <div className="text-sm text-gray-400">Estudados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-netflix-gold">
                  {Math.round((flashcards.filter(card => card.studied).length / flashcards.length) * 100) || 0}%
                </div>
                <div className="text-sm text-gray-400">Progresso</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {categories.length}
                </div>
                <div className="text-sm text-gray-400">Categorias</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedCategoryData = categories.find(cat => cat.name === selectedCategory);

  return (
    <div className="min-h-screen bg-netflix-black px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center space-x-4">
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
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {selectedCategoryData?.name}
              </h1>
              <p className="text-gray-400">
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
        <div className="mb-8 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Progresso da Sessão</span>
            <span className="text-sm text-gray-400">
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

        {/* Session Stats */}
        {sessionStats.total > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
            <div className="bg-green-500/20 rounded-lg p-4 text-center">
              <Award className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-green-400">{sessionStats.correct}</div>
              <div className="text-xs text-gray-400">Acertos</div>
            </div>
            <div className="bg-blue-500/20 rounded-lg p-4 text-center">
              <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-blue-400">{sessionStats.total}</div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
            <div className="bg-orange-500/20 rounded-lg p-4 text-center">
              <TrendingUp className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-orange-400">{sessionStats.streak}</div>
              <div className="text-xs text-gray-400">Sequência</div>
            </div>
            <div className="bg-purple-500/20 rounded-lg p-4 text-center">
              <Award className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-purple-400">
                {sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0}%
              </div>
              <div className="text-xs text-gray-400">Precisão</div>
            </div>
          </div>
        )}

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
