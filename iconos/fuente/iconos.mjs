/*
 * Obsidiana · fuente única de verdad del juego de iconos.
 *
 * Todo lo demás (svg/, sprite.svg, iconos.js, iconos.css, iconos.json, react/) se genera desde
 * aquí con `node generar.mjs`. No edites los archivos generados.
 *
 * Reglas de dibujo (resumen; detalle en ../LEEME.md):
 *   · Retícula 24 × 24, área viva de 3.5 a 20.5. Los trazos abiertos pueden asomar medio trazo.
 *   · Trazo 1.5, extremos y uniones redondeados, `currentColor`.
 *   · Formas cerradas con relleno al 12 % (constante R). Solo una o dos por icono.
 *   · Radios: 3.5 en cuadrados de 17 × 17, 3 en marcos grandes, 2 en piezas medianas,
 *     1–1.5 en piezas pequeñas. Documentos: pliegue de 5 y esquinas de 1.5.
 *   · Puntos: círculo lleno r 1.5 si van solos (más opciones, asas); r 1.25 en viñetas;
 *     `h.01` con trazo 2 bajo otros trazos (alerta, info).
 *   · Animación al pasar el cursor: el elemento lleva `style="animation: var(--ia-nombre, none)"`.
 *     Las variables viven en ANIMACIONES (abajo) y solo existen durante el hover del control.
 */

/** Relleno de las formas cerradas: 12 % del color actual. */
const R = 'fill="currentColor" fill-opacity="0.12"';
/** Relleno sólido sin trazo (puntos). */
const L = 'fill="currentColor" stroke="none"';

/** Estilo de animación al pasar el cursor, con origen opcional en coordenadas de la retícula. */
const a = (nombre, origen) =>
  `style="animation: var(--ia-${nombre}, none)${origen ? `; transform-origin: ${origen}` : ''}"`;

/** Trazo que se dibuja: longitud normalizada a 1 y guion de 1. */
const t = (nombre = 'trazo-1') => `pathLength="1" stroke-dasharray="1" ${a(nombre)}`;

/** Punto sólido. */
const punto = (x, y, r = 1.5, extra = '') => `<circle cx="${x}" cy="${y}" r="${r}" ${L}${extra ? ` ${extra}` : ''}/>`;

/** Silueta de documento (pliegue de 5, esquinas 1.5) y su pliegue. */
const DOC = 'M7 3.5h6.5l5 5V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z';
const PLIEGUE = 'M13.5 3.5v5h5';
const documento = (contenido) => `<path d="${DOC}" ${R}/><path d="${PLIEGUE}"/>${contenido}`;

/** Lupa común a buscar, lupa-mas y lupa-menos. */
const lupa = (dentro = '') =>
  `<g ${a('asomar')}><circle cx="10.75" cy="10.75" r="6.25" ${R}/><path d="m15.5 15.5 4.75 4.75"/>${dentro}</g>`;

/** Ojo común a ver y ocultar. */
const OJO = 'M3 12s3.25-6.25 9-6.25S21 12 21 12s-3.25 6.25-9 6.25S3 12 3 12Z';

/** Nube común a nube, nube-subir y nube-bajar. */
const NUBE = 'M7.5 18.75A4 4 0 0 1 6 11.04a5.5 5.5 0 0 1 10.92-1.19A4.5 4.5 0 0 1 16 18.75Z';
const NUBE_ABIERTA = 'M8.5 18.75h-1A4 4 0 0 1 6 11.04a5.5 5.5 0 0 1 10.92-1.19A4.5 4.5 0 0 1 16 18.75h-.5';

/** Bandeja de descargar y subir. */
const BANDEJA = 'M3.5 14.5v3a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-3';

const f = (n) => Number(n.toFixed(2));

/** Engranaje de `dientes` dientes, calculado para que todos los dientes sean idénticos. */
function engranaje(cx, cy, rExt, rInt, dientes, medioExt, medioInt) {
  const p = (r, grados) => {
    const rad = (grados * Math.PI) / 180;
    return `${f(cx + r * Math.cos(rad))} ${f(cy + r * Math.sin(rad))}`;
  };
  let d = '';
  for (let k = 0; k < dientes; k++) {
    const c = (k * 360) / dientes - 90;
    const p1 = p(rInt, c - medioInt);
    d += k === 0 ? `M${p1}` : `A${rInt} ${rInt} 0 0 1 ${p1}`;
    d += `L${p(rExt, c - medioExt)}A${rExt} ${rExt} 0 0 1 ${p(rExt, c + medioExt)}L${p(rInt, c + medioInt)}`;
  }
  return `${d}A${rInt} ${rInt} 0 0 1 ${p(rInt, -90 - medioInt)}Z`;
}

/** Sector de anillo entre los ángulos a0 y a1 (grados, en sentido horario desde arriba). */
function sector(cx, cy, rExt, rInt, a0, a1) {
  const p = (r, g) => {
    const rad = ((g - 90) * Math.PI) / 180;
    return `${f(cx + r * Math.cos(rad))} ${f(cy + r * Math.sin(rad))}`;
  };
  const grande = a1 - a0 > 180 ? 1 : 0;
  return `M${p(rExt, a0)}A${rExt} ${rExt} 0 ${grande} 1 ${p(rExt, a1)}L${p(rInt, a1)}A${rInt} ${rInt} 0 ${grande} 0 ${p(rInt, a0)}Z`;
}

/* ------------------------------------------------------------------------------------------ */
/* Animaciones al pasar el cursor                                                              */
/* nombre de variable → [keyframes, duración ms, retraso ms]                                   */
/* ------------------------------------------------------------------------------------------ */

export const CURVA = 'cubic-bezier(0.16, 1, 0.3, 1)';

export const KEYFRAMES = {
  'ic-trazar': 'from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; }',
  'ic-caer':
    '0% { transform: none; opacity: 1; } 38% { transform: translateY(5px); opacity: 0; } 39% { transform: translateY(-6px); opacity: 0; } 100% { transform: none; opacity: 1; }',
  'ic-subir':
    '0% { transform: none; opacity: 1; } 38% { transform: translateY(-5px); opacity: 0; } 39% { transform: translateY(6px); opacity: 0; } 100% { transform: none; opacity: 1; }',
  'ic-despegar':
    '0% { transform: none; opacity: 1; } 38% { transform: translate(4px, -4px); opacity: 0; } 39% { transform: translate(-4px, 4px); opacity: 0; } 100% { transform: none; opacity: 1; }',
  'ic-empujar': '0%, 100% { transform: none; } 45% { transform: translateX(2.5px); }',
  'ic-empujar-izq': '0%, 100% { transform: none; } 45% { transform: translateX(-2.5px); }',
  'ic-empujar-arr': '0%, 100% { transform: none; } 45% { transform: translateY(-2.5px); }',
  'ic-empujar-ab': '0%, 100% { transform: none; } 45% { transform: translateY(2.5px); }',
  'ic-salir': '0%, 100% { transform: none; } 45% { transform: translate(2px, -2px); }',
  'ic-girar-cuarto': 'from { transform: rotate(0); } to { transform: rotate(90deg); }',
  'ic-rayos': 'from { transform: rotate(0); } to { transform: rotate(45deg); }',
  'ic-inclinar': '0%, 100% { transform: rotate(0); } 45% { transform: rotate(-16deg); }',
  'ic-inclinar-der': '0%, 100% { transform: rotate(0); } 45% { transform: rotate(16deg); }',
  'ic-asomar': '0%, 100% { transform: none; } 45% { transform: translate(-1.5px, -1.5px); }',
  'ic-navegar': '0%, 100% { transform: none; } 45% { transform: translateX(2.5px); }',
  'ic-reloj': 'from { transform: rotate(0); } to { transform: rotate(360deg); }',
  'ic-reloj-atras': 'from { transform: rotate(0); } to { transform: rotate(-360deg); }',
  'ic-media-vuelta': 'from { transform: rotate(0); } to { transform: rotate(180deg); }',
  'ic-barras': 'from { transform: scaleY(0.35); } to { transform: scaleY(1); }',
  'ic-ruta': 'from { stroke-dashoffset: 9.6; } to { stroke-dashoffset: 0; }',
  'ic-encoger': '0%, 100% { transform: none; } 45% { transform: scaleX(0.6); }',
  'ic-encender': '0%, 100% { transform: none; } 45% { transform: translateY(-1.5px); }',
  'ic-parpadear': '0%, 100% { transform: none; } 40% { transform: scaleY(0.12); }',
  'ic-levantar': '0%, 100% { transform: none; } 45% { transform: translateY(-2px); }',
  'ic-presionar': '0%, 100% { transform: none; } 40% { transform: translateY(1.5px); }',
  'ic-pulsar': '0%, 100% { transform: none; } 40% { transform: scale(0.82); }',
  'ic-destello':
    'from { transform: scale(0.5) rotate(-45deg); opacity: 0; } to { transform: none; opacity: 1; }',
  'ic-aterrizar': 'from { transform: translateY(-3px); opacity: 0; } to { transform: none; opacity: 1; }',
  'ic-apilar': 'from { transform: translate(-5px, -5px); opacity: 0; } to { transform: none; opacity: 1; }',
  'ic-voltear': '0%, 100% { transform: none; } 50% { transform: scaleX(0.15); }',
  'ic-destellar': '0%, 100% { opacity: 1; } 40% { opacity: 0.25; }',
  'ic-separar-izq': '0%, 100% { transform: none; } 45% { transform: translateX(-1.5px); }',
  'ic-separar-der': '0%, 100% { transform: none; } 45% { transform: translateX(1.5px); }',
  'ic-expandir': '0%, 100% { transform: none; } 45% { transform: scale(1.1); }',
};

