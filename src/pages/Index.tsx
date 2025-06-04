
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import StudyView from '@/components/StudyView';
import StatsView from '@/components/StatsView';
import SettingsView from '@/components/SettingsView';
import PlaylistView from '@/components/PlaylistView';
import DailyMissions from '@/components/DailyMissions';

const Index = () => {
  const [activeView, setActiveView] = useState('study');
  const [flashcards, setFlashcards] = useState([]);

  const handleUpdateFlashcard = (id: string, updates: any) => {
    setFlashcards(prev => 
      prev.map(card => 
        card.id === id ? { ...card, ...updates } : card
      )
    );
  };

  const handleStudyPlaylist = (playlistId: string) => {
    // Implementation for studying a specific playlist
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
        return <StatsView />;
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
