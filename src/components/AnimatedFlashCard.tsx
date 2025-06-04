
import { useState } from 'react';
import { Flashcard } from '@/types/flashcard';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Scale } from 'lucide-react';

interface AnimatedFlashCardProps {
  flashcard: Flashcard;
  onAnswer: (correct: boolean) => void;
  areaColor: string;
  isExiting?: boolean;
  exitDirection?: 'left' | 'right';
  tema?: string;
}

const AnimatedFlashCard = ({
  flashcard,
  onAnswer,
  areaColor,
  isExiting = false,
  exitDirection = 'right',
  tema
}: AnimatedFlashCardProps) => {
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

  const handleAnswer = (correct: boolean) => {
    onAnswer(correct);
  };

  const cardExitClass = isExiting 
    ? exitDirection === 'right' 
      ? 'translate-x-full opacity-0 scale-95' 
      : '-translate-x-full opacity-0 scale-95' 
    : 'translate-x-0 opacity-100 scale-100';

  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto relative px-2">
      <div className={`relative transform transition-all duration-500 ease-out ${cardExitClass}`}>
        {/* Main Card */}
        <div className="w-full bg-gradient-to-br from-neutral-900/95 via-neutral-800/95 to-neutral-900/95 rounded-xl sm:rounded-2xl border border-neutral-600/40 overflow-hidden shadow-xl backdrop-blur-lg transition-all duration-300 hover:scale-[1.02]">
          
          {/* Card Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-800/90 via-neutral-700/80 to-neutral-800/90" />
            
            <div className="relative z-10 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="p-2 rounded-lg shadow-md border backdrop-blur-sm transition-all duration-300"
                    style={{
                      backgroundColor: `${areaColor}20`,
                      borderColor: `${areaColor}40`,
                      boxShadow: `0 2px 8px ${areaColor}15`
                    }}
                  >
                    <Scale 
                      className="w-4 h-4 sm:w-5 sm:h-5" 
                      style={{ color: areaColor }} 
                    />
                  </div>
                  
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 tracking-wide leading-tight">
                      {flashcard.category}
                    </h2>
                    {tema && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-neutral-300 font-medium">Tema:</span>
                        <span className="text-xs font-semibold text-white bg-gradient-to-r from-neutral-700/80 to-neutral-600/80 px-2 py-1 rounded-full border border-neutral-500/40 shadow-sm backdrop-blur-sm">
                          {tema}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold border backdrop-blur-sm shadow-md transition-all duration-300 ${getDifficultyColor(flashcard.difficulty)}`}>
                  {flashcard.difficulty}
                </div>
              </div>
            </div>
            
            <div 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-60"
              style={{ color: areaColor }}
            />
          </div>

          {/* Card Content */}
          <div className="p-4 sm:p-6 md:p-8 relative overflow-hidden">
            {/* Question */}
            <div className="text-center mb-6 relative z-10">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 leading-relaxed tracking-wide">
                {flashcard.question}
              </h3>
              
              {/* Answer always visible */}
              <div className="mt-4 p-4 sm:p-6 bg-gradient-to-br from-neutral-800/70 to-neutral-700/50 rounded-xl border border-neutral-600/50 backdrop-blur-md shadow-lg">
                <div className="text-sm sm:text-base md:text-lg text-neutral-100 leading-relaxed font-medium">
                  {flashcard.answer}
                </div>
              </div>
            </div>

            {/* Answer Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Button 
                onClick={() => handleAnswer(false)} 
                variant="outline" 
                className="bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25 hover:border-rose-400/60 transition-all duration-300 px-6 py-3 text-base rounded-lg hover:scale-105 shadow-lg hover:shadow-rose-500/20 font-semibold flex-1 sm:flex-none"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Errei
              </Button>
              
              <Button 
                onClick={() => handleAnswer(true)} 
                variant="outline" 
                className="bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 hover:border-emerald-400/60 transition-all duration-300 px-6 py-3 text-base rounded-lg hover:scale-105 shadow-lg hover:shadow-emerald-500/20 font-semibold flex-1 sm:flex-none"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Acertei
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedFlashCard;
