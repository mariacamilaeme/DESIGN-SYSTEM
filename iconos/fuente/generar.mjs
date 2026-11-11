#!/usr/bin/env node
/*
 * Obsidiana · generador del juego de iconos e ilustraciones.
 *
 *   node docs/design-system/iconos/fuente/generar.mjs
 *
 * Sin dependencias. Lee iconos.mjs e ilustraciones.mjs (la única fuente de verdad) y escribe:
 *   iconos/svg/<nombre>.svg        iconos sueltos
 *   iconos/glifos/<forma>.svg      glifos de estado
 *   iconos/sprite.svg              <symbol id="ob-<nombre>"> y <symbol id="ob-glifo-<forma>">
 *   iconos/iconos.css              keyframes y disparadores de hover
 *   iconos/iconos.js               script clásico: Obsidiana.icono(), hidratación de data-icono
 *   iconos/iconos.json             catálogo
 *   iconos/react/*.tsx             componentes React tipados
 *   ilustraciones/<nombre>.svg     ilustraciones sueltas
 *   ilustraciones/ilustraciones.js script clásico: Obsidiana.ilustracion(), data-ilustracion
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ANIMACIONES,
  CATEGORIAS,
  CURVA,
  GLIFOS,
  ICONOS,
  KEYFRAMES,
  KEYFRAMES_INDICADORES,
} from './iconos.mjs';
import { ESTILO_ILUSTRACION, ILUSTRACIONES } from './ilustraciones.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const DIR_ICONOS = join(AQUI, '..');
const DIR_ILUS = join(AQUI, '..', '..', 'ilustraciones');
const VERSION = '1.0.0';
const AVISO = 'Generado por iconos/fuente/generar.mjs. No editar a mano.';

/* ------------------------------------------------------------------------------------------ */
/* Preparación                                                                                 */
/* ------------------------------------------------------------------------------------------ */

const limpiar = (s) =>
  s
    .replace(/\s*\n\s*/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s+\/>/g, '/>')
    .trim();

const pascal = (n) =>
  n
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');

const iconos = Object.entries(ICONOS).map(([nombre, d]) => {
  const cuerpo = limpiar(d.cuerpo);
  const continuo = /--ind-/.test(cuerpo);
  return {
    nombre,
    categoria: d.categoria,
    etiquetas: d.etiquetas,
    cuerpo,
    animado: /--ia-|--ind-/.test(cuerpo),
    continuo,
    componente: `Icono${pascal(nombre)}`,
  };
});

for (const c of iconos) {
  if (!CATEGORIAS.includes(c.categoria)) throw new Error(`Categoría desconocida en ${c.nombre}`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.nombre)) throw new Error(`Nombre no kebab: ${c.nombre}`);
  for (const m of c.cuerpo.matchAll(/--ia-([a-z0-9-]+)/g)) {
    if (!ANIMACIONES[m[1]]) throw new Error(`Animación desconocida «${m[1]}» en ${c.nombre}`);
  }
}

const glifos = Object.entries(GLIFOS).map(([forma, d]) => ({ forma, ...d, cuerpo: limpiar(d.cuerpo) }));
const ilustraciones = Object.entries(ILUSTRACIONES).map(([nombre, d]) => ({
  nombre,
  titulo: d.titulo,
  uso: d.uso,
  cuerpo: limpiar(d.cuerpo.join('')),
}));

const RAIZ_ICONO =
  'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';

