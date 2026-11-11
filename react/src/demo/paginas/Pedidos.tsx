import { useMemo, useState } from 'react';
import {
  aviso,
  BarraFiltros,
  Boton,
  Campo,
  CampoFecha,
  type ColumnaTabla,
  Combobox,
  Dialogo,
  DialogoCerrar,
  DialogoContenido,
  DialogoCuerpo,
  DialogoEncabezado,
  DialogoPie,
  EncabezadoPagina,
  Entrada,
  EntradaNumero,
  ESTADOS_EJEMPLO,
  type EstadoAccion,
  type EstadoEjemplo,
  EstadoVacio,
  fechaCorta,
  formatearDecimal,
  formatearMoneda,
  GlifoEstado,
  IconoClientes,
  IconoCaja,
  IconoDocumento,
  IconoExportar,
  IconoEtiqueta,
  IconoMas,
  IconoUbicacion,
  LineaRuta,
  type ElementoPaleta,
  AreaTexto,
  Pagina,
  PildoraEstado,
  plural,
  Selector,
  type SeleccionFiltros,
  TablaDatos,
  Tarjeta,
  TiraCifras,
  useAccionesPaleta,
  Ventana,
  normalizarTexto,
  CLASES_TONO,
} from '../../obsidiana';
import {
  CATEGORIAS,
  CLIENTES,
  DESTINOS,
  esAbierto,
  OPCIONES_CATEGORIAS,
  OPCIONES_CLIENTES,
  OPCIONES_DESTINOS,
  PEDIDOS,
  type Pedido,
} from '../datos';

/*
 * Pantalla de lista de ejemplo, con el orden vertical de todas las pantallas de trabajo:
 * título y acciones, tira de cifras que filtra, barra de herramientas única, tabla en una tarjeta
 * y ventana de detalle que nace de la fila pulsada.
 */

const ESTADOS = Object.keys(ESTADOS_EJEMPLO) as EstadoEjemplo[];

const COLUMNAS: ColumnaTabla<Pedido>[] = [
  {
    id: 'numero',
    encabezado: 'Pedido',
    valor: (p) => p.numero,
    codigo: true,
    ancho: 150,
    tipo: 'codigo',
  },
  { id: 'cliente', encabezado: 'Cliente', valor: (p) => p.cliente, ancho: 210 },
  {
    id: 'estado',
    encabezado: 'Estado',
    valor: (p) => ESTADOS_EJEMPLO[p.estado].etiqueta,
    celda: (p) => <PildoraEstado estado={ESTADOS_EJEMPLO[p.estado]} corta />,
    ancho: 170,
  },
  { id: 'categoria', encabezado: 'Categoría', valor: (p) => p.categoria, ancho: 150, tono: 'secundario' },
  {
    id: 'unidades',
    encabezado: 'Unidades',
    valor: (p) => p.unidades,
    celda: (p) => formatearDecimal(p.unidades, 0),
    alineacion: 'derecha',
    tipo: 'numero',
    ancho: 110,
  },
  {
    id: 'importe',
    encabezado: 'Importe USD',
    valor: (p) => p.importe,
    celda: (p) => formatearDecimal(p.importe, 0),
    alineacion: 'derecha',
    tipo: 'numero',
    ancho: 140,
  },
  { id: 'destino', encabezado: 'Destino', valor: (p) => p.destino, ancho: 140, tono: 'secundario' },
  {
    id: 'entrega',
    encabezado: 'Entrega prevista',
    valor: (p) => p.entrega,
    celda: (p) => (p.entrega ? fechaCorta(p.entrega) : null),
    titulo: (p) => (p.entrega ? fechaCorta(p.entrega) : null),
    ancho: 150,
  },
  {
    id: 'guia',
    encabezado: 'Guía',
    valor: (p) => p.guia,
    codigo: true,
    tono: 'secundario',
    ancho: 140,
    tipo: 'codigo',
  },
];

function contar<T extends string>(f: (p: Pedido) => T, v: T) {
  let n = 0;
  for (const p of PEDIDOS) if (f(p) === v) n++;
  return n;
}

