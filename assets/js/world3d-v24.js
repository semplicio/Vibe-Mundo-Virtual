// Vibe Mundo Virtual v0.24.0 — vegetação instanciada e navegação estável.
// Importa v0.20 diretamente: evita vegetação duplicada da v0.21 e os dois
// wrappers de renderer das v0.22/v0.23.
import './world3d-v20.js';
import * as THREE from 'three';

const sceneEl=document.getElementById('scene'),statusEl=document.getElementById('status');
const wait=setInterval(()=>{const w=window.__VIBE_WORLD__,s=window.__VIBE_SCENE__,r=window.__VIBE_RENDERER__;if(w&&s&&r?.domElement){clearInterval(wait);boot(w,s,r)}},250);

function boot(world,scene,renderer){
 sceneEl?.classList.add('v24-performance');
 removeLegacy(world);optimizeCobbles(world);buildVegetation(world);tuneRenderer(scene,renderer);addPromenade(world);addNavigation(world,renderer);
 const controls=document.querySelector('.controls');if(controls)controls.innerHTML='🖱️ Clique ou arraste para andar<br><small>Zoom na roda · visão geral · navegação otimizada</small>';
 renderer.domElement.classList.add('v24-game-cursor');
 if(statusEl)statusEl.textContent='v0.24: vegetação natural otimizada e navegação mais fluida.';
}

function removeLegacy(world){
 const names=new Set(['legacyStraightFountainBench','curvedFountainBench','v17FountainBench','v18PlannedBench','v19FountainBench','v21OrganicTree','v21Shrub']);
 const greens=new Set([0x4a9a49,0x4b8f45,0x5fa44f,0x397f3f,0x4b9346,0x315f35,0x437b3f,0x5c9349,0x356d38,0x294f2f,0x376f3b,0x4d8244,0x315c35,0x47783e,0x5b8d4c]);
 const remove=[];world.traverse(o=>{
  if(names.has(o.name))remove.push(o);
  if(o.isMesh&&!Array.isArray(o.material)&&greens.has(o.material?.color?.getHex())&&/Sphere|Icosahedron|Cone/.test(o.geometry?.type||''))remove.push(o);
  const p=o.geometry?.parameters||{};if(o.isMesh&&o.geometry?.type==='BoxGeometry'&&Math.abs(o.position.y-.13)<.025&&((p.width>=7&&p.height<.1&&p.depth>=17)||(p.width>=17&&p.height<.1&&p.depth>=7)))remove.push(o);
 });
 [...new Set(remove)].filter(o=>o.parent).forEach(o=>{o.parent.remove(o);o.traverse?.(c=>c.geometry?.dispose?.())});
}

function optimizeCobbles(world){
 const old=world.getObjectByName('historicCobblestones');if(!old?.children.length){const baseMat=new THREE.MeshStandardMaterial({color:0xb8a98d,roughness:1});world.traverse(o=>{if(o.isMesh&&o.geometry?.type==='CircleGeometry'&&Math.abs(o.position.x)<.1&&Math.abs(o.position.z-2)<.1&&o.geometry.parameters?.radius>25)o.material=baseMat});return}
 const stones=old.children.filter(o=>o.isMesh),geo=new THREE.BoxGeometry(1,.1,1),mat=new THREE.MeshStandardMaterial({color:0xc8b99c,roughness:.97,vertexColors:true}),inst=new THREE.InstancedMesh(geo,mat,stones.length),dummy=new THREE.Object3D(),color=new THREE.Color();
 inst.name='historicCobblestonesInstanced';inst.receiveShadow=true;
 stones.forEach((stone,i)=>{const p=stone.geometry?.parameters||{};dummy.position.copy(stone.position);dummy.rotation.copy(stone.rotation);dummy.scale.set(p.width||.7,1,p.depth||.7);dummy.updateMatrix();inst.setMatrixAt(i,dummy.matrix);color.copy(stone.material?.color||new THREE.Color(0xb8aa92)).lerp(new THREE.Color(0xd4c7ad),.45);inst.setColorAt(i,color);stone.geometry?.dispose?.()});
 inst.instanceMatrix.setUsage(THREE.StaticDrawUsage);inst.instanceMatrix.needsUpdate=true;if(inst.instanceColor)inst.instanceColor.needsUpdate=true;old.parent.add(inst);old.parent.remove(old);
 const baseMat=new THREE.MeshStandardMaterial({color:0xb8a98d,roughness:1});world.traverse(o=>{if(o.isMesh&&o.geometry?.type==='CircleGeometry'&&Math.abs(o.position.x)<.1&&Math.abs(o.position.z-2)<.1&&o.geometry.parameters?.radius>25)o.material=baseMat});
}

