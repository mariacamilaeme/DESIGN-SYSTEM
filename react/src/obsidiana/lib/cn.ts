import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/*
 * `cn` de Obsidiana: une clases y resuelve conflictos de Tailwind conociendo los tokens propios.
 *
 * tailwind-merge no sabe que `text-etiqueta` es un tamaño de letra y `text-sobre-acento` un color:
 * sin esta configuración trata a los dos como colores y descarta uno (por ejemplo, un botón
 * compacto perdía el color de su texto). Aquí se declaran las escalas de tokens.css.
 */

const TAMANOS_TEXTO = [
  'titulo',
  'titulo-ventana',
  'titulo-tarjeta',
  'cifra',
  'cifra-2',
  'cuerpo',
  'etiqueta',
  'columna',
  'codigo',
  'paleta',
  'mini',
  'micro',
];

const RADIOS = ['mini', 'elemento', 'control', 'interno', 'tarjeta', 'ventana', 'pildora'];

const SOMBRAS = ['tarjeta', 'flotante', 'control', 'boton-acento', 'carril-indicador'];

const ESPACIOS = ['control', 'control-compacto', 'fila', 'encabezado-tabla', 'superior'];

const unir = extendTailwindMerge({
  extend: {
    theme: {
      text: TAMANOS_TEXTO,
      radius: RADIOS,
      shadow: SOMBRAS,
      spacing: ESPACIOS,
    },
  },
});

export function cn(...entradas: ClassValue[]) {
  return unir(clsx(entradas));
}
