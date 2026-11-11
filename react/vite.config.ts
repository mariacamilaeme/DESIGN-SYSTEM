import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/*
 * Vite para el kit Obsidiana. Lo único imprescindible en una herramienta nueva son los dos
 * plugins: React y Tailwind v4 (que lee los tokens de src/estilos/tokens.css). Sin alias: el kit
 * se importa con rutas relativas y se puede copiar a cualquier carpeta.
 *
 * Puerto propio (5391) para no chocar con otras herramientas abiertas; se cambia con
 * `npm run dev -- --port 5400`.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: '127.0.0.1', port: 5391, strictPort: true },
  preview: { host: '127.0.0.1', port: 5391 },
});
