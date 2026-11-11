import { cn } from '../lib/cn';
import type { ComponentProps, ReactNode } from 'react';

/*
 * Tarjeta: la receta de superficie de Obsidiana (sup-1 + degradado vertical casi imperceptible +
 * borde de 1 px + realce interior en el canto superior; en claro, sombra suave). Radio 14.
 * `filo` enciende el filo de luz (seleccionada, enfocada o activa).
 */

export interface PropsTarjeta extends ComponentProps<'section'> {
  filo?: boolean;
  /** Reacciona al cursor (tarjetas que se pueden abrir). */
  interactiva?: boolean;
}

export function Tarjeta({ className, filo, interactiva, ...props }: PropsTarjeta) {
  return (
    <section
      data-filo={filo ? 'encendido' : undefined}
      className={cn(
        'superficie filo-luz relative min-w-0',
        interactiva &&
          'transition-[border-color,background-color] duration-(--t-estado) ease-salida hover:border-linea-fuerte',
        className,
      )}
      {...props}
    />
  );
}

export interface PropsEncabezadoTarjeta {
  titulo: ReactNode;
  icono?: ReactNode;
  /** Texto atenuado a la derecha ("6 travesías"). */
  meta?: ReactNode;
  /** Controles a la derecha (botones, segmentado). */
  acciones?: ReactNode;
  className?: string;
  /** Nivel del título para la jerarquía del documento. */
  nivel?: 2 | 3;
}

export function EncabezadoTarjeta({
  titulo,
  icono,
  meta,
  acciones,
  className,
  nivel = 2,
}: PropsEncabezadoTarjeta) {
  const Titulo = nivel === 2 ? 'h2' : 'h3';
  return (
    <header
      className={cn(
        'flex h-12 flex-none items-center gap-2.5 border-b border-linea px-4.5',
        className,
      )}
    >
      {icono ? <span className="flex text-texto-3">{icono}</span> : null}
      <Titulo className="truncate text-titulo-tarjeta text-texto-1">{titulo}</Titulo>
      {meta || acciones ? (
        <div className="ml-auto flex items-center gap-3 text-etiqueta text-texto-3">
          {meta ? <span className="cifras whitespace-nowrap">{meta}</span> : null}
          {acciones}
        </div>
      ) : null}
    </header>
  );
}

export function CuerpoTarjeta({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('p-4.5', className)} {...props} />;
}
