import { LOCALE } from '../lib/formato';
import { cn } from '../lib/cn';
import NumberFlow, { type Format } from '@number-flow/react';
import type { ReactNode } from 'react';

/*
 * Cifra (DISENO.md › Cifra): etiqueta, valor con unidad, línea de contexto y, opcionalmente, una
 * micrográfica. El valor usa NumberFlow (600 ms al entrar y al cambiar). Las unidades y monedas
 * van a 13 px en texto-3, alineadas a la línea base de la cifra, nunca del mismo tamaño que ella.
 */

export interface PropsCifra {
  etiqueta: ReactNode;
  icono?: ReactNode;
  valor: number | null;
  /** Moneda o unidad delante de la cifra ("USD"). */
  prefijo?: string;
  /** Unidad detrás de la cifra ("t", "%", "días"). */
  unidad?: string;
  formato?: Format;
  /** Línea de contexto bajo la cifra. */
  contexto?: ReactNode;
  /** Micrográfica opcional a la derecha del valor. */
  grafica?: ReactNode;
  tamano?: 'principal' | 'secundaria';
  /** Valor a mostrar cuando `valor` es null. */
  vacio?: string;
  className?: string;
}

const FORMATO_ENTERO: Format = { maximumFractionDigits: 0 };

export function Cifra({
  etiqueta,
  icono,
  valor,
  prefijo,
  unidad,
  formato = FORMATO_ENTERO,
  contexto,
  grafica,
  tamano = 'principal',
  vacio = '—',
  className,
}: PropsCifra) {
  const principal = tamano === 'principal';
  return (
    <div className={cn('@container flex min-w-0 flex-col', className)}>
      <div className="flex min-w-0 items-center gap-2 font-medium text-texto-2">
        {icono ? <span className="flex flex-none text-texto-3">{icono}</span> : null}
        <span className="truncate">{etiqueta}</span>
      </div>
      <div className={cn('flex min-w-0 items-end gap-4', principal ? 'mt-3' : 'mt-2')}>
        <div
          className={cn(
            'cifras flex min-w-0 items-baseline gap-1.5 whitespace-nowrap text-texto-1',
            // En cajas estrechas la cifra baja un escalón para no salirse nunca de su caja.
            principal ? 'text-cifra font-medium @max-[220px]:text-cifra-2' : 'text-cifra-2',
          )}
        >
          {prefijo ? (
            <span className="text-cuerpo font-medium tracking-normal text-texto-3">{prefijo}</span>
          ) : null}
          {valor === null ? (
            <span className="text-texto-3">{vacio}</span>
          ) : (
            <NumberFlow
              value={valor}
              locales={LOCALE}
              format={formato}
              transformTiming={{ duration: 600, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
              spinTiming={{ duration: 600, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
              opacityTiming={{ duration: 300, easing: 'ease-out' }}
            />
          )}
          {unidad ? (
            <span className="text-cuerpo font-medium tracking-normal text-texto-3">{unidad}</span>
          ) : null}
        </div>
        {grafica ? <div className="mb-1 ml-auto flex-none">{grafica}</div> : null}
      </div>
      {contexto ? (
        <div
          className={cn(
            'flex min-w-0 items-center gap-1.5 text-etiqueta text-texto-3',
            principal ? 'mt-3' : 'mt-1.5',
          )}
        >
          {contexto}
        </div>
      ) : null}
    </div>
  );
}

/** Micrográfica: línea de tendencia mínima (12 puntos o menos), sin ejes. */
export function MicroLinea({
  valores,
  tono = 'acento',
  ancho = 72,
  alto = 24,
}: {
  valores: readonly number[];
  tono?: 'acento' | 'vivo' | 'ambar' | 'rojo' | 'verde';
  ancho?: number;
  alto?: number;
}) {
  if (valores.length < 2) return null;
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const rango = max - min || 1;
  const puntos = valores.map((v, i) => {
    const x = (i / (valores.length - 1)) * ancho;
    const y = alto - 2 - ((v - min) / rango) * (alto - 4);
    return [x, y] as const;
  });
  const d = puntos.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const ultimo = puntos[puntos.length - 1];
  return (
    <svg
      width={ancho}
      height={alto}
      viewBox={`0 0 ${ancho} ${alto}`}
      aria-hidden
      className="overflow-visible"
    >
      <path
        d={d}
        fill="none"
        stroke={`var(--${tono})`}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {ultimo ? <circle cx={ultimo[0]} cy={ultimo[1]} r={2} fill={`var(--${tono})`} /> : null}
    </svg>
  );
}
