import { CLASE_FLOTANTE } from '../lib/clases';
import { cn } from '../lib/cn';
import { Popover } from 'radix-ui';
import type { ComponentProps } from 'react';

/* Popover ("emergente"): escala 0.97 a 1 desde su origen en 140 ms. */

export const Emergente = Popover.Root;
export const EmergenteDisparador = Popover.Trigger;
export const EmergenteAncla = Popover.Anchor;
export const EmergenteCerrar = Popover.Close;

export function EmergenteContenido({
  className,
  align = 'start',
  sideOffset = 6,
  ...props
}: ComponentProps<typeof Popover.Content>) {
  return (
    <Popover.Portal>
      <Popover.Content
        align={align}
        sideOffset={sideOffset}
        collisionPadding={12}
        className={cn(CLASE_FLOTANTE, 'outline-none', className)}
        {...props}
      />
    </Popover.Portal>
  );
}
