import { IconoCerrar } from '../iconos';
import { cn } from '../lib/cn';
import { RESORTE_INDICADOR } from '../lib/movimiento';
import { motion } from 'motion/react';
import { Dialog, Tabs } from 'radix-ui';
import { type ReactNode, useId, useState } from 'react';
import { esDeAvisos } from './avisos';
import { BotonIcono } from './boton';
import { estiloOrigen } from './dialogo';
import { DialogoAlerta } from './dialogo-alerta';
import { Tecla } from './tecla';

/*
 * Ventana de detalle (DISENO.md › Componentes clave): centrada, 920 px, carril de pestañas a la
 * izquierda con indicador que se desliza, bloque de resumen fijo debajo del carril, contenido a
 * la derecha y pie con "Cancelar" y la acción principal. Nace del punto de origen (la fila que se
 * pulsó). Con cambios sin guardar pide confirmación antes de cerrarse.
 */

export interface PestanaVentana {
  id: string;
  etiqueta: string;
  icono?: ReactNode;
  /** Dato pequeño a la derecha de la pestaña (por ejemplo "3/7"). */
  cuenta?: ReactNode;
  contenido: ReactNode;
}

export interface DatoResumen {
  etiqueta: string;
  valor: ReactNode;
}

export interface PropsVentana {
  abierta: boolean;
  onAbiertaCambio: (abierta: boolean) => void;
  titulo: ReactNode;
  /** Línea superior: código o referencia y estado. */
  antetitulo?: ReactNode;
  /** Acciones a la derecha del título, antes del botón de cerrar. */
  accionesEncabezado?: ReactNode;
  pestanas: readonly PestanaVentana[];
  pestana?: string;
  onPestana?: (id: string) => void;
  /** Bloque de resumen fijo bajo el carril. */
  resumen?: readonly DatoResumen[];
  /** Pie: acciones (normalmente "Cancelar" y la acción principal). */
  pie?: ReactNode;
  /** Nota a la izquierda del pie. Por defecto, los atajos para cerrar. */
  notaPie?: ReactNode;
  origen?: { x: number; y: number } | null;
  /** Hay cambios sin guardar: cerrar pide confirmación. */
  sucia?: boolean;
  descripcion?: string;
}