const svgIcono = (c) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" ${RAIZ_ICONO}>${c.cuerpo}</svg>\n`;
const svgGlifo = (g) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" width="10" height="10">${g.cuerpo}</svg>\n`;
const svgIlustracion = (il) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="160" height="120" fill="none" class="ob-ilustracion" data-ilustracion="${il.nombre}" aria-hidden="true" focusable="false"><style>${ESTILO_ILUSTRACION}</style>${il.cuerpo}</svg>`;

function escribir(ruta, contenido) {
  mkdirSync(dirname(ruta), { recursive: true });
  writeFileSync(ruta, contenido, 'utf8');
}

function vaciar(dir, ext) {
  mkdirSync(dir, { recursive: true });
  for (const f of readdirSync(dir)) if (f.endsWith(ext)) rmSync(join(dir, f));
}

/* ------------------------------------------------------------------------------------------ */
/* SVG sueltos y sprite                                                                         */
/* ------------------------------------------------------------------------------------------ */

vaciar(join(DIR_ICONOS, 'svg'), '.svg');
for (const c of iconos) escribir(join(DIR_ICONOS, 'svg', `${c.nombre}.svg`), svgIcono(c));

vaciar(join(DIR_ICONOS, 'glifos'), '.svg');
for (const g of glifos) escribir(join(DIR_ICONOS, 'glifos', `${g.forma}.svg`), svgGlifo(g));

vaciar(DIR_ILUS, '.svg');
for (const il of ilustraciones) escribir(join(DIR_ILUS, `${il.nombre}.svg`), `${svgIlustracion(il)}\n`);

escribir(
  join(DIR_ICONOS, 'sprite.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n<!-- ${AVISO} -->\n${iconos
    .map((c) => `<symbol id="ob-${c.nombre}" viewBox="0 0 24 24" ${RAIZ_ICONO}>${c.cuerpo}</symbol>`)
    .join('\n')}\n${glifos
    .map((g) => `<symbol id="ob-glifo-${g.forma}" viewBox="0 0 10 10">${g.cuerpo}</symbol>`)
    .join('\n')}\n</svg>\n`,
);

/* ------------------------------------------------------------------------------------------ */
/* CSS                                                                                          */
/* ------------------------------------------------------------------------------------------ */

const fmtKeyframes = (obj) =>
  Object.entries(obj)
    .map(([n, cuerpo]) => `@keyframes ${n} { ${cuerpo} }`)
    .join('\n');

const declaraciones = Object.entries(ANIMACIONES)
  .map(([v, [kf, ms, retraso]]) => `    --ia-${v}: ${kf} ${ms}ms ${CURVA}${retraso ? ` ${retraso}ms` : ''} both;`)
  .join('\n');

const DISPARADORES =
  ':is(button, a, [role="menuitem"], [role="option"], [role="tab"], .icono-vivo):hover';

const css = `/*
 * Obsidiana · iconos.css · v${VERSION}
 * ${AVISO}
 *
 * Microanimaciones de los iconos al pasar el cursor. Cada elemento animado del icono lleva
 * style="animation: var(--ia-nombre, none)". Aquí las variables --ia-* solo se definen mientras
 * el cursor está sobre el control que contiene el icono (botón, enlace, opción de menú, pestaña
 * o cualquier elemento con .icono-vivo), así que cada animación corre una sola vez por hover.
 * .icono-reproducir fuerza la animación una vez (quítala y vuelve a ponerla para repetir).
 * Con prefers-reduced-motion: reduce no se mueve nada; los indicadores giran más despacio.
 */

.ob-icono {
  flex: none;
  overflow: visible;
}

/* ---------------------------------------------------------------- Keyframes de hover */
${fmtKeyframes(KEYFRAMES)}

/* ---------------------------------------------------------------- Keyframes de indicadores */
${fmtKeyframes(KEYFRAMES_INDICADORES)}

/* ---------------------------------------------------------------- Disparadores */
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  ${DISPARADORES} {
${declaraciones}
  }
}

@media (prefers-reduced-motion: no-preference) {
  .icono-reproducir {
${declaraciones}
  }
}

/* ---------------------------------------------------------------- Movimiento reducido */
@media (prefers-reduced-motion: reduce) {
  :root {
    --ind-girar: ob-girar 1600ms linear infinite;
    --ind-pulso: none;
    --ind-aparecer: none;
    --ind-trazo: none;
    --ind-trazo-2: none;
    --ind-trazo-3: none;
  }
}
`;
escribir(join(DIR_ICONOS, 'iconos.css'), css);

