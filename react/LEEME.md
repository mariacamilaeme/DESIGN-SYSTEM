# Obsidiana · kit React

Punto de partida ejecutable para herramientas nuevas con el mismo estilo visual que IBC CORE 2.0: tokens, primitivas, componentes, armazón (barra lateral, barra superior, paleta de comandos, conmutador de tema) e iconos, portados del código real de la app y limpios de todo lo específico de su dominio. Incluye una aplicación de muestra que sirve de ejemplo de uso y de banco de pruebas visual.

Stack: React 19, Vite 8, Tailwind CSS v4, Radix (`radix-ui`), Motion, NumberFlow, cmdk, Sonner, TanStack Table v9 y TanStack Virtual. TypeScript estricto. Sin red en tiempo de ejecución: las fuentes son paquetes locales de Fontsource.

## Arrancar

```
npm install
npm run dev          # http://127.0.0.1:5391
npm run typecheck
npm run build        # tsc --noEmit y vite build
```

El puerto se cambia con `npm run dev -- --port 5400`.

La demo usa enrutado por hash (`#/pedidos`). Vistas: Panel (`#/`), Pedidos (`#/pedidos`, lista con tira de cifras, filtros, tabla y ventana de detalle), Clientes e Informes (páginas provisionales) y Sistema (`#/sistema`, todas las piezas con todos sus estados). Atajos: Ctrl K abre la paleta, Ctrl B pliega la barra lateral.

## Estructura

```
src/
  estilos/
    tokens.css      tokens de los dos temas + puente con Tailwind v4 (@theme)
    base.css        Tailwind, fuentes, reglas globales, recetas (.superficie, .flotante, .filo-luz,
                    .esqueleto…), keyframes, aparición de flotantes y la tabla de datos
    iconos.css      microanimaciones del juego de iconos (copia de design-system/iconos/iconos.css)
  obsidiana/        EL KIT: lo que se copia a una herramienta nueva
    ui/             primitivas
    componentes/    piezas compuestas
    armazon/        armazón configurable por props
    iconos/         158 iconos, glifos de estado
    lib/            cn, tema, formato, texto, movimiento, atajos, almacén de preferencias
    index.ts        exportaciones públicas
  demo/             aplicación de muestra (no se copia)
```

El kit no usa alias de rutas: todas sus importaciones internas son relativas, así que la carpeta `obsidiana/` funciona en cualquier sitio.

## Copiar el kit a una herramienta nueva

1. **Carpetas.** Copia `src/estilos/` y `src/obsidiana/` a la herramienta (por ejemplo a `src/`). Mantén las dos carpetas hermanas o ajusta la ruta de importación de los estilos.
2. **Dependencias** (las mismas versiones que la app):

   ```
   npm install react react-dom radix-ui motion @number-flow/react cmdk sonner \
     class-variance-authority clsx tailwind-merge @tanstack/react-table @tanstack/react-virtual \
     @fontsource-variable/inter @fontsource-variable/geist-mono
   npm install -D vite @vitejs/plugin-react tailwindcss @tailwindcss/vite typescript \
     @types/react @types/react-dom
   ```

   Si no usas `TablaDatos`, puedes prescindir de las dos de TanStack (y borrar `componentes/TablaDatos.tsx`).
3. **vite.config.ts.** Solo hacen falta los plugins de React y de Tailwind v4:

   ```ts
   import tailwindcss from '@tailwindcss/vite';
   import react from '@vitejs/plugin-react';
   import { defineConfig } from 'vite';

   export default defineConfig({ plugins: [react(), tailwindcss()] });
   ```

   La app original añade el React Compiler (`@rolldown/plugin-babel` + `babel-plugin-react-compiler`); es opcional. `TablaDatos` lleva la directiva `'use no memo'` para quedar fuera de él.
4. **index.html.** `lang="es"`, un `<div id="raiz">` y el script contra el parpadeo de tema en `<head>`, antes de cualquier CSS o JS. La clave tiene que coincidir con `CLAVES_PREFERENCIA.tema` de `obsidiana/lib/almacen.ts` (cámbiala en los dos sitios si quieres una por herramienta):

   ```html
   <html lang="es" data-theme="oscuro">
     <head>
       <script>
         (() => {
           let tema = 'oscuro';
           try {
             const guardado = localStorage.getItem('obsidiana-tema');
             if (guardado === 'claro' || guardado === 'oscuro') tema = guardado;
           } catch {}
           document.documentElement.setAttribute('data-theme', tema);
         })();
       </script>
     </head>
     <body><div id="raiz"></div><script type="module" src="/src/main.tsx"></script></body>
   </html>
   ```
