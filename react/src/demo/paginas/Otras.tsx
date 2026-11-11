import {
  Boton,
  type ComponenteIcono,
  EncabezadoPagina,
  Enlace,
  EstadoVacio,
  Pagina,
  Tarjeta,
} from '../../obsidiana';

/** Página provisional de un módulo de la demo que todavía no tiene contenido. */
export function Provisional({
  titulo,
  descripcion,
  icono: Icono,
}: {
  titulo: string;
  descripcion: string;
  icono: ComponenteIcono;
}) {
  return (
    <Pagina>
      <EncabezadoPagina titulo={titulo} subtitulo={descripcion} />
      <Tarjeta className="flex min-h-80 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <span className="grid size-11 place-items-center rounded-interno border border-linea bg-sup-2 text-texto-2 shadow-tarjeta">
          <Icono tamano={20} />
        </span>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-texto-1">Esta sección está vacía en la demo</p>
          <p className="text-texto-3">Úsala como punto de partida para un módulo nuevo.</p>
        </div>
      </Tarjeta>
    </Pagina>
  );
}

export function NoEncontrada() {
  return (
    <Pagina>
      <EstadoVacio
        dibujo="busqueda"
        titulo="Esta vista no existe"
        descripcion="La dirección no corresponde a ninguna sección de la herramienta."
        accion={
          <Boton asChild variante="secundario">
            <Enlace ruta="/">Ir al Panel</Enlace>
          </Boton>
        }
      />
    </Pagina>
  );
}