/* ------------------------------------------------------------------------------------------ */
/* JSON                                                                                         */
/* ------------------------------------------------------------------------------------------ */

escribir(
  join(DIR_ICONOS, 'iconos.json'),
  `${JSON.stringify(
    {
      nombre: 'Obsidiana · iconos',
      version: VERSION,
      reticula: 24,
      trazo: 1.5,
      categorias: CATEGORIAS,
      iconos: iconos.map((c) => ({
        nombre: c.nombre,
        categoria: c.categoria,
        etiquetas: c.etiquetas,
        animado: c.animado,
        continuo: c.continuo,
        componente: c.componente,
      })),
      glifos: glifos.map((g) => ({ forma: g.forma, etiquetas: g.etiquetas })),
      ilustraciones: ilustraciones.map((il) => ({ nombre: il.nombre, titulo: il.titulo, uso: il.uso })),
    },
    null,
    2,
  )}\n`,
);

/* ------------------------------------------------------------------------------------------ */
/* JS clásico                                                                                   */
/* ------------------------------------------------------------------------------------------ */

const datosIconos = Object.fromEntries(
  iconos.map((c) => [c.nombre, [c.categoria, c.etiquetas, c.animado ? 1 : 0, c.cuerpo]]),
);
const datosGlifos = Object.fromEntries(glifos.map((g) => [g.forma, [g.etiquetas, g.cuerpo]]));

