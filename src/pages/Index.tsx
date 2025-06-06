
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AuthPage from '@/components/AuthPage';
import StudyView from '@/components/StudyView';
import PlaylistView from '@/components/PlaylistView';
import ImprovedStatsView from '@/components/ImprovedStatsView';
import ReviewView from '@/components/ReviewView';
import Navbar from '@/components/Navbar';
import { User } from '@supabase/supabase-js';
import { Flashcard } from '@/types/flashcard';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('study');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleBackToStudy = () => {
    setActiveView('study');
  };

  const handleUpdateFlashcard = (id: string, updates: Partial<Flashcard>) => {
    setFlashcards(prev => prev.map(card => 
      card.id === id ? { ...card, ...updates } : card
    ));
  };

  const handleStudyReview = (area: string, themes: string[]) => {
    // Logic to start studying review cards
    setActiveView('study');
  };

  const handleStudyPlaylist = (playlistId: string) => {
    // Logic to start studying playlist
    setActiveView('study');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderContent = () => {
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
            onClose={handleBackToStudy}
            onStudyPlaylist={handleStudyPlaylist}
          />
        );
      case 'stats':
        return <ImprovedStatsView onBack={handleBackToStudy} />;
      case 'review':
        return (
          <ReviewView 
            onStudyReview={handleStudyReview}
            onBack={handleBackToStudy}
          />
        );
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
      {activeView === 'study' && (
        <Navbar activeView={activeView} onViewChange={setActiveView} />
      )}
      {renderContent()}
    </div>
  );
};

export default Index;
