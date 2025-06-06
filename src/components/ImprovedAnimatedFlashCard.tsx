import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, Sparkles } from 'lucide-react';
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
}
const ImprovedAnimatedFlashCard = ({
  flashcard,
  onAnswer,
  areaColor,
  isExiting,
  exitDirection,
  isEntering,
  tema,
  exemplo
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
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil':
        return 'text-green-400 bg-green-400/20';
      case 'Médio':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'Difícil':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };
  const accuracy = flashcard.totalAttempts > 0 ? Math.round(flashcard.correctAnswers / flashcard.totalAttempts * 100) : 0;
  return <div className={`max-w-2xl mx-auto relative px-2 sm:px-0 ${isShaking ? 'animate-[shake_0.6s_ease-in-out]' : ''}`}>
      {/* Answer Animation Overlay */}
      {isAnswering && answerType && <div className={`
          fixed inset-0 z-50 flex items-center justify-center pointer-events-none
          ${answerType === 'correct' ? 'animate-[flash_0.6s_ease-out]' : 'animate-[flash_0.6s_ease-out]'}
        `}>
          <div className={`
            w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center
            ${answerType === 'correct' ? 'bg-green-500/30 border-4 border-green-400' : 'bg-red-500/30 border-4 border-red-400'}
            backdrop-blur-sm animate-scale-in
          `}>
            {answerType === 'correct' ? <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-400" /> : <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-400" />}
          </div>
          
          {/* Particles Effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => <div key={i} className={`
                  absolute w-2 h-2 rounded-full animate-ping
                  ${answerType === 'correct' ? 'bg-green-400' : 'bg-red-400'}
                `} style={{
          left: `${20 + Math.random() * 60}%`,
          top: `${20 + Math.random() * 60}%`,
          animationDelay: `${i * 0.1}s`,
          animationDuration: '1s'
        }} />)}
          </div>
        </div>}

      {/* Card Container */}
      <div className={`
        relative transition-all duration-300 ease-out
        ${isExiting ? `transform ${exitDirection === 'left' ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'}` : ''}
        ${isEntering ? 'transform translate-x-8 opacity-60' : 'transform translate-x-0 opacity-100'}
      `}>
        <div className="w-full min-h-[350px] sm:min-h-[400px] md:min-h-[450px] bg-netflix-dark/50 rounded-xl sm:rounded-2xl glass-effect border border-white/20 p-3 sm:p-6 md:p-8 relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              {tema && <div className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-gray-300">
                  {tema}
                </div>}
            </div>
            
            {flashcard.totalAttempts > 0 && <div className="text-xs sm:text-sm text-gray-400 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${accuracy >= 70 ? 'bg-green-400' : 'bg-yellow-400'}`} />
                Acerto: {accuracy}%
              </div>}
          </div>

          {/* Question */}
          <div className="flex-1 flex items-center justify-center mb-4 sm:mb-6">
            <div className="text-center">
              <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4 leading-relaxed px-2">
                {flashcard.question}
              </h2>
              
              <div className="mt-4 sm:mt-6 md:mt-8 space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 md:p-6 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 animate-fade-in">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-netflix-red mb-2 sm:mb-3">Resposta:</h3>
                  <p className="sm:text-sm md:text-base text-gray-300 leading-relaxed text-sm">
                    {flashcard.answer}
                  </p>
                </div>

                {/* Example Section - Only shows when clicked */}
                {exemplo && <div className="space-y-2">
                    <Button onClick={() => setShowExample(!showExample)} variant="outline" size="sm" className="bg-netflix-gold/20 border-netflix-gold/50 text-netflix-gold hover:bg-netflix-gold/30 transition-all duration-300 text-xs sm:text-sm">
                      <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {showExample ? 'Ocultar' : 'Mostrar'} Exemplo
                      <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 ml-1 sm:ml-2" />
                    </Button>
                    
                    {showExample && <div className="p-3 sm:p-4 md:p-6 bg-netflix-gold/10 rounded-lg sm:rounded-xl border border-netflix-gold/20 animate-fade-in">
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-netflix-gold mb-2 sm:mb-3 flex items-center">
                          <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Exemplo Prático:
                        </h3>
                        <p className="sm:text-sm md:text-base text-gray-300 leading-relaxed text-sm">
                          {exemplo}
                        </p>
                      </div>}
                  </div>}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 md:gap-4 animate-fade-in px-[4px] my-[7px] py-[9px] mx-[18px]">
            <Button onClick={() => handleAnswer(false)} disabled={isAnswering} className={`
                bg-red-500/20 border-red-500/50 text-red-400 border-2 py-2 sm:py-3 px-4 sm:px-6
                hover:bg-red-500/30 hover:border-red-500 hover:scale-105 active:scale-95
                transition-all duration-300 font-semibold text-xs sm:text-sm md:text-base
                ${isAnswering ? 'opacity-50 cursor-not-allowed' : ''}
              `}>
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Preciso Revisar
            </Button>
            
            <Button onClick={() => handleAnswer(true)} disabled={isAnswering} className={`
                bg-green-500/20 border-green-500/50 text-green-400 border-2 py-2 sm:py-3 px-4 sm:px-6
                hover:bg-green-500/30 hover:border-green-500 hover:scale-105 active:scale-95
                transition-all duration-300 font-semibold text-xs sm:text-sm md:text-base
                ${isAnswering ? 'opacity-50 cursor-not-allowed' : ''}
              `}>
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Compreendi
            </Button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-netflix-red/20 rounded-full blur-xl" />
          <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-netflix-gold/20 rounded-full blur-xl" />
          
          {/* Progress Indicator */}
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 w-0.5 sm:w-1 h-12 sm:h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent rounded-full" />
        </div>
      </div>
    </div>;
};
export default ImprovedAnimatedFlashCard;