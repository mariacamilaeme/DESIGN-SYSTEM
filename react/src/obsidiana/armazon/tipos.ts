import type { ReactNode } from 'react';
import type { ComponenteIcono } from '../iconos';

/*
 * Tipos de configuración del armazón. Una herramienta nueva describe su marca, su navegación,
 * sus contadores, su pie y sus comandos con estos tipos y se los pasa a <Armazon>; ningún
 * componente del armazón sabe nada del dominio.
 */

/** Marca de la barra lateral: versión completa (desplegada) y solo símbolo (plegada). */
export interface MarcaArmazon {
  /** Nombre de la herramienta: miga de pan, nombre accesible del enlace de la marca. */
  nombre: string;
  /** Marca completa (símbolo y nombre), unos 26 px de alto. */
  completa: ReactNode;
  /** Solo el símbolo, para la barra plegada (64 px). */
  simbolo: ReactNode;
  /** Destino del enlace de la marca y de la raíz de la miga. Por defecto, '/'. */
  ruta?: string;
}

export interface DestinoNavegacion {
  /** Ruta del destino. '/' solo se activa con la ruta exacta; el resto, también con subrutas. */
  ruta: string;
  nombre: string;
  icono: ComponenteIcono;
  /** Palabras adicionales para encontrarlo en la paleta. */
  claves?: string;
}

export interface GrupoNavegacion {
  /** Etiqueta pequeña del grupo ("Operación", "Análisis"). */
  nombre: string;
  destinos: readonly DestinoNavegacion[];
}

/**
 * Contador discreto junto a un destino de la barra lateral. Con la barra plegada se ve como cifra
 * pequeña bajo el icono y la pista lo dice completo ("Pedidos 23 pedidos abiertos").
 */
export interface ContadorNav {
  n: number;
  /** Texto accesible en plural: "pedidos abiertos". */
  descripcion: string;
  /** En singular, para un contador en 1: "pedido abierto". */
  descripcionUno?: string;
}

/** Línea de estado del pie de la barra lateral ("Datos de ejemplo · Solo en memoria"). */
export interface EstadoPie {
  icono: ComponenteIcono;
  titulo: string;
  detalle?: string;
}

/** Acción del pie de la barra lateral (cerrar sesión, salir, restablecer). */
export interface AccionPie {
  id: string;
  etiqueta: string;
  icono: ComponenteIcono;
  alSeleccionar: () => void;
}

/** Elemento elegible en la paleta de comandos. */
export interface ElementoPaleta {
  id: string;
  titulo: string;
  subtitulo?: string;
  /** Texto adicional por el que se puede encontrar (código, cliente, sinónimos). */
  claves?: string;
  icono?: ComponenteIcono;
  /** Ruta a la que navega al elegirlo. */
  ir?: string;
  /** Acción al elegirlo (si no navega). */
  accion?: () => void;
  /** Atajo que se muestra a la derecha, por ejemplo ['Ctrl', 'B']. */
  atajo?: readonly string[];
}

/**
 * Datos buscables en la paleta (pedidos, clientes…). Solo aparecen cuando hay un término; cada
 * grupo muestra como mucho 8 resultados y, si hay más, «Ver las N coincidencias» lleva a la lista.
 * Pasa siempre el mismo arreglo mientras los datos no cambien: la paleta normaliza sus textos una
 * vez por arreglo (caché por identidad).
 */
export interface FuentePaleta {
  id: string;
  /** Título del grupo ("Pedidos", "Clientes"). */
  grupo: string;
  elementos: readonly ElementoPaleta[];
  /** Ruta de la lista completa con esa búsqueda, para «Ver las N coincidencias». */
  verTodos?: (busqueda: string) => string;
}
