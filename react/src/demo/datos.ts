import { ESTADOS_EJEMPLO, type EstadoEjemplo } from '../obsidiana';

/*
 * Datos FICTICIOS de la demo. Ningún nombre, número ni cifra corresponde a un pedido, cliente o
 * empresa real. Generador determinista: siempre las mismas filas en cada captura.
 */

export interface Pedido {
  id: string;
  numero: string;
  cliente: string;
  categoria: string;
  estado: EstadoEjemplo;
  unidades: number;
  importe: number;
  destino: string;
  /** Fecha prevista de entrega, aaaa-mm-dd. */
  entrega: string | null;
  /** Guía de transporte (solo en camino o entregado). */
  guia: string | null;
}

export const CLIENTES = [
  'Altamira Estudio',
  'Nordika Hogar',
  'Brisa Textil',
  'Cobalto Labs',
  'Duna Muebles',
  'Faro Digital',
  'Lumen Óptica',
  'Monte Verde Café',
  'Quanta Energía',
  'Sierra Alta Outdoor',
] as const;

export const CATEGORIAS = [
  'Mobiliario',
  'Iluminación',
  'Textil',
  'Electrónica',
  'Papelería',
  'Menaje',
] as const;

export const DESTINOS = ['Medellín', 'Bogotá', 'Cali', 'Barranquilla', 'Lima', 'Quito'] as const;

const ESTADOS: EstadoEjemplo[] = [
  'camino',
  'preparacion',
  'pendiente',
  'entregado',
  'camino',
  'cancelado',
  'preparacion',
  'entregado',
];

function aleatorio(semilla: number) {
  let s = semilla;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const dos = (n: number) => String(n).padStart(2, '0');

function generar(cantidad: number): Pedido[] {
  const r = aleatorio(11);
  return Array.from({ length: cantidad }, (_, i) => {
    const estado = ESTADOS[i % ESTADOS.length] ?? 'preparacion';
    const unidades = Math.round(4 + r() * 180);
    const mes = 9 + Math.floor(r() * 4);
    const dia = 1 + Math.floor(r() * 27);
    return {
      id: `p${i}`,
      numero: `PED-26${dos(mes)}-${String(101 + i).padStart(3, '0')}`,
      cliente: CLIENTES[(i * 7) % CLIENTES.length] ?? 'Cliente de ejemplo',
      categoria: CATEGORIAS[(i * 5) % CATEGORIAS.length] ?? 'Mobiliario',
      estado,
      unidades,
      importe: Math.round(unidades * (38 + r() * 160)),
      destino: DESTINOS[(i * 5 + 1) % DESTINOS.length] ?? 'Medellín',
      entrega: estado === 'pendiente' || i % 11 === 6 ? null : `2026-${dos(mes)}-${dos(dia)}`,
      guia: estado === 'camino' || estado === 'entregado' ? `GX${String(480120 + i * 13)}` : null,
    };
  });
}

/** 180 pedidos ficticios. */
export const PEDIDOS: readonly Pedido[] = generar(180);

export const OPCIONES_DESTINOS = DESTINOS.map((d) => ({ valor: d, etiqueta: d }));
export const OPCIONES_CATEGORIAS = CATEGORIAS.map((c) => ({ valor: c, etiqueta: c }));
export const OPCIONES_CLIENTES = CLIENTES.map((c, i) => ({
  valor: `c${i}`,
  etiqueta: c,
  meta: `${PEDIDOS.filter((p) => p.cliente === c).length} pedidos`,
}));

/** Pedidos que cuentan como abiertos (ni entregados ni cancelados). */
export const esAbierto = (p: Pedido) => p.estado !== 'entregado' && p.estado !== 'cancelado';

export const ETIQUETA_ESTADO = (e: EstadoEjemplo) => ESTADOS_EJEMPLO[e].etiqueta;

/** Pedidos por semana (últimas 12 semanas), para la gráfica del Panel. */
export const PEDIDOS_POR_SEMANA: readonly { semana: string; pedidos: number }[] = [
  { semana: '18 ago', pedidos: 22 },
  { semana: '25 ago', pedidos: 27 },
  { semana: '01 sep', pedidos: 24 },
  { semana: '08 sep', pedidos: 31 },
  { semana: '15 sep', pedidos: 29 },
  { semana: '22 sep', pedidos: 35 },
  { semana: '29 sep', pedidos: 33 },
  { semana: '06 oct', pedidos: 38 },
  { semana: '13 oct', pedidos: 36 },
  { semana: '20 oct', pedidos: 42 },
  { semana: '27 oct', pedidos: 40 },
  { semana: '03 nov', pedidos: 47 },
];
