import { IconoCalendario, IconoChevronDerecha, IconoChevronIzquierda } from '../iconos';
import { CLASE_CAMPO, CLASE_CAMPO_TEXTO } from '../lib/clases';
import { cn } from '../lib/cn';
import { type KeyboardEvent, useState } from 'react';
import { BotonIcono } from './boton';
import { Emergente, EmergenteAncla, EmergenteContenido, EmergenteDisparador } from './emergente';

/*
 * Campo de fecha de solo día. El valor es texto `aaaa-mm-dd` (o null) y nunca se interpreta en
 * UTC: las fechas se construyen con año, mes y día locales. Se escribe como dd/mm/aaaa o se elige
 * en el calendario (navegable con flechas, Inicio/Fin, RePág/AvPág y Enter).
 */

const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];
const DIAS = ['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do'];

/** Mayúscula inicial de oración ("noviembre" → "Noviembre"). */
const mayusculaInicial = (s: string) => s.charAt(0).toLocaleUpperCase('es') + s.slice(1);

interface Dia {
  a: number;
  m: number; // 1-12
  d: number;
}

const dosCifras = (n: number) => String(n).padStart(2, '0');
const aTexto = ({ a, m, d }: Dia) => `${a}-${dosCifras(m)}-${dosCifras(d)}`;
const aVista = ({ a, m, d }: Dia) => `${dosCifras(d)}/${dosCifras(m)}/${a}`;

function deTexto(valor: string | null | undefined): Dia | null {
  if (!valor) return null;
  const r = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
  if (!r) return null;
  return { a: Number(r[1]), m: Number(r[2]), d: Number(r[3]) };
}

function diasDelMes(a: number, m: number) {
  return new Date(a, m, 0).getDate();
}

function valido({ a, m, d }: Dia) {
  return a >= 1900 && a <= 2200 && m >= 1 && m <= 12 && d >= 1 && d <= diasDelMes(a, m);
}

/** Interpreta lo escrito: dd/mm/aaaa, d/m/aa, dd-mm-aaaa o aaaa-mm-dd. */
export function interpretarFecha(texto: string): string | null {
  const t = texto.trim();
  const iso = deTexto(t);
  if (iso) return valido(iso) ? aTexto(iso) : null;
  const r = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2}|\d{4})$/.exec(t);
  if (!r) return null;
  let a = Number(r[3]);
  if (a < 100) a += 2000;
  const dia = { a, m: Number(r[2]), d: Number(r[1]) };
  return valido(dia) ? aTexto(dia) : null;
}

/*
 * Un formateador por zona horaria, creado una vez: crear un Intl.DateTimeFormat cuesta casi un
 * milisegundo, y una tabla con un campo de fecha por fila lo crearía en cada fila al montarse.
 */
const formateadoresZona = new Map<string, Intl.DateTimeFormat>();

