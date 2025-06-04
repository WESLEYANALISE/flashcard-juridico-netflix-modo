
import { useState, useEffect } from 'react';
import { Flashcard } from '@/types/flashcard';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Eye, EyeOff, Scale } from 'lucide-react';

interface AnimatedFlashCardProps {
  flashcard: Flashcard;
  onAnswer: (correct: boolean) => void;
  showAnswerByDefault?: boolean;
  areaColor: string;
  isExiting?: boolean;
  exitDirection?: 'left' | 'right';
}

const AnimatedFlashCard = ({ 
  flashcard, 
  onAnswer, 
  showAnswerByDefault = false, 
  areaColor,
  isExiting = false,
  exitDirection = 'right'
}: AnimatedFlashCardProps) => {
  const [showAnswer, setShowAnswer] = useState(showAnswerByDefault);
  const [isFlipping, setIsFlipping] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

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

  const handleShowAnswer = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setShowAnswer(!showAnswer);
      setIsFlipping(false);
    }, 150);
  };

  const handleAnswer = (correct: boolean) => {
    // Create particles effect
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: correct ? '#10B981' : '#EF4444'
    }));
    setParticles(newParticles);

    // Remove particles after animation
    setTimeout(() => setParticles([]), 1000);

    onAnswer(correct);
  };

  const cardExitClass = isExiting 
    ? exitDirection === 'right' 
      ? 'animate-slide-out-right' 
      : 'animate-slide-out-left'
    : 'animate-scale-in';

  return (
    <div className="max-w-2xl mx-auto relative">
      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full animate-bounce pointer-events-none z-50"
          style={{
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDuration: '1s',
            animationFillMode: 'forwards'
          }}
        />
      ))}

      <div className={`relative ${cardExitClass}`}>
        {/* Card Container */}
        <div className={`w-full min-h-[400px] sm:min-h-[450px] bg-netflix-dark/50 rounded-2xl glass-effect border border-white/20 p-4 sm:p-8 transition-transform duration-300 ${isFlipping ? 'scale-95 rotate-y-180' : ''}`}>
          
          {/* Strategic Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Scale 
                  className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" 
                  style={{ color: areaColor }}
                />
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    {flashcard.category}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-400">
                    {/* Extract theme from flashcard data if available */}
                    Tema: {flashcard.category}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(flashcard.difficulty)}`}>
                  {flashcard.difficulty}
                </div>
                
                {flashcard.totalAttempts > 0 && (
                  <div className="text-xs sm:text-sm text-gray-400">
                    {accuracy}% acerto
                  </div>
                )}
              </div>
            </div>
            
            {/* Decorative line */}
            <div 
              className="h-1 rounded-full w-full opacity-50"
              style={{ background: `linear-gradient(90deg, ${areaColor}, transparent)` }}
            />
          </div>

          {/* Question */}
          <div className="flex-1 flex items-center justify-center mb-8">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 leading-relaxed">
                {flashcard.question}
              </h3>
              
              {showAnswer && (
                <div className="mt-8 p-4 sm:p-6 bg-white/5 rounded-xl border border-white/10 animate-fade-in backdrop-blur-sm">
                  <div className="flex items-center justify-center mb-3">
                    <Scale 
                      className="w-5 h-5 mr-2" 
                      style={{ color: areaColor }}
                    />
                    <h4 className="text-base sm:text-lg font-semibold" style={{ color: areaColor }}>
                      Resposta:
                    </h4>
                  </div>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {flashcard.answer}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <Button
                onClick={handleShowAnswer}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                style={{ '--hover-color': areaColor } as any}
              >
                {showAnswer ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showAnswer ? 'Ocultar' : 'Mostrar'} Resposta
              </Button>
            </div>

            {showAnswer && (
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 animate-fade-in">
                <Button
                  onClick={() => handleAnswer(false)}
                  variant="outline"
                  className="bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30 hover:border-red-500 transition-all duration-300 py-3 hover:scale-105"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Errei
                </Button>
                
                <Button
                  onClick={() => handleAnswer(true)}
                  variant="outline"
                  className="bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30 hover:border-green-500 transition-all duration-300 py-3 hover:scale-105"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Acertei
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Decorative Elements */}
        <div 
          className="absolute -top-2 -right-2 w-12 h-12 sm:w-16 sm:h-16 rounded-full blur-xl opacity-60"
          style={{ backgroundColor: `${areaColor}40` }}
        />
        <div 
          className="absolute -bottom-2 -left-2 w-16 h-16 sm:w-20 sm:h-20 rounded-full blur-xl opacity-40"
          style={{ backgroundColor: `${areaColor}20` }}
        />
        
        {/* Floating justice scales */}
        <Scale 
          className="absolute top-4 right-4 w-6 h-6 opacity-20 animate-pulse"
          style={{ color: areaColor }}
        />
      </div>
    </div>
  );
};

export default AnimatedFlashCard;
