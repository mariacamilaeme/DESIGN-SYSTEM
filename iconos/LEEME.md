# Obsidiana · iconos e ilustraciones

158 iconos (135 con microanimación al pasar el cursor), 5 indicadores animados, 8 glifos de estado y 12 ilustraciones de estado vacío. Todo sale de una sola fuente y se regenera con un script de Node sin dependencias.

Para ver el juego completo, abre `index.html` (funciona con doble clic, desde `file://`).

## Estructura

```
iconos/
  fuente/
    iconos.mjs          fuente única de iconos, glifos y animaciones   ← se edita aquí
    ilustraciones.mjs   fuente única de las ilustraciones              ← y aquí
    generar.mjs         genera todo lo demás
  svg/<nombre>.svg      iconos sueltos (24 × 24)
  glifos/<forma>.svg    glifos de estado (10 × 10)
  sprite.svg            <symbol id="ob-<nombre>"> y <symbol id="ob-glifo-<forma>">
  iconos.css            keyframes y disparadores de las animaciones
  iconos.js             script clásico: Obsidiana.icono(), hidratación de data-icono
  iconos.json           catálogo (nombre, categoría, etiquetas, animado)
  react/                Icono.tsx, index.tsx, glifos.tsx, ilustraciones.tsx
  index.html            galería
ilustraciones/
  <nombre>.svg          ilustraciones sueltas (160 × 120)
  ilustraciones.js      script clásico: Obsidiana.ilustracion(), data-ilustracion
```

Todo lo que no está en `fuente/` es generado: no lo edites a mano.

## Uso

### HTML sin compilación

```html
<link rel="stylesheet" href="tokens/tokens.css">
<link rel="stylesheet" href="iconos/iconos.css">
<script src="iconos/iconos.js"></script>
<script src="ilustraciones/ilustraciones.js"></script>

<button><span data-icono="descargar"></span>Descargar</button>
<span data-icono="buscar" data-tamano="20" data-titulo="Buscar"></span>
<span data-glifo="rombo"></span>
<span data-icono="progreso" data-progreso="40"></span>
<span data-ilustracion="sin-resultados"></span>
```

Al cargar el DOM, cada `<span data-icono>` se sustituye por el SVG en línea. Conserva `class`, `id` y `style`; añade la clase `ob-icono`. Sin `data-titulo` el icono lleva `aria-hidden="true"`; con él, `role="img"` y `<title>`. Los elementos que se añadan después también se hidratan (MutationObserver).

### API de JavaScript

Los dos scripts añaden sus funciones a `window.Obsidiana` con `Object.assign`, sin pisar lo que ya haya (por ejemplo `js/obsidiana.js`).

| Función | Devuelve |
| --- | --- |
| `Obsidiana.iconos` | `{ nombre: { categoria, etiquetas, animado } }` |
| `Obsidiana.icono(nombre, { tamano = 16, titulo, clase, progreso })` | cadena SVG |
| `Obsidiana.glifos` | `{ forma: { etiquetas } }` |
| `Obsidiana.glifo(forma, { tamano = 10, titulo, clase })` | cadena SVG |
| `Obsidiana.hidratarIconos(raiz = document)` | sustituye `data-icono` y `data-glifo` |
| `Obsidiana.reproducirIcono(elemento)` | reproduce una vez las animaciones de los iconos internos |
| `Obsidiana.ilustraciones` | `{ nombre: { titulo, uso } }` |
| `Obsidiana.ilustracion(nombre, { titulo, clase, ancho = 160 })` | cadena SVG (la misma del archivo `.svg`) |
| `Obsidiana.hidratarIlustraciones(raiz = document)` | sustituye `data-ilustracion` |
| `Obsidiana.reproducirIlustracion(svg)` | repite la entrada; devuelve el SVG nuevo |

Un nombre desconocido devuelve `''` y avisa una vez en la consola.

### React

```tsx
import { IconoDescargar, ICONOS, CATALOGO_ICONOS, type NombreIcono } from './iconos/react';
import { GlifoEstado } from './iconos/react/glifos';
import { Ilustracion } from './iconos/react/ilustraciones';

<IconoDescargar />                         // 16 px, decorativo
<IconoDescargar tamano={20} titulo="Descargar" />
const Icono = ICONOS['chevron-derecha'];   // por nombre
<GlifoEstado forma="rombo" />
<Ilustracion nombre="sin-resultados" />
```

La API es la misma que en IBC CORE 2.0: `tamano` (12, 14, 16, 18, 20, 24, 32, 48), `titulo`, `crearIcono(nombre, contenido)`, `RELLENO`, `anim(nombre, origen)` y los tipos `ComponenteIcono`, `PropsIcono`, `TamanoIcono`. Se añaden `ICONOS`, `NombreIcono` y `CATALOGO_ICONOS` con etiquetas. Importa `iconos.css` una vez en la aplicación para las animaciones. Compila con TypeScript estricto y React 19.

Diferencia con la app: `data-icono` y `nombreIcono` ahora son el nombre en kebab-case (`mas-opciones`), no en PascalCase (`MasOpciones`).

### Sprite

```html
<svg class="ob-icono" width="16" height="16"><use href="iconos/sprite.svg#ob-descargar"/></svg>
```

Útil para páginas servidas por HTTP. Chrome bloquea `<use>` hacia otro archivo desde `file://`, y las animaciones dentro de `<use>` no son fiables: para animar, usa el SVG en línea.

