import { LOCALE } from '../lib/formato';
import { CLASE_CAMPO, CLASE_CAMPO_TEXTO } from '../lib/clases';
import { cn } from '../lib/cn';
import { type ComponentProps, type ReactNode, useLayoutEffect, useRef, useState } from 'react';

/*
 * Campos de texto: Entrada (una línea, con icono inicial o sufijo opcional), AreaTexto y
 * EntradaNumero (cifras y dinero con unidad como sufijo).
 */

export interface PropsEntrada extends ComponentProps<'input'> {
  /** Icono a la izquierda (16 px). */
  icono?: ReactNode;
  /** Texto o unidad a la derecha, atenuado ("USD", "t", "días"). */
  sufijo?: ReactNode;
  /** Contenido interactivo a la derecha (por ejemplo, un botón para limpiar). */
  accion?: ReactNode;
  claseContenedor?: string;
}

export function Entrada({
  className,
  claseContenedor,
  icono,
  sufijo,
  accion,
  type = 'text',
  ...props
}: PropsEntrada) {
  const campo = (
    <input
      type={type}
      data-slot="entrada"
      className={cn(
        CLASE_CAMPO,
        CLASE_CAMPO_TEXTO,
        icono ? 'pl-8' : null,
        sufijo || accion ? 'pr-10' : null,
        className,
      )}
      {...props}
    />
  );
  if (!icono && !sufijo && !accion) return campo;
  return (
    <div className={cn('relative flex w-full min-w-0 items-center', claseContenedor)}>
      {icono ? (
        <span className="pointer-events-none absolute left-2.5 flex text-texto-3">{icono}</span>
      ) : null}
      {campo}
      {sufijo ? (
        <span className="cifras pointer-events-none absolute right-2.5 text-etiqueta text-texto-3">
          {sufijo}
        </span>
      ) : null}
      {accion ? <span className="absolute right-1 flex">{accion}</span> : null}
    </div>
  );
}

export function AreaTexto({ className, rows = 4, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      rows={rows}
      data-slot="area-texto"
      className={cn(
        CLASE_CAMPO,
        CLASE_CAMPO_TEXTO,
        'h-auto min-h-20 resize-y py-1.5 leading-5',
        className,
      )}
      {...props}
    />
  );
}

const FORMATO_ES = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 6 });

function formatear(valor: number | null, decimales?: number): string {
  if (valor === null || Number.isNaN(valor)) return '';
  if (decimales === undefined) return FORMATO_ES.format(valor);
  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(valor);
}

/** Interpreta lo escrito con coma decimal (es-CO, es-ES): "1.234,5" → 1234.5. Acepta también "1234.5". */
export function interpretarNumero(texto: string): number | null {
  const limpio = texto.replace(/\s/g, '');
  if (limpio === '' || limpio === '-') return null;
  let normal = limpio;
  if (limpio.includes(',')) normal = limpio.replace(/\./g, '').replace(',', '.');
  else if ((limpio.match(/\./g) ?? []).length > 1) normal = limpio.replace(/\./g, '');
  const n = Number(normal);
  return Number.isFinite(n) ? n : null;
}

/** Texto escrito que no se puede leer como número (vacío y un signo menos solo no cuentan). */
function textoIlegible(texto: string): boolean {
  const t = texto.trim();
  return t !== '' && t !== '-' && interpretarNumero(t) === null;
}

export interface PropsEntradaNumero
  extends Omit<ComponentProps<'input'>, 'value' | 'defaultValue' | 'onChange' | 'type'> {
  valor: number | null;
  onCambio: (valor: number | null) => void;
  /** Unidad o moneda como sufijo ("USD", "t"). */
  unidad?: ReactNode;
  /** Decimales fijos al mostrar el valor (sin foco). */
  decimales?: number;
  icono?: ReactNode;
  /** Avisa si lo escrito no es un número válido (para que el formulario no lo guarde vacío). */
  onIlegible?: (ilegible: boolean) => void;
}

/**
 * Número o dinero. Con el foco se edita el número sin separadores de miles; al salir se muestra
 * formateado según LOCALE (lib/formato). Las cifras van alineadas a la derecha y con numerales tabulares.
 */
export function EntradaNumero({
  valor,
  onCambio,
  unidad,
  decimales,
  icono,
  className,
  onFocus,
  onBlur,
  onIlegible,
  ...props
}: PropsEntradaNumero) {
  const [borrador, setBorrador] = useState<string | null>(null);
  const mostrado = borrador ?? (valor === null ? '' : formatear(valor, decimales));
  // Al entrar con Tab (o con todo el texto seleccionado) el valor formateado se cambia por el
  // número sin separadores; ese cambio perdía la selección y lo que se escribía se añadía al
  // final ("1.234,50" + "99" → "1234,599"). Se vuelve a seleccionar todo tras el cambio.
  const campo = useRef<HTMLInputElement>(null);
  const reseleccionar = useRef(false);
  useLayoutEffect(() => {
    if (!reseleccionar.current) return;
    reseleccionar.current = false;
    campo.current?.select();
  });
  // Lo escrito que no es un número válido se marca, en lugar de vaciarse en silencio al salir.
  const ilegible = borrador !== null && textoIlegible(borrador);
  return (
    <Entrada
      {...props}
      ref={campo}
      aria-invalid={ilegible ? true : props['aria-invalid']}
      inputMode="decimal"
      autoComplete="off"
      icono={icono}
      sufijo={unidad}
      className={cn('cifras text-right', className)}
      value={mostrado}
      onFocus={(e) => {
        // Un texto no válido que quedó al salir se conserva para corregirlo.
        if (!ilegible) {
          const el = e.currentTarget;
          reseleccionar.current =
            el.value !== '' && el.selectionStart === 0 && el.selectionEnd === el.value.length;
          setBorrador(valor === null ? '' : String(valor).replace('.', ','));
        }
        onFocus?.(e);
      }}
      onChange={(e) => {
        setBorrador(e.target.value);
        onCambio(interpretarNumero(e.target.value));
        onIlegible?.(textoIlegible(e.target.value));
      }}
      onBlur={(e) => {
        if (!ilegible) setBorrador(null);
        onBlur?.(e);
      }}
    />
  );
}
