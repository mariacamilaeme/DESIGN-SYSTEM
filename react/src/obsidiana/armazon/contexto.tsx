import { type ComponentProps, createContext, type MouseEvent, use } from 'react';

/** Acciones globales del armazón, disponibles para cualquier pantalla dentro de él. */
export interface AccionesArmazon {
  abrirPaleta: () => void;
  alternarLateral: () => void;
  lateralPlegada: boolean;
  /** Navega a una ruta con el enrutador de la herramienta. */
  navegar: (ruta: string) => void;
  /** Dirección real de una ruta, para el atributo href ('#/pedidos' con enrutado por hash). */
  hrefDe: (ruta: string) => string;
  rutaActual: string;
}

export const ContextoArmazon = createContext<AccionesArmazon | null>(null);

export function useArmazon(): AccionesArmazon {
  const ctx = use(ContextoArmazon);
  if (!ctx) throw new Error('useArmazon debe usarse dentro de <Armazon>');
  return ctx;
}

/**
 * Enlace interno: un <a href> real (abrir en otra pestaña, copiar dirección) que navega con el
 * enrutador de la herramienta en un clic normal. Sirve con cualquier enrutador: el armazón
 * recibe `navegar` y `hrefDe`.
 */
export function Enlace({
  ruta,
  onClick,
  ...props
}: Omit<ComponentProps<'a'>, 'href'> & { ruta: string }) {
  const { navegar, hrefDe } = useArmazon();
  return (
    <a
      href={hrefDe(ruta)}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navegar(ruta);
      }}
      {...props}
    />
  );
}

/** ¿La ruta actual pertenece a este destino? '/' solo con la ruta exacta. */
export function rutaCoincide(destino: string, ruta: string): boolean {
  if (destino === '/') return ruta === '/' || ruta === '';
  return ruta === destino || ruta.startsWith(`${destino}/`);
}
