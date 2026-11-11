import type { ReactNode } from 'react';
import { IconoBuscar, IconoChevronDerecha } from '../iconos';
import { Tecla } from '../ui/tecla';
import { Enlace, useArmazon } from './contexto';
import { InterruptorTema } from './InterruptorTema';
import type { DestinoNavegacion } from './tipos';

/*
 * Barra superior (56 px): miga de pan, buscador que abre la paleta (Ctrl K), acciones propias de
 * la herramienta y conmutador de tema. La miga tiene uno o dos niveles:
 * "Marca › Destino" o, con `subnivel`, "Marca › Destino › Subnivel" (el destino pasa a enlace).
 */

export interface PropsBarraSuperior {
  /** Nombre de la herramienta: raíz de la miga. */
  nombre: string;
  /** Ruta de la raíz de la miga. Por defecto, '/'. */
  rutaInicio?: string;
  /** Destino de la vista actual (o null en una ruta desconocida). */
  destino?: DestinoNavegacion | null;
  /** Segundo nivel de la miga ("Informes › Ventas"). */
  subnivel?: string | null;
  /** Texto del buscador. */
  textoBuscador?: string;
  /** Acciones a la derecha, antes del conmutador de tema (un menú, un botón). */
  acciones?: ReactNode;
}

export function BarraSuperior({
  nombre,
  rutaInicio = '/',
  destino,
  subnivel,
  textoBuscador = 'Buscar o ir a…',
  acciones,
}: PropsBarraSuperior) {
  const { abrirPaleta } = useArmazon();
  const Icono = destino?.icono;

  return (
    <header className="relative z-10 grid h-(--alto-superior) flex-none grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-6 border-b border-linea pr-5 pl-8">
      <nav aria-label="Ubicación" className="flex min-w-0 items-center gap-1.5 text-cuerpo">
        <Enlace
          ruta={rutaInicio}
          className="shrink-0 rounded-elemento px-1 font-medium text-texto-3 transition-colors duration-(--t-hover) hover:text-texto-1"
        >
          {nombre}
        </Enlace>
        {destino && subnivel ? (
          <>
            <IconoChevronDerecha tamano={14} className="text-texto-4" />
            <Enlace
              ruta={destino.ruta}
              className="flex shrink-0 items-center gap-2 rounded-elemento px-1 font-medium text-texto-3 transition-colors duration-(--t-hover) hover:text-texto-1"
            >
              {Icono ? <Icono tamano={16} /> : null}
              {destino.nombre}
            </Enlace>
            <IconoChevronDerecha tamano={14} className="text-texto-4" />
            <span aria-current="page" className="truncate px-1 font-medium text-texto-1">
              {subnivel}
            </span>
          </>
        ) : destino ? (
          <>
            <IconoChevronDerecha tamano={14} className="text-texto-4" />
            <span
              aria-current="page"
              className="flex min-w-0 items-center gap-2 px-1 font-medium text-texto-1"
            >
              {Icono ? <Icono tamano={16} className="text-texto-3" /> : null}
              <span className="truncate">{destino.nombre}</span>
            </span>
          </>
        ) : null}
      </nav>

      <button
        type="button"
        onClick={abrirPaleta}
        aria-label={`${textoBuscador} (Ctrl K)`}
        aria-keyshortcuts="Control+K"
        className="group flex h-control w-95 items-center gap-2.5 rounded-control border border-linea bg-lavado pr-1.5 pl-2.5 text-texto-3 transition-[background-color,border-color,color] duration-(--t-hover) hover:border-linea-fuerte hover:bg-lavado-2 hover:text-texto-2"
      >
        <IconoBuscar tamano={16} />
        <span className="flex-1 truncate text-left">{textoBuscador}</span>
        <span className="flex gap-0.5">
          <Tecla tamano="sm">Ctrl</Tecla>
          <Tecla tamano="sm">K</Tecla>
        </span>
      </button>

      <div className="flex items-center justify-end gap-2">
        {acciones ? (
          <>
            {acciones}
            <span aria-hidden className="mx-1 h-5 w-px bg-linea" />
          </>
        ) : null}
        <InterruptorTema />
      </div>
    </header>
  );
}