function buildVegetation(world){
 const root=new THREE.Group();root.name='v24InstancedVegetation';world.add(root);
 const trees=[[-35,-4,1.02,.2],[-33,18,1.12,1.4],[35,-4,.96,2.1],[33,18,1.08,.8],[-23,20,.92,2.7],[23,20,1.04,1.9],[-36,9,1.12,.5],[36,9,1,2.9],[-18,23,.88,1.1],[18,23,.94,2.4]];
 const shrubs=[[-25,13,1.05,.2],[-22.5,13.7,.82,1.5],[-20,12.5,.9,2.2],[25,13,1.02,2.8],[22.3,13.6,.86,.7],[19.8,12.4,.92,1.9],[-31,5,.9,.4],[-28.8,4.3,.72,2.5],[31,5,.94,1.2],[28.8,4.2,.76,2.9],[-21.8,-6.7,.78,.9],[-19.9,-6.6,.66,2.1],[21.8,-6.7,.8,1.7],[19.9,-6.6,.68,.3]];
 const trunks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.34,.52,3.3,8),new THREE.MeshStandardMaterial({color:0x684831,roughness:1}),trees.length);
 const crowns=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,1),new THREE.MeshStandardMaterial({color:0x3f7442,roughness:1,vertexColors:true}),trees.length*4);
 const bushes=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,1),new THREE.MeshStandardMaterial({color:0x4d8148,roughness:1,vertexColors:true}),shrubs.length*3);
 const d=new THREE.Object3D(),c=new THREE.Color(),clusters=[[-.72,3.55,.05,1.05],[.7,3.65,.15,.96],[0,4.25,-.12,1.15],[.08,3.75,.55,.82]];
 trees.forEach(([x,z,s,r],n)=>{d.position.set(x,1.65*s,z);d.rotation.set(0,r,.035*Math.sin(n*2.1));d.scale.setScalar(s);d.updateMatrix();trunks.setMatrixAt(n,d.matrix);clusters.forEach(([dx,y,dz,size],j)=>{const i=n*4+j,v=s*size*(1+.07*Math.sin(i*1.73));d.position.set(x+dx*s,y*s,z+dz*s);d.rotation.set(i*.11,r+i*.57,i*.07);d.scale.set(v*1.12,v*(.78+.08*(i%3)),v);d.updateMatrix();crowns.setMatrixAt(i,d.matrix);crowns.setColorAt(i,c.setHex([0x315f37,0x3d7440,0x4b8247,0x376b3c][i%4]))})});
 shrubs.forEach(([x,z,s,r],n)=>[[-.38,.48,0,.62],[.32,.55,.16,.7],[.02,.63,-.3,.58]].forEach(([dx,y,dz,size],j)=>{const i=n*3+j;d.position.set(x+dx*s,y*s,z+dz*s);d.rotation.set(i*.09,r+j*.8,i*.04);d.scale.set(size*s,size*s*(.82+.06*(i%3)),size*s);d.updateMatrix();bushes.setMatrixAt(i,d.matrix);bushes.setColorAt(i,c.setHex([0x3a6d3d,0x4c8047,0x588c4c][i%3]))}));
 [trunks,crowns,bushes].forEach(m=>{m.instanceMatrix.setUsage(THREE.StaticDrawUsage);m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;m.receiveShadow=true;root.add(m)});trunks.castShadow=true;
}

