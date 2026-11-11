import { LOCALE } from '../lib/formato';
import { IconoChevronDerecha, IconoChevronIzquierda, IconoOrden } from '../iconos';
import { cn } from '../lib/cn';
import {
  type ColumnDef,
  type ColumnSizingState,
  columnResizingFeature,
  columnSizingFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  type PaginationState,
  type RowData,
  rowPaginationFeature,
  rowSortingFeature,
  type SortingState,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { EstadoVacio } from './EstadoVacio';
import { Selector } from '../ui/selector';
import { Esqueleto } from '../ui/varios';

/*
 * Tabla de datos (DISENO.md › Tabla de datos), sobre TanStack Table v9.
 *
 * - Encabezado fijo; etiquetas de columna en texto-3; encabezados ordenables (aria-sort).
 * - Primera columna fija con sombra de borde al desplazar en horizontal. Nunca se recortan
 *   columnas: hay desplazamiento horizontal.
 * - Columnas redimensionables (doble clic en el asa restablece el ancho).
 * - Hover con lavado tenue; fila seleccionada con filo de luz a la izquierda.
 * - Celdas vacías como "—" en texto-3; cifras a la derecha con numerales tabulares.
 * - Pie con conteo, tamaño de página y paginación.
 * - Teclado: flechas, Inicio/Fin, RePág/AvPág y Enter para abrir la fila.
 * - Cuerpo virtualizado cuando se muestran más de 200 filas.
 *
 * El orden, la página y el tamaño de página pueden controlarse desde fuera (estado en la URL).
 * "use no memo" (en el cuerpo de TablaDatos): TanStack Table v9 expone el estado a través de métodos del objeto tabla, que el
 * React Compiler no puede seguir; este componente queda fuera de la memoización automática.
 */

export type AlineacionColumna = 'izquierda' | 'derecha' | 'centro';

export interface ColumnaTabla<T extends RowData> {
  id: string;
  encabezado: string;
  /** Valor de la celda; también se usa para ordenar. */
  valor: (fila: T) => unknown;
  /** Presentación de la celda. Si se omite se muestra el valor como texto. */
  celda?: (fila: T) => ReactNode;
  alineacion?: AlineacionColumna;
  /** Ancho inicial en píxeles. */
  ancho?: number;
  anchoMinimo?: number;
  ordenable?: boolean;
  /** Tipo para el orden: texto (sin tildes), número o alfanumérico (códigos). */
  tipo?: 'texto' | 'numero' | 'codigo';
  /**
   * Peso visual del texto: principal (texto-1, por defecto), secundario (texto-2) o tenue
   * (texto-3). Sirve para que las columnas de apoyo retrocedan frente a las importantes.
   */
  tono?: 'principal' | 'secundario' | 'tenue';
  /** Códigos y referencias (pedido, factura, lote): fuente mono discreta. */
  codigo?: boolean;
  /**
   * Texto completo al pasar el cursor. Por defecto es el valor de la celda cuando es texto o
   * número; devuelve null para no mostrar ninguno.
   */
  titulo?: (fila: T) => string | null | undefined;
}

export interface OrdenTabla {
  id: string;
  desc: boolean;
}

export type TamanoPagina = number | 'todas';

export interface PropsTablaDatos<T extends RowData> {
  filas: readonly T[];
  columnas: readonly ColumnaTabla<T>[];
  idFila: (fila: T) => string;
  /** Nombre accesible de la tabla. */
  etiqueta: string;
  seleccionada?: string | null;
  /** Abrir una fila (clic o Enter). `origen` es el centro de la fila, para que la ventana nazca de ella. */
  onAbrirFila?: (fila: T, origen: { x: number; y: number }) => void;
  orden?: OrdenTabla[];
  onOrden?: (orden: OrdenTabla[]) => void;
  /**
   * Las filas ya llegan ordenadas (por una regla propia de la pantalla): la tabla solo marca la columna y
   * avisa con `onOrden`, sin volver a ordenar con sus propios criterios.
   */
  ordenExterno?: boolean;
  pagina?: number;
  onPagina?: (pagina: number) => void;
  tamanoPagina?: TamanoPagina;
  onTamanoPagina?: (tamano: TamanoPagina) => void;
  tamanosPagina?: readonly TamanoPagina[];
  cargando?: boolean;
  /** Contenido cuando no hay filas. */
  vacio?: ReactNode;
  /** Altura máxima del área desplazable (CSS). Por defecto ocupa el alto disponible. */
  altoMaximo?: string;
  /** Texto del conteo: "pedidos", "clientes". */
  nombrePlural?: string;
  /** Densidad de filas: normal (44 px) o compacta (36 px, para reportes largos). */
  densidad?: 'normal' | 'compacta';
  /** Contenido extra en el pie, tras el conteo (totales, leyenda). */
  pie?: ReactNode;
  className?: string;
}

const FEATURES = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text, basic: sortFn_basic },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  columnSizingFeature,
  columnResizingFeature,
});

