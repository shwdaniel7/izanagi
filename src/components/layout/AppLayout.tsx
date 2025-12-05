import { Outlet } from 'react-router-dom';
import { Sidebar, MobileNav } from './Navigation';
import { cn } from '../../utils/cn';

export function AppLayout() {
  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      // Modo Claro: Fundo Bege
      "bg-paper",
      // Modo Escuro: Fundo Preto Profundo (quase preto absoluto para contraste com a sidebar)
      "dark:bg-[#050505]" 
    )}>
      {/* Sidebar para Desktop */}
      <Sidebar />

      {/* Área de Conteúdo Principal */}
      <main className="md:pl-64 min-h-screen transition-all duration-300">
        <div className="max-w-5xl mx-auto p-6 pb-24 md:p-10 md:pb-10 animate-in fade-in duration-500">
          <Outlet />
        </div>
      </main>

      {/* Navegação Inferior para Mobile */}
      <MobileNav />
    </div>
  );
}