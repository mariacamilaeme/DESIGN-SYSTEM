import { type ReactNode, useRef, useState } from 'react';
import { TransicionVista } from '../componentes/TransicionVista';
import { CLAVES_PREFERENCIA, guardarPreferencia, leerPreferencia } from '../lib/almacen';
import { useAtajo } from '../lib/atajos';
import { useTema } from '../lib/tema';
import { Avisos } from '../ui/avisos';
import { ProveedorPistas } from '../ui/pista';
import { BarraLateral } from './BarraLateral';
import { BarraSuperior } from './BarraSuperior';
import { type AccionesArmazon, ContextoArmazon, rutaCoincide } from './contexto';
import { PaletaComandos } from './PaletaComandos';
import type {
  AccionPie,
  ContadorNav,
  DestinoNavegacion,
  ElementoPaleta,
  EstadoPie,
  FuentePaleta,
  GrupoNavegacion,
  MarcaArmazon,
} from './tipos';

/*
 * Armazón de una herramienta Obsidiana: barra lateral, barra superior, área de trabajo con luz
 * ambiental y grano, paleta de comandos (Ctrl K), atajo para plegar la barra (Ctrl B) y avisos.
 *
 * Funciona con cualquier enrutador: recibe la ruta actual (`rutaActual`) y una función para
 * navegar (`navegar`); los enlaces son <a href> reales con la dirección de `hrefDe`.
 *
 *   <Armazon marca={marca} navegacion={NAVEGACION} rutaActual={ruta} navegar={ir}>
 *     <PantallaActual />
 *   </Armazon>
 */

export interface PropsArmazon {
  marca: MarcaArmazon;
  /** Grupos de la barra lateral; también forman el grupo "Ir a" de la paleta. */
  navegacion: readonly GrupoNavegacion[];
  rutaActual: string;
  navegar: (ruta: string) => void;
  /** Dirección de una ruta para el atributo href. Por defecto, la propia ruta. */
  hrefDe?: (ruta: string) => string;
  /** Contadores de la barra lateral, por ruta de destino. */
  contadores?: Readonly<Record<string, ContadorNav | null | undefined>>;
  /** Destinos que no van en la barra lateral pero sí en la paleta y en la miga (ajustes, sistema). */
  destinosExtra?: readonly DestinoNavegacion[];
  /** Segundo nivel de la miga de pan ("Informes › Ventas"). */
  subnivel?: string | null;
  /** Línea de estado del pie de la barra lateral. */
  estadoPie?: EstadoPie;
  /** Acciones del pie de la barra lateral. */
  accionesPie?: readonly AccionPie[];
  /** Acciones de la barra superior, antes del conmutador de tema. */
  accionesSuperior?: ReactNode;
  /** Texto del buscador de la barra superior. */
  textoBuscador?: string;
  /** Marcador del campo de la paleta. */
  marcadorPaleta?: string;
  /** Acciones globales de la paleta. */
  comandos?: readonly ElementoPaleta[];
  /** Datos buscables de la paleta. */
  fuentesPaleta?: readonly FuentePaleta[];
  /** Clave de la transición de vista. Por defecto, la ruta actual. */
  claveVista?: string;
  children: ReactNode;
}

const identidad = (ruta: string) => ruta;

export function Armazon({
  marca,
  navegacion,
  rutaActual,
  navegar,
  hrefDe = identidad,
  contadores,
  destinosExtra = [],
  subnivel,
  estadoPie,
  accionesPie,
  accionesSuperior,
  textoBuscador,
  marcadorPaleta,
  comandos,
  fuentesPaleta,
  claveVista,
  children,
}: PropsArmazon) {
  const tema = useTema();
  const contenedor = useRef<HTMLDivElement>(null);
  const [plegada, setPlegada] = useState(
    () => leerPreferencia(CLAVES_PREFERENCIA.lateralPlegada) === '1',
  );
  const [paleta, setPaleta] = useState(false);

  const alternarLateral = () => {
    setPlegada((p) => {
      guardarPreferencia(CLAVES_PREFERENCIA.lateralPlegada, p ? '0' : '1');
      return !p;
    });
  };

  const acciones: AccionesArmazon = {
    abrirPaleta: () => setPaleta(true),
    alternarLateral,
    lateralPlegada: plegada,
    navegar,
    hrefDe,
    rutaActual,
  };

  useAtajo({ tecla: 'k', mod: true, enCampos: true }, () => setPaleta((a) => !a));
  useAtajo({ tecla: 'b', mod: true, enCampos: true }, alternarLateral);

  const destinos = [...navegacion.flatMap((g) => g.destinos), ...destinosExtra];
  // El destino más específico gana (/informes/ventas antes que /informes); '/' solo exacto.
  const destino =
    destinos
      .filter((d) => rutaCoincide(d.ruta, rutaActual))
      .sort((a, b) => b.ruta.length - a.ruta.length)[0] ?? null;

  return (
    <ContextoArmazon value={acciones}>
      <ProveedorPistas>
        {/* Salto al contenido: primer Tab de la página; invisible hasta recibir el foco. */}
        <a
          href="#contenido"
          onClick={(e) => {
            // Sin cambiar la dirección: con enrutado por hash, "#contenido" sería una ruta.
            e.preventDefault();
            document.getElementById('contenido')?.focus();
          }}
          className="flotante pointer-events-none fixed top-3 left-3 z-60 rounded-control px-3 py-1.5 font-medium text-texto-1 opacity-0 focus-visible:pointer-events-auto focus-visible:opacity-100"
        >
          Saltar al contenido
        </a>
        <div ref={contenedor} className="flex h-full min-w-(--ancho-trabajo-min) bg-lienzo">
          <BarraLateral
            marca={marca}
            navegacion={navegacion}
            contadores={contadores}
            estadoPie={estadoPie}
            accionesPie={accionesPie}
          />
          <div className="relative flex min-w-0 flex-1 flex-col">
            <div aria-hidden className="lienzo-luz pointer-events-none absolute inset-0" />
            <div aria-hidden className="grano pointer-events-none absolute inset-0" />
            <BarraSuperior
              nombre={marca.nombre}
              rutaInicio={marca.ruta}
              destino={destino}
              subnivel={subnivel}
              textoBuscador={textoBuscador}
              acciones={accionesSuperior}
            />
            <main
              id="contenido"
              tabIndex={-1}
              className="relative min-h-0 flex-1 overflow-auto focus-visible:outline-none"
            >
              <TransicionVista clave={claveVista ?? rutaActual}>{children}</TransicionVista>
            </main>
          </div>
        </div>
        <PaletaComandos
          abierta={paleta}
          onAbiertaCambio={setPaleta}
          destinos={destinos}
          comandos={comandos}
          fuentes={fuentesPaleta}
          marcador={marcadorPaleta ?? textoBuscador}
          contenedor={contenedor}
        />
        <Avisos tema={tema} />
      </ProveedorPistas>
    </ContextoArmazon>
  );
}
