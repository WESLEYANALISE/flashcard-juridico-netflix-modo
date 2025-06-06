
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

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('study');
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
        return <StudyView />;
      case 'playlist':
        return <PlaylistView />;
      case 'stats':
        return <ImprovedStatsView onBack={handleBackToStudy} />;
      case 'review':
        return <ReviewView />;
      default:
        return <StudyView />;
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
