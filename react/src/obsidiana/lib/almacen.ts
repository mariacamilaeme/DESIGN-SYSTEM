/**
 * Preferencias de interfaz en `localStorage` (tema, barra lateral plegada, tamaño de página…).
 * Toda lectura y escritura tolera un navegador sin almacenamiento: nunca lanza.
 */
export function leerPreferencia(clave: string): string | null {
  try {
    return window.localStorage.getItem(clave);
  } catch {
    return null;
  }
}

export function guardarPreferencia(clave: string, valor: string | null): void {
  try {
    if (valor === null) window.localStorage.removeItem(clave);
    else window.localStorage.setItem(clave, valor);
  } catch {
    // Sin almacenamiento: la preferencia vive solo en esta sesión.
  }
}

/** Claves de preferencias usadas por el armazón. La del tema debe coincidir con el script contra el parpadeo de index.html. */
export const CLAVES_PREFERENCIA = {
  tema: 'obsidiana-tema',
  lateralPlegada: 'obsidiana-lateral-plegada',
} as const;
