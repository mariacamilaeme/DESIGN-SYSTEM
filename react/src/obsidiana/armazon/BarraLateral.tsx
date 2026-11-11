import { animate, useReducedMotion } from 'motion/react';
import { type RefObject, useEffect, useLayoutEffect, useRef } from 'react';
import { IconoLateral } from '../iconos';
import { cn } from '../lib/cn';
import { LOCALE } from '../lib/formato';
import { RESORTE_INDICADOR } from '../lib/movimiento';
import { Pista } from '../ui/pista';
import { Enlace, rutaCoincide, useArmazon } from './contexto';
import type {
  AccionPie,
  ContadorNav,
  DestinoNavegacion,
  EstadoPie,
  GrupoNavegacion,
  MarcaArmazon,
} from './tipos';

/*
 * Barra lateral (232 px, plegable a 64 px con solo iconos y pistas). En ambos temas es más oscura
 * que el contenido y lee siempre los tokens --lateral-*. Recibe la marca, los grupos de
 * navegación, los contadores y el pie por props: no sabe nada del dominio.
 */

const FORMATO = new Intl.NumberFormat(LOCALE);

/** Destino de la navegación que corresponde a una ruta. */
function destinoActivo(grupos: readonly GrupoNavegacion[], ruta: string): string | null {
  for (const grupo of grupos) {
    for (const d of grupo.destinos) {
      if (rutaCoincide(d.ruta, ruta)) return d.ruta;
    }
  }
  return null;
}

/**
 * Indicador del elemento activo que se desliza al cambiar de destino (resorte 420/36).
 *
 * No usa `layoutId`: la proyección de Motion medía el documento entero justo después de montar la
 * vista nueva y forzaba un cálculo de estilo y de diseño de toda la página en cada navegación
 * (40–70 ms). Aquí la posición de cada enlace se lee cuando el diseño ya está calculado (en el
 * ResizeObserver de la navegación) y el deslizamiento es solo un `transform` desde la posición
 * anterior, sin leer el diseño al navegar.
 */
