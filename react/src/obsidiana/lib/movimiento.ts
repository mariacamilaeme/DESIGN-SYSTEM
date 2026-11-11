import type { Transition } from 'motion/react';

/*
 * Movimiento de Obsidiana para Motion (DISENO.md › Movimiento). Espejo de los tokens de
 * movimiento de tokens.css (--curva, --t-*), en el formato que Motion necesita.
 * Solo transform, opacity y trazos SVG. Sin sobreimpulso.
 */

/** cubic-bezier(0.16, 1, 0.3, 1) */
export const CURVA = [0.16, 1, 0.3, 1] as const;

/** Duraciones en segundos */
export const DURACION = {
  hover: 0.12,
  menu: 0.14,
  vista: 0.18,
  ventana: 0.22,
  estado: 0.24,
  cifra: 0.6,
  ruta: 0.9,
} as const;

/** Indicadores que se deslizan (navegación, pestañas, control segmentado). */
export const RESORTE_INDICADOR: Transition = { type: 'spring', stiffness: 420, damping: 36 };

/** Cambio de vista: fundido con desplazamiento de 6 px. */
export const TRANSICION_VISTA: Transition = { duration: DURACION.vista, ease: CURVA };

/** Ventana de detalle: escala 0.98 a 1 con fundido. */
export const TRANSICION_VENTANA: Transition = { duration: DURACION.ventana, ease: CURVA };

/** Menús y popovers: escala 0.97 a 1 desde su origen. */
export const TRANSICION_MENU: Transition = { duration: DURACION.menu, ease: CURVA };

/** Entrada escalonada de listas: 24 ms por elemento, como máximo 8 elementos escalonados. */
export function retrasoEscalonado(indice: number): number {
  return Math.min(indice, 8) * 0.024;
}
