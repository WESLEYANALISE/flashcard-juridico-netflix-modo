
import { useState, useEffect } from 'react';
import { Flashcard } from '@/types/flashcard';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Eye, EyeOff, Scale, Gavel, Book, FileText } from 'lucide-react';

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
    }, 250);
  };

  const handleAnswer = (correct: boolean) => {
    // Create enhanced particles effect
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      color: correct ? '#10B981' : '#EF4444'
    }));
    setParticles(newParticles);

    // Remove particles after animation
    setTimeout(() => setParticles([]), 2000);

    onAnswer(correct);
  };

  const cardExitClass = isExiting 
    ? exitDirection === 'right' 
      ? 'translate-x-full opacity-0 scale-95' 
      : '-translate-x-full opacity-0 scale-95'
    : 'translate-x-0 opacity-100 scale-100';

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Enhanced Particles with CSS animations */}
      {particles.map((particle, index) => (
        <div
          key={particle.id}
          className="absolute w-4 h-4 rounded-full pointer-events-none z-50 animate-bounce"
          style={{
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDuration: `${1.5 + index * 0.1}s`,
            animationDelay: `${index * 0.05}s`,
            boxShadow: `0 0 15px ${particle.color}`,
            animation: `bounce 1.5s ease-out ${index * 0.05}s forwards, fadeOut 2s ease-out forwards`
          }}
        />
      ))}

      <div className={`relative transform transition-all duration-700 ease-out ${cardExitClass}`}>
        {/* Enhanced Card Container with Professional Styling */}
        <div className={`w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl backdrop-blur-sm transition-all duration-500 ${isFlipping ? 'scale-[0.98] rotate-1 shadow-xl' : 'hover:scale-[1.01] hover:-rotate-0.5 hover:shadow-3xl'}`}>
          
          {/* Card Header with Professional Legal Theme */}
          <div className="bg-gradient-to-r from-slate-800/80 via-slate-700/60 to-slate-800/80 border-b border-slate-600/50 p-8 backdrop-blur-sm relative overflow-hidden">
            {/* Legal pattern background */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 left-8 text-6xl font-serif text-amber-400/30">§</div>
              <div className="absolute top-8 right-12 text-4xl font-serif text-amber-400/20">Art.</div>
              <div className="absolute bottom-4 left-1/3 text-3xl font-serif text-amber-400/20">⚖</div>
            </div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-6">
                <div 
                  className="p-4 rounded-2xl shadow-lg border backdrop-blur-sm"
                  style={{ 
                    backgroundColor: `${areaColor}15`,
                    borderColor: `${areaColor}30`
                  }}
                >
                  <Scale 
                    className="w-8 h-8" 
                    style={{ color: areaColor }}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">
                    {flashcard.category}
                  </h2>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-slate-400 font-medium">Tema:</span>
                    <span className="text-sm font-semibold text-white bg-gradient-to-r from-slate-700 to-slate-600 px-4 py-2 rounded-full border border-slate-500/30 shadow-sm">
                      {tema || 'Não especificado'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={`px-5 py-3 rounded-2xl text-sm font-semibold border backdrop-blur-sm ${getDifficultyColor(flashcard.difficulty)}`}>
                {flashcard.difficulty}
              </div>
            </div>
          </div>

          {/* Enhanced Card Content with Legal Elements */}
          <div className="p-12 sm:p-16 relative overflow-hidden">
            {/* Enhanced Legal pattern background */}
            <div className="absolute inset-0 opacity-3">
              <div className="absolute top-8 right-8 text-7xl font-serif text-amber-400/20">§</div>
              <div className="absolute bottom-12 left-8 text-5xl font-serif text-amber-400/15">Art.</div>
              <div className="absolute top-1/3 left-1/4 text-4xl font-serif text-amber-400/10">⚖</div>
              <div className="absolute bottom-1/3 right-1/4 text-3xl font-serif text-amber-400/10">📖</div>
              <div className="absolute top-2/3 right-1/3 text-4xl font-serif text-amber-400/10">⚖</div>
              
              {/* Legal document lines */}
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-full h-px bg-gradient-to-r from-transparent via-amber-400/5 to-transparent"
                    style={{ top: `${15 + i * 10}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Question */}
            <div className="text-center mb-12 relative z-10">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-10 leading-relaxed tracking-wide">
                {flashcard.question}
              </h3>
              
              {showAnswer && (
                <div className="mt-12 p-10 bg-gradient-to-br from-slate-800/60 to-slate-700/40 rounded-3xl border border-slate-600/40 animate-fade-in backdrop-blur-sm shadow-2xl">
                  <div className="text-xl text-slate-200 leading-relaxed font-medium">
                    {flashcard.answer}
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Controls */}
            <div className="space-y-10 relative z-10">
              <div className="flex justify-center">
                <Button
                  onClick={handleShowAnswer}
                  variant="outline"
                  className="bg-slate-800/40 border-slate-600/50 text-white hover:bg-slate-700/60 hover:border-slate-500/70 transition-all duration-400 px-12 py-6 text-xl rounded-2xl backdrop-blur-sm shadow-xl hover:shadow-2xl hover:scale-105 font-semibold"
                >
                  {showAnswer ? <EyeOff className="w-6 h-6 mr-4" /> : <Eye className="w-6 h-6 mr-4" />}
                  {showAnswer ? 'Ocultar' : 'Mostrar'} Resposta
                </Button>
              </div>

              {showAnswer && (
                <div className="flex justify-center gap-8 animate-fade-in">
                  <Button
                    onClick={() => handleAnswer(false)}
                    variant="outline"
                    className="bg-red-500/15 border-red-500/40 text-red-300 hover:bg-red-500/25 hover:border-red-400/60 transition-all duration-400 px-12 py-6 text-xl rounded-2xl hover:scale-110 shadow-xl hover:shadow-red-500/20 font-semibold"
                  >
                    <XCircle className="w-6 h-6 mr-4" />
                    Errei
                  </Button>
                  
                  <Button
                    onClick={() => handleAnswer(true)}
                    variant="outline"
                    className="bg-green-500/15 border-green-500/40 text-green-300 hover:bg-green-500/25 hover:border-green-400/60 transition-all duration-400 px-12 py-6 text-xl rounded-2xl hover:scale-110 shadow-xl hover:shadow-green-500/20 font-semibold"
                  >
                    <CheckCircle className="w-6 h-6 mr-4" />
                    Acertei
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Decorative glow effects */}
        <div 
          className="absolute -top-8 -right-8 w-40 h-40 rounded-full blur-3xl opacity-15 pointer-events-none animate-pulse"
          style={{ backgroundColor: areaColor }}
        />
        <div 
          className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full blur-2xl opacity-10 pointer-events-none animate-pulse"
          style={{ backgroundColor: areaColor, animationDelay: '1.5s' }}
        />
        <div 
          className="absolute top-1/2 -right-4 w-24 h-24 rounded-full blur-xl opacity-8 pointer-events-none animate-pulse"
          style={{ backgroundColor: areaColor, animationDelay: '3s' }}
        />
      </div>
    </div>
  );
};

export default AnimatedFlashCard;