const js = `/*
 * Obsidiana · iconos.js · v${VERSION}
 * ${AVISO}
 *
 * Script clásico (sin módulos): funciona con <script src> y desde file://.
 *
 *   Obsidiana.iconos                       { nombre: { categoria, etiquetas, animado } }
 *   Obsidiana.icono(nombre, opciones)      → cadena SVG. Opciones: tamano (16), titulo, clase, progreso
 *   Obsidiana.glifos                       { forma: { etiquetas } }
 *   Obsidiana.glifo(forma, opciones)       → cadena SVG de 10 px. Opciones: tamano (10), clase
 *   Obsidiana.hidratarIconos(raiz)         sustituye <span data-icono> y <span data-glifo>
 *   Obsidiana.reproducirIcono(elemento)    reproduce una vez las animaciones de los iconos internos
 *
 * Al cargar el DOM hidrata el documento y luego observa los nodos que se añadan.
 */
(function () {
  'use strict';
  var O = (window.Obsidiana = window.Obsidiana || {});
  var RAIZ = '${RAIZ_ICONO}';
  var D = ${JSON.stringify(datosIconos)};
  var G = ${JSON.stringify(datosGlifos)};

  var catalogo = {};
  Object.keys(D).forEach(function (n) {
    catalogo[n] = { categoria: D[n][0], etiquetas: D[n][1].slice(), animado: D[n][2] === 1 };
  });
  var catalogoGlifos = {};
  Object.keys(G).forEach(function (n) {
    catalogoGlifos[n] = { etiquetas: G[n][0].slice() };
  });

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var avisados = {};
  function avisar(tipo, n) {
    if (avisados[tipo + n]) return;
    avisados[tipo + n] = true;
    if (window.console) console.warn('Obsidiana: ' + tipo + ' desconocido «' + n + '»');
  }

  function accesible(titulo) {
    return titulo
      ? ' role="img"><title>' + esc(titulo) + '</title>'
      : ' aria-hidden="true">';
  }

  function icono(nombre, op) {
    op = op || {};
    var d = D[nombre];
    if (!d) {
      avisar('icono', nombre);
      return '';
    }
    var t = Number(op.tamano) || 16;
    var clase = 'ob-icono' + (op.clase ? ' ' + esc(op.clase) : '');
    var estilo = op.progreso != null ? ' style="--progreso:' + Number(op.progreso) + '"' : '';
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="' + t + '" height="' + t + '" ' +
      RAIZ + ' class="' + clase + '" data-icono="' + nombre + '" focusable="false"' + estilo +
      accesible(op.titulo) + d[3] + '</svg>'
    );
  }

  function glifo(forma, op) {
    op = op || {};
    var g = G[forma];
    if (!g) {
      avisar('glifo', forma);
      return '';
    }
    var t = Number(op.tamano) || 10;
    var clase = 'ob-glifo' + (op.clase ? ' ' + esc(op.clase) : '');
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" width="' + t + '" height="' + t +
      '" class="' + clase + '" data-glifo="' + forma + '" focusable="false"' +
      accesible(op.titulo) + g[1] + '</svg>'
    );
  }

  var SELECTOR = '[data-icono]:not(svg), [data-glifo]:not(svg)';

  function sustituir(el) {
    var esGlifo = el.hasAttribute('data-glifo');
    var nombre = el.getAttribute(esGlifo ? 'data-glifo' : 'data-icono');
    var op = {
      tamano: el.getAttribute('data-tamano'),
      titulo: el.getAttribute('data-titulo'),
      clase: el.getAttribute('class'),
      progreso: el.getAttribute('data-progreso'),
    };
    var html = esGlifo ? glifo(nombre, op) : icono(nombre, op);
    if (!html) return;
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    var svg = tmp.firstChild;
    if (el.id) svg.id = el.id;
    var estilo = el.getAttribute('style');
    if (estilo) svg.setAttribute('style', (svg.getAttribute('style') || '') + ';' + estilo);
    el.parentNode.replaceChild(svg, el);
  }

  function hidratarIconos(raiz) {
    raiz = raiz || document;
    if (raiz.nodeType === 1 && raiz.matches(SELECTOR)) {
      sustituir(raiz);
      return;
    }
    var lista = raiz.querySelectorAll ? raiz.querySelectorAll(SELECTOR) : [];
    for (var k = 0; k < lista.length; k++) sustituir(lista[k]);
  }

  function reproducirIcono(el) {
    if (!el) return;
    el.classList.remove('icono-reproducir');
    void el.getBoundingClientRect();
    el.classList.add('icono-reproducir');
    clearTimeout(el.__obReproducir);
    el.__obReproducir = setTimeout(function () {
      el.classList.remove('icono-reproducir');
    }, 1000);
  }

  function observar() {
    hidratarIconos(document);
    if (!window.MutationObserver) return;
    new MutationObserver(function (cambios) {
      for (var k = 0; k < cambios.length; k++) {
        var nodos = cambios[k].addedNodes;
        for (var j = 0; j < nodos.length; j++) if (nodos[j].nodeType === 1) hidratarIconos(nodos[j]);
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  Object.assign(O, {
    versionIconos: '${VERSION}',
    iconos: catalogo,
    icono: icono,
    glifos: catalogoGlifos,
    glifo: glifo,
    hidratarIconos: hidratarIconos,
    reproducirIcono: reproducirIcono,
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', observar);
  else observar();
})();
`;
escribir(join(DIR_ICONOS, 'iconos.js'), js);

/* ------------------------------------------------------------------------------------------ */
/* JS de ilustraciones                                                                          */
/* ------------------------------------------------------------------------------------------ */

const datosIlus = Object.fromEntries(ilustraciones.map((il) => [il.nombre, [il.titulo, il.uso, svgIlustracion(il)]]));

