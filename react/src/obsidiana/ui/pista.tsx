import { cn } from '../lib/cn';
import { Tooltip } from 'radix-ui';
import type { ComponentProps, ReactNode } from 'react';
import { Tecla } from './tecla';

/*
 * Pista (tooltip). Un único proveedor en el armazón fija el retardo; las pistas siguientes
 * aparecen al instante mientras se recorre una barra de iconos.
 */

export function ProveedorPistas({ children }: { children: ReactNode }) {
  return (
    <Tooltip.Provider delayDuration={450} skipDelayDuration={250}>
      {children}
    </Tooltip.Provider>
  );
}

export interface PropsPista {
  contenido: ReactNode;
  /** Atajo de teclado que se muestra junto al texto, por ejemplo ['Ctrl', 'K']. */
  atajo?: readonly string[];
  lado?: ComponentProps<typeof Tooltip.Content>['side'];
  alineacion?: ComponentProps<typeof Tooltip.Content>['align'];
  /** Si es false, la pista no se muestra (útil para mostrarla solo con la barra plegada). */
  activa?: boolean;
  children: ReactNode;
}

export function Pista({
  contenido,
  atajo,
  lado = 'top',
  alineacion = 'center',
  activa = true,
  children,
}: PropsPista) {
  if (!activa) return <>{children}</>;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side={lado}
          align={alineacion}
          sideOffset={8}
          collisionPadding={8}
          className={cn(
            'flotante anim-flotante z-60 flex items-center gap-2 rounded-control px-2 py-1',
            'text-etiqueta font-medium text-texto-1',
          )}
        >
          {contenido}
          {atajo ? (
            <span className="flex gap-0.5">
              {atajo.map((t) => (
                <Tecla key={t} tamano="sm">
                  {t}
                </Tecla>
              ))}
            </span>
          ) : null}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
