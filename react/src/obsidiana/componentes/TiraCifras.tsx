import { LOCALE } from '../lib/formato';
import { cn } from '../lib/cn';
import { CURVA, RESORTE_INDICADOR, retrasoEscalonado } from '../lib/movimiento';
import NumberFlow, { type Format, NumberFlowGroup } from '@number-flow/react';
import { motion } from 'motion/react';
import { Children, type ReactNode, useId } from 'react';
import { Esqueleto } from '../ui/varios';

/*
 * Cifras compactas (prototipo Obsidiana › .strip y .kpis).
 *
 * - TiraCifras: una sola superficie con varias cifras en fila (etiqueta, valor y dato
 *   secundario). Si recibe `onActivo`, cada cifra es un botón que filtra (aria-pressed) y un
 *   indicador se desliza a la activa. Sustituye a las filas de tarjetas grandes y vacías.
 * - GrupoCifras: una tarjeta con varias <Cifra> separadas por divisores verticales interiores.
 */

export interface ElementoTira {
  id: string;
  etiqueta: ReactNode;
  /** Glifo o icono a la izquierda de la etiqueta (GlifoEstado, icono de 14 px). */
  icono?: ReactNode;
  valor: number | null;
  formato?: Format;
  /** Moneda delante ("USD"). */
  prefijo?: string;
  /** Unidad detrás ("t"). */
  unidad?: string;
  /** Dato secundario a la derecha del valor ("2.820 t", "de 40"). */
  secundario?: ReactNode;
  /** Texto accesible completo si la etiqueta es abreviada. */
  descripcion?: string;
  /**
   * Ranura opcional a la derecha de la etiqueta para un elemento pequeño (14 px) que acompaña a
   * la cifra, como un anillo de proporción.
   */
  anexo?: ReactNode;
  /** Peso relativo de la columna (1 por defecto); para la cifra de dinero larga de una fila. */
  peso?: number;
}

export interface PropsTiraCifras {
  elementos: readonly ElementoTira[];
  /** Nombre accesible del grupo ("Filtrar por estado"). */
  etiqueta: string;
  /** Id del elemento activo (solo si la tira filtra). */
  activo?: string | null;
  onActivo?: (id: string) => void;
  /** Mientras cargan los datos, barras de esqueleto en lugar de valores. */
  cargando?: boolean;
  /**
   * Anima los cambios de las cifras (por defecto, sí). Una pantalla lo apaga mientras se escribe
   * en su búsqueda: cada tecla reiniciaría la animación y su coste retrasa la tecla siguiente.
   */
  animar?: boolean;
  className?: string;
}

const FORMATO_ENTERO: Format = { maximumFractionDigits: 0 };

