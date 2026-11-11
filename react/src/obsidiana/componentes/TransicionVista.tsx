import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { TRANSICION_VISTA } from '../lib/movimiento';

/*
 * Transición de vista (DISENO.md › Movimiento): fundido con desplazamiento de 6 px en 180 ms con
 * la curva de Obsidiana, cada vez que cambia `clave` (normalmente, la ruta sin parámetros de
 * búsqueda: filtrar o paginar no debe disparar la animación). Solo la entrada se anima: la vista
 * anterior se retira al instante para que la navegación nunca se sienta lenta.
 *
 *   <TransicionVista clave={location.pathname}>{vista}</TransicionVista>
 */
export function TransicionVista({ clave, children }: { clave: string; children: ReactNode }) {
  return (
    <motion.div
      key={clave}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={TRANSICION_VISTA}
      className="min-h-full"
    >
      {children}
    </motion.div>
  );
}