export const ANIMACIONES = {
  'trazo-1': ['ic-trazar', 420, 0],
  'trazo-2': ['ic-trazar', 420, 90],
  'trazo-3': ['ic-trazar', 420, 180],
  'trazo-lento': ['ic-trazar', 560, 0],
  caer: ['ic-caer', 560, 0],
  subir: ['ic-subir', 560, 0],
  despegar: ['ic-despegar', 560, 0],
  empujar: ['ic-empujar', 420, 0],
  'empujar-izq': ['ic-empujar-izq', 420, 0],
  'empujar-arr': ['ic-empujar-arr', 420, 0],
  'empujar-ab': ['ic-empujar-ab', 420, 0],
  salir: ['ic-salir', 400, 0],
  girar: ['ic-girar-cuarto', 360, 0],
  rayos: ['ic-rayos', 420, 0],
  inclinar: ['ic-inclinar', 480, 0],
  'inclinar-der': ['ic-inclinar-der', 480, 0],
  asomar: ['ic-asomar', 380, 0],
  navegar: ['ic-navegar', 520, 0],
  reloj: ['ic-reloj', 600, 0],
  'reloj-atras': ['ic-reloj-atras', 600, 0],
  'media-vuelta': ['ic-media-vuelta', 520, 0],
  'barra-1': ['ic-barras', 420, 0],
  'barra-2': ['ic-barras', 420, 60],
  'barra-3': ['ic-barras', 420, 120],
  ruta: ['ic-ruta', 600, 0],
  'encoger-1': ['ic-encoger', 420, 0],
  'encoger-2': ['ic-encoger', 420, 60],
  'encoger-3': ['ic-encoger', 420, 120],
  encender: ['ic-encender', 380, 0],
  parpadear: ['ic-parpadear', 360, 0],
  levantar: ['ic-levantar', 420, 0],
  presionar: ['ic-presionar', 360, 0],
  pulsar: ['ic-pulsar', 420, 0],
  destello: ['ic-destello', 520, 0],
  aterrizar: ['ic-aterrizar', 460, 0],
  apilar: ['ic-apilar', 460, 0],
  voltear: ['ic-voltear', 560, 0],
  destellar: ['ic-destellar', 480, 0],
  'separar-izq': ['ic-separar-izq', 420, 0],
  'separar-der': ['ic-separar-der', 420, 0],
  expandir: ['ic-expandir', 420, 0],
};

/* Indicadores: animación continua o de entrada, fuera del hover. */
export const KEYFRAMES_INDICADORES = {
  'ob-girar': 'to { transform: rotate(360deg); }',
  'ob-pulso':
    '0% { transform: scale(1); opacity: 0.55; } 70%, 100% { transform: scale(2.4); opacity: 0; }',
  'ob-trazar': 'from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; }',
  'ob-aparecer': 'from { opacity: 0; } to { opacity: 1; }',
};

const ind = (variable, valor) => `animation: var(--ind-${variable}, ${valor})`;

/* ------------------------------------------------------------------------------------------ */
/* Catálogo                                                                                    */
/* ------------------------------------------------------------------------------------------ */

export const CATEGORIAS = [
  'Módulos',
  'Acciones',
  'Navegación',
  'Interfaz',
  'Estado',
  'Archivos',
  'Comunicación',
  'Datos y análisis',
  'Operación',
  'Finanzas',
  'Personas',
  'Seguridad y sistemas',
  'Multimedia',
  'Tema',
  'Indicadores',
];

/** nombre → { categoria, etiquetas, cuerpo } (el campo `animado` lo calcula el generador). */
export const ICONOS = {};
let categoriaActual = '';
const cat = (c) => {
  categoriaActual = c;
};
const i = (nombre, etiquetas, cuerpo) => {
  if (ICONOS[nombre]) throw new Error(`Icono duplicado: ${nombre}`);
  ICONOS[nombre] = { categoria: categoriaActual, etiquetas, cuerpo };
};

/* ---------------------------------------------------------------- Módulos */
cat('Módulos');

i('panel', ['inicio', 'tablero', 'resumen', 'dashboard'], `
  <rect x="3.5" y="3.5" width="7" height="7" rx="2" ${R}/>
  <rect x="13.5" y="3.5" width="7" height="4.5" rx="2"/>
  <rect x="13.5" y="11" width="7" height="9.5" rx="2" ${R}/>
  <rect x="3.5" y="13.5" width="7" height="7" rx="2"/>`);

i('contratos', ['contrato', 'acuerdo', 'firma', 'contract'], documento(`
  <path d="M8.75 12.25h6.5" ${t('trazo-1')}/>
  <path d="M8.75 16.75c.75-1.1 1.4-1.35 1.75-.55.3.7.75.85 1.35.2.45-.5.85-.55 1.15-.1.25.4.6.5 1.5.45" ${t('trazo-2')}/>`));

i('embarques', ['envío', 'ruta', 'viaje', 'shipment'], `
  <circle cx="5.75" cy="18.25" r="2.25" ${R}/>
  <circle cx="18.25" cy="5.75" r="2.25" ${R}/>
  <path d="M7.6 16.85c2.4-1.6 2.6-5.2 5.1-6.4 1.7-.8 3.1-1.15 4.05-2.6" stroke-dasharray="2.2 2.6" ${a('ruta')}/>`);

i('facturas', ['factura', 'cobro', 'comprobante', 'invoice'], `
  <path d="M7 3.5h10A1.5 1.5 0 0 1 18.5 5v15.5l-2.17-1.3-2.16 1.3-2.17-1.3-2.17 1.3-2.16-1.3-2.17 1.3V5A1.5 1.5 0 0 1 7 3.5Z" ${R}/>
  <path d="M9 8.5h6"/>
  <path d="M9 12h6" ${t('trazo-1')}/>
  <path d="M9 15.5h3.5" ${t('trazo-2')}/>`);

i('reportes', ['informe', 'análisis', 'estadística', 'report'], `
  <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" ${R}/>
  <path d="M8 16v-3.5" ${a('barra-1', '12px 16px')}/>
  <path d="M12 16V8" ${a('barra-2', '12px 16px')}/>
  <path d="M16 16v-6" ${a('barra-3', '12px 16px')}/>`);

i('sistema', ['diseño', 'componentes', 'formas', 'design system'], `
  <circle cx="7.75" cy="7.75" r="4.25" ${R}/>
  <rect x="13" y="3.5" width="7.5" height="8.5" rx="2"/>
  <rect x="3.5" y="13" width="8.5" height="7.5" rx="2"/>
  <path d="M16.75 13.25 20.5 20.25h-7.5Z" ${R}/>`);

/* ---------------------------------------------------------------- Acciones */
cat('Acciones');

i('buscar', ['lupa', 'encontrar', 'search'], lupa());

i('filtro', ['filtrar', 'refinar', 'filter'], `
  <path d="M4 7h16"/>
  <path d="M7 12h10" ${a('encoger-1', '12px 12px')}/>
  <path d="M10 17h4" ${a('encoger-2', '12px 17px')}/>`);

i('nuevo', ['crear', 'añadir', 'agregar', 'new'], `
  <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" ${R}/>
  <g ${a('girar', '12px 12px')}><path d="M12 8.25v7.5M8.25 12h7.5"/></g>`);

i('mas', ['añadir', 'sumar', 'agregar', 'plus'], `
  <g ${a('girar', '12px 12px')}><path d="M12 5v14M5 12h14"/></g>`);

i('menos', ['quitar', 'restar', 'reducir', 'minus'], `
  <path d="M5 12h14" ${a('encoger-1', '12px 12px')}/>`);

i('editar', ['lápiz', 'modificar', 'escribir', 'edit'], `
  <path d="M15.2 4.8a2 2 0 0 1 2.83 0l1.17 1.17a2 2 0 0 1 0 2.83L9 19l-4.5 1 1-4.5Z" ${R}/>
  <path d="m13.5 6.5 4 4" ${t('trazo-1')}/>`);

