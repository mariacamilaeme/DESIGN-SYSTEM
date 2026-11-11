import { LOCALE } from '../lib/formato';
import { IconoBuscar, IconoCerrar, IconoFiltro } from '../iconos';
import { cn } from '../lib/cn';
import { normalizarTexto } from '../lib/texto';
import { AnimatePresence, motion } from 'motion/react';
import { type ReactNode, useId, useState } from 'react';
import { Boton, BotonIcono } from '../ui/boton';
import { Casilla } from '../ui/casilla';
import { Emergente, EmergenteContenido, EmergenteDisparador } from '../ui/emergente';
import { Entrada } from '../ui/entrada';

/*
 * Barra de filtros (DISENO.md › Filtros): campo de búsqueda, botón de filtros con contador,
 * popover de dos niveles (categoría y lista con búsqueda y "Seleccionar todo") y fichas de
 * filtros activos con cierre. Componente controlado: el estado vive fuera (en la URL o en el
 * estado de la pantalla).
 */

export interface OpcionFiltro {
  valor: string;
  etiqueta: string;
  /** Cantidad de registros con este valor. */
  cuenta?: number;
}

export interface CategoriaFiltro {
  id: string;
  etiqueta: string;
  icono?: ReactNode;
  opciones: readonly OpcionFiltro[];
}

export type SeleccionFiltros = Readonly<Record<string, readonly string[]>>;

export interface PropsBarraFiltros {
  busqueda: string;
  onBusqueda: (texto: string) => void;
  marcadorBusqueda?: string;
  categorias: readonly CategoriaFiltro[];
  seleccion: SeleccionFiltros;
  onSeleccion: (seleccion: SeleccionFiltros) => void;
  /** Controles a la derecha (exportar, columnas, nuevo). */
  acciones?: ReactNode;
  className?: string;
  /**
   * Número mínimo de opciones para que una categoría muestre su caja de búsqueda. Por defecto 6;
   * con 1 la caja aparece siempre.
   */
  umbralBusqueda?: number;
  /**
   * Qué marca "Seleccionar todo". `todas` (por defecto) marca todas las
   * opciones de la categoría aunque haya una búsqueda escrita; `visibles` reemplaza la selección
   * por las opciones que deja la búsqueda.
   */
  seleccionarTodo?: AlcanceSeleccionarTodo;
  /** Oculta "Quitar filtros" de la barra cuando la pantalla ya pone su propio botón de limpiar. */
  ocultarQuitarFiltros?: boolean;
  /**
   * Fichas propias de la pantalla que van junto a las de los filtros, delante de ellas (por
   * ejemplo "3 pedidos seleccionados"). Usa `FichaFiltro` para que se vean iguales.
   */
  fichas?: ReactNode;
}

export type AlcanceSeleccionarTodo = 'todas' | 'visibles';

/**
 * Valores que deja "Seleccionar todo" en una categoría. Si su alcance ya está completo, lo quita
 * (la casilla funciona como interruptor); si no, marca el alcance completo.
 */
export function aplicarSeleccionarTodo(
  opciones: readonly OpcionFiltro[],
  visibles: readonly OpcionFiltro[],
  elegidos: ReadonlySet<string>,
  alcance: AlcanceSeleccionarTodo,
): Set<string> {
  const objetivo = alcance === 'todas' ? opciones : visibles;
  const completo = objetivo.length > 0 && objetivo.every((o) => elegidos.has(o.valor));
  if (completo) {
    const resto = new Set(elegidos);
    for (const o of objetivo) resto.delete(o.valor);
    return resto;
  }
  return new Set(objetivo.map((o) => o.valor));
}

const FORMATO = new Intl.NumberFormat(LOCALE);

