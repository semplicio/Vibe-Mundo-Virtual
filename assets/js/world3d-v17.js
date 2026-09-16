// Vibe Mundo Virtual v0.17.0 — praça central: bancos corretos e colisões físicas
import './world3d-v16.js';
import * as THREE from 'three';
const status=document.getElementById('status');
const wait=setInterval(()=>{const world=window.__VIBE_WORLD__,addObstacle=window.__VIBE_ADD_OBSTACLE__;if(!world||!addObstacle)return;clearInterval(wait);build(world,addObstacle);},200);
function build(world,addObstacle){
 // Remove as duas gerações anteriores de bancos para não haver peças sobrepostas/mal posicionadas.
 const remove=[];world.traverse(o=>{if(o.name==='legacyStraightFountainBench'||o.name==='curvedFountainBench')remove.push(o)});remove.forEach(o=>o.parent&&o.parent.remove(o));
 const reader=world.getObjectByName('vibeReaderNPC');if(reader){reader.position.set(-6.55,.72,7.25);reader.rotation.y=-.05;addObstacle(-6.55,7.25,1.25,1.25,.2)}
 const wood=new THREE.MeshStandardMaterial({color:0x6d3d1e,roughness:.78}),iron=new THREE.MeshStandardMaterial({color:0x151719,roughness:.38,metalness:.72});
 function arcBench(start,end,r=8.05){const g=new THREE.Group();g.name='v17FountainBench';const segments=11;for(let i=0;i<segments;i++){const a0=start+(end-start)*i/segments,a1=start+(end-start)*(i+1)/segments,a=(a0+a1)/2,len=r*(a1-a0)*.94,x=Math.cos(a)*r,z=2+Math.sin(a)*r;const seat=new THREE.Mesh(new THREE.BoxGeometry(len,.18,.78),wood);seat.position.set(x,.68,z);seat.rotation.y=-a;seat.castShadow=seat.receiveShadow=true;g.add(seat);const back=new THREE.Mesh(new THREE.BoxGeometry(len,.72,.16),wood);back.position.set(Math.cos(a)*(r+.42),1.17,2+Math.sin(a)*(r+.42));back.rotation.y=-a;back.rotation.x=-.08;back.castShadow=true;g.add(back);if(i%2===0){const leg=new THREE.Mesh(new THREE.BoxGeometry(.12,.7,.5),iron);leg.position.set(x,.34,z);leg.rotation.y=-a;g.add(leg)}const cx=Math.cos(a)*r,cz=2+Math.sin(a)*r;addObstacle(cx,cz,len+.18,1.05,.1)}world.add(g)}
 // Três módulos bem definidos: esquerda, fundo e direita. A frente fica livre para circulação e placa da fonte.
 arcBench(.28,1.15);arcBench(1.98,2.85);arcBench(3.43,4.00);arcBench(5.42,6.00);
 // Reforço de colisão dos NPCs visíveis da praça, com área pessoal realista.
 [[-12,1],[-6,6],[11,3],[16,8]].forEach(([x,z])=>addObstacle(x,z,1.35,1.35,.2));
 // Postes originais do motor + postes do boulevard recebem margem física.
 [[-9,-3],[9,-3],[-9,13],[9,13],[-12,-5],[12,-5],[-18,4],[18,4],[-12,12],[12,12],[-8,-18],[8,-18]].forEach(([x,z])=>addObstacle(x,z,.9,.9,.15));
 // Jardins circulares: aproximação por vários obstáculos menores, evitando que o avatar corte por dentro da vegetação.
 for(let i=0;i<20;i++){const a=i/20*Math.PI*2,r=6.25;addObstacle(Math.cos(a)*r,2+Math.sin(a)*r,1.15,1.15,.08)}
 if(status)status.textContent='v0.17: bancos reorganizados e colisões físicas reforçadas em bancos, jardins, postes e NPCs.';
}