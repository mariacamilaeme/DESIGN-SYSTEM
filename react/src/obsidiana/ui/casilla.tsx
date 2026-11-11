import { cn } from '../lib/cn';
import { Checkbox, Switch } from 'radix-ui';
import type { ComponentProps } from 'react';

/*
 * Casilla (checkbox) con trazo de confirmación que se dibuja, e Interruptor (switch).
 */

export function Casilla({ className, ...props }: ComponentProps<typeof Checkbox.Root>) {
  return (
    <Checkbox.Root
      className={cn(
        'peer group/casilla relative inline-grid size-4 shrink-0 place-items-center rounded-mini',
        'border border-linea-hover bg-campo shadow-control',
        'transition-[background-color,border-color,box-shadow] duration-(--t-estado) ease-salida',
        'hover:not-disabled:border-texto-3',
        'data-[state=checked]:border-acento-relleno data-[state=checked]:bg-acento-relleno',
        'data-[state=indeterminate]:border-acento-relleno data-[state=indeterminate]:bg-acento-relleno',
        'disabled:cursor-not-allowed disabled:opacity-45',
        'aria-invalid:border-rojo',
        className,
      )}
      {...props}
    >
      <svg
        viewBox="0 0 12 12"
        className="size-2.5 text-sobre-acento"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path
          d="M2.5 6.25 5 8.75l4.5-5.5"
          pathLength={1}
          strokeDasharray="1"
          className="transition-[stroke-dashoffset] duration-(--t-estado) ease-salida [stroke-dashoffset:1] group-data-[state=checked]/casilla:[stroke-dashoffset:0]"
        />
        <path
          d="M3 6h6"
          className="opacity-0 group-data-[state=indeterminate]/casilla:opacity-100"
        />
      </svg>
    </Checkbox.Root>
  );
}

export function Interruptor({ className, ...props }: ComponentProps<typeof Switch.Root>) {
  return (
    <Switch.Root
      className={cn(
        'group/interruptor relative inline-flex h-4.5 w-8 shrink-0 items-center rounded-pildora border',
        'border-linea-fuerte bg-lavado-3 p-px',
        'transition-[background-color,border-color] duration-(--t-estado) ease-salida',
        'hover:not-disabled:border-linea-hover',
        'data-[state=checked]:border-transparent data-[state=checked]:bg-acento-relleno',
        'disabled:cursor-not-allowed disabled:opacity-45',
        className,
      )}
      {...props}
    >
      <Switch.Thumb
        className={cn(
          'pointer-events-none block size-3.5 rounded-pildora bg-interruptor-pulgar shadow-control',
          'transition-[translate,background-color] duration-(--t-estado) ease-salida',
          'data-[state=checked]:translate-x-3.5 data-[state=checked]:bg-sobre-acento',
          'ring-1 ring-interruptor-borde',
        )}
      />
    </Switch.Root>
  );
}
