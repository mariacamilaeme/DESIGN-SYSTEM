import { lazy, type ReactNode, Suspense, useMemo } from 'react';
import {
  Armazon,
  aviso,
  Boton,
  type ElementoPaleta,
  type FuentePaleta,
  type GrupoNavegacion,
  IconoActualizar,
  IconoChevronAbajo,
  IconoClientes,
  IconoCaja,
  IconoEquipo,
  IconoAyuda,
  IconoNuevo,
  IconoPanel,
  IconoGraficaBarras,
  IconoSistema,
  Menu,
  MenuContenido,
  MenuDisparador,
  MenuElemento,
  MenuEtiqueta,
  MenuSeparador,
} from '../obsidiana';
import { CLIENTES, esAbierto, ETIQUETA_ESTADO, PEDIDOS } from './datos';
import { MarcaObsidiana, SimboloObsidiana } from './Marca';
import { NoEncontrada, Provisional } from './paginas/Otras';
import { Panel } from './paginas/Panel';
import { Pedidos } from './paginas/Pedidos';
import { hrefDe, navegar, useRuta } from './ruta';
// La página Sistema es grande y solo se visita a ratos: su código se carga al abrirla.
const Sistema = lazy(() =>
  import('./paginas/sistema/Sistema').then((m) => ({ default: m.Sistema })),
);

/*
 * Aplicación de muestra: el armazón completo con su configuración. Todo lo específico de una
 * herramienta (marca, navegación, contadores, pie, comandos y datos de la paleta) vive aquí, en
 * props: el kit no sabe nada de pedidos ni de clientes.
 */

const NAVEGACION: readonly GrupoNavegacion[] = [
  {
    nombre: 'Operación',
    destinos: [
      { ruta: '/', nombre: 'Panel', icono: IconoPanel, claves: 'inicio resumen' },
      { ruta: '/pedidos', nombre: 'Pedidos', icono: IconoCaja, claves: 'ventas órdenes' },
      { ruta: '/clientes', nombre: 'Clientes', icono: IconoClientes, claves: 'cuentas' },
    ],
  },
  {
    nombre: 'Análisis',
    destinos: [{ ruta: '/informes', nombre: 'Informes', icono: IconoGraficaBarras, claves: 'ventas' }],
  },
  {
    nombre: 'Kit',
    destinos: [
      {
        ruta: '/sistema',
        nombre: 'Sistema',
        icono: IconoSistema,
        claves: 'tokens componentes iconos diseño obsidiana',
      },
    ],
  },
];

const MARCA = {
  nombre: 'Obsidiana',
  completa: <MarcaObsidiana />,
  simbolo: <SimboloObsidiana alto={26} titulo="Obsidiana" />,
};

const CONTADORES = {
  '/pedidos': {
    n: PEDIDOS.filter(esAbierto).length,
    descripcion: 'pedidos abiertos',
    descripcionUno: 'pedido abierto',
  },
  '/clientes': { n: CLIENTES.length, descripcion: 'clientes', descripcionUno: 'cliente' },
};

const COMANDOS: readonly ElementoPaleta[] = [
  {
    id: 'nuevo-pedido',
    titulo: 'Nuevo pedido',
    claves: 'crear alta',
    icono: IconoNuevo,
    ir: '/pedidos?nuevo=1',
  },
];

/** Datos buscables en la paleta: pedidos y clientes, construidos una vez. */
const FUENTES: readonly FuentePaleta[] = [
  {
    id: 'pedidos',
    grupo: 'Pedidos',
    elementos: PEDIDOS.map((p) => ({
      id: p.id,
      titulo: p.numero,
      subtitulo: `${p.cliente} · ${ETIQUETA_ESTADO(p.estado)}`,
      claves: [p.cliente, p.guia, p.destino].filter(Boolean).join(' '),
      icono: IconoCaja,
      ir: `/pedidos?pedido=${p.id}`,
    })),
    verTodos: (q) => `/pedidos?q=${encodeURIComponent(q)}`,
  },
  {
    id: 'clientes',
    grupo: 'Clientes',
    elementos: CLIENTES.map((c) => ({
      id: c,
      titulo: c,
      subtitulo: `${PEDIDOS.filter((p) => p.cliente === c).length} pedidos`,
      icono: IconoClientes,
      ir: `/pedidos?q=${encodeURIComponent(c)}`,
    })),
  },
];

