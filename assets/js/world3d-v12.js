// Vibe Mundo Virtual v0.12.0
// Camada visual baseada na referência aprovada: cidade mais densa, praça rica e movimento mais orgânico.
import './world3d-v11.js';
import * as THREE from 'three';

const host=document.getElementById('world3d');
const statusEl=document.getElementById('status');

function material(color,roughness=.82,metalness=0){return new THREE.MeshStandardMaterial({color,roughness,metalness});}
function mesh(geometry,mat,x,y,z){const m=new THREE.Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;return m;}
function addReferenceDetails(){
  if(!host) return;
  // A camada principal é criada pelo motor v0.10. Estes elementos complementares são
  // independentes e ficam disponíveis para o renderer sem substituir a imagem por background.
  const scene=window.__VIBE_SCENE__;
  const world=window.__VIBE_WORLD__;
  if(!scene||!world){setTimeout(addReferenceDetails,350);return;}

  // Piso central mais nobre, semelhante à praça da referência.
  const plaza=mesh(new THREE.CircleGeometry(16.5,64),material(0xd8c7aa,.94),0,.018,2);
  plaza.rotation.x=-Math.PI/2;world.add(plaza);
  const ring=mesh(new THREE.RingGeometry(11.7,12.35,64),material(0xb9a98e,.95),0,.027,2);
  ring.rotation.x=-Math.PI/2;world.add(ring);

  // Canteiros ornamentais elevados.
  const bedMat=material(0x6e9f4e,1),edgeMat=material(0xcbbd9f,.95);
  [[-24,13,10,5],[24,13,10,5],[-31,5,7,5],[31,5,7,5]].forEach(([x,z,w,d])=>{
    const edge=mesh(new THREE.BoxGeometry(w+.5,.28,d+.5),edgeMat,x,.14,z);world.add(edge);
    const bed=mesh(new THREE.BoxGeometry(w,.34,d),bedMat,x,.32,z);world.add(bed);
  });

  // Arbustos e flores em maior densidade.
  const greens=[0x4b8f45,0x5fa44f,0x397f3f];
  const flower=[0xf45f86,0xf5cf55,0xf5eee1,0xa96de0];
  const points=[[-27,13],[-24,13],[-21,13],[21,13],[24,13],[27,13],[-33,5],[-30,5],[30,5],[33,5],[-19,18],[19,18]];
  points.forEach(([x,z],i)=>{
    const bush=mesh(new THREE.SphereGeometry(.62+(i%3)*.08,14,10),material(greens[i%greens.length],.95),x,.72,z);world.add(bush);
    for(let j=0;j<3;j++){
      const stem=mesh(new THREE.CylinderGeometry(.025,.035,.42,7),material(0x397944,1),x+(j-1)*.28,.55,z+.45);world.add(stem);
      const bloom=mesh(new THREE.SphereGeometry(.11,8,6),material(flower[(i+j)%flower.length],.75),x+(j-1)*.28,.8,z+.45);world.add(bloom);
    }
  });

  // Balizadores/vasos urbanos próximos das lojas.
  [[-17,-9],[17,-9],[-17,11],[17,11]].forEach(([x,z])=>{
    const pot=mesh(new THREE.CylinderGeometry(.42,.58,.65,16),material(0x9b6848,.9),x,.33,z);world.add(pot);
    const plant=mesh(new THREE.SphereGeometry(.78,14,10),material(0x4b9346,.95),x,1.18,z);world.add(plant);
  });

  // Totens de informação e quiosques dão profundidade ao eixo comercial.
  [[-13,-5],[13,-5]].forEach(([x,z],i)=>{
    const base=mesh(new THREE.CylinderGeometry(.55,.72,.25,20),material(0x8f826e,.9),x,.13,z);world.add(base);
    const post=mesh(new THREE.BoxGeometry(.32,2.6,.32),material(0x30373b,.72,.12),x,1.5,z);world.add(post);
    const board=mesh(new THREE.BoxGeometry(2.2,1.35,.18),material(i?0x5d397f:0x244f69,.68),x,2.55,z);world.add(board);
  });

  // Iluminação quente complementar para vitrines e praça.
  [[-23,-10],[ -8,-10],[9,-10],[24,-10]].forEach(([x,z])=>{
    const light=new THREE.PointLight(0xffc77d,2.1,10,2);light.position.set(x,3.2,z);world.add(light);
  });

  // Atmosfera: luz solar mais quente e céu claro da referência.
  scene.background=new THREE.Color(0xc6e4f4);
  scene.fog=new THREE.Fog(0xd9edf6,68,125);
  if(statusEl) statusEl.textContent='Praça Central 3D v0.12 carregada · cenário inspirado na referência aprovada.';
}

// O motor base publica estes objetos na v0.12 através do pequeno bridge abaixo.
addReferenceDetails();