export function BarraFiltros({
  busqueda,
  onBusqueda,
  marcadorBusqueda = 'Buscar',
  categorias,
  seleccion,
  onSeleccion,
  acciones,
  className,
  umbralBusqueda = 6,
  seleccionarTodo = 'todas',
  ocultarQuitarFiltros = false,
  fichas,
}: PropsBarraFiltros) {
  const activos = categorias.filter((c) => (seleccion[c.id]?.length ?? 0) > 0);
  const totalActivos = activos.reduce((n, c) => n + (seleccion[c.id]?.length ?? 0), 0);

  const quitar = (id: string) => {
    const { [id]: _, ...resto } = seleccion;
    onSeleccion(resto);
  };

  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      <div className="flex items-center gap-2">
        <Entrada
          type="search"
          value={busqueda}
          onChange={(e) => onBusqueda(e.target.value)}
          placeholder={marcadorBusqueda}
          aria-label={marcadorBusqueda}
          icono={<IconoBuscar tamano={16} />}
          claseContenedor="w-72"
          accion={
            busqueda ? (
              <BotonIcono etiqueta="Limpiar búsqueda" tamano="sm" onClick={() => onBusqueda('')}>
                <IconoCerrar tamano={14} />
              </BotonIcono>
            ) : undefined
          }
        />
        <PopoverFiltros
          categorias={categorias}
          seleccion={seleccion}
          onSeleccion={onSeleccion}
          total={totalActivos}
          umbralBusqueda={umbralBusqueda}
          seleccionarTodo={seleccionarTodo}
        />
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
          {fichas}
          <AnimatePresence initial={false}>
            {activos.map((c) => (
              <Ficha
                key={c.id}
                categoria={c}
                valores={seleccion[c.id] ?? []}
                onQuitar={() => quitar(c.id)}
              />
            ))}
          </AnimatePresence>
          {activos.length > 1 && !ocultarQuitarFiltros ? (
            <button
              type="button"
              onClick={() => onSeleccion({})}
              className="ml-1 h-7 shrink-0 rounded-elemento px-2 text-etiqueta font-medium text-texto-3 transition-colors duration-(--t-hover) hover:bg-lavado-2 hover:text-texto-1"
            >
              Quitar filtros
            </button>
          ) : null}
        </div>
        {acciones ? (
          <div className="ml-auto flex shrink-0 items-center gap-2">{acciones}</div>
        ) : null}
      </div>
    </div>
  );
}

function Ficha({
  categoria,
  valores,
  onQuitar,
}: {
  categoria: CategoriaFiltro;
  valores: readonly string[];
  onQuitar: () => void;
}) {
  const etiquetas = valores.map(
    (v) => categoria.opciones.find((o) => o.valor === v)?.etiqueta ?? v,
  );
  const texto =
    etiquetas.length <= 2 ? etiquetas.join(', ') : `${etiquetas[0]} y ${etiquetas.length - 1} más`;
  return (
    <FichaFiltro
      categoria={categoria.etiqueta}
      etiquetaQuitar={`Quitar filtro ${categoria.etiqueta}`}
      onQuitar={onQuitar}
    >
      {texto}
    </FichaFiltro>
  );
}

/** Ficha de filtro activo con cierre; la usan la barra y las fichas propias de cada pantalla. */
export function FichaFiltro({
  categoria,
  children,
  etiquetaQuitar,
  onQuitar,
}: {
  /** Nombre atenuado delante del valor ("Cliente"); opcional. */
  categoria?: string;
  children: ReactNode;
  etiquetaQuitar: string;
  onQuitar: () => void;
}) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-control border border-acento/25 bg-acento-tenue pr-0.5 pl-2.5 text-etiqueta font-medium text-texto-1"
    >
      {categoria ? <span className="font-normal text-texto-2">{categoria}</span> : null}
      <span className="max-w-56 truncate">{children}</span>
      <BotonIcono etiqueta={etiquetaQuitar} className="size-6 text-texto-3" onClick={onQuitar}>
        <IconoCerrar tamano={12} />
      </BotonIcono>
    </motion.span>
  );
}