const CATEGORIAS_FILTRO = [
  {
    id: 'estado',
    etiqueta: 'Estado',
    icono: <IconoEtiqueta tamano={16} />,
    opciones: ESTADOS.map((e) => ({
      valor: e,
      etiqueta: ESTADOS_EJEMPLO[e].etiqueta,
      cuenta: contar((p) => p.estado, e),
    })),
  },
  {
    id: 'cliente',
    etiqueta: 'Cliente',
    icono: <IconoClientes tamano={16} />,
    opciones: CLIENTES.map((c) => ({ valor: c, etiqueta: c, cuenta: contar((p) => p.cliente, c) })),
  },
  {
    id: 'categoria',
    etiqueta: 'Categoría',
    icono: <IconoCaja tamano={16} />,
    opciones: CATEGORIAS.map((c) => ({
      valor: c,
      etiqueta: c,
      cuenta: contar((p) => p.categoria, c),
    })),
  },
  {
    id: 'destino',
    etiqueta: 'Destino',
    icono: <IconoUbicacion tamano={16} />,
    opciones: DESTINOS.map((d) => ({ valor: d, etiqueta: d, cuenta: contar((p) => p.destino, d) })),
  },
];

const CAMPO: Record<string, (p: Pedido) => string> = {
  estado: (p) => p.estado,
  cliente: (p) => p.cliente,
  categoria: (p) => p.categoria,
  destino: (p) => p.destino,
};

/** Progreso estimado de la entrega según el estado (para la línea de ruta de la ventana). */
const PROGRESO: Record<EstadoEjemplo, number> = {
  pendiente: 0,
  preparacion: 0.18,
  camino: 0.62,
  entregado: 1,
  cancelado: 0,
};