### Ilustraciones

Van en línea porque sus colores son variables del sistema (`--sup-2`, `--linea-hover`, `--texto-3`, `--acento`, `--rojo`): así siguen el tema `oscuro` o `claro` del contenedor. Cada variable tiene un valor de respaldo neutro, de modo que el `.svg` suelto también se ve bien. La entrada (superficies que aparecen, trazos que se dibujan) corre una sola vez al insertarse y se anula con `prefers-reduced-motion`.

Estado vacío completo: la ilustración, una línea de título, una de explicación y una acción.

## Animaciones

Cada elemento animado del icono lleva `style="animation: var(--ia-nombre, none)"`. `iconos.css` define las variables `--ia-*` solo:

- durante el hover de `button`, `a`, `[role=menuitem]`, `[role=option]`, `[role=tab]` o `.icono-vivo` que contenga el icono, dentro de `@media (hover: hover) and (pointer: fine)`;
- con la clase `.icono-reproducir` en un contenedor (para reproducirla a mano);
- nunca con `prefers-reduced-motion: reduce`.

Una sola vez por hover, 360–600 ms, curva `cubic-bezier(0.16, 1, 0.3, 1)`, sin rebote, solo `transform`, `opacity` y `stroke-dashoffset`. Sin la hoja, los estilos en línea no hacen nada.

Vocabulario (`ANIMACIONES` en `fuente/iconos.mjs`): `trazo-1/2/3` y `trazo-lento` (la línea se dibuja), `caer`, `subir`, `despegar` (sale y vuelve a entrar), `empujar`, `empujar-izq/arr/ab`, `salir` (diagonal), `girar` (90°), `media-vuelta` (180°), `rayos` (45°), `reloj` y `reloj-atras` (360°), `inclinar` e `inclinar-der`, `asomar`, `navegar`, `barra-1/2/3`, `ruta`, `encoger-1/2/3`, `encender`, `parpadear`, `levantar`, `presionar`, `pulsar`, `destello`, `aterrizar`, `apilar`, `voltear`, `destellar`, `separar-izq/der`, `expandir`.

Indicadores (fuera del hover): `cargando` (el único bucle junto con `en-curso`), `en-curso`, `exito-animado` y `error-animado` (se dibujan al insertarse) y `progreso` (lee `--progreso`, de 0 a 100). Con movimiento reducido el giro va más despacio y el resto queda quieto.

## Añadir un icono

1. Dibuja en `fuente/iconos.mjs`, dentro de su categoría:

   ```js
   i('nombre-en-kebab', ['etiqueta', 'sinónimo', 'english'], `
     <rect x="3.5" y="4.5" width="17" height="15" rx="3" ${R}/>
     <path d="M8 12h8" ${t('trazo-1')}/>`);
   ```

2. Ejecuta `node docs/design-system/iconos/fuente/generar.mjs`.
3. Revísalo en `index.html` a 16 px y a 24 px, en los dos temas, y con el cursor encima.

### Reglas de dibujo

- **Retícula** de 24 × 24. Área viva de 3.5 a 20.5. Solo los extremos de trazos abiertos pueden asomar medio trazo (0.75).
- **Trazo** de 1.5, extremos y uniones redondeados, `currentColor`. Nunca colores fijos.
- **Relleno** al 12 % (`${R}`) en una o dos formas cerradas, las que dan cuerpo al icono. El resto, solo trazo.
- **Radios**: 3.5 en cuadrados de 17 × 17; 3 en marcos grandes; 2 en piezas medianas; 1–1.5 en piezas pequeñas.
- **Documentos**: usa `documento(...)` (cuerpo de 5.5 a 18.5, pliegue de 5, esquinas de 1.5).
- **Círculos** completos de r 8.5 centrados en 12.
- **Puntos**: `punto(x, y)` r 1.5 si van solos; r 1.25 en viñetas; `h.01` con `stroke-width="2"` bajo otros trazos.
- **Separación** mínima de 2.5 unidades entre trazos paralelos, o se funden a 16 px.
- **Coordenadas** en medios píxeles cuando el trazo es horizontal o vertical y la nitidez a 16 px importa.
- **Carácter**: geométrico y sobrio. Sin motivos náuticos decorativos, clip-art, caricatura ni emojis.

### Reglas de animación

- Solo si significa algo: la flecha de descarga cae, la papelera levanta la tapa, el check se dibuja.
- Usa una variable existente; si hace falta otra, añádela en `KEYFRAMES` y `ANIMACIONES`.
- La animación termina donde empezó o en una posición idéntica (un giro de 90° en una forma de simetría 4), para que al quitar el cursor no salte.
- Origen de las transformaciones en coordenadas de la retícula: `a('girar', '12px 12px')`.
- Para trazos: `t('trazo-1')` añade `pathLength="1"` y `stroke-dasharray="1"`.

## Añadir una ilustración

En `fuente/ilustraciones.mjs`, con los ayudantes `RA` (superficie que aparece), `T` (trazo que se dibuja), `TC` (círculo que se dibuja) y `A` (cualquier elemento que aparece), y retrasos de 0 a 700 ms. Lienzo de 160 × 120, contenido entre 16 y 144. Un solo toque de `ob-il-acento` (`ob-il-rojo` solo para errores). Regenera y revísala en los dos temas.
