import { IconoCerrar } from '../iconos';
import { cn } from '../lib/cn';
import { Dialog } from 'radix-ui';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import { esDeAvisos } from './avisos';
import { BotonIcono } from './boton';

/*
 * Diálogo modal. Fondo que se oscurece y desenfoca 6 px (el único desenfoque de la herramienta);
 * la ventana pasa de escala 0.98 a 1 con fundido en 220 ms. Trampa de foco y Escape de Radix.
 */

export const Dialogo = Dialog.Root;
export const DialogoDisparador = Dialog.Trigger;
export const DialogoCerrar = Dialog.Close;

export function DialogoFondo({ className, ...props }: ComponentProps<typeof Dialog.Overlay>) {
  return (
    <Dialog.Overlay
      className={cn('oscurecer-modal anim-oscurecer fixed inset-0 z-50', className)}
      {...props}
    />
  );
}

export interface PropsDialogoContenido extends ComponentProps<typeof Dialog.Content> {
  /** Punto de la pantalla desde el que nace la ventana (por ejemplo, la fila pulsada). */
  origen?: { x: number; y: number } | null;
  /** Oculta el botón de cerrar de la esquina. */
  sinCerrar?: boolean;
  /**
   * Al abrir, el foco va a la ventana y no a su primer control (que se vería como pulsado).
   * Tab lleva al primer control. Útil cuando el primer control es una zona grande.
   */
  enfocarVentana?: boolean;
}

/** Calcula el transform-origin para que la ventana crezca desde el punto de origen. */
export function estiloOrigen(
  origen: { x: number; y: number } | null | undefined,
): CSSProperties | undefined {
  if (!origen || typeof window === 'undefined') return undefined;
  const dx = origen.x - window.innerWidth / 2;
  const dy = origen.y - window.innerHeight / 2;
  return { transformOrigin: `calc(50% + ${dx}px) calc(50% + ${dy}px)` };
}

export function DialogoContenido({
  className,
  children,
  origen,
  sinCerrar,
  enfocarVentana,
  style,
  onOpenAutoFocus,
  onPointerDownOutside,
  onInteractOutside,
  ...props
}: PropsDialogoContenido) {
  return (
    <Dialog.Portal>
      <DialogoFondo />
      <Dialog.Content
        style={{ ...estiloOrigen(origen), ...style }}
        onOpenAutoFocus={(e) => {
          onOpenAutoFocus?.(e);
          if (enfocarVentana && !e.defaultPrevented) {
            e.preventDefault();
            (e.currentTarget as HTMLElement | null)?.focus();
          }
        }}
        // Pulsar un aviso (su botón "Deshacer") no cuenta como pulsar fuera del diálogo.
        onPointerDownOutside={(e) => {
          if (esDeAvisos(e.target)) e.preventDefault();
          else onPointerDownOutside?.(e);
        }}
        onInteractOutside={(e) => {
          if (esDeAvisos(e.target)) e.preventDefault();
          else onInteractOutside?.(e);
        }}
        className={cn(
          'flotante anim-ventana fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100vh-var(--spacing)*12)] w-(--ancho-dialogo)',
          '-translate-x-1/2 -translate-y-1/2 flex-col rounded-ventana outline-none',
          className,
        )}
        {...props}
      >
        {children}
        {sinCerrar ? null : (
          <Dialog.Close asChild>
            <BotonIcono etiqueta="Cerrar" tamano="sm" className="absolute top-4 right-4">
              <IconoCerrar tamano={16} />
            </BotonIcono>
          </Dialog.Close>
        )}
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export function DialogoEncabezado({
  className,
  titulo,
  descripcion,
  children,
}: {
  className?: string;
  titulo: ReactNode;
  descripcion?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5 px-6 pt-6 pb-4 pr-14', className)}>
      <Dialog.Title className="text-titulo-ventana text-texto-1">{titulo}</Dialog.Title>
      {descripcion ? (
        <Dialog.Description className="text-cuerpo text-texto-2">{descripcion}</Dialog.Description>
      ) : (
        <Dialog.Description className="solo-lector">{titulo}</Dialog.Description>
      )}
      {children}
    </div>
  );
}

export function DialogoCuerpo({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('min-h-0 overflow-auto px-6 pb-5', className)} {...props} />;
}

export function DialogoPie({
  className,
  nota,
  children,
}: {
  className?: string;
  nota?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex flex-none items-center gap-2 rounded-b-ventana border-t border-linea bg-lavado px-6 py-3.5',
        className,
      )}
    >
      {nota ? <div className="text-etiqueta text-texto-3">{nota}</div> : null}
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </div>
  );
}
