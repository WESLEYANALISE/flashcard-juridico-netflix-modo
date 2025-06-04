
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
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Médio': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Difícil': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleShowAnswer = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setShowAnswer(!showAnswer);
      setIsFlipping(false);
    }, 200);
  };

  const handleAnswer = (correct: boolean) => {
    // Create enhanced particles effect
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      color: correct ? '#10B981' : '#EF4444'
    }));
    setParticles(newParticles);

    // Remove particles after animation
    setTimeout(() => setParticles([]), 1500);

    onAnswer(correct);
  };

  const cardExitClass = isExiting 
    ? exitDirection === 'right' 
      ? 'animate-slide-out-right opacity-0 scale-95' 
      : 'animate-slide-out-left opacity-0 scale-95'
    : 'animate-fade-in';

  return (
    <div className="max-w-3xl mx-auto relative">
      {/* Enhanced Particles */}
      {particles.map((particle, index) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full pointer-events-none z-50"
          style={{
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `particleFloat 1.5s ease-out forwards`,
            animationDelay: `${index * 0.1}s`,
            boxShadow: `0 0 10px ${particle.color}`
          }}
        />
      ))}

      <div className={`relative transform transition-all duration-600 ${cardExitClass}`}>
        {/* Enhanced Card Container */}
        <div className={`w-full bg-gradient-to-br from-netflix-dark via-netflix-dark to-netflix-gray/80 rounded-3xl border border-white/20 overflow-hidden shadow-2xl backdrop-blur-sm transition-all duration-300 ${isFlipping ? 'scale-98 rotate-1' : 'hover:scale-[1.02] hover:-rotate-1'}`}>
          
          {/* Card Header with Theme */}
          <div className="bg-gradient-to-r from-netflix-gray/60 to-netflix-dark/60 border-b border-white/20 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div 
                  className="p-3 rounded-xl shadow-lg"
                  style={{ 
                    backgroundColor: `${areaColor}20`,
                    border: `1px solid ${areaColor}40`
                  }}
                >
                  <Scale 
                    className="w-7 h-7" 
                    style={{ color: areaColor }}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    {flashcard.category}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Tema:</span>
                    <span className="text-sm font-medium text-white bg-white/10 px-3 py-1 rounded-full">
                      {tema || 'Não especificado'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={`px-4 py-2 rounded-xl text-sm font-medium border ${getDifficultyColor(flashcard.difficulty)}`}>
                {flashcard.difficulty}
              </div>
            </div>
          </div>

          {/* Enhanced Card Content */}
          <div className="p-8 sm:p-12 relative">
            {/* Legal pattern background */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 right-4 text-4xl font-serif text-white/20">§</div>
              <div className="absolute bottom-4 left-4 text-3xl font-serif text-white/20">Art.</div>
            </div>

            {/* Question */}
            <div className="text-center mb-10 relative z-10">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8 leading-relaxed">
                {flashcard.question}
              </h3>
              
              {showAnswer && (
                <div className="mt-10 p-8 bg-white/10 rounded-2xl border border-white/20 animate-fade-in backdrop-blur-sm shadow-xl">
                  <div className="text-lg text-gray-200 leading-relaxed">
                    {flashcard.answer}
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Controls */}
            <div className="space-y-8 relative z-10">
              <div className="flex justify-center">
                <Button
                  onClick={handleShowAnswer}
                  variant="outline"
                  className="bg-white/15 border-white/30 text-white hover:bg-white/25 transition-all duration-300 px-8 py-4 text-lg rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {showAnswer ? <EyeOff className="w-5 h-5 mr-3" /> : <Eye className="w-5 h-5 mr-3" />}
                  {showAnswer ? 'Ocultar' : 'Mostrar'} Resposta
                </Button>
              </div>

              {showAnswer && (
                <div className="flex justify-center gap-6 animate-fade-in">
                  <Button
                    onClick={() => handleAnswer(false)}
                    variant="outline"
                    className="bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30 hover:border-red-400 transition-all duration-300 px-10 py-4 text-lg rounded-xl hover:scale-110 shadow-lg hover:shadow-red-500/25"
                  >
                    <XCircle className="w-5 h-5 mr-3" />
                    Errei
                  </Button>
                  
                  <Button
                    onClick={() => handleAnswer(true)}
                    variant="outline"
                    className="bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30 hover:border-green-400 transition-all duration-300 px-10 py-4 text-lg rounded-xl hover:scale-110 shadow-lg hover:shadow-green-500/25"
                  >
                    <CheckCircle className="w-5 h-5 mr-3" />
                    Acertei
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Decorative glow effects */}
        <div 
          className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none animate-pulse"
          style={{ backgroundColor: areaColor }}
        />
        <div 
          className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full blur-xl opacity-15 pointer-events-none animate-pulse"
          style={{ backgroundColor: areaColor, animationDelay: '1s' }}
        />
      </div>

      <style jsx>{`
        @keyframes particleFloat {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedFlashCard;
