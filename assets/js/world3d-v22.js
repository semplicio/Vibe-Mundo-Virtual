// Vibe Mundo Virtual v0.22.0 — câmera central, zoom, navegação por cursor e performance
import './world3d-v21.js';
import * as THREE from 'three';
const status=document.getElementById('status'),sceneEl=document.getElementById('scene');
const wait=setInterval(()=>{const world=window.__VIBE_WORLD__,renderer=window.__VIBE_RENDERER__,scene=window.__VIBE_SCENE__;if(!world||!renderer||!scene||!renderer.domElement)return;clearInterval(wait);boot(world,renderer,scene);},350);
function boot(world,renderer,scene){
 const canvas=renderer.domElement;
 // Performance: a praça histórica tinha milhares de Mesh/Geometry individuais. Converte para um único InstancedMesh.
 const cobbles=world.getObjectByName('historicCobblestones');
 if(cobbles&&cobbles.children.length){const stones=cobbles.children.filter(o=>o.isMesh),geo=new THREE.BoxGeometry(1,.10,1),mat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.97,vertexColors:true}),inst=new THREE.InstancedMesh(geo,mat,stones.length),dummy=new THREE.Object3D(),color=new THREE.Color();inst.name='historicCobblestonesInstanced';inst.receiveShadow=true;stones.forEach((s,i)=>{const p=s.geometry?.parameters||{};dummy.position.copy(s.position);dummy.rotation.copy(s.rotation);dummy.scale.set(p.width||.7,1,p.depth||.7);dummy.updateMatrix();inst.setMatrixAt(i,dummy.matrix);color.copy(s.material?.color||new THREE.Color(0x887f73));inst.setColorAt(i,color)});inst.instanceMatrix.needsUpdate=true;if(inst.instanceColor)inst.instanceColor.needsUpdate=true;cobbles.parent.add(inst);cobbles.parent.remove(cobbles);}
 // Reduz custo de renderização sem retirar objetos visuais.
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.35));scene.traverse(o=>{if(o.isDirectionalLight&&o.castShadow){o.shadow.mapSize.set(1024,1024);if(o.shadow.map){o.shadow.map.dispose();o.shadow.map=null}}});
 // Localiza o avatar carregado pelo motor base sem alterar o modelo.
 let avatar=null;for(const child of world.children){let hasSkin=false;child.traverse?.(o=>{if(o.isSkinnedMesh)hasSkin=true});if(hasSkin){avatar=child;break}}if(!avatar)avatar=world.children.find(o=>o.isGroup&&Math.abs(o.position.z-17)<1&&Math.abs(o.position.x)<1)||null;
 let zoom=24,overview=false,cursorFollow=false,lastFollow=0,lastCamera=null;
 const toolbar=document.createElement('div');toolbar.className='camera-tools';toolbar.innerHTML='<button type="button" data-act="minus" title="Afastar">−</button><button type="button" data-act="plus" title="Aproximar">＋</button><button type="button" data-act="center">◎ Centralizar</button><button type="button" data-act="overview">▦ Visão geral</button><button type="button" data-act="cursor">⌁ Seguir cursor</button>';sceneEl.appendChild(toolbar);
 function setActive(){toolbar.querySelector('[data-act="overview"]').classList.toggle('active',overview);toolbar.querySelector('[data-act="cursor"]').classList.toggle('active',cursorFollow)}
 toolbar.addEventListener('pointerdown',e=>e.stopPropagation());toolbar.addEventListener('click',e=>{e.stopPropagation();const a=e.target.closest('button')?.dataset.act;if(!a)return;if(a==='plus')zoom=Math.max(14,zoom-3);if(a==='minus')zoom=Math.min(46,zoom+3);if(a==='center'){overview=false;zoom=24}if(a==='overview'){overview=!overview;if(overview)zoom=46}if(a==='cursor')cursorFollow=!cursorFollow;setActive()});
 canvas.addEventListener('wheel',e=>{e.preventDefault();overview=false;zoom=THREE.MathUtils.clamp(zoom+Math.sign(e.deltaY)*2.6,14,46);setActive()},{passive:false});
 // Seguir cursor é opcional: quando ativo, mover o mouse sobre o chão atualiza o destino do A* em intervalos controlados.
 canvas.addEventListener('pointermove',e=>{if(!cursorFollow||e.pointerType==='touch'||Date.now()-lastFollow<190)return;lastFollow=Date.now();canvas.dispatchEvent(new PointerEvent('pointerdown',{clientX:e.clientX,clientY:e.clientY,pointerType:'mouse',bubbles:false}))});
 // Intercepta somente a câmera usada no render. Assim preservamos animação, A*, colisões e interação existentes.
 const originalRender=renderer.render.bind(renderer);renderer.render=(s,c)=>{if(c?.isPerspectiveCamera){lastCamera=c;const target=overview?new THREE.Vector3(0,0,2):(avatar?new THREE.Vector3(avatar.position.x,0,avatar.position.z):new THREE.Vector3(0,0,2));const dist=overview?52:zoom;const desired=new THREE.Vector3(target.x,dist*.62,target.z+dist);c.position.lerp(desired,.14);c.lookAt(target.x,overview?0:1.15,target.z-(overview?1:3));c.fov=overview?48:42;c.updateProjectionMatrix()}return originalRender(s,c)};
 window.__VIBE_CAMERA_MODE__={get zoom(){return zoom},get overview(){return overview},get cursorFollow(){return cursorFollow}};
 if(status)status.textContent='v0.22: câmera central, zoom, visão geral, seguir cursor e praça otimizada.';
}
