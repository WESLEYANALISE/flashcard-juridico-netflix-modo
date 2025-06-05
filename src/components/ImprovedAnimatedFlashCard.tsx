
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
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
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerType, setAnswerType] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    setIsFlipped(false);
    setShowExample(false);
    setIsAnswering(false);
    setAnswerType(null);
  }, [flashcard.id]);

  const handleAnswer = async (correct: boolean) => {
    setIsAnswering(true);
    setAnswerType(correct ? 'correct' : 'incorrect');
    
    // Show animation feedback
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setIsAnswering(false);
    onAnswer(correct);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const toggleExample = () => {
    setShowExample(!showExample);
  };

  return (
    <div className={`relative w-full max-w-2xl mx-auto transition-all duration-300 ${
      isExiting 
        ? `transform ${exitDirection === 'left' ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'}` 
        : isEntering 
        ? 'transform translate-x-4 opacity-80' 
        : 'transform translate-x-0 opacity-100'
    } ${isAnswering ? 'pointer-events-none' : ''}`}>
      
      {/* Answer Animation Overlay */}
      {isAnswering && (
        <div className={`absolute inset-0 z-50 flex items-center justify-center rounded-2xl transition-all duration-600 ${
          answerType === 'correct' 
            ? 'bg-green-500/90 animate-pulse' 
            : 'bg-red-500/90 animate-pulse'
        }`}>
          <div className="text-center animate-scale-in">
            {answerType === 'correct' ? (
              <>
                <CheckCircle className="w-16 h-16 text-white mx-auto mb-4 animate-bounce" />
                <p className="text-2xl font-bold text-white">Compreendi!</p>
              </>
            ) : (
              <>
                <XCircle className="w-16 h-16 text-white mx-auto mb-4 animate-bounce" />
                <p className="text-2xl font-bold text-white">Preciso Revisar!</p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="bg-netflix-dark/80 backdrop-blur-lg border border-white/20 rounded-2xl p-8 glass-effect">
        {/* Theme Badge */}
        {tema && (
          <div className="mb-4">
            <span 
              className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: `${areaColor}40`, border: `1px solid ${areaColor}` }}
            >
              {tema}
            </span>
          </div>
        )}

        {/* Card Content */}
        <div className="min-h-[300px] flex flex-col justify-center">
          <div className={`transition-all duration-500 ${isFlipped ? 'opacity-0 transform rotateY-90' : 'opacity-100 transform rotateY-0'}`}>
            {!isFlipped ? (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white mb-6 leading-relaxed">
                  {flashcard.question}
                </h2>
                <Button
                  onClick={handleFlip}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  Ver Resposta
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-300 mb-4">Resposta:</h3>
                  <p className="text-white text-lg leading-relaxed mb-6">
                    {flashcard.answer}
                  </p>
                </div>

                {/* Example Section */}
                {exemplo && (
                  <div className="border-t border-white/20 pt-4">
                    <Button
                      onClick={toggleExample}
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 mb-4"
                    >
                      {showExample ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Ocultar Exemplo
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Mostrar Exemplo
                        </>
                      )}
                    </Button>
                    
                    {showExample && (
                      <div className="bg-white/5 rounded-lg p-4 animate-fade-in">
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {exemplo}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Answer Buttons */}
                <div className="flex space-x-4 pt-4">
                  <Button
                    onClick={() => handleAnswer(false)}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 py-3 transition-all duration-300 hover:scale-105"
                    disabled={isAnswering}
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Preciso Revisar
                  </Button>
                  
                  <Button
                    onClick={() => handleAnswer(true)}
                    className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 py-3 transition-all duration-300 hover:scale-105"
                    disabled={isAnswering}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Compreendi
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovedAnimatedFlashCard;
