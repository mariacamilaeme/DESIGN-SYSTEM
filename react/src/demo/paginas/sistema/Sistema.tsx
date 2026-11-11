import { EncabezadoPagina, Insignia, Pagina } from '../../../obsidiana';
import { SeccionComponentes } from './SeccionComponentes';
import { SeccionMovimiento } from './SeccionMovimiento';
import { SeccionPrimitivas } from './SeccionPrimitivas';
import { SeccionIconos, SeccionMarca, SeccionTipografia } from './SeccionTipografiaIconos';
import { SeccionTokens } from './SeccionTokens';

/*
 * Sistema: el sistema de diseño Obsidiana en una página (tokens de los dos temas, tipografía,
 * iconos, marca, primitivas, componentes y movimiento). Es el banco de pruebas visual del kit.
 */

const INDICE = [
  { id: 'tokens', nombre: 'Tokens' },
  { id: 'tipografia', nombre: 'Tipografía' },
  { id: 'iconos', nombre: 'Iconos' },
  { id: 'marca', nombre: 'Marca' },
  { id: 'primitivas', nombre: 'Primitivas' },
  { id: 'componentes', nombre: 'Componentes' },
  { id: 'movimiento', nombre: 'Movimiento' },
];

export function Sistema() {
  return (
    <Pagina>
      <EncabezadoPagina
        titulo="Sistema de diseño"
        subtitulo="Obsidiana: tokens, tipografía, iconos, componentes y movimiento del kit."
        acciones={<Insignia tono="borde">src/obsidiana</Insignia>}
      />
      <nav
        aria-label="Secciones"
        className="sticky top-0 z-10 -mx-8 mb-8 flex items-center gap-1 border-b border-linea bg-lienzo px-7 py-2"
      >
        {INDICE.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            // El hash es la ruta de la demo: el índice desplaza sin cambiar la dirección.
            onClick={(e) => {
              e.preventDefault();
              const destino = document.getElementById(s.id);
              destino?.scrollIntoView({ block: 'start' });
              destino?.focus({ preventScroll: true });
            }}
            className="rounded-control px-2.5 py-1 font-medium text-texto-2 transition-colors duration-(--t-hover) hover:bg-lavado-2 hover:text-texto-1"
          >
            {s.nombre}
          </a>
        ))}
      </nav>
      <div className="flex flex-col gap-14">
        <SeccionTokens />
        <SeccionTipografia />
        <SeccionIconos />
        <SeccionMarca />
        <SeccionPrimitivas />
        <SeccionComponentes />
        <SeccionMovimiento />
      </div>
    </Pagina>
  );
}
