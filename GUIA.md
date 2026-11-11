# Guía de Obsidiana

Qué es el estilo, de qué está hecho y cómo se arma una pantalla. Los valores de esta guía son los de `tokens/tokens.css`; el catálogo `index.html` los muestra en vivo.

## Idea central

**La luz es el material.** La interfaz es oscura y profunda, y la luz se usa con avaricia: una línea, un punto, un borde. Lo que brilla es lo que importa (algo en curso, la acción principal, un dato que cambió). Todo lo demás retrocede.

Seis rasgos sostienen el estilo:

1. **Profundidad real.** Cuatro niveles de superficie, cada uno con un degradado vertical casi imperceptible, un borde de un píxel y un realce interior en el canto superior. El fondo lleva una luz ambiental muy tenue y un grano del 2 % para que no haya bandas.
2. **Tipografía con aire.** El interletraje se ajusta por tamaño y las cifras grandes se componen con cuidado: peso medio, unidades pequeñas y atenuadas, alineación por línea base.
3. **Bordes vivos.** El elemento con foco, seleccionado o activo recibe un filo de luz en degradado (acento a transparente), nunca un borde plano de color.
4. **Movimiento con intención.** Cada animación responde a una acción y muestra qué cambió.
5. **Ningún dato cortado.** Las tablas no recortan columnas: desplazamiento horizontal con primera columna fija y sombra de borde.
6. **Estados completos.** Cada control tiene reposo, hover, foco, activo, deshabilitado y cargando, en ambos temas.

En tema claro, la barra lateral es claramente más oscura que el contenido. La pantalla no puede verse plana.

## Prohibiciones

Una sola infracción invalida la pantalla.

- Tipografías serif, cursivas o itálicas, títulos de estilo editorial, fuentes de fantasía. `font-style: normal` en todo.
- Emojis, clip-art, ilustraciones de caricatura, degradados llamativos, neón en exceso, sombras pesadas, bordes gruesos de color, glassmorphism gratuito, manchas decorativas.
- Motivos decorativos figurativos. Los objetos del dominio se dibujan solo como geometría abstracta mínima.
- Maquetación de marketing: secciones «hero», lemas, textos de relleno, saludos.
- Títulos en mayúsculas con interletraje ancho como decoración.
- Rebotes y sobreimpulsos; animaciones decorativas en bucle. Las únicas excepciones son el pulso mínimo de algo en curso, los esqueletos y el indicador de carga.

## Tokens

Todos como variables CSS en `tokens/tokens.css`. `tokens/tailwind.css` los expone a Tailwind v4 y `tokens/tokens.json` los da en formato Design Tokens. Ningún color, radio, sombra o duración escrito a mano en un componente.

### Tema oscuro (nativo, por defecto)

| Token | Valor | Uso |
|---|---|---|
| `--lienzo` | `#06070A` | Fondo de la aplicación |
| `--lienzo-luz` | `radial-gradient(1200px 520px at 50% -120px, rgba(76,141,255,0.09), transparent 70%)` | Luz ambiental superior, fija |
| `--sup-1` | `#0B0D12` | Tarjetas y paneles |
| `--sup-2` | `#10131A` | Elementos elevados dentro de una tarjeta, campos |
| `--sup-3` | `#161A23` | Menús, ventanas, elementos flotantes |
| `--lateral` | `#050609` | Barra lateral |
| `--linea` | `rgba(255,255,255,0.06)` | Bordes y divisores |
| `--linea-fuerte` | `rgba(255,255,255,0.11)` | Bordes de campos y de elementos flotantes |
| `--realce` | `rgba(255,255,255,0.05)` | Realce interior del canto superior |
| `--texto-1` | `#F2F4F8` | Texto principal |
| `--texto-2` | `#A2AABA` | Texto secundario |
| `--texto-3` | `#7A8294` | Texto terciario, etiquetas de columna (subido desde `#6C7485` para contraste AA) |
| `--texto-4` | `#4A5160` | Separadores de miga, cifras de contexto muy atenuadas (nunca texto que haya que leer) |
| `--acento` | `#4C8DFF` | Acción principal, selección, enlaces |
| `--acento-fuerte` | `#6AA1FF` | Hover del acento |
| `--acento-suave` | `rgba(76,141,255,0.14)` | Fondos de selección, anillo de foco |
| `--vivo` | `#35D6C0` | Solo «en curso» |
| `--ambar` | `#F2B34B` | Pendiente, por vencer |
| `--rojo` | `#FF6B6B` | Vencido, error, acciones destructivas |
| `--verde` | `#4ADE80` | Entregado, aprobado, correcto |
| `--gris-estado` | `#7B8494` | Anulado, sin dato |

