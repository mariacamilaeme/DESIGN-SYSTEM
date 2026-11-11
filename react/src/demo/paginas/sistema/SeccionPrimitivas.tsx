import { CuerpoTarjeta, EncabezadoTarjeta, Tarjeta } from '../../../obsidiana';
import { aviso } from '../../../obsidiana';
import { Boton, BotonIcono } from '../../../obsidiana';
import { Campo } from '../../../obsidiana';
import { CampoFecha } from '../../../obsidiana';
import { Casilla, Interruptor } from '../../../obsidiana';
import { Combobox } from '../../../obsidiana';
import {
  Dialogo,
  DialogoCerrar,
  DialogoContenido,
  DialogoCuerpo,
  DialogoDisparador,
  DialogoEncabezado,
  DialogoPie,
} from '../../../obsidiana';
import { DialogoAlerta } from '../../../obsidiana';
import {
  Emergente,
  EmergenteContenido,
  EmergenteDisparador,
} from '../../../obsidiana';
import { AreaTexto, Entrada, EntradaNumero } from '../../../obsidiana';
import {
  Menu,
  MenuCasilla,
  MenuContenido,
  MenuDisparador,
  MenuElemento,
  MenuEtiqueta,
  MenuSeparador,
} from '../../../obsidiana';
import { Pestana, PestanaContenido, Pestanas, PestanasLista } from '../../../obsidiana';
import { Pista } from '../../../obsidiana';
import { Segmentado } from '../../../obsidiana';
import { Selector } from '../../../obsidiana';
import { Tecla } from '../../../obsidiana';
import { AreaDesplazable, Esqueleto, Insignia, Separador } from '../../../obsidiana';
import {
  IconoBuscar,
  IconoCalendario,
  IconoColumnas,
  IconoContratos,
  IconoCopiar,
  IconoDescargar,
  IconoDocumento,
  IconoEditar,
  IconoEliminar,
  IconoExportar,
  IconoMasOpciones,
  IconoNuevo,
  IconoTabla,
} from '../../../obsidiana';
import { cn } from '../../../obsidiana';
import { type ReactNode, useState } from 'react';
import { OPCIONES_CLIENTES, OPCIONES_DESTINOS } from '../../datos';
import { Estado, Muestra, Seccion } from './Seccion';

/* Primitivas con todos sus estados: reposo, hover, foco, activo, deshabilitado, cargando. */

const HOVER_FORZADO = {
  primario: 'bg-acento-relleno-hover',
  secundario: 'border-linea-hover bg-boton-2-hover',
  fantasma: 'bg-lavado-2 text-texto-1',
  destructivo: 'bg-rojo-relleno-hover',
} as const;
const FOCO_FORZADO = 'outline-2 outline-offset-2 outline-acento';
const CAMPO_FOCO_FORZADO = 'border-acento ring-3 ring-acento-suave';

const NOMBRES = {
  primario: 'Primario',
  secundario: 'Secundario',
  fantasma: 'Fantasma',
  destructivo: 'Destructivo',
} as const;

function Rejilla({ children, columnas = 6 }: { children: ReactNode; columnas?: number }) {
  return (
    <div
      className="grid items-start gap-x-4 gap-y-5"
      style={{ gridTemplateColumns: `140px repeat(${columnas}, minmax(0, 1fr))` }}
    >
      {children}
    </div>
  );
}