export function Pedidos({
  busquedaInicial = '',
  pedidoInicial = null,
  nuevoInicial = false,
}: {
  busquedaInicial?: string;
  pedidoInicial?: string | null;
  nuevoInicial?: boolean;
}) {
  const [busqueda, setBusqueda] = useState(busquedaInicial);
  const [seleccion, setSeleccion] = useState<SeleccionFiltros>({});
  const inicial = pedidoInicial ? PEDIDOS.find((p) => p.id === pedidoInicial) : undefined;
  const [elegido, setElegido] = useState<{
    fila: Pedido;
    origen: { x: number; y: number } | null;
  } | null>(inicial ? { fila: inicial, origen: null } : null);
  const [abierta, setAbierta] = useState(Boolean(inicial));
  const [nuevo, setNuevo] = useState(nuevoInicial);
  const [exportando, setExportando] = useState<EstadoAccion>('reposo');

  // "Nuevo pedido" aparece en la paleta mientras esta pantalla está montada.
  const accionesPaleta = useMemo<readonly ElementoPaleta[]>(
    () => [
      {
        id: 'exportar-pedidos',
        titulo: 'Exportar pedidos',
        claves: 'descargar excel csv',
        icono: IconoExportar,
        accion: () => aviso.success('Exportación lista', { description: 'pedidos.csv (ficticio)' }),
      },
    ],
    [],
  );
  useAccionesPaleta(accionesPaleta);

  const termino = normalizarTexto(busqueda);
  const filtrar = (excluir?: string) =>
    PEDIDOS.filter((p) => {
      if (
        termino &&
        !normalizarTexto(`${p.numero} ${p.cliente} ${p.guia ?? ''} ${p.destino}`).includes(termino)
      )
        return false;
      for (const [cat, valores] of Object.entries(seleccion)) {
        if (cat === excluir || valores.length === 0) continue;
        const campo = CAMPO[cat];
        if (campo && !valores.includes(campo(p))) return false;
      }
      return true;
    });
  const filas = filtrar();
  // La tira cuenta con todos los filtros salvo el de estado: así cada cifra dice cuántos hay.
  const base = filtrar('estado');

  const estados = seleccion.estado ?? [];
  const activoTira = estados.length === 0 ? 'todos' : estados.length === 1 ? estados[0] : null;
  const unidades = (lista: readonly Pedido[]) =>
    `${formatearDecimal(
      lista.reduce((n, p) => n + p.unidades, 0),
      0,
    )} u.`;

  const elementosTira = [
    {
      id: 'todos',
      etiqueta: 'Todos',
      icono: <IconoCaja tamano={14} />,
      valor: base.length,
      secundario: unidades(base),
    },
    ...ESTADOS.map((e) => {
      const lista = base.filter((p) => p.estado === e);
      const a = ESTADOS_EJEMPLO[e];
      return {
        id: e,
        etiqueta: a.etiqueta,
        icono: <GlifoEstado forma={a.forma} className={CLASES_TONO[a.tono].glifo} />,
        valor: lista.length,
        secundario: unidades(lista),
      };
    }),
  ];

  const hayFiltros = Boolean(busqueda) || Object.keys(seleccion).length > 0;
  const limpiar = () => {
    setBusqueda('');
    setSeleccion({});
  };

  const exportar = () => {
    setExportando('cargando');
    setTimeout(() => {
      setExportando('listo');
      aviso.success('Exportación lista', {
        description: `${plural(filas.length, 'pedido', 'pedidos')} en pedidos.csv (ficticio)`,
      });
    }, 900);
    setTimeout(() => setExportando('reposo'), 2400);
  };

  const fila = elegido?.fila;
  const abiertos = PEDIDOS.filter(esAbierto).length;

  return (
    <Pagina>
      <EncabezadoPagina
        titulo="Pedidos"
        subtitulo={`${plural(PEDIDOS.length, 'pedido', 'pedidos')}, ${plural(abiertos, 'abierto', 'abiertos')}`}
        acciones={
          <>
            <Boton
              variante="secundario"
              estado={exportando}
              textoListo="Exportado"
              onClick={exportar}
            >
              <IconoExportar tamano={16} />
              Exportar
            </Boton>
            <Boton variante="primario" onClick={() => setNuevo(true)}>
              <IconoMas tamano={16} />
              Nuevo pedido
            </Boton>
          </>
        }
      />

      <TiraCifras
        className="mb-4"
        etiqueta="Filtrar por estado"
        elementos={elementosTira}
        activo={activoTira}
        onActivo={(id) => {
          const { estado: _, ...resto } = seleccion;
          setSeleccion(id === 'todos' ? resto : { ...resto, estado: [id] });
        }}
      />

      <BarraFiltros
        className="mb-3"
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        marcadorBusqueda="Buscar pedido, cliente o guía"
        categorias={CATEGORIAS_FILTRO}
        seleccion={seleccion}
        onSeleccion={setSeleccion}
        ocultarQuitarFiltros
        acciones={
          hayFiltros ? (
            <Boton variante="fantasma" onClick={limpiar}>
              Limpiar
            </Boton>
          ) : null
        }
      />

      <Tarjeta className="overflow-hidden">
        <TablaDatos
          etiqueta="Pedidos"
          filas={filas}
          columnas={COLUMNAS}
          idFila={(p) => p.id}
          seleccionada={abierta ? (fila?.id ?? null) : null}
          nombrePlural="pedidos"
          altoMaximo="calc(100vh - 412px)"
          onAbrirFila={(f, origen) => {
            setElegido({ fila: f, origen });
            setAbierta(true);
          }}
          vacio={
            <EstadoVacio
              dibujo="busqueda"
              titulo="Sin resultados"
              descripcion={
                busqueda
                  ? `Ningún pedido coincide con «${busqueda}».`
                  : 'Ningún pedido coincide con los filtros.'
              }
              accion={
                <Boton variante="secundario" onClick={limpiar}>
                  Limpiar filtros
                </Boton>
              }
              compacto
            />
          }
        />
      </Tarjeta>

      {fila ? (
        <VentanaPedido
          key={fila.id}
          pedido={fila}
          abierta={abierta}
          onAbiertaCambio={setAbierta}
          origen={elegido?.origen ?? null}
        />
      ) : null}

      <DialogoNuevo abierto={nuevo} onAbiertoCambio={setNuevo} />
    </Pagina>
  );
}

