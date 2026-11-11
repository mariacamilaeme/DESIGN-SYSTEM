import { motion } from 'motion/react';
import { useId, useState } from 'react';
import {
  Cifra,
  CuerpoTarjeta,
  CURVA,
  EncabezadoPagina,
  EncabezadoTarjeta,
  Enlace,
  ESTADOS_EJEMPLO,
  fechaCorta,
  formatearNumero,
  GrupoCifras,
  IconoCartera,
  IconoCaja,
  IconoInventario,
  IconoReloj,
  LineaRuta,
  MicroLinea,
  Pagina,
  PildoraEstado,
  plural,
  retrasoEscalonado,
  Segmentado,
  Tarjeta,
} from '../../obsidiana';
import { esAbierto, PEDIDOS, PEDIDOS_POR_SEMANA } from '../datos';

/*
 * Panel de ejemplo: la cifra principal de 34 px (exclusiva del Panel), una gráfica mínima en SVG
 * con los tokens y una lista de entregas en curso con su línea de ruta.
 */

const abiertos = PEDIDOS.filter(esAbierto);
const enCamino = PEDIDOS.filter((p) => p.estado === 'camino');
const unidadesCamino = enCamino.reduce((n, p) => n + p.unidades, 0);
const facturado = PEDIDOS.filter((p) => p.estado === 'entregado').reduce((n, p) => n + p.importe, 0);
const porCobrar = abiertos.reduce((n, p) => n + p.importe, 0);

export function Panel() {
  return (
    <Pagina>
      <EncabezadoPagina
        titulo="Panel"
        subtitulo="Resumen de la operación con datos ficticios de la demo"
      />
      <div className="flex flex-col gap-4">
        <GrupoCifras etiqueta="Resumen">
          <Cifra
            etiqueta="Pedidos abiertos"
            icono={<IconoCaja tamano={16} />}
            valor={abiertos.length}
            contexto={`${formatearNumero(enCamino.length)} en camino, de ellos 1 con retraso`}
          />
          <Cifra
            etiqueta="Unidades en camino"
            icono={<IconoInventario tamano={16} />}
            valor={unidadesCamino}
            unidad="u."
            contexto={
              <>
                <span className="font-medium text-verde-texto">+412 u.</span> esta semana
              </>
            }
            grafica={<MicroLinea valores={[12, 14, 13, 17, 16, 19, 22, 21, 24, 26]} tono="vivo" />}
          />
          <Cifra
            etiqueta="Facturado"
            icono={<IconoCartera tamano={16} />}
            valor={facturado}
            prefijo="USD"
            contexto="Pedidos entregados"
          />
          <Cifra
            etiqueta="Por cobrar"
            icono={<IconoReloj tamano={16} />}
            valor={porCobrar}
            prefijo="USD"
            contexto={
              <>
                <span className="font-medium text-ambar-texto">18,4 %</span> vence este mes
              </>
            }
          />
        </GrupoCifras>

        <div className="grid grid-cols-3 gap-4">
          <GraficaSemanas />
          <EntregasEnCurso />
        </div>
      </div>
    </Pagina>
  );
}

/* ------------------------------------------------------------------ Gráfica de barras mínima */

const ANCHO = 640;
const ALTO = 300;
const MARGEN = { arriba: 12, derecha: 8, abajo: 26, izquierda: 32 };

