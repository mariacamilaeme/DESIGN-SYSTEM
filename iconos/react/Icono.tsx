/*
 * Obsidiana · base de los iconos en React.
 * Generado por iconos/fuente/generar.mjs. No editar a mano.
 *
 * Retícula de 24 px, trazo de 1.5 px con extremos y uniones redondeados, relleno al 12 % en las
 * formas cerradas (duotono contenido) y `currentColor`, de modo que el icono toma el color del
 * texto que lo rodea. Sin `titulo` el icono es decorativo (`aria-hidden`).
 * Las microanimaciones necesitan la hoja iconos.css (variables --ia-* durante el hover).
 */
import type { CSSProperties, ReactNode, SVGProps } from 'react';

export type TamanoIcono = 12 | 14 | 16 | 18 | 20 | 24 | 32 | 48;

export interface PropsIcono extends Omit<SVGProps<SVGSVGElement>, 'children' | 'ref'> {
  /** Lado en píxeles. Por defecto 16. */
  tamano?: TamanoIcono;
  /** Texto accesible. Si se omite, el icono se oculta a los lectores de pantalla. */
  titulo?: string;
}

export type ComponenteIcono = ((props: PropsIcono) => ReactNode) & { nombreIcono: string };

/** Relleno de las formas cerradas: 12 % del color actual. */
export const RELLENO = { fill: 'currentColor', fillOpacity: 0.12 } as const;

/**
 * Animación que se activa al pasar el cursor por el control que contiene el icono.
 * Las variables `--ia-*` se definen en iconos.css solo durante el hover (o con .icono-reproducir).
 */
export function anim(nombre: string, origen?: string): CSSProperties {
  return {
    animation: `var(--ia-${nombre}, none)`,
    ...(origen ? { transformOrigin: origen } : {}),
  };
}

function aPascal(nombre: string): string {
  return nombre
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

export function crearIcono(nombre: string, contenido: ReactNode): ComponenteIcono {
  const Icono = ({ tamano = 16, titulo, style, className, ...resto }: PropsIcono) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={tamano}
      height={tamano}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={titulo ? undefined : true}
      role={titulo ? 'img' : undefined}
      focusable="false"
      data-icono={nombre}
      className={className ? `ob-icono ${className}` : 'ob-icono'}
      style={{ flex: 'none', overflow: 'visible', ...style }}
      {...resto}
    >
      {titulo ? <title>{titulo}</title> : null}
      {contenido}
    </svg>
  );
  Icono.displayName = `Icono${aPascal(nombre)}`;
  return Object.assign(Icono, { nombreIcono: nombre });
}
