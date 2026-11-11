import { cn } from '../lib/cn';
import { RESORTE_INDICADOR } from '../lib/movimiento';
import { motion } from 'motion/react';
import { Tabs } from 'radix-ui';
import { type ComponentProps, createContext, type ReactNode, use, useId, useState } from 'react';

/*
 * Pestañas con indicador que se desliza (layoutId, resorte 420/36).
 * Dos aspectos: "linea" (subrayado de 2 px bajo la pestaña activa) y "pildora" (fondo elevado).
 */

interface ContextoPestanas {
  valor: string | undefined;
  grupo: string;
  aspecto: 'linea' | 'pildora';
}
const Contexto = createContext<ContextoPestanas | null>(null);

export interface PropsPestanas
  extends Omit<ComponentProps<typeof Tabs.Root>, 'value' | 'onValueChange' | 'defaultValue'> {
  valor?: string;
  valorInicial?: string;
  onCambio?: (valor: string) => void;
  aspecto?: 'linea' | 'pildora';
}

export function Pestanas({
  valor,
  valorInicial,
  onCambio,
  aspecto = 'linea',
  children,
  ...props
}: PropsPestanas) {
  const [interno, setInterno] = useState(valorInicial);
  const actual = valor ?? interno;
  const grupo = useId();
  return (
    <Contexto value={{ valor: actual, grupo, aspecto }}>
      <Tabs.Root
        value={actual}
        onValueChange={(v) => {
          setInterno(v);
          onCambio?.(v);
        }}
        {...props}
      >
        {children}
      </Tabs.Root>
    </Contexto>
  );
}

export function PestanasLista({ className, ...props }: ComponentProps<typeof Tabs.List>) {
  const ctx = use(Contexto);
  return (
    <Tabs.List
      className={cn(
        'relative flex items-center',
        ctx?.aspecto === 'pildora'
          ? 'h-control gap-0.5 rounded-control border border-linea-fuerte bg-campo p-0.5'
          : 'h-10 gap-5 border-b border-linea',
        className,
      )}
      {...props}
    />
  );
}

export function Pestana({
  value,
  className,
  children,
  cuenta,
  ...props
}: ComponentProps<typeof Tabs.Trigger> & { cuenta?: ReactNode }) {
  const ctx = use(Contexto);
  const activa = ctx?.valor === value;
  const pildora = ctx?.aspecto === 'pildora';
  return (
    <Tabs.Trigger
      value={value}
      className={cn(
        'relative inline-flex h-full items-center gap-2 font-medium whitespace-nowrap text-texto-2',
        'transition-colors duration-(--t-hover) hover:text-texto-1 data-[state=active]:text-texto-1',
        'disabled:pointer-events-none disabled:opacity-45',
        'focus-visible:outline-offset-0',
        pildora ? 'rounded-elemento px-3' : 'px-0.5',
        className,
      )}
      {...props}
    >
      {activa && ctx ? (
        <motion.span
          layoutId={`pestana-${ctx.grupo}`}
          transition={RESORTE_INDICADOR}
          aria-hidden
          className={cn(
            'absolute',
            pildora
              ? 'inset-0 rounded-elemento border border-linea-fuerte bg-pulgar shadow-control'
              : '-bottom-px left-0 right-0 h-0.5 rounded-pildora bg-acento',
          )}
        />
      ) : null}
      <span className="relative inline-flex items-center gap-2">
        {children}
        {cuenta !== undefined ? (
          <span className="cifras rounded-pildora bg-lavado-2 px-1.5 text-mini leading-4 text-texto-3">
            {cuenta}
          </span>
        ) : null}
      </span>
    </Tabs.Trigger>
  );
}

export function PestanaContenido({ className, ...props }: ComponentProps<typeof Tabs.Content>) {
  return <Tabs.Content className={cn('outline-none', className)} {...props} />;
}
