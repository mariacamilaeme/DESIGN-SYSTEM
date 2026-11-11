import { IconoCheck, IconoChevronDerecha } from '../iconos';
import { CLASE_ELEMENTO_MENU, CLASE_FLOTANTE } from '../lib/clases';
import { cn } from '../lib/cn';
import { DropdownMenu } from 'radix-ui';
import type { ComponentProps, ReactNode } from 'react';

/* Menú desplegable sobre Radix DropdownMenu. */

export const Menu = DropdownMenu.Root;
export const MenuDisparador = DropdownMenu.Trigger;
export const MenuGrupo = DropdownMenu.Group;
export const MenuSub = DropdownMenu.Sub;
export const MenuGrupoRadio = DropdownMenu.RadioGroup;

export function MenuContenido({
  className,
  sideOffset = 6,
  align = 'start',
  ...props
}: ComponentProps<typeof DropdownMenu.Content>) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        sideOffset={sideOffset}
        align={align}
        collisionPadding={12}
        className={cn(CLASE_FLOTANTE, 'min-w-52 p-1', className)}
        {...props}
      />
    </DropdownMenu.Portal>
  );
}

export interface PropsMenuElemento extends ComponentProps<typeof DropdownMenu.Item> {
  icono?: ReactNode;
  /** Texto atenuado a la derecha: atajo o dato. */
  meta?: ReactNode;
  /** Descripción en una segunda línea. */
  descripcion?: ReactNode;
  peligro?: boolean;
}

export function MenuElemento({
  className,
  icono,
  meta,
  descripcion,
  peligro,
  children,
  ...props
}: PropsMenuElemento) {
  return (
    <DropdownMenu.Item
      className={cn(
        CLASE_ELEMENTO_MENU,
        descripcion && 'h-auto items-start py-2 [&>svg]:mt-0.5',
        peligro && 'text-rojo-texto [&>svg]:text-rojo-texto data-highlighted:bg-rojo/10',
        className,
      )}
      {...props}
    >
      {icono}
      {descripcion ? (
        <span className="flex min-w-0 flex-col">
          <span>{children}</span>
          <span className="text-etiqueta text-texto-3">{descripcion}</span>
        </span>
      ) : (
        <span className="min-w-0 truncate">{children}</span>
      )}
      {meta ? <span className="ml-auto pl-4 text-etiqueta text-texto-3">{meta}</span> : null}
    </DropdownMenu.Item>
  );
}

export function MenuCasilla({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownMenu.CheckboxItem>) {
  return (
    <DropdownMenu.CheckboxItem className={cn(CLASE_ELEMENTO_MENU, 'pr-8', className)} {...props}>
      {children}
      <DropdownMenu.ItemIndicator className="absolute right-2.5 flex text-acento">
        <IconoCheck tamano={14} />
      </DropdownMenu.ItemIndicator>
    </DropdownMenu.CheckboxItem>
  );
}

export function MenuRadio({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownMenu.RadioItem>) {
  return (
    <DropdownMenu.RadioItem className={cn(CLASE_ELEMENTO_MENU, 'pr-8', className)} {...props}>
      {children}
      <DropdownMenu.ItemIndicator className="absolute right-2.5 flex text-acento">
        <IconoCheck tamano={14} />
      </DropdownMenu.ItemIndicator>
    </DropdownMenu.RadioItem>
  );
}

export function MenuSubDisparador({
  className,
  children,
  icono,
  ...props
}: ComponentProps<typeof DropdownMenu.SubTrigger> & { icono?: ReactNode }) {
  return (
    <DropdownMenu.SubTrigger
      className={cn(CLASE_ELEMENTO_MENU, 'data-[state=open]:bg-lavado-2', className)}
      {...props}
    >
      {icono}
      <span className="min-w-0 truncate">{children}</span>
      <IconoChevronDerecha tamano={14} className="ml-auto" />
    </DropdownMenu.SubTrigger>
  );
}

export function MenuSubContenido({
  className,
  ...props
}: ComponentProps<typeof DropdownMenu.SubContent>) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.SubContent
        sideOffset={6}
        className={cn(CLASE_FLOTANTE, 'min-w-44 p-1', className)}
        {...props}
      />
    </DropdownMenu.Portal>
  );
}

export function MenuEtiqueta({ className, ...props }: ComponentProps<typeof DropdownMenu.Label>) {
  return (
    <DropdownMenu.Label
      className={cn('px-2.5 pt-2 pb-1 text-etiqueta text-texto-3', className)}
      {...props}
    />
  );
}

export function MenuSeparador({
  className,
  ...props
}: ComponentProps<typeof DropdownMenu.Separator>) {
  return <DropdownMenu.Separator className={cn('mx-1 my-1 h-px bg-linea', className)} {...props} />;
}
