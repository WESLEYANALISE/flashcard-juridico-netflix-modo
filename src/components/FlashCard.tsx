
import { useState } from 'react';
import { Flashcard } from '@/types/flashcard';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RotateCcw, Eye, EyeOff } from 'lucide-react';

interface FlashCardProps {
  flashcard: Flashcard;
  onAnswer: (correct: boolean) => void;
  showAnswerByDefault?: boolean;
}

const FlashCard = ({ flashcard, onAnswer, showAnswerByDefault = true }: FlashCardProps) => {
  const [showAnswer, setShowAnswer] = useState(showAnswerByDefault);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(!showAnswer);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'text-green-400 bg-green-400/20';
      case 'Médio': return 'text-yellow-400 bg-yellow-400/20';
      case 'Difícil': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const accuracy = flashcard.totalAttempts > 0 
    ? Math.round((flashcard.correctAnswers / flashcard.totalAttempts) * 100) 
    : 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        {/* Card Container */}
        <div className={`relative w-full min-h-[400px] transition-all duration-700 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}>
          
          {/* Front/Question Side */}
          <div className={`absolute inset-0 w-full h-full rounded-2xl glass-effect border border-white/20 transition-all duration-700 ${
            isFlipped ? 'rotate-y-180 opacity-0' : 'opacity-100'
          }`}>
            <div className="p-8 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(flashcard.difficulty)}`}>
                  {flashcard.difficulty}
                </div>
                
                {flashcard.totalAttempts > 0 && (
                  <div className="text-sm text-gray-400">
                    Acerto: {accuracy}%
                  </div>
                )}
              </div>

              {/* Question */}
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-relaxed">
                    {flashcard.question}
                  </h2>
                  
                  {showAnswer && (
                    <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10 animate-fade-in">
                      <h3 className="text-lg font-semibold text-netflix-red mb-3">Resposta:</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {flashcard.answer}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="mt-6 space-y-4">
                <div className="flex justify-center">
                  <Button
                    onClick={handleFlip}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    {showAnswer ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {showAnswer ? 'Ocultar' : 'Mostrar'} Resposta
                  </Button>
                </div>

                {showAnswer && (
                  <div className="flex justify-center space-x-4 animate-fade-in">
                    <Button
                      onClick={() => onAnswer(false)}
                      variant="outline"
                      className="bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30 hover:border-red-500 transition-all duration-300"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Errei
                    </Button>
                    
                    <Button
                      onClick={() => onAnswer(true)}
                      variant="outline"
                      className="bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30 hover:border-green-500 transition-all duration-300"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Acertei
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-netflix-red/20 rounded-full blur-xl" />
        <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-netflix-gold/20 rounded-full blur-xl" />
      </div>
    </div>
  );
};

export default FlashCard;
