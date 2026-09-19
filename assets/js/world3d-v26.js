// Vibe Mundo Virtual v0.26.0 — distrito comercial urbano.
import './world3d-v25.js';
import * as THREE from 'three';
const status=document.getElementById('status');
const wait=setInterval(()=>{const world=window.__VIBE_WORLD__;if(!world?.getObjectByName('v25RealVegetation'))return;clearInterval(wait);build(world)},350);

function build(world){
 world.getObjectByName('v25RealVegetation')?.removeFromParent();
 const shops=window.__VIBE_SHOPS__;if(Array.isArray(shops)){const jp=shops.find(s=>s.name==='Loja JP');shops.splice(0,shops.length,...(jp?[jp]:[]))}
 removeLegacyCommerce(world);buildRoads(world);buildCommercialDistrict(world);buildStreetTrees(world);
 if(status)status.textContent='v0.26: distrito comercial com ruas, calçadas e lojas para locação.';
}
function removeLegacyCommerce(world){
 const xs=[-23,-8,9,24],remove=[];
 for(const o of world.children){
  const shopX=xs.some(x=>Math.abs(o.position.x-x)<.2);
  if((o.isGroup&&shopX&&[-15,-12.4,-9.95].some(z=>Math.abs(o.position.z-z)<.2))||
     (o.isSprite&&shopX&&Math.abs(o.position.z+10.9)<.2)||o.name==='v20FacadeDetail')remove.push(o);
 }
 remove.forEach(o=>o.removeFromParent());
}
const mat=(color,roughness=.86,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
function mesh(g,m,x,y,z){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;return o}

function buildRoads(world){
 const asphalt=mat(0x303337,.98),sidewalk=mat(0xb9b6aa,.96),curb=mat(0xd6d0c0,.94),paint=mat(0xe6d48a,.8);
 const addPlane=(w,d,x,z,m,y=.19)=>{const o=mesh(new THREE.PlaneGeometry(w,d),m,x,y,z);o.rotation.x=-Math.PI/2;o.castShadow=false;world.add(o);return o};
 // Anel viário em torno da praça: o piso de pedra central e a fonte são preservados.
 addPlane(82,7,0,-7,asphalt);addPlane(82,7,0,22,asphalt);addPlane(7,29,-30,7.5,asphalt);addPlane(7,29,30,7.5,asphalt);
 addPlane(82,2.4,0,-11.7,sidewalk,.21);addPlane(82,2.4,0,-2.3,sidewalk,.21);addPlane(82,2.4,0,17.3,sidewalk,.21);addPlane(82,2.4,0,26.7,sidewalk,.21);
 for(const z of[-10.4,-3.6,18.6,25.4])addPlane(82,.28,0,z,curb,.24);
 for(let x=-38;x<=38;x+=5.5){addPlane(2.5,.16,x,-7,paint,.215);addPlane(2.5,.16,x,22,paint,.215)}
 // Faixas de pedestres nos quatro acessos da praça.
 for(const x of[-3,-2,-1,0,1,2,3]){addPlane(.48,5.8,x,-7,curb,.225);addPlane(.48,5.8,x,22,curb,.225)}
}

function signTexture(text,bg='#162028',fg='#fff'){const c=document.createElement('canvas');c.width=1024;c.height=256;const q=c.getContext('2d');q.fillStyle=bg;q.fillRect(0,0,c.width,c.height);q.strokeStyle='#d3b66f';q.lineWidth=14;q.strokeRect(10,10,1004,236);q.fillStyle=fg;q.font='900 92px Arial';q.textAlign='center';q.textBaseline='middle';q.fillText(text,512,128);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
function store(world,{x,z,rot=0,color=0x465968,name='ALUGA-SE',open=false}){
 const g=new THREE.Group();g.name=open?'v26OpenTestStore':'v26RentalStore';g.position.set(x,0,z);g.rotation.y=rot;world.add(g);
 const wall=mat(color,.82),stone=mat(0xd2c8b5,.95),dark=mat(0x20252a,.55,.25),glass=new THREE.MeshPhysicalMaterial({color:open?0x84b8c6:0x4c5960,roughness:.18,metalness:.04,transparent:true,opacity:.72});
 g.add(mesh(new THREE.BoxGeometry(10.5,7.2,5.4),wall,0,3.6,0));g.add(mesh(new THREE.BoxGeometry(11.2,.5,6),stone,0,7.05,0));
 for(const px of[-4.6,4.6])g.add(mesh(new THREE.BoxGeometry(.55,6.5,.6),stone,px,3.25,2.55));
 for(const px of[-3.1,0,3.1]){g.add(mesh(new THREE.BoxGeometry(2.55,3.25,.22),dark,px,2.15,2.76));g.add(mesh(new THREE.BoxGeometry(2.25,2.95,.12),glass,px,2.15,2.9))}
 const awning=mesh(new THREE.BoxGeometry(10.2,.32,1.45),mat(open?0xb44c3d:0x34424b,.72),0,4.25,3);awning.rotation.x=-.12;g.add(awning);
 const sign=new THREE.Sprite(new THREE.SpriteMaterial({map:signTexture(name,open?'#8d3029':'#17232b',open?'#fff4cf':'#ffd66b'),transparent:true}));sign.position.set(0,5.5,3.08);sign.scale.set(6.2,1.55,1);g.add(sign);
 for(const px of[-3.1,0,3.1]){const w=mesh(new THREE.BoxGeometry(2.1,1.35,.16),dark,px,6.05,2.75);g.add(w);g.add(mesh(new THREE.BoxGeometry(1.8,1.08,.1),glass,px,6.05,2.88))}
}
function buildCommercialDistrict(world){
 // Nova fileira norte; Loja JP é a única operação aberta nesta fase.
 const north=[[-34,0x36576a,'ALUGA-SE'],[-22,0x6b4d3c,'ALUGA-SE'],[-8,0x8e3e32,'LOJA JP · ABERTA'],[4,0x4c5f75,'ALUGA-SE'],[16,0x5f4770,'ALUGA-SE'],[28,0x37645a,'ALUGA-SE'],[40,0x64523b,'ALUGA-SE']];
 north.forEach(([x,color,name])=>store(world,{x,z:-16.8,color,name,open:name.startsWith('LOJA JP')}));
 // Lojas laterais criam quarteirões e profundidade, em vez de uma única parede de fachadas.
 [[-38,2,Math.PI/2,0x4b6272],[-38,14,Math.PI/2,0x735142],[38,2,-Math.PI/2,0x536b4e],[38,14,-Math.PI/2,0x695275]].forEach(([x,z,rot,color])=>store(world,{x,z,rot,color}));
}

function buildStreetTrees(world){
 const root=new THREE.Group();root.name='v26StreetTrees';world.add(root);const places=[[-25,-1],[-15,-1],[15,-1],[25,-1],[-25,16],[-15,16],[15,16],[25,16]];
 const trunks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.22,.38,3.5,10),mat(0x5a3d2b,1),places.length),crowns=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1,1),mat(0x356b3d,1),places.length*5),d=new THREE.Object3D();
 places.forEach(([x,z],n)=>{const s=.9+(n%3)*.08;d.position.set(x,1.75*s,z);d.scale.setScalar(s);d.updateMatrix();trunks.setMatrixAt(n,d.matrix);for(let j=0;j<5;j++){const a=j/5*Math.PI*2,r=j===4?0:.62;d.position.set(x+Math.cos(a)*r*s,(3.75+(j===4?.55:(j%2)*.25))*s,z+Math.sin(a)*r*s);d.rotation.set(j*.17,a,j*.11);d.scale.set(1.02*s,(.72+(j%2)*.08)*s,.9*s);d.updateMatrix();crowns.setMatrixAt(n*5+j,d.matrix)}});
 [trunks,crowns].forEach(o=>{o.instanceMatrix.setUsage(THREE.StaticDrawUsage);o.instanceMatrix.needsUpdate=true;o.receiveShadow=true;root.add(o)});trunks.castShadow=true;
}
