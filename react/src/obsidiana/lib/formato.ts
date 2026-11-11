/**
 * Formato de números y fechas en español.
 *
 * Una sola configuración regional para todo el kit (`LOCALE`): las cifras animadas (Cifra,
 * TiraCifras), los conteos de la tabla, los contadores de la barra lateral y la entrada de
 * números la leen de aquí. Con `es-CO` los miles van con punto y los decimales con coma
 * ("1.234,5"); cambia este valor si la herramienta nueva necesita otra convención (por ejemplo
 * `es-ES`, que no agrupa los miles de cuatro cifras).
 *
 * Los formateadores se crean una vez a nivel de módulo: crear un Intl.NumberFormat o un
 * Intl.DateTimeFormat por celda cuesta decenas de milisegundos en una tabla larga.
 */

export const LOCALE = 'es-CO';

/** Texto de un valor vacío: raya larga U+2014, siempre en texto-3 cuando se pinta. */
export const VACIO = '—';

const ENTERO = new Intl.NumberFormat(LOCALE);
const DOS_DECIMALES = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const UN_DECIMAL = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const SIN_DECIMALES = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 });

/** Número con separadores ("1.234", "12,346"); hasta 3 decimales. Vacío → "—". */
export function formatearNumero(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return VACIO;
  return ENTERO.format(n);
}

/** Número con decimales fijos ("1.234,50"). Vacío → "—". */
export function formatearDecimal(n: number | null | undefined, decimales = 2): string {
  if (n == null || Number.isNaN(n)) return VACIO;
  if (decimales === 2) return DOS_DECIMALES.format(n);
  if (decimales === 1) return UN_DECIMAL.format(n);
  if (decimales === 0) return SIN_DECIMALES.format(n);
  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(n);
}

/**
 * Dinero completo con la moneda delante ("USD 1.090.148"). Las cifras de dinero se escriben
 * completas con separadores, nunca abreviadas con "$" y "M". Vacío → "—".
 */
export function formatearMoneda(
  monto: number | null | undefined,
  moneda = 'USD',
  decimales = 0,
): string {
  if (monto == null || Number.isNaN(monto)) return VACIO;
  return `${moneda} ${formatearDecimal(monto, decimales)}`;
}

/** Porcentaje a partir de una fracción: 0.218 → "21,8 %". Vacío → "—". */
export function formatearPorcentaje(fraccion: number | null | undefined, decimales = 1): string {
  if (fraccion == null || Number.isNaN(fraccion)) return VACIO;
  return `${formatearDecimal(fraccion * 100, decimales)} %`;
}

/** Cantidad con unidad detrás ("1.560,5 t"). Vacío → "—". */
export function formatearCantidad(
  n: number | null | undefined,
  unidad: string,
  decimales = 0,
): string {
  if (n == null || Number.isNaN(n)) return VACIO;
  return `${formatearDecimal(n, decimales)} ${unidad}`;
}

/** Singular o plural según la cantidad: plural(1, 'pedido', 'pedidos') → "1 pedido". */
export function plural(n: number, singular: string, plurales: string): string {
  return `${formatearNumero(n)} ${n === 1 ? singular : plurales}`;
}

/* ---------------------------------------------------------------------------------- Fechas */

const MESES_CORTOS = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
] as const;

const RE_DIA = /^(\d{4})-(\d{2})-(\d{2})$/;
const dos = (n: number) => String(n).padStart(2, '0');

/**
 * Fecha a partir de `aaaa-mm-dd` (día, sin hora) o de una marca de tiempo ISO. Un día se
 * construye con año, mes y día locales a mediodía: nunca se interpreta en UTC ni se desplaza.
 */
export function aFecha(valor: string | Date): Date | null {
  if (valor instanceof Date) return Number.isNaN(valor.getTime()) ? null : valor;
  const d = RE_DIA.exec(valor.trim());
  const fecha = d ? new Date(Number(d[1]), Number(d[2]) - 1, Number(d[3]), 12) : new Date(valor);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
}

/** Día como texto `aaaa-mm-dd` en hora local (hoy si se omite). */
export function diaISO(fecha: Date = new Date()): string {
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`;
}

/** "07/11/2026". Vacío → "—". Un texto que no es fecha se devuelve tal cual. */
export function formatearFecha(valor: string | Date | null | undefined): string {
  if (!valor) return VACIO;
  const f = aFecha(valor);
  if (!f) return String(valor);
  return `${dos(f.getDate())}/${dos(f.getMonth() + 1)}/${f.getFullYear()}`;
}

/**
 * Fecha corta "08 nov 2026". Con `omitirAnioActual`, el año solo aparece si no es el actual
 * ("08 nov"). Vacío → "—".
 */
export function fechaCorta(
  valor: string | Date | null | undefined,
  omitirAnioActual = false,
): string {
  if (!valor) return VACIO;
  const f = aFecha(valor);
  if (!f) return String(valor);
  const texto = `${dos(f.getDate())} ${MESES_CORTOS[f.getMonth()]}`;
  if (omitirAnioActual && f.getFullYear() === new Date().getFullYear()) return texto;
  return `${texto} ${f.getFullYear()}`;
}

/** Hora "21:47" de una marca de tiempo. Null si el valor es solo un día. */
export function horaCorta(valor: string | Date): string | null {
  if (typeof valor === 'string' && RE_DIA.test(valor.trim())) return null;
  const f = aFecha(valor);
  return f ? `${dos(f.getHours())}:${dos(f.getMinutes())}` : null;
}

const RELATIVA = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
const UNIDADES: readonly [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
];

/**
 * Distancia en español desde ahora: "hace 3 días", "mañana", "en 2 semanas". Vacío → "—".
 * `ahora` se puede inyectar (pruebas, capturas).
 */
export function fechaRelativa(
  valor: string | Date | null | undefined,
  ahora: Date = new Date(),
): string {
  if (!valor) return VACIO;
  const f = aFecha(valor);
  if (!f) return String(valor);
  const segundos = (f.getTime() - ahora.getTime()) / 1000;
  for (const [unidad, s] of UNIDADES) {
    if (Math.abs(segundos) >= s || unidad === 'minute') {
      return RELATIVA.format(Math.round(segundos / s), unidad);
    }
  }
  return RELATIVA.format(0, 'minute');
}
