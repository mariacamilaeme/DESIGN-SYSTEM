import { Command } from 'cmdk';
import { Dialog } from 'radix-ui';
import { type ReactNode, type RefObject, useDeferredValue, useEffect, useState } from 'react';
import {
  type ComponenteIcono,
  IconoBuscar,
  IconoFlecha,
  IconoLateral,
  IconoLuna,
  IconoSol,
} from '../iconos';
import { cn } from '../lib/cn';
import { LOCALE } from '../lib/formato';
import { alternarTema, useTema } from '../lib/tema';
import { normalizarTexto } from '../lib/texto';
import { Tecla } from '../ui/tecla';
import { useArmazon } from './contexto';
import {
  type ElementoIndexado,
  filtrarPaleta,
  indexarPaleta,
  useAccionesPantalla,
} from './registro';
import type { DestinoNavegacion, ElementoPaleta, FuentePaleta } from './tipos';

/*
 * Paleta de comandos (Ctrl K). Grande, centrada, con resultados agrupados y navegación por teclado.
 * Se abre y se cierra sin animación: se usa decenas de veces al día y debe sentirse instantánea.
 * Grupos: los de datos (`fuentes`, solo con un término), "Ir a" (la navegación) y "Acciones"
 * (las de la herramienta, las de la pantalla montada y las del armazón: tema y barra lateral).
 *
 * La búsqueda la hace la paleta y no cmdk (shouldFilter={false}): los textos de cada fuente se
 * normalizan una vez por arreglo de elementos (indexarPaleta) y cada grupo de datos muestra como
 * mucho MAX_POR_GRUPO resultados, con «Ver las N coincidencias» hacia la lista. Así teclear no
 * vuelve a montar cientos de elementos. Coincidencia literal sin mayúsculas ni tildes.
 */

const MAX_POR_GRUPO = 8;
const FORMATO = new Intl.NumberFormat(LOCALE);

/** Índices por arreglo de elementos: se rehacen solo cuando los datos cambian. */
const cacheIndices = new WeakMap<readonly ElementoPaleta[], ElementoIndexado[]>();

function indiceDe(elementos: readonly ElementoPaleta[]) {
  let indice = cacheIndices.get(elementos);
  if (!indice) {
    indice = indexarPaleta(elementos);
    cacheIndices.set(elementos, indice);
  }
  return indice;
}

interface ElementoFijo {
  clave: string;
  valor: string;
  claves?: string;
  icono?: ComponenteIcono;
  onSelect: () => void;
  atajo?: readonly string[];
  detalle?: ReactNode;
}

const coincide = (termino: string, valor: string, claves?: string) =>
  !termino || normalizarTexto(`${valor} ${claves ?? ''}`).includes(termino);

/** El término empieza una palabra del nombre o de sus claves ("tema" en "Cambiar a tema"). */
const alInicioDePalabra = (termino: string, valor: string, claves?: string) =>
  !!termino && ` ${normalizarTexto(`${valor} ${claves ?? ''}`)}`.includes(` ${termino}`);

export interface PropsPaletaComandos {
  abierta: boolean;
  onAbiertaCambio: (abierta: boolean) => void;
  /** Destinos del grupo "Ir a". */
  destinos: readonly DestinoNavegacion[];
  /** Acciones de la herramienta (además de las de la pantalla y las del armazón). */
  comandos?: readonly ElementoPaleta[];
  /** Datos buscables (pedidos, clientes…). */
  fuentes?: readonly FuentePaleta[];
  marcador?: string;
  /** Contenedor de la aplicación, que se oculta a los lectores de pantalla mientras está abierta. */
  contenedor?: RefObject<HTMLElement | null>;
}

