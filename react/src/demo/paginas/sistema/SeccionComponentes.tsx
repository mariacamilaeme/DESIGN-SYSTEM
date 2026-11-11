import { useState } from 'react';
import {
  BarraFiltros,
  Boton,
  Campo,
  CampoFecha,
  Cifra,
  CLASES_TONO,
  type ColumnaTabla,
  EncabezadoTarjeta,
  Entrada,
  EntradaNumero,
  ESTADOS_EJEMPLO,
  type EstadoEjemplo,
  EstadoVacio,
  fechaCorta,
  FiloDeLuz,
  formatearDecimal,
  formatearMoneda,
  GlifoEstado,
  GrupoCifras,
  IconoCartera,
  IconoClientes,
  IconoCaja,
  IconoDocumento,
  IconoExportar,
  IconoEtiqueta,
  IconoNuevo,
  IconoPeso,
  IconoUbicacion,
  IconoReloj,
  Interruptor,
  LineaRuta,
  MicroLinea,
  normalizarTexto,
  PildoraEstado,
  type SeleccionFiltros,
  Selector,
  TablaDatos,
  Tarjeta,
  TiraCifras,
  Ventana,
} from '../../../obsidiana';
import { CLIENTES, DESTINOS, OPCIONES_DESTINOS, PEDIDOS, type Pedido } from '../../datos';
import { Muestra, Seccion } from './Seccion';

/* Componentes compartidos con datos ficticios. */

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
  { id: 'cliente', encabezado: 'Cliente', valor: (p) => p.cliente, ancho: 220 },
  {
    id: 'estado',
    encabezado: 'Estado',
    valor: (p) => ESTADOS_EJEMPLO[p.estado].etiqueta,
    celda: (p) => <PildoraEstado estado={ESTADOS_EJEMPLO[p.estado]} />,
    ancho: 180,
  },
  {
    id: 'categoria',
    encabezado: 'Categoría',
    valor: (p) => p.categoria,
    ancho: 180,
    tono: 'secundario',
  },
  {
    id: 'unidades',
    encabezado: 'Unidades',
    valor: (p) => p.unidades,
    celda: (p) => formatearDecimal(p.unidades, 0),
    alineacion: 'derecha',
    tipo: 'numero',
    ancho: 120,
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
  { id: 'destino', encabezado: 'Destino', valor: (p) => p.destino, ancho: 160, tono: 'secundario' },
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
    ancho: 150,
    tipo: 'codigo',
  },
];