function GraficaSemanas() {
  const [periodo, setPeriodo] = useState<'12' | '6'>('12');
  const [encima, setEncima] = useState<number | null>(null);
  const id = useId();
  const datos = periodo === '12' ? PEDIDOS_POR_SEMANA : PEDIDOS_POR_SEMANA.slice(-6);
  const max = Math.ceil(Math.max(...datos.map((d) => d.pedidos)) / 10) * 10;
  const ancho = ANCHO - MARGEN.izquierda - MARGEN.derecha;
  const alto = ALTO - MARGEN.arriba - MARGEN.abajo;
  const paso = ancho / datos.length;
  const anchoBarra = Math.min(28, paso * 0.56);
  const y = (v: number) => MARGEN.arriba + alto - (v / max) * alto;
  const marcas = [0, max / 2, max];
  const ultimo = datos.length - 1;
  const total = datos.reduce((n, d) => n + d.pedidos, 0);

  return (
    <Tarjeta className="col-span-2 flex flex-col">
      <EncabezadoTarjeta
        titulo="Pedidos por semana"
        meta={plural(total, 'pedido', 'pedidos')}
        acciones={
          <Segmentado
            aria-label="Periodo"
            tamano="sm"
            valor={periodo}
            onCambio={setPeriodo}
            opciones={[
              { valor: '6', etiqueta: '6 semanas' },
              { valor: '12', etiqueta: '12 semanas' },
            ]}
          />
        }
      />
      <CuerpoTarjeta className="pt-3">
        <svg
          viewBox={`0 0 ${ANCHO} ${ALTO}`}
          className="block h-auto w-full overflow-visible"
          role="img"
          aria-labelledby={`${id}-desc`}
        >
          <desc id={`${id}-desc`}>
            {`Pedidos por semana, de ${datos[0]?.semana} a ${datos[ultimo]?.semana}: ${datos
              .map((d) => `${d.semana}, ${d.pedidos}`)
              .join('; ')}.`}
          </desc>
          {/* Retícula recesiva: tres líneas y sus cifras */}
          {marcas.map((m) => (
            <g key={m}>
              <line
                x1={MARGEN.izquierda}
                x2={ANCHO - MARGEN.derecha}
                y1={y(m)}
                y2={y(m)}
                stroke="var(--linea)"
                strokeDasharray={m === 0 ? undefined : '2 4'}
              />
              <text
                x={MARGEN.izquierda - 10}
                y={y(m)}
                dy="0.32em"
                textAnchor="end"
                className="cifras fill-texto-3 text-mini"
              >
                {formatearNumero(m)}
              </text>
            </g>
          ))}
          {datos.map((d, i) => {
            const cx = MARGEN.izquierda + paso * i + paso / 2;
            const destacada = encima === null ? i === ultimo : encima === i;
            const altoBarra = Math.max(2, y(0) - y(d.pedidos));
            return (
              // Zona de hover más ancha que la barra (toda la columna).
              <g
                key={`${periodo}-${d.semana}`}
                onPointerEnter={() => setEncima(i)}
                onPointerLeave={() => setEncima(null)}
              >
                <rect
                  x={cx - paso / 2}
                  y={MARGEN.arriba}
                  width={paso}
                  height={alto}
                  fill="transparent"
                />
                <motion.path
                  // Barra con extremo de datos redondeado (4 px) y base recta sobre el eje.
                  d={barra(cx - anchoBarra / 2, y(0), anchoBarra, altoBarra, 4)}
                  fill="var(--acento)"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: destacada ? 1 : 0.38 }}
                  transition={{
                    scaleY: { duration: 0.5, ease: CURVA, delay: retrasoEscalonado(i) },
                    opacity: { duration: 0.12 },
                  }}
                  style={{ originY: 1, transformBox: 'fill-box' }}
                />
                {destacada ? (
                  <text
                    x={cx}
                    y={y(d.pedidos) - 8}
                    textAnchor="middle"
                    className="cifras fill-texto-1 text-etiqueta font-medium"
                  >
                    {d.pedidos}
                  </text>
                ) : null}
                <text
                  x={cx}
                  y={ALTO - 6}
                  textAnchor="middle"
                  className={destacada ? 'fill-texto-2 text-mini' : 'fill-texto-3 text-mini'}
                >
                  {d.semana}
                </text>
              </g>
            );
          })}
        </svg>
      </CuerpoTarjeta>
    </Tarjeta>
  );
}

/** Rectángulo con las esquinas superiores redondeadas y la base recta. */
function barra(x: number, base: number, ancho: number, alto: number, r: number) {
  const radio = Math.min(r, ancho / 2, alto);
  const arriba = base - alto;
  return [
    `M${x} ${base}`,
    `V${arriba + radio}`,
    `Q${x} ${arriba} ${x + radio} ${arriba}`,
    `H${x + ancho - radio}`,
    `Q${x + ancho} ${arriba} ${x + ancho} ${arriba + radio}`,
    `V${base}`,
    'Z',
  ].join(' ');
}

/* ------------------------------------------------------------------ Entregas en curso */

function EntregasEnCurso() {
  const lista = enCamino.slice(0, 3);
  return (
    <Tarjeta className="flex flex-col">
      <EncabezadoTarjeta titulo="Entregas en curso" meta={plural(enCamino.length, 'envío', 'envíos')} />
      <ul className="flex flex-1 flex-col">
        {lista.map((p, i) => (
          <li key={p.id} className="flex flex-col gap-2.5 border-b border-linea px-4.5 py-3.5 last:border-b-0">
            <div className="flex items-center gap-2">
              <span className="codigo text-texto-2">{p.numero}</span>
              <span className="truncate font-medium text-texto-1">{p.cliente}</span>
              {i === 0 ? (
                <PildoraEstado estado={ESTADOS_EJEMPLO.camino} pulso className="ml-auto" />
              ) : null}
            </div>
            <LineaRuta
              alto={30}
              progreso={0.35 + i * 0.2}
              estado={i === 2 ? 'tarde' : 'curso'}
              origen={<span className="text-texto-3">Almacén central</span>}
              destino={
                <span className={i === 2 ? 'text-ambar-texto' : 'text-texto-3'}>
                  {p.destino} · {i === 2 ? 'con retraso' : fechaCorta(p.entrega, true)}
                </span>
              }
            />
          </li>
        ))}
      </ul>
      <div className="border-t border-linea px-4.5 py-2.5">
        <Enlace
          ruta="/pedidos"
          className="rounded-elemento text-etiqueta font-medium text-acento-texto transition-colors duration-(--t-hover) hover:text-acento-fuerte"
        >
          Ver todos los pedidos
        </Enlace>
      </div>
    </Tarjeta>
  );
}
