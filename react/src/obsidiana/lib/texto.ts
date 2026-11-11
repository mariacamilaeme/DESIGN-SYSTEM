/**
 * Texto: normalización para búsqueda.
 *
 * Ignora mayúsculas y tildes y busca el texto literal, incluidos puntos, comas y paréntesis;
 * `%` y `_` son caracteres normales (no comodines); un término vacío no filtra. Es la misma
 * regla en las listas, los filtros, el combobox y la paleta de comandos.
 */

/**
 * Normaliza un texto para búsqueda y comparación: minúsculas, sin tildes ni diacríticos
 * (descomposición NFD y eliminación de marcas combinantes) y sin espacios en los extremos.
 * `null` y `undefined` se tratan como cadena vacía.
 */
export function normalizarTexto(s: string | null | undefined): string {
  if (s == null) return '';
  return String(s).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
}

/**
 * ¿`valor` contiene `termino`? Sin distinguir mayúsculas ni tildes, como subcadena literal.
 * Un término vacío (o solo espacios) no filtra: devuelve `true`. Un valor nulo con un término
 * no vacío devuelve `false`.
 */
export function coincideBusqueda(
  valor: string | number | null | undefined,
  termino: string | null | undefined,
): boolean {
  const t = normalizarTexto(termino);
  if (!t) return true;
  if (valor == null) return false;
  return normalizarTexto(String(valor)).includes(t);
}

/**
 * ¿Alguno de los `valores` contiene `termino`? (O entre campos: una búsqueda sobre varias
 * columnas.) Un término vacío no filtra.
 */
export function coincideBusquedaEnCampos(
  valores: ReadonlyArray<string | number | null | undefined>,
  termino: string | null | undefined,
): boolean {
  const t = normalizarTexto(termino);
  if (!t) return true;
  return valores.some((v) => v != null && normalizarTexto(String(v)).includes(t));
}
