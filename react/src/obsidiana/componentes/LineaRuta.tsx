import { cn } from '../lib/cn';
import { useReducedMotion } from 'motion/react';
import { type CSSProperties, type ReactNode, useEffect, useId, useRef, useState } from 'react';

/*
 * Línea de ruta: progreso entre dos puntos (un envío, un proceso, una entrega). Arco fino entre
 * origen y destino, tramo recorrido sólido con degradado de acento a vivo, tramo por recorrer punteado,
 * marcador en la posición estimada y una luz que viaja una sola vez por el trazo al aparecer.
 * El trazo se dibuja de 0 al progreso en 900 ms. Lo que está en curso lleva el único pulso permitido
 * (2,4 s, opacidad 0,5 a 1). Todo el movimiento es CSS o SVG nativo: una lista con decenas de
 * rutas no ejecuta JavaScript en cada cuadro.
 */

export type EstadoRuta = 'curso' | 'tarde' | 'llegado' | 'pendiente';

export interface PropsLineaRuta {
  /** Fracción recorrida, de 0 a 1. */
  progreso: number;
  estado?: EstadoRuta;
  /** Texto bajo el extremo izquierdo (lugar y fecha de salida). */
  origen?: ReactNode;
  /** Texto bajo el extremo derecho (lugar y fecha prevista). */
  destino?: ReactNode;
  /** Alto del arco en píxeles. */
  alto?: number;
  /** Repite el dibujo al cambiar (por ejemplo, un botón «Repetir»). */
  claveAnimacion?: number;
  className?: string;
  'aria-label'?: string;
}

const MARGEN = 7;
const MUESTRAS = 48;

/** Arco cuadrático y tabla de longitudes para ubicar puntos a una fracción de su largo. */
function geometria(ancho: number, alto: number) {
  const x0 = MARGEN;
  const x1 = Math.max(ancho - MARGEN, x0 + 1);
  const y = alto - MARGEN;
  const cx = (x0 + x1) / 2;
  const cy = Math.max(2, y - alto * 1.1);
  const punto = (t: number) => {
    const u = 1 - t;
    return {
      x: u * u * x0 + 2 * u * t * cx + t * t * x1,
      y: u * u * y + 2 * u * t * cy + t * t * y,
    };
  };
  const puntos = Array.from({ length: MUESTRAS + 1 }, (_, i) => punto(i / MUESTRAS));
  const acumulado = [0];
  for (let i = 1; i < puntos.length; i++) {
    const a = puntos[i - 1];
    const b = puntos[i];
    const previo = acumulado[i - 1] ?? 0;
    acumulado.push(a && b ? previo + Math.hypot(b.x - a.x, b.y - a.y) : previo);
  }
  const total = acumulado[acumulado.length - 1] || 1;
  const enFraccion = (f: number) => {
    const objetivo = Math.min(Math.max(f, 0), 1) * total;
    let i = 1;
    while (i < acumulado.length - 1 && (acumulado[i] ?? 0) < objetivo) i++;
    const l0 = acumulado[i - 1] ?? 0;
    const l1 = acumulado[i] ?? total;
    const t = (i - 1 + (l1 > l0 ? (objetivo - l0) / (l1 - l0) : 0)) / MUESTRAS;
    return punto(t);
  };
  return { d: `M${x0} ${y} Q${cx} ${cy} ${x1} ${y}`, enFraccion, x0, x1, y };
}

