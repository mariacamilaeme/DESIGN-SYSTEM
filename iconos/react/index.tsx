/*
 * Obsidiana · juego de iconos en React.
 * Generado por iconos/fuente/generar.mjs. No editar a mano.
 *
 * 158 iconos, cada uno un componente con `currentColor`. Los que tienen microanimación
 * al pasar el cursor la activan con la hoja iconos.css.
 */
import { type ComponenteIcono, crearIcono } from './Icono';

export type { ComponenteIcono, PropsIcono, TamanoIcono } from './Icono';
export { anim, crearIcono, RELLENO } from './Icono';

/* ---------------------------------------------------------------- Módulos */

export const IconoPanel = crearIcono(
  'panel',
  <><rect x="3.5" y="3.5" width="7" height="7" rx="2" fill="currentColor" fillOpacity="0.12" /><rect x="13.5" y="3.5" width="7" height="4.5" rx="2" /><rect x="13.5" y="11" width="7" height="9.5" rx="2" fill="currentColor" fillOpacity="0.12" /><rect x="3.5" y="13.5" width="7" height="7" rx="2" /></>,
);

export const IconoContratos = crearIcono(
  'contratos',
  <><path d="M7 3.5h6.5l5 5V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z" fill="currentColor" fillOpacity="0.12" /><path d="M13.5 3.5v5h5" /><path d="M8.75 12.25h6.5" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /><path d="M8.75 16.75c.75-1.1 1.4-1.35 1.75-.55.3.7.75.85 1.35.2.45-.5.85-.55 1.15-.1.25.4.6.5 1.5.45" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-2, none)' }} /></>,
);

export const IconoEmbarques = crearIcono(
  'embarques',
  <><circle cx="5.75" cy="18.25" r="2.25" fill="currentColor" fillOpacity="0.12" /><circle cx="18.25" cy="5.75" r="2.25" fill="currentColor" fillOpacity="0.12" /><path d="M7.6 16.85c2.4-1.6 2.6-5.2 5.1-6.4 1.7-.8 3.1-1.15 4.05-2.6" strokeDasharray="2.2 2.6" style={{ animation: 'var(--ia-ruta, none)' }} /></>,
);

export const IconoFacturas = crearIcono(
  'facturas',
  <><path d="M7 3.5h10A1.5 1.5 0 0 1 18.5 5v15.5l-2.17-1.3-2.16 1.3-2.17-1.3-2.17 1.3-2.16-1.3-2.17 1.3V5A1.5 1.5 0 0 1 7 3.5Z" fill="currentColor" fillOpacity="0.12" /><path d="M9 8.5h6" /><path d="M9 12h6" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /><path d="M9 15.5h3.5" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-2, none)' }} /></>,
);

export const IconoReportes = crearIcono(
  'reportes',
  <><rect x="3.5" y="3.5" width="17" height="17" rx="3.5" fill="currentColor" fillOpacity="0.12" /><path d="M8 16v-3.5" style={{ animation: 'var(--ia-barra-1, none)', transformOrigin: '12px 16px' }} /><path d="M12 16V8" style={{ animation: 'var(--ia-barra-2, none)', transformOrigin: '12px 16px' }} /><path d="M16 16v-6" style={{ animation: 'var(--ia-barra-3, none)', transformOrigin: '12px 16px' }} /></>,
);

export const IconoSistema = crearIcono(
  'sistema',
  <><circle cx="7.75" cy="7.75" r="4.25" fill="currentColor" fillOpacity="0.12" /><rect x="13" y="3.5" width="7.5" height="8.5" rx="2" /><rect x="3.5" y="13" width="8.5" height="7.5" rx="2" /><path d="M16.75 13.25 20.5 20.25h-7.5Z" fill="currentColor" fillOpacity="0.12" /></>,
);

/* ---------------------------------------------------------------- Acciones */

export const IconoBuscar = crearIcono(
  'buscar',
  <><g style={{ animation: 'var(--ia-asomar, none)' }}><circle cx="10.75" cy="10.75" r="6.25" fill="currentColor" fillOpacity="0.12" /><path d="m15.5 15.5 4.75 4.75" /></g></>,
);

export const IconoFiltro = crearIcono(
  'filtro',
  <><path d="M4 7h16" /><path d="M7 12h10" style={{ animation: 'var(--ia-encoger-1, none)', transformOrigin: '12px 12px' }} /><path d="M10 17h4" style={{ animation: 'var(--ia-encoger-2, none)', transformOrigin: '12px 17px' }} /></>,
);

export const IconoNuevo = crearIcono(
  'nuevo',
  <><rect x="3.5" y="3.5" width="17" height="17" rx="3.5" fill="currentColor" fillOpacity="0.12" /><g style={{ animation: 'var(--ia-girar, none)', transformOrigin: '12px 12px' }}><path d="M12 8.25v7.5M8.25 12h7.5" /></g></>,
);

export const IconoMas = crearIcono(
  'mas',
  <><g style={{ animation: 'var(--ia-girar, none)', transformOrigin: '12px 12px' }}><path d="M12 5v14M5 12h14" /></g></>,
);

export const IconoMenos = crearIcono(
  'menos',
  <><path d="M5 12h14" style={{ animation: 'var(--ia-encoger-1, none)', transformOrigin: '12px 12px' }} /></>,
);

export const IconoEditar = crearIcono(
  'editar',
  <><path d="M15.2 4.8a2 2 0 0 1 2.83 0l1.17 1.17a2 2 0 0 1 0 2.83L9 19l-4.5 1 1-4.5Z" fill="currentColor" fillOpacity="0.12" /><path d="m13.5 6.5 4 4" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /></>,
);

export const IconoEliminar = crearIcono(
  'eliminar',
  <><g style={{ animation: 'var(--ia-inclinar, none)', transformOrigin: '18px 7px' }}><path d="M4.5 7h15" /><path d="M9.5 7V5.25a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V7" /></g><path d="m6.5 7 .8 11.6a2 2 0 0 0 2 1.9h5.4a2 2 0 0 0 2-1.9L17.5 7" fill="currentColor" fillOpacity="0.12" /><path d="M10.25 11v5.5M13.75 11v5.5" /></>,
);

export const IconoCopiar = crearIcono(
  'copiar',
  <><path d="M15.5 8.5V6a2.5 2.5 0 0 0-2.5-2.5H6A2.5 2.5 0 0 0 3.5 6v7A2.5 2.5 0 0 0 6 15.5h2.5" /><rect x="8.5" y="8.5" width="12" height="12" rx="2.5" fill="currentColor" fillOpacity="0.12" style={{ animation: 'var(--ia-apilar, none)' }} /></>,
);

export const IconoGuardar = crearIcono(
  'guardar',
  <><g style={{ animation: 'var(--ia-presionar, none)' }}><path d="M5.5 3.5h10.67a1.5 1.5 0 0 1 1.06.44l2.83 2.83a1.5 1.5 0 0 1 .44 1.06V18.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" fill="currentColor" fillOpacity="0.12" /><path d="M8 3.5v3.25a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V3.5" /><path d="M7.5 20.5v-4.5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v4.5" /></g></>,
);

export const IconoExportar = crearIcono(
  'exportar',
  <><path d="M17.5 13.5v4a3 3 0 0 1-3 3h-8a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h4" fill="currentColor" fillOpacity="0.12" /><g style={{ animation: 'var(--ia-salir, none)' }}><path d="M14 3.5h6.5V10M20.5 3.5l-9 9" /></g></>,
);

export const IconoImportar = crearIcono(
  'importar',
  <><path d="M7 3.5h6.5l5 5V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z" fill="currentColor" fillOpacity="0.12" /><path d="M13.5 3.5v5h5" /><g style={{ animation: 'var(--ia-caer, none)' }}><path d="M12 10.5v6M9.5 14l2.5 2.5 2.5-2.5" /></g></>,
);

export const IconoDescargar = crearIcono(
  'descargar',
  <><path d="M3.5 14.5v3a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-3" /><g style={{ animation: 'var(--ia-caer, none)' }}><path d="M12 3.5v11.25M7.75 10.5 12 14.75l4.25-4.25" /></g></>,
);

export const IconoSubir = crearIcono(
  'subir',
  <><path d="M3.5 14.5v3a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-3" /><g style={{ animation: 'var(--ia-subir, none)' }}><path d="M12 14.75V3.5M7.75 7.75 12 3.5l4.25 4.25" /></g></>,
);

export const IconoActualizar = crearIcono(
  'actualizar',
  <><g style={{ animation: 'var(--ia-media-vuelta, none)', transformOrigin: '12px 12px' }}><path d="M19.5 12a7.5 7.5 0 0 1-13.06 5.03" /><path d="M4.5 12a7.5 7.5 0 0 1 13.06-5.03" /><path d="M17.75 3.5V7h-3.5M6.25 20.5V17h3.5" /></g></>,
);

export const IconoDeshacer = crearIcono(
  'deshacer',
  <><g style={{ animation: 'var(--ia-empujar-izq, none)' }}><path d="M8.5 14 4 9.5 8.5 5" /><path d="M4 9.5h10.5a5.5 5.5 0 0 1 0 11H11" /></g></>,
);

export const IconoRehacer = crearIcono(
  'rehacer',
  <><g style={{ animation: 'var(--ia-empujar, none)' }}><path d="M15.5 14 20 9.5 15.5 5" /><path d="M20 9.5H9.5a5.5 5.5 0 0 0 0 11H13" /></g></>,
);

export const IconoEnviar = crearIcono(
  'enviar',
  <><g style={{ animation: 'var(--ia-despegar, none)' }}><path d="M20.5 3.5 14.5 20.5l-3.5-7.5-7.5-3.5Z" fill="currentColor" fillOpacity="0.12" /><path d="m20.5 3.5-9.5 9.5" /></g></>,
);

export const IconoImprimir = crearIcono(
  'imprimir',
  <><path d="M7 8V4.5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1V8" /><path d="M7 16.5H5.5a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v4.5a2 2 0 0 1-2 2H17" fill="currentColor" fillOpacity="0.12" /><path d="M7 13.5h10v6a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1Z" style={{ animation: 'var(--ia-aterrizar, none)' }} /></>,
);

export const IconoCompartir = crearIcono(
  'compartir',
  <><circle cx="17.5" cy="5.75" r="2.25" fill="currentColor" fillOpacity="0.12" /><circle cx="6.5" cy="12" r="2.25" fill="currentColor" fillOpacity="0.12" /><circle cx="17.5" cy="18.25" r="2.25" fill="currentColor" fillOpacity="0.12" /><path d="m8.6 10.8 6.8-3.85" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /><path d="m8.6 13.2 6.8 3.85" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-2, none)' }} /></>,
);

export const IconoEnlace = crearIcono(
  'enlace',
  <><g transform="rotate(-45 12 12)"><rect x="3" y="9" width="10.5" height="6" rx="3" style={{ animation: 'var(--ia-separar-izq, none)' }} /><rect x="10.5" y="9" width="10.5" height="6" rx="3" style={{ animation: 'var(--ia-separar-der, none)' }} /></g></>,
);

export const IconoEnlaceExterno = crearIcono(
  'enlace-externo',
  <><rect x="3.5" y="3.5" width="17" height="17" rx="3.5" fill="currentColor" fillOpacity="0.12" /><g style={{ animation: 'var(--ia-salir, none)' }}><path d="m9 15 6-6M10 9h5v5" /></g></>,
);

export const IconoAdjunto = crearIcono(
  'adjunto',
  <><g transform="rotate(45 12 12)"><path d="M16 8.5V16a4 4 0 0 1-8 0V6.5a2.75 2.75 0 0 1 5.5 0V15a1.5 1.5 0 0 1-3 0V8.5" style={{ animation: 'var(--ia-inclinar-der, none)', transformOrigin: '12px 12px' }} /></g></>,
);

export const IconoLupaMas = crearIcono(
  'lupa-mas',
  <><g style={{ animation: 'var(--ia-asomar, none)' }}><circle cx="10.75" cy="10.75" r="6.25" fill="currentColor" fillOpacity="0.12" /><path d="m15.5 15.5 4.75 4.75" /><path d="M8.25 10.75h5M10.75 8.25v5" /></g></>,
);

