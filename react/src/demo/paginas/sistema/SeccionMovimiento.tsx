import { Cifra } from '../../../obsidiana';
import { LineaRuta } from '../../../obsidiana';
import { ESTADOS_EJEMPLO, PildoraEstado } from '../../../obsidiana';
import { Tarjeta } from '../../../obsidiana';
import { Boton, type EstadoAccion } from '../../../obsidiana';
import { Segmentado } from '../../../obsidiana';
import { IconoActualizar, IconoDescargar, IconoDocumento, IconoSol } from '../../../obsidiana';
import { cn } from '../../../obsidiana';
import { CURVA, retrasoEscalonado, TRANSICION_VISTA } from '../../../obsidiana';
import { motion } from 'motion/react';
import { type ReactNode, useState } from 'react';
import { Seccion } from './Seccion';

/* Cada animación de firma, con un botón para repetirla. */

function Demo({
  titulo,
  specs,
  onRepetir,
  children,
}: {
  titulo: string;
  specs: string;
  onRepetir?: () => void;
  children: ReactNode;
}) {
  return (
    <Tarjeta className="flex flex-col">
      <div className="flex items-start gap-3 border-b border-linea px-4.5 py-3.5">
        <div className="flex min-w-0 flex-col">
          <span className="text-titulo-tarjeta text-texto-1">{titulo}</span>
          <span className="text-etiqueta text-texto-3">{specs}</span>
        </div>
        {onRepetir ? (
          <Boton variante="fantasma" tamano="sm" className="ml-auto" onClick={onRepetir}>
            <IconoActualizar tamano={14} />
            Repetir
          </Boton>
        ) : null}
      </div>
      <div className="flex min-h-36 flex-1 items-center justify-center p-5">{children}</div>
    </Tarjeta>
  );
}

