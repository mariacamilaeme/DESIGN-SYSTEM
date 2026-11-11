import { IconoCheck, IconoChevronAbajo } from '../iconos';
import { CLASE_CAMPO, CLASE_ELEMENTO_MENU, CLASE_FLOTANTE } from '../lib/clases';
import { cn } from '../lib/cn';
import { Select } from 'radix-ui';
import type { ComponentProps, ReactNode } from 'react';

/*
 * Selector (lista cerrada de opciones) sobre Radix Select.
 * Uso sencillo: <Selector valor onCambio opciones={[{ valor, etiqueta }]} />.
 */

export interface OpcionSelector {
  valor: string;
  etiqueta: ReactNode;
  descripcion?: ReactNode;
  deshabilitada?: boolean;
}

export interface PropsSelector {
  valor?: string;
  onCambio?: (valor: string) => void;
  opciones: readonly OpcionSelector[];
  marcador?: string;
  deshabilitado?: boolean;
  invalido?: boolean;
  id?: string;
  className?: string;
  tamano?: 'sm' | 'md';
  'aria-label'?: string;
}

export function Selector({
  valor,
  onCambio,
  opciones,
  marcador = 'Seleccionar',
  deshabilitado,
  invalido,
  id,
  className,
  tamano = 'md',
  ...aria
}: PropsSelector) {
  return (
    <Select.Root value={valor} onValueChange={onCambio} disabled={deshabilitado}>
      <SelectorDisparador
        id={id}
        aria-invalid={invalido || undefined}
        className={cn(tamano === 'sm' && 'h-control-compacto text-etiqueta', className)}
        {...aria}
      >
        <Select.Value placeholder={marcador} />
      </SelectorDisparador>
      <SelectorContenido>
        {opciones.map((o) => (
          <SelectorOpcion key={o.valor} value={o.valor} disabled={o.deshabilitada}>
            {o.etiqueta}
          </SelectorOpcion>
        ))}
      </SelectorContenido>
    </Select.Root>
  );
}

export const SelectorRaiz = Select.Root;
export const SelectorValor = Select.Value;
export const SelectorGrupo = Select.Group;

export function SelectorDisparador({
  className,
  children,
  ...props
}: ComponentProps<typeof Select.Trigger>) {
  return (
    <Select.Trigger
      className={cn(
        CLASE_CAMPO,
        // El grupo con nombre evita que la flecha gire por un antecesor abierto (una ventana o un
        // diálogo llevan también `data-state="open"`): solo cuenta el estado de este disparador.
        'group/selector flex items-center justify-between gap-2 text-left',
        'data-placeholder:text-texto-3 [&>span]:truncate',
        className,
      )}
      {...props}
    >
      {children}
      <Select.Icon asChild>
        <IconoChevronAbajo
          tamano={14}
          className="text-texto-3 transition-transform duration-(--t-estado) ease-salida group-data-[state=open]/selector:rotate-180"
        />
      </Select.Icon>
    </Select.Trigger>
  );
}

export function SelectorContenido({
  className,
  children,
  position = 'popper',
  ...props
}: ComponentProps<typeof Select.Content>) {
  return (
    <Select.Portal>
      <Select.Content
        position={position}
        sideOffset={6}
        className={cn(
          CLASE_FLOTANTE,
          'max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) overflow-hidden',
          className,
        )}
        {...props}
      >
        <Select.Viewport className="p-1">{children}</Select.Viewport>
      </Select.Content>
    </Select.Portal>
  );
}

export function SelectorOpcion({
  className,
  children,
  ...props
}: ComponentProps<typeof Select.Item>) {
  return (
    <Select.Item className={cn(CLASE_ELEMENTO_MENU, 'pr-8', className)} {...props}>
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute right-2.5 flex text-acento">
        <IconoCheck tamano={14} />
      </Select.ItemIndicator>
    </Select.Item>
  );
}

export function SelectorEtiqueta({ className, ...props }: ComponentProps<typeof Select.Label>) {
  return (
    <Select.Label
      className={cn('px-2.5 pt-2 pb-1 text-etiqueta text-texto-3', className)}
      {...props}
    />
  );
}

export function SelectorSeparador({
  className,
  ...props
}: ComponentProps<typeof Select.Separator>) {
  return <Select.Separator className={cn('mx-1 my-1 h-px bg-linea', className)} {...props} />;
}