i('eliminar', ['borrar', 'papelera', 'quitar', 'delete'], `
  <g ${a('inclinar', '18px 7px')}>
    <path d="M4.5 7h15"/>
    <path d="M9.5 7V5.25a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V7"/>
  </g>
  <path d="m6.5 7 .8 11.6a2 2 0 0 0 2 1.9h5.4a2 2 0 0 0 2-1.9L17.5 7" ${R}/>
  <path d="M10.25 11v5.5M13.75 11v5.5"/>`);

i('copiar', ['duplicar', 'portapapeles', 'copy'], `
  <path d="M15.5 8.5V6a2.5 2.5 0 0 0-2.5-2.5H6A2.5 2.5 0 0 0 3.5 6v7A2.5 2.5 0 0 0 6 15.5h2.5"/>
  <rect x="8.5" y="8.5" width="12" height="12" rx="2.5" ${R} ${a('apilar')}/>`);

i('guardar', ['disco', 'salvar', 'save'], `
  <g ${a('presionar')}>
    <path d="M5.5 3.5h10.67a1.5 1.5 0 0 1 1.06.44l2.83 2.83a1.5 1.5 0 0 1 .44 1.06V18.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" ${R}/>
    <path d="M8 3.5v3.25a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V3.5"/>
    <path d="M7.5 20.5v-4.5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v4.5"/>
  </g>`);

i('exportar', ['sacar', 'enviar fuera', 'excel', 'export'], `
  <path d="M17.5 13.5v4a3 3 0 0 1-3 3h-8a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h4" ${R}/>
  <g ${a('salir')}><path d="M14 3.5h6.5V10M20.5 3.5l-9 9"/></g>`);

i('importar', ['cargar', 'traer', 'excel', 'import'], documento(`
  <g ${a('caer')}><path d="M12 10.5v6M9.5 14l2.5 2.5 2.5-2.5"/></g>`));

i('descargar', ['bajar', 'guardar', 'download'], `
  <path d="${BANDEJA}"/>
  <g ${a('caer')}><path d="M12 3.5v11.25M7.75 10.5 12 14.75l4.25-4.25"/></g>`);

i('subir', ['cargar', 'adjuntar', 'upload'], `
  <path d="${BANDEJA}"/>
  <g ${a('subir')}><path d="M12 14.75V3.5M7.75 7.75 12 3.5l4.25 4.25"/></g>`);

i('actualizar', ['recargar', 'sincronizar', 'refrescar', 'refresh'], `
  <g ${a('media-vuelta', '12px 12px')}>
    <path d="M19.5 12a7.5 7.5 0 0 1-13.06 5.03"/>
    <path d="M4.5 12a7.5 7.5 0 0 1 13.06-5.03"/>
    <path d="M17.75 3.5V7h-3.5M6.25 20.5V17h3.5"/>
  </g>`);

i('deshacer', ['volver', 'revertir', 'undo'], `
  <g ${a('empujar-izq')}>
    <path d="M8.5 14 4 9.5 8.5 5"/>
    <path d="M4 9.5h10.5a5.5 5.5 0 0 1 0 11H11"/>
  </g>`);

i('rehacer', ['repetir', 'avanzar', 'redo'], `
  <g ${a('empujar')}>
    <path d="M15.5 14 20 9.5 15.5 5"/>
    <path d="M20 9.5H9.5a5.5 5.5 0 0 0 0 11H13"/>
  </g>`);

i('enviar', ['mandar', 'avión de papel', 'send'], `
  <g ${a('despegar')}>
    <path d="M20.5 3.5 14.5 20.5l-3.5-7.5-7.5-3.5Z" ${R}/>
    <path d="m20.5 3.5-9.5 9.5"/>
  </g>`);

i('imprimir', ['impresora', 'papel', 'print'], `
  <path d="M7 8V4.5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1V8"/>
  <path d="M7 16.5H5.5a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v4.5a2 2 0 0 1-2 2H17" ${R}/>
  <path d="M7 13.5h10v6a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1Z" ${a('aterrizar')}/>`);

i('compartir', ['red', 'difundir', 'share'], `
  <circle cx="17.5" cy="5.75" r="2.25" ${R}/>
  <circle cx="6.5" cy="12" r="2.25" ${R}/>
  <circle cx="17.5" cy="18.25" r="2.25" ${R}/>
  <path d="m8.6 10.8 6.8-3.85" ${t('trazo-1')}/>
  <path d="m8.6 13.2 6.8 3.85" ${t('trazo-2')}/>`);

i('enlace', ['vínculo', 'url', 'cadena', 'link'], `
  <g transform="rotate(-45 12 12)">
    <rect x="3" y="9" width="10.5" height="6" rx="3" ${a('separar-izq')}/>
    <rect x="10.5" y="9" width="10.5" height="6" rx="3" ${a('separar-der')}/>
  </g>`);

i('enlace-externo', ['abrir', 'nueva pestaña', 'external'], `
  <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" ${R}/>
  <g ${a('salir')}><path d="m9 15 6-6M10 9h5v5"/></g>`);

i('adjunto', ['clip', 'adjuntar', 'attachment'], `
  <g transform="rotate(45 12 12)">
    <path d="M16 8.5V16a4 4 0 0 1-8 0V6.5a2.75 2.75 0 0 1 5.5 0V15a1.5 1.5 0 0 1-3 0V8.5" ${a('inclinar-der', '12px 12px')}/>
  </g>`);

i('lupa-mas', ['acercar', 'zoom', 'ampliar'], lupa('<path d="M8.25 10.75h5M10.75 8.25v5"/>'));

i('lupa-menos', ['alejar', 'zoom', 'reducir'], lupa('<path d="M8.25 10.75h5"/>'));

i('fijar', ['chincheta', 'anclar', 'pin'], `
  <g ${a('presionar')}>
    <path d="M9 3.5h6l-.6 5.6 3.1 3.4v2h-11v-2l3.1-3.4Z" ${R}/>
    <path d="M12 14.5v6"/>
  </g>`);

i('marcador', ['guardar', 'favorito', 'bookmark'], `
  <path d="M6.5 5A1.5 1.5 0 0 1 8 3.5h8A1.5 1.5 0 0 1 17.5 5v15.5L12 16.5l-5.5 4Z" ${R} ${a('presionar')}/>`);

i('estrella', ['favorito', 'destacar', 'star'], `
  <path d="M12 4.1 14.59 9.29 20.32 10.15 16.18 14.21 17.14 19.93 12 17.25 6.86 19.93 7.82 14.21 3.68 10.15 9.41 9.29Z" ${R} ${a('pulsar', '12px 12.5px')}/>`);

i('etiqueta', ['tag', 'categoría', 'marca'], `
  <g ${a('inclinar', '8px 8px')}>
    <path d="M3.5 5.5v5.17a2 2 0 0 0 .59 1.41l7.83 7.83a2 2 0 0 0 2.83 0l5.17-5.17a2 2 0 0 0 0-2.83L12.09 4.09a2 2 0 0 0-1.42-.59H5.5a2 2 0 0 0-2 2Z" ${R}/>
    <circle cx="8" cy="8" r="1.5"/>
  </g>`);

i('bandera', ['marcar', 'reportar', 'hito', 'flag'], `
  <path d="M5 4.5h12.5L15 9l2.5 4.5H5" ${R} ${t('trazo-lento')}/>
  <path d="M5 3.5v17"/>`);

i('ordenar', ['orden', 'clasificar', 'sort'], `
  <g ${a('empujar-arr')}><path d="M8 19V5M4.5 8.5 8 5l3.5 3.5"/></g>
  <g ${a('empujar-ab')}><path d="M16 5v14M12.5 15.5 16 19l3.5-3.5"/></g>`);

i('ver', ['ojo', 'mostrar', 'visible', 'view'], `
  <g ${a('parpadear', '12px 12px')}>
    <path d="${OJO}" ${R}/>
    <circle cx="12" cy="12" r="2.75"/>
  </g>`);

i('ocultar', ['ojo', 'esconder', 'invisible', 'hide'], `
  <path d="${OJO}" ${R}/>
  <path d="m4.5 4.5 15 15" ${t('trazo-1')}/>`);

i('apagar', ['cerrar', 'salir', 'energía', 'power'], `
  <path d="M6.72 6.49a8 8 0 1 0 10.56 0"/>
  <path d="M12 3.5v8" ${a('encender')}/>`);

i('salir', ['cerrar sesión', 'logout', 'puerta'], `
  <path d="M10 20.5H6.5a3 3 0 0 1-3-3v-11a3 3 0 0 1 3-3H10"/>
  <g ${a('empujar')}><path d="M9.5 12h11M17 8.5l3.5 3.5-3.5 3.5"/></g>`);

i('entrar', ['iniciar sesión', 'login', 'acceder'], `
  <path d="M14 3.5h3.5a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H14"/>
  <g ${a('empujar')}><path d="M3.5 12h11M11 8.5l3.5 3.5-3.5 3.5"/></g>`);