function PopoverFiltros({
  categorias,
  seleccion,
  onSeleccion,
  total,
  umbralBusqueda,
  seleccionarTodo,
}: {
  categorias: readonly CategoriaFiltro[];
  seleccion: SeleccionFiltros;
  onSeleccion: (s: SeleccionFiltros) => void;
  total: number;
  umbralBusqueda: number;
  seleccionarTodo: AlcanceSeleccionarTodo;
}) {
  const [abierto, setAbierto] = useState(false);
  const idPanel = useId();
  const [categoriaId, setCategoriaId] = useState(categorias[0]?.id ?? '');
  const [busqueda, setBusqueda] = useState('');
  const categoria = categorias.find((c) => c.id === categoriaId) ?? categorias[0];
  const elegidos = new Set(categoria ? (seleccion[categoria.id] ?? []) : []);
  const conBusqueda = (categoria?.opciones.length ?? 0) >= umbralBusqueda;
  const termino = conBusqueda ? normalizarTexto(busqueda) : '';
  const visibles = categoria
    ? categoria.opciones.filter((o) => !termino || normalizarTexto(o.etiqueta).includes(termino))
    : [];
  // La casilla refleja el mismo conjunto que marca "Seleccionar todo".
  const alcance = seleccionarTodo === 'todas' ? (categoria?.opciones ?? []) : visibles;
  const todosElegidos = alcance.length > 0 && alcance.every((o) => elegidos.has(o.valor));
  const algunoElegido = alcance.some((o) => elegidos.has(o.valor));

  const fijar = (valores: Set<string>) => {
    if (!categoria) return;
    const lista = categoria.opciones.map((o) => o.valor).filter((v) => valores.has(v));
    if (lista.length === 0) {
      const { [categoria.id]: _, ...resto } = seleccion;
      onSeleccion(resto);
    } else onSeleccion({ ...seleccion, [categoria.id]: lista });
  };

  return (
    <Emergente
      open={abierto}
      onOpenChange={(a) => {
        setAbierto(a);
        if (!a) setBusqueda('');
      }}
    >
      <EmergenteDisparador asChild>
        <Boton variante="secundario">
          <IconoFiltro tamano={16} />
          Filtros
          {total > 0 ? (
            <span className="cifras grid h-4.5 min-w-4.5 place-items-center rounded-pildora bg-acento-relleno px-1 text-mini font-semibold text-sobre-acento">
              {total}
            </span>
          ) : null}
        </Boton>
      </EmergenteDisparador>
      <EmergenteContenido className="w-(--ancho-filtros) p-0">
        <div className="grid min-h-75 grid-cols-[var(--ancho-categorias-filtro)_minmax(0,1fr)]">
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Categorías"
            // Flechas arriba y abajo, Inicio y Fin cambian de categoría (patrón de pestañas WAI-ARIA).
            onKeyDown={(e) => {
              const i = categorias.findIndex((c) => c.id === categoria?.id);
              const destino =
                e.key === 'ArrowDown'
                  ? (i + 1) % categorias.length
                  : e.key === 'ArrowUp'
                    ? (i - 1 + categorias.length) % categorias.length
                    : e.key === 'Home'
                      ? 0
                      : e.key === 'End'
                        ? categorias.length - 1
                        : -1;
              const c = categorias[destino];
              if (!c) return;
              e.preventDefault();
              setCategoriaId(c.id);
              setBusqueda('');
              e.currentTarget.querySelector<HTMLElement>(`[data-categoria="${c.id}"]`)?.focus();
            }}
            className="flex flex-col gap-0.5 border-r border-linea p-1.5"
          >
            {categorias.map((c) => {
              const n = seleccion[c.id]?.length ?? 0;
              const activa = c.id === categoria?.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  data-categoria={c.id}
                  aria-selected={activa}
                  aria-controls={`${idPanel}-panel`}
                  id={`${idPanel}-${c.id}`}
                  tabIndex={activa ? 0 : -1}
                  onClick={() => {
                    setCategoriaId(c.id);
                    setBusqueda('');
                  }}
                  className={cn(
                    'flex h-8 items-center gap-2.5 rounded-elemento px-2.5 text-left font-medium text-texto-2',
                    'transition-colors duration-(--t-hover) hover:bg-lavado hover:text-texto-1',
                    activa && 'bg-lavado-2 text-texto-1',
                  )}
                >
                  {c.icono ? <span className="flex text-texto-3">{c.icono}</span> : null}
                  <span className="truncate">{c.etiqueta}</span>
                  {n > 0 ? (
                    <span className="cifras ml-auto grid h-4.5 min-w-4.5 place-items-center rounded-pildora bg-acento-relleno px-1 text-mini font-semibold text-sobre-acento">
                      {n}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
          <div
            role="tabpanel"
            id={`${idPanel}-panel`}
            aria-labelledby={categoria ? `${idPanel}-${categoria.id}` : undefined}
            className="flex min-w-0 flex-col"
          >
            {conBusqueda ? (
              <div className="flex items-center gap-2 border-b border-linea px-3">
                <IconoBuscar tamano={14} className="text-texto-3" />
                <input
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder={`Buscar en ${categoria?.etiqueta.toLowerCase() ?? ''}`}
                  aria-label={`Buscar en ${categoria?.etiqueta.toLowerCase() ?? 'opciones'}`}
                  className="h-10 w-full bg-transparent text-cuerpo text-texto-1 outline-none placeholder:text-texto-3"
                />
              </div>
            ) : null}
            <div className="max-h-60 min-h-0 flex-1 overflow-auto p-1.5">
              {visibles.length === 0 ? (
                <p className="px-2.5 py-6 text-center text-etiqueta text-texto-3">
                  {termino ? 'Sin resultados' : 'Sin opciones'}
                </p>
              ) : (
                <>
                  {/* biome-ignore lint/a11y/noLabelWithoutControl: la casilla de Radix es el control */}
                  <label className="flex h-8 cursor-pointer items-center gap-2.5 rounded-elemento px-2.5 font-medium transition-colors duration-(--t-hover) hover:bg-lavado">
                    <Casilla
                      checked={todosElegidos ? true : algunoElegido ? 'indeterminate' : false}
                      onCheckedChange={() => {
                        if (!categoria) return;
                        fijar(
                          aplicarSeleccionarTodo(
                            categoria.opciones,
                            visibles,
                            elegidos,
                            seleccionarTodo,
                          ),
                        );
                      }}
                    />
                    Seleccionar todo
                  </label>
                  <div className="mx-2.5 my-1 h-px bg-linea" />
                  {visibles.map((o) => (
                    // biome-ignore lint/a11y/noLabelWithoutControl: la casilla de Radix es el control
                    <label
                      key={o.valor}
                      className="flex h-8 cursor-pointer items-center gap-2.5 rounded-elemento px-2.5 transition-colors duration-(--t-hover) hover:bg-lavado"
                    >
                      <Casilla
                        checked={elegidos.has(o.valor)}
                        onCheckedChange={(v) => {
                          const nuevo = new Set(elegidos);
                          if (v === true) nuevo.add(o.valor);
                          else nuevo.delete(o.valor);
                          fijar(nuevo);
                        }}
                      />
                      <span className="truncate">{o.etiqueta}</span>
                      {o.cuenta !== undefined ? (
                        <span className="cifras ml-auto text-etiqueta text-texto-3">
                          {FORMATO.format(o.cuenta)}
                        </span>
                      ) : null}
                    </label>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-linea py-2.5 pr-2.5 pl-3.5">
          <span className="text-etiqueta text-texto-3">
            {total === 0
              ? 'Sin filtros activos'
              : `${total} ${total === 1 ? 'valor elegido' : 'valores elegidos'}`}
          </span>
          <Boton
            variante="fantasma"
            tamano="sm"
            className="ml-auto"
            disabled={total === 0}
            onClick={() => onSeleccion({})}
          >
            Limpiar
          </Boton>
          <Boton variante="primario" tamano="sm" onClick={() => setAbierto(false)}>
            Listo
          </Boton>
        </div>
      </EmergenteContenido>
    </Emergente>
  );
}
