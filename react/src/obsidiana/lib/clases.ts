/*
 * Recetas de clases compartidas por varias primitivas, para que todos los campos, menús y
 * flotantes tengan exactamente el mismo borde, radio, altura y estados.
 */

/** Campo de texto y disparadores con aspecto de campo (selector, combobox, fecha). */
export const CLASE_CAMPO = [
  'h-control w-full min-w-0 rounded-control border border-linea-fuerte bg-campo px-2.5',
  'text-cuerpo text-texto-1 shadow-control',
  'transition-[border-color,box-shadow,background-color] duration-(--t-hover) ease-salida',
  'hover:border-linea-hover hover:bg-campo-hover',
  'focus-visible:outline-none focus:outline-none focus-visible:border-acento focus-visible:ring-3 focus-visible:ring-acento-suave',
  'data-[state=open]:border-acento data-[state=open]:ring-3 data-[state=open]:ring-acento-suave',
  'aria-invalid:border-rojo aria-invalid:ring-rojo/15',
  'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-linea-fuerte',
  '[&:is(input,textarea):read-only]:border-dashed [&:is(input,textarea):read-only]:bg-transparent [&:is(input,textarea):read-only]:text-texto-2 [&:is(input,textarea):read-only]:shadow-none',
].join(' ');

/** Variante del campo cuando el foco llega por teclado o por ratón (campos de texto). */
export const CLASE_CAMPO_TEXTO =
  'focus:border-acento focus:ring-3 focus:ring-acento-suave placeholder:text-texto-3';

/** Contenedor de menú, popover y lista desplegable. */
export const CLASE_FLOTANTE =
  'flotante anim-flotante z-50 rounded-interno text-cuerpo text-texto-1';

/** Elemento de menú o de lista. */
export const CLASE_ELEMENTO_MENU = [
  'relative flex h-8 w-full select-none items-center gap-2.5 rounded-elemento px-2.5 text-left text-cuerpo text-texto-1',
  'outline-none transition-colors duration-(--t-hover)',
  'data-highlighted:bg-lavado-2 data-[selected=true]:bg-lavado-2',
  '[&[data-disabled]:not([data-disabled=false])]:pointer-events-none [&[data-disabled]:not([data-disabled=false])]:opacity-45',
  '[&>svg]:text-texto-3 data-highlighted:[&>svg]:text-texto-2',
].join(' ');
