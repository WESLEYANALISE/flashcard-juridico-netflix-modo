
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
        .from('user_playlists' as any)
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as UserPlaylist[];
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
      const { data, error } = await supabase
        .from('user_playlists' as any)
        .insert({
          ...playlist,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('user_playlists' as any)
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { error } = await supabase
        .from('user_playlists' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-playlists'] });
    },
  });
};
