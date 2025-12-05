import { cn } from '../../utils/cn';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
}

export function Logo({ className, size = 'md', showText = true, textClassName }: LogoProps) {
  
  // Tamanhos do ícone
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      {/* Ícone SVG Vetorial */}
      <div className={cn("text-gold relative", sizes[size])}>
        <svg 
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Anel Externo */}
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="12" />
          
          {/* Formas Curvas (Mãos/Folhas) */}
          <path 
            d="M55 90 C55 140 85 155 100 155 C115 155 145 140 145 90" 
            stroke="currentColor" 
            strokeWidth="12" 
            strokeLinecap="round"
          />
          <path 
            d="M100 155 V165" 
            stroke="currentColor" 
            strokeWidth="12" 
            strokeLinecap="round"
          />

          {/* Sol Central */}
          <circle cx="100" cy="85" r="38" fill="currentColor" />
          
          {/* Brilho (Estrela) - Usamos 'fill-paper' para pegar a cor do fundo (bege ou preto) */}
          <path 
            d="M118 70 L122 82 L134 85 L122 88 L118 100 L114 88 L102 85 L114 82 Z" 
            className="fill-paper dark:fill-[#050505] transition-colors duration-500"
          />
        </svg>
      </div>

      {/* Texto IZANAGI */}
      {showText && (
        <span className={cn(
          "font-display font-bold tracking-[0.15em] text-charcoal dark:text-white uppercase",
          size === 'sm' && "text-lg",
          size === 'md' && "text-2xl",
          size === 'lg' && "text-4xl",
          size === 'xl' && "text-5xl",
          textClassName
        )}>
          Izanagi
        </span>
      )}
    </div>
  );
}