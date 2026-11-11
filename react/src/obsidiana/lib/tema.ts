import { useSyncExternalStore } from 'react';
import { CLAVES_PREFERENCIA, guardarPreferencia } from './almacen';

/*
 * Tema claro / oscuro. El script en línea de index.html fija `data-theme` en <html> antes del
 * primer pintado (sin parpadeo); aquí se lee ese atributo, se cambia y se guarda en localStorage
 * (CLAVES_PREFERENCIA.tema). El cambio usa View Transitions (fundido cruzado) cuando el
 * navegador lo permite y el usuario no pidió movimiento reducido.
 *
 * Para guardar la preferencia también en otro sitio (un servidor, unos ajustes), registra un
 * oyente con `alCambiarTema`.
 */

export type Tema = 'claro' | 'oscuro';

const oyentesTema = new Set<(tema: Tema) => void>();

function leerTema(): Tema {
  return document.documentElement.getAttribute('data-theme') === 'claro' ? 'claro' : 'oscuro';
}

function suscribir(aviso: () => void) {
  const obs = new MutationObserver(aviso);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => obs.disconnect();
}

/** Tema actual; se vuelve a pintar cuando cambia (desde cualquier sitio). */
export function useTema(): Tema {
  return useSyncExternalStore(suscribir, leerTema, () => 'oscuro');
}

export function fijarTema(tema: Tema) {
  const aplicar = () => {
    document.documentElement.setAttribute('data-theme', tema);
    guardarPreferencia(CLAVES_PREFERENCIA.tema, tema);
    for (const o of oyentesTema) o(tema);
  };
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (!reducido && typeof doc.startViewTransition === 'function') doc.startViewTransition(aplicar);
  else aplicar();
}

export function alternarTema() {
  fijarTema(leerTema() === 'claro' ? 'oscuro' : 'claro');
}

/** Avisa de cada cambio de tema (por ejemplo, para guardarlo también en un servidor). */
export function alCambiarTema(oyente: (tema: Tema) => void): () => void {
  oyentesTema.add(oyente);
  return () => {
    oyentesTema.delete(oyente);
  };
}
