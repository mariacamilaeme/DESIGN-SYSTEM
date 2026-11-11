# Instrucciones para agentes: construir con Obsidiana

Pega este bloque en el `CLAUDE.md` de la herramienta nueva y ajusta la ruta al sistema de diseño.

---

## Diseño: Obsidiana

Esta herramienta usa el sistema de diseño Obsidiana (`<ruta>/design-system`). Debe verse como el mismo producto que IBC CORE 2.0.

Antes de tocar interfaz, lee `GUIA.md` y abre el catálogo `index.html`. Si usas React, lee `react/LEEME.md` y parte de `react/src/obsidiana`; si no, usa las clases `ob-*` de `css/` y los comportamientos `data-ob-*` de `js/obsidiana.js`.

### Reglas

- **Reutiliza antes de crear.** Si el componente existe en el kit, úsalo tal cual. Si falta, constrúyelo con los mismos tokens y recetas (superficie, filo de luz, flotante) y con todos sus estados.
- **Solo tokens.** Ningún color, radio, sombra, tamaño de texto o duración escritos a mano. En React, solo las utilidades generadas por los tokens (`bg-sup-1`, `text-texto-2`, `rounded-tarjeta`, `shadow-flotante`…).
- **Tipografía.** Inter Variable para texto y Geist Mono para códigos e identificadores. Cifras con numerales tabulares. Oraciones con mayúscula inicial.
- **Iconos.** Solo los del juego (`iconos/`). Si falta uno, se dibuja con las reglas de `iconos/LEEME.md` y se regenera; no se mezclan otras librerías.
- **Estados completos.** Reposo, hover, foco visible, activo, deshabilitado y cargando, en tema oscuro y claro. Carga con esqueletos de la forma del contenido; vacío con ilustración, una línea y una acción; valor vacío como «—».
- **Tablas.** Nunca recortan columnas: desplazamiento horizontal con primera columna fija. Cifras a la derecha.
- **Movimiento.** Duraciones y curva de los tokens (`--curva`, `--t-*`). Solo `transform`, `opacity` y trazos SVG. Respeta `prefers-reduced-motion`.
- **Accesibilidad.** Contraste AA, todo operable con teclado, foco atrapado en ventanas y devuelto al cerrar, estado nunca comunicado solo por color.
- **Sin red en tiempo de ejecución.** Ni CDN ni fuentes remotas.
- **Interfaz en español**, con tildes.

### Prohibido (una sola infracción invalida la pantalla)

- Tipografías serif, cursivas, títulos de estilo editorial, fuentes de fantasía.
- Emojis, clip-art, ilustraciones de caricatura.
- Degradados llamativos, neón, sombras pesadas, bordes gruesos de color, glassmorphism, manchas decorativas.
- Maquetación de marketing: secciones «hero», lemas, saludos, texto de relleno.
- Títulos en mayúsculas con interletraje ancho.
- Rebotes, sobreimpulsos y animaciones decorativas en bucle.

### Orden de una pantalla de trabajo

```
Título                                         [acciones]
línea de contexto (conteo, alcance)
[tira de cifras]
[barra de herramientas única: búsqueda, filtros, fichas, limpiar … periodo, columnas]
[tabla o lista]
```

Como mucho una acción primaria por pantalla, a la derecha de la cabecera.

### Verificación

Ninguna pantalla se entrega sin verla. Toma capturas a 1440×900 en tema oscuro y claro, compáralas con el catálogo y revisa: alineación a la retícula de 4 px, ritmo de espacios, jerarquía tipográfica, alineación de cifras, radios coherentes, uso contenido del acento, contraste, y que nada quede recortado ni desbordado.
