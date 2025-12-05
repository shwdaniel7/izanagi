import { supabase } from './supabase';

export interface CreateHabitDTO {
  title: string;
  description?: string;
  periodicity: 'daily' | 'weekly';
}

// Interface para atualização (ID obrigatório, resto opcional)
export interface UpdateHabitDTO extends Partial<CreateHabitDTO> {
  id: string;
}

export const habitService = {
  // 1. Criar Hábito
  async create(habit: CreateHabitDTO) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('habits')
      .insert([{ ...habit, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 2. Listar Hábitos (com status de check de hoje)
  async getAll() {
    const today = new Date().toISOString().split('T')[0];

    // Busca os hábitos E faz um join com habit_checks filtrando pela data de hoje
    const { data, error } = await supabase
      .from('habits')
      .select(`
        *,
        habit_checks (
          id,
          date
        )
      `)
      .eq('habit_checks.date', today) // Filtra checks apenas de hoje
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transforma os dados para adicionar a flag booleana 'isCompleted'
    return data.map((habit: any) => ({
      ...habit,
      isCompleted: habit.habit_checks && habit.habit_checks.length > 0
    }));
  },

  // 3. Atualizar Hábito (Novo)
  async update(habit: UpdateHabitDTO) {
    const { id, ...updates } = habit;
    const { error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  },

  // 4. Marcar Hábito (Check + XP via RPC)
  async check(habitId: string) {
    const { error } = await supabase.rpc('complete_habit', {
      habit_id_param: habitId
    });

    if (error) throw error;
  },

  // 5. Excluir Hábito
  async delete(habitId: string) {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId);

    if (error) throw error;
  }
};