function useIndicadorDeslizante(activa: string | null) {
  const nav = useRef<HTMLElement>(null);
  const indicador = useRef<HTMLSpanElement>(null);
  const posiciones = useRef(new Map<string, number>());
  const anterior = useRef<string | null>(activa);
  const reducido = useReducedMotion();

  // El ResizeObserver avisa una primera vez tras el primer diseño y luego con cada cambio de tamaño
  // de la navegación (plegar la barra): en ese momento leer posiciones no fuerza ningún cálculo.
  useEffect(() => {
    const el = nav.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observador = new ResizeObserver(() => {
      const base = el.getBoundingClientRect().top;
      for (const a of el.querySelectorAll<HTMLElement>('a[data-destino]')) {
        const destino = a.dataset.destino;
        if (destino) posiciones.current.set(destino, a.getBoundingClientRect().top - base);
      }
    });
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  useLayoutEffect(() => {
    const desde = anterior.current;
    anterior.current = activa;
    const el = indicador.current;
    if (!el || reducido || !desde || !activa || desde === activa) return;
    const y0 = posiciones.current.get(desde);
    const y1 = posiciones.current.get(activa);
    if (y0 === undefined || y1 === undefined || y0 === y1) return;
    const animacion = animate(el, { y: [y0 - y1, 0] }, RESORTE_INDICADOR);
    return () => animacion.stop();
  }, [activa, reducido]);

  return { nav, indicador };
}

export interface PropsBarraLateral {
  marca: MarcaArmazon;
  navegacion: readonly GrupoNavegacion[];
  contadores?: Readonly<Record<string, ContadorNav | null | undefined>>;
  estadoPie?: EstadoPie;
  accionesPie?: readonly AccionPie[];
}

export function BarraLateral({
  marca,
  navegacion,
  contadores,
  estadoPie,
  accionesPie = [],
}: PropsBarraLateral) {
  const { lateralPlegada: plegada, alternarLateral, rutaActual } = useArmazon();
  const activa = destinoActivo(navegacion, rutaActual);
  const { nav, indicador } = useIndicadorDeslizante(activa);
  const IconoEstado = estadoPie?.icono;

  return (
    <aside
      aria-label="Navegación principal"
      data-plegada={plegada || undefined}
      className={cn(
        'relative z-20 flex h-full min-h-0 flex-col border-r border-lateral-linea bg-lateral text-lateral-texto-2',
        '[--logo-tinta:var(--lateral-logo-tinta)] [--acento:var(--lateral-foco)]',
        plegada ? 'w-(--ancho-lateral-plegada) px-2.5' : 'w-(--ancho-lateral) px-3',
      )}
    >
      {/* Marca */}
      <div
        className={cn(
          'flex h-(--alto-superior) flex-none items-center',
          plegada ? 'justify-center' : 'justify-between pr-0.5 pl-2',
        )}
      >
        <Enlace
          ruta={marca.ruta ?? '/'}
          aria-label={`${marca.nombre}, ir al inicio`}
          className="flex rounded-elemento text-lateral-texto-1"
        >
          {plegada ? marca.simbolo : marca.completa}
        </Enlace>
        {plegada ? null : (
          <Pista contenido="Plegar barra lateral" atajo={['Ctrl', 'B']} lado="right">
            <button
              type="button"
              aria-label="Plegar barra lateral"
              aria-keyshortcuts="Control+B"
              onClick={alternarLateral}
              className="grid size-7 place-items-center rounded-elemento text-lateral-texto-3 transition-colors duration-(--t-hover) hover:bg-lateral-lavado hover:text-lateral-texto-1"
            >
              <IconoLateral tamano={16} />
            </button>
          </Pista>
        )}
      </div>

      {/* Navegación */}
      <nav ref={nav} className="mt-3 flex flex-col gap-5">
        {navegacion.map((grupo) => (
          <div key={grupo.nombre} className="flex flex-col gap-0.5">
            {plegada ? (
              <div aria-hidden className="mx-auto mb-1.5 h-px w-5 bg-lateral-linea first:hidden" />
            ) : (
              <div className="mb-1 px-2.5 text-mini font-medium text-lateral-texto-3">
                {grupo.nombre}
              </div>
            )}
            {grupo.destinos.map((d) => (
              <ElementoNav
                key={d.ruta}
                destino={d}
                activo={d.ruta === activa}
                plegada={plegada}
                contador={contadores?.[d.ruta] ?? null}
                indicador={indicador}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Pie */}
      <div className="mt-auto flex flex-col gap-1 border-t border-lateral-linea pt-3 pb-3">
        {estadoPie && IconoEstado ? (
          plegada ? (
            <Pista
              lado="right"
              contenido={
                estadoPie.detalle ? `${estadoPie.titulo} · ${estadoPie.detalle}` : estadoPie.titulo
              }
            >
              {/* Enfocable para que la pista del estado también se lea con el teclado. */}
              <span
                tabIndex={0}
                role="img"
                aria-label={
                  estadoPie.detalle
                    ? `${estadoPie.titulo}. ${estadoPie.detalle}`
                    : estadoPie.titulo
                }
                className="mx-auto grid size-9 place-items-center rounded-control text-lateral-texto-3"
              >
                <IconoEstado tamano={16} />
              </span>
            </Pista>
          ) : (
            <div className="flex items-start gap-2.5 px-2.5 pb-1.5">
              <IconoEstado tamano={16} className="mt-0.5 text-lateral-texto-3" />
              <div className="flex min-w-0 flex-col text-etiqueta">
                <span className="font-medium text-lateral-texto-2">{estadoPie.titulo}</span>
                {estadoPie.detalle ? (
                  <span className="cifras text-lateral-texto-3">{estadoPie.detalle}</span>
                ) : null}
              </div>
            </div>
          )
        ) : null}
        {plegada ? (
          <Pista contenido="Desplegar barra lateral" atajo={['Ctrl', 'B']} lado="right">
            <button
              type="button"
              aria-label="Desplegar barra lateral"
              aria-keyshortcuts="Control+B"
              onClick={alternarLateral}
              className="mx-auto grid size-9 place-items-center rounded-control text-lateral-texto-3 transition-colors duration-(--t-hover) hover:bg-lateral-lavado hover:text-lateral-texto-1"
            >
              <IconoLateral tamano={16} />
            </button>
          </Pista>
        ) : null}
        {accionesPie.map((a) => (
          <Pista key={a.id} contenido={a.etiqueta} lado="right" activa={plegada}>
            <button
              type="button"
              onClick={a.alSeleccionar}
              aria-label={plegada ? a.etiqueta : undefined}
              className={cn(
                'group flex h-8 items-center gap-2.5 rounded-control text-lateral-texto-3 transition-colors duration-(--t-hover)',
                'hover:bg-lateral-lavado hover:text-lateral-texto-1',
                plegada ? 'mx-auto w-9 justify-center' : 'px-2.5',
              )}
            >
              <a.icono tamano={16} />
              {plegada ? null : <span className="font-medium">{a.etiqueta}</span>}
            </button>
          </Pista>
        ))}
      </div>
    </aside>
  );
}

function ElementoNav({
  destino,
  activo,
  plegada,
  contador,
  indicador,
}: {
  destino: DestinoNavegacion;
  activo: boolean;
  plegada: boolean;
  contador: ContadorNav | null;
  indicador: RefObject<HTMLSpanElement | null>;
}) {
  const Icono = destino.icono;
  const descripcion = contador
    ? contador.n === 1
      ? (contador.descripcionUno ?? contador.descripcion)
      : contador.descripcion
    : '';
  const conteo = contador
    ? `${destino.nombre}, ${FORMATO.format(contador.n)} ${descripcion}`
    : undefined;
  return (
    <Pista
      contenido={
        contador ? (
          <span>
            {destino.nombre}
            <span className="cifras ml-1.5 text-texto-3">
              {FORMATO.format(contador.n)} {descripcion}
            </span>
          </span>
        ) : (
          destino.nombre
        )
      }
      lado="right"
      activa={plegada}
    >
      <Enlace
        ruta={destino.ruta}
        data-destino={destino.ruta}
        aria-current={activo ? 'page' : undefined}
        aria-label={plegada ? (conteo ?? destino.nombre) : conteo}
        className={cn(
          'group relative flex flex-none items-center rounded-control font-medium',
          'transition-colors duration-(--t-hover)',
          activo
            ? 'text-lateral-texto-1'
            : 'text-lateral-texto-2 hover:bg-lateral-lavado hover:text-lateral-texto-1',
          plegada ? 'mx-auto h-11 w-11 flex-col justify-center gap-0.5' : 'h-8 gap-2.5 px-2.5',
        )}
      >
        {activo ? (
          <span
            ref={indicador}
            aria-hidden
            className="absolute inset-0 rounded-control bg-lateral-activo shadow-[inset_0_1px_0_var(--lateral-realce)]"
          >
            <span className="absolute top-2 bottom-2 -left-px w-0.5 rounded-pildora bg-lateral-acento shadow-(--resplandor-acento)" />
          </span>
        ) : null}
        <Icono
          tamano={16}
          className={cn(
            'relative transition-colors duration-(--t-hover)',
            activo
              ? 'text-lateral-acento'
              : 'text-lateral-texto-3 group-hover:text-lateral-texto-2',
          )}
        />
        {plegada ? (
          contador ? (
            <span
              aria-hidden
              className={cn(
                'cifras relative text-micro font-medium',
                activo ? 'text-lateral-texto-2' : 'text-lateral-texto-3',
              )}
            >
              {FORMATO.format(contador.n)}
            </span>
          ) : null
        ) : (
          <>
            <span className="relative truncate">{destino.nombre}</span>
            {contador ? (
              <span className="cifras relative ml-auto rounded-pildora bg-lateral-contador px-1.5 text-mini leading-4.5 font-medium text-lateral-texto-3">
                {FORMATO.format(contador.n)}
              </span>
            ) : null}
          </>
        )}
      </Enlace>
    </Pista>
  );
}
