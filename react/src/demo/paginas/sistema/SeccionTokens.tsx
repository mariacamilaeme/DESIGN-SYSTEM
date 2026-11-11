import { Tarjeta } from '../../../obsidiana';
import { useEffect, useRef, useState } from 'react';
import { Seccion } from './Seccion';

/* Tokens de color de los dos temas, lado a lado, y escalas de forma, sombra y espacio. */

const GRUPOS: { nombre: string; tokens: string[] }[] = [
  { nombre: 'Superficies', tokens: ['lienzo', 'sup-1', 'sup-2', 'sup-3', 'campo', 'pulgar'] },
  { nombre: 'Líneas', tokens: ['linea', 'linea-fuerte', 'linea-hover', 'realce'] },
  { nombre: 'Texto', tokens: ['texto-1', 'texto-2', 'texto-3', 'texto-4'] },
  { nombre: 'Acento', tokens: ['acento', 'acento-fuerte', 'acento-suave', 'acento-relleno'] },
  { nombre: 'Estado', tokens: ['vivo', 'ambar', 'rojo', 'verde', 'gris-estado'] },
  {
    nombre: 'Barra lateral',
    tokens: [
      'lateral',
      'lateral-texto-1',
      'lateral-texto-2',
      'lateral-texto-3',
      'lateral-activo',
      'lateral-acento',
    ],
  },
];

function PanelTema({ tema }: { tema: 'oscuro' | 'claro' }) {
  const ref = useRef<HTMLDivElement>(null);
  const [valores, setValores] = useState<Record<string, string>>({});
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const estilo = getComputedStyle(el);
    const v: Record<string, string> = {};
    for (const g of GRUPOS)
      for (const t of g.tokens) v[t] = estilo.getPropertyValue(`--${t}`).trim();
    setValores(v);
  }, []);
  return (
    <div
      ref={ref}
      data-theme={tema}
      className="lienzo-luz flex flex-col gap-5 rounded-tarjeta border border-linea bg-lienzo p-5 text-texto-1"
    >
      <div className="flex items-center justify-between">
        <span className="text-titulo-tarjeta">
          {tema === 'oscuro' ? 'Tema oscuro' : 'Tema claro'}
        </span>
        <span className="codigo text-texto-3">data-theme="{tema}"</span>
      </div>
      {GRUPOS.map((g) => (
        <div key={g.nombre} className="flex flex-col gap-2">
          <span className="text-etiqueta font-medium text-texto-3">{g.nombre}</span>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {g.tokens.map((t) => (
              <div key={t} className="flex min-w-0 items-center gap-2.5">
                <span
                  className="size-7 flex-none rounded-control border border-linea-fuerte"
                  style={{ background: `var(--${t})` }}
                />
                <div className="flex min-w-0 flex-col">
                  <span className="codigo truncate text-texto-1">--{t}</span>
                  <span className="truncate font-mono text-mini text-texto-3">
                    {valores[t] ?? ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SeccionTokens() {
  return (
    <Seccion
      id="tokens"
      titulo="Tokens"
      descripcion="Toda la interfaz lee estas variables de tokens.css. Cada panel reescribe los tokens con su propio data-theme, de modo que los dos temas se ven a la vez."
    >
      <div className="grid grid-cols-2 gap-4">
        <PanelTema tema="oscuro" />
        <PanelTema tema="claro" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <Tarjeta className="flex flex-col gap-4 p-5">
          <span className="text-titulo-tarjeta">Radios</span>
          <div className="flex items-end gap-4">
            {[
              ['elemento', '6'],
              ['control', '8'],
              ['interno', '12'],
              ['tarjeta', '14'],
              ['ventana', '18'],
            ].map(([n, v]) => (
              <div key={n} className="flex flex-col items-center gap-2">
                <span
                  className="size-12 border border-linea-fuerte bg-sup-2"
                  style={{ borderRadius: `var(--r-${n})` }}
                />
                <span className="text-mini text-texto-3">
                  {n} · {v}
                </span>
              </div>
            ))}
          </div>
        </Tarjeta>
        <Tarjeta className="flex flex-col gap-4 p-5">
          <span className="text-titulo-tarjeta">Superficies y sombras</span>
          <div className="grid grid-cols-3 gap-3">
            <div className="superficie grid h-16 place-items-center text-mini text-texto-3">
              Tarjeta
            </div>
            <div className="superficie-2 grid h-16 place-items-center text-mini text-texto-3">
              Interno
            </div>
            <div className="flotante grid h-16 place-items-center rounded-interno text-mini text-texto-3">
              Flotante
            </div>
          </div>
        </Tarjeta>
        <Tarjeta className="flex flex-col gap-4 p-5">
          <span className="text-titulo-tarjeta">Retícula de 4 px</span>
          <div className="flex items-end gap-2.5">
            {[1, 2, 3, 4, 6, 8].map((n) => (
              <div key={n} className="flex flex-col items-center gap-2">
                <span
                  className="w-3 rounded-mini bg-acento/40"
                  style={{ height: `calc(var(--spacing) * ${n})` }}
                />
                <span className="cifras text-mini text-texto-3">{n * 4}</span>
              </div>
            ))}
          </div>
        </Tarjeta>
      </div>
    </Seccion>
  );
}