export const IconoLupaMenos = crearIcono(
  'lupa-menos',
  <><g style={{ animation: 'var(--ia-asomar, none)' }}><circle cx="10.75" cy="10.75" r="6.25" fill="currentColor" fillOpacity="0.12" /><path d="m15.5 15.5 4.75 4.75" /><path d="M8.25 10.75h5" /></g></>,
);

export const IconoFijar = crearIcono(
  'fijar',
  <><g style={{ animation: 'var(--ia-presionar, none)' }}><path d="M9 3.5h6l-.6 5.6 3.1 3.4v2h-11v-2l3.1-3.4Z" fill="currentColor" fillOpacity="0.12" /><path d="M12 14.5v6" /></g></>,
);

export const IconoMarcador = crearIcono(
  'marcador',
  <><path d="M6.5 5A1.5 1.5 0 0 1 8 3.5h8A1.5 1.5 0 0 1 17.5 5v15.5L12 16.5l-5.5 4Z" fill="currentColor" fillOpacity="0.12" style={{ animation: 'var(--ia-presionar, none)' }} /></>,
);

export const IconoEstrella = crearIcono(
  'estrella',
  <><path d="M12 4.1 14.59 9.29 20.32 10.15 16.18 14.21 17.14 19.93 12 17.25 6.86 19.93 7.82 14.21 3.68 10.15 9.41 9.29Z" fill="currentColor" fillOpacity="0.12" style={{ animation: 'var(--ia-pulsar, none)', transformOrigin: '12px 12.5px' }} /></>,
);

export const IconoEtiqueta = crearIcono(
  'etiqueta',
  <><g style={{ animation: 'var(--ia-inclinar, none)', transformOrigin: '8px 8px' }}><path d="M3.5 5.5v5.17a2 2 0 0 0 .59 1.41l7.83 7.83a2 2 0 0 0 2.83 0l5.17-5.17a2 2 0 0 0 0-2.83L12.09 4.09a2 2 0 0 0-1.42-.59H5.5a2 2 0 0 0-2 2Z" fill="currentColor" fillOpacity="0.12" /><circle cx="8" cy="8" r="1.5" /></g></>,
);

export const IconoBandera = crearIcono(
  'bandera',
  <><path d="M5 4.5h12.5L15 9l2.5 4.5H5" fill="currentColor" fillOpacity="0.12" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-lento, none)' }} /><path d="M5 3.5v17" /></>,
);

export const IconoOrdenar = crearIcono(
  'ordenar',
  <><g style={{ animation: 'var(--ia-empujar-arr, none)' }}><path d="M8 19V5M4.5 8.5 8 5l3.5 3.5" /></g><g style={{ animation: 'var(--ia-empujar-ab, none)' }}><path d="M16 5v14M12.5 15.5 16 19l3.5-3.5" /></g></>,
);

export const IconoVer = crearIcono(
  'ver',
  <><g style={{ animation: 'var(--ia-parpadear, none)', transformOrigin: '12px 12px' }}><path d="M3 12s3.25-6.25 9-6.25S21 12 21 12s-3.25 6.25-9 6.25S3 12 3 12Z" fill="currentColor" fillOpacity="0.12" /><circle cx="12" cy="12" r="2.75" /></g></>,
);

export const IconoOcultar = crearIcono(
  'ocultar',
  <><path d="M3 12s3.25-6.25 9-6.25S21 12 21 12s-3.25 6.25-9 6.25S3 12 3 12Z" fill="currentColor" fillOpacity="0.12" /><path d="m4.5 4.5 15 15" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /></>,
);

export const IconoApagar = crearIcono(
  'apagar',
  <><path d="M6.72 6.49a8 8 0 1 0 10.56 0" /><path d="M12 3.5v8" style={{ animation: 'var(--ia-encender, none)' }} /></>,
);

export const IconoSalir = crearIcono(
  'salir',
  <><path d="M10 20.5H6.5a3 3 0 0 1-3-3v-11a3 3 0 0 1 3-3H10" /><g style={{ animation: 'var(--ia-empujar, none)' }}><path d="M9.5 12h11M17 8.5l3.5 3.5-3.5 3.5" /></g></>,
);

export const IconoEntrar = crearIcono(
  'entrar',
  <><path d="M14 3.5h3.5a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H14" /><g style={{ animation: 'var(--ia-empujar, none)' }}><path d="M3.5 12h11M11 8.5l3.5 3.5-3.5 3.5" /></g></>,
);

/* ---------------------------------------------------------------- Navegación */

export const IconoInicio = crearIcono(
  'inicio',
  <><path d="M4.5 9.6a1.5 1.5 0 0 1 .56-1.17l6-4.8a1.5 1.5 0 0 1 1.88 0l6 4.8a1.5 1.5 0 0 1 .56 1.17v8.9a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2Z" fill="currentColor" fillOpacity="0.12" /><path d="M9.75 20.5V16a1 1 0 0 1 1-1h2.5a1 1 0 0 1 1 1v4.5" style={{ animation: 'var(--ia-presionar, none)' }} /></>,
);

export const IconoMenu = crearIcono(
  'menu',
  <><path d="M4 6.5h16" style={{ animation: 'var(--ia-encoger-1, none)', transformOrigin: '12px 6.5px' }} /><path d="M4 12h16" style={{ animation: 'var(--ia-encoger-2, none)', transformOrigin: '12px 12px' }} /><path d="M4 17.5h16" style={{ animation: 'var(--ia-encoger-3, none)', transformOrigin: '12px 17.5px' }} /></>,
);

export const IconoFlecha = crearIcono(
  'flecha',
  <><g style={{ animation: 'var(--ia-empujar, none)' }}><path d="M4.5 12h15M13.5 6l6 6-6 6" /></g></>,
);

export const IconoFlechaDerecha = crearIcono(
  'flecha-derecha',
  <><g style={{ animation: 'var(--ia-empujar, none)' }}><path d="M4.5 12h15M13.5 6l6 6-6 6" /></g></>,
);

export const IconoFlechaIzquierda = crearIcono(
  'flecha-izquierda',
  <><g style={{ animation: 'var(--ia-empujar-izq, none)' }}><path d="M19.5 12h-15M10.5 6l-6 6 6 6" /></g></>,
);

export const IconoFlechaArriba = crearIcono(
  'flecha-arriba',
  <><g style={{ animation: 'var(--ia-empujar-arr, none)' }}><path d="M12 19.5v-15M6 10.5l6-6 6 6" /></g></>,
);

export const IconoFlechaAbajo = crearIcono(
  'flecha-abajo',
  <><g style={{ animation: 'var(--ia-empujar-ab, none)' }}><path d="M12 4.5v15M6 13.5l6 6 6-6" /></g></>,
);

export const IconoFlechaDiagonal = crearIcono(
  'flecha-diagonal',
  <><g style={{ animation: 'var(--ia-salir, none)' }}><path d="m6.5 17.5 11-11M8 6.5h9.5V16" /></g></>,
);

export const IconoRetorno = crearIcono(
  'retorno',
  <><g style={{ animation: 'var(--ia-empujar-izq, none)' }}><path d="M19 5v6a3 3 0 0 1-3 3H6" /><path d="M9.5 10.5 6 14l3.5 3.5" /></g></>,
);

export const IconoOrden = crearIcono(
  'orden',
  <><g style={{ animation: 'var(--ia-empujar-arr, none)' }}><path d="M12 18.5v-13M7 10.5l5-5 5 5" /></g></>,
);

export const IconoFlechas = crearIcono(
  'flechas',
  <><path d="M8 9.5 12 5.5l4 4" /><path d="M8 14.5l4 4 4-4" /></>,
);

export const IconoChevronDerecha = crearIcono(
  'chevron-derecha',
  <><path d="M10 7.5 14.5 12 10 16.5" style={{ animation: 'var(--ia-empujar, none)' }} /></>,
);

export const IconoChevronIzquierda = crearIcono(
  'chevron-izquierda',
  <><path d="M14 7.5 9.5 12 14 16.5" style={{ animation: 'var(--ia-empujar-izq, none)' }} /></>,
);

export const IconoChevronAbajo = crearIcono(
  'chevron-abajo',
  <><path d="M7.5 10 12 14.5 16.5 10" /></>,
);

export const IconoChevronArriba = crearIcono(
  'chevron-arriba',
  <><path d="M7.5 14 12 9.5l4.5 4.5" /></>,
);

export const IconoChevronesIzquierda = crearIcono(
  'chevrones-izquierda',
  <><path d="M12.5 7.5 8 12l4.5 4.5M17.5 7.5 13 12l4.5 4.5" style={{ animation: 'var(--ia-empujar-izq, none)' }} /></>,
);

export const IconoChevronesDerecha = crearIcono(
  'chevrones-derecha',
  <><path d="M11.5 7.5 16 12l-4.5 4.5M6.5 7.5 11 12l-4.5 4.5" style={{ animation: 'var(--ia-empujar, none)' }} /></>,
);

export const IconoCerrar = crearIcono(
  'cerrar',
  <><g style={{ animation: 'var(--ia-girar, none)', transformOrigin: '12px 12px' }}><path d="m6.5 6.5 11 11M17.5 6.5l-11 11" /></g></>,
);

export const IconoCheck = crearIcono(
  'check',
  <><path d="M5 12.5 10 17.5 19 7" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-lento, none)' }} /></>,
);

export const IconoMasOpciones = crearIcono(
  'mas-opciones',
  <><circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="18" cy="12" r="1.5" fill="currentColor" stroke="none" /></>,
);

export const IconoMasOpcionesVertical = crearIcono(
  'mas-opciones-vertical',
  <><circle cx="12" cy="6" r="1.5" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none" /></>,
);

/* ---------------------------------------------------------------- Interfaz */

export const IconoLateral = crearIcono(
  'lateral',
  <><rect x="3.5" y="4.5" width="17" height="15" rx="3" /><path d="M9.5 4.5v15" /><path d="M3.5 7.5a3 3 0 0 1 3-3h3v15h-3a3 3 0 0 1-3-3Z" fill="currentColor" fillOpacity="0.12" stroke="none" /></>,
);

export const IconoColumnas = crearIcono(
  'columnas',
  <><rect x="3.5" y="4.5" width="17" height="15" rx="3" fill="currentColor" fillOpacity="0.12" /><path d="M9.5 4.5v15M14.5 4.5v15" /></>,
);

export const IconoTabla = crearIcono(
  'tabla',
  <><rect x="3.5" y="4.5" width="17" height="15" rx="3" fill="currentColor" fillOpacity="0.12" /><path d="M3.5 9.5h17" /><path d="M3.5 14.5h17" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /><path d="M9.5 9.5v10" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-2, none)' }} /></>,
);

export const IconoCuadricula = crearIcono(
  'cuadricula',
  <><rect x="3.5" y="3.5" width="7" height="7" rx="2" fill="currentColor" fillOpacity="0.12" /><rect x="13.5" y="3.5" width="7" height="7" rx="2" fill="currentColor" fillOpacity="0.12" /><rect x="3.5" y="13.5" width="7" height="7" rx="2" fill="currentColor" fillOpacity="0.12" /><rect x="13.5" y="13.5" width="7" height="7" rx="2" fill="currentColor" fillOpacity="0.12" /></>,
);

export const IconoLista = crearIcono(
  'lista',
  <><circle cx="5" cy="6.5" r="1.25" fill="currentColor" stroke="none" /><circle cx="5" cy="12" r="1.25" fill="currentColor" stroke="none" /><circle cx="5" cy="17.5" r="1.25" fill="currentColor" stroke="none" /><path d="M9 6.5h11" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /><path d="M9 12h11" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-2, none)' }} /><path d="M9 17.5h7" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-3, none)' }} /></>,
);