### Tema claro

El contenido es claro y nítido; la barra lateral es oscura para dar contraste y conservar la identidad.

| Token | Valor | Uso |
|---|---|---|
| `--lienzo` | `#F1F3F7` | Fondo de la aplicación (gris frío, no blanco) |
| `--lienzo-luz` | `radial-gradient(1200px 520px at 50% -120px, rgba(37,99,235,0.05), transparent 70%)` | Luz ambiental |
| `--sup-1` | `#FFFFFF` | Tarjetas |
| `--sup-2` | `#F6F7FA` | Campos, filas alternas, elementos dentro de tarjeta |
| `--sup-3` | `#FFFFFF` | Flotantes (con sombra) |
| `--lateral` | `#0C0F15` | Barra lateral **oscura** |
| `--lateral-texto-1` / `-2` / `-3` | `#EEF0F4` / `#9AA2B1` / `#7A8291` | Texto dentro de la barra lateral (el terciario, subido desde `#666E7C` para contraste AA) |
| `--lateral-linea` | `rgba(255,255,255,0.07)` | Divisores de la barra lateral |
| `--linea` | `rgba(12,16,24,0.08)` | Bordes |
| `--linea-fuerte` | `rgba(12,16,24,0.14)` | Bordes de campos |
| `--texto-1` | `#0A0C10` | |
| `--texto-2` | `#4A5262` | |
| `--texto-3` | `#636B7C` | Subido desde `#7A8394` para contraste AA sobre `--sup-1` y `--sup-2` |
| `--texto-4` | `#A3AAB6` | |
| `--acento` | `#2563EB` | |
| `--acento-fuerte` | `#1D4FD7` | |
| `--acento-suave` | `rgba(37,99,235,0.10)` | |
| `--vivo` | `#0B9484` | |
| `--ambar` | `#B7791F` | |
| `--rojo` | `#D43F3F` | |
| `--verde` | `#1F9254` | |
| `--gris-estado` | `#6B7384` | |

La barra lateral lee siempre de los tokens `--lateral-*`, de modo que su tono se puede ajustar sin tocar componentes. En el tema oscuro esos tokens apuntan a los valores generales. Hay un segundo juego de valores (barra lateral gris azulado medio: fondo `#DFE4EC`, texto `#0A0C10` / `#4A5262` / `#636B7C`, línea `rgba(12,16,24,0.10)`) que se activa con `data-lateral="media"` en `<html>`.

En modo claro las tarjetas se separan del lienzo con sombra suave, no solo con borde: `0 1px 2px rgba(12,16,24,0.04), 0 8px 24px -12px rgba(12,16,24,0.10)`.

### Superficies

Receta de una tarjeta (tema oscuro): fondo `--sup-1` con `linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))` encima; borde `1px solid var(--linea)`; `box-shadow: inset 0 1px 0 var(--realce)`; radio 14.

Flotantes (menús, ventanas, paleta): `--sup-3`, borde `--linea-fuerte`, sombra `0 24px 64px -16px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.3)` y el mismo realce interior. Un único desenfoque de fondo (6 px) detrás de las ventanas modales; en ningún otro sitio.

