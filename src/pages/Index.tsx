
import { useState } from 'react';
import { useFlashcards } from '@/hooks/useFlashcards';
import { mapSupabaseFlashcard } from '@/utils/flashcardMapper';
import { Flashcard } from '@/types/flashcard';
import Navbar from '@/components/Navbar';
import StudyView from '@/components/StudyView';
import StatsView from '@/components/StatsView';
import SettingsView from '@/components/SettingsView';

const Index = () => {
  const [activeView, setActiveView] = useState('study');
  const [localFlashcards, setLocalFlashcards] = useState<Record<string, Partial<Flashcard>>>({});
  
  const { data: supabaseFlashcards = [], isLoading, error } = useFlashcards();

  // Convert Supabase flashcards to our format and merge with local updates
  const flashcards: Flashcard[] = supabaseFlashcards.map(supabaseCard => {
    const mappedCard = mapSupabaseFlashcard(supabaseCard);
    const localUpdates = localFlashcards[mappedCard.id] || {};
    return { ...mappedCard, ...localUpdates };
  });

  const handleUpdateFlashcard = (id: string, updates: Partial<Flashcard>) => {
    setLocalFlashcards(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updates }
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-white text-xl">Carregando flashcards...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-white text-xl">Erro ao carregar flashcards</div>
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'study':
        return <StudyView flashcards={flashcards} onUpdateFlashcard={handleUpdateFlashcard} />;
      case 'stats':
        return <StatsView flashcards={flashcards} />;
      case 'settings':
        return <SettingsView />;
      default:
        return <StudyView flashcards={flashcards} onUpdateFlashcard={handleUpdateFlashcard} />;
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar activeView={activeView} onViewChange={setActiveView} />
      {renderView()}
    </div>
  );
};

export default Index;
