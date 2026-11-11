import { cn } from '../lib/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type { ComponentProps, ReactNode } from 'react';

/*
 * Botón de Obsidiana. Cuatro variantes, tres tamaños y tres estados de acción
 * (reposo, cargando, listo) que no cambian el ancho: la cara en reposo conserva su espacio y las
 * caras de progreso y confirmación se superponen.
 */

export const variantesBoton = cva(
  [
    'relative inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-medium',
    'rounded-control text-cuerpo',
    'transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-(--t-hover) ease-salida',
    'active:not-disabled:scale-[0.98]',
    'disabled:cursor-not-allowed disabled:opacity-45',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento',
  ],
  {
    variants: {
      variante: {
        primario: [
          'bg-acento-relleno text-sobre-acento shadow-boton-acento',
          'hover:not-disabled:bg-acento-relleno-hover',
        ],
        secundario: [
          'border border-linea-fuerte bg-boton-2 text-texto-1 shadow-control',
          'hover:not-disabled:border-linea-hover hover:not-disabled:bg-boton-2-hover',
        ],
        fantasma: [
          'text-texto-2',
          'hover:not-disabled:bg-lavado-2 hover:not-disabled:text-texto-1',
          'data-[state=open]:bg-lavado-2 data-[state=open]:text-texto-1',
        ],
        destructivo: [
          'bg-rojo-relleno text-sobre-acento shadow-boton-acento',
          'hover:not-disabled:bg-rojo-relleno-hover',
        ],
        'destructivo-suave': [
          'border border-linea-fuerte bg-boton-2 text-rojo-texto shadow-control',
          'hover:not-disabled:border-rojo/40 hover:not-disabled:bg-rojo/10',
        ],
      },
      tamano: {
        sm: 'h-control-compacto gap-1.5 px-2.5 text-etiqueta',
        md: 'h-control gap-2 px-3',
        lg: 'h-9 gap-2 px-4',
      },
    },
    defaultVariants: { variante: 'secundario', tamano: 'md' },
  },
);

export type EstadoAccion = 'reposo' | 'cargando' | 'listo';

export interface PropsBoton extends ComponentProps<'button'>, VariantProps<typeof variantesBoton> {
  asChild?: boolean;
  /** Estado de una acción asíncrona. El ancho del botón no cambia entre estados. */
  estado?: EstadoAccion;
  /** Texto de la cara "listo". Por defecto, "Listo". */
  textoListo?: ReactNode;
  /** Texto de la cara "cargando". Por defecto, el mismo contenido atenuado con un indicador. */
  textoCargando?: ReactNode;
}

export function Boton({
  className,
  variante,
  tamano,
  asChild = false,
  estado = 'reposo',
  textoListo = 'Listo',
  textoCargando,
  children,
  disabled,
  ...props
}: PropsBoton) {
  if (asChild) {
    return (
      <Slot.Root className={cn(variantesBoton({ variante, tamano }), className)} {...props}>
        {children}
      </Slot.Root>
    );
  }

  const ocupado = estado !== 'reposo';
  return (
    <button
      type="button"
      data-estado={estado}
      aria-busy={estado === 'cargando' || undefined}
      disabled={disabled || estado === 'cargando'}
      className={cn(
        variantesBoton({ variante, tamano }),
        estado === 'cargando' && 'disabled:opacity-100 disabled:cursor-progress',
        className,
      )}
      {...props}
    >
      {/* Las tres caras ocupan la misma celda: el ancho es el de la más ancha y nunca cambia. */}
      <span className="grid items-center justify-items-center gap-[inherit]">
        <span
          className={cn(
            'col-start-1 row-start-1 inline-flex items-center justify-center gap-[inherit]',
            'transition-[opacity,translate] duration-(--t-estado) ease-salida',
            ocupado && '-translate-y-1.5 opacity-0',
          )}
        >
          {children}
        </span>
        <span
          aria-hidden={estado !== 'cargando'}
          className={cn(
            'pointer-events-none col-start-1 row-start-1 inline-flex items-center justify-center gap-2',
            'transition-[opacity,translate] duration-(--t-estado) ease-salida',
            estado === 'cargando' ? 'opacity-100' : 'translate-y-1.5 opacity-0',
          )}
        >
          <Indicador />
          {textoCargando ? <span>{textoCargando}</span> : null}
        </span>
        <span
          aria-hidden={estado !== 'listo'}
          className={cn(
            'pointer-events-none col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5',
            'transition-[opacity,translate] duration-(--t-estado) ease-salida',
            estado === 'listo' ? 'opacity-100' : 'translate-y-1.5 opacity-0',
          )}
        >
          <svg
            viewBox="0 0 24 24"
            width={16}
            height={16}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path
              d="M5 12.5 10 17.5 19 7"
              pathLength={1}
              strokeDasharray="1"
              className="transition-[stroke-dashoffset] delay-75 duration-300 ease-salida"
              style={{ strokeDashoffset: estado === 'listo' ? 0 : 1 }}
            />
          </svg>
          <span>{textoListo}</span>
        </span>
      </span>
    </button>
  );
}

/** Indicador de progreso circular, del tamaño de un icono pequeño. */
export function Indicador({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-block size-3.5 animate-[girar_700ms_linear_infinite] rounded-full border-[1.5px] border-current border-t-transparent opacity-80',
        className,
      )}
    />
  );
}

export const variantesBotonIcono = cva(
  [
    'relative inline-grid shrink-0 place-items-center rounded-control text-texto-2',
    'transition-[background-color,color,transform] duration-(--t-hover) ease-salida',
    'hover:not-disabled:bg-lavado-2 hover:not-disabled:text-texto-1 active:not-disabled:scale-[0.96]',
    'data-[state=open]:bg-lavado-2 data-[state=open]:text-texto-1',
    'disabled:cursor-not-allowed disabled:opacity-40',
  ],
  {
    variants: {
      tamano: { sm: 'size-7', md: 'size-8', lg: 'size-9' },
      variante: {
        fantasma: '',
        borde: 'border border-linea-fuerte bg-boton-2 shadow-control',
      },
    },
    defaultVariants: { tamano: 'md', variante: 'fantasma' },
  },
);

export interface PropsBotonIcono
  extends Omit<ComponentProps<'button'>, 'aria-label'>,
    VariantProps<typeof variantesBotonIcono> {
  /** Nombre accesible obligatorio: un botón de solo icono no tiene texto visible. */
  etiqueta: string;
  asChild?: boolean;
}

export function BotonIcono({
  etiqueta,
  className,
  tamano,
  variante,
  asChild,
  ...props
}: PropsBotonIcono) {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp
      type={asChild ? undefined : 'button'}
      aria-label={etiqueta}
      className={cn(variantesBotonIcono({ tamano, variante }), className)}
      {...props}
    />
  );
}
