
import { useState } from 'react';
import { Play, RotateCcw, Shuffle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StudyModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (mode: 'continue' | 'start' | 'random') => void;
  hasProgress: boolean;
  lastStudiedThemes?: string[];
  categoryName: string;
}

const StudyModeModal = ({ 
  isOpen, 
  onClose, 
  onStart, 
  hasProgress, 
  lastStudiedThemes = [],
  categoryName 
}: StudyModeModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-netflix-dark/95 border border-white/20 rounded-2xl p-6 max-w-md w-full animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Escolha o Modo de Estudo</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-gray-300 mb-6">
          <p className="font-medium text-white mb-2">{categoryName}</p>
          {hasProgress && lastStudiedThemes.length > 0 && (
            <p className="text-sm">
              Últimos temas estudados: {lastStudiedThemes.join(', ')}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {hasProgress && (
            <Button
              onClick={() => onStart('continue')}
              className="w-full bg-netflix-red hover:bg-netflix-red/80 text-white flex items-center space-x-3 py-4"
            >
              <Play className="w-5 h-5" />
              <span>Continuar de onde parei</span>
            </Button>
          )}
          
          <Button
            onClick={() => onStart('start')}
            variant="outline"
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center space-x-3 py-4"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Começar do início</span>
          </Button>
          
          <Button
            onClick={() => onStart('random')}
            variant="outline"
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center space-x-3 py-4"
          >
            <Shuffle className="w-5 h-5" />
            <span>Modo aleatório</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudyModeModal;
