import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina classes Tailwind de forma inteligente, resolvendo conflitos.
 * Ex: cn('px-2 py-1', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}