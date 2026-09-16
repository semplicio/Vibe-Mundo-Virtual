import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

/* Camada visual independente. O motor principal continua em world3d.js.
   Esta camada adiciona profundidade visual ao HUD e feedback de carregamento,
   e prepara o projeto para assets GLB/GLTF nas próximas versões. */
const host = document.getElementById('world3d');
const viewport = document.getElementById('scene');
if (host && viewport) {
  viewport.classList.add('visual-v07');

  const badge = document.createElement('div');
  badge.className = 'render-badge';
  badge.innerHTML = '<span></span><b>3D</b><small>Praça Central</small>';
  viewport.appendChild(badge);

  const reticle = document.createElement('div');
  reticle.className = 'world-reticle';
  reticle.innerHTML = '<i></i><i></i>';
  viewport.appendChild(reticle);

  host.addEventListener('pointermove', e => {
    const r = host.getBoundingClientRect();
    reticle.style.left = `${e.clientX-r.left}px`;
    reticle.style.top = `${e.clientY-r.top}px`;
  });
  host.addEventListener('pointerleave', () => reticle.classList.remove('show'));
  host.addEventListener('pointerenter', () => reticle.classList.add('show'));
  host.addEventListener('pointerdown', () => {
    reticle.classList.remove('ping'); void reticle.offsetWidth; reticle.classList.add('ping');
  });

  // Detecta WebGL e informa de forma clara se o navegador estiver sem aceleração.
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) {
      const warning = document.createElement('div');
      warning.className = 'webgl-warning';
      warning.textContent = 'A aceleração WebGL está desativada neste navegador. Ative a aceleração de hardware para visualizar o Mundo Virtual em 3D.';
      viewport.appendChild(warning);
    }
  } catch (_) {}
}