/* ---------------------------------------------------------------- Navegación */
cat('Navegación');

i('inicio', ['casa', 'portada', 'home'], `
  <path d="M4.5 9.6a1.5 1.5 0 0 1 .56-1.17l6-4.8a1.5 1.5 0 0 1 1.88 0l6 4.8a1.5 1.5 0 0 1 .56 1.17v8.9a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2Z" ${R}/>
  <path d="M9.75 20.5V16a1 1 0 0 1 1-1h2.5a1 1 0 0 1 1 1v4.5" ${a('presionar')}/>`);

i('menu', ['hamburguesa', 'opciones', 'menu'], `
  <path d="M4 6.5h16" ${a('encoger-1', '12px 6.5px')}/>
  <path d="M4 12h16" ${a('encoger-2', '12px 12px')}/>
  <path d="M4 17.5h16" ${a('encoger-3', '12px 17.5px')}/>`);

i('flecha', ['siguiente', 'ir', 'derecha', 'arrow'], `
  <g ${a('empujar')}><path d="M4.5 12h15M13.5 6l6 6-6 6"/></g>`);

i('flecha-derecha', ['siguiente', 'avanzar', 'arrow right'], `
  <g ${a('empujar')}><path d="M4.5 12h15M13.5 6l6 6-6 6"/></g>`);

i('flecha-izquierda', ['anterior', 'volver', 'arrow left'], `
  <g ${a('empujar-izq')}><path d="M19.5 12h-15M10.5 6l-6 6 6 6"/></g>`);

i('flecha-arriba', ['subir', 'ascendente', 'arrow up'], `
  <g ${a('empujar-arr')}><path d="M12 19.5v-15M6 10.5l6-6 6 6"/></g>`);

i('flecha-abajo', ['bajar', 'descendente', 'arrow down'], `
  <g ${a('empujar-ab')}><path d="M12 4.5v15M6 13.5l6 6 6-6"/></g>`);

i('flecha-diagonal', ['abrir', 'ir a', 'arrow up right'], `
  <g ${a('salir')}><path d="m6.5 17.5 11-11M8 6.5h9.5V16"/></g>`);

i('retorno', ['intro', 'enter', 'devolver'], `
  <g ${a('empujar-izq')}>
    <path d="M19 5v6a3 3 0 0 1-3 3H6"/>
    <path d="M9.5 10.5 6 14l3.5 3.5"/>
  </g>`);

i('orden', ['ascendente', 'dirección de orden', 'sort'], `
  <g ${a('empujar-arr')}><path d="M12 18.5v-13M7 10.5l5-5 5 5"/></g>`);

i('flechas', ['selector', 'desplegable', 'arriba y abajo'], `
  <path d="M8 9.5 12 5.5l4 4"/>
  <path d="M8 14.5l4 4 4-4"/>`);

i('chevron-derecha', ['siguiente', 'expandir', 'chevron'], `
  <path d="M10 7.5 14.5 12 10 16.5" ${a('empujar')}/>`);

i('chevron-izquierda', ['anterior', 'atrás', 'chevron'], `
  <path d="M14 7.5 9.5 12 14 16.5" ${a('empujar-izq')}/>`);

i('chevron-abajo', ['desplegar', 'abrir', 'chevron'], `
  <path d="M7.5 10 12 14.5 16.5 10"/>`);

i('chevron-arriba', ['plegar', 'cerrar', 'chevron'], `
  <path d="M7.5 14 12 9.5l4.5 4.5"/>`);

i('chevrones-izquierda', ['plegar lateral', 'primero', 'chevron'], `
  <path d="M12.5 7.5 8 12l4.5 4.5M17.5 7.5 13 12l4.5 4.5" ${a('empujar-izq')}/>`);

i('chevrones-derecha', ['desplegar lateral', 'último', 'chevron'], `
  <path d="M11.5 7.5 16 12l-4.5 4.5M6.5 7.5 11 12l-4.5 4.5" ${a('empujar')}/>`);

i('cerrar', ['equis', 'salir', 'descartar', 'close'], `
  <g ${a('girar', '12px 12px')}><path d="m6.5 6.5 11 11M17.5 6.5l-11 11"/></g>`);

i('check', ['hecho', 'confirmar', 'aceptar', 'check'], `
  <path d="M5 12.5 10 17.5 19 7" ${t('trazo-lento')}/>`);

i('mas-opciones', ['puntos', 'acciones', 'más', 'more'], `
  ${punto(6, 12)}${punto(12, 12)}${punto(18, 12)}`);

i('mas-opciones-vertical', ['puntos', 'acciones', 'kebab'], `
  ${punto(12, 6)}${punto(12, 12)}${punto(12, 18)}`);

/* ---------------------------------------------------------------- Interfaz */
cat('Interfaz');

i('lateral', ['barra lateral', 'panel', 'sidebar'], `
  <rect x="3.5" y="4.5" width="17" height="15" rx="3"/>
  <path d="M9.5 4.5v15"/>
  <path d="M3.5 7.5a3 3 0 0 1 3-3h3v15h-3a3 3 0 0 1-3-3Z" ${R} stroke="none"/>`);

i('columnas', ['diseño', 'vista', 'columns'], `
  <rect x="3.5" y="4.5" width="17" height="15" rx="3" ${R}/>
  <path d="M9.5 4.5v15M14.5 4.5v15"/>`);

i('tabla', ['cuadrícula', 'datos', 'filas', 'table'], `
  <rect x="3.5" y="4.5" width="17" height="15" rx="3" ${R}/>
  <path d="M3.5 9.5h17"/>
  <path d="M3.5 14.5h17" ${t('trazo-1')}/>
  <path d="M9.5 9.5v10" ${t('trazo-2')}/>`);

i('cuadricula', ['mosaico', 'vista', 'grid'], `
  <rect x="3.5" y="3.5" width="7" height="7" rx="2" ${R}/>
  <rect x="13.5" y="3.5" width="7" height="7" rx="2" ${R}/>
  <rect x="3.5" y="13.5" width="7" height="7" rx="2" ${R}/>
  <rect x="13.5" y="13.5" width="7" height="7" rx="2" ${R}/>`);

i('lista', ['viñetas', 'elementos', 'list'], `
  ${punto(5, 6.5, 1.25)}${punto(5, 12, 1.25)}${punto(5, 17.5, 1.25)}
  <path d="M9 6.5h11" ${t('trazo-1')}/>
  <path d="M9 12h11" ${t('trazo-2')}/>
  <path d="M9 17.5h7" ${t('trazo-3')}/>`);

i('tarea', ['pendiente', 'casilla', 'hecho', 'task'], `
  <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" ${R}/>
  <path d="m8 12.25 2.75 2.75L16 9.5" ${t('trazo-lento')}/>`);

i('kanban', ['tablero', 'columnas', 'board'], `
  <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" ${R}/>
  <path d="M8 7.5v8" ${a('barra-1', '12px 7.5px')}/>
  <path d="M12 7.5v4.5" ${a('barra-2', '12px 7.5px')}/>
  <path d="M16 7.5v6" ${a('barra-3', '12px 7.5px')}/>`);

i('pantalla-completa', ['maximizar', 'expandir', 'fullscreen'], `
  <g ${a('expandir', '12px 12px')}>
    <path d="M3.5 8.5v-3a2 2 0 0 1 2-2h3M15.5 3.5h3a2 2 0 0 1 2 2v3M20.5 15.5v3a2 2 0 0 1-2 2h-3M8.5 20.5h-3a2 2 0 0 1-2-2v-3"/>
  </g>`);

i('arrastrar', ['mover', 'asa', 'reordenar', 'drag'], `
  ${punto(9, 6)}${punto(15, 6)}${punto(9, 12)}${punto(15, 12)}${punto(9, 18)}${punto(15, 18)}`);

i('capas', ['niveles', 'apilar', 'layers'], `
  <path d="M12 3.5 20.5 8 12 12.5 3.5 8Z" ${R} ${a('aterrizar')}/>
  <path d="m3.5 12 8.5 4.5 8.5-4.5"/>
  <path d="m3.5 16 8.5 4.5 8.5-4.5"/>`);

i('ajustes', ['engranaje', 'configuración', 'preferencias', 'settings'], `
  <g ${a('girar', '12px 12px')}>
    <path d="${engranaje(12, 12, 8.5, 6.4, 8, 8, 13)}" ${R}/>
    <circle cx="12" cy="12" r="2.75"/>
  </g>`);

i('equipo', ['computador', 'monitor', 'este equipo', 'computer'], `
  <rect x="3.5" y="4.5" width="17" height="11.5" rx="3" ${R}/>
  <path d="M8.5 20h7M12 16v4"/>`);

/* ---------------------------------------------------------------- Estado */
cat('Estado');

