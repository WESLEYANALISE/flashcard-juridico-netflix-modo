
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import StudyView from '@/components/StudyView';
import StatsView from '@/components/StatsView';
import SettingsView from '@/components/SettingsView';
import PlaylistView from '@/components/PlaylistView';
import DailyMissions from '@/components/DailyMissions';
import { useFlashcards } from '@/hooks/useFlashcards';
import { generateCategoriesFromAreas } from '@/utils/flashcardMapper';

const Index = () => {
  const [activeView, setActiveView] = useState('study');
  const { data: supabaseFlashcards = [] } = useFlashcards();

  // Convert Supabase flashcards to the expected format
  const flashcards = supabaseFlashcards.map(card => ({
    id: card.id.toString(),
    question: card.pergunta,
    answer: card.resposta,
    category: card.area,
    difficulty: 'Médio' as const,
    studied: false,
    correctAnswers: 0,
    totalAttempts: 0,
    lastStudied: undefined,
  }));

  const handleUpdateFlashcard = (id: string, updates: any) => {
    // This would update the flashcard in the future
    console.log('Updating flashcard:', id, updates);
  };

  const handleStudyPlaylist = (playlistId: string) => {
    console.log('Studying playlist:', playlistId);
    setActiveView('study');
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'study':
        return (
          <StudyView 
            flashcards={flashcards} 
            onUpdateFlashcard={handleUpdateFlashcard} 
          />
        );
      case 'playlist':
        return (
          <PlaylistView 
            onClose={() => setActiveView('study')}
            onStudyPlaylist={handleStudyPlaylist}
          />
        );
      case 'missions':
        return <DailyMissions />;
      case 'stats':
        return <StatsView flashcards={flashcards} />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <StudyView 
            flashcards={flashcards} 
            onUpdateFlashcard={handleUpdateFlashcard} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar activeView={activeView} onViewChange={setActiveView} />
      {renderActiveView()}
    </div>
  );
};

export default Index;
