import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useHabits, useCreateHabit, useUpdateHabit, useDeleteHabit } from '../../hooks/useHabits';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { ConfirmModal } from '../../components/ui/ConfirmModal'; // <--- Importe Novo
import { Plus, Calendar, Zap, Pencil, Trash2 } from 'lucide-react';

// Schema
const habitSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 letras'),
  description: z.string().optional(),
  periodicity: z.enum(['daily', 'weekly']),
});

type HabitFormData = z.infer<typeof habitSchema>;

export function HabitsPage() {
  const { data: habits, isLoading } = useHabits();
  const createHabitMutation = useCreateHabit();
  const updateHabitMutation = useUpdateHabit();
  const deleteHabitMutation = useDeleteHabit();

  // Estado para controlar Modal e Edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<any | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null); // <--- Estado para exclusão

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: { periodicity: 'daily' }
  });

  // Abrir modal para CRIAR
  const handleOpenCreate = () => {
    setEditingHabit(null);
    reset({ title: '', description: '', periodicity: 'daily' });
    setIsModalOpen(true);
  };

  // Abrir modal para EDITAR
  const handleOpenEdit = (habit: any) => {
    setEditingHabit(habit);
    setValue('title', habit.title);
    setValue('description', habit.description || '');
    setValue('periodicity', habit.periodicity);
    setIsModalOpen(true);
  };

  // Salvar (Cria ou Atualiza dependendo do estado)
  const onSubmit = async (data: HabitFormData) => {
    try {
      if (editingHabit) {
        await updateHabitMutation.mutateAsync({ id: editingHabit.id, ...data });
      } else {
        await createHabitMutation.mutateAsync(data);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Abre o modal de confirmação
  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHabitToDelete(id);
  };

  // Executa a exclusão real
  const confirmDelete = async () => {
    if (habitToDelete) {
      await deleteHabitMutation.mutateAsync(habitToDelete);
      setHabitToDelete(null);
    }
  };

  // Filtros visuais
  const dailyHabits = habits?.filter((h: any) => h.periodicity === 'daily') || [];
  const weeklyHabits = habits?.filter((h: any) => h.periodicity === 'weekly') || [];

  if (isLoading) return <div className="text-gold animate-pulse mt-10 text-center">Carregando biblioteca de hábitos...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold text-charcoal-dark dark:text-white">
            Gerenciar <span className="text-gold">Hábitos</span>
          </h1>
          <p className="text-charcoal-light dark:text-gray-400">Organize sua rotina e ajuste suas metas.</p>
        </div>
        <Button onClick={handleOpenCreate} className="shadow-glow">
          <Plus size={18} className="mr-2" /> Novo Hábito
        </Button>
      </div>

      {/* Grid de Organização */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Coluna: Diários */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-charcoal dark:text-white font-bold uppercase tracking-wider text-sm border-b border-gold/20 pb-2">
            <Zap size={16} className="text-gold" />
            <span>Rotina Diária</span>
            <span className="ml-auto bg-gold/10 text-gold px-2 py-0.5 rounded-full text-xs">{dailyHabits.length}</span>
          </div>
          
          <div className="space-y-3">
            {dailyHabits.length === 0 && <p className="text-sm text-charcoal-light dark:text-gray-500 italic">Nenhum hábito diário.</p>}
            {dailyHabits.map((habit: any) => (
              <HabitManagementCard 
                key={habit.id} 
                habit={habit} 
                onEdit={() => handleOpenEdit(habit)} 
                onDelete={(e) => handleDeleteClick(e, habit.id)} 
              />
            ))}
          </div>
        </div>

        {/* Coluna: Semanais */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-charcoal dark:text-white font-bold uppercase tracking-wider text-sm border-b border-gold/20 pb-2">
            <Calendar size={16} className="text-gold" />
            <span>Metas Semanais</span>
            <span className="ml-auto bg-gold/10 text-gold px-2 py-0.5 rounded-full text-xs">{weeklyHabits.length}</span>
          </div>

          <div className="space-y-3">
            {weeklyHabits.length === 0 && <p className="text-sm text-charcoal-light dark:text-gray-500 italic">Nenhum hábito semanal.</p>}
            {weeklyHabits.map((habit: any) => (
              <HabitManagementCard 
                key={habit.id} 
                habit={habit} 
                onEdit={() => handleOpenEdit(habit)} 
                onDelete={(e) => handleDeleteClick(e, habit.id)} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal Reutilizável (Criação e Edição) */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingHabit ? "Editar Hábito" : "Novo Hábito"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input 
            label="Título" 
            placeholder="Ex: Ler 10 páginas" 
            error={errors.title?.message}
            {...register('title')}
          />
          
          <Input 
            label="Descrição (Opcional)" 
            placeholder="Detalhes da meta..." 
            {...register('description')}
          />

          <div className="space-y-2">
            <label className="text-xs font-medium text-charcoal-light dark:text-gray-400 uppercase tracking-wider ml-1">
              Periodicidade
            </label>
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

          <div className="pt-4 flex gap-3">
            {editingHabit && (
               <Button type="button" variant="ghost" fullWidth onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            )}
            <Button 
              type="submit" 
              fullWidth 
              isLoading={createHabitMutation.isPending || updateHabitMutation.isPending}
            >
              {editingHabit ? "Salvar Alterações" : "Criar Hábito"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={!!habitToDelete}
        onClose={() => setHabitToDelete(null)}
        onConfirm={confirmDelete}
        title="Excluir Permanentemente"
        description="Esta ação não pode ser desfeita. O hábito será removido da sua rotina."
        isLoading={deleteHabitMutation.isPending}
      />
    </div>
  );
}

// Componente auxiliar para o Card de Gerenciamento
function HabitManagementCard({ habit, onEdit, onDelete }: { habit: any, onEdit: () => void, onDelete: (e: any) => void }) {
  return (
    <Card 
      onClick={onEdit}
      className="group flex items-center justify-between p-4 cursor-pointer hover:border-gold/50 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center gap-4">
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-charcoal-light dark:text-gray-400 group-hover:text-gold group-hover:bg-gold/10 transition-colors">
          {habit.periodicity === 'daily' ? <Zap size={18} /> : <Calendar size={18} />}
        </div>
        <div>
          <h3 className="font-medium text-charcoal dark:text-white group-hover:text-gold-dark dark:group-hover:text-gold transition-colors">{habit.title}</h3>
          {habit.description && <p className="text-xs text-charcoal-light dark:text-gray-400 truncate max-w-[200px]">{habit.description}</p>}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={onEdit}
          className="p-2 text-charcoal-light dark:text-gray-400 hover:text-gold hover:bg-gold/10 rounded-full transition-colors"
          title="Editar"
        >
          <Pencil size={16} />
        </button>
        <button 
          onClick={onDelete}
          className="p-2 text-charcoal-light dark:text-gray-400 hover:text-error hover:bg-error/10 rounded-full transition-colors"
          title="Excluir"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </Card>
  );
}