export const IconoTarea = crearIcono(
  'tarea',
  <><rect x="3.5" y="3.5" width="17" height="17" rx="3.5" fill="currentColor" fillOpacity="0.12" /><path d="m8 12.25 2.75 2.75L16 9.5" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-lento, none)' }} /></>,
);

export const IconoKanban = crearIcono(
  'kanban',
  <><rect x="3.5" y="3.5" width="17" height="17" rx="3.5" fill="currentColor" fillOpacity="0.12" /><path d="M8 7.5v8" style={{ animation: 'var(--ia-barra-1, none)', transformOrigin: '12px 7.5px' }} /><path d="M12 7.5v4.5" style={{ animation: 'var(--ia-barra-2, none)', transformOrigin: '12px 7.5px' }} /><path d="M16 7.5v6" style={{ animation: 'var(--ia-barra-3, none)', transformOrigin: '12px 7.5px' }} /></>,
);

export const IconoPantallaCompleta = crearIcono(
  'pantalla-completa',
  <><g style={{ animation: 'var(--ia-expandir, none)', transformOrigin: '12px 12px' }}><path d="M3.5 8.5v-3a2 2 0 0 1 2-2h3M15.5 3.5h3a2 2 0 0 1 2 2v3M20.5 15.5v3a2 2 0 0 1-2 2h-3M8.5 20.5h-3a2 2 0 0 1-2-2v-3" /></g></>,
);

export const IconoArrastrar = crearIcono(
  'arrastrar',
  <><circle cx="9" cy="6" r="1.5" fill="currentColor" stroke="none" /><circle cx="15" cy="6" r="1.5" fill="currentColor" stroke="none" /><circle cx="9" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="15" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="9" cy="18" r="1.5" fill="currentColor" stroke="none" /><circle cx="15" cy="18" r="1.5" fill="currentColor" stroke="none" /></>,
);

export const IconoCapas = crearIcono(
  'capas',
  <><path d="M12 3.5 20.5 8 12 12.5 3.5 8Z" fill="currentColor" fillOpacity="0.12" style={{ animation: 'var(--ia-aterrizar, none)' }} /><path d="m3.5 12 8.5 4.5 8.5-4.5" /><path d="m3.5 16 8.5 4.5 8.5-4.5" /></>,
);

export const IconoAjustes = crearIcono(
  'ajustes',
  <><g style={{ animation: 'var(--ia-girar, none)', transformOrigin: '12px 12px' }}><path d="M10.56 5.76L10.82 3.58A8.5 8.5 0 0 1 13.18 3.58L13.44 5.76A6.4 6.4 0 0 1 15.39 6.57L17.12 5.21A8.5 8.5 0 0 1 18.79 6.88L17.43 8.61A6.4 6.4 0 0 1 18.24 10.56L20.42 10.82A8.5 8.5 0 0 1 20.42 13.18L18.24 13.44A6.4 6.4 0 0 1 17.43 15.39L18.79 17.12A8.5 8.5 0 0 1 17.12 18.79L15.39 17.43A6.4 6.4 0 0 1 13.44 18.24L13.18 20.42A8.5 8.5 0 0 1 10.82 20.42L10.56 18.24A6.4 6.4 0 0 1 8.61 17.43L6.88 18.79A8.5 8.5 0 0 1 5.21 17.12L6.57 15.39A6.4 6.4 0 0 1 5.76 13.44L3.58 13.18A8.5 8.5 0 0 1 3.58 10.82L5.76 10.56A6.4 6.4 0 0 1 6.57 8.61L5.21 6.88A8.5 8.5 0 0 1 6.88 5.21L8.61 6.57A6.4 6.4 0 0 1 10.56 5.76Z" fill="currentColor" fillOpacity="0.12" /><circle cx="12" cy="12" r="2.75" /></g></>,
);

export const IconoEquipo = crearIcono(
  'equipo',
  <><rect x="3.5" y="4.5" width="17" height="11.5" rx="3" fill="currentColor" fillOpacity="0.12" /><path d="M8.5 20h7M12 16v4" /></>,
);

/* ---------------------------------------------------------------- Estado */

export const IconoAlerta = crearIcono(
  'alerta',
  <><path d="M10.27 4.5a2 2 0 0 1 3.46 0l7.02 12.05A2 2 0 0 1 19.02 19.5H4.98a2 2 0 0 1-1.73-2.95Z" fill="currentColor" fillOpacity="0.12" /><path d="M12 9.5v4" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /><path d="M12 16.5h.01" strokeWidth="2" /></>,
);

export const IconoInfo = crearIcono(
  'info',
  <><circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity="0.12" /><g style={{ animation: 'var(--ia-aterrizar, none)' }}><path d="M12 11v5" /><path d="M12 7.75h.01" strokeWidth="2" /></g></>,
);

export const IconoExito = crearIcono(
  'exito',
  <><circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity="0.12" /><path d="m8.25 12.25 2.5 2.5 5-5.25" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-lento, none)' }} /></>,
);

export const IconoError = crearIcono(
  'error',
  <><circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity="0.12" /><path d="m9.25 9.25 5.5 5.5" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /><path d="m14.75 9.25-5.5 5.5" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-2, none)' }} /></>,
);

export const IconoAyuda = crearIcono(
  'ayuda',
  <><circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity="0.12" /><g style={{ animation: 'var(--ia-inclinar, none)', transformOrigin: '12px 16.5px' }}><path d="M9.6 9.5a2.5 2.5 0 1 1 3.45 2.3c-.6.25-1.05.8-1.05 1.45v.25" /><path d="M12 16.5h.01" strokeWidth="2" /></g></>,
);

export const IconoReloj = crearIcono(
  'reloj',
  <><circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity="0.12" /><path d="M12 7.5V12l3 2" style={{ animation: 'var(--ia-reloj, none)', transformOrigin: '12px 12px' }} /></>,
);

export const IconoHistorial = crearIcono(
  'historial',
  <><path d="M3.5 12A8.5 8.5 0 1 0 12 3.5a9.2 9.2 0 0 0-6.36 2.6L3.5 8.25" /><path d="M3.5 3.75v4.5H8" /><path d="M12 7.75V12l3 1.75" style={{ animation: 'var(--ia-reloj-atras, none)', transformOrigin: '12px 12px' }} /></>,
);

export const IconoTemporizador = crearIcono(
  'temporizador',
  <><circle cx="12" cy="13.5" r="7" fill="currentColor" fillOpacity="0.12" /><path d="M10 3.5h4M12 3.5v3M17.25 7.75 18.5 6.5" /><path d="M12 13.5V10" style={{ animation: 'var(--ia-reloj, none)', transformOrigin: '12px 13.5px' }} /></>,
);

export const IconoCalendario = crearIcono(
  'calendario',
  <><rect x="3.5" y="5" width="17" height="15.5" rx="3" fill="currentColor" fillOpacity="0.12" /><path d="M3.5 10h17M8 3.5v3M16 3.5v3" /><path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" strokeWidth="2" style={{ animation: 'var(--ia-destellar, none)' }} /></>,
);

export const IconoCalidad = crearIcono(
  'calidad',
  <><path d="M12 3.5 19 6v5.5c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6Z" fill="currentColor" fillOpacity="0.12" /><path d="m9 12 2.25 2.25L15.25 10" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /></>,
);

export const IconoCampana = crearIcono(
  'campana',
  <><g style={{ animation: 'var(--ia-inclinar, none)', transformOrigin: '12px 4.5px' }}><path d="M6.5 10a5.5 5.5 0 0 1 11 0v3.6c0 .9.4 1.75 1.1 2.3l.4.35a.7.7 0 0 1-.45 1.25H5.45A.7.7 0 0 1 5 16.25l.4-.35a3 3 0 0 0 1.1-2.3Z" fill="currentColor" fillOpacity="0.12" /><path d="M10.25 20a2 2 0 0 0 3.5 0" /></g></>,
);

export const IconoMeta = crearIcono(
  'meta',
  <><circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity="0.12" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.75" fill="currentColor" stroke="none" style={{ animation: 'var(--ia-destello, none)', transformOrigin: '12px 12px' }} /></>,
);

export const IconoIdea = crearIcono(
  'idea',
  <><path d="M12 3.5a6 6 0 0 0-3.4 10.95c.55.38.9 1 .9 1.67V16h5v-.88c0-.67.35-1.29.9-1.67A6 6 0 0 0 12 3.5Z" fill="currentColor" fillOpacity="0.12" style={{ animation: 'var(--ia-destellar, none)' }} /><path d="M9.5 18.5h5M10.5 20.5h3" /></>,
);

export const IconoChispa = crearIcono(
  'chispa',
  <><path d="M12 3.5c.6 4.2 2.3 5.9 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5 4.2-.6 5.9-2.3 6.5-6.5Z" fill="currentColor" fillOpacity="0.12" style={{ animation: 'var(--ia-destello, none)', transformOrigin: '12px 10px' }} /><path d="M18.5 16.25v4M16.5 18.25h4" style={{ animation: 'var(--ia-girar, none)', transformOrigin: '18.5px 18.25px' }} /></>,
);

export const IconoRayo = crearIcono(
  'rayo',
  <><path d="M13 3.5 5.5 13.25h6l-1 7.25 8-9.75h-6Z" fill="currentColor" fillOpacity="0.12" style={{ animation: 'var(--ia-destellar, none)' }} /></>,
);

/* ---------------------------------------------------------------- Archivos */

export const IconoDocumento = crearIcono(
  'documento',
  <><path d="M7 3.5h6.5l5 5V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z" fill="currentColor" fillOpacity="0.12" /><path d="M13.5 3.5v5h5" /><path d="M8.75 12.75h6.5" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /><path d="M8.75 16.25h4.5" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-2, none)' }} /></>,
);

export const IconoCarpeta = crearIcono(
  'carpeta',
  <><path d="M3.5 7a2 2 0 0 1 2-2h3.38a2 2 0 0 1 1.41.59l1.12 1.12a2 2 0 0 0 1.41.59h6.18a2 2 0 0 1 2 2v8.2a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z" fill="currentColor" fillOpacity="0.12" /><path d="M3.5 10.5h17" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /></>,
);

export const IconoArchivoExcel = crearIcono(
  'archivo-excel',
  <><path d="M7 3.5h6.5l5 5V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z" fill="currentColor" fillOpacity="0.12" /><path d="M13.5 3.5v5h5" /><rect x="8.5" y="11.5" width="7" height="6" rx="1" /><path d="M8.5 14.5h7" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /><path d="M12 11.5v6" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-2, none)' }} /></>,
);

export const IconoArchivoPdf = crearIcono(
  'archivo-pdf',
  <><path d="M7 3.5h6.5l5 5V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z" fill="currentColor" fillOpacity="0.12" /><path d="M13.5 3.5v5h5" /><rect x="8.5" y="11" width="7" height="3.5" rx="1" fill="currentColor" fillOpacity="0.12" /><path d="M8.5 17.25h7" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /></>,
);

export const IconoArchivoZip = crearIcono(
  'archivo-zip',
  <><path d="M7 3.5h6.5l5 5V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z" fill="currentColor" fillOpacity="0.12" /><path d="M13.5 3.5v5h5" /><path d="M10 3.5v1.25M10 7v1.25M10 10.5v1.25" style={{ animation: 'var(--ia-destellar, none)' }} /><rect x="8.5" y="13.5" width="3" height="4.5" rx="1" /></>,
);

export const IconoImagen = crearIcono(
  'imagen',
  <><rect x="3.5" y="4.5" width="17" height="15" rx="3" fill="currentColor" fillOpacity="0.12" /><circle cx="9" cy="9.5" r="1.75" style={{ animation: 'var(--ia-aterrizar, none)' }} /><path d="m3.5 16.5 4.44-4.44a1.5 1.5 0 0 1 2.12 0L16.5 18.5" /><path d="m13.5 15.5 1.94-1.94a1.5 1.5 0 0 1 2.12 0l2.94 2.94" /></>,
);

