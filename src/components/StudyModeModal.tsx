
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
  lastStudiedIndex?: number;
  totalCards: number;
}

const StudyModeModal = ({
  isOpen,
  onClose,
  onContinue,
  onStartOver,
  onRandom,
  hasProgress,
  lastStudiedIndex = 0,
  totalCards
}: StudyModeModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-netflix-dark rounded-2xl border border-white/20 p-6 sm:p-8 max-w-md w-full animate-scale-in">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Como você quer estudar?</h2>
          <p className="text-gray-400">Escolha como deseja iniciar sua sessão de estudos</p>
        </div>

        <div className="space-y-4">
          {/* Continue Button */}
          <Button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 
                       text-white border-0 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            <Clock className="w-5 h-5 mr-2" />
            Continuar de onde parei
            {hasProgress && lastStudiedIndex > 0 && (
              <span className="ml-2 text-green-200 text-sm">
                (Card {lastStudiedIndex + 1}/{totalCards})
              </span>
            )}
          </Button>

          <Button
            onClick={onStartOver}
            className="w-full bg-gradient-to-r from-netflix-red to-red-600 hover:from-red-700 hover:to-red-700 
                       text-white border-0 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Começar do início
          </Button>

          <Button
            onClick={onRandom}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 
                       text-white border-0 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 shake-on-hover"
          >
            <Shuffle className="w-5 h-5 mr-2" />
            Modo aleatório
          </Button>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-sm text-gray-400 text-center">
            Total de {totalCards} cards nesta seleção
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudyModeModal;