const UMBRAL_VIRTUAL = 200;
const ALTO_FILA = { normal: 44, compacta: 36 } as const;
const FORMATO_CONTEO = new Intl.NumberFormat(LOCALE);

function vacioCelda(v: unknown) {
  return v === null || v === undefined || (typeof v === 'string' && v.trim() === '');
}

export function TablaDatos<T extends RowData>({
  filas,
  columnas,
  idFila,
  etiqueta,
  seleccionada,
  onAbrirFila,
  orden,
  onOrden,
  ordenExterno = false,
  pagina,
  onPagina,
  tamanoPagina,
  onTamanoPagina,
  tamanosPagina = [25, 50, 100, 'todas'],
  cargando,
  vacio,
  altoMaximo,
  nombrePlural = 'filas',
  densidad = 'normal',
  pie,
  className,
}: PropsTablaDatos<T>) {
  'use no memo';
  const [ordenInterno, setOrdenInterno] = useState<OrdenTabla[]>([]);
  const [paginaInterna, setPaginaInterna] = useState(0);
  const [tamanoInterno, setTamanoInterno] = useState<TamanoPagina>(tamanosPagina[0] ?? 25);
  const [anchos, setAnchos] = useState<ColumnSizingState>({});
  const [foco, setFoco] = useState(0);
  const [desplazada, setDesplazada] = useState(false);
  // Hay columnas fuera de la vista a la derecha: se muestra una sombra de borde como señal.
  const [masDerecha, setMasDerecha] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);
  const medirDerecha = () => {
    const el = contenedor.current;
    if (!el) return;
    const hay = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
    setMasDerecha((antes) => (antes === hay ? antes : hay));
  };
  // Se mide con cada cambio de tamaño. El ResizeObserver avisa también la primera vez, ya con el
  // diseño calculado: medir aquí directamente forzaba un cálculo de diseño de toda la página al montar.
  // biome-ignore lint/correctness/useExhaustiveDependencies: solo al montar; el observador hace el resto
  useEffect(() => {
    const el = contenedor.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observador = new ResizeObserver(() => medirDerecha());
    observador.observe(el);
    if (el.firstElementChild) observador.observe(el.firstElementChild);
    return () => observador.disconnect();
  }, []);
  const cuerpo = useRef<HTMLTableSectionElement>(null);

  const ordenActual = orden ?? ordenInterno;
  const tamano = tamanoPagina ?? tamanoInterno;
  const todas = tamano === 'todas';
  const tamanoNumerico = todas ? Math.max(filas.length, 1) : tamano;
  const paginaActual = pagina ?? paginaInterna;

  const sorting: SortingState = ordenActual.map((o) => ({ id: o.id, desc: o.desc }));
  const pagination: PaginationState = { pageIndex: paginaActual, pageSize: tamanoNumerico };

  const columnasTabla: ColumnDef<typeof FEATURES, T, unknown>[] = columnas.map((c) => ({
    id: c.id,
    accessorFn: (fila: T) => c.valor(fila),
    header: c.encabezado,
    size: c.ancho ?? 160,
    minSize: c.anchoMinimo ?? 64,
    enableSorting: c.ordenable ?? true,
    sortFn: c.tipo === 'numero' ? 'basic' : c.tipo === 'codigo' ? 'alphanumeric' : 'text',
    sortUndefined: 'last',
  }));

  const tabla = useTable({
    features: FEATURES,
    columns: columnasTabla,
    data: filas as T[],
    getRowId: (fila: T) => idFila(fila),
    columnResizeMode: 'onChange',
    enableSortingRemoval: true,
    enableMultiSort: false,
    manualSorting: ordenExterno,
    autoResetPageIndex: false,
    state: { sorting, pagination, columnSizing: anchos },
    onSortingChange: (u) => {
      const nuevo = typeof u === 'function' ? u(sorting) : u;
      const valor = nuevo.map((s) => ({ id: s.id, desc: s.desc }));
      setOrdenInterno(valor);
      onOrden?.(valor);
      cambiarPagina(0);
    },
    onPaginationChange: (u) => {
      const nuevo = typeof u === 'function' ? u(pagination) : u;
      if (nuevo.pageIndex !== paginaActual) cambiarPagina(nuevo.pageIndex);
    },
    onColumnSizingChange: setAnchos,
  });

  function cambiarPagina(p: number) {
    setPaginaInterna(p);
    onPagina?.(p);
    setFoco(0);
    contenedor.current?.scrollTo({ top: 0 });
  }

  function cambiarTamano(t: TamanoPagina) {
    setTamanoInterno(t);
    onTamanoPagina?.(t);
    cambiarPagina(0);
  }

  const filasVisibles = tabla.getRowModel().rows;
  const totalPaginas = Math.max(tabla.getPageCount(), 1);
  const virtual = filasVisibles.length > UMBRAL_VIRTUAL;

  // Si los filtros reducen las filas, la página actual puede quedar fuera de rango.
  useEffect(() => {
    if (!cargando && paginaActual > 0 && paginaActual >= totalPaginas)
      cambiarPagina(totalPaginas - 1);
  });

  const virtualizador = useVirtualizer({
    count: virtual ? filasVisibles.length : 0,
    // Sin virtualizar no se le da el contenedor: el virtualizador lo mediría (clientWidth) en cada
    // montaje y forzaría un cálculo de diseño de toda la página antes del primer pintado.
    getScrollElement: () => (virtual ? contenedor.current : null),
    estimateSize: () => ALTO_FILA[densidad],
    overscan: 12,
  });
  const itemsVirtuales = virtual ? virtualizador.getVirtualItems() : [];
  const rellenoArriba = virtual ? (itemsVirtuales[0]?.start ?? 0) : 0;
  const rellenoAbajo = virtual
    ? virtualizador.getTotalSize() - (itemsVirtuales[itemsVirtuales.length - 1]?.end ?? 0)
    : 0;
  const indicesRender = virtual
    ? itemsVirtuales.map((v) => v.index)
    : filasVisibles.map((_, i) => i);

  const abrir = (fila: T, el: HTMLElement) => {
    if (!onAbrirFila) return;
    const r = el.getBoundingClientRect();
    onAbrirFila(fila, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  const enfocarFila = (indice: number) => {
    const i = Math.min(Math.max(indice, 0), filasVisibles.length - 1);
    setFoco(i);
    if (virtual) virtualizador.scrollToIndex(i, { align: 'auto' });
    requestAnimationFrame(() => {
      cuerpo.current?.querySelector<HTMLElement>(`tr[data-indice="${i}"]`)?.focus();
    });
  };

  const teclado = (e: KeyboardEvent<HTMLTableSectionElement>) => {
    const paso = Math.max(
      1,
      Math.floor((contenedor.current?.clientHeight ?? 440) / ALTO_FILA[densidad]) - 1,
    );
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        enfocarFila(foco + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        enfocarFila(foco - 1);
        break;
      case 'Home':
        e.preventDefault();
        enfocarFila(0);
        break;
      case 'End':
        e.preventDefault();
        enfocarFila(filasVisibles.length - 1);
        break;
      case 'PageDown':
        e.preventDefault();
        if (!todas && tabla.getCanNextPage()) cambiarPagina(paginaActual + 1);
        else enfocarFila(foco + paso);
        break;
      case 'PageUp':
        e.preventDefault();
        if (!todas && paginaActual > 0) cambiarPagina(paginaActual - 1);
        else enfocarFila(foco - paso);
        break;
      case 'Enter': {
        const fila = filasVisibles[foco];
        if (fila && e.target instanceof HTMLElement) {
          e.preventDefault();
          abrir(fila.original, e.target);
        }
        break;
      }
    }
  };

  const total = filas.length;
  const desde = total === 0 ? 0 : paginaActual * tamanoNumerico + 1;
  const hasta = Math.min(total, (paginaActual + 1) * tamanoNumerico);
  const anchoTotal = tabla.getTotalSize();
  const encabezados = tabla.getHeaderGroups();
  const nColumnas = columnas.length;
  const colAlineacion = new Map(columnas.map((c) => [c.id, c.alineacion ?? 'izquierda']));
  const colCelda = new Map(columnas.map((c) => [c.id, c.celda]));
  const colDef = new Map(columnas.map((c) => [c.id, c]));

  return (
    <div className={cn('flex min-h-0 flex-col', className)}>
      <div className="relative flex min-h-0 flex-1 flex-col">
        <span aria-hidden className="sombra-mas-derecha" data-visible={masDerecha || undefined} />
        <div
          ref={contenedor}
          data-desplazada={desplazada || undefined}
          onScroll={(e) => {
            const izq = e.currentTarget.scrollLeft > 0;
            if (izq !== desplazada) setDesplazada(izq);
            medirDerecha();
          }}
          className="relative min-h-0 flex-1 overflow-auto"
          style={altoMaximo ? { maxHeight: altoMaximo } : undefined}
        >
          <table
            aria-label={etiqueta}
            aria-rowcount={total + 1}
            aria-busy={cargando || undefined}
            data-densidad={densidad}
            className="tabla-datos"
            style={{ width: `max(${anchoTotal}px, 100%)` }}
          >
            <colgroup>
              {tabla.getAllLeafColumns().map((c) => (
                <col key={c.id} style={{ width: c.getSize() }} />
              ))}
            </colgroup>
            <thead>
              {encabezados.map((grupo) => (
                <tr key={grupo.id}>
                  {grupo.headers.map((h, i) => {
                    const ordenada = h.column.getIsSorted();
                    const puedeOrdenar = h.column.getCanSort();
                    const alineacion = colAlineacion.get(h.column.id) ?? 'izquierda';
                    return (
                      <th
                        key={h.id}
                        scope="col"
                        data-fija={i === 0 || undefined}
                        data-alineacion={alineacion}
                        aria-sort={
                          ordenada === 'asc'
                            ? 'ascending'
                            : ordenada === 'desc'
                              ? 'descending'
                              : undefined
                        }
                        className="relative"
                      >
                        {puedeOrdenar ? (
                          <button
                            type="button"
                            onClick={h.column.getToggleSortingHandler()}
                            className={cn(
                              'group/orden -mx-1 inline-flex h-6 max-w-full items-center gap-1 rounded-mini px-1',
                              'transition-colors duration-(--t-hover) hover:text-texto-1',
                              ordenada && 'text-texto-1',
                              alineacion === 'derecha' && 'flex-row-reverse',
                            )}
                          >
                            <span className="truncate" title={String(h.column.columnDef.header)}>
                              {String(h.column.columnDef.header)}
                            </span>
                            <IconoOrden
                              tamano={12}
                              className={cn(
                                'flex-none transition-transform duration-(--t-estado) ease-salida',
                                // Sin orden, el icono no reserva sitio: el encabezado usa todo el
                                // ancho de la columna y la flecha aparece al pasar o con el foco.
                                ordenada
                                  ? 'opacity-100'
                                  : 'hidden opacity-60 group-hover/orden:block group-focus-visible/orden:block',
                                ordenada === 'desc' && 'rotate-180',
                              )}
                            />
                          </button>
                        ) : (
                          <span className="truncate" title={String(h.column.columnDef.header)}>
                            {String(h.column.columnDef.header)}
                          </span>
                        )}
                        <span
                          aria-hidden
                          className="asa-columna"
                          data-activa={h.column.getIsResizing() || undefined}
                          onMouseDown={h.getResizeHandler()}
                          onTouchStart={h.getResizeHandler()}
                          onDoubleClick={() => h.column.resetSize()}
                        />
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody ref={cuerpo} onKeyDown={teclado}>
              {cargando ? (
                Array.from({ length: 8 }, (_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: filas de esqueleto sin identidad
                  <tr key={i}>
                    {columnas.map((c, j) => (
                      <td
                        key={c.id}
                        data-fija={j === 0 || undefined}
                        data-alineacion={c.alineacion}
                      >
                        <Esqueleto
                          className={cn(
                            'inline-block max-w-full align-middle',
                            j === 0
                              ? 'w-24'
                              : c.alineacion === 'derecha'
                                ? 'w-12'
                                : (i + j) % 3 === 0
                                  ? 'w-14'
                                  : (i + j) % 3 === 1
                                    ? 'w-24'
                                    : 'w-18',
                          )}
                          style={{ opacity: 1 - i * 0.09 }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filasVisibles.length === 0 ? (
                <tr>
                  <td colSpan={nColumnas} className="h-auto! border-0!">
                    {vacio ?? (
                      <EstadoVacio
                        dibujo="busqueda"
                        titulo="No hay resultados"
                        descripcion="Ningún registro coincide con la búsqueda y los filtros actuales."
                        compacto
                      />
                    )}
                  </td>
                </tr>
              ) : (
                <>
                  {rellenoArriba > 0 ? (
                    <tr aria-hidden style={{ height: rellenoArriba }}>
                      <td colSpan={nColumnas} className="h-auto! border-0! p-0!" />
                    </tr>
                  ) : null}
                  {indicesRender.map((indice) => {
                    const fila = filasVisibles[indice];
                    if (!fila) return null;
                    const id = fila.id;
                    return (
                      <tr
                        key={id}
                        data-fila
                        data-indice={indice}
                        data-seleccionada={seleccionada === id || undefined}
                        aria-selected={seleccionada === id}
                        aria-rowindex={paginaActual * tamanoNumerico + indice + 2}
                        tabIndex={indice === foco ? 0 : -1}
                        onFocus={() => setFoco(indice)}
                        onClick={(e: MouseEvent<HTMLTableRowElement>) =>
                          abrir(fila.original, e.currentTarget)
                        }
                        className={onAbrirFila ? 'cursor-pointer' : undefined}
                      >
                        {fila.getAllCells().map((celda, j) => {
                          const v = celda.getValue();
                          const presentar = colCelda.get(celda.column.id);
                          const contenido = presentar ? presentar(fila.original) : v;
                          const vacia =
                            contenido === null ||
                            contenido === undefined ||
                            (!presentar && vacioCelda(v));
                          const def = colDef.get(celda.column.id);
                          const titulo = vacia
                            ? undefined
                            : def?.titulo
                              ? (def.titulo(fila.original) ?? undefined)
                              : typeof v === 'string' || typeof v === 'number'
                                ? String(v)
                                : undefined;
                          return (
                            <td
                              key={celda.id}
                              data-fija={j === 0 || undefined}
                              data-alineacion={colAlineacion.get(celda.column.id)}
                              data-tono={def?.tono}
                              data-codigo={def?.codigo || undefined}
                              title={titulo}
                            >
                              {j === 0 ? (
                                <div className="celda-fija">
                                  {vacia ? (
                                    <span className="text-texto-3">—</span>
                                  ) : (
                                    (contenido as ReactNode)
                                  )}
                                </div>
                              ) : vacia ? (
                                <span className="text-texto-3">—</span>
                              ) : (
                                (contenido as ReactNode)
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                  {rellenoAbajo > 0 ? (
                    <tr aria-hidden style={{ height: rellenoAbajo }}>
                      <td colSpan={nColumnas} className="h-auto! border-0! p-0!" />
                    </tr>
                  ) : null}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="flex h-12 flex-none items-center gap-4 border-t border-linea pr-3 pl-4.5 text-etiqueta text-texto-3">
        <span className="cifras" aria-live="polite">
          {cargando ? (
            <Esqueleto className="inline-block w-28 align-middle" />
          ) : total === 0 ? (
            <>Sin {nombrePlural}</>
          ) : (
            <>
              <b className="font-medium text-texto-1">
                {FORMATO_CONTEO.format(desde)}–{FORMATO_CONTEO.format(hasta)}
              </b>{' '}
              de {FORMATO_CONTEO.format(total)} {nombrePlural}
            </>
          )}
        </span>
        {pie ? <div className="flex min-w-0 items-center gap-3">{pie}</div> : null}
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span>Por página</span>
            <Selector
              tamano="sm"
              aria-label="Filas por página"
              className="w-24"
              valor={String(tamano)}
              onCambio={(v) => cambiarTamano(v === 'todas' ? 'todas' : Number(v))}
              opciones={tamanosPagina.map((t) => ({
                valor: String(t),
                etiqueta: t === 'todas' ? 'Todas' : String(t),
              }))}
            />
          </div>
          <Paginador
            pagina={paginaActual}
            total={totalPaginas}
            onPagina={cambiarPagina}
            deshabilitado={todas || cargando}
          />
        </div>
      </footer>
    </div>
  );
}

/** Páginas visibles: primera, última, actual y vecinas, con huecos marcados. */
function paginasVisibles(actual: number, total: number): (number | 'hueco')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const set = new Set([0, total - 1, actual - 1, actual, actual + 1]);
  if (actual <= 2) for (const p of [1, 2, 3]) set.add(p);
  if (actual >= total - 3) for (const p of [total - 4, total - 3, total - 2]) set.add(p);
  const lista = [...set].filter((p) => p >= 0 && p < total).sort((a, b) => a - b);
  const salida: (number | 'hueco')[] = [];
  lista.forEach((p, i) => {
    const previo = lista[i - 1];
    if (i > 0 && previo !== undefined && p - previo > 1) salida.push('hueco');
    salida.push(p);
  });
  return salida;
}

function Paginador({
  pagina,
  total,
  onPagina,
  deshabilitado,
}: {
  pagina: number;
  total: number;
  onPagina: (p: number) => void;
  deshabilitado?: boolean;
}) {
  const clase =
    'cifras grid h-7 min-w-7 place-items-center rounded-elemento px-1 font-medium text-texto-2 transition-colors duration-(--t-hover) hover:not-disabled:bg-lavado-2 hover:not-disabled:text-texto-1 disabled:opacity-35';
  return (
    <nav aria-label="Paginación" className="flex items-center gap-0.5">
      <button
        type="button"
        className={clase}
        aria-label="Página anterior"
        disabled={deshabilitado || pagina === 0}
        onClick={() => onPagina(pagina - 1)}
      >
        <IconoChevronIzquierda tamano={16} />
      </button>
      {paginasVisibles(pagina, total).map((p, i) =>
        p === 'hueco' ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: separador sin identidad propia
          <span key={`h${i}`} className="grid h-7 w-5 place-items-center text-texto-3">
            ·
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={cn(
              clase,
              p === pagina &&
                'bg-lavado-2 text-texto-1 shadow-[inset_0_0_0_1px_var(--linea-fuerte)]',
            )}
            aria-current={p === pagina ? 'page' : undefined}
            disabled={deshabilitado}
            onClick={() => onPagina(p)}
          >
            {p + 1}
          </button>
        ),
      )}
      <button
        type="button"
        className={clase}
        aria-label="Página siguiente"
        disabled={deshabilitado || pagina >= total - 1}
        onClick={() => onPagina(pagina + 1)}
      >
        <IconoChevronDerecha tamano={16} />
      </button>
    </nav>
  );
}
