
export interface Playlist {
  id: string;
  name: string;
  description: string;
  cardIds: string[];
  createdAt: Date;
  category?: string;
}

export interface PlaylistCard {
  id: string;
  question: string;
  answer: string;
  category: string;
  theme: string;
}
