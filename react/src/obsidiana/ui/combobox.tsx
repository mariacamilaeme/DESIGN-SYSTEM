import { IconoBuscar, IconoCheck, IconoFlechas } from '../iconos';
import { CLASE_CAMPO, CLASE_ELEMENTO_MENU } from '../lib/clases';
import { cn } from '../lib/cn';
import { normalizarTexto } from '../lib/texto';
import { Command } from 'cmdk';
import { type ReactNode, useState } from 'react';
import { Emergente, EmergenteContenido, EmergenteDisparador } from './emergente';

/*
 * Combobox con búsqueda: un disparador con aspecto de campo abre una lista filtrable.
 * La búsqueda ignora mayúsculas y tildes y busca el texto literal (misma normalización que las
 * listas: normalizarTexto de lib/texto).
 */

export interface OpcionCombobox {
  valor: string;
  etiqueta: string;
  /** Texto atenuado a la derecha (un código, un conteo). */
  meta?: ReactNode;
  /** Texto adicional por el que también se puede buscar. */
  claves?: string;
}

export interface PropsCombobox {
  valor: string | null;
  onCambio: (valor: string | null) => void;
  opciones: readonly OpcionCombobox[];
  marcador?: string;
  marcadorBusqueda?: string;
  textoVacio?: string;
  /** Permite volver a "sin valor" eligiendo la opción ya marcada. */
  permitirVaciar?: boolean;
  /** Permite crear un valor nuevo con el texto escrito. */
  onCrear?: (texto: string) => void;
  deshabilitado?: boolean;
  invalido?: boolean;
  id?: string;
  className?: string;
  'aria-label'?: string;
}

/** Filtro de cmdk con la normalización de la herramienta: coincidencia literal, sin tildes. */
export function filtroLiteral(valor: string, busqueda: string, claves?: string[]): number {
  const termino = normalizarTexto(busqueda);
  if (!termino) return 1;
  const texto = normalizarTexto([valor, ...(claves ?? [])].join(' '));
  return texto.includes(termino) ? 1 : 0;
}

export function Combobox({
  valor,
  onCambio,
  opciones,
  marcador = 'Seleccionar',
  marcadorBusqueda = 'Buscar…',
  textoVacio = 'Sin resultados',
  permitirVaciar = true,
  onCrear,
  deshabilitado,
  invalido,
  id,
  className,
  ...aria
}: PropsCombobox) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const elegida = opciones.find((o) => o.valor === valor);
  const hayExacta = opciones.some((o) => normalizarTexto(o.etiqueta) === normalizarTexto(busqueda));

  return (
    <Emergente
      open={abierto}
      onOpenChange={(a) => {
        setAbierto(a);
        if (!a) setBusqueda('');
      }}
    >
      <EmergenteDisparador
        id={id}
        disabled={deshabilitado}
        aria-invalid={invalido || undefined}
        role="combobox"
        aria-expanded={abierto}
        className={cn(CLASE_CAMPO, 'flex items-center justify-between gap-2 text-left', className)}
        {...aria}
      >
        <span className={cn('truncate', !elegida && 'text-texto-3')}>
          {elegida ? elegida.etiqueta : marcador}
        </span>
        <IconoFlechas tamano={14} className="text-texto-3" />
      </EmergenteDisparador>
      <EmergenteContenido className="w-(--radix-popover-trigger-width) min-w-60 p-0">
        <Command filter={filtroLiteral} loop>
          <div className="flex items-center gap-2 border-b border-linea px-3">
            <IconoBuscar tamano={14} className="text-texto-3" />
            <Command.Input
              value={busqueda}
              onValueChange={setBusqueda}
              placeholder={marcadorBusqueda}
              className="h-9 w-full bg-transparent text-cuerpo text-texto-1 outline-none placeholder:text-texto-3"
            />
          </div>
          <Command.List className="max-h-64 overflow-auto p-1">
            <Command.Empty className="px-2.5 py-6 text-center text-etiqueta text-texto-3">
              {textoVacio}
            </Command.Empty>
            {opciones.map((o) => (
              <Command.Item
                key={o.valor}
                value={o.etiqueta}
                keywords={o.claves ? [o.claves] : undefined}
                onSelect={() => {
                  onCambio(o.valor === valor && permitirVaciar ? null : o.valor);
                  setAbierto(false);
                  setBusqueda('');
                }}
                className={cn(CLASE_ELEMENTO_MENU, 'pr-8')}
              >
                <span className="truncate">{o.etiqueta}</span>
                {o.meta ? (
                  <span className="ml-auto text-etiqueta text-texto-3">{o.meta}</span>
                ) : null}
                {o.valor === valor ? (
                  <IconoCheck tamano={14} className="absolute right-2.5 text-acento" />
                ) : null}
              </Command.Item>
            ))}
            {onCrear && busqueda.trim() && !hayExacta ? (
              <Command.Item
                value={`__crear__${busqueda}`}
                forceMount
                onSelect={() => {
                  onCrear(busqueda.trim());
                  setAbierto(false);
                  setBusqueda('');
                }}
                className={cn(CLASE_ELEMENTO_MENU, 'text-acento-texto')}
              >
                Agregar «{busqueda.trim()}»
              </Command.Item>
            ) : null}
          </Command.List>
        </Command>
      </EmergenteContenido>
    </Emergente>
  );
}
