import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Logo } from '../../components/ui/Logo'; // <--- Importe da Logo
import { Mail, Lock, AlertCircle } from 'lucide-react';

// Schema de validação
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setAuthError('Email ou senha incorretos.');
      return;
    }

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-paper dark:bg-[#050505] transition-colors duration-500">
      <div className="w-full max-w-md space-y-6">
        
        {/* Cabeçalho com Logo */}
        <div className="text-center space-y-4 mb-8">
          <Logo size="lg" />
          <p className="text-charcoal-light dark:text-gray-400 text-sm tracking-wide font-medium">
            DISCIPLINA • ELEGÂNCIA • PROGRESSO
          </p>
        </div>

        {/* Card de Login */}
        <Card className="border-gold/30 shadow-glow">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {authError && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-lg flex items-center gap-2 text-error text-sm">
                <AlertCircle size={16} />
                <span>{authError}</span>
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="exemplo@email.com"
              icon={<Mail size={18} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="pt-2">
              <Button 
                type="submit" 
                fullWidth 
                isLoading={isSubmitting}
                className="shadow-glow"
              >
                Entrar
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-charcoal-light dark:text-gray-400">
              Ainda não tem uma conta?{' '}
              <Link to="/register" className="text-gold font-medium hover:underline hover:text-gold-light transition-colors">
                Registrar-se
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}