export function SeccionPrimitivas() {
  const [segmento, setSegmento] = useState<'lista' | 'tarjetas' | 'mapa'>('lista');
  const [cliente, setCliente] = useState<string | null>('c2');
  const [puerto, setPuerto] = useState('Medellín');
  const [fecha, setFecha] = useState<string | null>('2026-11-14');
  const [monto, setMonto] = useState<number | null>(12845);
  const [toneladas, setToneladas] = useState<number | null>(156.5);
  const [aprobada, setAprobada] = useState(true);
  const [docs, setDocs] = useState(false);
  const [alerta, setAlerta] = useState(false);
  const [columnasMenu, setColumnasMenu] = useState({ bl: true, eta: true, puerto: false });

  return (
    <Seccion
      id="primitivas"
      titulo="Primitivas"
      descripcion="shadcn sobre Radix, restilizadas con los tokens. Cada control tiene reposo, hover, foco, activo, deshabilitado y, cuando aplica, cargando y listo. Los estados de hover y foco se muestran forzados para poder compararlos."
    >
      <div className="flex flex-col gap-4">
        <Tarjeta>
          <EncabezadoTarjeta titulo="Botones" meta="Altura 32 · compacto 28 · grande 36" />
          <CuerpoTarjeta className="flex flex-col gap-6">
            <Rejilla>
              <span />
              {['Reposo', 'Hover', 'Foco', 'Deshabilitado', 'Cargando', 'Listo'].map((e) => (
                <span key={e} className="text-mini text-texto-3">
                  {e}
                </span>
              ))}
              {(['primario', 'secundario', 'fantasma', 'destructivo'] as const).map((v) => (
                <FilaBoton key={v} variante={v} />
              ))}
            </Rejilla>
            <Separador />
            <div className="flex flex-wrap items-end gap-8">
              <Muestra etiqueta="Tamaños">
                <div className="flex items-center gap-2">
                  <Boton variante="primario" tamano="sm">
                    Compacto
                  </Boton>
                  <Boton variante="primario">Normal</Boton>
                  <Boton variante="primario" tamano="lg">
                    Grande
                  </Boton>
                </div>
              </Muestra>
              <Muestra etiqueta="Con icono">
                <div className="flex items-center gap-2">
                  <Boton variante="primario">
                    <IconoNuevo tamano={16} />
                    Nuevo pedido
                  </Boton>
                  <Boton variante="secundario">
                    <IconoExportar tamano={16} />
                    Exportar
                  </Boton>
                  <Boton variante="destructivo-suave">
                    <IconoEliminar tamano={16} />
                    Eliminar
                  </Boton>
                </div>
              </Muestra>
              <Muestra etiqueta="Solo icono (con pista)">
                <div className="flex items-center gap-1">
                  <Pista contenido="Editar">
                    <BotonIcono etiqueta="Editar">
                      <IconoEditar tamano={16} />
                    </BotonIcono>
                  </Pista>
                  <Pista contenido="Copiar número">
                    <BotonIcono etiqueta="Copiar número">
                      <IconoCopiar tamano={16} />
                    </BotonIcono>
                  </Pista>
                  <Pista contenido="Columnas">
                    <BotonIcono etiqueta="Columnas" variante="borde">
                      <IconoColumnas tamano={16} />
                    </BotonIcono>
                  </Pista>
                  <BotonIcono etiqueta="Más opciones" className={HOVER_FORZADO.fantasma}>
                    <IconoMasOpciones tamano={16} />
                  </BotonIcono>
                  <BotonIcono etiqueta="Deshabilitado" disabled>
                    <IconoEliminar tamano={16} />
                  </BotonIcono>
                </div>
              </Muestra>
              <Muestra etiqueta="Teclas">
                <div className="flex items-center gap-1">
                  <Tecla>Ctrl</Tecla>
                  <Tecla>K</Tecla>
                  <span className="mx-2 h-4 w-px bg-linea" />
                  <Tecla>Esc</Tecla>
                  <Tecla>Enter</Tecla>
                </div>
              </Muestra>
            </div>
          </CuerpoTarjeta>
        </Tarjeta>

        <Tarjeta>
          <EncabezadoTarjeta titulo="Campos" />
          <CuerpoTarjeta className="flex flex-col gap-6">
            <Rejilla columnas={5}>
              <span className="text-mini text-texto-3">Texto</span>
              <Estado nombre="Reposo">
                <Entrada placeholder="Número de pedido" aria-label="Reposo" />
              </Estado>
              <Estado nombre="Foco">
                <Entrada
                  defaultValue="PED-2611-114"
                  aria-label="Foco"
                  className={CAMPO_FOCO_FORZADO}
                />
              </Estado>
              <Estado nombre="Inválido">
                <Entrada defaultValue="2611-14" aria-label="Inválido" aria-invalid />
              </Estado>
              <Estado nombre="Deshabilitado">
                <Entrada defaultValue="PED-2611-114" aria-label="Deshabilitado" disabled />
              </Estado>
              <Estado nombre="Solo lectura (calculado)">
                <Entrada defaultValue="2026-11-24" aria-label="Solo lectura" readOnly />
              </Estado>
            </Rejilla>
            <Separador />
            <div className="grid grid-cols-4 gap-x-5 gap-y-5">
              <Campo etiqueta="Buscar" htmlFor="sis-buscar">
                <Entrada
                  id="sis-buscar"
                  placeholder="Pedido, cliente o guía"
                  icono={<IconoBuscar tamano={16} />}
                />
              </Campo>
              <Campo etiqueta="Importe del pedido" htmlFor="sis-monto" marca="Dinero">
                <EntradaNumero
                  id="sis-monto"
                  valor={monto}
                  onCambio={setMonto}
                  unidad="USD"
                  decimales={2}
                />
              </Campo>
              <Campo etiqueta="Peso" htmlFor="sis-ton" ayuda="Se muestra con un decimal">
                <EntradaNumero
                  id="sis-ton"
                  valor={toneladas}
                  onCambio={setToneladas}
                  unidad="kg"
                  decimales={1}
                />
              </Campo>
              <Campo etiqueta="Entrega prevista" htmlFor="sis-fecha">
                <CampoFecha id="sis-fecha" valor={fecha} onCambio={setFecha} />
              </Campo>
              <Campo etiqueta="Destino" htmlFor="sis-puerto">
                <Selector
                  id="sis-puerto"
                  valor={puerto}
                  onCambio={setPuerto}
                  opciones={OPCIONES_DESTINOS}
                />
              </Campo>
              <Campo
                etiqueta="Cliente"
                htmlFor="sis-cliente"
                ayuda="Combobox con búsqueda sin tildes"
              >
                <Combobox
                  id="sis-cliente"
                  valor={cliente}
                  onCambio={setCliente}
                  opciones={OPCIONES_CLIENTES}
                  marcadorBusqueda="Buscar cliente…"
                />
              </Campo>
              <Campo etiqueta="Responsable" htmlFor="sis-comercial" error="Elige un responsable">
                <Selector
                  id="sis-comercial"
                  invalido
                  opciones={[{ valor: 'a', etiqueta: 'Responsable A' }]}
                  marcador="Sin asignar"
                />
              </Campo>
              <Campo etiqueta="Selector deshabilitado" htmlFor="sis-des">
                <Selector
                  id="sis-des"
                  deshabilitado
                  valor="Medellín"
                  opciones={OPCIONES_DESTINOS}
                />
              </Campo>
              <Campo etiqueta="Observaciones" htmlFor="sis-obs" className="col-span-2">
                <AreaTexto id="sis-obs" rows={3} placeholder="Notas internas del pedido" />
              </Campo>
            </div>
          </CuerpoTarjeta>
        </Tarjeta>

        <div className="grid grid-cols-2 gap-4">
          <Tarjeta>
            <EncabezadoTarjeta titulo="Casillas, interruptores y segmentado" />
            <CuerpoTarjeta className="flex flex-col gap-5">
              <div className="flex flex-wrap items-start gap-6">
                <Estado nombre="Sin marcar">
                  <Casilla aria-label="Sin marcar" />
                </Estado>
                <Estado nombre="Marcada">
                  <Casilla aria-label="Marcada" defaultChecked />
                </Estado>
                <Estado nombre="Parcial">
                  <Casilla aria-label="Parcial" checked="indeterminate" />
                </Estado>
                <Estado nombre="Foco">
                  <Casilla aria-label="Foco" className={FOCO_FORZADO} />
                </Estado>
                <Estado nombre="Deshabilitada">
                  <Casilla aria-label="Deshabilitada" disabled defaultChecked />
                </Estado>
                <span className="mx-1 h-10 w-px bg-linea" />
                <Estado nombre="Apagado">
                  <Interruptor aria-label="Apagado" />
                </Estado>
                <Estado nombre="Encendido">
                  <Interruptor
                    aria-label="Encendido"
                    checked={aprobada}
                    onCheckedChange={setAprobada}
                  />
                </Estado>
                <Estado nombre="Deshabilitado">
                  <Interruptor aria-label="Deshabilitado" disabled checked />
                </Estado>
              </div>
              <div className="flex items-center gap-3 rounded-interno border border-linea bg-lavado px-3.5 py-3">
                <div className="flex flex-1 flex-col">
                  <span className="font-medium">Avisar al cliente en cada cambio</span>
                  <span className="text-etiqueta text-texto-3">
                    Correo al preparar, enviar y entregar el pedido
                  </span>
                </div>
                <Interruptor
                  aria-label="Avisar al cliente"
                  checked={docs}
                  onCheckedChange={setDocs}
                />
              </div>
              <div className="flex items-center gap-4">
                <Segmentado
                  aria-label="Vista"
                  valor={segmento}
                  onCambio={setSegmento}
                  opciones={[
                    { valor: 'lista', etiqueta: 'Lista', icono: <IconoTabla tamano={14} /> },
                    { valor: 'tarjetas', etiqueta: 'Tarjetas' },
                    { valor: 'mapa', etiqueta: 'Mapa' },
                  ]}
                />
                <Segmentado
                  aria-label="Periodo"
                  tamano="sm"
                  valor={segmento}
                  onCambio={setSegmento}
                  opciones={[
                    { valor: 'lista', etiqueta: '7 días' },
                    { valor: 'tarjetas', etiqueta: '30 días' },
                    { valor: 'mapa', etiqueta: 'Año' },
                  ]}
                />
              </div>
            </CuerpoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta titulo="Pestañas" />
            <CuerpoTarjeta className="flex flex-col gap-5">
              <Pestanas valorInicial="general">
                <PestanasLista>
                  <Pestana value="general">General</Pestana>
                  <Pestana value="entrega">Entrega</Pestana>
                  <Pestana value="documentos" cuenta="3/7">
                    Documentos
                  </Pestana>
                  <Pestana value="pagos" disabled>
                    Pagos
                  </Pestana>
                </PestanasLista>
                <PestanaContenido value="general" className="pt-3 text-texto-2">
                  Datos del pedido, cliente y productos.
                </PestanaContenido>
                <PestanaContenido value="entrega" className="pt-3 text-texto-2">
                  Destino, transportista y fechas.
                </PestanaContenido>
                <PestanaContenido value="documentos" className="pt-3 text-texto-2">
                  Facturas, albaranes y comprobantes.
                </PestanaContenido>
              </Pestanas>
              <Pestanas valorInicial="activos" aspecto="pildora">
                <PestanasLista className="self-start">
                  <Pestana value="activos" cuenta={128}>
                    Activos
                  </Pestana>
                  <Pestana value="inactivos" cuenta={42}>
                    Inactivos
                  </Pestana>
                  <Pestana value="todos">Todos</Pestana>
                </PestanasLista>
              </Pestanas>
            </CuerpoTarjeta>
          </Tarjeta>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Tarjeta>
            <EncabezadoTarjeta titulo="Flotantes" />
            <CuerpoTarjeta className="flex flex-wrap items-center gap-2">
              <Menu>
                <MenuDisparador asChild>
                  <Boton variante="secundario">
                    <IconoColumnas tamano={16} />
                    Menú
                  </Boton>
                </MenuDisparador>
                <MenuContenido>
                  <MenuEtiqueta>Pedido PED-2611-114</MenuEtiqueta>
                  <MenuElemento icono={<IconoEditar tamano={16} />} meta="E">
                    Editar
                  </MenuElemento>
                  <MenuElemento icono={<IconoCopiar tamano={16} />}>Copiar número</MenuElemento>
                  <MenuElemento icono={<IconoDescargar tamano={16} />} disabled>
                    Descargar PDF
                  </MenuElemento>
                  <MenuSeparador />
                  <MenuEtiqueta>Columnas visibles</MenuEtiqueta>
                  <MenuCasilla
                    checked={columnasMenu.bl}
                    onCheckedChange={(v) => setColumnasMenu((c) => ({ ...c, bl: v === true }))}
                    onSelect={(e) => e.preventDefault()}
                  >
                    Guía
                  </MenuCasilla>
                  <MenuCasilla
                    checked={columnasMenu.eta}
                    onCheckedChange={(v) => setColumnasMenu((c) => ({ ...c, eta: v === true }))}
                    onSelect={(e) => e.preventDefault()}
                  >
                    Entrega prevista
                  </MenuCasilla>
                  <MenuSeparador />
                  <MenuElemento icono={<IconoEliminar tamano={16} />} peligro>
                    Cancelar pedido
                  </MenuElemento>
                </MenuContenido>
              </Menu>
              <Emergente>
                <EmergenteDisparador asChild>
                  <Boton variante="secundario">
                    <IconoCalendario tamano={16} />
                    Popover
                  </Boton>
                </EmergenteDisparador>
                <EmergenteContenido className="w-64 p-4">
                  <p className="font-medium">Fecha actualizada</p>
                  <p className="mt-1 text-etiqueta text-texto-2">
                    Se movió la entrega de 3 pedidos del mismo envío.
                  </p>
                </EmergenteContenido>
              </Emergente>
              <Pista contenido="Abrir paleta" atajo={['Ctrl', 'K']}>
                <Boton variante="fantasma">Pista</Boton>
              </Pista>
            </CuerpoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta titulo="Diálogos" />
            <CuerpoTarjeta className="flex flex-wrap items-center gap-2">
              <Dialogo>
                <DialogoDisparador asChild>
                  <Boton variante="secundario">Diálogo</Boton>
                </DialogoDisparador>
                <DialogoContenido>
                  <DialogoEncabezado
                    titulo="Importar pedidos"
                    descripcion="Se leerá el archivo y se mostrará el resumen antes de guardar."
                  />
                  <DialogoCuerpo>
                    <div className="superficie-2 flex items-center gap-3 px-3.5 py-3">
                      <IconoDocumento tamano={18} className="text-texto-3" />
                      <span className="flex-1 truncate">pedidos-noviembre.csv</span>
                      <span className="cifras text-etiqueta text-texto-3">48 KB</span>
                    </div>
                  </DialogoCuerpo>
                  <DialogoPie>
                    <DialogoCerrar asChild>
                      <Boton variante="secundario">Cancelar</Boton>
                    </DialogoCerrar>
                    <Boton variante="primario">Importar</Boton>
                  </DialogoPie>
                </DialogoContenido>
              </Dialogo>
              <Boton variante="secundario" onClick={() => setAlerta(true)}>
                Confirmación
              </Boton>
              <DialogoAlerta
                abierto={alerta}
                onAbiertoCambio={setAlerta}
                titulo="¿Cancelar el pedido PED-2611-114?"
                descripcion="Dejará de contar en listas, cifras e informes. Se puede reactivar."
                textoConfirmar="Cancelar pedido"
                peligro
                onConfirmar={() => setAlerta(false)}
              />
            </CuerpoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta titulo="Avisos" />
            <CuerpoTarjeta className="flex flex-wrap items-center gap-2">
              <Boton
                variante="secundario"
                onClick={() => aviso.success('Pedido guardado', { description: 'PED-2611-114' })}
              >
                Éxito
              </Boton>
              <Boton
                variante="secundario"
                onClick={() =>
                  aviso.error('No se pudo guardar', {
                    description: 'La fecha de salida es posterior a la de entrega.',
                  })
                }
              >
                Error
              </Boton>
              <Boton variante="secundario" onClick={() => aviso.warning('Hay 2 pedidos sin guía')}>
                Aviso
              </Boton>
              <Boton
                variante="secundario"
                onClick={() =>
                  aviso.promise(new Promise((r) => setTimeout(r, 1600)), {
                    loading: 'Generando la exportación…',
                    success: 'Exportación lista',
                  })
                }
              >
                Operación larga
              </Boton>
            </CuerpoTarjeta>
          </Tarjeta>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Tarjeta>
            <EncabezadoTarjeta titulo="Insignias" />
            <CuerpoTarjeta className="flex flex-wrap gap-2">
              <Insignia>Neutra</Insignia>
              <Insignia tono="acento">Acento</Insignia>
              <Insignia tono="vivo" punto>
                En curso
              </Insignia>
              <Insignia tono="ambar">Por vencer</Insignia>
              <Insignia tono="rojo">Vencida</Insignia>
              <Insignia tono="verde">Aprobada</Insignia>
              <Insignia tono="gris">Sin dato</Insignia>
              <Insignia tono="borde">B2B</Insignia>
            </CuerpoTarjeta>
          </Tarjeta>
          <Tarjeta>
            <EncabezadoTarjeta titulo="Esqueletos" />
            <CuerpoTarjeta className="flex flex-col gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Esqueleto className="size-7 rounded-control" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Esqueleto className={cn('h-2.5', i === 1 ? 'w-2/3' : 'w-1/2')} />
                    <Esqueleto className="h-2 w-1/3" />
                  </div>
                  <Esqueleto className="h-2.5 w-14" />
                </div>
              ))}
            </CuerpoTarjeta>
          </Tarjeta>
          <Tarjeta>
            <EncabezadoTarjeta titulo="Área desplazable" />
            <AreaDesplazable className="h-36" claseVista="px-4.5 py-2">
              {Array.from({ length: 14 }, (_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: lista de muestra fija
                  key={i}
                  className="flex h-9 items-center gap-2.5 border-b border-linea last:border-b-0"
                >
                  <IconoContratos tamano={14} className="text-texto-3" />
                  <span className="codigo">PED-2611-{String(101 + i)}</span>
                  <span className="ml-auto text-etiqueta text-texto-3">Medellín</span>
                </div>
              ))}
            </AreaDesplazable>
          </Tarjeta>
        </div>
      </div>
    </Seccion>
  );
}

function FilaBoton({ variante }: { variante: keyof typeof HOVER_FORZADO }) {
  return (
    <>
      <span className="pt-1.5 text-etiqueta font-medium text-texto-2">{NOMBRES[variante]}</span>
      <div>
        <Boton variante={variante}>Guardar</Boton>
      </div>
      <div>
        <Boton variante={variante} className={HOVER_FORZADO[variante]}>
          Guardar
        </Boton>
      </div>
      <div>
        <Boton variante={variante} className={FOCO_FORZADO}>
          Guardar
        </Boton>
      </div>
      <div>
        <Boton variante={variante} disabled>
          Guardar
        </Boton>
      </div>
      <div>
        <Boton variante={variante} estado="cargando">
          Guardar
        </Boton>
      </div>
      <div>
        <Boton variante={variante} estado="listo" textoListo="Guardado">
          Guardar
        </Boton>
      </div>
    </>
  );
}