export const IconoFirma = crearIcono(
  'firma',
  <><path d="M4 15.5c1.6-3.6 3.3-8.5 5-8.5 1.9 0 .2 8.5 2.2 8.5 1.4 0 2.3-4.2 3.6-4.2 1.2 0 1.1 3 2.3 3 .9 0 1.6-.8 2.4-1.5" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-lento, none)' }} /><path d="M4 19.5h16" /></>,
);

export const IconoSello = crearIcono(
  'sello',
  <><g style={{ animation: 'var(--ia-presionar, none)' }}><path d="M12 3.5a2.5 2.5 0 0 0-2.5 2.5c0 1.5 1 2 1 4v2.5h3V10c0-2 1-2.5 1-4A2.5 2.5 0 0 0 12 3.5Z" fill="currentColor" fillOpacity="0.12" /><rect x="4" y="12.5" width="16" height="4" rx="1.5" fill="currentColor" fillOpacity="0.12" /></g><path d="M5.5 20h13" /></>,
);

export const IconoRespaldo = crearIcono(
  'respaldo',
  <><ellipse cx="12" cy="6.25" rx="7.5" ry="2.75" fill="currentColor" fillOpacity="0.12" /><path d="M4.5 6.25v11.5c0 1.52 3.36 2.75 7.5 2.75s7.5-1.23 7.5-2.75V6.25" /><path d="M4.5 12c0 1.52 3.36 2.75 7.5 2.75S19.5 13.52 19.5 12" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /></>,
);

/* ---------------------------------------------------------------- Comunicación */

export const IconoCorreo = crearIcono(
  'correo',
  <><rect x="3.5" y="5" width="17" height="14" rx="3" fill="currentColor" fillOpacity="0.12" /><path d="m4.5 7.5 6.37 4.96a1.85 1.85 0 0 0 2.26 0L19.5 7.5" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /></>,
);

export const IconoComentario = crearIcono(
  'comentario',
  <><path d="M5.5 4.5h13a2 2 0 0 1 2 2V15a2 2 0 0 1-2 2H11l-4.2 3.15A.5.5 0 0 1 6 19.75V17h-.5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2Z" fill="currentColor" fillOpacity="0.12" /><path d="M8 9h8" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /><path d="M8 12.5h5" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-2, none)' }} /></>,
);

export const IconoTelefono = crearIcono(
  'telefono',
  <><path d="M6.2 3.5h2.6a1 1 0 0 1 .95.68l1.1 3.3a1 1 0 0 1-.25 1.03L9 10.1a11.5 11.5 0 0 0 4.9 4.9l1.6-1.6a1 1 0 0 1 1.03-.25l3.3 1.1a1 1 0 0 1 .67.95v2.6a2.3 2.3 0 0 1-2.3 2.3h-.2C10.5 20.1 3.9 13.5 3.9 5.8A2.3 2.3 0 0 1 6.2 3.5Z" fill="currentColor" fillOpacity="0.12" style={{ animation: 'var(--ia-inclinar, none)', transformOrigin: '12px 12px' }} /></>,
);

export const IconoMicrofono = crearIcono(
  'microfono',
  <><rect x="9" y="3.5" width="6" height="10" rx="3" fill="currentColor" fillOpacity="0.12" /><path d="M6 11a6 6 0 0 0 12 0" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /><path d="M12 17v3.5M9 20.5h6" /></>,
);

export const IconoGlobo = crearIcono(
  'globo',
  <><circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity="0.12" /><ellipse cx="12" cy="12" rx="3.75" ry="8.5" style={{ animation: 'var(--ia-voltear, none)', transformOrigin: '12px 12px' }} /><path d="M3.5 12h17" /></>,
);

/* ---------------------------------------------------------------- Datos y análisis */

export const IconoTendencia = crearIcono(
  'tendencia',
  <><path d="M3.5 17 9 11.5l3.5 3.5 8-8" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /><path d="M15 7h5.5v5.5" /></>,
);

export const IconoTendenciaBaja = crearIcono(
  'tendencia-baja',
  <><path d="M3.5 7 9 12.5 12.5 9l8 8" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /><path d="M15 17h5.5v-5.5" /></>,
);

export const IconoGraficaBarras = crearIcono(
  'grafica-barras',
  <><path d="M3.5 3.5v15a2 2 0 0 0 2 2h15" /><path d="M8.5 16.5V13" style={{ animation: 'var(--ia-barra-1, none)', transformOrigin: '12px 16.5px' }} /><path d="M12.5 16.5v-9" style={{ animation: 'var(--ia-barra-2, none)', transformOrigin: '12px 16.5px' }} /><path d="M16.5 16.5V10" style={{ animation: 'var(--ia-barra-3, none)', transformOrigin: '12px 16.5px' }} /></>,
);

export const IconoGraficaLineas = crearIcono(
  'grafica-lineas',
  <><path d="M3.5 3.5v15a2 2 0 0 0 2 2h15" /><path d="m7.5 14.5 3.5-4 3 2.5 5.5-6" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-lento, none)' }} /></>,
);

export const IconoGraficaAnillo = crearIcono(
  'grafica-anillo',
  <><path d="M19.08 14.11A7.75 7.75 0 1 1 9.89 4.92L10.77 9.08A3.5 3.5 0 1 0 14.92 13.23Z" fill="currentColor" fillOpacity="0.12" /><path d="M12.75 3.5A7.75 7.75 0 0 1 20.5 11.25L16.25 11.25A3.5 3.5 0 0 0 12.75 7.75Z" fill="currentColor" fillOpacity="0.12" style={{ animation: 'var(--ia-salir, none)' }} /></>,
);

export const IconoPorcentaje = crearIcono(
  'porcentaje',
  <><path d="m18.5 5.5-13 13" /><circle cx="7.5" cy="7.5" r="2.25" fill="currentColor" fillOpacity="0.12" /><circle cx="16.5" cy="16.5" r="2.25" fill="currentColor" fillOpacity="0.12" /></>,
);

export const IconoCalculadora = crearIcono(
  'calculadora',
  <><rect x="5" y="3.5" width="14" height="17" rx="3" fill="currentColor" fillOpacity="0.12" /><rect x="8" y="6.5" width="8" height="3" rx="1" /><path d="M8.75 13.25h.01M12 13.25h.01M15.25 13.25h.01M8.75 16.75h.01M12 16.75h.01M15.25 16.75h.01" strokeWidth="2" /></>,
);

export const IconoBaseDatos = crearIcono(
  'base-datos',
  <><ellipse cx="12" cy="6" rx="7.5" ry="2.5" fill="currentColor" fillOpacity="0.12" /><path d="M4.5 6v12c0 1.38 3.36 2.5 7.5 2.5s7.5-1.12 7.5-2.5V6" /><path d="M4.5 10c0 1.38 3.36 2.5 7.5 2.5s7.5-1.12 7.5-2.5" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /><path d="M4.5 14c0 1.38 3.36 2.5 7.5 2.5s7.5-1.12 7.5-2.5" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-2, none)' }} /></>,
);

/* ---------------------------------------------------------------- Operación */

export const IconoBarco = crearIcono(
  'barco',
  <><g style={{ animation: 'var(--ia-navegar, none)' }}><path d="M3.5 13h17l-2.3 4.9a2 2 0 0 1-1.8 1.1H7.6a2 2 0 0 1-1.8-1.1Z" fill="currentColor" fillOpacity="0.12" /><path d="M6.5 13V9h10l2 4" /><path d="M9.5 9V5.5H13V9" /></g></>,
);

export const IconoPuerto = crearIcono(
  'puerto',
  <><path d="M3.5 20.5h17" /><path d="M6 20.5v-15l10-2V8" /><path d="M6 8h13" /><g style={{ animation: 'var(--ia-aterrizar, none)' }}><path d="M16 8v3.5" /><rect x="13.25" y="11.5" width="5.5" height="4.5" rx="1" fill="currentColor" fillOpacity="0.12" /></g></>,
);

export const IconoContenedor = crearIcono(
  'contenedor',
  <><rect x="3.5" y="6.5" width="17" height="11" rx="1.5" fill="currentColor" fillOpacity="0.12" /><path d="M8 9.5v5M12 9.5v5M16 9.5v5" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /></>,
);

export const IconoCamion = crearIcono(
  'camion',
  <><g style={{ animation: 'var(--ia-navegar, none)' }}><path d="M5.5 17.5H5A1.5 1.5 0 0 1 3.5 16V6.5A1.5 1.5 0 0 1 5 5h8a1.5 1.5 0 0 1 1.5 1.5v11h-5" fill="currentColor" fillOpacity="0.12" /><path d="M14.5 9h3.09a1.5 1.5 0 0 1 1.3.75l1.41 2.47a1.5 1.5 0 0 1 .2.74V16a1.5 1.5 0 0 1-1.5 1.5H19" /><circle cx="7.5" cy="17.5" r="2" /><circle cx="17" cy="17.5" r="2" /></g></>,
);

export const IconoFabrica = crearIcono(
  'fabrica',
  <><path d="M3.5 20.5v-10l5.5 3.5v-3.5l5.5 3.5V4.5h5.5v16Z" fill="currentColor" fillOpacity="0.12" /><path d="M7.5 17.5h2M12 17.5h2" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /></>,
);

export const IconoCaja = crearIcono(
  'caja',
  <><path d="M12 3.5 19.5 7.5v9L12 20.5l-7.5-4v-9Z" fill="currentColor" fillOpacity="0.12" /><path d="M4.5 7.5 12 11.5l7.5-4M12 11.5v9" /><path d="m8.25 5.5 7.5 4" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /></>,
);

export const IconoInventario = crearIcono(
  'inventario',
  <><rect x="3.5" y="12.5" width="8" height="8" rx="1.5" fill="currentColor" fillOpacity="0.12" /><rect x="12.5" y="12.5" width="8" height="8" rx="1.5" fill="currentColor" fillOpacity="0.12" /><rect x="8" y="3.5" width="8" height="8" rx="1.5" fill="currentColor" fillOpacity="0.12" style={{ animation: 'var(--ia-aterrizar, none)' }} /><path d="M7.5 12.5v2.5M16.5 12.5v2.5M12 3.5V6" /></>,
);

export const IconoPeso = crearIcono(
  'peso',
  <><g style={{ animation: 'var(--ia-presionar, none)' }}><path d="M7.4 8.5h9.2a1 1 0 0 1 .98.8l1.9 9.5a1 1 0 0 1-.98 1.2H5.5a1 1 0 0 1-.98-1.2l1.9-9.5a1 1 0 0 1 .98-.8Z" fill="currentColor" fillOpacity="0.12" /><circle cx="12" cy="6" r="2.5" /></g></>,
);

export const IconoEdificio = crearIcono(
  'edificio',
  <><path d="M5.5 20.5v-15a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v15" fill="currentColor" fillOpacity="0.12" /><path d="M3.5 20.5h17" /><path d="M9 7.5h.01M12 7.5h.01M15 7.5h.01M9 11h.01M12 11h.01M15 11h.01M9 14.5h.01M15 14.5h.01" strokeWidth="2" /><path d="M10.5 20.5V17h3v3.5" /></>,
);

export const IconoTienda = crearIcono(
  'tienda',
  <><path d="M5 3.5h14l1.5 5h-17Z" fill="currentColor" fillOpacity="0.12" /><path d="M5 8.5V19a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19V8.5" /><path d="M10 20.5v-5h4v5" /></>,
);

export const IconoUbicacion = crearIcono(
  'ubicacion',
  <><g style={{ animation: 'var(--ia-aterrizar, none)' }}><path d="M12 20.5s6.5-5.6 6.5-10.5a6.5 6.5 0 0 0-13 0c0 4.9 6.5 10.5 6.5 10.5Z" fill="currentColor" fillOpacity="0.12" /><circle cx="12" cy="10" r="2.5" /></g></>,
);

export const IconoMapa = crearIcono(
  'mapa',
  <><path d="M3.5 6.6a1 1 0 0 1 .6-.92L9 3.5l6 2.5 4.9-2.18a.4.4 0 0 1 .6.37V17.4a1 1 0 0 1-.6.92L15 20.5l-6-2.5-4.9 2.18a.4.4 0 0 1-.6-.37Z" fill="currentColor" fillOpacity="0.12" /><path d="M9 3.5V18" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /><path d="M15 6v14.5" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-2, none)' }} /></>,
);

