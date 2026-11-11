import { cn } from '../lib/cn';
import type { ComponentProps, ReactNode } from 'react';

/*
 * Página de un módulo: márgenes del área de trabajo y encabezado (título 22/28, línea secundaria
 * y acciones a la derecha). Herramienta densa: sin márgenes de marketing.
 */

export function Pagina({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-(--ancho-trabajo-max) px-8 pt-7 pb-14', className)}
      {...props}
    />
  );
}

export function EncabezadoPagina({
  titulo,
  subtitulo,
  acciones,
  className,
}: {
  titulo: ReactNode;
  subtitulo?: ReactNode;
  acciones?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn('mb-6 flex min-h-10 items-end gap-4', className)}>
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="truncate text-titulo text-texto-1">{titulo}</h1>
        {subtitulo ? <p className="text-cuerpo text-texto-3">{subtitulo}</p> : null}
      </div>
      {acciones ? <div className="ml-auto flex items-center gap-2">{acciones}</div> : null}
    </header>
  );
}
