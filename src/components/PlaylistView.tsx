
import { useState } from 'react';
import { ArrowLeft, Plus, Save, Trash2, Play, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Playlist } from '@/types/playlist';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useFlashcards } from '@/hooks/useFlashcards';

interface PlaylistViewProps {
  onClose: () => void;
  onStudyPlaylist?: (playlistId: string) => void;
}

const PlaylistView = ({ onClose, onStudyPlaylist }: PlaylistViewProps) => {
  const [playlists, setPlaylists] = useLocalStorage<Playlist[]>('user_playlists', []);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPlaylist, setNewPlaylist] = useState({
    name: '',
    description: '',
    selectedCards: new Set<string>()
  });

  const { data: allFlashcards = [] } = useFlashcards();

  const handleCreatePlaylist = () => {
    if (!newPlaylist.name.trim()) return;

    const playlist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylist.name,
      description: newPlaylist.description,
      cardIds: Array.from(newPlaylist.selectedCards),
      createdAt: new Date()
    };

    setPlaylists(prev => [...prev, playlist]);
    setNewPlaylist({
      name: '',
      description: '',
      selectedCards: new Set()
    });
    setIsCreating(false);
  };

  const handleDeletePlaylist = (id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
  };

  const handleCardToggle = (cardId: string) => {
    setNewPlaylist(prev => {
      const newSelected = new Set(prev.selectedCards);
      if (newSelected.has(cardId)) {
        newSelected.delete(cardId);
      } else {
        newSelected.add(cardId);
      }
      return { ...prev, selectedCards: newSelected };
    });
  };

  if (isCreating) {
    return (
      <div className="min-h-screen bg-netflix-black px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              onClick={() => setIsCreating(false)}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-white">Criar Nova Playlist</h1>
          </div>

          <Card className="bg-netflix-dark/50 border-neutral-700/50 p-6 glass-effect mb-6">
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome da Playlist
                </label>
                <Input
                  value={newPlaylist.name}
                  onChange={(e) => setNewPlaylist(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Direito Civil - Contratos"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição (opcional)
                </label>
                <Input
                  value={newPlaylist.description}
                  onChange={(e) => setNewPlaylist(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição da playlist..."
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            {allFlashcards.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Selecionar Cards ({newPlaylist.selectedCards.size} selecionados)
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {allFlashcards.slice(0, 20).map(card => (
                    <div
                      key={card.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        newPlaylist.selectedCards.has(card.id.toString())
                          ? 'bg-netflix-red/20 border-netflix-red/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                      onClick={() => handleCardToggle(card.id.toString())}
                    >
                      <p className="text-white text-sm">{card.pergunta}</p>
                      <p className="text-gray-400 text-xs mt-1">{card.area} - {card.tema}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <Button
                onClick={handleCreatePlaylist}
                disabled={!newPlaylist.name.trim() || newPlaylist.selectedCards.size === 0}
                className="bg-netflix-red hover:bg-netflix-red/80 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Criar Playlist
              </Button>
              <Button
                onClick={() => setIsCreating(false)}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Cancelar
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-white">Minhas Playlists</h1>
          </div>

          <Button
            onClick={() => setIsCreating(true)}
            className="bg-netflix-red hover:bg-netflix-red/80 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Playlist
          </Button>
        </div>

        {playlists.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhuma playlist criada</h3>
            <p className="text-gray-400 mb-6">Crie sua primeira playlist para organizar seus estudos</p>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-netflix-red hover:bg-netflix-red/80 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Playlist
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {playlists.map(playlist => (
              <Card key={playlist.id} className="bg-netflix-dark/50 border-neutral-700/50 p-6 glass-effect">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{playlist.name}</h3>
                    {playlist.description && (
                      <p className="text-sm text-gray-400">{playlist.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setEditingId(playlist.id)}
                      variant="outline"
                      size="sm"
                      className="bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeletePlaylist(playlist.id)}
                      variant="outline"
                      size="sm"
                      className="bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-gray-400 mb-4">
                  {playlist.cardIds.length} cards • Criada em {new Date(playlist.createdAt).toLocaleDateString()}
                </div>

                <Button
                  className="w-full bg-netflix-red hover:bg-netflix-red/80 text-white"
                  onClick={() => onStudyPlaylist?.(playlist.id)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Estudar Playlist
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistView;
