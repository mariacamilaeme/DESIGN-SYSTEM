import { MarcaObsidiana, SimboloObsidiana } from '../../Marca';
import { Tarjeta } from '../../../obsidiana';
import { Boton } from '../../../obsidiana';
import { CATALOGO_ICONOS, IconoActualizar } from '../../../obsidiana';
import { cn } from '../../../obsidiana';
import { useState } from 'react';
import { Seccion } from './Seccion';

/* Escala tipográfica, juego de iconos y logo. */

const ESCALA = [
  {
    rol: 'Título de página',
    clase: 'text-titulo',
    specs: '22 / 28 · 600 · −0,018em',
    texto: 'Pedidos',
  },
  {
    rol: 'Título de ventana',
    clase: 'text-titulo-ventana',
    specs: '17 / 24 · 600 · −0,012em',
    texto: 'Pedido PED-2611-114',
  },
  {
    rol: 'Título de tarjeta',
    clase: 'text-titulo-tarjeta',
    specs: '14 / 20 · 600 · −0,006em',
    texto: 'Entregas en curso',
  },
  {
    rol: 'Cifra principal',
    clase: 'text-cifra cifras',
    specs: '34 / 38 · 550 · −0,028em',
    texto: '3.284.120',
  },
  {
    rol: 'Cifra secundaria',
    clase: 'text-cifra-2 cifras',
    specs: '20 / 26 · 600 · −0,02em',
    texto: '26.151,0',
  },
  {
    rol: 'Texto',
    clase: 'text-cuerpo',
    specs: '13 / 20 · 400',
    texto: 'Importe pendiente según la fecha de entrega prevista.',
  },
  {
    rol: 'Texto destacado',
    clase: 'text-cuerpo font-medium',
    specs: '13 / 20 · 500',
    texto: 'Vence en 7 días',
  },
  {
    rol: 'Etiqueta',
    clase: 'text-etiqueta font-medium text-texto-2',
    specs: '12 / 16 · 500 · 0,002em',
    texto: 'Destino',
  },
  {
    rol: 'Etiqueta de columna',
    clase: 'text-columna font-medium text-texto-3',
    specs: '11,5 / 16 · 500 · 0,01em',
    texto: 'Unidades',
  },
  { rol: 'Código', clase: 'codigo', specs: '12,5 / 18 · Geist Mono 450', texto: 'GX480142' },
];

export function SeccionTipografia() {
  return (
    <Seccion
      id="tipografia"
      titulo="Tipografía"
      descripcion="Inter variable con eje óptico y los rasgos cv11 y ss03; numerales tabulares en cifras y tablas. Geist Mono para números de pedido, guías y códigos. Solo mayúscula inicial de oración."
    >
      <Tarjeta>
        {ESCALA.map((e) => (
          <div
            key={e.rol}
            className="grid grid-cols-[180px_minmax(0,1fr)_220px] items-baseline gap-6 border-b border-linea px-5 py-4 last:border-b-0"
          >
            <span className="text-etiqueta text-texto-3">{e.rol}</span>
            <span className={cn('truncate text-texto-1', e.clase)}>{e.texto}</span>
            <span className="cifras text-right text-etiqueta text-texto-3">{e.specs}</span>
          </div>
        ))}
        <div className="grid grid-cols-[180px_minmax(0,1fr)_220px] items-baseline gap-6 px-5 py-4">
          <span className="text-etiqueta text-texto-3">Cifra con unidad</span>
          <span className="cifras flex items-baseline gap-1.5 text-cifra text-texto-1">
            <span className="text-cuerpo font-medium tracking-normal text-texto-3">USD</span>
            715.340
          </span>
          <span className="text-right text-etiqueta text-texto-3">
            Unidad a 13 px en texto-3, por línea base
          </span>
        </div>
      </Tarjeta>
    </Seccion>
  );
}

export function SeccionIconos() {
  const [reproducir, setReproducir] = useState(0);
  const grupos = [...new Set(CATALOGO_ICONOS.map((i) => i.grupo))];
  return (
    <Seccion
      id="iconos"
      titulo="Iconos"
      descripcion="Retícula de 24 px, trazo de 1,5 px con extremos redondeados y relleno al 12 % en las formas cerradas. Pasa el cursor: los que tienen sentido se mueven (el documento se traza, la flecha de descarga cae)."
    >
      <Tarjeta className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-etiqueta text-texto-3">
            {CATALOGO_ICONOS.length} iconos · obsidiana/iconos
          </span>
          <Boton variante="secundario" tamano="sm" onClick={() => setReproducir((n) => n + 1)}>
            <IconoActualizar tamano={14} />
            Reproducir animaciones
          </Boton>
        </div>
        <div
          key={reproducir}
          className={cn('flex flex-col gap-5', reproducir > 0 && 'icono-reproducir')}
        >
          {grupos.map((g) => (
            <div key={g} className="flex flex-col gap-2">
              <span className="text-etiqueta font-medium text-texto-3">{g}</span>
              <div className="grid grid-cols-8 gap-2">
                {CATALOGO_ICONOS.filter((i) => i.grupo === g).map(({ icono: Icono }) => (
                  <div
                    key={Icono.nombreIcono}
                    className="icono-vivo flex h-20 flex-col items-center justify-center gap-2.5 rounded-interno border border-linea bg-sup-2 text-texto-2 transition-colors duration-(--t-hover) hover:border-linea-fuerte hover:text-texto-1"
                  >
                    <Icono tamano={20} />
                    <span className="text-mini text-texto-3">{Icono.nombreIcono}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Tarjeta>
    </Seccion>
  );
}

export function SeccionMarca() {
  return (
    <Seccion
      id="marca"
      titulo="Marca"
      descripcion="La marca de la demo es un ejemplo: sustitúyela por la de tu herramienta y pásala a <Armazon marca>. Lee --logo-tinta y --logo-acento; dentro de la barra lateral la tinta pasa a --lateral-logo-tinta, porque la barra es oscura en los dos temas."
    >
      <div className="grid grid-cols-4 gap-4">
        <Tarjeta className="flex h-36 flex-col items-center justify-center gap-4 text-texto-1">
          <MarcaObsidiana alto={34} />
          <span className="text-mini text-texto-3">Completa · tema actual</span>
        </Tarjeta>
        <div
          data-theme="claro"
          className="flex h-36 flex-col items-center justify-center gap-4 rounded-tarjeta border border-linea bg-sup-1 text-texto-1"
        >
          <MarcaObsidiana alto={34} />
          <span className="text-mini text-texto-3">Completa · fondo claro</span>
        </div>
        <div
          data-theme="oscuro"
          className="flex h-36 flex-col items-center justify-center gap-4 rounded-tarjeta border border-linea bg-sup-1 text-texto-1"
        >
          <MarcaObsidiana alto={34} />
          <span className="text-mini text-texto-3">Completa · fondo oscuro</span>
        </div>
        <Tarjeta className="flex h-36 flex-col items-center justify-center gap-4">
          <SimboloObsidiana alto={44} />
          <span className="text-mini text-texto-3">Símbolo (barra plegada)</span>
        </Tarjeta>
      </div>
    </Seccion>
  );
}
