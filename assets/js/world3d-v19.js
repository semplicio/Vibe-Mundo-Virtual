// Vibe Mundo Virtual v0.19.0 — mobiliário central refinado sobre a base estável v0.17
import './world3d-v17.js';
import * as THREE from 'three';
const status=document.getElementById('status');
const wait=setInterval(()=>{const world=window.__VIBE_WORLD__,addObstacle=window.__VIBE_ADD_OBSTACLE__;if(!world||!addObstacle)return;clearInterval(wait);build(world,addObstacle);},240);
function build(world,addObstacle){
 // Mantém todo o cenário v0.17 e substitui SOMENTE os bancos problemáticos.
 const old=[];world.traverse(o=>{if(o.name==='v17FountainBench'||o.name==='legacyStraightFountainBench'||o.name==='curvedFountainBench')old.push(o)});old.forEach(o=>o.parent?.remove(o));
 const wood=new THREE.MeshStandardMaterial({color:0x754522,roughness:.76}),metal=new THREE.MeshStandardMaterial({color:0x252729,roughness:.42,metalness:.68});
 function bench(cx,cz,rot=0){const g=new THREE.Group();g.name='v19FountainBench';g.position.set(cx,0,cz);g.rotation.y=rot;
  // banco compacto, sem segmentos sobrepostos: 5 ripas no assento e 4 no encosto
  for(let i=0;i<5;i++){const s=new THREE.Mesh(new THREE.BoxGeometry(3.35,.12,.16),wood);s.position.set(0,.68,(i-2)*.18);s.castShadow=s.receiveShadow=true;g.add(s)}
  for(let i=0;i<4;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(3.35,.13,.15),wood);b.position.set(0,1.08+i*.18,-.48);b.castShadow=true;g.add(b)}
  [-1.38,1.38].forEach(x=>{const l=new THREE.Mesh(new THREE.BoxGeometry(.10,.65,.45),metal);l.position.set(x,.34,0);g.add(l);const p=new THREE.Mesh(new THREE.BoxGeometry(.10,.82,.10),metal);p.position.set(x,.98,-.47);g.add(p)});
  world.add(g);addObstacle(cx,cz,3.7,1.35,.18);return g}
 // Quatro bancos tangenciais e afastados do jardim. Nenhum fecha a frente da fonte.
 bench(-7.45,7.15,-.36);bench(7.45,7.15,.36);bench(-7.65,-2.65,.36);bench(7.65,-2.65,-.36);
 const reader=world.getObjectByName('vibeReaderNPC');if(reader){reader.position.set(-7.45,.72,7.15);reader.rotation.y=-.36;addObstacle(-7.45,7.15,1.2,1.2,.15)}
 if(status)status.textContent='v0.19: cenário preservado; bancos centrais reconstruídos e circulação organizada.';
}