/** "Hoy" en la hora del equipo o, si se indica, en otra zona horaria ('America/Bogota'). */
function hoyEn(zonaHoraria?: string): Dia {
  const ahora = new Date();
  const local = { a: ahora.getFullYear(), m: ahora.getMonth() + 1, d: ahora.getDate() };
  if (!zonaHoraria) return local;
  let formato = formateadoresZona.get(zonaHoraria);
  if (!formato) {
    formato = new Intl.DateTimeFormat('en-CA', {
      timeZone: zonaHoraria,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    formateadoresZona.set(zonaHoraria, formato);
  }
  return deTexto(formato.format(ahora)) ?? local;
}

function sumarDias(dia: Dia, n: number): Dia {
  const f = new Date(dia.a, dia.m - 1, dia.d + n);
  return { a: f.getFullYear(), m: f.getMonth() + 1, d: f.getDate() };
}

function sumarMeses(dia: Dia, n: number): Dia {
  const f = new Date(dia.a, dia.m - 1 + n, 1);
  const a = f.getFullYear();
  const m = f.getMonth() + 1;
  return { a, m, d: Math.min(dia.d, diasDelMes(a, m)) };
}

export interface PropsCampoFecha {
  valor: string | null;
  onCambio: (valor: string | null) => void;
  id?: string;
  marcador?: string;
  deshabilitado?: boolean;
  invalido?: boolean;
  className?: string;
  /** Zona horaria de "hoy" (por defecto, la del equipo), por ejemplo 'America/Bogota'. */
  zonaHoraria?: string;
  'aria-label'?: string;
}

export function CampoFecha({
  valor,
  onCambio,
  id,
  marcador = 'dd/mm/aaaa',
  deshabilitado,
  invalido,
  className,
  zonaHoraria,
  ...aria
}: PropsCampoFecha) {
  const elegido = deTexto(valor);
  const [borrador, setBorrador] = useState<string | null>(null);
  const [abierto, setAbierto] = useState(false);
  const [enfocado, setEnfocado] = useState<Dia>(() => elegido ?? hoyEn(zonaHoraria));
  const errorTexto = borrador !== null && borrador.trim() !== '' && !interpretarFecha(borrador);

  const confirmar = (texto: string) => {
    if (texto.trim() === '') onCambio(null);
    else {
      const f = interpretarFecha(texto);
      if (f) onCambio(f);
    }
    setBorrador(null);
  };

  return (
    <Emergente
      open={abierto}
      onOpenChange={(a) => {
        setAbierto(a);
        if (a) setEnfocado(elegido ?? hoyEn(zonaHoraria));
      }}
    >
      <EmergenteAncla asChild>
        <div className={cn('relative flex w-full min-w-0 items-center', className)}>
          <input
            id={id}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder={marcador}
            disabled={deshabilitado}
            aria-invalid={invalido || errorTexto || undefined}
            className={cn(CLASE_CAMPO, CLASE_CAMPO_TEXTO, 'cifras pr-9')}
            value={borrador ?? (elegido ? aVista(elegido) : '')}
            onChange={(e) => setBorrador(e.target.value)}
            onBlur={(e) => confirmar(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') confirmar(e.currentTarget.value);
              if (e.key === 'ArrowDown' && e.altKey) setAbierto(true);
            }}
            {...aria}
          />
          <EmergenteDisparador asChild>
            <BotonIcono
              etiqueta="Abrir calendario"
              tamano="sm"
              disabled={deshabilitado}
              className="absolute right-0.5"
            >
              <IconoCalendario tamano={16} />
            </BotonIcono>
          </EmergenteDisparador>
        </div>
      </EmergenteAncla>
      <EmergenteContenido
        align="end"
        className="w-72 p-3"
        // Al abrir, el foco va al día elegido (o a hoy) y no al botón "Mes anterior": las flechas
        // ya mueven por la rejilla y Enter elige, sin un Tab de más.
        onOpenAutoFocus={(e) => {
          const dia = (e.currentTarget as HTMLElement | null)?.querySelector<HTMLElement>(
            '[data-dia][tabindex="0"]',
          );
          if (dia) {
            e.preventDefault();
            dia.focus();
          }
        }}
      >
        <Calendario
          elegido={elegido}
          enfocado={enfocado}
          zonaHoraria={zonaHoraria}
          onEnfocar={setEnfocado}
          onElegir={(d) => {
            onCambio(aTexto(d));
            setBorrador(null);
            setAbierto(false);
          }}
        />
      </EmergenteContenido>
    </Emergente>
  );
}

function Calendario({
  elegido,
  enfocado,
  zonaHoraria,
  onEnfocar,
  onElegir,
}: {
  elegido: Dia | null;
  enfocado: Dia;
  zonaHoraria?: string;
  onEnfocar: (d: Dia) => void;
  onElegir: (d: Dia) => void;
}) {
  const hoy = hoyEn(zonaHoraria);
  const primero = new Date(enfocado.a, enfocado.m - 1, 1);
  const desfase = (primero.getDay() + 6) % 7; // lunes primero
  const inicio = sumarDias({ a: enfocado.a, m: enfocado.m, d: 1 }, -desfase);
  const celdas = Array.from({ length: 42 }, (_, i) => sumarDias(inicio, i));
  const igual = (x: Dia | null, y: Dia) => !!x && x.a === y.a && x.m === y.m && x.d === y.d;

  /** Nuevo día enfocado según la tecla, o null si la tecla no mueve el foco. */
  const destinoTecla = (tecla: string): Dia | null => {
    const diaSemana = (new Date(enfocado.a, enfocado.m - 1, enfocado.d).getDay() + 6) % 7;
    switch (tecla) {
      case 'ArrowLeft':
        return sumarDias(enfocado, -1);
      case 'ArrowRight':
        return sumarDias(enfocado, 1);
      case 'ArrowUp':
        return sumarDias(enfocado, -7);
      case 'ArrowDown':
        return sumarDias(enfocado, 7);
      case 'PageUp':
        return sumarMeses(enfocado, -1);
      case 'PageDown':
        return sumarMeses(enfocado, 1);
      case 'Home':
        return sumarDias(enfocado, -diaSemana);
      case 'End':
        return sumarDias(enfocado, 6 - diaSemana);
      default:
        return null;
    }
  };

  const teclado = (e: KeyboardEvent<HTMLDivElement>) => {
    const nuevo = destinoTecla(e.key);
    if (!nuevo) return;
    e.preventDefault();
    const rejilla = e.currentTarget;
    onEnfocar(nuevo);
    requestAnimationFrame(() => {
      rejilla.querySelector<HTMLButtonElement>(`[data-dia="${aTexto(nuevo)}"]`)?.focus();
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between pl-1">
        <span className="text-cuerpo font-semibold text-texto-1" aria-live="polite">
          {mayusculaInicial(MESES[enfocado.m - 1] ?? '')} {enfocado.a}
        </span>
        <div className="flex gap-0.5">
          <BotonIcono
            etiqueta="Mes anterior"
            tamano="sm"
            onClick={() => onEnfocar(sumarMeses(enfocado, -1))}
          >
            <IconoChevronIzquierda tamano={16} />
          </BotonIcono>
          <BotonIcono
            etiqueta="Mes siguiente"
            tamano="sm"
            onClick={() => onEnfocar(sumarMeses(enfocado, 1))}
          >
            <IconoChevronDerecha tamano={16} />
          </BotonIcono>
        </div>
      </div>
      {/* biome-ignore lint/a11y/useSemanticElements: rejilla de calendario con navegación propia */}
      <div role="grid" tabIndex={-1} onKeyDown={teclado} className="grid grid-cols-7 gap-0.5">
        {DIAS.map((d) => (
          <span key={d} className="grid h-7 place-items-center text-mini text-texto-3">
            {d}
          </span>
        ))}
        {celdas.map((c) => {
          const fuera = c.m !== enfocado.m;
          const esElegido = igual(elegido, c);
          const esHoy = igual(hoy, c);
          const esFoco = igual(enfocado, c);
          return (
            <button
              key={aTexto(c)}
              type="button"
              data-dia={aTexto(c)}
              tabIndex={esFoco ? 0 : -1}
              aria-pressed={esElegido}
              aria-label={`${c.d} de ${MESES[c.m - 1]} de ${c.a}`}
              onClick={() => onElegir(c)}
              className={cn(
                'cifras relative grid h-8 place-items-center rounded-elemento text-etiqueta',
                'transition-colors duration-(--t-hover) focus-visible:outline-offset-0',
                fuera ? 'text-texto-4' : 'text-texto-1',
                !esElegido && 'hover:bg-lavado-2',
                esElegido && 'bg-acento-relleno font-semibold text-sobre-acento',
                esHoy && !esElegido && 'font-semibold text-acento-texto',
              )}
            >
              {c.d}
              {esHoy ? (
                <span
                  aria-hidden
                  className={cn(
                    'absolute bottom-1 size-0.75 rounded-pildora',
                    esElegido ? 'bg-sobre-acento' : 'bg-acento',
                  )}
                />
              ) : null}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between border-t border-linea pt-2">
        <button
          type="button"
          className="rounded-elemento px-1.5 text-etiqueta font-medium text-acento-texto hover:bg-lavado-2"
          onClick={() => onElegir(hoy)}
        >
          Hoy
        </button>
      </div>
    </div>
  );
}
