import { useQuery } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

export function useWeeklyStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['weekly-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 6); // Pega os últimos 7 dias

      // 1. Busca os checks do banco nesse intervalo
      const { data, error } = await supabase
        .from('habit_checks')
        .select('date')
        .gte('date', sevenDaysAgo.toISOString().split('T')[0])
        .lte('date', today.toISOString().split('T')[0])
        .eq('completed', true);

      if (error) throw error;

      // 2. Processa os dados para o formato do Recharts
      const statsMap = new Map<string, number>();
      
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        // Removemos a variável 'displayDate' que não estava sendo usada aqui
        statsMap.set(dateStr, 0);
      }

      // Preenche com os dados reais do banco
      data?.forEach((check) => {
        const dateStr = check.date as unknown as string;
        if (statsMap.has(dateStr)) {
          statsMap.set(dateStr, (statsMap.get(dateStr) || 0) + 1);
        }
      });

      // Converte o Map para Array e inverte para ficar cronológico
      const chartData = Array.from(statsMap.entries()).map(([date, count]) => {
        // Removemos a variável 'd' que não estava sendo usada
        // Usamos a string da data diretamente para garantir o dia correto independente do fuso horário local
        const dayName = new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
        
        return {
          date,
          name: dayName.charAt(0).toUpperCase() + dayName.slice(1), // Capitaliza (seg -> Seg)
          habits: count
        };
      }).reverse();

      return chartData;
    },
    enabled: !!user?.id
  });
}