/* ---------------------------------------------------------------- Finanzas */

export const IconoCartera = crearIcono(
  'cartera',
  <><rect x="3.5" y="6.5" width="17" height="13" rx="3" fill="currentColor" fillOpacity="0.12" /><path d="M16.5 6.5V5a1.5 1.5 0 0 0-1.8-1.47L5.2 5.6" /><path d="M15.5 13.25h2" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /></>,
);

export const IconoPagos = crearIcono(
  'pagos',
  <><rect x="3.5" y="6.5" width="17" height="11" rx="2.5" fill="currentColor" fillOpacity="0.12" /><circle cx="12" cy="12" r="2.25" style={{ animation: 'var(--ia-voltear, none)', transformOrigin: '12px 12px' }} /><path d="M7 10v4M17 10v4" /></>,
);

export const IconoMoneda = crearIcono(
  'moneda',
  <><g style={{ animation: 'var(--ia-voltear, none)', transformOrigin: '12px 12px' }}><circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity="0.12" /><path d="M14.5 9.25c-.4-.9-1.35-1.5-2.5-1.5-1.5 0-2.5.8-2.5 1.95 0 2.8 5 1.45 5 4.3 0 1.15-1 1.95-2.5 1.95-1.15 0-2.1-.6-2.5-1.5M12 6.5v1.25M12 16.25v1.25" /></g></>,
);

export const IconoTarjetaCredito = crearIcono(
  'tarjeta-credito',
  <><rect x="3.5" y="5.5" width="17" height="13" rx="3" fill="currentColor" fillOpacity="0.12" /><path d="M3.5 9.5h17" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /><path d="M7 14.5h3" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-2, none)' }} /></>,
);

export const IconoBanco = crearIcono(
  'banco',
  <><path d="M3.5 8.5 12 3.5l8.5 5Z" fill="currentColor" fillOpacity="0.12" /><path d="M6.5 11v6.5M10.25 11v6.5M13.75 11v6.5M17.5 11v6.5" style={{ animation: 'var(--ia-barra-1, none)', transformOrigin: '12px 17.5px' }} /><path d="M3.5 20.5h17" /></>,
);

export const IconoRecibo = crearIcono(
  'recibo',
  <><path d="m6 3.5 1.5 1 1.5-1 1.5 1 1.5-1 1.5 1 1.5-1 1.5 1 1.5-1v17l-1.5-1-1.5 1-1.5-1-1.5 1-1.5-1-1.5 1-1.5-1-1.5 1Z" fill="currentColor" fillOpacity="0.12" /><path d="M9 8.5h3" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /><path d="M9 11.5h6" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-2, none)' }} /><path d="M9 15.5h6" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-3, none)' }} /></>,
);

/* ---------------------------------------------------------------- Personas */

export const IconoUsuario = crearIcono(
  'usuario',
  <><circle cx="12" cy="8" r="4" fill="currentColor" fillOpacity="0.12" /><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" /></>,
);

export const IconoUsuarios = crearIcono(
  'usuarios',
  <><circle cx="8" cy="8.5" r="3" fill="currentColor" fillOpacity="0.12" /><circle cx="16" cy="8.5" r="3" fill="currentColor" fillOpacity="0.12" /><path d="M3.5 19a4.5 4.5 0 0 1 9 0M11.5 19a4.5 4.5 0 0 1 9 0" /></>,
);

export const IconoUsuarioNuevo = crearIcono(
  'usuario-nuevo',
  <><circle cx="9.5" cy="8" r="3.75" fill="currentColor" fillOpacity="0.12" /><path d="M3.5 19.5a6 6 0 0 1 12 0" /><path d="M18 8.5v5M15.5 11h5" style={{ animation: 'var(--ia-girar, none)', transformOrigin: '18px 11px' }} /></>,
);

export const IconoClientes = crearIcono(
  'clientes',
  <><circle cx="9" cy="8.5" r="3.25" fill="currentColor" fillOpacity="0.12" /><path d="M3.5 19.25a5.5 5.5 0 0 1 11 0" /><path d="M15.5 5.6a3.25 3.25 0 0 1 0 5.8M17 14.4a5.5 5.5 0 0 1 3.5 4.85" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /></>,
);

/* ---------------------------------------------------------------- Seguridad y sistemas */

export const IconoCandado = crearIcono(
  'candado',
  <><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor" fillOpacity="0.12" /><path d="M8 10.5v-3a4 4 0 0 1 8 0v3" style={{ animation: 'var(--ia-levantar, none)' }} /><path d="M12 14.5v2" /></>,
);

export const IconoCandadoAbierto = crearIcono(
  'candado-abierto',
  <><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor" fillOpacity="0.12" /><path d="M8 10.5v-3a4 4 0 0 1 7.75-1.4" style={{ animation: 'var(--ia-inclinar, none)', transformOrigin: '8px 10.5px' }} /><path d="M12 14.5v2" /></>,
);

export const IconoLlave = crearIcono(
  'llave',
  <><g style={{ animation: 'var(--ia-inclinar-der, none)', transformOrigin: '8.5px 15.5px' }}><circle cx="8.5" cy="15.5" r="4.5" fill="currentColor" fillOpacity="0.12" /><path d="M11.7 12.3 20 4M17 7l2.5 2.5M14.5 9.5l1.75 1.75" /></g></>,
);

export const IconoEscudo = crearIcono(
  'escudo',
  <><path d="M12 3.5 19 6v5.5c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6Z" fill="currentColor" fillOpacity="0.12" /><path d="M12 3.5 19 6v5.5c0 4.2-2.9 7.6-7 9Z" fill="currentColor" fillOpacity="0.12" stroke="none" style={{ animation: 'var(--ia-destellar, none)' }} /></>,
);

export const IconoHuella = crearIcono(
  'huella',
  <><path d="M6.2 17.6A8.6 8.6 0 0 1 5 13.2a7 7 0 0 1 13.2-3.3" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /><path d="M9.4 19.7A11.4 11.4 0 0 1 8.5 13.3a3.5 3.5 0 0 1 7 0c0 1.1-.1 2.2-.3 3.2" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-2, none)' }} /><path d="M12 13.3c0 2.6.5 5 1.4 7.2" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-3, none)' }} /><path d="M19 13.3c0 1.7-.2 3.3-.6 4.8" /><path d="M7 5.4a8.6 8.6 0 0 1 10 0" /></>,
);

export const IconoServidor = crearIcono(
  'servidor',
  <><rect x="3.5" y="4" width="17" height="7" rx="2" fill="currentColor" fillOpacity="0.12" /><rect x="3.5" y="13" width="17" height="7" rx="2" fill="currentColor" fillOpacity="0.12" /><path d="M7 7.5h.01M7 16.5h.01" strokeWidth="2" style={{ animation: 'var(--ia-destellar, none)' }} /><path d="M11 7.5h6M11 16.5h6" /></>,
);

export const IconoNube = crearIcono(
  'nube',
  <><path d="M7.5 18.75A4 4 0 0 1 6 11.04a5.5 5.5 0 0 1 10.92-1.19A4.5 4.5 0 0 1 16 18.75Z" fill="currentColor" fillOpacity="0.12" style={{ animation: 'var(--ia-navegar, none)' }} /></>,
);

export const IconoNubeSubir = crearIcono(
  'nube-subir',
  <><path d="M8.5 18.75h-1A4 4 0 0 1 6 11.04a5.5 5.5 0 0 1 10.92-1.19A4.5 4.5 0 0 1 16 18.75h-.5" fill="currentColor" fillOpacity="0.12" /><g style={{ animation: 'var(--ia-subir, none)' }}><path d="M12 20.5v-8M9 15.5l3-3 3 3" /></g></>,
);

export const IconoNubeBajar = crearIcono(
  'nube-bajar',
  <><path d="M8.5 18.75h-1A4 4 0 0 1 6 11.04a5.5 5.5 0 0 1 10.92-1.19A4.5 4.5 0 0 1 16 18.75h-.5" fill="currentColor" fillOpacity="0.12" /><g style={{ animation: 'var(--ia-caer, none)' }}><path d="M12 12.5v8M9 17.5l3 3 3-3" /></g></>,
);

export const IconoCodigo = crearIcono(
  'codigo',
  <><path d="M8 7.5 3.5 12 8 16.5" style={{ animation: 'var(--ia-separar-izq, none)' }} /><path d="M16 7.5 20.5 12 16 16.5" style={{ animation: 'var(--ia-separar-der, none)' }} /><path d="m13.5 5.5-3 13" /></>,
);

export const IconoTerminal = crearIcono(
  'terminal',
  <><rect x="3.5" y="4.5" width="17" height="15" rx="3" fill="currentColor" fillOpacity="0.12" /><path d="M7.5 9.5 10 12l-2.5 2.5" style={{ animation: 'var(--ia-empujar, none)' }} /><path d="M12.5 14.5h4" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-2, none)' }} /></>,
);

export const IconoApi = crearIcono(
  'api',
  <><path d="M8.5 4.5h-1a2 2 0 0 0-2 2v3.25c0 1.1-.9 2.25-2 2.25 1.1 0 2 1.15 2 2.25v3.25a2 2 0 0 0 2 2h1" style={{ animation: 'var(--ia-separar-izq, none)' }} /><path d="M15.5 4.5h1a2 2 0 0 1 2 2v3.25c0 1.1.9 2.25 2 2.25-1.1 0-2 1.15-2 2.25v3.25a2 2 0 0 1-2 2h-1" style={{ animation: 'var(--ia-separar-der, none)' }} /><circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" /></>,
);

export const IconoIntegracion = crearIcono(
  'integracion',
  <><g style={{ animation: 'var(--ia-empujar-arr, none)' }}><path d="M9 3.5v4M15 3.5v4" /><path d="M6.5 7.5h11V11a5.5 5.5 0 0 1-11 0Z" fill="currentColor" fillOpacity="0.12" /></g><path d="M12 16.5v4" /></>,
);

export const IconoFlujo = crearIcono(
  'flujo',
  <><rect x="3.5" y="3.5" width="6" height="6" rx="2" fill="currentColor" fillOpacity="0.12" /><rect x="14.5" y="14.5" width="6" height="6" rx="2" fill="currentColor" fillOpacity="0.12" /><circle cx="6.5" cy="17.5" r="3" fill="currentColor" fillOpacity="0.12" /><path d="M9.5 6.5H15a2.5 2.5 0 0 1 2.5 2.5v5.5" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-1, none)' }} /><path d="M6.5 9.5v5" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ia-trazo-2, none)' }} /></>,
);

/* ---------------------------------------------------------------- Multimedia */

export const IconoReproducir = crearIcono(
  'reproducir',
  <><path d="M7 5.4v13.2a.8.8 0 0 0 1.2.68l10.7-6.6a.8.8 0 0 0 0-1.36L8.2 4.72A.8.8 0 0 0 7 5.4Z" fill="currentColor" fillOpacity="0.12" style={{ animation: 'var(--ia-empujar, none)' }} /></>,
);

export const IconoPausa = crearIcono(
  'pausa',
  <><rect x="6.5" y="5" width="3.5" height="14" rx="1" fill="currentColor" fillOpacity="0.12" style={{ animation: 'var(--ia-encoger-1, none)', transformOrigin: '8.25px 12px' }} /><rect x="14" y="5" width="3.5" height="14" rx="1" fill="currentColor" fillOpacity="0.12" style={{ animation: 'var(--ia-encoger-2, none)', transformOrigin: '15.75px 12px' }} /></>,
);

export const IconoVideo = crearIcono(
  'video',
  <><rect x="3.5" y="6" width="12" height="12" rx="3" fill="currentColor" fillOpacity="0.12" /><path d="m15.5 10 4.17-2.5a.55.55 0 0 1 .83.47v8.06a.55.55 0 0 1-.83.47L15.5 14" style={{ animation: 'var(--ia-empujar, none)' }} /></>,
);