const jsIlus = `/*
 * Obsidiana · ilustraciones.js · v${VERSION}
 * ${AVISO}
 *
 * Script clásico (sin módulos): funciona con <script src> y desde file://.
 *
 *   Obsidiana.ilustraciones                    { nombre: { titulo, uso } }
 *   Obsidiana.ilustracion(nombre, opciones)    → cadena SVG (la misma del archivo .svg).
 *                                                Opciones: titulo, clase, ancho (160)
 *   Obsidiana.hidratarIlustraciones(raiz)      sustituye <span data-ilustracion="nombre">
 *   Obsidiana.reproducirIlustracion(svg)       repite la animación de entrada
 *
 * Las ilustraciones usan variables del sistema (--sup-2, --linea-fuerte, --acento…): van en línea
 * para seguir el tema del contenedor. La entrada se anima una sola vez al insertarse.
 */
(function () {
  'use strict';
  var O = (window.Obsidiana = window.Obsidiana || {});
  var D = ${JSON.stringify(datosIlus)};

  var catalogo = {};
  Object.keys(D).forEach(function (n) {
    catalogo[n] = { titulo: D[n][0], uso: D[n][1] };
  });

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function ilustracion(nombre, op) {
    op = op || {};
    var d = D[nombre];
    if (!d) {
      if (window.console) console.warn('Obsidiana: ilustración desconocida «' + nombre + '»');
      return '';
    }
    var s = d[2];
    if (op.clase) s = s.replace('class="ob-ilustracion"', 'class="ob-ilustracion ' + esc(op.clase) + '"');
    if (op.ancho) {
      var an = Number(op.ancho);
      s = s.replace('width="160" height="120"', 'width="' + an + '" height="' + Math.round((an * 3) / 4) + '"');
    }
    if (op.titulo) {
      s = s
        .replace(' aria-hidden="true"', ' role="img"')
        .replace('<style>', '<title>' + esc(op.titulo) + '</title><style>');
    }
    return s;
  }

  var SELECTOR = '[data-ilustracion]:not(svg)';

  function sustituir(el) {
    var html = ilustracion(el.getAttribute('data-ilustracion'), {
      titulo: el.getAttribute('data-titulo'),
      clase: el.getAttribute('class'),
      ancho: el.getAttribute('data-ancho'),
    });
    if (!html) return;
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    var svg = tmp.firstChild;
    if (el.id) svg.id = el.id;
    el.parentNode.replaceChild(svg, el);
  }

  function hidratarIlustraciones(raiz) {
    raiz = raiz || document;
    if (raiz.nodeType === 1 && raiz.matches(SELECTOR)) {
      sustituir(raiz);
      return;
    }
    var lista = raiz.querySelectorAll ? raiz.querySelectorAll(SELECTOR) : [];
    for (var k = 0; k < lista.length; k++) sustituir(lista[k]);
  }

  function reproducirIlustracion(svg) {
    if (!svg || !svg.parentNode) return svg;
    var copia = svg.cloneNode(true);
    svg.parentNode.replaceChild(copia, svg);
    return copia;
  }

  function observar() {
    hidratarIlustraciones(document);
    if (!window.MutationObserver) return;
    new MutationObserver(function (cambios) {
      for (var k = 0; k < cambios.length; k++) {
        var nodos = cambios[k].addedNodes;
        for (var j = 0; j < nodos.length; j++) if (nodos[j].nodeType === 1) hidratarIlustraciones(nodos[j]);
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  Object.assign(O, {
    versionIlustraciones: '${VERSION}',
    ilustraciones: catalogo,
    ilustracion: ilustracion,
    hidratarIlustraciones: hidratarIlustraciones,
    reproducirIlustracion: reproducirIlustracion,
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', observar);
  else observar();
})();
`;
escribir(join(DIR_ILUS, 'ilustraciones.js'), jsIlus);

/* ------------------------------------------------------------------------------------------ */
/* React                                                                                        */
/* ------------------------------------------------------------------------------------------ */

const camel = (s) => s.replace(/-([a-z])/g, (_, l) => l.toUpperCase());
const ATRIBUTOS_JSX = { class: 'className', 'xlink:href': 'href' };

function estiloJsx(valor) {
  const pares = valor
    .split(';')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const k = p.indexOf(':');
      const prop = p.slice(0, k).trim();
      const v = p.slice(k + 1).trim().replace(/'/g, "\\'");
      const clave = prop.startsWith('--') ? `'${prop}'` : camel(prop);
      return `${clave}: '${v}'`;
    });
  return `{{ ${pares.join(', ')} }}`;
}

