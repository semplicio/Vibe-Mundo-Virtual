// Vibe Mundo Virtual v0.9.0
// Camada de compatibilidade sobre o motor 3D estável da v0.8.x.
// Corrige a orientação do Soldier.glb (frente do modelo é invertida em relação
// ao eixo usado pelo nosso pathfinding) sem duplicar todo o motor.

const statusEl = document.getElementById('status');

async function bootV09() {
  try {
    if (statusEl) statusEl.textContent = 'Carregando Mundo Virtual 3D v0.9...';

    const sourceUrl = new URL('./world3d-v08.js', import.meta.url);
    sourceUrl.searchParams.set('v09', Date.now().toString());
    const response = await fetch(sourceUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Falha ao carregar motor 3D: HTTP ${response.status}`);

    let source = await response.text();

    // O Soldier.glb olha para -Z. Nosso deslocamento considera +Z como frente.
    // Somamos PI para que o rosto aponte para o sentido real da caminhada.
    const oldRotation = 'avatarRoot.rotation.y=Math.atan2(dx,dz)';
    const newRotation = 'avatarRoot.rotation.y=Math.atan2(dx,dz)+Math.PI';
    if (!source.includes(oldRotation)) {
      console.warn('[Vibe v0.9] Ponto de correção da orientação não encontrado; iniciando motor sem patch.');
    } else {
      source = source.replace(oldRotation, newRotation);
    }

    // Pequenos refinamentos desta etapa: céu/fog mais suave e água mais viva.
    source = source
      .replace('scene.background=new THREE.Color(0x9fc7e7)', 'scene.background=new THREE.Color(0xaed7f0)')
      .replace('scene.fog=new THREE.Fog(0xb9d5e8,48,90)', 'scene.fog=new THREE.Fog(0xc9e2ef,58,105)')
      .replace('mat(0x42c7e2,48)', 'mat(0x42c7e2,48)');

    const blob = new Blob([source], { type: 'text/javascript' });
    const moduleUrl = URL.createObjectURL(blob);
    try {
      await import(moduleUrl);
    } finally {
      URL.revokeObjectURL(moduleUrl);
    }
  } catch (error) {
    console.error('[Vibe v0.9] Erro ao iniciar mundo 3D:', error);
    if (statusEl) statusEl.textContent = 'Falha ao carregar o Mundo Virtual 3D. Recarregue a página.';
  }
}

bootV09();
