import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '../../hooks/useProfile';
import { useHabits, useCreateHabit, useCheckHabit, useDeleteHabit } from '../../hooks/useHabits';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { PageTransition } from '../../components/layout/PageTransition';
import { cn } from '../../utils/cn';
import { Trophy, Star, Zap, Plus, Check, Trash2, Calendar, AlertTriangle } from 'lucide-react';

const habitSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 letras'),
  description: z.string().optional(),
  periodicity: z.enum(['daily', 'weekly']),
});

type HabitFormData = z.infer<typeof habitSchema>;

export function DashboardPage() {
  // --- Estados ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null); // <--- Estado para exclusão

  // --- Hooks de Dados ---
  const { data: profile, isLoading: loadingProfile, isError } = useProfile();
  const { data: habits, isLoading: loadingHabits } = useHabits();
  
  // --- Mutações ---
  const createHabitMutation = useCreateHabit();
  const checkHabitMutation = useCheckHabit();
  const deleteHabitMutation = useDeleteHabit();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: { periodicity: 'daily' }
  });

  // --- Handlers ---
  const onSubmit = async (data: HabitFormData) => {
    try {
      await createHabitMutation.mutateAsync(data);
      reset();
      setIsModalOpen(false);
    } catch (err) { console.error(err); }
  };

  const handleCheck = (habitId: string, isCompleted: boolean) => {
    if (isCompleted) return;
    checkHabitMutation.mutate(habitId);
  };

  // Abre o modal de confirmação
  const handleDeleteClick = (e: React.MouseEvent, habitId: string) => {
    e.stopPropagation();
    setHabitToDelete(habitId);
  };

  // Executa a exclusão real
  const confirmDelete = async () => {
    if (habitToDelete) {
      await deleteHabitMutation.mutateAsync(habitToDelete);
      setHabitToDelete(null);
    }
  };

  // --- Renderização Condicional ---
  if (loadingProfile) return <div className="flex items-center justify-center h-64"><div className="text-gold animate-pulse">Carregando...</div></div>;
  if (isError) return <div className="flex items-center justify-center h-64 text-error"><AlertTriangle className="mr-2"/> Erro ao carregar dados.</div>;

  // --- Cálculos ---
  const xpToNextLevel = (profile?.level || 1) * 100;
  const currentXp = profile?.xp || 0;
  const progress = Math.min((currentXp / xpToNextLevel) * 100, 100);
  const todayDate = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  // --- Variantes de Animação ---
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-charcoal-dark dark:text-white">
              Olá, <span className="text-gradient-gold">{profile?.name}</span>
            </h1>
            <p className="text-charcoal-light dark:text-gray-400 mt-2">Sua jornada de disciplina continua.</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-gold uppercase tracking-widest">Data de Hoje</p>
            <p className="text-charcoal dark:text-gray-200 font-medium capitalize">{todayDate}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card Nível */}
          <motion.div variants={itemVariants}>
            <Card hoverEffect className="relative overflow-hidden border-gold/40 shadow-soft h-full">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy size={80} className="text-gold" /></div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-gold uppercase tracking-wider">Nível Atual</span>
                <div className="text-4xl font-display font-bold text-charcoal-dark dark:text-white">{profile?.level}</div>
                <p className="text-xs text-charcoal-light dark:text-gray-400">Mestre da Disciplina</p>
              </div>
            </Card>
          </motion.div>

          {/* Card XP */}
          <motion.div variants={itemVariants}>
            <Card hoverEffect className="relative overflow-hidden shadow-soft h-full">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Star size={80} /></div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-gold uppercase tracking-wider">Experiência</span>
                  <span className="text-xs text-charcoal-light dark:text-gray-400">{currentXp} / {xpToNextLevel} XP</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gold shadow-glow"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-charcoal-light dark:text-gray-400">Faltam {xpToNextLevel - currentXp} XP para o próximo nível</p>
              </div>
            </Card>
          </motion.div>

          {/* Card Streak */}
          <motion.div variants={itemVariants}>
            <Card hoverEffect className="relative overflow-hidden shadow-soft h-full">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Zap size={80} /></div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-gold uppercase tracking-wider">Sequência</span>
                <div className="text-4xl font-display font-bold text-charcoal-dark dark:text-white">0 <span className="text-base font-normal text-charcoal-light dark:text-gray-400">dias</span></div>
                <p className="text-xs text-charcoal-light dark:text-gray-400">Mantenha o foco!</p>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Lista de Hábitos */}
        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-charcoal dark:text-white">Hábitos de Hoje</h2>
            <Button size="sm" onClick={() => setIsModalOpen(true)} className="shadow-glow">
              <Plus size={16} className="mr-1" /> Novo Hábito
            </Button>
          </div>

          {loadingHabits ? (
            <div className="text-center py-10 text-charcoal-light animate-pulse">Carregando...</div>
          ) : habits && habits.length > 0 ? (
            <div className="grid gap-4">
              <AnimatePresence mode='popLayout'>
                {habits.map((habit: any) => (
                  <motion.div
                    key={habit.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card 
                      onClick={() => handleCheck(habit.id, habit.isCompleted)}
                      className={cn(
                        "relative flex items-center justify-between p-4 transition-colors duration-200 cursor-pointer group border",
                        habit.isCompleted 
                          ? "bg-gold/5 border-gold/30" 
                          : "bg-white dark:bg-charcoal border-gold/20 hover:border-gold/50 hover:shadow-md"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <motion.div 
                          whileTap={{ scale: 0.8 }}
                          className={cn(
                            "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors duration-300",
                            habit.isCompleted
                              ? "bg-gold border-gold text-white shadow-glow"
                              : "border-gray-300 dark:border-gray-600 group-hover:border-gold text-transparent"
                          )}
                        >
                          {habit.isCompleted && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                              <Check size={16} strokeWidth={3} />
                            </motion.div>
                          )}
                        </motion.div>
                        
                        <div className={habit.isCompleted ? "opacity-50 transition-opacity" : ""}>
                          <h3 className={cn(
                            "font-medium transition-colors",
                            habit.isCompleted 
                              ? "text-gold-dark line-through" 
                              : "text-charcoal dark:text-white group-hover:text-gold-dark dark:group-hover:text-gold"
                          )}>
                            {habit.title}
                          </h3>
                          {habit.description && <p className="text-xs text-charcoal-light dark:text-gray-400">{habit.description}</p>}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-[10px] px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-charcoal-light dark:text-gray-300 uppercase tracking-wide font-medium">
                          {habit.periodicity === 'daily' ? 'Diário' : 'Semanal'}
                        </div>
                        <button
                          onClick={(e) => handleDeleteClick(e, habit.id)}
                          className="p-2 text-charcoal-light dark:text-gray-400 hover:text-error hover:bg-error/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed border-2 border-gray-200 dark:border-gray-700 shadow-none bg-transparent">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-4 text-gold">
                <Zap size={32} />
              </div>
              <h3 className="text-lg font-medium text-charcoal dark:text-white">Nenhum hábito para hoje</h3>
              <button onClick={() => setIsModalOpen(true)} className="text-gold font-medium hover:underline mt-2">
                + Criar meu primeiro hábito
              </button>
            </Card>
          )}
        </div>

        {/* Modal de Criação */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Hábito">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input label="Título" placeholder="Ex: Ler 10 páginas" error={errors.title?.message} {...register('title')} />
            <Input label="Descrição (Opcional)" placeholder="Detalhes da meta..." {...register('description')} />
            <div className="space-y-2">
              <label className="text-xs font-medium text-charcoal-light dark:text-gray-400 uppercase tracking-wider ml-1">Periodicidade</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer relative">
                  <input type="radio" value="daily" className="peer sr-only" {...register('periodicity')} />
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-charcoal peer-checked:border-gold peer-checked:bg-gold/5 peer-checked:shadow-sm transition-all duration-200 hover:border-gold/50">
                    <Zap size={20} className="mb-1 text-charcoal-light dark:text-gray-400 peer-checked:text-gold" />
                    <span className="text-sm font-medium text-charcoal dark:text-white peer-checked:text-gold-dark dark:peer-checked:text-gold">Diário</span>
                  </div>
                </label>
                <label className="cursor-pointer relative">
                  <input type="radio" value="weekly" className="peer sr-only" {...register('periodicity')} />
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-charcoal peer-checked:border-gold peer-checked:bg-gold/5 peer-checked:shadow-sm transition-all duration-200 hover:border-gold/50">
                    <Calendar size={20} className="mb-1 text-charcoal-light dark:text-gray-400 peer-checked:text-gold" />
                    <span className="text-sm font-medium text-charcoal dark:text-white peer-checked:text-gold-dark dark:peer-checked:text-gold">Semanal</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="pt-4">
              <Button type="submit" fullWidth isLoading={createHabitMutation.isPending} className="shadow-glow">Criar Hábito</Button>
            </div>
          </form>
        </Modal>

        {/* Modal de Confirmação de Exclusão */}
        <ConfirmModal
          isOpen={!!habitToDelete}
          onClose={() => setHabitToDelete(null)}
          onConfirm={confirmDelete}
          title="Excluir Hábito"
          description="Tem certeza que deseja excluir este hábito? Todo o histórico de checks dele será perdido."
          isLoading={deleteHabitMutation.isPending}
        />

      </div>
    </PageTransition>
  );
}