Filo de luz (foco de tarjeta, fila seleccionada, elemento activo): pseudo-elemento con `linear-gradient(135deg, var(--acento), transparent 60%)` recortado al borde con `mask-composite`, grosor 1 px.

Grano: una textura SVG (`feTurbulence`) fija sobre el lienzo al 2 % de opacidad, `pointer-events: none`.

### Tipografía

- **Inter variable** (Fontsource) para todo el texto, con `font-feature-settings: "cv11", "ss03", "tnum"` en cifras y tablas, y eje óptico activado.
- **Geist Mono** para identificadores y códigos.
- Sin mayúsculas decorativas. Solo oraciones con mayúscula inicial.

| Rol | Tamaño / interlínea | Peso | Interletraje |
|---|---|---|---|
| Título de página | 22 / 28 | 600 | -0.018em |
| Título de tarjeta | 14 / 20 | 600 | -0.006em |
| Cifra principal | 34 / 38 | 550 | -0.028em |
| Cifra secundaria | 20 / 26 | 600 | -0.02em |
| Texto | 13 / 20 | 400 | 0 |
| Texto destacado | 13 / 20 | 500 | 0 |
| Etiqueta | 12 / 16 | 500 | 0.002em |
| Etiqueta de columna | 11.5 / 16 | 500 | 0.01em, color `--texto-3` |
| Código | 12.5 / 18 (mono) | 450 | 0 |

Las unidades y monedas junto a una cifra grande ("USD", "t") van a 13 px en `--texto-3`, alineadas a la línea base de la cifra, nunca del mismo tamaño que ella.

### Forma, espacio y densidad

- Radios: 8 (controles), 12 (elementos dentro de tarjeta), 14 (tarjetas), 18 (ventanas).
- Retícula de 4 px. Separaciones habituales: 4, 8, 12, 16, 24, 32.
- Altura de controles: 32 px (compacto 28). Fila de tabla: 44 px. Encabezado de tabla: 36 px.
- Herramienta densa: sin márgenes de marketing. Ancho de trabajo de 1280 a 1920 px, mínimo 1180.

### Movimiento

En React, con Motion (`motion/react`); en HTML, con `css/movimiento.css` y `js/obsidiana.js`. Solo `transform`, `opacity` y trazos SVG.

| Uso | Especificación |
|---|---|
| Cambio de vista | Fundido cruzado con desplazamiento de 6 px, 180 ms, `cubic-bezier(0.16, 1, 0.3, 1)` |
| Indicadores que se deslizan (navegación, pestañas, control segmentado) | `layoutId`, resorte `stiffness 420, damping 36` |
| Ventana de detalle | Escala 0.98 a 1 con fundido, 220 ms; fondo que se oscurece y desenfoca 6 px |
| Menús y popovers | Escala 0.97 a 1 desde su origen, 140 ms |
| Entrada de listas | Escalonado de 24 ms por elemento, máximo 8 |
| Cifras | `@number-flow/react`, 600 ms al entrar y al cambiar |
| Trazos y rutas | `pathLength` de 0 a 1 en 900 ms con una luz que viaja una vez por el trazo |
| Hover | 120 ms |
| Guardar | El botón pasa de reposo a progreso a confirmado sin cambiar de tamaño |

`MotionConfig reducedMotion="user"`. Sin sobreimpulso. Sin bucles, salvo el pulso de algo en curso (2,4 s, opacidad 0.5 a 1).

## Armazón

- **Barra lateral** de 232 px, plegable a 64 px con solo iconos y pistas. Arriba, la marca. Grupos con etiqueta pequeña. El elemento activo lleva fondo de acento atenuado, texto principal y una barra luminosa de 2 px a la izquierda; el indicador se desliza entre elementos. Los contadores son píldoras discretas a la derecha y siguen visibles como cifra pequeña con la barra plegada. El pie es para el estado y las acciones del sistema.
- **Barra superior** de 56 px: miga de pan a la izquierda, buscador que abre la paleta de comandos con el atajo Ctrl K visible, acciones globales y conmutador de tema.
- **Paleta de comandos** grande y centrada, con resultados agrupados, navegación por teclado y búsqueda sobre los datos en memoria. Sin término muestra navegación y acciones; con término, los datos van primero.

