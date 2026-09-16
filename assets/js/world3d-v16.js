// Vibe Mundo Virtual v0.16.0 — colisões integradas e refinamento visual da praça
import './world3d-v15.js';
import * as THREE from 'three';
const status=document.getElementById('status');
const wait=setInterval(()=>{const world=window.__VIBE_WORLD__,addObstacle=window.__VIBE_ADD_OBSTACLE__;if(!world||!addObstacle)return;clearInterval(wait);build(world,addObstacle);},180);
function build(world,addObstacle){
 // Registra no A* os elementos adicionados depois do motor base.
 // Fonte monumental já possui obstáculo base; reforçamos o raio para incluir jardim/borda.
 addObstacle(0,2,14.2,14.2,.35);
 // Bancos curvos: caixas aproximadas por quadrantes, evitando atravessar madeira/encosto.
 [[5.3,6.5,5.5,2.2],[-5.3,6.5,5.5,2.2],[-5.3,-2.5,5.5,2.2],[5.3,-2.5,5.5,2.2]].forEach(o=>addObstacle(...o,.18));
 // Postes clássicos e vasos/topiarias do boulevard.
 [[-12,-5],[12,-5],[-18,4],[18,4],[-12,12],[12,12],[-8,-18],[8,-18]].forEach(([x,z])=>addObstacle(x,z,.75,.75,.22));
 [-27,-19,-12,-4,5,13,20,28].forEach(x=>addObstacle(x,-8.8,1.25,1.25,.22));
 // Portal: colunas são sólidas, abertura central continua transitável.
 addObstacle(-5.2,-24,2.3,2.3,.3);addObstacle(5.2,-24,2.3,2.3,.3);
 // Fachadas v15 avançam além das lojas originais: cria uma faixa coerente de colisão.
 [[-23,-12.4],[-8,-12.4],[9,-12.4],[24,-12.4]].forEach(([x,z])=>addObstacle(x,z,12.1,4.7,.3));

 // Jardineiras de pedra mais altas e orgânicas, inspiradas na referência.
 const stone=new THREE.MeshStandardMaterial({color:0xa99072,roughness:.94});
 const leaf=[0x294f2f,0x376f3b,0x4d8244].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.98}));
 const flowers=[0xf0527c,0xffcf55,0xf2ead8,0x9866c8,0xf48b54].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.85}));
 function planter(x,z,w,d){const g=new THREE.Group();g.position.set(x,0,z);world.add(g);const base=new THREE.Mesh(new THREE.BoxGeometry(w,.5,d),stone);base.position.y=.25;base.castShadow=base.receiveShadow=true;g.add(base);for(let i=0;i<Math.max(4,Math.floor(w*1.5));i++){const px=(Math.random()-.5)*(w-.5),pz=(Math.random()-.5)*(d-.4);const bush=new THREE.Mesh(new THREE.IcosahedronGeometry(.3+Math.random()*.25,1),leaf[i%3]);bush.position.set(px,.62+Math.random()*.2,pz);bush.scale.y=1.15;bush.castShadow=true;g.add(bush);if(i%2===0){const fl=new THREE.Mesh(new THREE.SphereGeometry(.09,7,5),flowers[i%5]);fl.position.set(px,.98,pz);g.add(fl)}}addObstacle(x,z,w,d,.22)}
 planter(-20,7.8,6.2,1.5);planter(20,7.8,6.2,1.5);planter(-22,-6.7,5.2,1.35);planter(22,-6.7,5.2,1.35);

 // Balizadores de pedra próximos à fonte para dar escala e acabamento antigo.
 for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5]){const r=9.5,x=Math.cos(a)*r,z=2+Math.sin(a)*r;const p=new THREE.Mesh(new THREE.CylinderGeometry(.42,.55,.8,12),stone);p.position.set(x,.4,z);p.castShadow=p.receiveShadow=true;world.add(p);addObstacle(x,z,.9,.9,.16)}
 if(status)status.textContent='v0.16: colisões dos elementos 3D integradas ao A* e praça refinada.';
}
