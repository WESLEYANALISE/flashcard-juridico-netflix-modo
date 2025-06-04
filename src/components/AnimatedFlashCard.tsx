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
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
  }>>([]);
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Médio':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Difícil':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
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
    const newParticles = Array.from({
      length: 12
    }, (_, i) => ({
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
  const cardExitClass = isExiting ? exitDirection === 'right' ? 'translate-x-full opacity-0 scale-95' : '-translate-x-full opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100';
  return <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto relative px-[9px]">
      {/* Particles */}
      {particles.map(particle => <div key={particle.id} className="absolute w-3 h-3 rounded-full pointer-events-none z-50 animate-bounce" style={{
      backgroundColor: particle.color,
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      boxShadow: `0 0 10px ${particle.color}`,
      animation: `bounce 1s ease-out forwards, fadeOut 1.5s ease-out forwards`
    }} />)}

      <div className={`relative transform transition-all duration-500 ease-out ${cardExitClass}`}>
        {/* Main Card */}
        <div className={`w-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-2xl sm:rounded-3xl border border-neutral-700/50 overflow-hidden shadow-2xl backdrop-blur-sm transition-all duration-300 ${isFlipping ? 'scale-98' : 'hover:scale-[1.01]'}`}>
          
          {/* Card Header */}
          <div className="bg-gradient-to-r from-neutral-800/80 to-neutral-700/60 border-b border-neutral-600/30 p-4 sm:p-6 md:p-8 relative overflow-hidden">
            {/* Legal background elements */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-2 left-4 text-3xl sm:text-4xl md:text-5xl font-serif text-amber-400/30">§</div>
              <div className="absolute top-4 right-6 text-2xl sm:text-3xl font-serif text-amber-400/20">⚖</div>
              <div className="absolute bottom-2 left-1/3 text-xl sm:text-2xl font-serif text-amber-400/20">Art.</div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 rounded-xl shadow-lg border backdrop-blur-sm" style={{
                backgroundColor: `${areaColor}15`,
                borderColor: `${areaColor}30`
              }}>
                  <Scale className="w-5 h-5 sm:w-6 sm:h-6" style={{
                  color: areaColor
                }} />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 tracking-wide">
                    {flashcard.category}
                  </h2>
                  {tema && <div className="flex items-center space-x-2">
                      <span className="text-xs sm:text-sm text-neutral-400 font-medium">Tema:</span>
                      <span className="text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-neutral-700 to-neutral-600 px-2 sm:px-3 py-1 rounded-full border border-neutral-500/30 shadow-sm">
                        {tema}
                      </span>
                    </div>}
                </div>
              </div>
              
              <div className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border backdrop-blur-sm ${getDifficultyColor(flashcard.difficulty)}`}>
                {flashcard.difficulty}
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6 sm:p-8 md:p-12 lg:p-16 relative overflow-hidden">
            {/* Enhanced legal background */}
            <div className="absolute inset-0 opacity-3">
              <div className="absolute top-4 right-4 text-4xl sm:text-5xl md:text-6xl font-serif text-amber-400/20">§</div>
              <div className="absolute bottom-6 left-4 text-3xl sm:text-4xl font-serif text-amber-400/15">Art.</div>
              <div className="absolute top-1/3 left-1/4 text-2xl sm:text-3xl font-serif text-amber-400/10">⚖</div>
              <div className="absolute bottom-1/3 right-1/4 text-xl sm:text-2xl font-serif text-amber-400/10">📖</div>
              
              {/* Document lines */}
              <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => <div key={i} className="absolute w-full h-px bg-gradient-to-r from-transparent via-amber-400/5 to-transparent" style={{
                top: `${20 + i * 12}%`
              }} />)}
              </div>
            </div>

            {/* Question */}
            <div className="text-center mb-8 sm:mb-10 md:mb-12 relative z-10">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 md:mb-10 leading-relaxed tracking-wide">
                {flashcard.question}
              </h3>
              
              {showAnswer && <div className="mt-6 sm:mt-8 p-6 sm:p-8 bg-gradient-to-br from-neutral-800/60 to-neutral-700/40 rounded-2xl border border-neutral-600/40 animate-fade-in backdrop-blur-sm shadow-xl">
                  <div className="text-base sm:text-lg md:text-xl text-neutral-200 leading-relaxed font-medium">
                    {flashcard.answer}
                  </div>
                </div>}
            </div>

            {/* Controls */}
            <div className="space-y-6 sm:space-y-8 relative z-10">
              <div className="flex justify-center">
                <Button onClick={handleShowAnswer} variant="outline" className="bg-neutral-800/40 border-neutral-600/50 text-white hover:bg-neutral-700/60 hover:border-neutral-500/70 transition-all duration-300 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105 font-semibold">
                  {showAnswer ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />}
                  {showAnswer ? 'Ocultar' : 'Mostrar'} Resposta
                </Button>
              </div>

              {showAnswer && <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 animate-fade-in">
                  <Button onClick={() => handleAnswer(false)} variant="outline" className="bg-red-500/15 border-red-500/40 text-red-300 hover:bg-red-500/25 hover:border-red-400/60 transition-all duration-300 sm:px-8 md:px-10 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl rounded-xl hover:scale-110 shadow-lg hover:shadow-red-500/20 font-semibold flex-1 sm:flex-none py-[6px] px-[6px] mx-[19px]">
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                    Errei
                  </Button>
                  
                  <Button onClick={() => handleAnswer(true)} variant="outline" className="bg-green-500/15 border-green-500/40 text-green-300 hover:bg-green-500/25 hover:border-green-400/60 transition-all duration-300 sm:px-8 md:px-10 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl rounded-xl hover:scale-110 shadow-lg hover:shadow-green-500/20 font-semibold flex-1 sm:flex-none px-0 py-[5px] my-[6px] mx-[19px]">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                    Acertei
                  </Button>
                </div>}
            </div>
          </div>
        </div>

        {/* Decorative glow effects */}
        <div className="absolute -top-4 -right-4 w-24 sm:w-32 h-24 sm:h-32 rounded-full blur-2xl opacity-10 pointer-events-none animate-pulse" style={{
        backgroundColor: areaColor
      }} />
        <div className="absolute -bottom-4 -left-4 w-20 sm:w-24 h-20 sm:h-24 rounded-full blur-xl opacity-8 pointer-events-none animate-pulse" style={{
        backgroundColor: areaColor,
        animationDelay: '1s'
      }} />
      </div>
    </div>;
};
export default AnimatedFlashCard;