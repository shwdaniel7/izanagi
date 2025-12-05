import { useAchievements } from '../../hooks/useAchievements';
import { Card } from '../../components/ui/Card';
import { 
  Trophy, Sparkles, Leaf, Sun, Feather, Star, 
  Sunrise, Swords, Moon, Mountain, Award 
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { PageTransition } from '../../components/layout/PageTransition';
import { motion } from 'framer-motion';

// Mapa de ícones (Nome no Banco -> Componente React)
const ICON_MAP: Record<string, any> = {
  // Originais
  'Sparkles': Sparkles,
  'Leaf': Leaf,
  'Sun': Sun,
  'Feather': Feather,
  'Star': Star,
  
  // Novos
  'Sunrise': Sunrise,   // O Despertar
  'Swords': Swords,     // Caminho da Espada
  'Moon': Moon,         // Ciclo da Lua
  'Mountain': Mountain, // Mente Serena
  'Award': Award,       // Legado Dourado
};

export function AchievementsPage() {
  const { data: achievements, isLoading } = useAchievements();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gold animate-pulse">Polindo as medalhas...</div>
      </div>
    );
  }

  // Cálculos de progresso
  const total = achievements?.length || 0;
  const unlocked = achievements?.filter((a: any) => a.unlocked).length || 0;
  const progress = total > 0 ? (unlocked / total) * 100 : 0;

  // Configuração da Animação em Cascata
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold text-charcoal-dark dark:text-white">
            Galeria de <span className="text-gradient-gold">Conquistas</span>
          </h1>
          <p className="text-charcoal-light dark:text-gray-400">
            Marcos da sua jornada de autodisciplina.
          </p>
        </div>

        {/* Barra de Progresso Geral */}
        <Card className="p-6 border-gold/20 bg-gradient-to-r from-white to-paper dark:from-charcoal/60 dark:to-charcoal/40">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold text-gold uppercase tracking-wider">Progresso Total</span>
            <span className="text-2xl font-display font-bold text-charcoal dark:text-white">
              {unlocked} <span className="text-sm text-charcoal-light dark:text-gray-500 font-normal">/ {total}</span>
            </span>
          </div>
          
          <div className="h-3 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gold shadow-glow"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </Card>

        {/* Grid de Conquistas */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {achievements?.map((achievement: any) => {
            const IconComponent = ICON_MAP[achievement.icon] || Trophy;

            return (
              <motion.div key={achievement.id} variants={item}>
                <Card 
                  className={cn(
                    "flex flex-col items-center text-center p-6 transition-all duration-300 border h-full",
                    achievement.unlocked 
                      ? "border-gold/40 bg-gold/5 dark:bg-gold/10 shadow-glow" 
                      : "border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 opacity-70 grayscale hover:grayscale-0 hover:opacity-100"
                  )}
                >
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-500",
                    achievement.unlocked 
                      ? "bg-gold text-white shadow-lg" 
                      : "bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-500"
                  )}>
                    <IconComponent size={32} strokeWidth={1.5} />
                  </div>
                  
                  <h3 className={cn(
                    "font-display font-bold text-lg mb-1",
                    achievement.unlocked ? "text-charcoal-dark dark:text-white" : "text-gray-500 dark:text-gray-500"
                  )}>
                    {achievement.name}
                  </h3>
                  
                  <p className="text-sm text-charcoal-light dark:text-gray-400 leading-relaxed">
                    {achievement.description}
                  </p>

                  {achievement.unlocked && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-4 text-[10px] font-bold text-gold uppercase tracking-widest border border-gold/30 px-2 py-1 rounded-full"
                    >
                      Desbloqueado
                    </motion.span>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </PageTransition>
  );
}   