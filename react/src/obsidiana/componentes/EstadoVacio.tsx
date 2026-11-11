import { cn } from '../lib/cn';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

/*
 * Estado vacío (DISENO.md): un SVG mínimo animado una vez, una línea de texto y una acción.
 * Dibujos: "lista" (una tabla sin filas), "busqueda" (una lupa sobre líneas), "documento".
 */

export type DibujoVacio = 'lista' | 'busqueda' | 'documento' | 'ruta';

export interface PropsEstadoVacio {
  dibujo?: DibujoVacio;
  titulo: ReactNode;
  descripcion?: ReactNode;
  accion?: ReactNode;
  className?: string;
  compacto?: boolean;
}

const TRAZO = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function Trazo({ d, retraso = 0, acento }: { d: string; retraso?: number; acento?: boolean }) {
  return (
    <motion.path
      d={d}
      {...TRAZO}
      className={acento ? 'text-acento' : undefined}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.7, delay: retraso, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

function Dibujo({ dibujo }: { dibujo: DibujoVacio }) {
  return (
    <svg
      viewBox="0 0 120 88"
      width={120}
      height={88}
      aria-hidden
      className="overflow-visible text-texto-3"
    >
      <rect x="14" y="10" width="92" height="68" rx="10" fill="currentColor" fillOpacity={0.06} />
      {dibujo === 'lista' && (
        <>
          <Trazo d="M24 10h72a10 10 0 0 1 10 10v48a10 10 0 0 1-10 10H24a10 10 0 0 1-10-10V20a10 10 0 0 1 10-10Z" />
          <Trazo d="M14 28h92" retraso={0.15} />
          <Trazo d="M28 42h40M28 54h28M28 66h34" retraso={0.3} />
          <Trazo d="M84 42h8" retraso={0.45} acento />
        </>
      )}
      {dibujo === 'busqueda' && (
        <>
          <Trazo d="M24 10h72a10 10 0 0 1 10 10v48a10 10 0 0 1-10 10H24a10 10 0 0 1-10-10V20a10 10 0 0 1 10-10Z" />
          <Trazo d="M28 30h36M28 42h24M28 54h30" retraso={0.15} />
          <Trazo d="M86 54a10 10 0 1 1-20 0a10 10 0 1 1 20 0Z" retraso={0.3} acento />
          <Trazo d="m83.5 61.5 8 8" retraso={0.5} acento />
        </>
      )}
      {dibujo === 'documento' && (
        <>
          <Trazo d="M40 10h28l16 16v42a10 10 0 0 1-10 10H40a10 10 0 0 1-10-10V20a10 10 0 0 1 10-10Z" />
          <Trazo d="M68 10v16h16" retraso={0.15} />
          <Trazo d="M42 44h28M42 56h18" retraso={0.3} />
          <Trazo d="M42 32h10" retraso={0.45} acento />
        </>
      )}
      {dibujo === 'ruta' && (
        <>
          <Trazo d="M24 64c18-2 22-30 42-34s22-14 30-16" retraso={0.1} acento />
          <Trazo d="M24 64a4 4 0 1 1 0 0.01M96 14a4 4 0 1 1 0 0.01" />
        </>
      )}
    </svg>
  );
}

export function EstadoVacio({
  dibujo = 'lista',
  titulo,
  descripcion,
  accion,
  className,
  compacto,
}: PropsEstadoVacio) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-center',
        compacto ? 'px-6 py-10' : 'px-6 pt-16 pb-18',
        className,
      )}
    >
      <Dibujo dibujo={dibujo} />
      <div className="mt-1 flex max-w-sm flex-col gap-1">
        <p className="font-medium text-texto-1">{titulo}</p>
        {descripcion ? <p className="text-texto-2">{descripcion}</p> : null}
      </div>
      {accion ? <div className="mt-2">{accion}</div> : null}
    </div>
  );
}