i('alerta', ['advertencia', 'cuidado', 'warning'], `
  <path d="M10.27 4.5a2 2 0 0 1 3.46 0l7.02 12.05A2 2 0 0 1 19.02 19.5H4.98a2 2 0 0 1-1.73-2.95Z" ${R}/>
  <path d="M12 9.5v4" ${t('trazo-1')}/>
  <path d="M12 16.5h.01" stroke-width="2"/>`);

i('info', ['información', 'detalle', 'nota', 'info'], `
  <circle cx="12" cy="12" r="8.5" ${R}/>
  <g ${a('aterrizar')}>
    <path d="M12 11v5"/>
    <path d="M12 7.75h.01" stroke-width="2"/>
  </g>`);

i('exito', ['correcto', 'listo', 'aprobado', 'success'], `
  <circle cx="12" cy="12" r="8.5" ${R}/>
  <path d="m8.25 12.25 2.5 2.5 5-5.25" ${t('trazo-lento')}/>`);

i('error', ['fallo', 'rechazado', 'cancelado', 'error'], `
  <circle cx="12" cy="12" r="8.5" ${R}/>
  <path d="m9.25 9.25 5.5 5.5" ${t('trazo-1')}/>
  <path d="m14.75 9.25-5.5 5.5" ${t('trazo-2')}/>`);

i('ayuda', ['pregunta', 'duda', 'soporte', 'help'], `
  <circle cx="12" cy="12" r="8.5" ${R}/>
  <g ${a('inclinar', '12px 16.5px')}>
    <path d="M9.6 9.5a2.5 2.5 0 1 1 3.45 2.3c-.6.25-1.05.8-1.05 1.45v.25"/>
    <path d="M12 16.5h.01" stroke-width="2"/>
  </g>`);

i('reloj', ['hora', 'tiempo', 'pendiente', 'clock'], `
  <circle cx="12" cy="12" r="8.5" ${R}/>
  <path d="M12 7.5V12l3 2" ${a('reloj', '12px 12px')}/>`);

i('historial', ['antes', 'registro', 'cambios', 'history'], `
  <path d="M3.5 12A8.5 8.5 0 1 0 12 3.5a9.2 9.2 0 0 0-6.36 2.6L3.5 8.25"/>
  <path d="M3.5 3.75v4.5H8"/>
  <path d="M12 7.75V12l3 1.75" ${a('reloj-atras', '12px 12px')}/>`);

i('temporizador', ['cronómetro', 'plazo', 'cuenta atrás', 'timer'], `
  <circle cx="12" cy="13.5" r="7" ${R}/>
  <path d="M10 3.5h4M12 3.5v3M17.25 7.75 18.5 6.5"/>
  <path d="M12 13.5V10" ${a('reloj', '12px 13.5px')}/>`);

i('calendario', ['fecha', 'día', 'agenda', 'calendar'], `
  <rect x="3.5" y="5" width="17" height="15.5" rx="3" ${R}/>
  <path d="M3.5 10h17M8 3.5v3M16 3.5v3"/>
  <path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" stroke-width="2" ${a('destellar')}/>`);

i('calidad', ['certificado', 'garantía', 'verificado', 'quality'], `
  <path d="M12 3.5 19 6v5.5c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6Z" ${R}/>
  <path d="m9 12 2.25 2.25L15.25 10" ${t('trazo-1')}/>`);

i('campana', ['notificaciones', 'aviso', 'bell'], `
  <g ${a('inclinar', '12px 4.5px')}>
    <path d="M6.5 10a5.5 5.5 0 0 1 11 0v3.6c0 .9.4 1.75 1.1 2.3l.4.35a.7.7 0 0 1-.45 1.25H5.45A.7.7 0 0 1 5 16.25l.4-.35a3 3 0 0 0 1.1-2.3Z" ${R}/>
    <path d="M10.25 20a2 2 0 0 0 3.5 0"/>
  </g>`);

i('meta', ['objetivo', 'diana', 'target'], `
  <circle cx="12" cy="12" r="8.5" ${R}/>
  <circle cx="12" cy="12" r="5"/>
  ${punto(12, 12, 1.75, a('destello', '12px 12px'))}`);

i('idea', ['bombilla', 'sugerencia', 'consejo', 'idea'], `
  <path d="M12 3.5a6 6 0 0 0-3.4 10.95c.55.38.9 1 .9 1.67V16h5v-.88c0-.67.35-1.29.9-1.67A6 6 0 0 0 12 3.5Z" ${R} ${a('destellar')}/>
  <path d="M9.5 18.5h5M10.5 20.5h3"/>`);

i('chispa', ['ia', 'inteligencia artificial', 'automático', 'sparkle'], `
  <path d="M12 3.5c.6 4.2 2.3 5.9 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5 4.2-.6 5.9-2.3 6.5-6.5Z" ${R} ${a('destello', '12px 10px')}/>
  <path d="M18.5 16.25v4M16.5 18.25h4" ${a('girar', '18.5px 18.25px')}/>`);

i('rayo', ['rápido', 'energía', 'automatizar', 'flash'], `
  <path d="M13 3.5 5.5 13.25h6l-1 7.25 8-9.75h-6Z" ${R} ${a('destellar')}/>`);

/* ---------------------------------------------------------------- Archivos */
cat('Archivos');

i('documento', ['archivo', 'página', 'texto', 'document'], documento(`
  <path d="M8.75 12.75h6.5" ${t('trazo-1')}/>
  <path d="M8.75 16.25h4.5" ${t('trazo-2')}/>`));

i('carpeta', ['directorio', 'agrupar', 'folder'], `
  <path d="M3.5 7a2 2 0 0 1 2-2h3.38a2 2 0 0 1 1.41.59l1.12 1.12a2 2 0 0 0 1.41.59h6.18a2 2 0 0 1 2 2v8.2a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z" ${R}/>
  <path d="M3.5 10.5h17" ${t('trazo-1')}/>`);

i('archivo-excel', ['hoja de cálculo', 'xlsx', 'csv', 'spreadsheet'], documento(`
  <rect x="8.5" y="11.5" width="7" height="6" rx="1"/>
  <path d="M8.5 14.5h7" ${t('trazo-1')}/>
  <path d="M12 11.5v6" ${t('trazo-2')}/>`));

i('archivo-pdf', ['pdf', 'maquetado', 'imprimible'], documento(`
  <rect x="8.5" y="11" width="7" height="3.5" rx="1" ${R}/>
  <path d="M8.5 17.25h7" ${t('trazo-1')}/>`));

i('archivo-zip', ['comprimido', 'zip', 'paquete', 'archive'], `
  <path d="${DOC}" ${R}/>
  <path d="${PLIEGUE}"/>
  <path d="M10 3.5v1.25M10 7v1.25M10 10.5v1.25" ${a('destellar')}/>
  <rect x="8.5" y="13.5" width="3" height="4.5" rx="1"/>`);

i('imagen', ['foto', 'fotografía', 'image'], `
  <rect x="3.5" y="4.5" width="17" height="15" rx="3" ${R}/>
  <circle cx="9" cy="9.5" r="1.75" ${a('aterrizar')}/>
  <path d="m3.5 16.5 4.44-4.44a1.5 1.5 0 0 1 2.12 0L16.5 18.5"/>
  <path d="m13.5 15.5 1.94-1.94a1.5 1.5 0 0 1 2.12 0l2.94 2.94"/>`);

i('firma', ['firmar', 'rúbrica', 'signature'], `
  <path d="M4 15.5c1.6-3.6 3.3-8.5 5-8.5 1.9 0 .2 8.5 2.2 8.5 1.4 0 2.3-4.2 3.6-4.2 1.2 0 1.1 3 2.3 3 .9 0 1.6-.8 2.4-1.5" ${t('trazo-lento')}/>
  <path d="M4 19.5h16"/>`);

i('sello', ['estampar', 'aprobar', 'timbre', 'stamp'], `
  <g ${a('presionar')}>
    <path d="M12 3.5a2.5 2.5 0 0 0-2.5 2.5c0 1.5 1 2 1 4v2.5h3V10c0-2 1-2.5 1-4A2.5 2.5 0 0 0 12 3.5Z" ${R}/>
    <rect x="4" y="12.5" width="16" height="4" rx="1.5" ${R}/>
  </g>
  <path d="M5.5 20h13"/>`);

i('respaldo', ['copia de seguridad', 'base de datos', 'backup'], `
  <ellipse cx="12" cy="6.25" rx="7.5" ry="2.75" ${R}/>
  <path d="M4.5 6.25v11.5c0 1.52 3.36 2.75 7.5 2.75s7.5-1.23 7.5-2.75V6.25"/>
  <path d="M4.5 12c0 1.52 3.36 2.75 7.5 2.75S19.5 13.52 19.5 12" ${t('trazo-1')}/>`);

/* ---------------------------------------------------------------- Comunicación */
cat('Comunicación');

