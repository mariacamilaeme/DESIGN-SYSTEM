import type { ReactNode } from 'react';
import { type FormaGlifo, GlifoEstado } from '../iconos/glifos';
import { cn } from '../lib/cn';

/*
 * Píldora de estado (DISENO.md › Píldora de estado): forma más etiqueta, distinguible sin
 * depender del color. Cada estado de una herramienta se describe una vez con su forma, su tono y
 * su etiqueta (y, si hace falta, una etiqueta corta para tablas densas):
 *
 *   const ESTADOS_PEDIDO = definirEstados({
 *     pendiente: { forma: 'anillo', tono: 'ambar', etiqueta: 'Pendiente de pago', corta: 'Pdte. pago' },
 *     ...
 *   });
 *   <PildoraEstado estado={ESTADOS_PEDIDO.pendiente} />
 *   <PildoraEstado estado={ESTADOS_PEDIDO.pendiente} corta />   // "Pdte. pago", título completo
 *
 * O directamente con tono y forma: <PildoraEstado tono="verde" forma="lleno">Aprobada</PildoraEstado>.
 * Regla: dentro de un mismo juego, una forma distinta por estado.
 */

export type TonoEstado = 'acento' | 'vivo' | 'ambar' | 'rojo' | 'verde' | 'gris';

export interface AparienciaEstado {
  forma: FormaGlifo;
  tono: TonoEstado;
  etiqueta: string;
  /** Etiqueta abreviada para tablas densas; el texto completo queda como título. */
  corta?: string;
  /** Pulso mínimo del glifo: solo para lo que está ocurriendo ahora (el único bucle permitido). */
  pulso?: boolean;
}

/** Declara un juego de estados conservando sus claves para el autocompletado. */
export function definirEstados<K extends string>(
  estados: Record<K, AparienciaEstado>,
): Readonly<Record<K, AparienciaEstado>> {
  return estados;
}

/**
 * Juego genérico de ejemplo (el mismo lenguaje de formas de la herramienta original):
 * anillo ámbar, medio círculo azul, rombo vivo, círculo verde y guion gris. El pulso se pide
 * con `pulso` solo donde haya una sola cosa en curso que destacar, nunca en cada fila de una tabla.
 */
export const ESTADOS_EJEMPLO = definirEstados({
  pendiente: { forma: 'anillo', tono: 'ambar', etiqueta: 'Pendiente de pago', corta: 'Pdte. pago' },
  preparacion: { forma: 'medio', tono: 'acento', etiqueta: 'En preparación' },
  camino: { forma: 'rombo', tono: 'vivo', etiqueta: 'En camino' },
  entregado: { forma: 'lleno', tono: 'verde', etiqueta: 'Entregado' },
  cancelado: { forma: 'guion', tono: 'gris', etiqueta: 'Cancelado' },
});

export type EstadoEjemplo = keyof typeof ESTADOS_EJEMPLO;

/** Clases de cada tono: fondo al 12 %, texto con contraste AA y glifo en el color pleno. */
export const CLASES_TONO: Record<TonoEstado, { fondo: string; texto: string; glifo: string }> = {
  acento: { fondo: 'bg-acento/12', texto: 'text-acento-texto', glifo: 'text-acento' },
  vivo: { fondo: 'bg-vivo/12', texto: 'text-vivo-texto', glifo: 'text-vivo' },
  ambar: { fondo: 'bg-ambar/12', texto: 'text-ambar-texto', glifo: 'text-ambar' },
  rojo: { fondo: 'bg-rojo/12', texto: 'text-rojo-texto', glifo: 'text-rojo' },
  verde: { fondo: 'bg-verde/12', texto: 'text-verde-texto', glifo: 'text-verde' },
  gris: { fondo: 'bg-gris-estado/12', texto: 'text-gris-texto', glifo: 'text-gris-estado' },
};

export type PropsPildoraEstado =
  | {
      /** Estado de un juego declarado con `definirEstados`: forma, tono y etiqueta. */
      estado: AparienciaEstado;
      /** Muestra la etiqueta corta (si existe) y deja la completa como título. */
      corta?: boolean;
      tono?: never;
      forma?: never;
      /** Sustituye la etiqueta del estado. */
      children?: ReactNode;
      pulso?: boolean;
      className?: string;
    }
  | {
      estado?: never;
      corta?: never;
      tono: TonoEstado;
      forma?: FormaGlifo;
      children: ReactNode;
      pulso?: boolean;
      className?: string;
    };

export function PildoraEstado(props: PropsPildoraEstado) {
  const base = props.estado ?? null;
  const tono = base?.tono ?? props.tono ?? 'gris';
  const forma = base?.forma ?? props.forma ?? 'punto';
  const usarCorta = Boolean(props.corta && base?.corta);
  const etiqueta = props.children ?? (usarCorta ? base?.corta : base?.etiqueta);
  const pulso = props.pulso ?? base?.pulso ?? false;
  const c = CLASES_TONO[tono];
  return (
    <span
      title={usarCorta ? base?.etiqueta : undefined}
      className={cn(
        'inline-flex h-5.5 items-center gap-1.5 rounded-pildora pr-2.5 pl-2 text-etiqueta font-medium whitespace-nowrap',
        c.fondo,
        c.texto,
        props.className,
      )}
    >
      <GlifoEstado forma={forma} className={cn(c.glifo, pulso && 'pulso-vivo')} />
      {usarCorta ? (
        <>
          <span aria-hidden>{etiqueta}</span>
          <span className="solo-lector">{base?.etiqueta}</span>
        </>
      ) : (
        etiqueta
      )}
    </span>
  );
}
