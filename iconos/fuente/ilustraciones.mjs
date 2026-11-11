/*
 * Obsidiana · ilustraciones de estado vacío (160 × 120).
 *
 * Superficies con borde de 1 px, líneas finas, un solo toque de acento y una entrada animada de
 * una sola vez (los trazos se dibujan; las superficies aparecen). Los colores salen de variables
 * del sistema (`--sup-2`, `--linea-fuerte`, `--texto-4`, `--acento`…), por eso se incrustan en
 * línea: así siguen el tema `oscuro` o `claro` del contenedor. Cada variable tiene un valor de
 * respaldo neutro para que el archivo .svg suelto también se vea bien.
 *
 * Clases internas (definidas en ESTILO_ILUSTRACION):
 *   ob-il-sup      superficie (relleno sup-2, borde linea-fuerte 1 px)
 *   ob-il-frente   superficie que tapa lo de detrás (relleno sup-1, sin borde)
 *   ob-il-hueco    contorno discontinuo (huecos por llenar)
 *   ob-il-linea    línea de contenido (texto-4, 1.5)
 *   ob-il-fina     línea estructural (linea-fuerte, 1)
 *   ob-il-acento   trazo de acento (acento, 1.5)
 *   ob-il-acento-suave / ob-il-punto-acento   rellenos de acento
 *   ob-il-rojo     trazo de error (solo en la ilustración «error»)
 *   ob-il-t        se dibuja al entrar (necesita pathLength="1")
 *   ob-il-a        aparece al entrar
 *   --d            retraso de la entrada, en ms
 */

const CURVA = 'cubic-bezier(0.16, 1, 0.3, 1)';

export const ESTILO_ILUSTRACION = `
.ob-ilustracion{overflow:visible}
.ob-ilustracion .ob-il-sup{fill:var(--sup-2,rgba(128,136,152,.08));stroke:var(--linea-hover,rgba(128,136,152,.42));stroke-width:1}
.ob-ilustracion .ob-il-frente{fill:var(--sup-1,rgba(128,136,152,.06));stroke:none}
.ob-ilustracion .ob-il-hueco{fill:none;stroke:var(--linea-hover,rgba(128,136,152,.5));stroke-width:1.25;stroke-dasharray:4 4;stroke-linecap:round}
.ob-ilustracion .ob-il-hueco-acento{fill:var(--acento-tenue,rgba(76,141,255,.08));stroke:var(--acento,#4c8dff);stroke-width:1.25;stroke-dasharray:4 4;stroke-linecap:round}
.ob-ilustracion .ob-il-linea{fill:none;stroke:var(--texto-3,#7a8294);stroke-opacity:.62;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.ob-ilustracion .ob-il-fina{fill:none;stroke:var(--linea-fuerte,rgba(128,136,152,.34));stroke-width:1;stroke-linecap:round}
.ob-ilustracion .ob-il-acento{fill:none;stroke:var(--acento,#4c8dff);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.ob-ilustracion .ob-il-acento-suave{fill:var(--acento-suave,rgba(76,141,255,.14));stroke:none}
.ob-ilustracion .ob-il-punto-acento{fill:var(--acento,#4c8dff);stroke:none}
.ob-ilustracion .ob-il-rojo{fill:none;stroke:var(--rojo,#ff6b6b);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.ob-ilustracion .ob-il-punto-rojo{fill:var(--rojo,#ff6b6b);stroke:none}
.ob-ilustracion .ob-il-mapa{fill:var(--punto-mapa,rgba(128,136,152,.18));stroke:none}
.ob-ilustracion .ob-il-t{stroke-dasharray:1;animation:ob-il-trazar 760ms ${CURVA} var(--d,0ms) both}
.ob-ilustracion .ob-il-a{animation:ob-il-aparecer 560ms ${CURVA} var(--d,0ms) both}
@keyframes ob-il-trazar{from{stroke-dashoffset:1;opacity:0}12%{opacity:1}to{stroke-dashoffset:0;opacity:1}}
@keyframes ob-il-aparecer{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.ob-ilustracion .ob-il-t,.ob-ilustracion .ob-il-a{animation:none}}
`
  .trim()
  .replace(/\n/g, '');

/** Trazo que se dibuja al entrar. */
const T = (d, clase = 'ob-il-linea', ms = 0) =>
  `<path d="${d}" pathLength="1" class="ob-il-t ${clase}" style="--d:${ms}ms"/>`;
