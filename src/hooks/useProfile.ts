import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

export interface Profile {
  id: string;
  name: string;
  xp: number;
  level: number;
  created_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query: Buscar Perfil
  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) return data as Profile;

      // Fallback: Cria perfil se não existir
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([{ id: user.id, name: user.user_metadata.name || 'Viajante', xp: 0, level: 1 }])
        .select()
        .single();

      if (createError) throw createError;
      return newProfile as Profile;
    },
    enabled: !!user?.id,
  });

  // Query: Estatísticas (Total de Checks)
  const statsQuery = useQuery({
    queryKey: ['profile-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return { totalHabits: 0 };
      
      // Conta quantos checks existem na tabela habit_checks vinculados a hábitos deste usuário
      const { count, error } = await supabase
        .from('habit_checks')
        .select('id', { count: 'exact', head: true })
        .eq('completed', true)
        // O RLS já filtra os checks do usuário, mas para garantir performance em apps grandes
        // faríamos um join. Como temos RLS, o count simples funciona.
      
      if (error) throw error;
      return { totalHabits: count || 0 };
    },
    enabled: !!user?.id
  });

  // Mutation: Atualizar Nome
  const updateProfileMutation = useMutation({
    mutationFn: async (newName: string) => {
      if (!user?.id) throw new Error("No user");
      const { error } = await supabase
        .from('profiles')
        .update({ name: newName })
        .eq('id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });

  return {
    ...profileQuery,
    stats: statsQuery.data,
    updateName: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending
  };
}