export function SeccionComponentes() {
  const [filo, setFilo] = useState(true);
  return (
    <Seccion
      id="componentes"
      titulo="Componentes"
      descripcion="Piezas compartidas por las pantallas: superficie, filo de luz, cifras (Cifra, GrupoCifras y TiraCifras), estados, rutas, estados vacíos, filtros, tabla de datos y ventana de detalle. La tabla admite por columna tono (principal, secundario, tenue), codigo (mono discreto) y titulo (texto completo al pasar el cursor; por defecto, el valor), y por tabla densidad compacta y un pie propio. Todos los datos son ficticios."
    >
      <div className="flex flex-col gap-4">
        <GrupoCifras etiqueta="Cifras de ejemplo">
          <Cifra
            etiqueta="Pedidos abiertos"
            icono={<IconoCaja tamano={16} />}
            valor={128}
            contexto={<>42 en camino, 31 en preparación</>}
          />
          <Cifra
            etiqueta="Peso en camino"
            icono={<IconoPeso tamano={16} />}
            valor={26151.4}
            unidad="kg"
            formato={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
            contexto={
              <>
                <span className="font-medium text-verde-texto">+1.560,0 kg</span> esta semana
              </>
            }
            grafica={<MicroLinea valores={[12, 14, 13, 17, 16, 19, 22, 21, 24, 26]} tono="vivo" />}
          />
          <Cifra
            etiqueta="Por cobrar"
            icono={<IconoCartera tamano={16} />}
            valor={3284120}
            prefijo="USD"
            contexto={<>8 clientes, corte 10 nov</>}
          />
          <Cifra
            etiqueta="Vencido más de 30 días"
            icono={<IconoReloj tamano={16} />}
            valor={715340}
            prefijo="USD"
            contexto={
              <>
                <span className="font-medium text-rojo-texto">21,8 %</span> de lo pendiente
              </>
            }
          />
        </GrupoCifras>

        <div className="grid grid-cols-3 gap-4">
          <Tarjeta filo={filo} className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between">
              <span className="text-titulo-tarjeta">Tarjeta con filo de luz</span>
              <Interruptor
                aria-label="Encender el filo de luz"
                checked={filo}
                onCheckedChange={setFilo}
              />
            </div>
            <p className="text-texto-2">
              Superficie sup-1 con degradado vertical casi imperceptible, borde de 1 px y realce
              interior. El filo marca lo enfocado, seleccionado o activo.
            </p>
            <div className="relative mt-auto rounded-interno border border-linea bg-sup-2 px-3.5 py-3 text-etiqueta text-texto-2">
              <FiloDeLuz />
              Elemento interno con FiloDeLuz
            </div>
          </Tarjeta>
          <Tarjeta className="flex flex-col gap-4 p-5">
            <span className="text-titulo-tarjeta">Píldoras de estado</span>
            <Muestra etiqueta="Juego de ejemplo (forma distinta por estado)">
              <div className="flex flex-wrap gap-2">
                {ESTADOS.map((e) => (
                  <PildoraEstado key={e} estado={ESTADOS_EJEMPLO[e]} pulso={e === 'camino'} />
                ))}
              </div>
            </Muestra>
            <Muestra etiqueta="Tono y forma directos">
              <div className="flex flex-wrap gap-2">
                <PildoraEstado tono="verde" forma="lleno">
                  Aprobada
                </PildoraEstado>
                <PildoraEstado tono="ambar" forma="anillo">
                  Sin aprobar
                </PildoraEstado>
                <PildoraEstado tono="rojo" forma="rombo">
                  Vencida hace 3 días
                </PildoraEstado>
                <PildoraEstado tono="gris" forma="guion">
                  Sin dato
                </PildoraEstado>
              </div>
            </Muestra>
          </Tarjeta>
          <Tarjeta className="flex flex-col gap-5 p-5">
            <span className="text-titulo-tarjeta">Línea de ruta</span>
            <RutaEjemplo
              progreso={0.62}
              estado="curso"
              origen="Almacén central"
              destino="Medellín"
              fechaOrigen="Salida 02 oct"
              fechaDestino="Prevista 18 nov"
            />
            <RutaEjemplo
              progreso={0.94}
              estado="tarde"
              origen="Almacén norte"
              destino="Quito"
              fechaOrigen="Salida 20 sep"
              fechaDestino="Retrasada 3 días"
            />
          </Tarjeta>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Tarjeta>
            <EstadoVacio
              dibujo="lista"
              titulo="Aún no hay pedidos"
              descripcion="Importa un archivo o crea el primer pedido."
              accion={
                <Boton variante="primario">
                  <IconoNuevo tamano={16} />
                  Nuevo pedido
                </Boton>
              }
              compacto
            />
          </Tarjeta>
          <Tarjeta>
            <EstadoVacio
              dibujo="busqueda"
              titulo="Sin resultados"
              descripcion="Ningún pedido coincide con «Altamira»."
              accion={<Boton variante="secundario">Quitar filtros</Boton>}
              compacto
            />
          </Tarjeta>
          <Tarjeta>
            <EstadoVacio
              dibujo="ruta"
              titulo="Ninguna entrega en curso"
              descripcion="Las entregas aparecen aquí cuando tienen fecha de salida."
              compacto
            />
          </Tarjeta>
        </div>

        <TablaDemostracion />
      </div>
    </Seccion>
  );
}

function RutaEjemplo({
  progreso,
  estado,
  origen,
  destino,
  fechaOrigen,
  fechaDestino,
}: {
  progreso: number;
  estado: 'curso' | 'tarde';
  origen: string;
  destino: string;
  fechaOrigen: string;
  fechaDestino: string;
}) {
  return (
    <LineaRuta
      progreso={progreso}
      estado={estado}
      origen={
        <>
          <span className="font-medium text-texto-1">{origen}</span>
          <span className="text-texto-3">{fechaOrigen}</span>
        </>
      }
      destino={
        <>
          <span className="font-medium text-texto-1">{destino}</span>
          <span className={estado === 'tarde' ? 'text-ambar-texto' : 'text-texto-3'}>
            {fechaDestino}
          </span>
        </>
      }
    />
  );
}

const contar = (f: (p: Pedido) => string, v: string) => PEDIDOS.filter((p) => f(p) === v).length;

const CATEGORIAS = [
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
    id: 'destino',
    etiqueta: 'Destino',
    icono: <IconoUbicacion tamano={16} />,
    opciones: DESTINOS.map((d) => ({ valor: d, etiqueta: d, cuenta: contar((p) => p.destino, d) })),
  },
  {
    id: 'cliente',
    etiqueta: 'Cliente',
    icono: <IconoClientes tamano={16} />,
    opciones: CLIENTES.map((c) => ({ valor: c, etiqueta: c, cuenta: contar((p) => p.cliente, c) })),
  },
];

