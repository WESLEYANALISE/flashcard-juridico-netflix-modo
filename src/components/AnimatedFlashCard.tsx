
import { useState, useEffect } from 'react';
import { Flashcard } from '@/types/flashcard';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Scale } from 'lucide-react';

interface AnimatedFlashCardProps {
  flashcard: Flashcard;
  onAnswer: (correct: boolean) => void;
  showAnswerByDefault?: boolean;
  areaColor: string;
  isExiting?: boolean;
  exitDirection?: 'left' | 'right';
  tema?: string;
}

const AnimatedFlashCard = ({
  flashcard,
  onAnswer,
  showAnswerByDefault = false,
  areaColor,
  isExiting = false,
  exitDirection = 'right',
  tema
}: AnimatedFlashCardProps) => {
  const [showAnswer, setShowAnswer] = useState(showAnswerByDefault);
  const [isFlipping, setIsFlipping] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Médio':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Difícil':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  const handleShowAnswer = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setShowAnswer(!showAnswer);
      setIsFlipping(false);
    }, 150);
  };

  const handleAnswer = (correct: boolean) => {
    onAnswer(correct);
  };

  const cardExitClass = isExiting 
    ? exitDirection === 'right' 
      ? 'translate-x-full opacity-0 scale-95' 
      : '-translate-x-full opacity-0 scale-95' 
    : 'translate-x-0 opacity-100 scale-100';

  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto relative px-2">
      <div className={`relative transform transition-all duration-500 ease-out ${cardExitClass}`}>
        {/* Main Card */}
        <div className={`w-full bg-gradient-to-br from-neutral-900/95 via-neutral-800/95 to-neutral-900/95 rounded-2xl sm:rounded-3xl border border-neutral-600/40 overflow-hidden shadow-2xl backdrop-blur-lg transition-all duration-300 ${isFlipping ? 'scale-98' : 'hover:scale-[1.01]'}`}>
          
          {/* Enhanced Card Header */}
          <div className="relative overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-800/90 via-neutral-700/80 to-neutral-800/90" />
            
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-6 text-2xl font-serif text-white/30">§</div>
              <div className="absolute top-6 right-8 text-xl font-serif text-white/20">⚖</div>
              <div className="absolute bottom-3 left-1/3 text-lg font-serif text-white/25">Art.</div>
            </div>
            
            <div className="relative z-10 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  {/* Icon container with improved styling */}
                  <div 
                    className="p-3 rounded-xl shadow-lg border backdrop-blur-sm transition-all duration-300"
                    style={{
                      backgroundColor: `${areaColor}20`,
                      borderColor: `${areaColor}40`,
                      boxShadow: `0 4px 12px ${areaColor}15`
                    }}
                  >
                    <Scale 
                      className="w-6 h-6 transition-transform duration-300 hover:scale-110" 
                      style={{ color: areaColor }} 
                    />
                  </div>
                  
                  <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 tracking-wide leading-tight">
                      {flashcard.category}
                    </h2>
                    {tema && (
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-neutral-300 font-medium">Tema:</span>
                        <span className="text-sm font-semibold text-white bg-gradient-to-r from-neutral-700/80 to-neutral-600/80 px-3 py-1.5 rounded-full border border-neutral-500/40 shadow-md backdrop-blur-sm">
                          {tema}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Improved difficulty badge */}
                <div className={`px-4 py-2.5 rounded-xl text-sm font-semibold border backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-105 ${getDifficultyColor(flashcard.difficulty)}`}>
                  {flashcard.difficulty}
                </div>
              </div>
            </div>
            
            {/* Bottom border with area color */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-60"
              style={{ color: areaColor }}
            />
          </div>

          {/* Card Content */}
          <div className="p-8 sm:p-12 md:p-16 lg:p-20 relative overflow-hidden">
            {/* Subtle legal background */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-8 right-8 text-5xl font-serif text-white/20">§</div>
              <div className="absolute bottom-12 left-8 text-4xl font-serif text-white/15">Art.</div>
              <div className="absolute top-1/3 left-1/4 text-3xl font-serif text-white/10">⚖</div>
              <div className="absolute bottom-1/3 right-1/4 text-2xl font-serif text-white/10">📖</div>
            </div>

            {/* Question */}
            <div className="text-center mb-12 relative z-10">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-relaxed tracking-wide">
                {flashcard.question}
              </h3>
              
              {showAnswer && (
                <div className="mt-8 p-8 bg-gradient-to-br from-neutral-800/70 to-neutral-700/50 rounded-2xl border border-neutral-600/50 animate-fade-in backdrop-blur-md shadow-xl">
                  <div className="text-lg sm:text-xl md:text-2xl text-neutral-100 leading-relaxed font-medium">
                    {flashcard.answer}
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="space-y-8 relative z-10">
              <div className="flex justify-center">
                <Button 
                  onClick={handleShowAnswer} 
                  variant="outline" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 px-8 py-4 text-lg rounded-xl hover:scale-105 shadow-lg backdrop-blur-sm font-semibold"
                >
                  {showAnswer ? 'Ocultar Resposta' : 'Ver Resposta'}
                </Button>
              </div>

              {showAnswer && (
                <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in">
                  <Button 
                    onClick={() => handleAnswer(false)} 
                    variant="outline" 
                    className="bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25 hover:border-rose-400/60 transition-all duration-300 px-10 py-5 text-xl rounded-xl hover:scale-110 shadow-lg hover:shadow-rose-500/20 font-semibold flex-1 sm:flex-none"
                  >
                    <XCircle className="w-5 h-5 mr-3" />
                    Errei
                  </Button>
                  
                  <Button 
                    onClick={() => handleAnswer(true)} 
                    variant="outline" 
                    className="bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 hover:border-emerald-400/60 transition-all duration-300 px-10 py-5 text-xl rounded-xl hover:scale-110 shadow-lg hover:shadow-emerald-500/20 font-semibold flex-1 sm:flex-none"
                  >
                    <CheckCircle className="w-5 h-5 mr-3" />
                    Acertei
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subtle glow effect only */}
        <div 
          className="absolute -top-4 -right-4 w-32 h-32 rounded-full blur-3xl opacity-5 pointer-events-none animate-pulse" 
          style={{ backgroundColor: areaColor }} 
        />
      </div>
    </div>
  );
};

export default AnimatedFlashCard;