5. **Punto de entrada.** Importa los estilos una vez y envuelve la app en `MotionConfig reducedMotion="user"`:

   ```tsx
   import './estilos/base.css';
   import { MotionConfig } from 'motion/react';
   import { createRoot } from 'react-dom/client';

   createRoot(document.getElementById('raiz')!).render(
     <MotionConfig reducedMotion="user"><App /></MotionConfig>,
   );
   ```
6. **tsconfig.** `strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `moduleResolution: "bundler"`, `jsx: "react-jsx"` y `types: ["vite/client"]` (ver `tsconfig.json`).
7. **Formato regional.** `LOCALE` en `obsidiana/lib/formato.ts` (por defecto `es-CO`: miles con punto, decimales con coma) lo usan las cifras animadas, los conteos y la entrada de números.

`base.css` fija `body { min-width: 1180px; overflow: hidden }`: es una herramienta de escritorio densa y el desplazamiento lo hace el `<main>` del armazón. Si la herramienta no usa el armazón, ajusta esas dos reglas.

## Cambiar marca y navegación

Todo lo específico va en props de `<Armazon>`; el ejemplo completo está en `src/demo/App.tsx`.

```tsx
import { Armazon, IconoCaja, IconoPanel, IconoEquipo, IconoSalir } from './obsidiana';

const NAVEGACION = [
  { nombre: 'Operación', destinos: [
    { ruta: '/', nombre: 'Panel', icono: IconoPanel },
    { ruta: '/pedidos', nombre: 'Pedidos', icono: IconoCaja, claves: 'ventas órdenes' },
  ] },
];

<Armazon
  marca={{ nombre: 'Mi herramienta', completa: <MiLogo />, simbolo: <MiSimbolo /> }}
  navegacion={NAVEGACION}
  rutaActual={ruta}                       // la del enrutador que uses
  navegar={(r) => router.navigate(r)}     // TanStack Router, React Router o un hash
  hrefDe={(r) => r}                       // dirección real de los <a href>
  contadores={{ '/pedidos': { n: 23, descripcion: 'pedidos abiertos', descripcionUno: 'pedido abierto' } }}
  estadoPie={{ icono: IconoEquipo, titulo: 'Datos en este equipo', detalle: 'Último respaldo: 08 nov' }}
  accionesPie={[{ id: 'salir', etiqueta: 'Cerrar sesión', icono: IconoSalir, alSeleccionar: salir }]}
  accionesSuperior={<MiMenu />}
  textoBuscador="Buscar pedidos, clientes o ir a…"
  comandos={[{ id: 'nuevo', titulo: 'Nuevo pedido', icono: IconoMas, ir: '/pedidos?nuevo=1' }]}
  fuentesPaleta={[{ id: 'pedidos', grupo: 'Pedidos', elementos, verTodos: (q) => `/pedidos?q=${q}` }]}
>
  <PantallaActual />