export function LineaRuta({
  progreso,
  estado = 'curso',
  origen,
  destino,
  alto = 44,
  claveAnimacion = 0,
  className,
  'aria-label': etiqueta,
}: PropsLineaRuta) {
  const ref = useRef<HTMLDivElement>(null);
  const [ancho, setAncho] = useState<number | null>(null);
  const p = Math.min(Math.max(progreso, 0), 1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Solo el observador: su primera notificación llega tras el diseño de la página, sin forzar un
    // diseño síncrono por cada ruta al montar una lista.
    const obs = new ResizeObserver(([e]) => {
      if (e) setAncho(Math.round(e.contentRect.width));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div ref={ref} className="relative w-full" style={{ height: alto }}>
        {ancho ? (
          <Trazado
            key={`${ancho}-${claveAnimacion}`}
            ancho={ancho}
            alto={alto}
            progreso={p}
            estado={estado}
            etiqueta={etiqueta ?? `Recorrido estimado: ${Math.round(p * 100)} %`}
          />
        ) : null}
      </div>
      {origen || destino ? (
        <div className="flex justify-between gap-3 text-etiqueta">
          <div className="flex min-w-0 flex-col">{origen}</div>
          <div className="flex min-w-0 flex-col items-end text-right">{destino}</div>
        </div>
      ) : null}
    </div>
  );
}

function Trazado({
  ancho,
  alto,
  progreso: p,
  estado,
  etiqueta,
}: {
  ancho: number;
  alto: number;
  progreso: number;
  estado: EstadoRuta;
  etiqueta: string;
}) {
  const id = useId().replace(/:/g, '');
  const reducido = useReducedMotion();
  const g = geometria(ancho, alto);
  const fin = g.enFraccion(p);

  const tarde = estado === 'tarde';
  const llegado = estado === 'llegado';
  const colorFin = tarde ? 'var(--ambar)' : 'var(--vivo)';
  const colorMarcador = tarde ? 'var(--ambar)' : llegado ? 'var(--verde)' : 'var(--vivo)';
  // Fracción recorrida para las animaciones CSS del trazo y de la luz (base.css › .trazo-ruta).
  const variables = { '--ruta-p': p } as CSSProperties;
  // El marcador avanza por el arco con SMIL (sin JavaScript por cuadro): de 0 a la fracción del
  // largo en --t-ruta (900 ms) con la curva --curva. Con movimiento reducido queda quieto.
  const recorrido = reducido ? null : (
    <animateMotion
      path={g.d}
      dur="0.9s"
      keyPoints={`0;${p}`}
      keyTimes="0;1"
      calcMode="spline"
      keySplines="0.16 1 0.3 1"
      fill="freeze"
    />
  );
  const posicion = reducido ? { cx: fin.x, cy: fin.y } : { cx: 0, cy: 0 };

  return (
    <svg
      width={ancho}
      height={alto}
      viewBox={`0 0 ${ancho} ${alto}`}
      role="img"
      aria-label={etiqueta}
      className="absolute inset-0 overflow-visible"
      style={variables}
    >
      <defs>
        <linearGradient
          id={`grad-${id}`}
          x1={g.x0}
          x2={g.x1}
          y1="0"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={tarde ? 'var(--ambar)' : 'var(--acento)'} />
          <stop offset="1" stopColor={colorFin} />
        </linearGradient>
      </defs>
      {/* Tramo por recorrer */}
      <path
        d={g.d}
        fill="none"
        stroke="var(--linea-fuerte)"
        strokeWidth={1.25}
        strokeDasharray="2 4"
        strokeLinecap="round"
      />
      {/* Tramo recorrido: se dibuja de 0 al progreso (animación CSS) */}
      {p > 0 ? (
        <path
          d={g.d}
          fill="none"
          stroke={`url(#grad-${id})`}
          strokeWidth={1.75}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={`${p} 1`}
          className="trazo-ruta"
        />
      ) : null}
      {/* Luz que viaja una sola vez por el tramo recorrido */}
      {!reducido && p > 0.04 ? (
        <path
          d={g.d}
          fill="none"
          stroke="var(--luz-ruta)"
          strokeWidth={2.25}
          strokeLinecap="round"
          pathLength={1}
          className="luz-ruta"
        />
      ) : null}
      {/* Extremos: origen y destino */}
      <circle
        cx={g.x0}
        cy={g.y}
        r={3.5}
        fill="var(--sup-1)"
        stroke="var(--texto-3)"
        strokeWidth={1.25}
      />
      <circle
        cx={g.x1}
        cy={g.y}
        r={3.5}
        fill="var(--sup-1)"
        stroke="var(--texto-3)"
        strokeWidth={1.25}
      />
      {/* Posición estimada */}
      {estado !== 'pendiente' ? (
        <>
          <circle
            {...posicion}
            r={8}
            fill={colorMarcador}
            fillOpacity={0.18}
            className={estado === 'curso' ? 'pulso-vivo' : undefined}
          >
            {recorrido}
          </circle>
          <circle {...posicion} r={4} fill={colorMarcador} stroke="var(--sup-1)" strokeWidth={2}>
            {recorrido}
          </circle>
        </>
      ) : null}
    </svg>
  );
}
