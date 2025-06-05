
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserPlaylist {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  area?: string;
  flashcard_ids: number[];
  created_at: string;
  updated_at: string;
}

export const useUserPlaylists = () => {
  return useQuery({
    queryKey: ['user-playlists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('list_tables', { prefix: 'user_playlists' });

      if (error) {
        console.log('Table not exists, returning empty array');
        return [] as UserPlaylist[];
      }
      
      // For now, return empty array until tables are properly created
      return [] as UserPlaylist[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreatePlaylist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (playlist: {
      name: string;
      description?: string;
      area?: string;
      flashcard_ids: number[];
    }) => {
      console.log('Creating playlist:', playlist);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-playlists'] });
    },
  });
};

export const useUpdatePlaylist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<UserPlaylist>;
    }) => {
      console.log('Updating playlist:', { id, updates });
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-playlists'] });
    },
  });
};

export const useDeletePlaylist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting playlist:', id);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-playlists'] });
    },
  });
};