## Componentes clave

- **Tabla de datos.** Encabezado fijo; etiquetas de columna en `--texto-3`; cifras a la derecha con numerales tabulares; hover de lavado tenue; fila seleccionada con filo de luz a la izquierda; primera columna fija con sombra de borde al desplazar; celdas vacías como «—» en `--texto-3`; pie con paginación y conteo. La flecha de orden aparece solo con orden activo, cursor o foco.
- **Píldora de estado.** Glifo más etiqueta; cada estado tiene una forma distinta (anillo, medio círculo, rombo, círculo lleno, guion), de modo que se distingue sin depender del color.
- **Cifra.** Etiqueta, valor con unidad, línea de contexto y, si aporta, una micrográfica. La moneda va delante y la unidad detrás, pequeñas y atenuadas. Las cifras de dinero se escriben completas con separadores.
- **Ventana de detalle.** Centrada, 920 px, con carril de pestañas a la izquierda, resumen fijo y contenido a la derecha; pie con «Cancelar» y la acción principal; nace de la fila que se pulsó.
- **Filtros.** Botón con contador, popover de dos niveles (categoría y lista con búsqueda y «Seleccionar todo») y fichas de filtros activos con cierre.
- **Estados vacíos.** Una ilustración mínima animada una vez, una línea de texto y una acción.
- **Esqueletos.** Con la forma del contenido real y un brillo que recorre; nunca más anchos que su celda.
- **Avisos.** Abajo a la derecha, con icono de estado y, en operaciones largas, progreso.

## Patrón de pantalla

Todas las pantallas de trabajo siguen el mismo orden vertical, para que se lean como un solo producto:

```
Título                                         [acciones]
línea de contexto (conteo, alcance)
[pestañas]                                     solo si la sección tiene varias vistas
[tira de cifras]
[barra de herramientas única]
[tabla o lista]
```

- **Márgenes.** 32 px a los lados: el título de cada pantalla cae en la misma vertical.
- **Tira de cifras.** Una sola superficie con 4 a 6 cifras en fila separadas por divisores interiores. Si filtra, cada cifra es un botón con `aria-pressed` y un indicador que se desliza a la activa. La cifra grande de 34 px queda para el panel.
- **Barra de herramientas única.** Una fila de 32 px: búsqueda (288 a 320 px), botón «Filtros» con contador, fichas activas, un solo «Limpiar» y, a la derecha, periodo, columnas y conteos. Exportar va en la cabecera.
- **Acciones de la cabecera.** Secundarias a la izquierda, exportar como botón secundario o menú, y como mucho una acción primaria a la derecha.
- **Estados.** Cargando: esqueletos. Vacío: estado vacío compacto dentro de la tarjeta de la tabla, con una acción («Limpiar filtros» si hay filtros). Error: estado vacío con texto que dice qué pasó y qué hacer.

## Iconos

Juego propio en `iconos/`: retícula de 24 px, trazo de 1.5 px, extremos y uniones redondeados, relleno al 12 % en formas cerradas, `currentColor`. La mayoría tiene una microanimación con sentido al pasar el cursor por el control que los contiene. Reglas de dibujo y regeneración en `iconos/LEEME.md`.

## Revisión visual

Nadie da por terminada una pantalla sin verla en captura, en ambos temas. Se revisa: alineación a la retícula, ritmo de espacios, jerarquía tipográfica, alineación de cifras, radios y grosores coherentes, uso contenido del acento, contraste, y que no haya nada recortado ni desbordado.