function VentanaPedido({
  pedido,
  abierta,
  onAbiertaCambio,
  origen,
}: {
  pedido: Pedido;
  abierta: boolean;
  onAbiertaCambio: (a: boolean) => void;
  origen: { x: number; y: number } | null;
}) {
  const [cliente, setCliente] = useState(pedido.cliente);
  const [unidades, setUnidades] = useState<number | null>(pedido.unidades);
  const [destino, setDestino] = useState(pedido.destino);
  const [entrega, setEntrega] = useState(pedido.entrega);
  const [notas, setNotas] = useState('');
  const [guardar, setGuardar] = useState<EstadoAccion>('reposo');
  const sucia =
    cliente !== pedido.cliente ||
    unidades !== pedido.unidades ||
    destino !== pedido.destino ||
    entrega !== pedido.entrega ||
    notas !== '';
  const a = ESTADOS_EJEMPLO[pedido.estado];

  return (
    <Ventana
      abierta={abierta}
      onAbiertaCambio={onAbiertaCambio}
      origen={origen}
      sucia={sucia && guardar === 'reposo'}
      descripcion={`Detalle del pedido ${pedido.numero}`}
      antetitulo={
        <>
          <span className="codigo">{pedido.numero}</span>
          <span aria-hidden className="size-0.75 rounded-pildora bg-texto-4" />
          <PildoraEstado estado={a} />
        </>
      }
      titulo={pedido.cliente}
      resumen={[
        { etiqueta: 'Unidades', valor: formatearDecimal(pedido.unidades, 0) },
        { etiqueta: 'Importe', valor: formatearMoneda(pedido.importe) },
        { etiqueta: 'Entrega prevista', valor: fechaCorta(pedido.entrega) },
      ]}
      pestanas={[
        {
          id: 'general',
          etiqueta: 'General',
          icono: <IconoCaja tamano={16} />,
          contenido: (
            <div className="grid grid-cols-2 gap-4">
              <Campo etiqueta="Cliente" htmlFor="v-cliente" className="col-span-2">
                <Entrada id="v-cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
              </Campo>
              <Campo etiqueta="Categoría" htmlFor="v-categoria">
                <Selector
                  id="v-categoria"
                  valor={pedido.categoria}
                  opciones={OPCIONES_CATEGORIAS}
                  deshabilitado
                />
              </Campo>
              <Campo etiqueta="Unidades" htmlFor="v-unidades">
                <EntradaNumero
                  id="v-unidades"
                  valor={unidades}
                  onCambio={setUnidades}
                  unidad="u."
                  decimales={0}
                />
              </Campo>
            </div>
          ),
        },
        {
          id: 'entrega',
          etiqueta: 'Entrega',
          icono: <IconoUbicacion tamano={16} />,
          contenido: (
            <div className="grid grid-cols-2 gap-4">
              <Campo etiqueta="Destino" htmlFor="v-destino">
                <Selector
                  id="v-destino"
                  valor={destino}
                  onCambio={setDestino}
                  opciones={OPCIONES_DESTINOS}
                />
              </Campo>
              <Campo etiqueta="Entrega prevista" htmlFor="v-entrega">
                <CampoFecha id="v-entrega" valor={entrega} onCambio={setEntrega} />
              </Campo>
              <div className="col-span-2 pt-3">
                <LineaRuta
                  progreso={PROGRESO[pedido.estado]}
                  estado={pedido.estado === 'entregado' ? 'llegado' : pedido.estado === 'camino' ? 'curso' : 'pendiente'}
                  origen={
                    <>
                      <span className="font-medium text-texto-1">Almacén central</span>
                      <span className="text-texto-3">Salida {fechaCorta('2026-10-02', true)}</span>
                    </>
                  }
                  destino={
                    <>
                      <span className="font-medium text-texto-1">{destino}</span>
                      <span className="text-texto-3">
                        {entrega ? `Prevista ${fechaCorta(entrega, true)}` : 'Sin fecha'}
                      </span>
                    </>
                  }
                />
              </div>
            </div>
          ),
        },
        {
          id: 'notas',
          etiqueta: 'Notas',
          icono: <IconoDocumento tamano={16} />,
          cuenta: notas ? '1' : undefined,
          contenido: (
            <Campo etiqueta="Notas internas" htmlFor="v-notas" ayuda="Solo las ve tu equipo.">
              <AreaTexto
                id="v-notas"
                rows={6}
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Indicaciones de entrega, contacto en destino…"
              />
            </Campo>
          ),
        },
      ]}
      pie={
        <>
          <Boton variante="secundario" onClick={() => onAbiertaCambio(false)}>
            Cancelar
          </Boton>
          <Boton
            variante="primario"
            estado={guardar}
            textoListo="Guardado"
            disabled={!sucia && guardar === 'reposo'}
            onClick={() => {
              setGuardar('cargando');
              setTimeout(() => setGuardar('listo'), 700);
              setTimeout(() => {
                onAbiertaCambio(false);
                aviso.success('Pedido guardado', { description: pedido.numero });
              }, 1500);
            }}
          >
            Guardar cambios
          </Boton>
        </>
      }
    />
  );
}