i('correo', ['email', 'mensaje', 'sobre', 'mail'], `
  <rect x="3.5" y="5" width="17" height="14" rx="3" ${R}/>
  <path d="m4.5 7.5 6.37 4.96a1.85 1.85 0 0 0 2.26 0L19.5 7.5" ${t('trazo-1')}/>`);

i('comentario', ['mensaje', 'nota', 'chat', 'comment'], `
  <path d="M5.5 4.5h13a2 2 0 0 1 2 2V15a2 2 0 0 1-2 2H11l-4.2 3.15A.5.5 0 0 1 6 19.75V17h-.5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2Z" ${R}/>
  <path d="M8 9h8" ${t('trazo-1')}/>
  <path d="M8 12.5h5" ${t('trazo-2')}/>`);

i('telefono', ['llamar', 'contacto', 'phone'], `
  <path d="M6.2 3.5h2.6a1 1 0 0 1 .95.68l1.1 3.3a1 1 0 0 1-.25 1.03L9 10.1a11.5 11.5 0 0 0 4.9 4.9l1.6-1.6a1 1 0 0 1 1.03-.25l3.3 1.1a1 1 0 0 1 .67.95v2.6a2.3 2.3 0 0 1-2.3 2.3h-.2C10.5 20.1 3.9 13.5 3.9 5.8A2.3 2.3 0 0 1 6.2 3.5Z" ${R} ${a('inclinar', '12px 12px')}/>`);

i('microfono', ['voz', 'grabar', 'dictado', 'microphone'], `
  <rect x="9" y="3.5" width="6" height="10" rx="3" ${R}/>
  <path d="M6 11a6 6 0 0 0 12 0" ${t('trazo-1')}/>
  <path d="M12 17v3.5M9 20.5h6"/>`);

i('globo', ['mundo', 'internacional', 'idioma', 'globe'], `
  <circle cx="12" cy="12" r="8.5" ${R}/>
  <ellipse cx="12" cy="12" rx="3.75" ry="8.5" ${a('voltear', '12px 12px')}/>
  <path d="M3.5 12h17"/>`);

/* ---------------------------------------------------------------- Datos y análisis */
cat('Datos y análisis');

i('tendencia', ['subida', 'crecimiento', 'alza', 'trending up'], `
  <path d="M3.5 17 9 11.5l3.5 3.5 8-8" ${t('trazo-1')}/>
  <path d="M15 7h5.5v5.5"/>`);

i('tendencia-baja', ['bajada', 'caída', 'descenso', 'trending down'], `
  <path d="M3.5 7 9 12.5 12.5 9l8 8" ${t('trazo-1')}/>
  <path d="M15 17h5.5v-5.5"/>`);

i('grafica-barras', ['gráfico', 'columnas', 'bar chart'], `
  <path d="M3.5 3.5v15a2 2 0 0 0 2 2h15"/>
  <path d="M8.5 16.5V13" ${a('barra-1', '12px 16.5px')}/>
  <path d="M12.5 16.5v-9" ${a('barra-2', '12px 16.5px')}/>
  <path d="M16.5 16.5V10" ${a('barra-3', '12px 16.5px')}/>`);

i('grafica-lineas', ['gráfico', 'serie', 'evolución', 'line chart'], `
  <path d="M3.5 3.5v15a2 2 0 0 0 2 2h15"/>
  <path d="m7.5 14.5 3.5-4 3 2.5 5.5-6" ${t('trazo-lento')}/>`);

i('grafica-anillo', ['gráfico', 'proporción', 'reparto', 'donut chart'], `
  <path d="${sector(11.5, 12.5, 7.75, 3.5, 102, 348)}" ${R}/>
  <path d="${sector(12.75, 11.25, 7.75, 3.5, 0, 90)}" ${R} ${a('salir')}/>`);

i('porcentaje', ['por ciento', 'tasa', 'descuento', 'percent'], `
  <path d="m18.5 5.5-13 13"/>
  <circle cx="7.5" cy="7.5" r="2.25" ${R}/>
  <circle cx="16.5" cy="16.5" r="2.25" ${R}/>`);

i('calculadora', ['calcular', 'cuentas', 'calculator'], `
  <rect x="5" y="3.5" width="14" height="17" rx="3" ${R}/>
  <rect x="8" y="6.5" width="8" height="3" rx="1"/>
  <path d="M8.75 13.25h.01M12 13.25h.01M15.25 13.25h.01M8.75 16.75h.01M12 16.75h.01M15.25 16.75h.01" stroke-width="2"/>`);

i('base-datos', ['datos', 'almacenamiento', 'database'], `
  <ellipse cx="12" cy="6" rx="7.5" ry="2.5" ${R}/>
  <path d="M4.5 6v12c0 1.38 3.36 2.5 7.5 2.5s7.5-1.12 7.5-2.5V6"/>
  <path d="M4.5 10c0 1.38 3.36 2.5 7.5 2.5s7.5-1.12 7.5-2.5" ${t('trazo-1')}/>
  <path d="M4.5 14c0 1.38 3.36 2.5 7.5 2.5s7.5-1.12 7.5-2.5" ${t('trazo-2')}/>`);

/* ---------------------------------------------------------------- Operación */
cat('Operación');

i('barco', ['motonave', 'buque', 'naviera', 'ship'], `
  <g ${a('navegar')}>
    <path d="M3.5 13h17l-2.3 4.9a2 2 0 0 1-1.8 1.1H7.6a2 2 0 0 1-1.8-1.1Z" ${R}/>
    <path d="M6.5 13V9h10l2 4"/>
    <path d="M9.5 9V5.5H13V9"/>
  </g>`);

i('puerto', ['grúa', 'muelle', 'terminal', 'port'], `
  <path d="M3.5 20.5h17"/>
  <path d="M6 20.5v-15l10-2V8"/>
  <path d="M6 8h13"/>
  <g ${a('aterrizar')}>
    <path d="M16 8v3.5"/>
    <rect x="13.25" y="11.5" width="5.5" height="4.5" rx="1" ${R}/>
  </g>`);

i('contenedor', ['carga', 'container', 'TEU'], `
  <rect x="3.5" y="6.5" width="17" height="11" rx="1.5" ${R}/>
  <path d="M8 9.5v5M12 9.5v5M16 9.5v5" ${t('trazo-1')}/>`);

i('camion', ['transporte', 'entrega', 'terrestre', 'truck'], `
  <g ${a('navegar')}>
    <path d="M5.5 17.5H5A1.5 1.5 0 0 1 3.5 16V6.5A1.5 1.5 0 0 1 5 5h8a1.5 1.5 0 0 1 1.5 1.5v11h-5" ${R}/>
    <path d="M14.5 9h3.09a1.5 1.5 0 0 1 1.3.75l1.41 2.47a1.5 1.5 0 0 1 .2.74V16a1.5 1.5 0 0 1-1.5 1.5H19"/>
    <circle cx="7.5" cy="17.5" r="2"/>
    <circle cx="17" cy="17.5" r="2"/>
  </g>`);

i('fabrica', ['planta', 'producción', 'molino', 'factory'], `
  <path d="M3.5 20.5v-10l5.5 3.5v-3.5l5.5 3.5V4.5h5.5v16Z" ${R}/>
  <path d="M7.5 17.5h2M12 17.5h2" ${t('trazo-1')}/>`);

i('caja', ['paquete', 'producto', 'bulto', 'package'], `
  <path d="M12 3.5 19.5 7.5v9L12 20.5l-7.5-4v-9Z" ${R}/>
  <path d="M4.5 7.5 12 11.5l7.5-4M12 11.5v9"/>
  <path d="m8.25 5.5 7.5 4" ${t('trazo-1')}/>`);

i('inventario', ['bodega', 'existencias', 'estantería', 'stock'], `
  <rect x="3.5" y="12.5" width="8" height="8" rx="1.5" ${R}/>
  <rect x="12.5" y="12.5" width="8" height="8" rx="1.5" ${R}/>
  <rect x="8" y="3.5" width="8" height="8" rx="1.5" ${R} ${a('aterrizar')}/>
  <path d="M7.5 12.5v2.5M16.5 12.5v2.5M12 3.5V6"/>`);

i('peso', ['toneladas', 'balanza', 'kilos', 'weight'], `
  <g ${a('presionar')}>
    <path d="M7.4 8.5h9.2a1 1 0 0 1 .98.8l1.9 9.5a1 1 0 0 1-.98 1.2H5.5a1 1 0 0 1-.98-1.2l1.9-9.5a1 1 0 0 1 .98-.8Z" ${R}/>
    <circle cx="12" cy="6" r="2.5"/>
  </g>`);

i('edificio', ['empresa', 'oficina', 'sede', 'building'], `
  <path d="M5.5 20.5v-15a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v15" ${R}/>
  <path d="M3.5 20.5h17"/>
  <path d="M9 7.5h.01M12 7.5h.01M15 7.5h.01M9 11h.01M12 11h.01M15 11h.01M9 14.5h.01M15 14.5h.01" stroke-width="2"/>
  <path d="M10.5 20.5V17h3v3.5"/>`);