export function App() {
  const { ruta, parametros } = useRuta();
  const q = parametros.get('q') ?? '';
  const pedido = parametros.get('pedido');
  const nuevo = parametros.get('nuevo') === '1';

  const accionesPie = useMemo(
    () => [
      {
        id: 'restablecer',
        etiqueta: 'Restablecer demo',
        icono: IconoActualizar,
        alSeleccionar: () => {
          navegar('/');
          aviso.success('Demo restablecida', { description: 'Se volvió al Panel.' });
        },
      },
    ],
    [],
  );

  let vista: ReactNode;
  if (ruta === '/') vista = <Panel />;
  else if (ruta === '/pedidos')
    vista = (
      <Pedidos
        key={`${q}|${pedido}|${nuevo}`}
        busquedaInicial={q}
        pedidoInicial={pedido}
        nuevoInicial={nuevo}
      />
    );
  else if (ruta === '/clientes')
    vista = (
      <Provisional
        titulo="Clientes"
        descripcion="Fichas de cliente con su historial de pedidos."
        icono={IconoClientes}
      />
    );
  else if (ruta === '/informes')
    vista = (
      <Provisional
        titulo="Informes"
        descripcion="Ventas por periodo, categoría y destino."
        icono={IconoGraficaBarras}
      />
    );
  else if (ruta === '/sistema')
    vista = (
      <Suspense fallback={null}>
        <Sistema />
      </Suspense>
    );
  else vista = <NoEncontrada />;

  return (
    <Armazon
      marca={MARCA}
      navegacion={NAVEGACION}
      rutaActual={ruta}
      navegar={navegar}
      hrefDe={hrefDe}
      contadores={CONTADORES}
      estadoPie={{ icono: IconoEquipo, titulo: 'Datos de ejemplo', detalle: 'Ficticios, en memoria' }}
      accionesPie={accionesPie}
      textoBuscador="Buscar pedidos, clientes o ir a…"
      comandos={COMANDOS}
      fuentesPaleta={FUENTES}
      accionesSuperior={<MenuAyuda />}
    >
      {vista}
    </Armazon>
  );
}

function MenuAyuda() {
  return (
    <Menu modal={false}>
      <MenuDisparador asChild>
        <Boton variante="fantasma" className="group gap-1.5 pr-2">
          <IconoAyuda tamano={16} className="text-texto-3" />
          Ayuda
          <IconoChevronAbajo
            tamano={14}
            className="text-texto-3 transition-transform duration-(--t-estado) ease-salida group-data-[state=open]:rotate-180"
          />
        </Boton>
      </MenuDisparador>
      <MenuContenido align="end" className="w-72">
        <MenuEtiqueta>Atajos de teclado</MenuEtiqueta>
        <MenuElemento icono={<IconoAyuda tamano={16} />} meta="Ctrl K" onSelect={() => {}}>
          Paleta de comandos
        </MenuElemento>
        <MenuElemento icono={<IconoAyuda tamano={16} />} meta="Ctrl B" onSelect={() => {}}>
          Plegar la barra lateral
        </MenuElemento>
        <MenuSeparador />
        <MenuElemento
          icono={<IconoSistema tamano={16} />}
          descripcion="Tokens, primitivas, componentes y movimiento"
          onSelect={() => navegar('/sistema')}
        >
          Sistema de diseño
        </MenuElemento>
      </MenuContenido>
    </Menu>
  );
}