export function Ventana({
  abierta,
  onAbiertaCambio,
  titulo,
  antetitulo,
  accionesEncabezado,
  pestanas,
  pestana,
  onPestana,
  resumen,
  pie,
  notaPie,
  origen,
  sucia,
  descripcion,
}: PropsVentana) {
  const [interna, setInterna] = useState(pestanas[0]?.id ?? '');
  const activa = pestana ?? interna;
  const [confirmando, setConfirmando] = useState(false);
  const grupo = useId();

  const pedirCierre = (abrir: boolean) => {
    if (!abrir && sucia) {
      setConfirmando(true);
      return;
    }
    onAbiertaCambio(abrir);
  };

  return (
    <>
      <Dialog.Root open={abierta} onOpenChange={pedirCierre}>
        <Dialog.Portal>
          <Dialog.Overlay className="oscurecer-modal anim-oscurecer fixed inset-0 z-50" />
          <Dialog.Content
            style={estiloOrigen(origen)}
            // El foco inicial va a la ventana, no al botón de cerrar (que es el primer control y
            // se vería con el anillo de foco). Tab lleva al primer control; Escape sigue cerrando.
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              (e.currentTarget as HTMLElement | null)?.focus();
            }}
            // Pulsar un aviso (su botón "Deshacer") no cierra la ventana.
            onInteractOutside={(e) => {
              if (esDeAvisos(e.target)) e.preventDefault();
            }}
            className={cn(
              'flotante anim-ventana fixed top-1/2 left-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 flex-col',
              'h-[min(var(--alto-ventana),calc(100vh-var(--spacing)*12))] w-(--ancho-ventana) rounded-ventana outline-none',
            )}
          >
            <div className="flex flex-none items-start gap-4 border-b border-linea py-4.5 pr-4 pl-6">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                {antetitulo ? (
                  <div className="flex items-center gap-2 text-etiqueta text-texto-3">
                    {antetitulo}
                  </div>
                ) : null}
                <Dialog.Title className="truncate text-titulo-ventana text-texto-1">
                  {titulo}
                </Dialog.Title>
                <Dialog.Description className="solo-lector">
                  {descripcion ?? 'Ventana de detalle'}
                </Dialog.Description>
              </div>
              <div className="flex flex-none items-center gap-1">
                {accionesEncabezado}
                <Dialog.Close asChild>
                  <BotonIcono etiqueta="Cerrar">
                    <IconoCerrar tamano={16} />
                  </BotonIcono>
                </Dialog.Close>
              </div>
            </div>

            <Tabs.Root
              orientation="vertical"
              value={activa}
              onValueChange={(v) => {
                setInterna(v);
                onPestana?.(v);
              }}
              className="grid min-h-0 flex-1 grid-cols-[var(--ancho-carril)_minmax(0,1fr)]"
            >
              <div className="flex min-h-0 flex-col border-r border-linea bg-carril">
                <Tabs.List
                  aria-label="Secciones"
                  className="flex flex-col gap-0.5 overflow-auto px-3 pt-4"
                >
                  {pestanas.map((p) => {
                    const esActiva = p.id === activa;
                    return (
                      <Tabs.Trigger
                        key={p.id}
                        value={p.id}
                        className={cn(
                          'group relative flex h-8.5 items-center gap-2.5 rounded-control px-2.5 text-left font-medium',
                          'text-texto-2 transition-colors duration-(--t-hover) hover:text-texto-1',
                          'data-[state=active]:text-texto-1 focus-visible:outline-offset-0',
                        )}
                      >
                        {esActiva ? (
                          <motion.span
                            layoutId={`carril-${grupo}`}
                            transition={RESORTE_INDICADOR}
                            aria-hidden
                            className="absolute inset-0 rounded-control bg-carril-indicador shadow-carril-indicador"
                          >
                            <span className="absolute top-2 bottom-2 left-0 w-0.5 rounded-pildora bg-acento" />
                          </motion.span>
                        ) : null}
                        <span
                          className={cn(
                            'relative flex text-texto-3 transition-colors duration-(--t-hover)',
                            esActiva && 'text-acento',
                          )}
                        >
                          {p.icono}
                        </span>
                        <span className="relative truncate">{p.etiqueta}</span>
                        {p.cuenta !== undefined ? (
                          <span className="cifras relative ml-auto text-mini text-texto-3">
                            {p.cuenta}
                          </span>
                        ) : null}
                      </Tabs.Trigger>
                    );
                  })}
                </Tabs.List>
                {resumen && resumen.length > 0 ? (
                  <dl className="mx-3 mt-auto flex flex-col gap-2.5 border-t border-linea px-2.5 pt-3.5 pb-4">
                    {resumen.map((r) => (
                      <div key={r.etiqueta} className="flex flex-col">
                        <dt className="text-etiqueta text-texto-3">{r.etiqueta}</dt>
                        <dd className="cifras truncate font-medium text-texto-1">{r.valor}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
              <div className="min-h-0 overflow-auto">
                {pestanas.map((p) => (
                  <Tabs.Content key={p.id} value={p.id} className="px-6 pt-5.5 pb-6.5 outline-none">
                    {p.contenido}
                  </Tabs.Content>
                ))}
              </div>
            </Tabs.Root>

            {pie ? (
              <div className="flex flex-none items-center gap-2 rounded-b-ventana border-t border-linea bg-lavado px-6 py-3.5">
                <div className="flex items-center gap-1.5 text-etiqueta text-texto-3">
                  {notaPie ?? (
                    <>
                      <Tecla tamano="sm">Esc</Tecla> para cerrar
                    </>
                  )}
                </div>
                <div className="ml-auto flex items-center gap-2">{pie}</div>
              </div>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <DialogoAlerta
        abierto={confirmando}
        onAbiertoCambio={setConfirmando}
        titulo="¿Descartar los cambios?"
        descripcion="Hay cambios sin guardar en esta ventana. Si la cierras ahora, se perderán."
        textoConfirmar="Descartar cambios"
        textoCancelar="Seguir editando"
        peligro
        onConfirmar={() => {
          setConfirmando(false);
          onAbiertaCambio(false);
        }}
      />
    </>
  );
}
