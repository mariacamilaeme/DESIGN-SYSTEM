import '../estilos/base.css';

import { MotionConfig } from 'motion/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const raiz = document.getElementById('raiz');
if (!raiz) throw new Error('No se encontró el elemento #raiz');

createRoot(raiz).render(
  <StrictMode>
    {/* Movimiento reducido del sistema: Motion atenúa las animaciones de transform. */}
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
);
