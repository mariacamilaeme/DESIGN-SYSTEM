import { useEffect, useSyncExternalStore } from 'react';
import { normalizarTexto } from '../lib/texto';
import type { ElementoPaleta } from './tipos';

/*
 * Búsqueda de la paleta (funciones puras) y acciones de pantalla.
 *
 * useAccionesPaleta(acciones): acciones de una pantalla que solo existen mientras está montada
 * (por ejemplo "Nuevo pedido" dentro de Pedidos). Aparecen en el grupo "Acciones" de la paleta
 * mientras el componente que las registra esté en pantalla. Pasa un arreglo estable (constante de
 * módulo o useMemo): cada arreglo nuevo vuelve a registrar.
 */

export interface ElementoIndexado {
  elemento: ElementoPaleta;
  /** Título normalizado (minúsculas, sin tildes). */
  titulo: string;
  /** Título, subtítulo y claves normalizados. */
  texto: string;
}

/** Normaliza una vez los textos de búsqueda de cada elemento. */
export function indexarPaleta(elementos: readonly ElementoPaleta[]): ElementoIndexado[] {
  return elementos.map((e) => ({
    elemento: e,
    titulo: normalizarTexto(e.titulo),
    texto: normalizarTexto([e.titulo, e.subtitulo ?? '', e.claves ?? ''].join(' ')),
  }));
}

/**
 * Coincidencias literales de un término ya normalizado (misma regla que las listas): primero los
 * títulos que empiezan por el término, luego los que lo contienen y después el resto, cada grupo
 * en su orden original. Devuelve hasta `max` elementos, el total de coincidencias y el mejor
 * rango encontrado (0, 1 o 2), que sirve para ordenar los grupos entre sí.
 */
export function filtrarPaleta(
  indice: readonly ElementoIndexado[],
  termino: string,
  max: number,
): { elementos: ElementoPaleta[]; total: number; mejor: number } {
  if (!termino) return { elementos: [], total: 0, mejor: 3 };
  const rangos: ElementoPaleta[][] = [[], [], []];
  for (const i of indice) {
    if (!i.texto.includes(termino)) continue;
    const r = i.titulo.startsWith(termino) ? 0 : i.titulo.includes(termino) ? 1 : 2;
    rangos[r]?.push(i.elemento);
  }
  const todos = rangos.flat();
  const mejor = rangos.findIndex((r) => r.length > 0);
  return { elementos: todos.slice(0, max), total: todos.length, mejor: mejor < 0 ? 3 : mejor };
}

/* ---------------------------------------------------------------- Acciones en tiempo de ejecución */

let accionesPantalla: readonly ElementoPaleta[] = [];
const oyentes = new Set<() => void>();
const registros = new Map<symbol, readonly ElementoPaleta[]>();

function publicar() {
  accionesPantalla = [...registros.values()].flat();
  for (const o of oyentes) o();
}

/** Registra acciones de la paleta mientras el componente que llama esté montado. */
export function useAccionesPaleta(acciones: readonly ElementoPaleta[]) {
  useEffect(() => {
    const clave = Symbol('acciones');
    registros.set(clave, acciones);
    publicar();
    return () => {
      registros.delete(clave);
      publicar();
    };
  }, [acciones]);
}

/** Acciones registradas por las pantallas montadas. */
export function useAccionesPantalla(): readonly ElementoPaleta[] {
  return useSyncExternalStore(
    (o) => {
      oyentes.add(o);
      return () => oyentes.delete(o);
    },
    () => accionesPantalla,
    () => accionesPantalla,
  );
}