export function SeccionMovimiento() {
  const [vista, setVista] = useState(0);
  const [segmento, setSegmento] = useState<'a' | 'b' | 'c'>('a');
  const [lista, setLista] = useState(0);
  const [cifra, setCifra] = useState(3284120);
  const [ruta, setRuta] = useState(0);
  const [iconos, setIconos] = useState(0);
  const [guardar, setGuardar] = useState<EstadoAccion>('reposo');

  const repetirGuardar = () => {
    setGuardar('cargando');
    setTimeout(() => setGuardar('listo'), 1100);
    setTimeout(() => setGuardar('reposo'), 2600);
  };

  const ciclar = () => {
    const orden = ['a', 'b', 'c'] as const;
    setSegmento((s) => orden[(orden.indexOf(s) + 1) % 3] ?? 'a');
  };

  return (
    <Seccion
      id="movimiento"
      titulo="Movimiento"
      descripcion="Cada animación responde a una acción y muestra qué cambió. Solo transform, opacidad y trazos SVG; curva cubic-bezier(0.16, 1, 0.3, 1); sin sobreimpulso; con movimiento reducido se atenúa."
    >
      <div className="grid grid-cols-3 gap-4">
        <Demo
          titulo="Cambio de vista"
          specs="Fundido con 6 px · 180 ms"
          onRepetir={() => setVista((n) => n + 1)}
        >
          <motion.div
            key={vista}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={TRANSICION_VISTA}
            className="w-full rounded-interno border border-linea bg-sup-2 p-4"
          >
            <div className="text-titulo-tarjeta">Pedidos</div>
            <div className="mt-1 text-etiqueta text-texto-3">6 entregas en curso</div>
          </motion.div>
        </Demo>

        <Demo
          titulo="Indicador que se desliza"
          specs="layoutId · resorte 420 / 36"
          onRepetir={ciclar}
        >
          <Segmentado
            aria-label="Demostración"
            valor={segmento}
            onCambio={setSegmento}
            opciones={[
              { valor: 'a', etiqueta: 'Activos' },
              { valor: 'b', etiqueta: 'Inactivos' },
              { valor: 'c', etiqueta: 'Todos' },
            ]}
          />
        </Demo>

        <Demo
          titulo="Entrada de listas"
          specs="Escalonado de 24 ms · máximo 8"
          onRepetir={() => setLista((n) => n + 1)}
        >
          <div key={lista} className="flex w-full flex-col gap-1.5">
            {['PED-2611-114', 'PED-2611-115', 'PED-2611-116', 'PED-2611-117'].map((n, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: CURVA, delay: retrasoEscalonado(i) }}
                className="flex h-8 items-center gap-2.5 rounded-control border border-linea bg-sup-2 px-3"
              >
                <span className="codigo">{n}</span>
                <span className="ml-auto">
                  <PildoraEstado estado={ESTADOS_EJEMPLO.camino} />
                </span>
              </motion.div>
            ))}
          </div>
        </Demo>

        <Demo
          titulo="Cifras"
          specs="NumberFlow · 600 ms al entrar y al cambiar"
          onRepetir={() => setCifra((c) => (c === 3284120 ? 3412875 : 3284120))}
        >
          <Cifra
            className="w-60"
            etiqueta="Por cobrar"
            valor={cifra}
            prefijo="USD"
            contexto="8 clientes"
          />
        </Demo>

        <Demo
          titulo="Rutas"
          specs="pathLength 0 → 1 en 900 ms · luz que viaja una vez"
          onRepetir={() => setRuta((n) => n + 1)}
        >
          <LineaRuta
            className="w-full"
            progreso={0.68}
            estado="curso"
            claveAnimacion={ruta}
            origen={<span className="font-medium text-texto-1">Almacén central</span>}
            destino={<span className="font-medium text-texto-1">Lima</span>}
          />
        </Demo>

        <Demo
          titulo="Guardar"
          specs="Reposo → progreso → confirmado, sin cambiar de tamaño"
          onRepetir={repetirGuardar}
        >
          <Boton
            variante="primario"
            estado={guardar}
            textoListo="Guardado"
            onClick={repetirGuardar}
          >
            Guardar cambios
          </Boton>
        </Demo>

        <Demo
          titulo="Iconos al pasar el cursor"
          specs="120 a 700 ms · una vez"
          onRepetir={() => setIconos((n) => n + 1)}
        >
          <div
            key={iconos}
            className={cn('flex gap-3 text-texto-2', iconos > 0 && 'icono-reproducir')}
          >
            {[IconoDescargar, IconoDocumento, IconoSol].map((Icono) => (
              <span
                key={Icono.nombreIcono}
                className="icono-vivo grid size-12 place-items-center rounded-interno border border-linea bg-sup-2"
              >
                <Icono tamano={20} />
              </span>
            ))}
          </div>
        </Demo>

        <Demo
          titulo="Ventanas y menús"
          specs="Ventana 0,98 → 1 en 220 ms · menús 0,97 → 1 en 140 ms"
          onRepetir={() => setVista((n) => n + 1)}
        >
          <motion.div
            key={`v${vista}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.22, ease: CURVA }}
            className="flotante w-full rounded-ventana p-4"
          >
            <div className="text-titulo-tarjeta">Pedido PED-2611-114</div>
            <div className="mt-1 text-etiqueta text-texto-3">
              La ventana nace de la fila pulsada
            </div>
          </motion.div>
        </Demo>

        <Demo titulo="En curso" specs="Único bucle permitido · 2,4 s · opacidad 0,5 → 1">
          <div className="flex items-center gap-3">
            <span className="relative grid size-6 place-items-center">
              <span className="pulso-vivo absolute inset-0 rounded-pildora bg-vivo/20" />
              <span className="size-2 rounded-pildora bg-vivo" />
            </span>
            <span className="text-texto-2">En camino · 62 % del recorrido</span>
          </div>
        </Demo>
      </div>
    </Seccion>
  );
}
