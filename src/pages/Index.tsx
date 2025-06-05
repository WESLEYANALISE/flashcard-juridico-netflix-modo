
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import StudyView from '@/components/StudyView';
import ImprovedStatsView from '@/components/ImprovedStatsView';
import ReviewView from '@/components/ReviewView';
import PlaylistView from '@/components/PlaylistView';
import { useFlashcards } from '@/hooks/useFlashcards';

const Index = () => {
  const [activeView, setActiveView] = useState('study');
  const [hideNavbar, setHideNavbar] = useState(false);
  const { data: supabaseFlashcards = [] } = useFlashcards();

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
    console.log('Updating flashcard:', id, updates);
  };

  const handleStudyPlaylist = (playlistId: string) => {
    console.log('Studying playlist:', playlistId);
    setActiveView('study');
  };

  const handleStudyReview = (area: string, themes: string[]) => {
    console.log('Studying review:', area, themes);
    setActiveView('study');
  };

  const handleHideNavbar = (hide: boolean) => {
    setHideNavbar(hide);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'study':
        return (
          <StudyView 
            flashcards={flashcards} 
            onUpdateFlashcard={handleUpdateFlashcard}
            onHideNavbar={handleHideNavbar}
          />
        );
      case 'playlist':
        return (
          <PlaylistView 
            onClose={() => setActiveView('study')}
            onStudyPlaylist={handleStudyPlaylist}
          />
        );
      case 'stats':
        return <ImprovedStatsView />;
      case 'review':
        return (
          <ReviewView 
            onStudyReview={handleStudyReview}
            onBack={() => setActiveView('study')}
          />
        );
      default:
        return (
          <StudyView 
            flashcards={flashcards} 
            onUpdateFlashcard={handleUpdateFlashcard}
            onHideNavbar={handleHideNavbar}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      {!hideNavbar && (
        <Navbar activeView={activeView} onViewChange={setActiveView} />
      )}
      {renderActiveView()}
    </div>
  );
};

export default Index;