function Valor({
  e,
  cargando,
  animar = true,
}: {
  e: ElementoTira;
  cargando?: boolean;
  animar?: boolean;
}) {
  if (cargando) {
    return (
      <span className="flex h-6.5 items-center gap-2">
        <Esqueleto className="h-4.5 w-8" />
        <Esqueleto className="h-2.5 w-14" />
      </span>
    );
  }
  return (
    <span className="cifras flex max-w-full min-w-0 items-baseline gap-2 whitespace-nowrap">
      <span className="flex items-baseline gap-1 text-cifra-2 font-medium text-texto-1">
        {e.prefijo ? (
          <span className="text-etiqueta font-medium tracking-normal text-texto-3">
            {e.prefijo}
          </span>
        ) : null}
        {e.valor === null ? (
          <span className="text-texto-3">—</span>
        ) : (
          <NumberFlow
            value={e.valor}
            locales={LOCALE}
            format={e.formato ?? FORMATO_ENTERO}
            animated={animar}
            transformTiming={{ duration: 600, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            spinTiming={{ duration: 600, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            opacityTiming={{ duration: 300, easing: 'ease-out' }}
          />
        )}
        {e.unidad ? (
          <span className="text-etiqueta font-medium tracking-normal text-texto-3">{e.unidad}</span>
        ) : null}
      </span>
      {e.secundario ? (
        <span className="truncate text-etiqueta text-texto-3">{e.secundario}</span>
      ) : null}
    </span>
  );
}

export function TiraCifras({
  elementos,
  etiqueta,
  activo,
  onActivo,
  cargando,
  animar,
  className,
}: PropsTiraCifras) {
  const idIndicador = useId();
  const filtra = Boolean(onActivo);
  return (
    // biome-ignore lint/a11y/useSemanticElements: un fieldset no admite la rejilla de la tira; el grupo de botones se nombra con aria-label
    <div
      role="group"
      aria-label={etiqueta}
      aria-busy={cargando || undefined}
      className={cn('superficie grid p-1', className)}
      style={{
        gridTemplateColumns: elementos.some((e) => e.peso)
          ? elementos.map((e) => `minmax(0, ${e.peso ?? 1}fr)`).join(' ')
          : `repeat(${elementos.length}, minmax(0, 1fr))`,
      }}
    >
      {/* Las cifras cambian a la vez (p. ej. al filtrar): el grupo agrupa sus mediciones y evita
          que cada una fuerce su propio recálculo de estilo y layout. */}
      <NumberFlowGroup>
        {elementos.map((e, i) => {
          const esActivo = filtra && activo === e.id;
          const junto = esActivo || (filtra && elementos[i - 1]?.id === activo);
          const contenido = (
            <>
              <span
                className={cn(
                  // max-w-full: en una celda estrecha la etiqueta se recorta y no invade la vecina
                  'flex min-w-0 max-w-full items-center gap-1.5 font-medium whitespace-nowrap transition-colors duration-(--t-hover)',
                  e.anexo && 'self-stretch',
                  esActivo ? 'text-texto-1' : 'text-texto-2',
                )}
              >
                {e.icono ? <span className="flex flex-none text-texto-3">{e.icono}</span> : null}
                <span className="truncate">{e.etiqueta}</span>
                {e.anexo ? <span className="ml-auto flex flex-none pl-2">{e.anexo}</span> : null}
              </span>
              <Valor e={e} cargando={cargando} animar={animar} />
            </>
          );
          const clase = cn(
            'relative flex min-w-0 flex-col items-start gap-1.5 rounded-interno px-3.5 py-2.5 text-left',
            // divisor interior entre cifras, oculto junto a la activa
            i > 0 &&
              !junto &&
              'before:absolute before:top-3 before:bottom-3 before:left-0 before:w-px before:bg-linea',
          );
          return (
            <motion.div
              key={e.id}
              className="relative min-w-0"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, ease: CURVA, delay: retrasoEscalonado(i) }}
            >
              {filtra ? (
                <button
                  type="button"
                  aria-pressed={esActivo}
                  aria-label={e.descripcion}
                  onClick={() => onActivo?.(e.id)}
                  className={cn(
                    clase,
                    'w-full transition-colors duration-(--t-hover) hover:bg-lavado focus-visible:outline-offset-0',
                  )}
                >
                  {esActivo ? (
                    <motion.span
                      layoutId={idIndicador}
                      transition={RESORTE_INDICADOR}
                      aria-hidden
                      className="absolute inset-0 rounded-interno bg-lavado-2 shadow-[inset_0_0_0_1px_var(--linea),inset_0_1px_0_var(--realce)]"
                    />
                  ) : null}
                  <span className="relative flex w-full min-w-0 flex-col items-start gap-1.5">
                    {contenido}
                  </span>
                </button>
              ) : (
                <div className={clase} title={e.descripcion}>
                  {contenido}
                </div>
              )}
            </motion.div>
          );
        })}
      </NumberFlowGroup>
    </div>
  );
}

/** Tarjeta con varias <Cifra> separadas por divisores interiores (prototipo › .kpis). */
export function GrupoCifras({
  children,
  className,
  etiqueta,
}: {
  children: ReactNode;
  className?: string;
  /** Nombre accesible de la región ("Resumen del año"). */
  etiqueta?: string;
}) {
  const hijos = Children.toArray(children);
  return (
    <section
      aria-label={etiqueta}
      className={cn('superficie grid', className)}
      style={{ gridTemplateColumns: `repeat(${hijos.length}, minmax(0, 1fr))` }}
    >
      {hijos.map((h, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: posiciones fijas de una rejilla
          key={i}
          className={cn(
            'relative min-w-0 px-5 py-4.5',
            i > 0 &&
              'before:absolute before:top-4.5 before:bottom-4.5 before:left-0 before:w-px before:bg-linea',
          )}
        >
          {h}
        </div>
      ))}
    </section>
  );
}