/** Círculo que se dibuja al entrar. */
const TC = (cx, cy, r, clase = 'ob-il-acento', ms = 0) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" pathLength="1" class="ob-il-t ${clase}" style="--d:${ms}ms"/>`;
/** Rectángulo que aparece al entrar. */
const RA = (x, y, w, h, rx, clase = 'ob-il-sup', ms = 0) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="ob-il-a ${clase}" style="--d:${ms}ms"/>`;
/** Elemento cualquiera que aparece al entrar. */
const A = (elemento, ms = 0) => elemento.replace(/^<(\w+)/, `<$1 style="--d:${ms}ms"`).replace('class="', 'class="ob-il-a ');

/** Campo de puntos sobrio (el motivo del mapa de rutas). */
function campoPuntos(x0, y0, columnas, filas, paso) {
  let c = '';
  for (let f = 0; f < filas; f++) {
    for (let k = 0; k < columnas; k++) {
      c += `<circle cx="${x0 + k * paso}" cy="${y0 + f * paso}" r="1"/>`;
    }
  }
  return `<g class="ob-il-a ob-il-mapa" style="--d:0ms">${c}</g>`;
}

export const ILUSTRACIONES = {
  'sin-datos': {
    titulo: 'Sin datos',
    uso: 'Una tabla o lista que aún no tiene registros.',
    cuerpo: [
      RA(28, 20, 104, 80, 12),
      T('M28 40h104', 'ob-il-fina', 120),
      T('M42 30h24', 'ob-il-linea', 200),
      T('M76 30h16', 'ob-il-linea', 240),
      T('M104 30h14', 'ob-il-acento', 420),
      A('<path d="M42 55h76" class="ob-il-hueco"/>', 300),
      A('<path d="M42 69h76" class="ob-il-hueco"/>', 360),
      A('<path d="M42 83h76" class="ob-il-hueco"/>', 420),
    ],
  },

  'sin-resultados': {
    titulo: 'Sin resultados',
    uso: 'Una búsqueda o un filtro que no devuelve nada.',
    cuerpo: [
      RA(24, 20, 96, 72, 12),
      T('M38 38h44', 'ob-il-linea', 150),
      T('M38 52h30', 'ob-il-linea', 210),
      T('M38 66h38', 'ob-il-linea', 270),
      A('<circle cx="106" cy="72" r="17" class="ob-il-frente"/>', 300),
      TC(106, 72, 16, 'ob-il-acento', 340),
      T('m117.5 83.5 13 13', 'ob-il-acento', 560),
      T('M100 72h12', 'ob-il-linea', 620),
    ],
  },

  'sin-conexion': {
    titulo: 'Sin conexión',
    uso: 'Un servicio externo o una red que no responde.',
    cuerpo: [
      RA(16, 34, 48, 48, 12),
      RA(96, 34, 48, 48, 12, 'ob-il-sup', 80),
      T('M28 50h24', 'ob-il-linea', 200),
      T('M28 60h15', 'ob-il-linea', 240),
      T('M28 70h20', 'ob-il-linea', 270),
      T('M108 50h24', 'ob-il-linea', 260),
      T('M108 60h15', 'ob-il-linea', 300),
      T('M108 70h20', 'ob-il-linea', 330),
      T('M64 58h8', 'ob-il-linea', 340),
      T('M96 58h-8', 'ob-il-linea', 340),
      T('m79 50-4 16', 'ob-il-acento', 520),
      T('m87 50-4 16', 'ob-il-acento', 580),
    ],
  },

  error: {
    titulo: 'Error',
    uso: 'Algo falló al cargar o guardar; se acompaña de la causa y de cómo resolverla.',
    cuerpo: [
      RA(30, 18, 96, 72, 12),
      T('M44 36h40', 'ob-il-linea', 150),
      T('M44 50h26', 'ob-il-linea', 200),
      T('M44 68h12l4-7 6 13 4-6h14', 'ob-il-linea', 260),
      A('<circle cx="118" cy="84" r="18" class="ob-il-frente"/>', 320),
      TC(118, 84, 16, 'ob-il-rojo', 360),
      T('M118 76v9', 'ob-il-rojo', 560),
      A('<circle cx="118" cy="91" r="1.4" class="ob-il-punto-rojo"/>', 640),
    ],
  },

  'sin-permisos': {
    titulo: 'Sin permisos',
    uso: 'Contenido que existe pero que este usuario no puede ver.',
    cuerpo: [
      RA(26, 22, 108, 72, 12),
      T('M40 40h44', 'ob-il-linea', 150),
      T('M40 54h30', 'ob-il-linea', 200),
      T('M40 68h36', 'ob-il-linea', 250),
      A('<rect x="88" y="54" width="34" height="28" rx="7" class="ob-il-frente"/>', 300),
      RA(90, 56, 30, 24, 6, 'ob-il-sup', 320),
      T('M97 56v-6a8 8 0 0 1 16 0v6', 'ob-il-acento', 420),
      T('M105 64v8', 'ob-il-acento', 600),
    ],
  },

  'todo-al-dia': {
    titulo: 'Todo al día',
    uso: 'No queda nada pendiente: bandeja vacía, tareas cumplidas.',
    cuerpo: [
      A('<circle cx="80" cy="60" r="34" class="ob-il-fina"/>', 0),
      A('<circle cx="80" cy="60" r="24" class="ob-il-sup"/>', 100),
      T('m70 60.5 7 7 14-15', 'ob-il-acento', 320),
      A('<circle cx="80" cy="26" r="2" class="ob-il-punto-acento"/>', 520),
    ],
  },

  'primera-vez': {
    titulo: 'Primera vez',
    uso: 'Un módulo nuevo sin elementos: invita a crear el primero.',
    cuerpo: [
      RA(24, 32, 32, 56, 9),
      RA(64, 32, 32, 56, 9, 'ob-il-sup', 80),
      T('M32 45h16', 'ob-il-linea', 200),
      T('M32 53h10', 'ob-il-linea', 230),
      T('M72 45h16', 'ob-il-linea', 260),
      T('M72 53h12', 'ob-il-linea', 290),
      A('<rect x="104" y="32" width="32" height="56" rx="9" class="ob-il-hueco"/>', 240),
      A('<circle cx="120" cy="60" r="11" class="ob-il-acento-suave"/>', 360),
      T('M120 54v12M114 60h12', 'ob-il-acento', 460),
    ],
  },

  'archivo-por-subir': {
    titulo: 'Archivo por subir',
    uso: 'Zona para soltar o elegir un archivo (importación de Excel, adjuntos).',
    cuerpo: [
      A('<rect x="22" y="56" width="116" height="46" rx="12" class="ob-il-hueco"/>', 0),
      A(
        '<path d="M68 14h18l12 12v34a6 6 0 0 1-6 6H68a6 6 0 0 1-6-6V20a6 6 0 0 1 6-6Z" class="ob-il-sup"/>',
        100,
      ),
      T('M86 14v12h12', 'ob-il-fina', 220),
      T('M70 36h16', 'ob-il-linea', 260),
      T('M70 44h11', 'ob-il-linea', 300),
      T('M80 94V78M73 85l7-7 7 7', 'ob-il-acento', 460),
    ],
  },

  'en-construccion': {
    titulo: 'En construcción',
    uso: 'Una sección prevista que todavía no está disponible.',
    cuerpo: [
      RA(32, 22, 42, 34, 8),
      RA(80, 22, 48, 34, 8, 'ob-il-sup', 60),
      RA(32, 62, 42, 36, 8, 'ob-il-sup', 120),
      T('M42 34h20', 'ob-il-linea', 220),
      T('M42 42h12', 'ob-il-linea', 250),
      T('M90 34h26', 'ob-il-linea', 280),
      T('M90 42h16', 'ob-il-linea', 310),
      T('M42 75h18', 'ob-il-linea', 340),
      A('<rect x="80" y="62" width="48" height="36" rx="8" class="ob-il-hueco-acento"/>', 420),
      T('M95 80h18', 'ob-il-acento', 600),
    ],
  },

  'sin-notificaciones': {
    titulo: 'Sin notificaciones',
    uso: 'La bandeja de avisos está vacía.',
    cuerpo: [
      A(
        '<path d="M62 70V54a18 18 0 0 1 36 0v16l5 7a1.5 1.5 0 0 1-1.2 2.4H58.2a1.5 1.5 0 0 1-1.2-2.4Z" class="ob-il-sup"/>',
        0,
      ),
      T('M80 36v-5', 'ob-il-linea', 180),
      T('M73 83a7 7 0 0 0 14 0', 'ob-il-linea', 260),
      TC(101, 38, 6, 'ob-il-acento', 460),
      T('M44 96h72', 'ob-il-fina', 200),
    ],
  },

  'sin-rutas': {
    titulo: 'Sin viajes en curso',
    uso: 'No hay rutas activas en el mapa.',
    cuerpo: [
      campoPuntos(24, 18, 9, 7, 14),
      T('M32 88C58 84 60 50 88 44s32-12 40-14', 'ob-il-acento', 200),
      A('<circle cx="32" cy="88" r="5" class="ob-il-sup"/>', 120),
      A('<circle cx="128" cy="30" r="5" class="ob-il-sup"/>', 160),
      A('<circle cx="32" cy="88" r="1.75" class="ob-il-punto-acento"/>', 700),
    ],
  },

  'sin-documentos': {
    titulo: 'Sin documentos',
    uso: 'Un expediente sin archivos adjuntos.',
    cuerpo: [
      A(
        '<path d="M60 18h28l16 16v48a8 8 0 0 1-8 8H60a8 8 0 0 1-8-8V26a8 8 0 0 1 8-8Z" class="ob-il-sup"/>',
        0,
      ),
      T('M88 18v16h16', 'ob-il-fina', 150),
      T('M64 46h12', 'ob-il-acento', 420),
      T('M64 58h28', 'ob-il-linea', 260),
      T('M64 70h18', 'ob-il-linea', 320),
    ],
  },
};