export function PaletaComandos({
  abierta,
  onAbiertaCambio,
  destinos,
  comandos = [],
  fuentes = [],
  marcador = 'Buscar o ir a…',
  contenedor,
}: PropsPaletaComandos) {
  const armazon = useArmazon();
  const tema = useTema();
  const [busqueda, setBusqueda] = useState('');
  // Los grupos de datos siguen a la búsqueda sin frenar la escritura.
  const busquedaDiferida = useDeferredValue(busqueda);
  const termino = normalizarTexto(busqueda.trim());
  const terminoDatos = normalizarTexto(busquedaDiferida.trim());
  const accionesPantalla = useAccionesPantalla();

  // Sin el modo modal de Radix, la aplicación se oculta a mano a los lectores de pantalla mientras
  // la paleta está abierta (un atributo en el contenedor: no recalcula estilos como pointer-events).
  useEffect(() => {
    const raiz = contenedor?.current;
    if (!abierta || !raiz) return;
    // Si otra ventana ya lo había ocultado, se deja como estaba al cerrar.
    const previo = raiz.getAttribute('aria-hidden');
    raiz.setAttribute('aria-hidden', 'true');
    return () => {
      if (previo === null) raiz.removeAttribute('aria-hidden');
      else raiz.setAttribute('aria-hidden', previo);
    };
  }, [abierta, contenedor]);

  const cerrar = () => {
    onAbiertaCambio(false);
    setBusqueda('');
    // Al volver a abrir, el resaltado vuelve al primer elemento.
    setAnterior((a) => ({ ...a, primero: '' }));
  };
  const ejecutar = (fn: () => void) => () => {
    cerrar();
    // La acción corre después de cerrar, para que el foco vuelva a su sitio primero.
    requestAnimationFrame(fn);
  };
  const ir = (ruta: string) => ejecutar(() => armazon.navegar(ruta));
  const alElegir = (e: ElementoPaleta) =>
    e.ir !== undefined ? ir(e.ir) : e.accion ? ejecutar(e.accion) : () => {};

  const irA: ElementoFijo[] = destinos.map((d) => ({
    clave: d.ruta,
    valor: `Ir a ${d.nombre}`,
    claves: d.claves,
    icono: d.icono,
    onSelect: ir(d.ruta),
    detalle: <IconoFlecha tamano={14} />,
  }));
  const nombreTema = tema === 'claro' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro';
  const nombreLateral = armazon.lateralPlegada ? 'Desplegar barra lateral' : 'Plegar barra lateral';
  const acciones: ElementoFijo[] = [
    ...[...accionesPantalla, ...comandos].map((a) => ({
      clave: a.id,
      valor: a.titulo,
      claves: `${a.subtitulo ?? ''} ${a.claves ?? ''}`,
      icono: a.icono ?? IconoFlecha,
      onSelect: alElegir(a),
      atajo: a.atajo,
    })),
    {
      clave: 'tema',
      valor: nombreTema,
      claves: 'tema apariencia modo claro oscuro',
      icono: tema === 'claro' ? IconoLuna : IconoSol,
      onSelect: ejecutar(alternarTema),
    },
    {
      clave: 'lateral',
      valor: nombreLateral,
      claves: 'barra lateral menú navegación',
      icono: IconoLateral,
      onSelect: ejecutar(armazon.alternarLateral),
      atajo: ['Ctrl', 'B'],
    },
  ];

  const irVisibles = irA.filter((e) => coincide(termino, e.valor, e.claves));
  const accionesVisibles = acciones.filter((e) => coincide(termino, e.valor, e.claves));
  // "Ir a" va antes que "Acciones" salvo que solo las acciones empiecen una palabra con el
  // término: con "tema", "Cambiar a tema claro" gana a "Sistema".
  const empiezaPalabra = (xs: ElementoFijo[]) =>
    xs.some((e) => alInicioDePalabra(termino, e.valor, e.claves));
  const accionesPrimero = empiezaPalabra(accionesVisibles) && !empiezaPalabra(irVisibles);
  const grupos = fuentes
    .map((fuente) => {
      if (!terminoDatos) return null;
      const { elementos, total, mejor } = filtrarPaleta(
        indiceDe(fuente.elementos),
        terminoDatos,
        MAX_POR_GRUPO,
      );
      if (elementos.length === 0) return null;
      return { fuente, elementos, total, mejor };
    })
    .filter((g) => g !== null)
    // El grupo cuyo título coincide mejor va primero.
    .sort((a, b) => a.mejor - b.mejor);

  /*
   * Primer elemento visible, en el orden en que se pinta. Los grupos de datos llegan un render
   * después (búsqueda diferida) y cmdk elegía el primero cuando la lista aún estaba vacía: con
   * "alta" no quedaba nada resaltado y Enter no hacía nada. La selección se fija aquí cada vez
   * que cambia el término o lo que se ve, y el teclado la mueve como siempre.
   */
  const primerGrupo = grupos[0];
  const primerDato = primerGrupo?.elementos[0];
  const primeroDatos = primerDato ? `${primerGrupo.fuente.id}-${primerDato.id}` : undefined;
  const primeroIr = irVisibles[0] ? `ir-${irVisibles[0].clave}` : undefined;
  const primeroAccion = accionesVisibles[0] ? `accion-${accionesVisibles[0].clave}` : undefined;
  const primero =
    primeroDatos ??
    (accionesPrimero ? (primeroAccion ?? primeroIr) : (primeroIr ?? primeroAccion)) ??
    '';
  const [seleccion, setSeleccion] = useState('');
  const [anterior, setAnterior] = useState({ termino: '', terminoDatos: '', primero: '' });
  if (
    anterior.termino !== termino ||
    anterior.terminoDatos !== terminoDatos ||
    anterior.primero !== primero
  ) {
    // Ajuste durante el render (sin efecto): el resaltado ya está bien en el mismo pintado.
    setAnterior({ termino, terminoDatos, primero });
    setSeleccion(primero);
  }

  return (
    <Dialog.Root
      open={abierta}
      // No modal para Radix: en modo modal pone `pointer-events: none` en <body>, y ese cambio
      // obliga a recalcular el estilo de toda la página al abrir y al cerrar. El velo ya bloquea
      // los clics de fuera, Tab no sale de la paleta (abajo) y aria-modal mantiene el aviso de
      // ventana modal para el lector de pantalla.
      modal={false}
      onOpenChange={(a) => {
        onAbiertaCambio(a);
        if (!a) {
          setBusqueda('');
          setAnterior((x) => ({ ...x, primero: '' }));
        }
      }}
    >
      <Dialog.Portal>
        {/*
         * Velo propio en lugar de Dialog.Overlay: el de Radix monta react-remove-scroll, que
         * inserta y retira una hoja de estilos en cada apertura y obliga a recalcular el estilo de
         * toda la página. Aquí no hace falta: el cuerpo no se desplaza (lo hace <main>). El velo
         * cierra por sí mismo al pulsarlo; el teclado cierra con Esc.
         */}
        <div
          aria-hidden
          className="oscurecer-modal pointer-events-auto fixed inset-0 z-50"
          onPointerDown={cerrar}
        />
        <Dialog.Content
          aria-describedby={undefined}
          aria-modal
          onKeyDown={(e) => {
            // La búsqueda es el único control con foco: Tab no lleva el foco detrás del velo.
            if (e.key === 'Tab') e.preventDefault();
          }}
          className="flotante fixed top-[14vh] left-1/2 z-50 w-(--ancho-paleta) -translate-x-1/2 overflow-hidden rounded-ventana outline-none"
        >
          <Dialog.Title className="solo-lector">Paleta de comandos</Dialog.Title>
          <Command
            shouldFilter={false}
            loop
            label="Paleta de comandos"
            value={seleccion}
            onValueChange={setSeleccion}
          >
            <div className="flex items-center gap-3 border-b border-linea px-4.5">
              <IconoBuscar tamano={18} className="text-texto-3" />
              <Command.Input
                value={busqueda}
                onValueChange={setBusqueda}
                placeholder={marcador}
                className="h-14 w-full bg-transparent text-paleta text-texto-1 outline-none placeholder:text-texto-3"
              />
              <Tecla tamano="sm">Esc</Tecla>
            </div>
            <Command.List
              label="Resultados"
              className="max-h-[min(var(--alto-paleta-lista),60vh)] scroll-py-2 overflow-auto p-2"
            >
              <Command.Empty className="px-3 py-10 text-center text-texto-3">
                Nada coincide con «{busqueda.trim()}»
              </Command.Empty>

              {/* Con un término, los datos van primero: es lo que se busca casi siempre. */}
              {grupos.map(({ fuente, elementos, total }) => (
                <Grupo key={fuente.id} titulo={fuente.grupo}>
                  {elementos.map((e) => (
                    <Elemento
                      key={e.id}
                      valor={`${fuente.id}-${e.id}`}
                      icono={e.icono}
                      onSelect={alElegir(e)}
                      atajo={e.atajo}
                      subtitulo={e.subtitulo}
                    >
                      {e.titulo}
                    </Elemento>
                  ))}
                  {total > elementos.length && fuente.verTodos ? (
                    <Elemento
                      valor={`ver-todos-${fuente.id}`}
                      icono={IconoBuscar}
                      onSelect={ir(fuente.verTodos(busquedaDiferida.trim()))}
                      detalle={<IconoFlecha tamano={14} />}
                      tenue
                    >
                      {`Ver las ${FORMATO.format(total)} coincidencias en ${fuente.grupo.toLowerCase()}`}
                    </Elemento>
                  ) : null}
                </Grupo>
              ))}

              {accionesPrimero ? grupoAcciones(accionesVisibles) : null}

              {irVisibles.length > 0 ? (
                <Grupo titulo="Ir a">
                  {irVisibles.map((e) => (
                    <Elemento
                      key={e.clave}
                      valor={`ir-${e.clave}`}
                      icono={e.icono}
                      onSelect={e.onSelect}
                      detalle={e.detalle}
                    >
                      {e.valor.replace(/^Ir a /, '')}
                    </Elemento>
                  ))}
                </Grupo>
              ) : null}

              {accionesPrimero ? null : grupoAcciones(accionesVisibles)}
            </Command.List>
            <div className="flex items-center gap-4 border-t border-linea bg-lavado px-4.5 py-2.5 text-etiqueta text-texto-3">
              <span className="flex items-center gap-1.5">
                <Tecla tamano="sm">↑</Tecla>
                <Tecla tamano="sm">↓</Tecla>
                para moverte
              </span>
              <span className="flex items-center gap-1.5">
                <Tecla tamano="sm">Enter</Tecla>
                para elegir
              </span>
              <span className="ml-auto flex items-center gap-1.5">
                <Tecla tamano="sm">Ctrl</Tecla>
                <Tecla tamano="sm">K</Tecla>
                abre y cierra
              </span>
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function grupoAcciones(acciones: ElementoFijo[]) {
  if (acciones.length === 0) return null;
  return (
    <Grupo titulo="Acciones">
      {acciones.map((e) => (
        <Elemento
          key={e.clave}
          valor={`accion-${e.clave}`}
          icono={e.icono}
          onSelect={e.onSelect}
          atajo={e.atajo}
        >
          {e.valor}
        </Elemento>
      ))}
    </Grupo>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <Command.Group
      heading={titulo}
      className={cn(
        '[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-2.5 [&_[cmdk-group-heading]]:pb-1.5',
        '[&_[cmdk-group-heading]]:text-etiqueta [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-texto-3',
        '[&+&]:mt-1',
      )}
    >
      {children}
    </Command.Group>
  );
}

function Elemento({
  valor,
  icono: Icono,
  onSelect,
  atajo,
  detalle,
  subtitulo,
  tenue,
  children,
}: {
  /** Identificador único dentro de la paleta (cmdk lo usa para la selección con teclado). */
  valor: string;
  icono?: ComponenteIcono;
  onSelect: () => void;
  atajo?: readonly string[];
  detalle?: ReactNode;
  subtitulo?: string;
  tenue?: boolean;
  children: ReactNode;
}) {
  return (
    <Command.Item
      value={valor}
      onSelect={onSelect}
      className={cn(
        'group flex h-10 cursor-pointer items-center gap-3 rounded-control px-3',
        tenue ? 'text-texto-2' : 'text-texto-1',
        'data-[selected=true]:bg-lavado-2 data-[selected=true]:text-texto-1',
      )}
    >
      {Icono ? (
        <span className="grid size-6 place-items-center rounded-elemento text-texto-3 group-data-[selected=true]:text-texto-1">
          <Icono tamano={16} />
        </span>
      ) : null}
      <span className="truncate font-medium">{children}</span>
      {subtitulo ? <span className="truncate text-etiqueta text-texto-3">{subtitulo}</span> : null}
      <span className="ml-auto flex items-center gap-1 text-texto-3 opacity-0 group-data-[selected=true]:opacity-100">
        {detalle}
      </span>
      {atajo ? (
        <span className="flex gap-0.5">
          {atajo.map((t) => (
            <Tecla key={t} tamano="sm">
              {t}
            </Tecla>
          ))}
        </span>
      ) : null}
    </Command.Item>
  );
}
