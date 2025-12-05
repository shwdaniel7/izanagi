import { useQuery } from '@tanstack/react-query';
import { achievementService } from '../services/achievementService';

export function useAchievements() {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: achievementService.getAll,
  });
}