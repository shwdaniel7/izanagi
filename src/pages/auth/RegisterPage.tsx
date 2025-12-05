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
import { Mail, Lock, User, AlertCircle } from 'lucide-react';

// Schema de validação
const registerSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setAuthError(null);
    
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
      },
    });

    if (error) {
      setAuthError(error.message);
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
            INICIE SUA JORNADA DE DISCIPLINA
          </p>
        </div>

        {/* Card de Registro */}
        <Card className="border-gold/30 shadow-glow">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {authError && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-lg flex items-center gap-2 text-error text-sm">
                <AlertCircle size={16} />
                <span>{authError}</span>
              </div>
            )}

            <Input
              label="Nome"
              placeholder="Como quer ser chamado?"
              icon={<User size={18} />}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              icon={<Mail size={18} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Crie uma senha forte"
              icon={<Lock size={18} />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirmar Senha"
              type="password"
              placeholder="Repita a senha"
              icon={<Lock size={18} />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="pt-4">
              <Button 
                type="submit" 
                fullWidth 
                isLoading={isSubmitting}
                className="shadow-glow"
              >
                Criar Conta
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-charcoal-light dark:text-gray-400">
              Já possui uma conta?{' '}
              <Link to="/login" className="text-gold font-medium hover:underline hover:text-gold-light transition-colors">
                Fazer Login
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}