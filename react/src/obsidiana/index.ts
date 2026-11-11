/*
 * Obsidiana: exportaciones públicas del kit.
 *
 *   import { Armazon, Boton, TablaDatos, IconoBuscar } from './obsidiana';
 *
 * Los estilos van aparte: importa una vez `estilos/base.css` (que trae Tailwind, los tokens, las
 * recetas y las fuentes locales) en el punto de entrada de la herramienta.
 */

/* Armazón */
export { Armazon, type PropsArmazon } from './armazon/Armazon';
export { BarraLateral, type PropsBarraLateral } from './armazon/BarraLateral';
export { BarraSuperior, type PropsBarraSuperior } from './armazon/BarraSuperior';
export {
  type AccionesArmazon,
  ContextoArmazon,
  Enlace,
  rutaCoincide,
  useArmazon,
} from './armazon/contexto';
export { InterruptorTema } from './armazon/InterruptorTema';
export { PaletaComandos, type PropsPaletaComandos } from './armazon/PaletaComandos';
export {
  type ElementoIndexado,
  filtrarPaleta,
  indexarPaleta,
  useAccionesPaleta,
  useAccionesPantalla,
} from './armazon/registro';
export type {
  AccionPie,
  ContadorNav,
  DestinoNavegacion,
  ElementoPaleta,
  EstadoPie,
  FuentePaleta,
  GrupoNavegacion,
  MarcaArmazon,
} from './armazon/tipos';

/* Componentes */
export {
  type AlcanceSeleccionarTodo,
  aplicarSeleccionarTodo,
  BarraFiltros,
  type CategoriaFiltro,
  FichaFiltro,
  type OpcionFiltro,
  type PropsBarraFiltros,
  type SeleccionFiltros,
} from './componentes/BarraFiltros';
export { Cifra, MicroLinea, type PropsCifra } from './componentes/Cifra';
export { type DibujoVacio, EstadoVacio, type PropsEstadoVacio } from './componentes/EstadoVacio';
export { FiloDeLuz } from './componentes/FiloDeLuz';
export { type EstadoRuta, LineaRuta, type PropsLineaRuta } from './componentes/LineaRuta';
export { EncabezadoPagina, Pagina } from './componentes/Pagina';
export {
  type AparienciaEstado,
  CLASES_TONO,
  definirEstados,
  ESTADOS_EJEMPLO,
  type EstadoEjemplo,
  PildoraEstado,
  type PropsPildoraEstado,
  type TonoEstado,
} from './componentes/PildoraEstado';
export {
  type AlineacionColumna,
  type ColumnaTabla,
  type OrdenTabla,
  type PropsTablaDatos,
  TablaDatos,
  type TamanoPagina,
} from './componentes/TablaDatos';
export {
  CuerpoTarjeta,
  EncabezadoTarjeta,
  type PropsEncabezadoTarjeta,
  type PropsTarjeta,
  Tarjeta,
} from './componentes/Tarjeta';
export {
  type ElementoTira,
  GrupoCifras,
  type PropsTiraCifras,
  TiraCifras,
} from './componentes/TiraCifras';
export { TransicionVista } from './componentes/TransicionVista';

/* Iconos */
export * from './iconos';
export { FORMAS_GLIFO, type FormaGlifo, GlifoEstado } from './iconos/glifos';

/* Utilidades */
export { CLAVES_PREFERENCIA, guardarPreferencia, leerPreferencia } from './lib/almacen';
export { type Atajo, focoEnCampo, useAtajo } from './lib/atajos';
export { CLASE_CAMPO, CLASE_CAMPO_TEXTO, CLASE_ELEMENTO_MENU, CLASE_FLOTANTE } from './lib/clases';
export { cn } from './lib/cn';
export {
  aFecha,
  diaISO,
  fechaCorta,
  fechaRelativa,
  formatearCantidad,
  formatearDecimal,
  formatearFecha,
  formatearMoneda,
  formatearNumero,
  formatearPorcentaje,
  horaCorta,
  LOCALE,
  plural,
  VACIO,
} from './lib/formato';
export {
  CURVA,
  DURACION,
  RESORTE_INDICADOR,
  retrasoEscalonado,
  TRANSICION_MENU,
  TRANSICION_VENTANA,
  TRANSICION_VISTA,
} from './lib/movimiento';
export { alCambiarTema, alternarTema, fijarTema, type Tema, useTema } from './lib/tema';
export { coincideBusqueda, coincideBusquedaEnCampos, normalizarTexto } from './lib/texto';

/* Primitivas */
export { Avisos, aviso, esDeAvisos } from './ui/avisos';
export {
  Boton,
  BotonIcono,
  type EstadoAccion,
  Indicador,
  type PropsBoton,
  type PropsBotonIcono,
  variantesBoton,
  variantesBotonIcono,
} from './ui/boton';
export { Campo, Etiqueta, type PropsCampo } from './ui/campo';
export { CampoFecha, interpretarFecha, type PropsCampoFecha } from './ui/campo-fecha';
export { Casilla, Interruptor } from './ui/casilla';
export { Combobox, filtroLiteral, type OpcionCombobox, type PropsCombobox } from './ui/combobox';
export {
  Dialogo,
  DialogoCerrar,
  DialogoContenido,
  DialogoCuerpo,
  DialogoDisparador,
  DialogoEncabezado,
  DialogoFondo,
  DialogoPie,
  estiloOrigen,
  type PropsDialogoContenido,
} from './ui/dialogo';
export { DialogoAlerta, type PropsDialogoAlerta } from './ui/dialogo-alerta';
export {
  Emergente,
  EmergenteAncla,
  EmergenteCerrar,
  EmergenteContenido,
  EmergenteDisparador,
} from './ui/emergente';
export {
  AreaTexto,
  Entrada,
  EntradaNumero,
  interpretarNumero,
  type PropsEntrada,
  type PropsEntradaNumero,
} from './ui/entrada';
export {
  Menu,
  MenuCasilla,
  MenuContenido,
  MenuDisparador,
  MenuElemento,
  MenuEtiqueta,
  MenuGrupo,
  MenuGrupoRadio,
  MenuRadio,
  MenuSeparador,
  MenuSub,
  MenuSubContenido,
  MenuSubDisparador,
  type PropsMenuElemento,
} from './ui/menu';
export {
  Pestana,
  PestanaContenido,
  Pestanas,
  PestanasLista,
  type PropsPestanas,
} from './ui/pestanas';
export { type PropsPista, Pista, ProveedorPistas } from './ui/pista';
export { type OpcionSegmentado, type PropsSegmentado, Segmentado } from './ui/segmentado';
export {
  type OpcionSelector,
  type PropsSelector,
  Selector,
  SelectorContenido,
  SelectorDisparador,
  SelectorEtiqueta,
  SelectorGrupo,
  SelectorOpcion,
  SelectorRaiz,
  SelectorSeparador,
  SelectorValor,
} from './ui/selector';
export { Tecla } from './ui/tecla';
export {
  AreaDesplazable,
  Esqueleto,
  Insignia,
  type PropsAreaDesplazable,
  type PropsInsignia,
  Separador,
  variantesInsignia,
} from './ui/varios';
export { type DatoResumen, type PestanaVentana, type PropsVentana, Ventana } from './ui/ventana';
