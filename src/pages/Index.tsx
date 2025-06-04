
import { useState } from 'react';
import { flashcards as initialFlashcards } from '@/data/flashcards';
import { Flashcard } from '@/types/flashcard';
import Navbar from '@/components/Navbar';
import StudyView from '@/components/StudyView';
import StatsView from '@/components/StatsView';
import SettingsView from '@/components/SettingsView';

const Index = () => {
  const [activeView, setActiveView] = useState('study');
  const [flashcards, setFlashcards] = useState<Flashcard[]>(initialFlashcards);

  const handleUpdateFlashcard = (id: string, updates: Partial<Flashcard>) => {
    setFlashcards(prev => prev.map(card => 
      card.id === id ? { ...card, ...updates } : card
    ));
  };

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
