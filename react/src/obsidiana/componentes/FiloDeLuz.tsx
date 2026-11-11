import { cn } from '../lib/cn';
import type { ComponentProps } from 'react';

/*
 * Filo de luz: borde de 1 px en degradado (acento a transparente, 135°) recortado al contorno con
 * mask-composite. Nunca un borde plano de color. Se coloca como capa dentro de un elemento con
 * `position: relative` y radio propio; hereda el radio.
 *
 * Para encenderlo en un contenedor existente también sirve la clase `filo-luz` con
 * data-filo="encendido" (ver base.css); este componente es la versión explícita.
 */
export function FiloDeLuz({
  encendido = true,
  className,
  ...props
}: ComponentProps<'span'> & { encendido?: boolean }) {
  return (
    <span
      aria-hidden
      data-filo={encendido ? 'encendido' : undefined}
      className={cn('filo-luz pointer-events-none absolute inset-0 rounded-[inherit]', className)}
      {...props}
    />
  );
}
