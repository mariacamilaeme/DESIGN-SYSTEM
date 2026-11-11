import { IconoAlerta, IconoError, IconoExito, IconoInfo } from '../iconos';
import { Toaster, toast } from 'sonner';
import { Indicador } from './boton';

/*
 * Avisos (toasts) abajo a la derecha, con icono de estado. Para operaciones largas, usar
 * `aviso.promise(...)` o `aviso.loading(...)`, que muestran el indicador de progreso.
 *
 *   aviso.success('Respaldo descargado');
 *   aviso.error('No se pudo leer el archivo', { description: '...' });
 */
export const aviso = toast;

/**
 * El elemento está dentro de los avisos. Las ventanas modales lo usan para no cerrarse cuando se
 * pulsa un aviso (por ejemplo, su botón "Deshacer") con la ventana abierta.
 */
export function esDeAvisos(objetivo: EventTarget | null): boolean {
  return objetivo instanceof Element && objetivo.closest('[data-sonner-toaster]') !== null;
}

export function Avisos({ tema }: { tema: 'claro' | 'oscuro' }) {
  return (
    <Toaster
      theme={tema === 'claro' ? 'light' : 'dark'}
      position="bottom-right"
      offset={20}
      gap={8}
      visibleToasts={4}
      closeButton={false}
      icons={{
        success: <IconoExito tamano={16} className="text-verde-texto" />,
        error: <IconoError tamano={16} className="text-rojo-texto" />,
        warning: <IconoAlerta tamano={16} className="text-ambar-texto" />,
        info: <IconoInfo tamano={16} className="text-acento-texto" />,
        loading: <Indicador className="text-texto-2" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'flotante group flex w-(--width) items-start gap-3 rounded-interno px-4 py-3 text-cuerpo text-texto-1',
          title: 'font-medium text-texto-1',
          description: 'mt-0.5 text-etiqueta text-texto-2',
          icon: 'mt-0.5 flex size-4 shrink-0 items-center justify-center',
          content: 'flex min-w-0 flex-1 flex-col',
          actionButton:
            'ml-auto h-control-compacto shrink-0 rounded-control bg-acento-relleno px-2.5 text-etiqueta font-medium text-sobre-acento',
          cancelButton:
            'ml-auto h-control-compacto shrink-0 rounded-control px-2.5 text-etiqueta font-medium text-texto-2 hover:bg-lavado-2',
        },
      }}
    />
  );
}
