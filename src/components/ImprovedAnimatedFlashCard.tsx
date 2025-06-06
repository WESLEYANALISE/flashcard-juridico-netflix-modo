
import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, Sparkles, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Flashcard } from '@/types/flashcard';

interface ImprovedAnimatedFlashCardProps {
  flashcard: Flashcard;
  onAnswer: (correct: boolean) => void;
  areaColor: string;
  isExiting: boolean;
  exitDirection: 'left' | 'right';
  isEntering: boolean;
  tema?: string;
  exemplo?: string;
  area?: string;
}

const ImprovedAnimatedFlashCard = ({
  flashcard,
  onAnswer,
  areaColor,
  isExiting,
  exitDirection,
  isEntering,
  tema,
  exemplo,
  area
}: ImprovedAnimatedFlashCardProps) => {
  const [showExample, setShowExample] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerType, setAnswerType] = useState<'correct' | 'incorrect' | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const handleAnswer = async (correct: boolean) => {
    setIsAnswering(true);
    setAnswerType(correct ? 'correct' : 'incorrect');

    // Add shake animation for incorrect answers
    if (!correct) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }

    // Wait for animation
    setTimeout(() => {
      onAnswer(correct);
      setIsAnswering(false);
      setAnswerType(null);
      setShowExample(false);
    }, 600);
  };

  const accuracy = flashcard.totalAttempts > 0 ? Math.round(flashcard.correctAnswers / flashcard.totalAttempts * 100) : 0;

  return (
    <div className={`max-w-2xl mx-auto relative px-2 sm:px-0 ${isShaking ? 'animate-[shake_0.6s_ease-in-out]' : ''}`}>
      {/* Answer Animation Overlay */}
      {isAnswering && answerType && (
        <div className={`
          fixed inset-0 z-50 flex items-center justify-center pointer-events-none
          ${answerType === 'correct' ? 'animate-[flash_0.6s_ease-out]' : 'animate-[flash_0.6s_ease-out]'}
        `}>
          <div className={`
            w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center
            ${answerType === 'correct' ? 'bg-green-500/30 border-4 border-green-400' : 'bg-red-500/30 border-4 border-red-400'}
            backdrop-blur-sm animate-scale-in
          `}>
            {answerType === 'correct' ? (
              <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-400" />
            ) : (
              <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-400" />
            )}
          </div>
          
          {/* Particles Effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`
                  absolute w-2 h-2 rounded-full animate-ping
                  ${answerType === 'correct' ? 'bg-green-400' : 'bg-red-400'}
                `}
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Card Container */}
      <div className={`
        relative transition-all duration-300 ease-out
        ${isExiting ? `transform ${exitDirection === 'left' ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'}` : ''}
        ${isEntering ? 'transform translate-x-8 opacity-60' : 'transform translate-x-0 opacity-100'}
      `}>
        <div className="w-full min-h-[400px] sm:min-h-[450px] md:min-h-[500px] bg-netflix-dark/50 rounded-xl sm:rounded-2xl glass-effect border border-white/20 p-4 sm:p-6 md:p-8 relative overflow-hidden">
          
          {/* Enhanced Header with Area and Theme */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="p-2 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${areaColor}20` }}
                >
                  <Scale className="w-5 h-5" style={{ color: areaColor }} />
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: areaColor }}>
                    {area || flashcard.category}
                  </div>
                  {tema && (
                    <div className="text-xs text-gray-400 mt-0.5">
                      {tema}
                    </div>
                  )}
                </div>
              </div>
              
              {flashcard.totalAttempts > 0 && (
                <div className="text-xs sm:text-sm text-gray-400 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${accuracy >= 70 ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  Acerto: {accuracy}%
                </div>
              )}
            </div>

            {/* Enhanced Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>

          {/* Question */}
          <div className="flex-1 flex items-center justify-center mb-6 sm:mb-8">
            <div className="text-center">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 leading-relaxed px-2">
                {flashcard.question}
              </h2>
              
              <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                <div className="p-4 sm:p-6 md:p-8 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 animate-fade-in">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-netflix-red mb-3 sm:mb-4">Resposta:</h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
                    {flashcard.answer}
                  </p>
                </div>

                {/* Example Section */}
                {exemplo && (
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setShowExample(!showExample)} 
                      variant="outline" 
                      size="sm" 
                      className="bg-netflix-gold/20 border-netflix-gold/50 text-netflix-gold hover:bg-netflix-gold/30 transition-all duration-300 text-xs sm:text-sm rounded-xl"
                    >
                      <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {showExample ? 'Ocultar' : 'Mostrar'} Exemplo
                      <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 ml-1 sm:ml-2" />
                    </Button>
                    
                    {showExample && (
                      <div className="p-4 sm:p-6 md:p-8 bg-netflix-gold/10 rounded-lg sm:rounded-xl border border-netflix-gold/20 animate-fade-in">
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-netflix-gold mb-3 sm:mb-4 flex items-center">
                          <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Exemplo Prático:
                        </h3>
                        <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
                          {exemplo}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 md:gap-6 animate-fade-in px-2 py-4 mx-4 rounded-xl">
            <Button 
              onClick={() => handleAnswer(false)} 
              disabled={isAnswering} 
              className={`
                bg-red-500/20 border-red-500/50 text-red-400 border-2 py-3 sm:py-4 px-6 sm:px-8
                hover:bg-red-500/30 hover:border-red-500 hover:scale-105 active:scale-95
                transition-all duration-300 font-semibold text-sm sm:text-base md:text-lg
                ${isAnswering ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Preciso Revisar
            </Button>
            
            <Button 
              onClick={() => handleAnswer(true)} 
              disabled={isAnswering} 
              className={`
                bg-green-500/20 border-green-500/50 text-green-400 border-2 py-3 sm:py-4 px-6 sm:px-8
                hover:bg-green-500/30 hover:border-green-500 hover:scale-105 active:scale-95
                transition-all duration-300 font-semibold text-sm sm:text-base md:text-lg
                ${isAnswering ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Compreendi
            </Button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-2 -right-2 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full blur-xl" 
               style={{ backgroundColor: `${areaColor}20` }} />
          <div className="absolute -bottom-2 -left-2 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-netflix-gold/20 rounded-full blur-xl" />
          
          {/* Progress Indicator */}
          <div className="absolute top-2 left-2 w-1 h-16 sm:h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ImprovedAnimatedFlashCard;
