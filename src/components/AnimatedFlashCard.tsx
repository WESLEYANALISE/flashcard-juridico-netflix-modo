
import { useState, useEffect } from 'react';
import { Flashcard } from '@/types/flashcard';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Eye, EyeOff, Scale, Shuffle, ArrowLeft } from 'lucide-react';

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
      case 'Fácil': return 'bg-green-500 text-white';
      case 'Médio': return 'bg-yellow-500 text-white';
      case 'Difícil': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
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
        <div className={`w-full bg-netflix-dark rounded-2xl border border-white/10 overflow-hidden transition-transform duration-300 ${isFlipping ? 'scale-95' : ''}`}>
          
          {/* Card Header */}
          <div className="bg-netflix-gray/50 border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Scale 
                  className="w-6 h-6" 
                  style={{ color: areaColor }}
                />
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {flashcard.category}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Tema: {flashcard.category}
                  </p>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(flashcard.difficulty)}`}>
                {flashcard.difficulty}
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-8">
            {/* Question */}
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-relaxed">
                {flashcard.question}
              </h3>
              
              {showAnswer && (
                <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10 animate-fade-in">
                  <p className="text-base text-gray-300 leading-relaxed">
                    {flashcard.answer}
                  </p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <div className="flex justify-center">
                <Button
                  onClick={handleShowAnswer}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 px-6 py-3"
                >
                  {showAnswer ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showAnswer ? 'Ocultar' : 'Mostrar'} Resposta
                </Button>
              </div>

              {showAnswer && (
                <div className="flex justify-center gap-4 animate-fade-in">
                  <Button
                    onClick={() => handleAnswer(false)}
                    variant="outline"
                    className="bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30 hover:border-red-500 transition-all duration-300 px-8 py-3 hover:scale-105"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Errei
                  </Button>
                  
                  <Button
                    onClick={() => handleAnswer(true)}
                    variant="outline"
                    className="bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30 hover:border-green-500 transition-all duration-300 px-8 py-3 hover:scale-105"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Acertei
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Decorative glow effects */}
        <div 
          className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-xl opacity-30 pointer-events-none"
          style={{ backgroundColor: areaColor }}
        />
        <div 
          className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full blur-xl opacity-20 pointer-events-none"
          style={{ backgroundColor: areaColor }}
        />
      </div>
    </div>
  );
};

export default AnimatedFlashCard;