/* ---------------------------------------------------------------- Tema */

export const IconoSol = crearIcono(
  'sol',
  <><circle cx="12" cy="12" r="3.75" fill="currentColor" fillOpacity="0.12" /><g style={{ animation: 'var(--ia-rayos, none)', transformOrigin: '12px 12px' }}><path d="M12 3.5v2.25M12 18.25v2.25M3.5 12h2.25M18.25 12h2.25M5.99 5.99l1.59 1.59M16.42 16.42l1.59 1.59M5.99 18.01l1.59-1.59M16.42 7.58l1.59-1.59" /></g></>,
);

export const IconoLuna = crearIcono(
  'luna',
  <><g style={{ animation: 'var(--ia-inclinar, none)', transformOrigin: '12px 12px' }}><path d="M19.5 14.6A8 8 0 0 1 9.4 4.5a8 8 0 1 0 10.1 10.1Z" fill="currentColor" fillOpacity="0.12" /></g></>,
);

export const IconoContraste = crearIcono(
  'contraste',
  <><circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity="0.12" /><path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" fill="currentColor" stroke="none" style={{ animation: 'var(--ia-voltear, none)', transformOrigin: '12px 12px' }} /></>,
);

/* ---------------------------------------------------------------- Indicadores */

export const IconoCargando = crearIcono(
  'cargando',
  <><circle cx="12" cy="12" r="8.5" strokeOpacity="0.2" /><path d="M12 3.5a8.5 8.5 0 0 1 8.5 8.5" style={{ animation: 'var(--ind-girar, ob-girar 800ms linear infinite)', transformOrigin: '12px 12px' }} /></>,
);

export const IconoEnCurso = crearIcono(
  'en-curso',
  <><circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="3.5" vectorEffect="non-scaling-stroke" style={{ animation: 'var(--ind-pulso, ob-pulso 2400ms cubic-bezier(0.16, 1, 0.3, 1) infinite)', transformOrigin: '12px 12px' }} /></>,
);

export const IconoExitoAnimado = crearIcono(
  'exito-animado',
  <><circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity="0.12" stroke="none" style={{ animation: 'var(--ind-aparecer, ob-aparecer 400ms cubic-bezier(0.16, 1, 0.3, 1) both)' }} /><circle cx="12" cy="12" r="8.5" transform="rotate(-90 12 12)" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ind-trazo, ob-trazar 600ms cubic-bezier(0.16, 1, 0.3, 1) both)' }} /><path d="m8.25 12.25 2.5 2.5 5-5.25" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ind-trazo-2, ob-trazar 420ms cubic-bezier(0.16, 1, 0.3, 1) 280ms both)' }} /></>,
);

export const IconoErrorAnimado = crearIcono(
  'error-animado',
  <><circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity="0.12" stroke="none" style={{ animation: 'var(--ind-aparecer, ob-aparecer 400ms cubic-bezier(0.16, 1, 0.3, 1) both)' }} /><circle cx="12" cy="12" r="8.5" transform="rotate(-90 12 12)" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ind-trazo, ob-trazar 600ms cubic-bezier(0.16, 1, 0.3, 1) both)' }} /><path d="m9.25 9.25 5.5 5.5" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ind-trazo-2, ob-trazar 360ms cubic-bezier(0.16, 1, 0.3, 1) 280ms both)' }} /><path d="m14.75 9.25-5.5 5.5" pathLength="1" strokeDasharray="1" style={{ animation: 'var(--ind-trazo-3, ob-trazar 360ms cubic-bezier(0.16, 1, 0.3, 1) 380ms both)' }} /></>,
);

export const IconoProgreso = crearIcono(
  'progreso',
  <><circle cx="12" cy="12" r="8.5" strokeOpacity="0.2" /><circle cx="12" cy="12" r="8.5" transform="rotate(-90 12 12)" pathLength="100" strokeDasharray="100" style={{ strokeDashoffset: 'calc(100 - var(--progreso, 0))', transition: 'stroke-dashoffset 240ms cubic-bezier(0.16, 1, 0.3, 1)' }} /></>,
);

/* ---------------------------------------------------------------- Catálogo */

/** Todos los iconos por nombre (kebab-case). */
export const ICONOS = {
  'panel': IconoPanel,
  'contratos': IconoContratos,
  'embarques': IconoEmbarques,
  'facturas': IconoFacturas,
  'reportes': IconoReportes,
  'sistema': IconoSistema,
  'buscar': IconoBuscar,
  'filtro': IconoFiltro,
  'nuevo': IconoNuevo,
  'mas': IconoMas,
  'menos': IconoMenos,
  'editar': IconoEditar,
  'eliminar': IconoEliminar,
  'copiar': IconoCopiar,
  'guardar': IconoGuardar,
  'exportar': IconoExportar,
  'importar': IconoImportar,
  'descargar': IconoDescargar,
  'subir': IconoSubir,
  'actualizar': IconoActualizar,
  'deshacer': IconoDeshacer,
  'rehacer': IconoRehacer,
  'enviar': IconoEnviar,
  'imprimir': IconoImprimir,
  'compartir': IconoCompartir,
  'enlace': IconoEnlace,
  'enlace-externo': IconoEnlaceExterno,
  'adjunto': IconoAdjunto,
  'lupa-mas': IconoLupaMas,
  'lupa-menos': IconoLupaMenos,
  'fijar': IconoFijar,
  'marcador': IconoMarcador,
  'estrella': IconoEstrella,
  'etiqueta': IconoEtiqueta,
  'bandera': IconoBandera,
  'ordenar': IconoOrdenar,
  'ver': IconoVer,
  'ocultar': IconoOcultar,
  'apagar': IconoApagar,
  'salir': IconoSalir,
  'entrar': IconoEntrar,
  'inicio': IconoInicio,
  'menu': IconoMenu,
  'flecha': IconoFlecha,
  'flecha-derecha': IconoFlechaDerecha,
  'flecha-izquierda': IconoFlechaIzquierda,
  'flecha-arriba': IconoFlechaArriba,
  'flecha-abajo': IconoFlechaAbajo,
  'flecha-diagonal': IconoFlechaDiagonal,
  'retorno': IconoRetorno,
  'orden': IconoOrden,
  'flechas': IconoFlechas,
  'chevron-derecha': IconoChevronDerecha,
  'chevron-izquierda': IconoChevronIzquierda,
  'chevron-abajo': IconoChevronAbajo,
  'chevron-arriba': IconoChevronArriba,
  'chevrones-izquierda': IconoChevronesIzquierda,
  'chevrones-derecha': IconoChevronesDerecha,
  'cerrar': IconoCerrar,
  'check': IconoCheck,
  'mas-opciones': IconoMasOpciones,
  'mas-opciones-vertical': IconoMasOpcionesVertical,
  'lateral': IconoLateral,
  'columnas': IconoColumnas,
  'tabla': IconoTabla,
  'cuadricula': IconoCuadricula,
  'lista': IconoLista,
  'tarea': IconoTarea,
  'kanban': IconoKanban,
  'pantalla-completa': IconoPantallaCompleta,
  'arrastrar': IconoArrastrar,
  'capas': IconoCapas,
  'ajustes': IconoAjustes,
  'equipo': IconoEquipo,
  'alerta': IconoAlerta,
  'info': IconoInfo,
  'exito': IconoExito,
  'error': IconoError,
  'ayuda': IconoAyuda,
  'reloj': IconoReloj,
  'historial': IconoHistorial,
  'temporizador': IconoTemporizador,
  'calendario': IconoCalendario,
  'calidad': IconoCalidad,
  'campana': IconoCampana,
  'meta': IconoMeta,
  'idea': IconoIdea,
  'chispa': IconoChispa,
  'rayo': IconoRayo,
  'documento': IconoDocumento,
  'carpeta': IconoCarpeta,
  'archivo-excel': IconoArchivoExcel,
  'archivo-pdf': IconoArchivoPdf,
  'archivo-zip': IconoArchivoZip,
  'imagen': IconoImagen,
  'firma': IconoFirma,
  'sello': IconoSello,
  'respaldo': IconoRespaldo,
  'correo': IconoCorreo,
  'comentario': IconoComentario,
  'telefono': IconoTelefono,
  'microfono': IconoMicrofono,
  'globo': IconoGlobo,
  'tendencia': IconoTendencia,
  'tendencia-baja': IconoTendenciaBaja,
  'grafica-barras': IconoGraficaBarras,
  'grafica-lineas': IconoGraficaLineas,
  'grafica-anillo': IconoGraficaAnillo,
  'porcentaje': IconoPorcentaje,
  'calculadora': IconoCalculadora,
  'base-datos': IconoBaseDatos,
  'barco': IconoBarco,
  'puerto': IconoPuerto,
  'contenedor': IconoContenedor,
  'camion': IconoCamion,
  'fabrica': IconoFabrica,
  'caja': IconoCaja,
  'inventario': IconoInventario,
  'peso': IconoPeso,
  'edificio': IconoEdificio,
  'tienda': IconoTienda,
  'ubicacion': IconoUbicacion,
  'mapa': IconoMapa,
  'cartera': IconoCartera,
  'pagos': IconoPagos,
  'moneda': IconoMoneda,
  'tarjeta-credito': IconoTarjetaCredito,
  'banco': IconoBanco,
  'recibo': IconoRecibo,
  'usuario': IconoUsuario,
  'usuarios': IconoUsuarios,
  'usuario-nuevo': IconoUsuarioNuevo,
  'clientes': IconoClientes,
  'candado': IconoCandado,
  'candado-abierto': IconoCandadoAbierto,
  'llave': IconoLlave,
  'escudo': IconoEscudo,
  'huella': IconoHuella,
  'servidor': IconoServidor,
  'nube': IconoNube,
  'nube-subir': IconoNubeSubir,
  'nube-bajar': IconoNubeBajar,
  'codigo': IconoCodigo,
  'terminal': IconoTerminal,
  'api': IconoApi,
  'integracion': IconoIntegracion,
  'flujo': IconoFlujo,
  'reproducir': IconoReproducir,
  'pausa': IconoPausa,
  'video': IconoVideo,
  'sol': IconoSol,
  'luna': IconoLuna,
  'contraste': IconoContraste,
  'cargando': IconoCargando,
  'en-curso': IconoEnCurso,
  'exito-animado': IconoExitoAnimado,
  'error-animado': IconoErrorAnimado,
  'progreso': IconoProgreso,
} as const satisfies Record<string, ComponenteIcono>;

export type NombreIcono = keyof typeof ICONOS;

export interface EntradaCatalogo {
  grupo: string;
  nombre: NombreIcono;
  etiquetas: readonly string[];
  animado: boolean;
  icono: ComponenteIcono;
}