function aJsx(markup) {
  return markup.replace(/<(\/?)([a-zA-Z]+)([^>]*?)(\/?)>/g, (_, cierre, etiqueta, atrs, auto) => {
    if (cierre) return `</${etiqueta}>`;
    const partes = [];
    for (const m of atrs.matchAll(/([a-zA-Z:-]+)="([^"]*)"/g)) {
      const [, nombre, valor] = m;
      if (nombre === 'style') {
        partes.push(`style=${estiloJsx(valor)}`);
        continue;
      }
      const jsx = ATRIBUTOS_JSX[nombre] ?? (nombre.includes('-') ? camel(nombre) : nombre);
      partes.push(`${jsx}="${valor}"`);
    }
    return `<${etiqueta}${partes.length ? ` ${partes.join(' ')}` : ''}${auto ? ' /' : ''}>`;
  });
}

const iconoTsx = `/*
 * Obsidiana · base de los iconos en React.
 * ${AVISO}
 *
 * Retícula de 24 px, trazo de 1.5 px con extremos y uniones redondeados, relleno al 12 % en las
 * formas cerradas (duotono contenido) y \`currentColor\`, de modo que el icono toma el color del
 * texto que lo rodea. Sin \`titulo\` el icono es decorativo (\`aria-hidden\`).
 * Las microanimaciones necesitan la hoja iconos.css (variables --ia-* durante el hover).
 */
import type { CSSProperties, ReactNode, SVGProps } from 'react';

export type TamanoIcono = 12 | 14 | 16 | 18 | 20 | 24 | 32 | 48;

export interface PropsIcono extends Omit<SVGProps<SVGSVGElement>, 'children' | 'ref'> {
  /** Lado en píxeles. Por defecto 16. */
  tamano?: TamanoIcono;
  /** Texto accesible. Si se omite, el icono se oculta a los lectores de pantalla. */
  titulo?: string;
}

export type ComponenteIcono = ((props: PropsIcono) => ReactNode) & { nombreIcono: string };

/** Relleno de las formas cerradas: 12 % del color actual. */
export const RELLENO = { fill: 'currentColor', fillOpacity: 0.12 } as const;

/**
 * Animación que se activa al pasar el cursor por el control que contiene el icono.
 * Las variables \`--ia-*\` se definen en iconos.css solo durante el hover (o con .icono-reproducir).
 */
export function anim(nombre: string, origen?: string): CSSProperties {
  return {
    animation: \`var(--ia-\${nombre}, none)\`,
    ...(origen ? { transformOrigin: origen } : {}),
  };
}

function aPascal(nombre: string): string {
  return nombre
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

export function crearIcono(nombre: string, contenido: ReactNode): ComponenteIcono {
  const Icono = ({ tamano = 16, titulo, style, className, ...resto }: PropsIcono) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={tamano}
      height={tamano}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={titulo ? undefined : true}
      role={titulo ? 'img' : undefined}
      focusable="false"
      data-icono={nombre}
      className={className ? \`ob-icono \${className}\` : 'ob-icono'}
      style={{ flex: 'none', overflow: 'visible', ...style }}
      {...resto}
    >
      {titulo ? <title>{titulo}</title> : null}
      {contenido}
    </svg>
  );
  Icono.displayName = \`Icono\${aPascal(nombre)}\`;
  return Object.assign(Icono, { nombreIcono: nombre });
}
`;
escribir(join(DIR_ICONOS, 'react', 'Icono.tsx'), iconoTsx);

const porCategoria = CATEGORIAS.map((cat) => [cat, iconos.filter((c) => c.categoria === cat)]);

