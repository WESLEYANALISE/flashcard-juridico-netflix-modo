
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Shuffle, Clock } from 'lucide-react';

interface StudyModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onStartOver: () => void;
  onRandom: () => void;
  hasProgress: boolean;
  currentIndex?: number;
  totalCards: number;
  lastStudiedDate?: string;
}

const StudyModeModal = ({
  isOpen,
  onClose,
  onContinue,
  onStartOver,
  onRandom,
  hasProgress,
  currentIndex = 0,
  totalCards,
  lastStudiedDate
}: StudyModeModalProps) => {
  if (!isOpen) return null;

  const progressPercentage = totalCards > 0 ? Math.round(((currentIndex + 1) / totalCards) * 100) : 0;
  
  const formatLastStudied = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 3600);
    
    if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return hours === 0 ? 'agora mesmo' : `há ${hours}h`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `há ${days} dia${days > 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-netflix-dark rounded-2xl border border-white/20 p-4 sm:p-6 lg:p-8 max-w-md w-full animate-scale-in">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Como você quer estudar?</h2>
          <p className="text-sm sm:text-base text-gray-400">Escolha como deseja iniciar sua sessão de estudos</p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* Continue Button - Only shows if there's valid progress */}
          {hasProgress && (
            <Button
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 
                         text-white border-0 py-3 sm:py-4 text-sm sm:text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <div className="flex flex-col items-center">
                <span>Continuar de onde parei</span>
                <span className="text-xs sm:text-sm text-green-200 mt-1">
                  Card {currentIndex + 1}/{totalCards} ({progressPercentage}%) • {formatLastStudied(lastStudiedDate)}
                </span>
              </div>
            </Button>
          )}

          <Button
            onClick={onStartOver}
            className="w-full bg-gradient-to-r from-netflix-red to-red-600 hover:from-red-700 hover:to-red-700 
                       text-white border-0 py-3 sm:py-4 text-sm sm:text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Começar do início
          </Button>

          <Button
            onClick={onRandom}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 
                       text-white border-0 py-3 sm:py-4 text-sm sm:text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            <Shuffle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Modo aleatório
          </Button>
        </div>

        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10">
          <p className="text-xs sm:text-sm text-gray-400 text-center">
            Total de {totalCards} cards nesta seleção
          </p>
          {hasProgress && (
            <div className="mt-2">
              <div className="w-full bg-gray-700/30 rounded-full h-1.5">
                <div 
                  className="h-1.5 bg-green-500 rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyModeModal;
