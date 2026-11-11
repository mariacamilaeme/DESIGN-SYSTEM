import { cn } from '../lib/cn';
import { RESORTE_INDICADOR } from '../lib/movimiento';
import { motion } from 'motion/react';
import { ToggleGroup } from 'radix-ui';
import { type ReactNode, useId } from 'react';

/* Control segmentado con píldora que se desliza entre opciones. */

export interface OpcionSegmentado<T extends string> {
  valor: T;
  etiqueta: ReactNode;
  icono?: ReactNode;
  /** Nombre accesible cuando la opción solo muestra un icono. */
  nombre?: string;
}

export interface PropsSegmentado<T extends string> {
  valor: T;
  onCambio: (valor: T) => void;
  opciones: readonly OpcionSegmentado<T>[];
  tamano?: 'sm' | 'md';
  className?: string;
  'aria-label': string;
}

export function Segmentado<T extends string>({
  valor,
  onCambio,
  opciones,
  tamano = 'md',
  className,
  'aria-label': etiqueta,
}: PropsSegmentado<T>) {
  const grupo = useId();
  return (
    <ToggleGroup.Root
      type="single"
      value={valor}
      onValueChange={(v) => {
        // Un control segmentado siempre tiene una opción elegida.
        if (v) onCambio(v as T);
      }}
      aria-label={etiqueta}
      className={cn(
        'relative inline-flex items-stretch rounded-control border border-linea-fuerte bg-campo p-0.5',
        tamano === 'md' ? 'h-control' : 'h-control-compacto',
        className,
      )}
    >
      {opciones.map((o) => {
        const activa = o.valor === valor;
        return (
          <ToggleGroup.Item
            key={o.valor}
            value={o.valor}
            aria-label={o.nombre}
            className={cn(
              'relative inline-flex items-center justify-center gap-1.5 rounded-elemento font-medium whitespace-nowrap',
              'text-texto-2 transition-colors duration-(--t-hover) hover:text-texto-1',
              'data-[state=on]:text-texto-1 focus-visible:outline-offset-0',
              tamano === 'md' ? 'px-3 text-cuerpo' : 'px-2.5 text-etiqueta',
              o.icono && !o.etiqueta ? 'aspect-square px-0' : null,
            )}
          >
            {activa ? (
              <motion.span
                layoutId={`segmento-${grupo}`}
                transition={RESORTE_INDICADOR}
                aria-hidden
                className="absolute inset-0 rounded-elemento border border-linea-fuerte bg-pulgar shadow-control"
              />
            ) : null}
            <span className="relative inline-flex items-center gap-1.5">
              {o.icono}
              {o.etiqueta}
            </span>
          </ToggleGroup.Item>
        );
      })}
    </ToggleGroup.Root>
  );
}