function DialogoNuevo({
  abierto,
  onAbiertoCambio,
}: {
  abierto: boolean;
  onAbiertoCambio: (a: boolean) => void;
}) {
  const [cliente, setCliente] = useState<string | null>(null);
  const [categoria, setCategoria] = useState<string>('');
  const [unidades, setUnidades] = useState<number | null>(null);
  const [entrega, setEntrega] = useState<string | null>(null);
  const [intento, setIntento] = useState(false);
  const [estado, setEstado] = useState<EstadoAccion>('reposo');
  const faltaCliente = intento && !cliente;

  const cambiarAbierto = (a: boolean) => {
    onAbiertoCambio(a);
    if (!a) {
      setCliente(null);
      setCategoria('');
      setUnidades(null);
      setEntrega(null);
      setIntento(false);
      setEstado('reposo');
    }
  };

  return (
    <Dialogo open={abierto} onOpenChange={cambiarAbierto}>
      <DialogoContenido className="w-(--ancho-dialogo)">
        <DialogoEncabezado
          titulo="Nuevo pedido"
          descripcion="Datos mínimos para registrar el pedido. En la demo no se guarda nada."
        />
        <DialogoCuerpo className="grid grid-cols-2 gap-4">
          <Campo
            etiqueta="Cliente"
            htmlFor="n-cliente"
            className="col-span-2"
            error={faltaCliente ? 'Elige un cliente' : undefined}
          >
            <Combobox
              id="n-cliente"
              valor={cliente}
              onCambio={setCliente}
              opciones={OPCIONES_CLIENTES}
              marcador="Elegir cliente"
              marcadorBusqueda="Buscar cliente…"
              invalido={faltaCliente}
            />
          </Campo>
          <Campo etiqueta="Categoría" htmlFor="n-categoria">
            <Selector
              id="n-categoria"
              valor={categoria || undefined}
              onCambio={setCategoria}
              opciones={OPCIONES_CATEGORIAS}
              marcador="Sin categoría"
            />
          </Campo>
          <Campo etiqueta="Unidades" htmlFor="n-unidades" marca="Opcional">
            <EntradaNumero
              id="n-unidades"
              valor={unidades}
              onCambio={setUnidades}
              unidad="u."
              decimales={0}
            />
          </Campo>
          <Campo etiqueta="Entrega prevista" htmlFor="n-entrega" className="col-span-2">
            <CampoFecha id="n-entrega" valor={entrega} onCambio={setEntrega} />
          </Campo>
        </DialogoCuerpo>
        <DialogoPie>
          <DialogoCerrar asChild>
            <Boton variante="secundario">Cancelar</Boton>
          </DialogoCerrar>
          <Boton
            variante="primario"
            estado={estado}
            textoListo="Creado"
            onClick={() => {
              setIntento(true);
              if (!cliente) return;
              setEstado('cargando');
              setTimeout(() => setEstado('listo'), 700);
              setTimeout(() => {
                cambiarAbierto(false);
                aviso.success('Pedido creado', { description: 'PED-2611-281 (ficticio)' });
              }, 1400);
            }}
          >
            Crear pedido
          </Boton>
        </DialogoPie>
      </DialogoContenido>
    </Dialogo>
  );
}
