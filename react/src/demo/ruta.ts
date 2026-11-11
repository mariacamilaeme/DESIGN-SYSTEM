import { useSyncExternalStore } from 'react';

/*
 * Enrutado mínimo por hash para la demo ("#/pedidos?q=altamira"). Una herramienta real puede usar
 * TanStack Router o React Router: el armazón solo necesita la ruta actual y una función navegar.
 */

function leer(): string {
  return window.location.hash.replace(/^#/, '') || '/';
}

function suscribir(aviso: () => void) {
  window.addEventListener('hashchange', aviso);
  return () => window.removeEventListener('hashchange', aviso);
}

export function useRuta() {
  const completa = useSyncExternalStore(suscribir, leer, () => '/');
  const [ruta = '/', consulta = ''] = completa.split('?');
  return { ruta: ruta || '/', parametros: new URLSearchParams(consulta), completa };
}

export function navegar(ruta: string) {
  window.location.hash = ruta;
}

export const hrefDe = (ruta: string) => `#${ruta}`;
