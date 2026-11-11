import { cn } from '../obsidiana';

/*
 * Marca de la demo: un fragmento de obsidiana (cristal facetado) con un único canto encendido.
 * La luz es el material: la forma es tinta tenue y solo una arista lleva el acento.
 * Lee --logo-tinta (en la barra lateral, --lateral-logo-tinta) y el acento del contexto.
 * Para tu herramienta, sustituye este archivo por tu logo y pásalo a <Armazon marca>.
 */

export function SimboloObsidiana({
  alto = 24,
  className,
  titulo,
}: {
  alto?: number;
  className?: string;
  /** Nombre accesible; sin él, el símbolo es decorativo. */
  titulo?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={alto}
      height={alto}
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
      role={titulo ? 'img' : undefined}
      aria-hidden={titulo ? undefined : true}
      aria-label={titulo}
      className={cn('flex-none', className)}
    >
      {/* Cuerpo del cristal */}
      <path
        d="M12 2.25 19.75 7.5 18.25 18.5 12 21.75 5.25 16.75 4.25 7.25Z"
        fill="var(--logo-tinta)"
        fillOpacity={0.1}
        stroke="var(--logo-tinta)"
        strokeWidth={1.5}
      />
      {/* Cara iluminada */}
      <path d="M12 2.25 19.75 7.5 10.75 12Z" fill="var(--logo-acento)" fillOpacity={0.22} />
      {/* Facetas interiores */}
      <path
        d="M4.25 7.25 10.75 12 12 21.75M10.75 12 18.25 18.5"
        stroke="var(--logo-tinta)"
        strokeOpacity={0.55}
        strokeWidth={1.25}
      />
      {/* El canto encendido */}
      <path d="M12 2.25 19.75 7.5" stroke="var(--logo-acento)" strokeWidth={1.75} />
    </svg>
  );
}

export function MarcaObsidiana({ alto = 26, className }: { alto?: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)} style={{ height: alto }}>
      <SimboloObsidiana alto={Math.round(alto * 0.92)} />
      <span className="text-paleta leading-none font-semibold text-current">
        Obsidiana
      </span>
    </span>
  );
}
