import { GlifoEstado } from '../iconos/glifos';
import { cn } from '../lib/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { ScrollArea, Separator } from 'radix-ui';
import type { ComponentProps, ReactNode } from 'react';

/* Primitivas pequeñas: Insignia, Esqueleto, Separador, AreaDesplazable. */

export const variantesInsignia = cva(
  'inline-flex h-5.5 shrink-0 items-center gap-1.5 rounded-pildora px-2 text-etiqueta font-medium whitespace-nowrap',
  {
    variants: {
      tono: {
        neutro: 'bg-lavado-2 text-texto-2',
        acento: 'bg-acento-suave text-acento-texto',
        vivo: 'bg-vivo/12 text-vivo-texto',
        ambar: 'bg-ambar/12 text-ambar-texto',
        rojo: 'bg-rojo/12 text-rojo-texto',
        verde: 'bg-verde/12 text-verde-texto',
        gris: 'bg-gris-estado/12 text-gris-texto',
        borde: 'border border-linea-fuerte text-texto-2',
      },
    },
    defaultVariants: { tono: 'neutro' },
  },
);

export interface PropsInsignia
  extends ComponentProps<'span'>,
    VariantProps<typeof variantesInsignia> {
  /** Muestra un punto del color del tono antes del texto. */
  punto?: boolean;
}

export function Insignia({ className, tono, punto, children, ...props }: PropsInsignia) {
  return (
    <span className={cn(variantesInsignia({ tono }), className)} {...props}>
      {punto ? <GlifoEstado forma="punto" className="size-2" /> : null}
      {children}
    </span>
  );
}

/** Esqueleto de carga con la forma del contenido real y un brillo que lo recorre. */
export function Esqueleto({ className, ...props }: ComponentProps<'span'>) {
  return <span aria-hidden className={cn('esqueleto block h-2.5', className)} {...props} />;
}

export function Separador({
  className,
  orientation = 'horizontal',
  ...props
}: ComponentProps<typeof Separator.Root>) {
  return (
    <Separator.Root
      orientation={orientation}
      className={cn(
        'shrink-0 bg-linea',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  );
}

export interface PropsAreaDesplazable extends ComponentProps<typeof ScrollArea.Root> {
  /** Clases del viewport (por ejemplo, la altura máxima). */
  claseVista?: string;
  horizontal?: boolean;
  children: ReactNode;
}

/** Área con barras de desplazamiento propias, finas y que aparecen al pasar el cursor. */
export function AreaDesplazable({
  className,
  claseVista,
  horizontal,
  children,
  ...props
}: PropsAreaDesplazable) {
  return (
    <ScrollArea.Root type="hover" className={cn('relative overflow-hidden', className)} {...props}>
      <ScrollArea.Viewport className={cn('size-full rounded-[inherit]', claseVista)}>
        {children}
      </ScrollArea.Viewport>
      <Barra orientacion="vertical" />
      {horizontal ? <Barra orientacion="horizontal" /> : null}
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
}

function Barra({ orientacion }: { orientacion: 'vertical' | 'horizontal' }) {
  return (
    <ScrollArea.Scrollbar
      orientation={orientacion}
      className={cn(
        'flex touch-none p-0.5 select-none transition-opacity duration-(--t-estado)',
        'data-[state=hidden]:opacity-0',
        orientacion === 'vertical' ? 'h-full w-2.5' : 'h-2.5 flex-col',
      )}
    >
      <ScrollArea.Thumb className="relative flex-1 rounded-pildora bg-(--barra-desplazamiento) hover:bg-(--barra-desplazamiento-hover)" />
    </ScrollArea.Scrollbar>
  );
}
