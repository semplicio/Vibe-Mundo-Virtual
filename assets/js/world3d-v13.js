// Vibe Mundo Virtual v0.13.0 — Fonte monumental e jardim vivo
import './world3d-v12.js';
import * as THREE from 'three';

const status=document.getElementById('status');
const wait=setInterval(()=>{const world=window.__VIBE_WORLD__,scene=window.__VIBE_SCENE__;if(!world||!scene)return;clearInterval(wait);build(world);},180);

function build(world){
 const old=world.getObjectByName('legacyFountain');if(old)old.visible=false;
 const stone=new THREE.MeshStandardMaterial({color:0xb9aa94,roughness:.72,metalness:.03});
 const darkStone=new THREE.MeshStandardMaterial({color:0x59636a,roughness:.5,metalness:.08});
 const bronze=new THREE.MeshStandardMaterial({color:0xb57a25,roughness:.32,metalness:.78});
 const waterMat=new THREE.MeshPhysicalMaterial({color:0x43c9e9,transparent:true,opacity:.72,roughness:.08,metalness:.02,transmission:.18,clearcoat:1,clearcoatRoughness:.08});
 const jetMat=new THREE.MeshBasicMaterial({color:0xc8f5ff,transparent:true,opacity:.72});
 const add=(g,o,x,y,z)=>{o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;g.add(o);return o};
 const f=new THREE.Group();f.name='vibeLandmarkFountain';f.position.set(0,0,2);world.add(f);
 add(f,new THREE.Mesh(new THREE.CylinderGeometry(5.2,5.55,.55,64),stone),0,.28,0);
 add(f,new THREE.Mesh(new THREE.CylinderGeometry(4.75,4.9,.52,64),darkStone),0,.68,0);
 add(f,new THREE.Mesh(new THREE.CylinderGeometry(4.42,4.42,.12,64),waterMat),0,.98,0);
 add(f,new THREE.Mesh(new THREE.CylinderGeometry(2.75,3.05,.52,48),darkStone),0,1.25,0);
 add(f,new THREE.Mesh(new THREE.CylinderGeometry(2.48,2.6,.11,48),waterMat),0,1.58,0);
 add(f,new THREE.Mesh(new THREE.CylinderGeometry(.62,.86,2.25,24),darkStone),0,2.55,0);
 add(f,new THREE.Mesh(new THREE.CylinderGeometry(1.65,1.9,.42,48),stone),0,3.65,0);
 add(f,new THREE.Mesh(new THREE.CylinderGeometry(1.42,1.42,.09,48),waterMat),0,3.9,0);
 // Globo armilar inspirado na referência.
 const globe=new THREE.Group();globe.position.y=5.35;f.add(globe);
 [0,Math.PI/3,-Math.PI/3].forEach((r,i)=>{const tor=new THREE.Mesh(new THREE.TorusGeometry(1.05,.055,10,64),bronze);tor.rotation.set(i?Math.PI/2:0,r,0);globe.add(tor)});
 const axis=new THREE.Mesh(new THREE.CylinderGeometry(.055,.055,2.5,10),bronze);axis.rotation.z=.55;globe.add(axis);
 // Jatos em arcos usando curvas reais 3D.
 const jets=[];
 function arc(a,r=3.6,h=3.25){const start=new THREE.Vector3(Math.cos(a)*1.55,3.8,Math.sin(a)*1.55),end=new THREE.Vector3(Math.cos(a)*r,.98,Math.sin(a)*r),mid=start.clone().lerp(end,.5);mid.y+=h;const curve=new THREE.QuadraticBezierCurve3(start,mid,end);const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,30,.045,7,false),jetMat.clone());f.add(tube);jets.push(tube);}
 for(let i=0;i<10;i++)arc(i*Math.PI*2/10,4.0,1.15);
 // Jatos superiores verticais.
 for(let i=0;i<6;i++){const a=i*Math.PI*2/6,x=Math.cos(a)*1.15,z=Math.sin(a)*1.15;const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(x,3.9,z),new THREE.Vector3(x*1.3,5.1,z*1.3),new THREE.Vector3(x*1.65,3.75,z*1.65));const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,24,.035,6,false),jetMat.clone());f.add(tube);jets.push(tube)}
 // Gotas animadas.
 const drops=[];for(let i=0;i<44;i++){const d=new THREE.Mesh(new THREE.SphereGeometry(.035,6,5),jetMat.clone());d.userData={a:Math.random()*Math.PI*2,t:Math.random(),r:2.1+Math.random()*2.1,h:2.2+Math.random()*2};f.add(d);drops.push(d)}
 // Placa VYBE B&S frontal.
 const plaque=new THREE.Mesh(new THREE.BoxGeometry(2.7,1.25,.28),stone);plaque.position.set(0,.85,5.25);plaque.rotation.x=-.06;f.add(plaque);
 const c=document.createElement('canvas');c.width=512;c.height=220;const q=c.getContext('2d');q.fillStyle='#3c342a';q.font='bold 58px Arial';q.textAlign='center';q.fillText('VYBE B&S',256,90);q.font='32px Arial';q.fillText('Mundo Virtual',256,145);const tex=new THREE.CanvasTexture(c);const label=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true}));label.position.set(0,.88,5.42);label.scale.set(2.55,1.1,1);f.add(label);
 // Bancos ornamentais em volta da fonte.
 function bench(x,z,rot){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;const wood=new THREE.MeshStandardMaterial({color:0x75431f,roughness:.72});const iron=new THREE.MeshStandardMaterial({color:0x17191a,roughness:.35,metalness:.72});for(let i=0;i<4;i++)add(g,new THREE.Mesh(new THREE.BoxGeometry(3.5,.16,.22),wood),0,.62+i*.16,(i-1.5)*.22);for(let i=0;i<4;i++){const slat=new THREE.Mesh(new THREE.BoxGeometry(3.5,.15,.18),wood);slat.position.set(0,1.15+i*.2,-.48);slat.rotation.x=-.08;g.add(slat)}[-1.5,1.5].forEach(x=>{add(g,new THREE.Mesh(new THREE.BoxGeometry(.12,.85,.12),iron),x,.43,0);add(g,new THREE.Mesh(new THREE.BoxGeometry(.12,1.05,.12),iron),x,1.05,-.45)});world.add(g);return g}
 const b1=bench(-7.2,6.7,-.35),b2=bench(7.2,6.7,.35),b3=bench(-7.2,-2.7,Math.PI+.35),b4=bench(7.2,-2.7,Math.PI-.35);
 // NPC sentado lendo no banco esquerdo.
 const reader=new THREE.Group();reader.position.set(-7.2,.75,6.55);reader.rotation.y=-.35;world.add(reader);const skin=new THREE.MeshStandardMaterial({color:0xd2a07d,roughness:.8}),cloth=new THREE.MeshStandardMaterial({color:0x303947,roughness:.85}),denim=new THREE.MeshStandardMaterial({color:0x27384d,roughness:.9});add(reader,new THREE.Mesh(new THREE.SphereGeometry(.32,16,12),skin),0,1.55,0);add(reader,new THREE.Mesh(new THREE.BoxGeometry(.7,.9,.42),cloth),0,1.02,0);[-.22,.22].forEach(x=>{const leg=new THREE.Mesh(new THREE.CylinderGeometry(.09,.11,.85,10),denim);leg.position.set(x,.35,.3);leg.rotation.x=-.65;reader.add(leg)});const book=new THREE.Group();book.position.set(0,.95,.48);book.rotation.x=-.55;reader.add(book);const pageMat=new THREE.MeshStandardMaterial({color:0xf2ead8,roughness:1,side:THREE.DoubleSide});const left=new THREE.Mesh(new THREE.PlaneGeometry(.48,.62),pageMat),right=left.clone();left.position.x=-.24;right.position.x=.24;left.rotation.y=.18;right.rotation.y=-.18;book.add(left,right);const page=right.clone();page.position.x=.18;page.position.y=.01;book.add(page);
 // Vegetação densa e tridimensional ao redor da fonte.
 const leafMats=[0x315f35,0x437b3f,0x5c9349].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.96}));const flowerColors=[0xff5e88,0xffd45e,0xf7f1df,0x9d6bea,0xff8c5c];
 for(let i=0;i<42;i++){const a=i/42*Math.PI*2,r=5.9+(i%3)*.48,x=Math.cos(a)*r,z=2+Math.sin(a)*r;const shrub=new THREE.Mesh(new THREE.IcosahedronGeometry(.42+(i%4)*.06,1),leafMats[i%3]);shrub.position.set(x,.48,z);shrub.scale.y=1.15;shrub.castShadow=true;world.add(shrub);if(i%2===0){const bloom=new THREE.Mesh(new THREE.SphereGeometry(.12,8,6),new THREE.MeshStandardMaterial({color:flowerColors[i%flowerColors.length],roughness:.8}));bloom.position.set(x,.93,z);world.add(bloom)}}
 // Animação contínua da água, gotas, globo e página do livro.
 const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();globe.rotation.y=t*.16;jets.forEach((j,i)=>j.material.opacity=.58+Math.sin(t*4+i)*.18);drops.forEach((d,i)=>{const u=(d.userData.t+t*.34)%1,a=d.userData.a,r=d.userData.r;d.position.set(Math.cos(a)*(1.45+(r-1.45)*u),3.85+Math.sin(u*Math.PI)*d.userData.h-2.9*u,Math.sin(a)*(1.45+(r-1.45)*u))});page.rotation.y=-.18+Math.max(0,Math.sin(t*.7))*1.05;waterMat.emissive=new THREE.Color(0x073a48);waterMat.emissiveIntensity=.08+Math.sin(t*2)*.025}animate();
 if(status)status.textContent='Fonte monumental animada, jardins, bancos e NPC leitor carregados.';
}