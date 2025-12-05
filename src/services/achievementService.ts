import { supabase } from './supabase';

export const achievementService = {
  async getAll() {
    // Busca todas as conquistas
    const { data: allAchievements, error: errorAll } = await supabase
      .from('achievements')
      .select('*')
      .order('name');

    if (errorAll) throw errorAll;

    // Busca as conquistas que o usuário JÁ tem
    const { data: userAchievements, error: errorUser } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (errorUser) throw errorUser;

    // Cria um Set com os IDs desbloqueados para verificação rápida
    const unlockedSet = new Set(userAchievements?.map(ua => ua.achievement_id));

    // Retorna os dados mesclados
    return allAchievements.map(achievement => ({
      ...achievement,
      unlocked: unlockedSet.has(achievement.id)
    }));
  }
};