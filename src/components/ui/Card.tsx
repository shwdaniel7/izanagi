import { cn } from '../../utils/cn';
import { motion, type HTMLMotionProps } from 'framer-motion';
import React from 'react';

interface CardProps extends HTMLMotionProps<"div"> {
  hoverEffect?: boolean;
  children?: React.ReactNode;
}

export function Card({ className, hoverEffect = false, children, onClick, ...props }: CardProps) {
  const isInteractive = hoverEffect || !!onClick;

  return (
    <motion.div
      whileHover={isInteractive ? { y: -4, boxShadow: "0 10px 30px -5px rgba(201, 168, 106, 0.15)" } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={cn(
        // Base
        "rounded-xl border shadow-soft p-6 relative overflow-hidden transition-all duration-300",
        
        // Light Mode (Mantido)
        "bg-white border-gold/10",
        
        // DARK MODE PREMIUM (A Mágica acontece aqui)
        // 1. Fundo semitransparente (Vidro escuro)
        "dark:bg-charcoal/40 dark:backdrop-blur-md",
        // 2. Borda sutil dourada
        "dark:border-gold/10",
        // 3. Sombra interna para dar volume
        "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]",
        
        isInteractive && "cursor-pointer dark:hover:border-gold/30 dark:hover:bg-charcoal/60",
        className
      )}
      {...props}
    >
      {/* Brilho superior sutil */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-50" />
      
      {children}
    </motion.div>
  );
}