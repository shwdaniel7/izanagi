import { useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Trophy, User, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Logo } from '../ui/Logo';
import { cn } from '../../utils/cn';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Hábitos', icon: CheckSquare, path: '/habits' },
  { label: 'Conquistas', icon: Trophy, path: '/achievements' },
  { label: 'Perfil', icon: User, path: '/profile' },
];

export function Sidebar() {
  const { pathname } = useLocation();
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-white dark:bg-charcoal border-r border-gold/20 transition-colors duration-300">
      {/* Logo Area */}
      <div className="p-8 flex justify-center md:justify-start">
        {/* Substituímos o texto manual pelo componente Logo */}
        <div className="flex items-center gap-3">
          <Logo size="sm" showText={true} className="flex-row" textClassName="text-xl tracking-widest" />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-gold/10 text-gold shadow-sm" 
                  : "text-charcoal-light dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-charcoal dark:hover:text-white"
              )}
            >
              <item.icon 
                size={20} 
                className={cn("transition-colors", isActive ? "text-gold" : "text-charcoal-light dark:text-gray-500 group-hover:text-charcoal dark:group-hover:text-white")} 
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Area */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-charcoal-light dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
        </button>

        {/* Logout */}
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-charcoal-light dark:text-gray-400 hover:bg-error/5 hover:text-error transition-colors"
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const { pathname } = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-charcoal border-t border-gold/20 pb-safe z-50 px-6 py-3 shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.05)] transition-colors duration-300">
      <div className="flex justify-between items-center">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 min-w-[64px]"
            >
              <div className={cn(
                "p-2 rounded-full transition-all duration-200",
                isActive ? "bg-gold/10 text-gold" : "text-charcoal-light dark:text-gray-500"
              )}>
                <item.icon size={20} />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                isActive ? "text-gold" : "text-charcoal-light dark:text-gray-500"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}