const indexTsx = `/*
 * Obsidiana · juego de iconos en React.
 * ${AVISO}
 *
 * ${iconos.length} iconos, cada uno un componente con \`currentColor\`. Los que tienen microanimación
 * al pasar el cursor la activan con la hoja iconos.css.
 */
import { type ComponenteIcono, crearIcono } from './Icono';

export type { ComponenteIcono, PropsIcono, TamanoIcono } from './Icono';
export { anim, crearIcono, RELLENO } from './Icono';

${porCategoria
  .map(
    ([cat, lista]) =>
      `/* ---------------------------------------------------------------- ${cat} */\n\n${lista
        .map((c) => `export const ${c.componente} = crearIcono(\n  '${c.nombre}',\n  <>${aJsx(c.cuerpo)}</>,\n);`)
        .join('\n\n')}`,
  )
  .join('\n\n')}

/* ---------------------------------------------------------------- Catálogo */

/** Todos los iconos por nombre (kebab-case). */
export const ICONOS = {
${iconos.map((c) => `  '${c.nombre}': ${c.componente},`).join('\n')}
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
${iconos
  .map(
    (c) =>
      `  { grupo: '${c.categoria}', nombre: '${c.nombre}', etiquetas: ${JSON.stringify(c.etiquetas).replace(/"/g, "'")}, animado: ${c.animado}, icono: ${c.componente} },`,
  )
  .join('\n')}
];
`;
escribir(join(DIR_ICONOS, 'react', 'index.tsx'), indexTsx);

const glifosTsx = `/*
 * Obsidiana · glifos de estado en React.
 * ${AVISO}
 *
 * Glifos de 10 px: una forma distinta por estado, para que una píldora se distinga sin depender
 * del color.
 */
import type { SVGProps } from 'react';

export type FormaGlifo = ${glifos.map((g) => `'${g.forma}'`).join(' | ')};

export const FORMAS_GLIFO: readonly FormaGlifo[] = [${glifos.map((g) => `'${g.forma}'`).join(', ')}];

export function GlifoEstado({
  forma,
  tamano = 10,
  ...resto
}: { forma: FormaGlifo; tamano?: number } & Omit<SVGProps<SVGSVGElement>, 'children'>) {
  return (
    <svg
      viewBox="0 0 10 10"
      width={tamano}
      height={tamano}
      aria-hidden
      focusable="false"
      data-glifo={forma}
      style={{ flex: 'none' }}
      {...resto}
    >
${glifos.map((g) => `      {forma === '${g.forma}' && <>${aJsx(g.cuerpo)}</>}`).join('\n')}
    </svg>
  );
}
`;
escribir(join(DIR_ICONOS, 'react', 'glifos.tsx'), glifosTsx);

const ilusTsx = `/*
 * Obsidiana · ilustraciones de estado vacío en React.
 * ${AVISO}
 *
 * Se incrustan en línea (no como <img>) para que sigan el tema: usan variables del sistema.
 * La entrada se anima una vez al montarse; cambia \`key\` para repetirla.
 */
import type { HTMLAttributes } from 'react';

export const ILUSTRACIONES = ${JSON.stringify(datosIlus, null, 2)
  .replace(/^/gm, '')
  .replace(/\n/g, '\n')} as const;

export type NombreIlustracion = keyof typeof ILUSTRACIONES;

export interface PropsIlustracion extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  nombre: NombreIlustracion;
  /** Texto accesible. Sin él la ilustración es decorativa. */
  titulo?: string;
}

export function Ilustracion({ nombre, titulo, style, ...resto }: PropsIlustracion) {
  const [, , svg] = ILUSTRACIONES[nombre];
  return (
    <span
      role={titulo ? 'img' : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      style={{ display: 'inline-flex', lineHeight: 0, ...style }}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG estático generado desde la fuente del sistema, sin datos de usuario.
      dangerouslySetInnerHTML={{ __html: svg }}
      {...resto}
    />
  );
}
`;
escribir(join(DIR_ICONOS, 'react', 'ilustraciones.tsx'), ilusTsx);

/* ------------------------------------------------------------------------------------------ */

const animados = iconos.filter((c) => c.animado && !c.continuo).length;
console.log(
  `Obsidiana: ${iconos.length} iconos (${animados} con animación al pasar el cursor, ${iconos.filter((c) => c.continuo).length} indicadores), ${glifos.length} glifos, ${ilustraciones.length} ilustraciones.`,
);