i('tienda', ['comercio', 'local', 'punto de venta', 'store'], `
  <path d="M5 3.5h14l1.5 5h-17Z" ${R}/>
  <path d="M5 8.5V19a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19V8.5"/>
  <path d="M10 20.5v-5h4v5"/>`);

i('ubicacion', ['lugar', 'dirección', 'pin', 'location'], `
  <g ${a('aterrizar')}>
    <path d="M12 20.5s6.5-5.6 6.5-10.5a6.5 6.5 0 0 0-13 0c0 4.9 6.5 10.5 6.5 10.5Z" ${R}/>
    <circle cx="12" cy="10" r="2.5"/>
  </g>`);

i('mapa', ['plano', 'territorio', 'map'], `
  <path d="M3.5 6.6a1 1 0 0 1 .6-.92L9 3.5l6 2.5 4.9-2.18a.4.4 0 0 1 .6.37V17.4a1 1 0 0 1-.6.92L15 20.5l-6-2.5-4.9 2.18a.4.4 0 0 1-.6-.37Z" ${R}/>
  <path d="M9 3.5V18" ${t('trazo-1')}/>
  <path d="M15 6v14.5" ${t('trazo-2')}/>`);

/* ---------------------------------------------------------------- Finanzas */
cat('Finanzas');

i('cartera', ['billetera', 'saldo', 'cuentas por cobrar', 'wallet'], `
  <rect x="3.5" y="6.5" width="17" height="13" rx="3" ${R}/>
  <path d="M16.5 6.5V5a1.5 1.5 0 0 0-1.8-1.47L5.2 5.6"/>
  <path d="M15.5 13.25h2" ${t('trazo-1')}/>`);

i('pagos', ['dinero', 'billete', 'abono', 'payment'], `
  <rect x="3.5" y="6.5" width="17" height="11" rx="2.5" ${R}/>
  <circle cx="12" cy="12" r="2.25" ${a('voltear', '12px 12px')}/>
  <path d="M7 10v4M17 10v4"/>`);

i('moneda', ['dólar', 'precio', 'divisa', 'coin'], `
  <g ${a('voltear', '12px 12px')}>
    <circle cx="12" cy="12" r="8.5" ${R}/>
    <path d="M14.5 9.25c-.4-.9-1.35-1.5-2.5-1.5-1.5 0-2.5.8-2.5 1.95 0 2.8 5 1.45 5 4.3 0 1.15-1 1.95-2.5 1.95-1.15 0-2.1-.6-2.5-1.5M12 6.5v1.25M12 16.25v1.25"/>
  </g>`);

i('tarjeta-credito', ['tarjeta', 'pago', 'débito', 'credit card'], `
  <rect x="3.5" y="5.5" width="17" height="13" rx="3" ${R}/>
  <path d="M3.5 9.5h17" ${t('trazo-1')}/>
  <path d="M7 14.5h3" ${t('trazo-2')}/>`);

i('banco', ['entidad', 'transferencia', 'swift', 'bank'], `
  <path d="M3.5 8.5 12 3.5l8.5 5Z" ${R}/>
  <path d="M6.5 11v6.5M10.25 11v6.5M13.75 11v6.5M17.5 11v6.5" ${a('barra-1', '12px 17.5px')}/>
  <path d="M3.5 20.5h17"/>`);

i('recibo', ['ticket', 'comprobante', 'soporte', 'receipt'], `
  <path d="m6 3.5 1.5 1 1.5-1 1.5 1 1.5-1 1.5 1 1.5-1 1.5 1 1.5-1v17l-1.5-1-1.5 1-1.5-1-1.5 1-1.5-1-1.5 1-1.5-1-1.5 1Z" ${R}/>
  <path d="M9 8.5h3" ${t('trazo-1')}/>
  <path d="M9 11.5h6" ${t('trazo-2')}/>
  <path d="M9 15.5h6" ${t('trazo-3')}/>`);

/* ---------------------------------------------------------------- Personas */
cat('Personas');

i('usuario', ['persona', 'perfil', 'cuenta', 'user'], `
  <circle cx="12" cy="8" r="4" ${R}/>
  <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>`);

i('usuarios', ['personas', 'grupo', 'equipo de trabajo', 'users'], `
  <circle cx="8" cy="8.5" r="3" ${R}/>
  <circle cx="16" cy="8.5" r="3" ${R}/>
  <path d="M3.5 19a4.5 4.5 0 0 1 9 0M11.5 19a4.5 4.5 0 0 1 9 0"/>`);

i('usuario-nuevo', ['invitar', 'añadir persona', 'user plus'], `
  <circle cx="9.5" cy="8" r="3.75" ${R}/>
  <path d="M3.5 19.5a6 6 0 0 1 12 0"/>
  <path d="M18 8.5v5M15.5 11h5" ${a('girar', '18px 11px')}/>`);

i('clientes', ['compradores', 'contactos', 'cartera de clientes', 'customers'], `
  <circle cx="9" cy="8.5" r="3.25" ${R}/>
  <path d="M3.5 19.25a5.5 5.5 0 0 1 11 0"/>
  <path d="M15.5 5.6a3.25 3.25 0 0 1 0 5.8M17 14.4a5.5 5.5 0 0 1 3.5 4.85" ${t('trazo-1')}/>`);

/* ---------------------------------------------------------------- Seguridad y sistemas */
cat('Seguridad y sistemas');

i('candado', ['bloqueado', 'seguro', 'privado', 'lock'], `
  <rect x="5" y="10.5" width="14" height="10" rx="2.5" ${R}/>
  <path d="M8 10.5v-3a4 4 0 0 1 8 0v3" ${a('levantar')}/>
  <path d="M12 14.5v2"/>`);

i('candado-abierto', ['desbloqueado', 'abierto', 'unlock'], `
  <rect x="5" y="10.5" width="14" height="10" rx="2.5" ${R}/>
  <path d="M8 10.5v-3a4 4 0 0 1 7.75-1.4" ${a('inclinar', '8px 10.5px')}/>
  <path d="M12 14.5v2"/>`);

i('llave', ['acceso', 'contraseña', 'clave', 'key'], `
  <g ${a('inclinar-der', '8.5px 15.5px')}>
    <circle cx="8.5" cy="15.5" r="4.5" ${R}/>
    <path d="M11.7 12.3 20 4M17 7l2.5 2.5M14.5 9.5l1.75 1.75"/>
  </g>`);

i('escudo', ['protección', 'seguridad', 'shield'], `
  <path d="M12 3.5 19 6v5.5c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6Z" ${R}/>
  <path d="M12 3.5 19 6v5.5c0 4.2-2.9 7.6-7 9Z" ${R} stroke="none" ${a('destellar')}/>`);

i('huella', ['biometría', 'identidad', 'fingerprint'], `
  <path d="M6.2 17.6A8.6 8.6 0 0 1 5 13.2a7 7 0 0 1 13.2-3.3" ${t('trazo-1')}/>
  <path d="M9.4 19.7A11.4 11.4 0 0 1 8.5 13.3a3.5 3.5 0 0 1 7 0c0 1.1-.1 2.2-.3 3.2" ${t('trazo-2')}/>
  <path d="M12 13.3c0 2.6.5 5 1.4 7.2" ${t('trazo-3')}/>
  <path d="M19 13.3c0 1.7-.2 3.3-.6 4.8"/>
  <path d="M7 5.4a8.6 8.6 0 0 1 10 0"/>`);

i('servidor', ['servidor', 'host', 'infraestructura', 'server'], `
  <rect x="3.5" y="4" width="17" height="7" rx="2" ${R}/>
  <rect x="3.5" y="13" width="17" height="7" rx="2" ${R}/>
  <path d="M7 7.5h.01M7 16.5h.01" stroke-width="2" ${a('destellar')}/>
  <path d="M11 7.5h6M11 16.5h6"/>`);

i('nube', ['en línea', 'almacenamiento', 'cloud'], `
  <path d="${NUBE}" ${R} ${a('navegar')}/>`);

i('nube-subir', ['sincronizar', 'subir a la nube', 'cloud upload'], `
  <path d="${NUBE_ABIERTA}" ${R}/>
  <g ${a('subir')}><path d="M12 20.5v-8M9 15.5l3-3 3 3"/></g>`);

i('nube-bajar', ['descargar de la nube', 'sincronizar', 'cloud download'], `
  <path d="${NUBE_ABIERTA}" ${R}/>
  <g ${a('caer')}><path d="M12 12.5v8M9 17.5l3 3 3-3"/></g>`);

i('codigo', ['desarrollo', 'html', 'programar', 'code'], `
  <path d="M8 7.5 3.5 12 8 16.5" ${a('separar-izq')}/>
  <path d="M16 7.5 20.5 12 16 16.5" ${a('separar-der')}/>
  <path d="m13.5 5.5-3 13"/>`);