</Armazon>
```

- **Marca.** `completa` (unos 26 px de alto) para la barra desplegada y `simbolo` para la plegada. La barra lateral es oscura en los dos temas: usa `currentColor` (allí vale `--lateral-texto-1`) o las variables `--logo-tinta` y `--logo-acento`; dentro de la barra `--logo-tinta` pasa a `--lateral-logo-tinta`. La demo trae un ejemplo en `src/demo/Marca.tsx`.
- **Navegación.** `'/'` solo se activa con la ruta exacta; el resto, también con subrutas. Los destinos que no van en la barra (ajustes, sistema) se pasan en `destinosExtra`: aparecen en la paleta y en la miga. `subnivel` añade un segundo nivel a la miga ("Informes › Ventas").
- **Acciones de una pantalla en la paleta.** `useAccionesPaleta(acciones)` dentro de la pantalla (con un arreglo estable): aparecen en "Acciones" solo mientras está montada.
- **Enlaces internos.** `<Enlace ruta="/pedidos">` dentro del armazón: un `<a href>` real que navega con tu enrutador.
- **Tema.** `useTema()`, `fijarTema('claro')`, `alternarTema()`; `alCambiarTema(fn)` para guardarlo también en otro sitio.

## Componentes

Todos se importan desde `./obsidiana`. Ningún componente escribe colores o medidas a mano: leen los tokens.

### Primitivas (`ui/`)

| Componente | Props principales | Ejemplo |
|---|---|---|
| `Boton` | `variante` (`primario`, `secundario`, `fantasma`, `destructivo`, `destructivo-suave`), `tamano` (`sm` 28, `md` 32, `lg` 36), `estado` (`reposo`, `cargando`, `listo`: no cambia el ancho), `textoListo`, `asChild` | `<Boton variante="primario" estado={estado} textoListo="Guardado">Guardar</Boton>` |
| `BotonIcono` | `etiqueta` (nombre accesible, obligatorio), `tamano`, `variante` (`fantasma`, `borde`) | `<BotonIcono etiqueta="Editar"><IconoEditar /></BotonIcono>` |
| `Indicador` | `className` | `<Indicador />` |
| `Entrada` | `icono`, `sufijo`, `accion`, `claseContenedor` + props de `<input>` | `<Entrada icono={<IconoBuscar />} placeholder="Buscar" />` |
| `AreaTexto` | props de `<textarea>` | `<AreaTexto rows={3} />` |
| `EntradaNumero` | `valor`, `onCambio`, `unidad`, `decimales`, `onIlegible` | `<EntradaNumero valor={n} onCambio={setN} unidad="USD" decimales={2} />` |
| `Campo` / `Etiqueta` | `etiqueta`, `htmlFor`, `ayuda`, `error`, `marca` | `<Campo etiqueta="Cliente" htmlFor="c" error={e}>…</Campo>` |
| `Selector` | `valor`, `onCambio`, `opciones` (`{ valor, etiqueta }`), `marcador`, `tamano`, `invalido`, `deshabilitado`; piezas sueltas `SelectorRaiz`, `SelectorDisparador`, `SelectorContenido`, `SelectorOpcion`… | `<Selector valor={v} onCambio={setV} opciones={OPCIONES} />` |
| `Combobox` | `valor`, `onCambio`, `opciones` (`{ valor, etiqueta, meta, claves }`), `marcadorBusqueda`, `permitirVaciar`, `onCrear` | `<Combobox valor={c} onCambio={setC} opciones={CLIENTES} />` |
| `Casilla` | props de Radix Checkbox (`checked` admite `'indeterminate'`) | `<Casilla checked={v} onCheckedChange={setV} aria-label="Elegir" />` |
| `Interruptor` | props de Radix Switch | `<Interruptor checked={v} onCheckedChange={setV} aria-label="Avisar" />` |
| `Segmentado` | `valor`, `onCambio`, `opciones` (`{ valor, etiqueta, icono, nombre }`), `tamano`, `aria-label` | `<Segmentado aria-label="Vista" valor={v} onCambio={setV} opciones={…} />` |
| `Pestanas`, `PestanasLista`, `Pestana`, `PestanaContenido` | `valor` / `valorInicial`, `onCambio`, `aspecto` (`linea`, `pildora`); `Pestana` admite `cuenta` | `<Pestanas valorInicial="a"><PestanasLista><Pestana value="a">General</Pestana></PestanasLista>…</Pestanas>` |
| `Menu`, `MenuDisparador`, `MenuContenido`, `MenuElemento`, `MenuCasilla`, `MenuRadio`, `MenuSub*`, `MenuEtiqueta`, `MenuSeparador` | `MenuElemento`: `icono`, `meta`, `descripcion`, `peligro` | `<MenuElemento icono={<IconoEditar />} meta="E">Editar</MenuElemento>` |
| `Emergente`, `EmergenteDisparador`, `EmergenteContenido`, `EmergenteAncla`, `EmergenteCerrar` | props de Radix Popover | `<EmergenteContenido className="w-64 p-4">…</EmergenteContenido>` |
| `Pista` / `ProveedorPistas` | `contenido`, `atajo` (`['Ctrl','K']`), `lado`, `alineacion`, `activa` | `<Pista contenido="Editar"><BotonIcono …/></Pista>` |
| `Dialogo`, `DialogoContenido`, `DialogoEncabezado`, `DialogoCuerpo`, `DialogoPie`, `DialogoCerrar` | `DialogoContenido`: `origen`, `sinCerrar`, `enfocarVentana`; `DialogoEncabezado`: `titulo`, `descripcion`; `DialogoPie`: `nota` | ver `demo/paginas/Pedidos.tsx` (Nuevo pedido) |
| `DialogoAlerta` | `abierto`, `onAbiertoCambio`, `titulo`, `descripcion`, `textoConfirmar`, `onConfirmar`, `peligro`, `estado` | `<DialogoAlerta abierto={a} … peligro textoConfirmar="Cancelar pedido" />` |
| `Ventana` | `abierta`, `onAbiertaCambio`, `titulo`, `antetitulo`, `pestanas` (`{ id, etiqueta, icono, cuenta, contenido }`), `resumen`, `pie`, `notaPie`, `origen` (nace de la fila), `sucia` (pide confirmar al cerrar) | ver `VentanaPedido` en `demo/paginas/Pedidos.tsx` |
| `CampoFecha` | `valor` (`aaaa-mm-dd` o null), `onCambio`, `marcador`, `zonaHoraria` | `<CampoFecha valor={f} onCambio={setF} />` |
| `Avisos` / `aviso` | `Avisos tema`; `aviso.success/error/warning/promise` (Sonner) | `aviso.success('Pedido guardado', { description: 'PED-2611-114' })` |
| `Tecla` | `tamano` (`sm`, `md`) | `<Tecla>Ctrl</Tecla>` |
| `Insignia` | `tono` (`neutro`, `acento`, `vivo`, `ambar`, `rojo`, `verde`, `gris`, `borde`), `punto` | `<Insignia tono="verde">Aprobada</Insignia>` |
| `Esqueleto`, `Separador`, `AreaDesplazable` | `className`; `AreaDesplazable`: `claseVista`, `horizontal` | `<Esqueleto className="h-2.5 w-24" />` |

### Componentes (`componentes/`)

| Componente | Props principales | Ejemplo |
|---|---|---|
| `Pagina`, `EncabezadoPagina` | `titulo`, `subtitulo`, `acciones` | `<Pagina><EncabezadoPagina titulo="Pedidos" acciones={…} /></Pagina>` |
| `Tarjeta`, `EncabezadoTarjeta`, `CuerpoTarjeta` | `Tarjeta`: `filo`, `interactiva`; `EncabezadoTarjeta`: `titulo`, `icono`, `meta`, `acciones`, `nivel` | `<Tarjeta><EncabezadoTarjeta titulo="Entregas" meta="45 envíos" /></Tarjeta>` |
| `Cifra`, `MicroLinea` | `etiqueta`, `icono`, `valor`, `prefijo`, `unidad`, `formato`, `contexto`, `grafica`, `tamano` (`principal` 34 px, `secundaria` 20 px) | `<Cifra etiqueta="Por cobrar" valor={n} prefijo="USD" />` |
| `GrupoCifras` | `etiqueta`, hijos `<Cifra>` | `<GrupoCifras etiqueta="Resumen"><Cifra …/>…</GrupoCifras>` |
| `TiraCifras` | `elementos` (`{ id, etiqueta, icono, valor, prefijo, unidad, secundario }`), `etiqueta`, `activo`, `onActivo` (filtra), `cargando`, `animar` | ver `demo/paginas/Pedidos.tsx` |
| `PildoraEstado`, `definirEstados`, `ESTADOS_EJEMPLO` | `estado` (apariencia `{ forma, tono, etiqueta, corta }`) y `corta`, o `tono` + `forma` + texto; `pulso` | `<PildoraEstado estado={ESTADOS.pendiente} corta />` |
| `GlifoEstado` | `forma` (`anillo`, `medio`, `rombo`, `lleno`, `guion`, `triangulo`, `cuadrado`, `punto`) | `<GlifoEstado forma="rombo" className="text-vivo" />` |
| `FiloDeLuz` | `encendido` | `<div className="relative rounded-interno"><FiloDeLuz />…</div>` |
| `EstadoVacio` | `dibujo` (`lista`, `busqueda`, `documento`, `ruta`), `titulo`, `descripcion`, `accion`, `compacto` | `<EstadoVacio dibujo="busqueda" titulo="Sin resultados" compacto />` |
| `TablaDatos` | `filas`, `columnas` (`{ id, encabezado, valor, celda, alineacion, ancho, tipo, tono, codigo, titulo }`), `idFila`, `etiqueta`, `seleccionada`, `onAbrirFila(fila, origen)`, `orden`/`pagina`/`tamanoPagina` controlables, `cargando`, `vacio`, `altoMaximo`, `nombrePlural`, `densidad`, `pie` | ver `COLUMNAS` en `demo/paginas/Pedidos.tsx` |
| `BarraFiltros`, `FichaFiltro` | `busqueda`, `onBusqueda`, `categorias` (`{ id, etiqueta, icono, opciones }`), `seleccion`, `onSeleccion`, `acciones`, `umbralBusqueda`, `seleccionarTodo`, `ocultarQuitarFiltros`, `fichas` | ver `demo/paginas/Pedidos.tsx` |
| `LineaRuta` | `progreso` (0 a 1), `estado` (`curso`, `tarde`, `llegado`, `pendiente`), `origen`, `destino`, `alto`, `claveAnimacion` | `<LineaRuta progreso={0.6} origen="Almacén" destino="Lima" />` |
| `TransicionVista` | `clave` | `<TransicionVista clave={ruta}>{vista}</TransicionVista>` |

### Armazón (`armazon/`)

| Componente | Props principales |
|---|---|
| `Armazon` | ver "Cambiar marca y navegación" |
| `BarraLateral`, `BarraSuperior`, `PaletaComandos` | se usan sueltos solo si no quieres el armazón completo; necesitan `ContextoArmazon` |
| `InterruptorTema` | `className` |
| `Enlace`, `useArmazon`, `useAccionesPaleta`, `rutaCoincide` | utilidades del armazón |

### Iconos (`iconos/`)

158 iconos con `currentColor`, trazo de 1,5 px y relleno al 12 % (el juego ampliado de `design-system/iconos`). Props: `tamano` (12 a 48), `titulo` (sin él son decorativos), y las de `<svg>`. `CATALOGO_ICONOS` y `ICONOS` los listan con su grupo y etiquetas. Un icono nuevo se crea con `crearIcono('nombre', <path …/>)`; una microanimación al pasar el cursor, con `style={anim('caer')}` sobre la parte que se mueve.

### Utilidades (`lib/`)

`cn` (tailwind-merge con las escalas de los tokens), `LOCALE`, `formatearNumero`, `formatearDecimal`, `formatearMoneda`, `formatearPorcentaje`, `formatearCantidad`, `formatearFecha`, `fechaCorta`, `horaCorta`, `fechaRelativa`, `plural`, `normalizarTexto` y `coincideBusqueda` (búsqueda sin mayúsculas ni tildes), `useAtajo`, `CURVA`, `DURACION`, `RESORTE_INDICADOR`, `retrasoEscalonado`, `useTema`, `fijarTema`, `leerPreferencia`, `guardarPreferencia`, y las recetas de clases `CLASE_CAMPO`, `CLASE_FLOTANTE`, `CLASE_ELEMENTO_MENU`.

## Reglas del sistema (resumen de DISENO.md)

- Sin tipografías serif, cursivas, títulos editoriales, emojis, mayúsculas decorativas ni degradados llamativos. Solo oraciones con mayúscula inicial.
- Solo tokens: ningún color, radio, sombra o duración escrito a mano en un componente. Tailwind no trae su paleta (`--color-*: initial`): solo existen los colores de Obsidiana (`bg-sup-1`, `text-texto-2`, `border-linea`…).
- La luz se usa con avaricia: el acento marca la acción principal, la selección y lo que está en curso.
- Movimiento solo con `transform`, opacidad y trazos SVG, curva `cubic-bezier(0.16, 1, 0.3, 1)`, sin rebotes; el único bucle es el pulso de algo en curso. La paleta de comandos abre sin animación.
- Orden de una pantalla de trabajo: título y acciones, línea de contexto, tira de cifras, una barra de herramientas, tabla. Un valor vacío es "—" en `texto-3`.
- Controles de 32 px (compactos 28), filas de 44 px, radios 8 / 12 / 14 / 18.
