import { motion } from 'motion/react';
import { useId } from 'react';
import { IconoLuna, IconoSol } from '../iconos';
import { cn } from '../lib/cn';
import { RESORTE_INDICADOR } from '../lib/movimiento';
import { fijarTema, type Tema, useTema } from '../lib/tema';

/*
 * Conmutador de tema: dos posiciones (sol y luna) con un pulgar que se desliza. Al cambiar, el
 * icono elegido hace su microanimación (los rayos giran, la luna se inclina) y la pantalla pasa
 * de un tema al otro con un fundido cruzado (View Transitions, en lib/tema).
 */
const OPCIONES: { valor: Tema; nombre: string; Icono: typeof IconoSol }[] = [
  { valor: 'claro', nombre: 'Tema claro', Icono: IconoSol },
  { valor: 'oscuro', nombre: 'Tema oscuro', Icono: IconoLuna },
];

export function InterruptorTema({ className }: { className?: string }) {
  const tema = useTema();
  // Un indicador por instancia: dos conmutadores en pantalla no comparten el deslizamiento.
  const grupo = useId();
  return (
    <fieldset
      aria-label="Tema"
      className={cn(
        'relative m-0 flex h-control items-center gap-0.5 rounded-control border border-linea bg-lavado p-0.5',
        className,
      )}
    >
      {OPCIONES.map(({ valor, nombre, Icono }) => {
        const activo = tema === valor;
        return (
          <button
            key={valor}
            type="button"
            aria-pressed={activo}
            aria-label={nombre}
            title={nombre}
            onClick={() => fijarTema(valor)}
            className={cn(
              'relative grid h-full w-7 place-items-center rounded-elemento transition-colors duration-(--t-estado)',
              activo ? 'text-texto-1' : 'text-texto-3 hover:text-texto-2',
              'focus-visible:outline-offset-0',
            )}
          >
            {activo ? (
              <motion.span
                layoutId={`tema-pulgar-${grupo}`}
                transition={RESORTE_INDICADOR}
                aria-hidden
                className="absolute inset-0 rounded-elemento border border-linea-fuerte bg-pulgar shadow-control"
              />
            ) : null}
            <motion.span
              key={`${valor}-${activo}`}
              className="relative flex"
              initial={
                activo ? { rotate: valor === 'claro' ? -45 : 20, scale: 0.8, opacity: 0.4 } : false
              }
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              <Icono tamano={14} />
            </motion.span>
          </button>
        );
      })}
    </fieldset>
  );
}
