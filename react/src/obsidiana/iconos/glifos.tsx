/*
 * Obsidiana · glifos de estado en React.
 * Generado por iconos/fuente/generar.mjs. No editar a mano.
 *
 * Glifos de 10 px: una forma distinta por estado, para que una píldora se distinga sin depender
 * del color.
 */
import type { SVGProps } from 'react';

export type FormaGlifo = 'anillo' | 'medio' | 'rombo' | 'lleno' | 'guion' | 'triangulo' | 'cuadrado' | 'punto';

export const FORMAS_GLIFO: readonly FormaGlifo[] = ['anillo', 'medio', 'rombo', 'lleno', 'guion', 'triangulo', 'cuadrado', 'punto'];

export function GlifoEstado({
  forma,
  tamano = 10,
  ...resto
}: { forma: FormaGlifo; tamano?: number } & Omit<SVGProps<SVGSVGElement>, 'children'>) {
  return (
    <svg
      viewBox="0 0 10 10"
      width={tamano}
      height={tamano}
      aria-hidden
      focusable="false"
      data-glifo={forma}
      style={{ flex: 'none' }}
      {...resto}
    >
      {forma === 'anillo' && <><circle cx="5" cy="5" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.5" /></>}
      {forma === 'medio' && <><circle cx="5" cy="5" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M5 1.6a3.4 3.4 0 0 1 0 6.8Z" fill="currentColor" /></>}
      {forma === 'rombo' && <><path d="M5 .9 9.1 5 5 9.1.9 5Z" fill="currentColor" /></>}
      {forma === 'lleno' && <><circle cx="5" cy="5" r="4.1" fill="currentColor" /></>}
      {forma === 'guion' && <><path d="M1.6 5h6.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></>}
      {forma === 'triangulo' && <><path d="M5 1.7 8.6 8H1.4Z" fill="currentColor" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" /></>}
      {forma === 'cuadrado' && <><rect x="1.4" y="1.4" width="7.2" height="7.2" rx="1.3" fill="currentColor" /></>}
      {forma === 'punto' && <><circle cx="5" cy="5" r="2.6" fill="currentColor" /></>}
    </svg>
  );
}