i('terminal', ['consola', 'comandos', 'línea de comandos', 'terminal'], `
  <rect x="3.5" y="4.5" width="17" height="15" rx="3" ${R}/>
  <path d="M7.5 9.5 10 12l-2.5 2.5" ${a('empujar')}/>
  <path d="M12.5 14.5h4" ${t('trazo-2')}/>`);

i('api', ['interfaz', 'llaves', 'servicio', 'api'], `
  <path d="M8.5 4.5h-1a2 2 0 0 0-2 2v3.25c0 1.1-.9 2.25-2 2.25 1.1 0 2 1.15 2 2.25v3.25a2 2 0 0 0 2 2h1" ${a('separar-izq')}/>
  <path d="M15.5 4.5h1a2 2 0 0 1 2 2v3.25c0 1.1.9 2.25 2 2.25-1.1 0-2 1.15-2 2.25v3.25a2 2 0 0 1-2 2h-1" ${a('separar-der')}/>
  ${punto(12, 12, 1.25)}`);

i('integracion', ['conectar', 'enchufe', 'plugin', 'integration'], `
  <g ${a('empujar-arr')}>
    <path d="M9 3.5v4M15 3.5v4"/>
    <path d="M6.5 7.5h11V11a5.5 5.5 0 0 1-11 0Z" ${R}/>
  </g>
  <path d="M12 16.5v4"/>`);

i('flujo', ['proceso', 'automatización', 'diagrama', 'workflow'], `
  <rect x="3.5" y="3.5" width="6" height="6" rx="2" ${R}/>
  <rect x="14.5" y="14.5" width="6" height="6" rx="2" ${R}/>
  <circle cx="6.5" cy="17.5" r="3" ${R}/>
  <path d="M9.5 6.5H15a2.5 2.5 0 0 1 2.5 2.5v5.5" ${t('trazo-1')}/>
  <path d="M6.5 9.5v5" ${t('trazo-2')}/>`);

/* ---------------------------------------------------------------- Multimedia */
cat('Multimedia');

i('reproducir', ['play', 'iniciar', 'video'], `
  <path d="M7 5.4v13.2a.8.8 0 0 0 1.2.68l10.7-6.6a.8.8 0 0 0 0-1.36L8.2 4.72A.8.8 0 0 0 7 5.4Z" ${R} ${a('empujar')}/>`);

i('pausa', ['detener', 'pausar', 'pause'], `
  <rect x="6.5" y="5" width="3.5" height="14" rx="1" ${R} ${a('encoger-1', '8.25px 12px')}/>
  <rect x="14" y="5" width="3.5" height="14" rx="1" ${R} ${a('encoger-2', '15.75px 12px')}/>`);

i('video', ['grabación', 'cámara', 'reunión', 'video'], `
  <rect x="3.5" y="6" width="12" height="12" rx="3" ${R}/>
  <path d="m15.5 10 4.17-2.5a.55.55 0 0 1 .83.47v8.06a.55.55 0 0 1-.83.47L15.5 14" ${a('empujar')}/>`);

/* ---------------------------------------------------------------- Tema */
cat('Tema');

i('sol', ['claro', 'día', 'tema claro', 'light'], `
  <circle cx="12" cy="12" r="3.75" ${R}/>
  <g ${a('rayos', '12px 12px')}>
    <path d="M12 3.5v2.25M12 18.25v2.25M3.5 12h2.25M18.25 12h2.25M5.99 5.99l1.59 1.59M16.42 16.42l1.59 1.59M5.99 18.01l1.59-1.59M16.42 7.58l1.59-1.59"/>
  </g>`);

i('luna', ['oscuro', 'noche', 'tema oscuro', 'dark'], `
  <g ${a('inclinar', '12px 12px')}>
    <path d="M19.5 14.6A8 8 0 0 1 9.4 4.5a8 8 0 1 0 10.1 10.1Z" ${R}/>
  </g>`);

i('contraste', ['automático', 'tema del sistema', 'contrast'], `
  <circle cx="12" cy="12" r="8.5" ${R}/>
  <path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" fill="currentColor" stroke="none" ${a('voltear', '12px 12px')}/>`);

/* ---------------------------------------------------------------- Indicadores */
cat('Indicadores');

i('cargando', ['spinner', 'espera', 'procesando', 'loading'], `
  <circle cx="12" cy="12" r="8.5" stroke-opacity="0.2"/>
  <path d="M12 3.5a8.5 8.5 0 0 1 8.5 8.5" style="${ind('girar', 'ob-girar 800ms linear infinite')}; transform-origin: 12px 12px"/>`);

i('en-curso', ['pulso', 'en vivo', 'activo', 'live'], `
  <circle cx="12" cy="12" r="3.5" ${L}/>
  <circle cx="12" cy="12" r="3.5" vector-effect="non-scaling-stroke" style="${ind('pulso', `ob-pulso 2400ms ${CURVA} infinite`)}; transform-origin: 12px 12px"/>`);

i('exito-animado', ['hecho', 'completado', 'confirmación', 'success'], `
  <circle cx="12" cy="12" r="8.5" ${R} stroke="none" style="${ind('aparecer', `ob-aparecer 400ms ${CURVA} both`)}"/>
  <circle cx="12" cy="12" r="8.5" transform="rotate(-90 12 12)" pathLength="1" stroke-dasharray="1" style="${ind('trazo', `ob-trazar 600ms ${CURVA} both`)}"/>
  <path d="m8.25 12.25 2.5 2.5 5-5.25" pathLength="1" stroke-dasharray="1" style="${ind('trazo-2', `ob-trazar 420ms ${CURVA} 280ms both`)}"/>`);

i('error-animado', ['fallo', 'rechazo', 'falla', 'error'], `
  <circle cx="12" cy="12" r="8.5" ${R} stroke="none" style="${ind('aparecer', `ob-aparecer 400ms ${CURVA} both`)}"/>
  <circle cx="12" cy="12" r="8.5" transform="rotate(-90 12 12)" pathLength="1" stroke-dasharray="1" style="${ind('trazo', `ob-trazar 600ms ${CURVA} both`)}"/>
  <path d="m9.25 9.25 5.5 5.5" pathLength="1" stroke-dasharray="1" style="${ind('trazo-2', `ob-trazar 360ms ${CURVA} 280ms both`)}"/>
  <path d="m14.75 9.25-5.5 5.5" pathLength="1" stroke-dasharray="1" style="${ind('trazo-3', `ob-trazar 360ms ${CURVA} 380ms both`)}"/>`);

i('progreso', ['avance', 'porcentaje', 'carga', 'progress'], `
  <circle cx="12" cy="12" r="8.5" stroke-opacity="0.2"/>
  <circle cx="12" cy="12" r="8.5" transform="rotate(-90 12 12)" pathLength="100" stroke-dasharray="100" style="stroke-dashoffset: calc(100 - var(--progreso, 0)); transition: stroke-dashoffset 240ms ${CURVA}"/>`);

/* ------------------------------------------------------------------------------------------ */
/* Glifos de estado (10 × 10): una forma distinta por estado, legible sin color                */
/* ------------------------------------------------------------------------------------------ */

export const GLIFOS = {
  anillo: {
    etiquetas: ['pendiente', 'por iniciar'],
    cuerpo: '<circle cx="5" cy="5" r="3.4" fill="none" stroke="currentColor" stroke-width="1.5"/>',
  },
  medio: {
    etiquetas: ['en proceso', 'parcial'],
    cuerpo:
      '<circle cx="5" cy="5" r="3.4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M5 1.6a3.4 3.4 0 0 1 0 6.8Z" fill="currentColor"/>',
  },
  rombo: {
    etiquetas: ['en tránsito', 'en movimiento'],
    cuerpo: '<path d="M5 .9 9.1 5 5 9.1.9 5Z" fill="currentColor"/>',
  },
  lleno: {
    etiquetas: ['completado', 'entregado'],
    cuerpo: '<circle cx="5" cy="5" r="4.1" fill="currentColor"/>',
  },
  guion: {
    etiquetas: ['anulado', 'sin dato'],
    cuerpo:
      '<path d="M1.6 5h6.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  },
  triangulo: {
    etiquetas: ['alerta', 'vencido'],
    cuerpo:
      '<path d="M5 1.7 8.6 8H1.4Z" fill="currentColor" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/>',
  },
  cuadrado: {
    etiquetas: ['detenido', 'en pausa'],
    cuerpo: '<rect x="1.4" y="1.4" width="7.2" height="7.2" rx="1.3" fill="currentColor"/>',
  },
  punto: {
    etiquetas: ['neutro', 'informativo'],
    cuerpo: '<circle cx="5" cy="5" r="2.6" fill="currentColor"/>',
  },
};
