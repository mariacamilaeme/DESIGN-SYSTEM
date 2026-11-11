import { IconoAlerta } from '../iconos';
import { cn } from '../lib/cn';
import { AlertDialog } from 'radix-ui';
import { type ReactNode, useRef } from 'react';
import { Boton, type EstadoAccion } from './boton';

/*
 * Confirmación (alert dialog). No se cierra al pulsar fuera: hay que elegir.
 * El foco empieza en "Cancelar" para que Enter nunca confirme una acción destructiva por descuido.
 */

export interface PropsDialogoAlerta {
  abierto: boolean;
  onAbiertoCambio: (abierto: boolean) => void;
  titulo: ReactNode;
  descripcion?: ReactNode;
  /** Contenido adicional entre la descripción y los botones. */
  children?: ReactNode;
  textoConfirmar: string;
  textoCancelar?: string;
  onConfirmar: () => void;
  peligro?: boolean;
  estado?: EstadoAccion;
  /** Desactiva el botón de confirmar (por ejemplo, mientras se valida). */
  confirmarDeshabilitado?: boolean;
}

export function DialogoAlerta({
  abierto,
  onAbiertoCambio,
  titulo,
  descripcion,
  children,
  textoConfirmar,
  textoCancelar = 'Cancelar',
  onConfirmar,
  peligro,
  estado = 'reposo',
  confirmarDeshabilitado,
}: PropsDialogoAlerta) {
  // Sin disparador de Radix, al cerrar el foco caía en <body>: vuelve al control que lo abrió.
  const anterior = useRef<HTMLElement | null>(null);
  return (
    <AlertDialog.Root open={abierto} onOpenChange={onAbiertoCambio}>
      <AlertDialog.Portal>
        {/*
         * Velo propio en lugar de AlertDialog.Overlay, como en la paleta de comandos: el de Radix
         * monta react-remove-scroll, que inserta y retira una hoja de estilos al abrir y al cerrar
         * y obliga a recalcular el estilo de toda la página (unos 80 ms cada vez con el Panel
         * abierto). El cuerpo no se desplaza (lo hace <main>) y el diálogo no se cierra al pulsar
         * fuera, así que no hace falta. `data-state` mantiene la animación de entrada y salida.
         */}
        <div
          aria-hidden
          data-state={abierto ? 'open' : 'closed'}
          className="oscurecer-modal anim-oscurecer pointer-events-auto fixed inset-0 z-50"
        />
        <AlertDialog.Content
          onOpenAutoFocus={() => {
            anterior.current =
              document.activeElement instanceof HTMLElement ? document.activeElement : null;
          }}
          onCloseAutoFocus={(e) => {
            const el = anterior.current;
            if (el?.isConnected) {
              e.preventDefault();
              el.focus({ preventScroll: true });
            }
          }}
          className={cn(
            'flotante anim-ventana fixed top-1/2 left-1/2 z-50 flex w-(--ancho-dialogo) -translate-x-1/2 -translate-y-1/2',
            'flex-col rounded-ventana outline-none',
          )}
        >
          <div className="flex gap-4 px-6 pt-6 pb-5">
            <span
              className={cn(
                'grid size-9 shrink-0 place-items-center rounded-interno',
                peligro ? 'bg-rojo/12 text-rojo-texto' : 'bg-acento-suave text-acento-texto',
              )}
            >
              <IconoAlerta tamano={18} />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-1">
              <AlertDialog.Title className="text-titulo-tarjeta text-texto-1">
                {titulo}
              </AlertDialog.Title>
              {descripcion ? (
                <AlertDialog.Description className="text-cuerpo text-texto-2">
                  {descripcion}
                </AlertDialog.Description>
              ) : (
                <AlertDialog.Description className="solo-lector">{titulo}</AlertDialog.Description>
              )}
              {children ? <div className="pt-2">{children}</div> : null}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 rounded-b-ventana border-t border-linea bg-lavado px-6 py-3.5">
            <AlertDialog.Cancel asChild>
              <Boton variante="secundario" disabled={estado === 'cargando'}>
                {textoCancelar}
              </Boton>
            </AlertDialog.Cancel>
            <Boton
              variante={peligro ? 'destructivo' : 'primario'}
              estado={estado}
              disabled={confirmarDeshabilitado}
              onClick={onConfirmar}
            >
              {textoConfirmar}
            </Boton>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