function tuneRenderer(scene,renderer){
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,matchMedia('(max-width:900px)').matches?1.1:1.3));renderer.shadowMap.type=THREE.PCFShadowMap;
 let points=0;scene.traverse(o=>{if(o.isDirectionalLight&&o.castShadow){o.shadow.mapSize.set(768,768);Object.assign(o.shadow.camera,{left:-34,right:34,top:30,bottom:-30});o.shadow.map?.dispose?.();o.shadow.map=null}if(o.isPointLight){o.visible=points<4&&points%2===0;if(o.visible)o.intensity=Math.min(o.intensity,1.15);points++}});
}
function addPromenade(world){const m=new THREE.Mesh(new THREE.PlaneGeometry(10.5,23),new THREE.MeshStandardMaterial({color:0xd2c2a3,roughness:.95}));m.name='v24MainPromenade';m.rotation.x=-Math.PI/2;m.position.set(0,.155,9.4);m.receiveShadow=true;world.add(m)}

function addNavigation(world,renderer){
 const canvas=renderer.domElement,avatar=findAvatar(world);let zoom=24,overview=false,follow=false,drag=false,last=0,lx=NaN,ly=NaN;
 document.querySelector('.camera-tools')?.remove();const bar=document.createElement('div');bar.className='camera-tools';bar.innerHTML='<button data-act="minus">−</button><button data-act="plus">＋</button><button data-act="center">◎ Centralizar</button><button data-act="overview">▦ Visão geral</button><button data-act="cursor">⌁ Seguir cursor</button>';sceneEl?.appendChild(bar);
 const active=()=>{bar.querySelector('[data-act="overview"]')?.classList.toggle('active',overview);bar.querySelector('[data-act="cursor"]')?.classList.toggle('active',follow)};bar.addEventListener('pointerdown',e=>e.stopPropagation());bar.addEventListener('click',e=>{e.stopPropagation();const a=e.target.closest('button')?.dataset.act;if(a==='plus')zoom=Math.max(14,zoom-3);if(a==='minus')zoom=Math.min(46,zoom+3);if(a==='center'){overview=false;zoom=24}if(a==='overview'){overview=!overview;if(overview)zoom=46}if(a==='cursor')follow=!follow;active()});
 canvas.addEventListener('wheel',e=>{e.preventDefault();overview=false;zoom=THREE.MathUtils.clamp(zoom+Math.sign(e.deltaY)*2.6,14,46);active()},{passive:false});
 const route=e=>{const now=performance.now(),distance=Math.hypot(e.clientX-lx,e.clientY-ly);if(now-last<180||distance<12)return;last=now;lx=e.clientX;ly=e.clientY;canvas.dispatchEvent(new PointerEvent('pointerdown',{clientX:e.clientX,clientY:e.clientY,pointerType:'mouse',button:0,buttons:1,bubbles:false}))};
 canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button===0){drag=true;lx=e.clientX;ly=e.clientY;last=performance.now();canvas.setPointerCapture?.(e.pointerId)}});canvas.addEventListener('pointermove',e=>{if(e.pointerType!=='touch'&&(drag||follow))route(e)});const stop=e=>{if(e.pointerType==='mouse'){drag=false;try{canvas.releasePointerCapture?.(e.pointerId)}catch(_){}}};canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);canvas.addEventListener('pointerleave',e=>{if(!(e.buttons&1))drag=false});
 const render=renderer.render.bind(renderer),target=new THREE.Vector3(),desired=new THREE.Vector3();renderer.render=(s,c)=>{if(c?.isPerspectiveCamera){if(overview){target.set(0,0,2);desired.set(0,32.2,54);c.fov=48;c.position.lerp(desired,.12);c.lookAt(0,0,1)}else if(avatar){target.set(avatar.position.x,1.15,avatar.position.z);const k=zoom/24;desired.set(target.x,12.8*k,target.z+18.5*k);c.fov=46;c.position.lerp(desired,.1);c.lookAt(target.x,1.25,target.z-4.2)}c.updateProjectionMatrix()}return render(s,c)};
 window.__VIBE_CAMERA_MODE__={get zoom(){return zoom},get overview(){return overview},get cursorFollow(){return follow}};
}
function findAvatar(world){for(const child of world.children){let skin=false;child.traverse?.(o=>{if(o.isSkinnedMesh)skin=true});if(skin)return child}return world.children.find(o=>o.isGroup&&Math.abs(o.position.x)<2&&Math.abs(o.position.z-17)<3)||null}
