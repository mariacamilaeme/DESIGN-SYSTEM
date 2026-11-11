# Obsidiana · sistema de diseño

Sistema de diseño extraído de IBC CORE 2.0. Sirve para construir otras herramientas con exactamente el mismo estilo visual: interfaz oscura y profunda donde la luz se usa con avaricia, con un tema claro de barra lateral oscura. Nivel de referencia: Linear, Vercel, Raycast, Stripe, Ramp, Mercury.

Todo funciona sin red: fuentes, iconos y estilos son locales.

## Verlo

Abre `index.html` con doble clic. Es el catálogo vivo: tokens, tipografía, iconos, primitivas, componentes, datos, movimiento y patrones de pantalla, en tema oscuro y claro, con el HTML de cada pieza listo para copiar. La galería de iconos e ilustraciones está en `iconos/index.html`.

## Qué trae

| Carpeta | Contenido |
|---|---|
| `tokens/` | `tokens.css` (variables CSS de los dos temas), `tailwind.css` (puente con Tailwind v4), `tokens.json` (formato Design Tokens) |
| `fuentes/` | Inter Variable y Geist Mono Variable con su `fuentes.css` y licencias |
| `css/` | `obsidiana.css` (punto de entrada), `base.css`, `movimiento.css` y un archivo por componente en `componentes/` |
| `js/` | `obsidiana.js`: comportamientos en JavaScript puro, sin dependencias (`window.Obsidiana`, atributos `data-ob-*`) |
| `iconos/` | 158 iconos (135 con microanimación), glifos de estado e indicadores, en SVG suelto, sprite, JavaScript y React |
| `ilustraciones/` | 12 ilustraciones de estado vacío, animadas una vez al entrar |
| `react/` | Kit React 19 + Tailwind v4 con los componentes reales de IBC CORE 2.0 y una aplicación de muestra |
| `GUIA.md` | Principios, prohibiciones, tokens, tipografía, movimiento y patrones de pantalla |
| `AGENTE.md` | Instrucciones para pegar en el `CLAUDE.md` de una herramienta nueva |

## Empezar una herramienta nueva

Hay dos caminos. Los dos dan el mismo resultado visual.

### Con React (recomendado para herramientas con datos)

```
cd react
npm install
npm run dev        # http://127.0.0.1:5391
```

Copia `react/src/estilos/` y `react/src/obsidiana/` a la herramienta nueva y sigue `react/LEEME.md`: dependencias, configuración de Vite, marca y navegación, y la tabla de componentes con un ejemplo de cada uno.

### Con HTML y CSS, sin compilación

Copia `tokens/`, `fuentes/`, `css/`, `js/`, `iconos/` e `ilustraciones/` y enlázalos:

```html
<!doctype html>
<html lang="es" data-theme="oscuro">
  <head>
    <meta charset="utf-8">
    <script>
      try { var t = localStorage.getItem("obsidiana:tema");
        document.documentElement.setAttribute("data-theme", t === "claro" ? "claro" : "oscuro");
      } catch (e) { document.documentElement.setAttribute("data-theme", "oscuro"); }
    </script>
    <link rel="stylesheet" href="css/obsidiana.css">
    <link rel="stylesheet" href="iconos/iconos.css">
    <script src="iconos/iconos.js"></script>
    <script src="ilustraciones/ilustraciones.js"></script>
    <script src="js/obsidiana.js" defer></script>
  </head>
  <body>
    <button class="ob-boton ob-boton--primario">
      <span data-icono="nuevo"></span>Nuevo pedido
    </button>
  </body>
</html>
```

El armazón completo (barra lateral, barra superior, paleta de comandos) y cada componente se copian desde el catálogo `index.html`, que muestra el HTML de cada demo.

## Reglas que no se negocian

1. Solo tokens. Ningún color, radio, sombra o duración escritos a mano en un componente.
2. Sin tipografías serif, cursivas, títulos editoriales, emojis, degradados llamativos ni glassmorphism.
3. Cada control tiene reposo, hover, foco, activo, deshabilitado y cargando, en los dos temas.
4. El movimiento responde a una acción: solo `transform`, `opacity` y trazos SVG, sin rebotes ni bucles decorativos.
5. Ninguna pantalla se da por terminada sin verla en captura, en tema claro y oscuro.

El detalle está en `GUIA.md`.

## Marca

El sistema no lleva logo propio de ninguna empresa. La demo usa el nombre «Obsidiana» con un símbolo geométrico; cada herramienta pone su marca en el hueco de la barra lateral (en React, la prop `marca` de `Armazon`).

## Mantenimiento

- Los iconos y las ilustraciones se editan en `iconos/fuente/` y se regeneran con `node iconos/fuente/generar.mjs` (ver `iconos/LEEME.md`).
- Los valores de `tokens/tokens.css` son los de IBC CORE 2.0. Si cambian allí, se actualizan aquí y en `react/src/estilos/tokens.css`.
