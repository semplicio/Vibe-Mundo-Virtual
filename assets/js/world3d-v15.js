// Vibe Mundo Virtual v0.15.0 — Fachadas históricas, portal monumental e iluminação urbana
import './world3d-v14.js';
import * as THREE from 'three';
const status=document.getElementById('status');
const wait=setInterval(()=>{const world=window.__VIBE_WORLD__,scene=window.__VIBE_SCENE__;if(!world||!scene)return;clearInterval(wait);build(world,scene);},180);
function build(world,scene){
 const stone=new THREE.MeshStandardMaterial({color:0xb69772,roughness:.9});
 const stone2=new THREE.MeshStandardMaterial({color:0xd0b38d,roughness:.92});
 const dark=new THREE.MeshStandardMaterial({color:0x242a2e,roughness:.7});
 const gold=new THREE.MeshStandardMaterial({color:0xc88b24,roughness:.3,metalness:.7});
 const foliage=new THREE.MeshStandardMaterial({color:0x356d38,roughness:.98});
 const flowerMats=[0xe64f78,0xf4ca51,0xf2e7d2,0x8d5fc7].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.85}));
 const add=(g,m,x,y,z)=>{m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;g.add(m);return m};
 // Portal central mais alto e arquitetônico, preservando passagem.
 const gate=new THREE.Group();gate.name='v15GrandGate';gate.position.set(0,0,-24);world.add(gate);
 [-5.2,5.2].forEach(x=>{add(gate,new THREE.Mesh(new THREE.BoxGeometry(2.1,9,2),stone),x,4.5,0);add(gate,new THREE.Mesh(new THREE.BoxGeometry(2.6,.45,2.35),stone2),x,1.1,0);add(gate,new THREE.Mesh(new THREE.BoxGeometry(2.55,.42,2.3),stone2),x,8.7,0)});
 add(gate,new THREE.Mesh(new THREE.BoxGeometry(12.2,2.15,2.05),stone),0,8.1,0);
 const arch=new THREE.Mesh(new THREE.TorusGeometry(5.15,1.02,12,48,Math.PI),stone);arch.position.set(0,5.15,.02);arch.rotation.z=Math.PI;gate.add(arch);
 const sign=new THREE.Mesh(new THREE.BoxGeometry(6.6,2.4,.35),dark);sign.position.set(0,8.15,1.15);gate.add(sign);
 const cv=document.createElement('canvas');cv.width=800;cv.height=300;const cx=cv.getContext('2d');cx.fillStyle='#dca52c';cx.textAlign='center';cx.font='bold 72px Arial';cx.fillText('VYBE B&S',400,125);cx.font='38px Arial';cx.fillText('MUNDO VIRTUAL',400,190);const tx=new THREE.CanvasTexture(cv);const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,transparent:true}));sp.position.set(0,8.15,1.38);sp.scale.set(6.1,2.25,1);gate.add(sp);
 // Bandeiras verticais do boulevard.
 [-7.1,7.1].forEach(x=>{const pole=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,6.2,10),gold);pole.position.set(x,4.2,.4);gate.add(pole);const banner=new THREE.Mesh(new THREE.PlaneGeometry(1.25,3.6),new THREE.MeshStandardMaterial({color:0x263f82,roughness:.8,side:THREE.DoubleSide}));banner.position.set(x,5,.52);gate.add(banner)});
 // Fachadas laterais contínuas, com pisos superiores, sacadas e vegetação.
 const shopData=[[-23,0x31556a,0x385c96],[-8,0x8e3e32,0xc24e56],[9,0x674078,0x7342a0],[24,0x356958,0x25877a]];
 shopData.forEach(([x,baseColor,awning],idx)=>{const g=new THREE.Group();g.position.set(x,0,-12.4);world.add(g);const wall=new THREE.MeshStandardMaterial({color:baseColor,roughness:.82});add(g,new THREE.Mesh(new THREE.BoxGeometry(12,6.7,4.4),wall),0,3.35,0);add(g,new THREE.Mesh(new THREE.BoxGeometry(12.6,4.6,4.1),stone),0,8.9,.05);
   // vitrines iluminadas
   [-3.7,0,3.7].forEach(wx=>{const frame=add(g,new THREE.Mesh(new THREE.BoxGeometry(2.75,3.35,.18),dark),wx,2.65,2.25);const glass=new THREE.MeshStandardMaterial({color:0xffc56f,emissive:0xff9f3b,emissiveIntensity:.65,roughness:.25,metalness:.05});add(g,new THREE.Mesh(new THREE.BoxGeometry(2.35,2.9,.12),glass),wx,2.65,2.38)});
   // janelas superiores
   [-3.7,0,3.7].forEach(wx=>{add(g,new THREE.Mesh(new THREE.BoxGeometry(2.15,2.25,.16),dark),wx,9.1,2.12);const win=new THREE.MeshStandardMaterial({color:0xaed0cf,emissive:0x7e9f94,emissiveIntensity:.18,roughness:.3});add(g,new THREE.Mesh(new THREE.BoxGeometry(1.8,1.9,.1),win),wx,9.1,2.23)});
   // toldo listrado simplificado
   const aw=new THREE.MeshStandardMaterial({color:awning,roughness:.78});add(g,new THREE.Mesh(new THREE.BoxGeometry(11.5,.38,1.8),aw),0,5.25,2.85).rotation.x=-.14;
   // sacada de ferro
   const rail=add(g,new THREE.Mesh(new THREE.BoxGeometry(11.1,.12,.12),dark),0,7.25,2.6);for(let j=-5;j<=5;j++)add(g,new THREE.Mesh(new THREE.BoxGeometry(.06,1.05,.06),dark),j,.0+7.72,2.6);
   // floreiras na sacada
   for(let j=-4;j<=4;j+=2){add(g,new THREE.Mesh(new THREE.BoxGeometry(1.65,.38,.62),stone2),j,7.18,2.82);for(let k=0;k<3;k++){const b=new THREE.Mesh(new THREE.SphereGeometry(.3,8,6),foliage);b.position.set(j+(k-1)*.38,7.62,2.9);g.add(b);const fl=new THREE.Mesh(new THREE.SphereGeometry(.09,7,5),flowerMats[(idx+k)%4]);fl.position.set(j+(k-1)*.38,7.94,2.92);g.add(fl)}}
 });
 // Postes clássicos com luz quente, como na referência.
 function lamp(x,z,s=1){const g=new THREE.Group();g.position.set(x,0,z);world.add(g);add(g,new THREE.Mesh(new THREE.CylinderGeometry(.1,.14,3.8,10),dark),0,1.9,0);add(g,new THREE.Mesh(new THREE.CylinderGeometry(.28,.18,.55,8),dark),0,3.72,0);const bulb=new THREE.Mesh(new THREE.SphereGeometry(.22,12,8),new THREE.MeshStandardMaterial({color:0xffe0a1,emissive:0xffb347,emissiveIntensity:2.5}));bulb.position.y=4.05;g.add(bulb);const light=new THREE.PointLight(0xffb968,1.65*s,11,2);light.position.y=4.1;g.add(light)}
 [[-12,-5],[12,-5],[-18,4],[18,4],[-12,12],[12,12],[-8,-18],[8,-18]].forEach(p=>lamp(...p));
 // Mais vasos e topiarias ao longo das fachadas.
 for(const x of[-27,-19,-12,-4,5,13,20,28]){const pot=new THREE.Mesh(new THREE.CylinderGeometry(.42,.62,.65,14),stone2);pot.position.set(x,.33,-8.8);world.add(pot);const top=new THREE.Mesh(new THREE.ConeGeometry(.72,2.1,14),foliage);top.position.set(x,1.55,-8.8);top.castShadow=true;world.add(top)}
 // Iluminação geral mais quente sem transformar a cena em imagem estática.
 scene.fog=new THREE.Fog(0xd9e5df,72,128);
 if(status)status.textContent='v0.15: boulevard histórico, fachadas, vitrines e portal monumental carregados.';
}
