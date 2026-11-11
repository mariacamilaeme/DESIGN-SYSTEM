import { cn } from '../lib/cn';
import type { ComponentProps } from 'react';

/** Tecla (kbd): atajos como Ctrl K. */
export function Tecla({
  className,
  tamano = 'md',
  ...props
}: ComponentProps<'kbd'> & { tamano?: 'sm' | 'md' }) {
  return (
    <kbd
      className={cn(
        'inline-grid place-items-center rounded-mini border border-linea-fuerte bg-boton-2 font-mono text-texto-2 shadow-control',
        'leading-none font-medium',
        tamano === 'md' ? 'h-5 min-w-5 px-1.5 text-mini' : 'h-4.5 min-w-4.5 px-1 text-mini',
        className,
      )}
      {...props}
    />
  );
}