function TablaDemostracion() {
  const [busqueda, setBusqueda] = useState('');
  const [seleccion, setSeleccion] = useState<SeleccionFiltros>({ estado: ['camino'] });
  const [elegido, setElegido] = useState<{
    fila: Pedido;
    origen: { x: number; y: number };
  } | null>(null);
  const [abierta, setAbierta] = useState(false);

  const termino = normalizarTexto(busqueda);
  const filas = PEDIDOS.filter((p) => {
    if (termino && !normalizarTexto(`${p.numero} ${p.cliente} ${p.guia ?? ''}`).includes(termino))
      return false;
    for (const [cat, valores] of Object.entries(seleccion)) {
      if (valores.length === 0) continue;
      const v = cat === 'estado' ? p.estado : cat === 'destino' ? p.destino : p.cliente;
      if (!valores.includes(v)) return false;
    }
    return true;
  });

  const fila = elegido?.fila;
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
      valor: PEDIDOS.length,
      secundario: unidades(PEDIDOS),
    },
    ...ESTADOS.map((e) => {
      const lista = PEDIDOS.filter((p) => p.estado === e);
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
  return (
    <>
      <TiraCifras
        etiqueta="Filtrar por estado"
        elementos={elementosTira}
        activo={activoTira}
        onActivo={(id) => {
          const { estado: _, ...resto } = seleccion;
          setSeleccion(id === 'todos' ? resto : { ...resto, estado: [id] });
        }}
      />
      <Tarjeta className="flex flex-col overflow-hidden">
        <EncabezadoTarjeta
          titulo="Tabla de datos y filtros"
          meta="180 filas ficticias; con «Todas» se virtualiza. La tira de arriba filtra por estado"
        />
        <div className="border-b border-linea px-4.5 py-3">
          <BarraFiltros
            busqueda={busqueda}
            onBusqueda={setBusqueda}
            marcadorBusqueda="Buscar pedido, cliente o guía"
            categorias={CATEGORIAS}
            seleccion={seleccion}
            onSeleccion={setSeleccion}
            acciones={
              <Boton variante="secundario">
                <IconoExportar tamano={16} />
                Exportar
              </Boton>
            }
          />
        </div>
        <TablaDatos
          etiqueta="Pedidos de demostración"
          filas={filas}
          columnas={COLUMNAS}
          idFila={(p) => p.id}
          seleccionada={fila?.id ?? 'p4'}
          nombrePlural="pedidos"
          altoMaximo="480px"
          onAbrirFila={(f, origen) => {
            setElegido({ fila: f, origen });
            setAbierta(true);
          }}
        />
      </Tarjeta>
      {fila ? (
        <Ventana
          abierta={abierta}
          onAbiertaCambio={setAbierta}
          origen={elegido?.origen}
          antetitulo={
            <>
              <span className="codigo">{fila.numero}</span>
              <span aria-hidden className="size-0.75 rounded-pildora bg-texto-4" />
              <PildoraEstado estado={ESTADOS_EJEMPLO[fila.estado]} />
            </>
          }
          titulo={fila.cliente}
          resumen={[
            { etiqueta: 'Unidades', valor: formatearDecimal(fila.unidades, 0) },
            { etiqueta: 'Importe', valor: formatearMoneda(fila.importe) },
            { etiqueta: 'Entrega prevista', valor: fechaCorta(fila.entrega) },
          ]}
          pestanas={[
            {
              id: 'general',
              etiqueta: 'General',
              icono: <IconoCaja tamano={16} />,
              contenido: (
                <div className="grid grid-cols-2 gap-4">
                  <Campo etiqueta="Cliente" htmlFor="s-cliente" className="col-span-2">
                    <Entrada id="s-cliente" defaultValue={fila.cliente} />
                  </Campo>
                  <Campo etiqueta="Categoría" htmlFor="s-categoria">
                    <Entrada id="s-categoria" defaultValue={fila.categoria} />
                  </Campo>
                  <Campo etiqueta="Unidades" htmlFor="s-unidades">
                    <EntradaNumero
                      id="s-unidades"
                      valor={fila.unidades}
                      onCambio={() => {}}
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
                  <Campo etiqueta="Destino" htmlFor="s-destino">
                    <Selector id="s-destino" valor={fila.destino} opciones={OPCIONES_DESTINOS} />
                  </Campo>
                  <Campo etiqueta="Entrega prevista" htmlFor="s-entrega">
                    <CampoFecha id="s-entrega" valor={fila.entrega} onCambio={() => {}} />
                  </Campo>
                  <div className="col-span-2 pt-2">
                    <LineaRuta progreso={0.58} estado="curso" />
                  </div>
                </div>
              ),
            },
            {
              id: 'documentos',
              etiqueta: 'Documentos',
              icono: <IconoDocumento tamano={16} />,
              cuenta: '3/7',
              contenido: <p className="text-texto-2">Facturas, albaranes y comprobantes.</p>,
            },
          ]}
          pie={
            <>
              <Boton variante="secundario" onClick={() => setAbierta(false)}>
                Cancelar
              </Boton>
              <Boton variante="primario">Guardar cambios</Boton>
            </>
          }
        />
      ) : null}
    </>
  );
}
