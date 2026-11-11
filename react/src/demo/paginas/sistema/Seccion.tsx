import { cn } from '../../../obsidiana';
import type { ReactNode } from 'react';

/** Sección de la página /sistema: ancla, título y descripción breve. */
export function Seccion({
  id,
  titulo,
  descripcion,
  children,
  className,
}: {
  id: string;
  titulo: string;
  descripcion?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}-titulo`}
      className={cn('scroll-mt-16 focus-visible:outline-none', className)}
    >
      <div className="mb-4 flex flex-col gap-1">
        <h2 id={`${id}-titulo`} className="text-cifra-2 text-texto-1">
          {titulo}
        </h2>
        {descripcion ? <p className="max-w-3xl text-texto-2">{descripcion}</p> : null}
      </div>
      {children}
    </section>
  );
}

/** Bloque con etiqueta pequeña dentro de una tarjeta de muestra. */
export function Muestra({
  etiqueta,
  children,
  className,
}: {
  etiqueta: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-3', className)}>
      <span className="text-etiqueta font-medium text-texto-3">{etiqueta}</span>
      {children}
    </div>
  );
}

/** Fila de estados con su nombre debajo. */
export function Estado({ nombre, children }: { nombre: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-2">
      {children}
      <span className="text-mini text-texto-3">{nombre}</span>
    </div>
  );
}
