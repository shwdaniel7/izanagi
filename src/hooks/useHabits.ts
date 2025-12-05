import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// Importando tipos explicitamente para satisfazer o TS estrito
import { 
  habitService, 
  type CreateHabitDTO, 
  type UpdateHabitDTO 
} from '../services/habitService';

// Hook para buscar dados
export function useHabits() {
  return useQuery({
    queryKey: ['habits'],
    queryFn: habitService.getAll,
  });
}

// Hook para criar hábito
export function useCreateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newHabit: CreateHabitDTO) => habitService.create(newHabit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
}

// Hook para atualizar hábito (Novo)
export function useUpdateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (habit: UpdateHabitDTO) => habitService.update(habit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
}

// Hook para dar check (completar)
export function useCheckHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (habitId: string) => habitService.check(habitId),
    onSuccess: () => {
      // Atualiza a lista de hábitos (para mostrar o check)
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      // Atualiza o perfil (para mostrar o novo XP e Nível)
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// Hook para excluir hábito
export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (habitId: string) => habitService.delete(habitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
}