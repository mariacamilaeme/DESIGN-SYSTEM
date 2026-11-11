import { useEffect, useEffectEvent } from 'react';

/** ¿El foco está en un campo de texto? Los atajos de una sola tecla no deben dispararse ahí. */
export function focoEnCampo(destino: EventTarget | null): boolean {
  if (!(destino instanceof HTMLElement)) return false;
  if (destino.isContentEditable) return true;
  const etiqueta = destino.tagName;
  return etiqueta === 'INPUT' || etiqueta === 'TEXTAREA' || etiqueta === 'SELECT';
}

export interface Atajo {
  /** Tecla en minúscula, por ejemplo 'k' o '\\'. */
  tecla: string;
  /** Ctrl (o Cmd en macOS). */
  mod?: boolean;
  /** Se permite aunque el foco esté en un campo de texto. */
  enCampos?: boolean;
}

/** Registra un atajo de teclado global mientras el componente está montado. */
export function useAtajo(atajo: Atajo, accion: (e: KeyboardEvent) => void, activo = true): void {
  const { tecla, mod = false, enCampos = false } = atajo;
  const ejecutar = useEffectEvent((e: KeyboardEvent) => accion(e));

  useEffect(() => {
    if (!activo) return;
    const manejar = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== tecla) return;
      const conMod = e.ctrlKey || e.metaKey;
      if (mod !== conMod) return;
      if (!enCampos && !mod && focoEnCampo(e.target)) return;
      e.preventDefault();
      ejecutar(e);
    };
    window.addEventListener('keydown', manejar);
    return () => window.removeEventListener('keydown', manejar);
  }, [tecla, mod, enCampos, activo]);
}
