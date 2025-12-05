import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProfile } from '../../hooks/useProfile';
import { useWeeklyStats } from '../../hooks/useStats'; // <--- Hook do Gráfico
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ActivityChart } from '../../components/dashboard/ActivityChart'; // <--- Componente do Gráfico
import { User, Calendar, CheckSquare, LogOut, Save } from 'lucide-react';

// Schema de validação para o nome
const profileSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfilePage() {
  // --- Hooks de Dados ---
  const { data: profile, stats, updateName, isUpdating } = useProfile();
  const { data: chartData, isLoading: loadingChart } = useWeeklyStats(); // Dados do gráfico
  const { signOut } = useAuth();
  
  // --- Estado Local ---
  const [isEditing, setIsEditing] = useState(false);

  // --- Formulário ---
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // Atualiza o input quando o perfil carrega
  useEffect(() => {
    if (profile?.name) {
      setValue('name', profile.name);
    }
  }, [profile, setValue]);

  // --- Handlers ---
  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateName(data.name);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };

  // --- Helpers de Visualização ---
  const initials = profile?.name
    ? profile.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'IZ';

  const joinDate = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : '...';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-charcoal-dark">
          Seu <span className="text-gold">Perfil</span>
        </h1>
        <p className="text-charcoal-light">Gerencie sua identidade e visualize seu progresso.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- Coluna da Esquerda: Identidade --- */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="flex flex-col items-center p-8 text-center border-gold/20 shadow-soft">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gold text-white flex items-center justify-center text-3xl font-display font-bold shadow-glow mb-4 border-4 border-white ring-1 ring-gold/20">
              {initials}
            </div>
            
            {!isEditing ? (
              // Modo Visualização
              <>
                <h2 className="text-2xl font-bold text-charcoal">{profile?.name}</h2>
                <p className="text-sm text-charcoal-light mb-6">Nível {profile?.level} • Mestre da Disciplina</p>
                <Button variant="secondary" fullWidth onClick={() => setIsEditing(true)}>
                  Editar Perfil
                </Button>
              </>
            ) : (
              // Modo Edição
              <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
                <Input 
                  label="Nome de Exibição" 
                  {...register('name')} 
                  error={errors.name?.message}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" fullWidth onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" fullWidth isLoading={isUpdating}>
                    <Save size={16} className="mr-2" /> Salvar
                  </Button>
                </div>
              </form>
            )}
          </Card>

          {/* Botão de Logout */}
          <Card className="p-0 overflow-hidden border-error/10">
            <button 
              onClick={signOut}
              className="w-full flex items-center justify-center gap-2 p-4 text-error hover:bg-error/5 transition-colors font-medium"
            >
              <LogOut size={18} />
              Sair do Sistema
            </button>
          </Card>
        </div>

        {/* --- Coluna da Direita: Estatísticas e Gráficos --- */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-charcoal">Estatísticas Gerais</h3>
          
          {/* Cards Pequenos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="flex items-center gap-4 p-6 hover:border-gold/30 transition-colors">
              <div className="p-3 bg-gold/10 rounded-full text-gold">
                <CheckSquare size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal-light uppercase">Total de Hábitos</p>
                <p className="text-2xl font-display font-bold text-charcoal">{stats?.totalHabits || 0}</p>
              </div>
            </Card>

            <Card className="flex items-center gap-4 p-6 hover:border-gold/30 transition-colors">
              <div className="p-3 bg-charcoal/5 rounded-full text-charcoal">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal-light uppercase">Membro Desde</p>
                <p className="text-xl font-display font-bold text-charcoal capitalize">{joinDate}</p>
              </div>
            </Card>
          </div>

          {/* Gráfico de Atividade */}
          <div className="pt-2">
            <ActivityChart data={chartData || []} isLoading={loadingChart} />
          </div>

          {/* ID do Usuário (Discreto) */}
          <div className="flex items-center gap-2 text-xs text-gray-300 justify-end px-2">
            <User size={12} />
            <span className="font-mono">ID: {profile?.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}