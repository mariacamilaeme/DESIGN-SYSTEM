import { cn } from '../lib/cn';
import { Label } from 'radix-ui';
import type { ComponentProps, ReactNode } from 'react';

/** Etiqueta de un campo de formulario. */
export function Etiqueta({ className, ...props }: ComponentProps<typeof Label.Root>) {
  return (
    <Label.Root
      className={cn(
        'select-none text-etiqueta font-medium text-texto-2 peer-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export interface PropsCampo {
  etiqueta: ReactNode;
  /** id del control, para enlazar la etiqueta. */
  htmlFor?: string;
  ayuda?: ReactNode;
  error?: ReactNode;
  /** Marca opcional junto a la etiqueta ("Opcional", "Calculado"). */
  marca?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Campo de formulario: etiqueta, control, y una línea de ayuda o de error. */
export function Campo({ etiqueta, htmlFor, ayuda, error, marca, className, children }: PropsCampo) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <div className="flex items-baseline gap-2">
        <Etiqueta htmlFor={htmlFor}>{etiqueta}</Etiqueta>
        {marca ? <span className="ml-auto text-mini text-texto-3">{marca}</span> : null}
      </div>
      {children}
      {error ? (
        <p role="alert" className="text-etiqueta text-rojo-texto">
          {error}
        </p>
      ) : ayuda ? (
        <p className="text-etiqueta text-texto-3">{ayuda}</p>
      ) : null}
    </div>
  );
}
