// Vibe Mundo Virtual v0.21.0 — vegetação orgânica e colisões de proximidade
import './world3d-v20.js';
import * as THREE from 'three';
const status=document.getElementById('status');
const wait=setInterval(()=>{const world=window.__VIBE_WORLD__,addObstacle=window.__VIBE_ADD_OBSTACLE__;if(!world||!addObstacle)return;clearInterval(wait);build(world,addObstacle);},320);
function build(world,addObstacle){
 const trunkMat=new THREE.MeshStandardMaterial({color:0x65452d,roughness:.96});
 const branchMat=new THREE.MeshStandardMaterial({color:0x745039,roughness:.95});
 const leafMats=[0x244b2d,0x32643a,0x3f7542,0x54884a].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.98}));
 const shrubMats=[0x315c35,0x47783e,0x5b8d4c].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:1}));
 const flowerMats=[0xe85f79,0xf5c85b,0xf0e8dc,0xa875c6,0xe98c56].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.9}));
 function mesh(geo,mat,x,y,z){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;return m}
 function organicTree(x,z,s=1){const g=new THREE.Group();g.name='v21OrganicTree';g.position.set(x,0,z);world.add(g);
  const trunk=mesh(new THREE.CylinderGeometry(.28*s,.48*s,3.2*s,10),trunkMat,0,1.6*s,0);g.add(trunk);
  [[-.28,2.55,-.05,-.5],[.32,2.7,.08,.48],[.05,2.85,.18,.12]].forEach(([bx,by,bz,rz])=>{const b=mesh(new THREE.CylinderGeometry(.09*s,.17*s,1.7*s,8),branchMat,bx*s,by*s,bz*s);b.rotation.z=rz;g.add(b)});
  const clusters=[[-.85,3.55,.05,.95],[.75,3.65,.05,1.0],[0,4.15,0,1.15],[-.35,4.45,-.35,.78],[.45,4.35,.38,.82],[-1.15,4.0,.3,.62],[1.1,4.05,-.25,.64]];
  clusters.forEach((p,i)=>{const crown=mesh(new THREE.IcosahedronGeometry(.92*s*p[3],2),leafMats[i%leafMats.length],p[0]*s,p[1]*s,p[2]*s);crown.scale.set(1.12,.82+.14*(i%2),1);crown.rotation.set(i*.13,i*.47,i*.09);g.add(crown)});
  addObstacle(x,z,1.45*s,1.45*s,.2);
 }
 function shrubCluster(x,z,s=1,flowers=true){const g=new THREE.Group();g.name='v21Shrub';g.position.set(x,0,z);world.add(g);const parts=[[-.34,.34,0,.48],[.28,.4,.12,.55],[0,.52,-.28,.5],[-.05,.62,.22,.42]];parts.forEach((p,i)=>{const b=mesh(new THREE.IcosahedronGeometry(p[3]*s,2),shrubMats[i%3],p[0]*s,p[1]*s,p[2]*s);b.scale.set(1,.8+Math.random()*.22,1);b.rotation.y=i*.8;g.add(b)});if(flowers){for(let i=0;i<5;i++){const a=i/5*Math.PI*2,r=.34*s;const stem=mesh(new THREE.CylinderGeometry(.018,.024,.3*s,6),shrubMats[0],Math.cos(a)*r,.65*s,Math.sin(a)*r);g.add(stem);const bloom=mesh(new THREE.SphereGeometry(.075*s,7,5),flowerMats[i%flowerMats.length],Math.cos(a)*r,.82*s,Math.sin(a)*r);g.add(bloom)}}addObstacle(x,z,1.05*s,1.05*s,.12)}
 // Árvores adicionais nas bordas: copas assimétricas e troncos ramificados deixam a praça menos artificial.
 [[-36,8,1.05],[36,8,1.05],[-31,22,1.1],[31,22,1.1],[-27,-4,.9],[27,-4,.9],[-18,22,.92],[18,22,.92]].forEach(p=>organicTree(...p));
 // Vegetação baixa em grupos irregulares, mantendo livres os principais corredores de circulação.
 [[-20,8.1,1.0],[-18.5,8.15,.8],[-21.5,8,.82],[20,8.1,1],[18.5,8.15,.8],[21.5,8,.82],[-22,-6.7,.82],[-20.7,-6.65,.72],[22,-6.7,.82],[20.7,-6.65,.72],[-10,15,.78],[10,15,.78],[-29,4,.8],[29,4,.8]].forEach(p=>shrubCluster(...p));
 // Colisões pontuais para elementos centrais e laterais que o avatar não deve sobrepor visualmente.
 [[-7.45,7.15,3.8,1.55],[7.45,7.15,3.8,1.55],[-7.65,-2.65,3.8,1.55],[7.65,-2.65,3.8,1.55]].forEach(o=>addObstacle(...o,.28));
 [[-12,1],[-6,6],[11,3],[16,8],[-7.45,7.15]].forEach(([x,z])=>addObstacle(x,z,1.55,1.55,.28));
 [[-9,-3],[9,-3],[-9,13],[9,13],[-12,-5],[12,-5],[-18,4],[18,4],[-12,12],[12,12],[-8,-18],[8,-18]].forEach(([x,z])=>addObstacle(x,z,1.0,1.0,.2));
 [-27,-19,-12,-4,5,13,20,28].forEach(x=>addObstacle(x,-8.8,1.45,1.45,.18));
 // Mantém uma zona física contínua no jardim da fonte, mas sem fechar os corredores entre bancos.
 for(let i=0;i<28;i++){const a=i/28*Math.PI*2,r=6.15;addObstacle(Math.cos(a)*r,2+Math.sin(a)*r,.9,.9,.06)}
 if(status)status.textContent='v0.21: colisão do avatar reforçada e vegetação mais orgânica aplicada.';
}
