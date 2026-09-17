// Vibe Mundo Virtual v0.23.0 — navegação imersiva, piso claro e praça limpa
import './world3d-v22.js';
import * as THREE from 'three';
const status=document.getElementById('status'),sceneEl=document.getElementById('scene');
const wait=setInterval(()=>{const world=window.__VIBE_WORLD__,renderer=window.__VIBE_RENDERER__;if(!world||!renderer?.domElement)return;clearInterval(wait);boot(world,renderer);},450);
function boot(world,renderer){
 const canvas=renderer.domElement;
 // Remove todos os bancos que circundavam a fonte, inclusive gerações antigas.
 const remove=[];world.traverse(o=>{if(['legacyStraightFountainBench','curvedFountainBench','v17FountainBench','v18PlannedBench','v19FountainBench'].includes(o.name))remove.push(o)});remove.forEach(o=>o.parent?.remove(o));
 // Remove os três retângulos claros artificiais da v14.
 const palePaths=[];world.traverse(o=>{if(o.isMesh&&o.geometry?.type==='BoxGeometry'&&Math.abs(o.position.y-.13)<.025){const p=o.geometry.parameters||{};if((p.width>=7&&p.height<.1&&p.depth>=17)||(p.width>=17&&p.height<.1&&p.depth>=7))palePaths.push(o)}});palePaths.forEach(o=>o.parent?.remove(o));
 // Troca o aspecto preto/cinza por pedra histórica clara e quente, próxima da referência visual.
 const baseMat=new THREE.MeshStandardMaterial({color:0xb8a98d,roughness:1});
 world.traverse(o=>{if(o.isMesh&&o.geometry?.type==='CircleGeometry'&&Math.abs(o.position.x)<.1&&Math.abs(o.position.z-2)<.1&&o.geometry.parameters?.radius>25)o.material=baseMat});
 const cobbles=world.getObjectByName('historicCobblestonesInstanced');if(cobbles){cobbles.material=new THREE.MeshStandardMaterial({color:0xc8b99c,roughness:.96,vertexColors:false});}
 // Grande passeio central contínuo, sem o retângulo branco: pedra bege integrada à praça.
 const walkMat=new THREE.MeshStandardMaterial({color:0xd2c2a3,roughness:.94});
 const walk=new THREE.Mesh(new THREE.PlaneGeometry(10.5,23),walkMat);walk.name='v23MainPromenade';walk.rotation.x=-Math.PI/2;walk.position.set(0,.155,9.4);walk.receiveShadow=true;world.add(walk);
 // Navegação: clique e arraste no chão faz o avatar perseguir continuamente o ponteiro.
 let dragging=false,lastMove=0;
 function sendDestination(e){const now=performance.now();if(now-lastMove<90)return;lastMove=now;canvas.dispatchEvent(new PointerEvent('pointerdown',{clientX:e.clientX,clientY:e.clientY,pointerType:'mouse',button:0,buttons:1,bubbles:false}))}
 canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button===0){dragging=true;canvas.setPointerCapture?.(e.pointerId)}});
 canvas.addEventListener('pointermove',e=>{if(dragging&&e.pointerType==='mouse')sendDestination(e)});
 const stop=e=>{if(e.pointerType==='mouse'){dragging=false;try{canvas.releasePointerCapture?.(e.pointerId)}catch(_){}}};canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);canvas.addEventListener('pointerleave',e=>{if(!(e.buttons&1))dragging=false});
 // Cursor visual de jogo enquanto arrasta.
 canvas.classList.add('v23-game-cursor');
 // Câmera mais próxima e baixa no modo exploração; mantém visão geral da v22.
 const originalRender=renderer.render.bind(renderer);renderer.render=(s,c)=>{if(c?.isPerspectiveCamera&&!window.__VIBE_CAMERA_MODE__?.overview){const avatar=findAvatar(world);if(avatar){const target=new THREE.Vector3(avatar.position.x,1.15,avatar.position.z);const desired=new THREE.Vector3(target.x,12.8,target.z+18.5);c.position.lerp(desired,.10);c.lookAt(target.x,1.25,target.z-4.2);c.fov=46;c.updateProjectionMatrix()}}return originalRender(s,c)};
 const controls=document.querySelector('.controls');if(controls)controls.innerHTML='🖱️ Clique ou clique e arraste para andar<br><small>O avatar segue o ponteiro · roda do mouse = zoom · visão geral disponível</small>';
 if(status)status.textContent='v0.23: piso claro, praça limpa e navegação imersiva por clique e arraste.';
}
function findAvatar(world){let found=null;for(const child of world.children){let skin=false;child.traverse?.(o=>{if(o.isSkinnedMesh)skin=true});if(skin){found=child;break}}return found||world.children.find(o=>o.isGroup&&Math.abs(o.position.x)<2&&Math.abs(o.position.z-17)<3)||null;}