/** Catálogo con categoría, etiquetas de búsqueda y si lleva animación. */
export const CATALOGO_ICONOS: ReadonlyArray<EntradaCatalogo> = [
  { grupo: 'Módulos', nombre: 'panel', etiquetas: ['inicio','tablero','resumen','dashboard'], animado: false, icono: IconoPanel },
  { grupo: 'Módulos', nombre: 'contratos', etiquetas: ['contrato','acuerdo','firma','contract'], animado: true, icono: IconoContratos },
  { grupo: 'Módulos', nombre: 'embarques', etiquetas: ['envío','ruta','viaje','shipment'], animado: true, icono: IconoEmbarques },
  { grupo: 'Módulos', nombre: 'facturas', etiquetas: ['factura','cobro','comprobante','invoice'], animado: true, icono: IconoFacturas },
  { grupo: 'Módulos', nombre: 'reportes', etiquetas: ['informe','análisis','estadística','report'], animado: true, icono: IconoReportes },
  { grupo: 'Módulos', nombre: 'sistema', etiquetas: ['diseño','componentes','formas','design system'], animado: false, icono: IconoSistema },
  { grupo: 'Acciones', nombre: 'buscar', etiquetas: ['lupa','encontrar','search'], animado: true, icono: IconoBuscar },
  { grupo: 'Acciones', nombre: 'filtro', etiquetas: ['filtrar','refinar','filter'], animado: true, icono: IconoFiltro },
  { grupo: 'Acciones', nombre: 'nuevo', etiquetas: ['crear','añadir','agregar','new'], animado: true, icono: IconoNuevo },
  { grupo: 'Acciones', nombre: 'mas', etiquetas: ['añadir','sumar','agregar','plus'], animado: true, icono: IconoMas },
  { grupo: 'Acciones', nombre: 'menos', etiquetas: ['quitar','restar','reducir','minus'], animado: true, icono: IconoMenos },
  { grupo: 'Acciones', nombre: 'editar', etiquetas: ['lápiz','modificar','escribir','edit'], animado: true, icono: IconoEditar },
  { grupo: 'Acciones', nombre: 'eliminar', etiquetas: ['borrar','papelera','quitar','delete'], animado: true, icono: IconoEliminar },
  { grupo: 'Acciones', nombre: 'copiar', etiquetas: ['duplicar','portapapeles','copy'], animado: true, icono: IconoCopiar },
  { grupo: 'Acciones', nombre: 'guardar', etiquetas: ['disco','salvar','save'], animado: true, icono: IconoGuardar },
  { grupo: 'Acciones', nombre: 'exportar', etiquetas: ['sacar','enviar fuera','excel','export'], animado: true, icono: IconoExportar },
  { grupo: 'Acciones', nombre: 'importar', etiquetas: ['cargar','traer','excel','import'], animado: true, icono: IconoImportar },
  { grupo: 'Acciones', nombre: 'descargar', etiquetas: ['bajar','guardar','download'], animado: true, icono: IconoDescargar },
  { grupo: 'Acciones', nombre: 'subir', etiquetas: ['cargar','adjuntar','upload'], animado: true, icono: IconoSubir },
  { grupo: 'Acciones', nombre: 'actualizar', etiquetas: ['recargar','sincronizar','refrescar','refresh'], animado: true, icono: IconoActualizar },
  { grupo: 'Acciones', nombre: 'deshacer', etiquetas: ['volver','revertir','undo'], animado: true, icono: IconoDeshacer },
  { grupo: 'Acciones', nombre: 'rehacer', etiquetas: ['repetir','avanzar','redo'], animado: true, icono: IconoRehacer },
  { grupo: 'Acciones', nombre: 'enviar', etiquetas: ['mandar','avión de papel','send'], animado: true, icono: IconoEnviar },
  { grupo: 'Acciones', nombre: 'imprimir', etiquetas: ['impresora','papel','print'], animado: true, icono: IconoImprimir },
  { grupo: 'Acciones', nombre: 'compartir', etiquetas: ['red','difundir','share'], animado: true, icono: IconoCompartir },
  { grupo: 'Acciones', nombre: 'enlace', etiquetas: ['vínculo','url','cadena','link'], animado: true, icono: IconoEnlace },
  { grupo: 'Acciones', nombre: 'enlace-externo', etiquetas: ['abrir','nueva pestaña','external'], animado: true, icono: IconoEnlaceExterno },
  { grupo: 'Acciones', nombre: 'adjunto', etiquetas: ['clip','adjuntar','attachment'], animado: true, icono: IconoAdjunto },
  { grupo: 'Acciones', nombre: 'lupa-mas', etiquetas: ['acercar','zoom','ampliar'], animado: true, icono: IconoLupaMas },
  { grupo: 'Acciones', nombre: 'lupa-menos', etiquetas: ['alejar','zoom','reducir'], animado: true, icono: IconoLupaMenos },
  { grupo: 'Acciones', nombre: 'fijar', etiquetas: ['chincheta','anclar','pin'], animado: true, icono: IconoFijar },
  { grupo: 'Acciones', nombre: 'marcador', etiquetas: ['guardar','favorito','bookmark'], animado: true, icono: IconoMarcador },
  { grupo: 'Acciones', nombre: 'estrella', etiquetas: ['favorito','destacar','star'], animado: true, icono: IconoEstrella },
  { grupo: 'Acciones', nombre: 'etiqueta', etiquetas: ['tag','categoría','marca'], animado: true, icono: IconoEtiqueta },
  { grupo: 'Acciones', nombre: 'bandera', etiquetas: ['marcar','reportar','hito','flag'], animado: true, icono: IconoBandera },
  { grupo: 'Acciones', nombre: 'ordenar', etiquetas: ['orden','clasificar','sort'], animado: true, icono: IconoOrdenar },
  { grupo: 'Acciones', nombre: 'ver', etiquetas: ['ojo','mostrar','visible','view'], animado: true, icono: IconoVer },
  { grupo: 'Acciones', nombre: 'ocultar', etiquetas: ['ojo','esconder','invisible','hide'], animado: true, icono: IconoOcultar },
  { grupo: 'Acciones', nombre: 'apagar', etiquetas: ['cerrar','salir','energía','power'], animado: true, icono: IconoApagar },
  { grupo: 'Acciones', nombre: 'salir', etiquetas: ['cerrar sesión','logout','puerta'], animado: true, icono: IconoSalir },
  { grupo: 'Acciones', nombre: 'entrar', etiquetas: ['iniciar sesión','login','acceder'], animado: true, icono: IconoEntrar },
  { grupo: 'Navegación', nombre: 'inicio', etiquetas: ['casa','portada','home'], animado: true, icono: IconoInicio },
  { grupo: 'Navegación', nombre: 'menu', etiquetas: ['hamburguesa','opciones','menu'], animado: true, icono: IconoMenu },
  { grupo: 'Navegación', nombre: 'flecha', etiquetas: ['siguiente','ir','derecha','arrow'], animado: true, icono: IconoFlecha },
  { grupo: 'Navegación', nombre: 'flecha-derecha', etiquetas: ['siguiente','avanzar','arrow right'], animado: true, icono: IconoFlechaDerecha },
  { grupo: 'Navegación', nombre: 'flecha-izquierda', etiquetas: ['anterior','volver','arrow left'], animado: true, icono: IconoFlechaIzquierda },
  { grupo: 'Navegación', nombre: 'flecha-arriba', etiquetas: ['subir','ascendente','arrow up'], animado: true, icono: IconoFlechaArriba },
  { grupo: 'Navegación', nombre: 'flecha-abajo', etiquetas: ['bajar','descendente','arrow down'], animado: true, icono: IconoFlechaAbajo },
  { grupo: 'Navegación', nombre: 'flecha-diagonal', etiquetas: ['abrir','ir a','arrow up right'], animado: true, icono: IconoFlechaDiagonal },
  { grupo: 'Navegación', nombre: 'retorno', etiquetas: ['intro','enter','devolver'], animado: true, icono: IconoRetorno },
  { grupo: 'Navegación', nombre: 'orden', etiquetas: ['ascendente','dirección de orden','sort'], animado: true, icono: IconoOrden },
  { grupo: 'Navegación', nombre: 'flechas', etiquetas: ['selector','desplegable','arriba y abajo'], animado: false, icono: IconoFlechas },
  { grupo: 'Navegación', nombre: 'chevron-derecha', etiquetas: ['siguiente','expandir','chevron'], animado: true, icono: IconoChevronDerecha },
  { grupo: 'Navegación', nombre: 'chevron-izquierda', etiquetas: ['anterior','atrás','chevron'], animado: true, icono: IconoChevronIzquierda },
  { grupo: 'Navegación', nombre: 'chevron-abajo', etiquetas: ['desplegar','abrir','chevron'], animado: false, icono: IconoChevronAbajo },
  { grupo: 'Navegación', nombre: 'chevron-arriba', etiquetas: ['plegar','cerrar','chevron'], animado: false, icono: IconoChevronArriba },
  { grupo: 'Navegación', nombre: 'chevrones-izquierda', etiquetas: ['plegar lateral','primero','chevron'], animado: true, icono: IconoChevronesIzquierda },
  { grupo: 'Navegación', nombre: 'chevrones-derecha', etiquetas: ['desplegar lateral','último','chevron'], animado: true, icono: IconoChevronesDerecha },
  { grupo: 'Navegación', nombre: 'cerrar', etiquetas: ['equis','salir','descartar','close'], animado: true, icono: IconoCerrar },
  { grupo: 'Navegación', nombre: 'check', etiquetas: ['hecho','confirmar','aceptar','check'], animado: true, icono: IconoCheck },
  { grupo: 'Navegación', nombre: 'mas-opciones', etiquetas: ['puntos','acciones','más','more'], animado: false, icono: IconoMasOpciones },
  { grupo: 'Navegación', nombre: 'mas-opciones-vertical', etiquetas: ['puntos','acciones','kebab'], animado: false, icono: IconoMasOpcionesVertical },
  { grupo: 'Interfaz', nombre: 'lateral', etiquetas: ['barra lateral','panel','sidebar'], animado: false, icono: IconoLateral },
  { grupo: 'Interfaz', nombre: 'columnas', etiquetas: ['diseño','vista','columns'], animado: false, icono: IconoColumnas },
  { grupo: 'Interfaz', nombre: 'tabla', etiquetas: ['cuadrícula','datos','filas','table'], animado: true, icono: IconoTabla },
  { grupo: 'Interfaz', nombre: 'cuadricula', etiquetas: ['mosaico','vista','grid'], animado: false, icono: IconoCuadricula },
  { grupo: 'Interfaz', nombre: 'lista', etiquetas: ['viñetas','elementos','list'], animado: true, icono: IconoLista },
  { grupo: 'Interfaz', nombre: 'tarea', etiquetas: ['pendiente','casilla','hecho','task'], animado: true, icono: IconoTarea },
  { grupo: 'Interfaz', nombre: 'kanban', etiquetas: ['tablero','columnas','board'], animado: true, icono: IconoKanban },
  { grupo: 'Interfaz', nombre: 'pantalla-completa', etiquetas: ['maximizar','expandir','fullscreen'], animado: true, icono: IconoPantallaCompleta },
  { grupo: 'Interfaz', nombre: 'arrastrar', etiquetas: ['mover','asa','reordenar','drag'], animado: false, icono: IconoArrastrar },
  { grupo: 'Interfaz', nombre: 'capas', etiquetas: ['niveles','apilar','layers'], animado: true, icono: IconoCapas },
  { grupo: 'Interfaz', nombre: 'ajustes', etiquetas: ['engranaje','configuración','preferencias','settings'], animado: true, icono: IconoAjustes },
  { grupo: 'Interfaz', nombre: 'equipo', etiquetas: ['computador','monitor','este equipo','computer'], animado: false, icono: IconoEquipo },
  { grupo: 'Estado', nombre: 'alerta', etiquetas: ['advertencia','cuidado','warning'], animado: true, icono: IconoAlerta },
  { grupo: 'Estado', nombre: 'info', etiquetas: ['información','detalle','nota','info'], animado: true, icono: IconoInfo },
  { grupo: 'Estado', nombre: 'exito', etiquetas: ['correcto','listo','aprobado','success'], animado: true, icono: IconoExito },
  { grupo: 'Estado', nombre: 'error', etiquetas: ['fallo','rechazado','cancelado','error'], animado: true, icono: IconoError },
  { grupo: 'Estado', nombre: 'ayuda', etiquetas: ['pregunta','duda','soporte','help'], animado: true, icono: IconoAyuda },
  { grupo: 'Estado', nombre: 'reloj', etiquetas: ['hora','tiempo','pendiente','clock'], animado: true, icono: IconoReloj },
  { grupo: 'Estado', nombre: 'historial', etiquetas: ['antes','registro','cambios','history'], animado: true, icono: IconoHistorial },
  { grupo: 'Estado', nombre: 'temporizador', etiquetas: ['cronómetro','plazo','cuenta atrás','timer'], animado: true, icono: IconoTemporizador },
  { grupo: 'Estado', nombre: 'calendario', etiquetas: ['fecha','día','agenda','calendar'], animado: true, icono: IconoCalendario },
  { grupo: 'Estado', nombre: 'calidad', etiquetas: ['certificado','garantía','verificado','quality'], animado: true, icono: IconoCalidad },
  { grupo: 'Estado', nombre: 'campana', etiquetas: ['notificaciones','aviso','bell'], animado: true, icono: IconoCampana },
  { grupo: 'Estado', nombre: 'meta', etiquetas: ['objetivo','diana','target'], animado: true, icono: IconoMeta },
  { grupo: 'Estado', nombre: 'idea', etiquetas: ['bombilla','sugerencia','consejo','idea'], animado: true, icono: IconoIdea },
  { grupo: 'Estado', nombre: 'chispa', etiquetas: ['ia','inteligencia artificial','automático','sparkle'], animado: true, icono: IconoChispa },
  { grupo: 'Estado', nombre: 'rayo', etiquetas: ['rápido','energía','automatizar','flash'], animado: true, icono: IconoRayo },
  { grupo: 'Archivos', nombre: 'documento', etiquetas: ['archivo','página','texto','document'], animado: true, icono: IconoDocumento },
  { grupo: 'Archivos', nombre: 'carpeta', etiquetas: ['directorio','agrupar','folder'], animado: true, icono: IconoCarpeta },
  { grupo: 'Archivos', nombre: 'archivo-excel', etiquetas: ['hoja de cálculo','xlsx','csv','spreadsheet'], animado: true, icono: IconoArchivoExcel },
  { grupo: 'Archivos', nombre: 'archivo-pdf', etiquetas: ['pdf','maquetado','imprimible'], animado: true, icono: IconoArchivoPdf },
  { grupo: 'Archivos', nombre: 'archivo-zip', etiquetas: ['comprimido','zip','paquete','archive'], animado: true, icono: IconoArchivoZip },
  { grupo: 'Archivos', nombre: 'imagen', etiquetas: ['foto','fotografía','image'], animado: true, icono: IconoImagen },
  { grupo: 'Archivos', nombre: 'firma', etiquetas: ['firmar','rúbrica','signature'], animado: true, icono: IconoFirma },
  { grupo: 'Archivos', nombre: 'sello', etiquetas: ['estampar','aprobar','timbre','stamp'], animado: true, icono: IconoSello },
  { grupo: 'Archivos', nombre: 'respaldo', etiquetas: ['copia de seguridad','base de datos','backup'], animado: true, icono: IconoRespaldo },
  { grupo: 'Comunicación', nombre: 'correo', etiquetas: ['email','mensaje','sobre','mail'], animado: true, icono: IconoCorreo },
  { grupo: 'Comunicación', nombre: 'comentario', etiquetas: ['mensaje','nota','chat','comment'], animado: true, icono: IconoComentario },
  { grupo: 'Comunicación', nombre: 'telefono', etiquetas: ['llamar','contacto','phone'], animado: true, icono: IconoTelefono },
  { grupo: 'Comunicación', nombre: 'microfono', etiquetas: ['voz','grabar','dictado','microphone'], animado: true, icono: IconoMicrofono },
  { grupo: 'Comunicación', nombre: 'globo', etiquetas: ['mundo','internacional','idioma','globe'], animado: true, icono: IconoGlobo },
  { grupo: 'Datos y análisis', nombre: 'tendencia', etiquetas: ['subida','crecimiento','alza','trending up'], animado: true, icono: IconoTendencia },
  { grupo: 'Datos y análisis', nombre: 'tendencia-baja', etiquetas: ['bajada','caída','descenso','trending down'], animado: true, icono: IconoTendenciaBaja },
  { grupo: 'Datos y análisis', nombre: 'grafica-barras', etiquetas: ['gráfico','columnas','bar chart'], animado: true, icono: IconoGraficaBarras },
  { grupo: 'Datos y análisis', nombre: 'grafica-lineas', etiquetas: ['gráfico','serie','evolución','line chart'], animado: true, icono: IconoGraficaLineas },
  { grupo: 'Datos y análisis', nombre: 'grafica-anillo', etiquetas: ['gráfico','proporción','reparto','donut chart'], animado: true, icono: IconoGraficaAnillo },
  { grupo: 'Datos y análisis', nombre: 'porcentaje', etiquetas: ['por ciento','tasa','descuento','percent'], animado: false, icono: IconoPorcentaje },
  { grupo: 'Datos y análisis', nombre: 'calculadora', etiquetas: ['calcular','cuentas','calculator'], animado: false, icono: IconoCalculadora },
  { grupo: 'Datos y análisis', nombre: 'base-datos', etiquetas: ['datos','almacenamiento','database'], animado: true, icono: IconoBaseDatos },
  { grupo: 'Operación', nombre: 'barco', etiquetas: ['motonave','buque','naviera','ship'], animado: true, icono: IconoBarco },
  { grupo: 'Operación', nombre: 'puerto', etiquetas: ['grúa','muelle','terminal','port'], animado: true, icono: IconoPuerto },
  { grupo: 'Operación', nombre: 'contenedor', etiquetas: ['carga','container','TEU'], animado: true, icono: IconoContenedor },
  { grupo: 'Operación', nombre: 'camion', etiquetas: ['transporte','entrega','terrestre','truck'], animado: true, icono: IconoCamion },
  { grupo: 'Operación', nombre: 'fabrica', etiquetas: ['planta','producción','molino','factory'], animado: true, icono: IconoFabrica },
  { grupo: 'Operación', nombre: 'caja', etiquetas: ['paquete','producto','bulto','package'], animado: true, icono: IconoCaja },
  { grupo: 'Operación', nombre: 'inventario', etiquetas: ['bodega','existencias','estantería','stock'], animado: true, icono: IconoInventario },
  { grupo: 'Operación', nombre: 'peso', etiquetas: ['toneladas','balanza','kilos','weight'], animado: true, icono: IconoPeso },
  { grupo: 'Operación', nombre: 'edificio', etiquetas: ['empresa','oficina','sede','building'], animado: false, icono: IconoEdificio },
  { grupo: 'Operación', nombre: 'tienda', etiquetas: ['comercio','local','punto de venta','store'], animado: false, icono: IconoTienda },
  { grupo: 'Operación', nombre: 'ubicacion', etiquetas: ['lugar','dirección','pin','location'], animado: true, icono: IconoUbicacion },
  { grupo: 'Operación', nombre: 'mapa', etiquetas: ['plano','territorio','map'], animado: true, icono: IconoMapa },
  { grupo: 'Finanzas', nombre: 'cartera', etiquetas: ['billetera','saldo','cuentas por cobrar','wallet'], animado: true, icono: IconoCartera },
  { grupo: 'Finanzas', nombre: 'pagos', etiquetas: ['dinero','billete','abono','payment'], animado: true, icono: IconoPagos },
  { grupo: 'Finanzas', nombre: 'moneda', etiquetas: ['dólar','precio','divisa','coin'], animado: true, icono: IconoMoneda },
  { grupo: 'Finanzas', nombre: 'tarjeta-credito', etiquetas: ['tarjeta','pago','débito','credit card'], animado: true, icono: IconoTarjetaCredito },
  { grupo: 'Finanzas', nombre: 'banco', etiquetas: ['entidad','transferencia','swift','bank'], animado: true, icono: IconoBanco },
  { grupo: 'Finanzas', nombre: 'recibo', etiquetas: ['ticket','comprobante','soporte','receipt'], animado: true, icono: IconoRecibo },
  { grupo: 'Personas', nombre: 'usuario', etiquetas: ['persona','perfil','cuenta','user'], animado: false, icono: IconoUsuario },
  { grupo: 'Personas', nombre: 'usuarios', etiquetas: ['personas','grupo','equipo de trabajo','users'], animado: false, icono: IconoUsuarios },
  { grupo: 'Personas', nombre: 'usuario-nuevo', etiquetas: ['invitar','añadir persona','user plus'], animado: true, icono: IconoUsuarioNuevo },
  { grupo: 'Personas', nombre: 'clientes', etiquetas: ['compradores','contactos','cartera de clientes','customers'], animado: true, icono: IconoClientes },
  { grupo: 'Seguridad y sistemas', nombre: 'candado', etiquetas: ['bloqueado','seguro','privado','lock'], animado: true, icono: IconoCandado },
  { grupo: 'Seguridad y sistemas', nombre: 'candado-abierto', etiquetas: ['desbloqueado','abierto','unlock'], animado: true, icono: IconoCandadoAbierto },
  { grupo: 'Seguridad y sistemas', nombre: 'llave', etiquetas: ['acceso','contraseña','clave','key'], animado: true, icono: IconoLlave },
  { grupo: 'Seguridad y sistemas', nombre: 'escudo', etiquetas: ['protección','seguridad','shield'], animado: true, icono: IconoEscudo },
  { grupo: 'Seguridad y sistemas', nombre: 'huella', etiquetas: ['biometría','identidad','fingerprint'], animado: true, icono: IconoHuella },
  { grupo: 'Seguridad y sistemas', nombre: 'servidor', etiquetas: ['servidor','host','infraestructura','server'], animado: true, icono: IconoServidor },
  { grupo: 'Seguridad y sistemas', nombre: 'nube', etiquetas: ['en línea','almacenamiento','cloud'], animado: true, icono: IconoNube },
  { grupo: 'Seguridad y sistemas', nombre: 'nube-subir', etiquetas: ['sincronizar','subir a la nube','cloud upload'], animado: true, icono: IconoNubeSubir },
  { grupo: 'Seguridad y sistemas', nombre: 'nube-bajar', etiquetas: ['descargar de la nube','sincronizar','cloud download'], animado: true, icono: IconoNubeBajar },
  { grupo: 'Seguridad y sistemas', nombre: 'codigo', etiquetas: ['desarrollo','html','programar','code'], animado: true, icono: IconoCodigo },
  { grupo: 'Seguridad y sistemas', nombre: 'terminal', etiquetas: ['consola','comandos','línea de comandos','terminal'], animado: true, icono: IconoTerminal },
  { grupo: 'Seguridad y sistemas', nombre: 'api', etiquetas: ['interfaz','llaves','servicio','api'], animado: true, icono: IconoApi },
  { grupo: 'Seguridad y sistemas', nombre: 'integracion', etiquetas: ['conectar','enchufe','plugin','integration'], animado: true, icono: IconoIntegracion },
  { grupo: 'Seguridad y sistemas', nombre: 'flujo', etiquetas: ['proceso','automatización','diagrama','workflow'], animado: true, icono: IconoFlujo },
  { grupo: 'Multimedia', nombre: 'reproducir', etiquetas: ['play','iniciar','video'], animado: true, icono: IconoReproducir },
  { grupo: 'Multimedia', nombre: 'pausa', etiquetas: ['detener','pausar','pause'], animado: true, icono: IconoPausa },
  { grupo: 'Multimedia', nombre: 'video', etiquetas: ['grabación','cámara','reunión','video'], animado: true, icono: IconoVideo },
  { grupo: 'Tema', nombre: 'sol', etiquetas: ['claro','día','tema claro','light'], animado: true, icono: IconoSol },
  { grupo: 'Tema', nombre: 'luna', etiquetas: ['oscuro','noche','tema oscuro','dark'], animado: true, icono: IconoLuna },
  { grupo: 'Tema', nombre: 'contraste', etiquetas: ['automático','tema del sistema','contrast'], animado: true, icono: IconoContraste },
  { grupo: 'Indicadores', nombre: 'cargando', etiquetas: ['spinner','espera','procesando','loading'], animado: true, icono: IconoCargando },
  { grupo: 'Indicadores', nombre: 'en-curso', etiquetas: ['pulso','en vivo','activo','live'], animado: true, icono: IconoEnCurso },
  { grupo: 'Indicadores', nombre: 'exito-animado', etiquetas: ['hecho','completado','confirmación','success'], animado: true, icono: IconoExitoAnimado },
  { grupo: 'Indicadores', nombre: 'error-animado', etiquetas: ['fallo','rechazo','falla','error'], animado: true, icono: IconoErrorAnimado },
  { grupo: 'Indicadores', nombre: 'progreso', etiquetas: ['avance','porcentaje','carga','progress'], animado: false, icono: IconoProgreso },
];
