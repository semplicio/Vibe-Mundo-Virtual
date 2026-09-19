// Vibe Mundo Virtual v0.25.0 — piso natural e vegetação recortada.
import './world3d-v24.js';
import * as THREE from 'three';
const status=document.getElementById('status');
const wait=setInterval(()=>{const world=window.__VIBE_WORLD__;if(!world||!world.getObjectByName('v24InstancedVegetation'))return;clearInterval(wait);build(world)},300);

function build(world){
 const old=world.getObjectByName('v24InstancedVegetation');if(old){old.parent.remove(old);old.traverse(o=>{o.geometry?.dispose?.();o.material?.dispose?.()})}
 const cobbles=world.getObjectByName('historicCobblestonesInstanced');if(cobbles)cobbles.visible=false;
 world.getObjectByName('v24MainPromenade')?.removeFromParent();
 buildStoneGround(world);buildPlants(world);
 if(status)status.textContent='v0.25: piso de pedra natural e vegetação realista otimizada.';
}

function canvasTexture(kind){
 const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');
 if(kind==='stone'){
  x.fillStyle='#b9aa8e';x.fillRect(0,0,512,512);
  for(let y=-20;y<540;y+=58)for(let col=-1;col<9;col++){const px=col*68+(y/58%2)*34,shade=166+((col*17+y*3)%24);x.fillStyle=`rgb(${shade+18},${shade+9},${shade-5})`;x.strokeStyle='rgba(91,76,57,.22)';x.lineWidth=3;x.beginPath();x.roundRect(px+3,y+3,62,51,8);x.fill();x.stroke()}
  const g=x.createLinearGradient(0,0,512,512);g.addColorStop(0,'rgba(255,244,213,.16)');g.addColorStop(1,'rgba(80,63,45,.08)');x.fillStyle=g;x.fillRect(0,0,512,512);
 }else{
  x.clearRect(0,0,512,512);const g=x.createRadialGradient(256,250,25,256,256,240);g.addColorStop(0,kind==='leaf'?'#5f9b4f':'#6ea556');g.addColorStop(.55,kind==='leaf'?'#39723d':'#487f42');g.addColorStop(.82,kind==='leaf'?'#285b34':'#356838');g.addColorStop(1,'rgba(25,70,35,0)');x.fillStyle=g;x.beginPath();
  for(let i=0;i<44;i++){const a=i/44*Math.PI*2,r=205+25*Math.sin(i*2.7);const px=256+Math.cos(a)*r,py=256+Math.sin(a)*r;(i?x.lineTo(px,py):x.moveTo(px,py))}x.closePath();x.fill();
  x.globalCompositeOperation='source-atop';for(let i=0;i<90;i++){x.fillStyle=`rgba(170,210,120,${.05+(i%4)*.025})`;x.beginPath();x.ellipse(80+(i*73)%360,70+(i*47)%370,10+(i%6)*3,5+(i%4)*2,i*.6,0,Math.PI*2);x.fill()}
 }
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;
}

function buildStoneGround(world){
 const tex=canvasTexture('stone');tex.repeat.set(10,10);tex.anisotropy=4;
 const mat=new THREE.MeshStandardMaterial({map:tex,color:0xd8c9ac,roughness:.94});
 const plaza=new THREE.Mesh(new THREE.CircleGeometry(31.25,96),mat);plaza.name='v25NaturalStonePlaza';plaza.rotation.x=-Math.PI/2;plaza.position.set(0,.16,2);plaza.receiveShadow=true;world.add(plaza);
 const path=new THREE.Mesh(new THREE.PlaneGeometry(10.5,23),mat.clone());path.name='v25StonePromenade';path.rotation.x=-Math.PI/2;path.position.set(0,.175,9.4);path.receiveShadow=true;world.add(path);
}

function buildPlants(world){
 const root=new THREE.Group();root.name='v25RealVegetation';world.add(root);
 const trees=[[-35,-4,1.05,.2],[-33,18,1.15,1.4],[35,-4,1,2.1],[33,18,1.1,.8],[-23,20,.95,2.7],[23,20,1.08,1.9],[-36,9,1.12,.5],[36,9,1.02,2.9],[-18,23,.9,1.1],[18,23,.96,2.4]];
 const shrubs=[[-25,13,1.1],[-22.5,13.7,.9],[-20,12.5,.95],[25,13,1.05],[22.3,13.6,.9],[19.8,12.4,.98],[-31,5,.95],[-28.8,4.3,.78],[31,5,1], [28.8,4.2,.8],[-21,-6.7,.8],[21,-6.7,.82]];
 const trunkMat=new THREE.MeshStandardMaterial({color:0x60442f,roughness:1}),branchGeo=new THREE.CylinderGeometry(.11,.2,2.1,7),trunkGeo=new THREE.CylinderGeometry(.3,.52,3.6,9);
 const trunks=new THREE.InstancedMesh(trunkGeo,trunkMat,trees.length),branches=new THREE.InstancedMesh(branchGeo,trunkMat,trees.length*3),d=new THREE.Object3D();
 const leafMat=new THREE.MeshStandardMaterial({map:canvasTexture('leaf'),transparent:true,alphaTest:.28,side:THREE.DoubleSide,roughness:.9,depthWrite:true}),leafGeo=new THREE.PlaneGeometry(3.2,2.7),leaves=new THREE.InstancedMesh(leafGeo,leafMat,trees.length*12);
 trees.forEach(([x,z,s,r],n)=>{d.position.set(x,1.8*s,z);d.rotation.set(0,r,0);d.scale.setScalar(s);d.updateMatrix();trunks.setMatrixAt(n,d.matrix);for(let j=0;j<3;j++){const a=r+j*2.1;d.position.set(x+Math.cos(a)*.42*s,3.25*s,z+Math.sin(a)*.42*s);d.rotation.set(Math.sin(a)*.65,a,Math.cos(a)*.65);d.scale.setScalar(s*(.85+j*.06));d.updateMatrix();branches.setMatrixAt(n*3+j,d.matrix)}for(let j=0;j<6;j++){const a=r+j*1.047,rad=.7+(j%2)*.5,y=(3.75+(j%3)*.45)*s;for(let q=0;q<2;q++){const i=n*12+j*2+q;d.position.set(x+Math.cos(a)*rad*s,y,z+Math.sin(a)*rad*s);d.rotation.set(0,a+q*Math.PI/2,0);d.scale.set(s*(.82+(j%3)*.08),s*(.78+(j%2)*.1),s);d.updateMatrix();leaves.setMatrixAt(i,d.matrix)}}});
 const bushMat=new THREE.MeshStandardMaterial({map:canvasTexture('bush'),transparent:true,alphaTest:.25,side:THREE.DoubleSide,roughness:1}),bushes=new THREE.InstancedMesh(new THREE.PlaneGeometry(1.9,1.35),bushMat,shrubs.length*4);
 shrubs.forEach(([x,z,s],n)=>{for(let j=0;j<4;j++){const i=n*4+j,a=j*Math.PI/2+n*.37;d.position.set(x+Math.cos(a)*.18,.72*s,z+Math.sin(a)*.18);d.rotation.set(0,a,0);d.scale.set(s*(.9+(j%2)*.12),s,s);d.updateMatrix();bushes.setMatrixAt(i,d.matrix)}});
 [trunks,branches,leaves,bushes].forEach(m=>{m.instanceMatrix.setUsage(THREE.StaticDrawUsage);m.instanceMatrix.needsUpdate=true;m.receiveShadow=true;root.add(m)});trunks.castShadow=branches.castShadow=true;
}
