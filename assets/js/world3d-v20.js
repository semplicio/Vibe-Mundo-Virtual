// Vibe Mundo Virtual v0.20.0 — fachadas, vitrines e acabamento urbano
import './world3d-v19.js';
import * as THREE from 'three';
const status=document.getElementById('status');
const wait=setInterval(()=>{const world=window.__VIBE_WORLD__,addObstacle=window.__VIBE_ADD_OBSTACLE__;if(!world||!addObstacle)return;clearInterval(wait);build(world,addObstacle);},280);
function build(world,addObstacle){
 const stone=new THREE.MeshStandardMaterial({color:0xcbb99d,roughness:.9}),dark=new THREE.MeshStandardMaterial({color:0x292d30,roughness:.55,metalness:.35}),gold=new THREE.MeshStandardMaterial({color:0xb8893e,roughness:.42,metalness:.55}),wood=new THREE.MeshStandardMaterial({color:0x684326,roughness:.78});
 const glass=new THREE.MeshPhysicalMaterial({color:0xffdca0,emissive:0xffb85a,emissiveIntensity:.28,roughness:.16,metalness:.03,transparent:true,opacity:.82,clearcoat:.7});
 const stores=[[-23,0x31556a,'TECH WORLD'],[-8,0x963d32,'LOJA JP'],[9,0x70417d,'VIBE FASHION'],[24,0x356958,'VIBE STYLE']];
 function sign(text,color){const c=document.createElement('canvas');c.width=768;c.height=180;const q=c.getContext('2d');q.fillStyle='#171a1d';q.roundRect(8,8,752,164,30);q.fill();q.strokeStyle='#d6b66a';q.lineWidth=8;q.stroke();q.fillStyle='#fff';q.font='bold 62px Arial';q.textAlign='center';q.textBaseline='middle';q.fillText(text,384,92);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return new THREE.SpriteMaterial({map:t,transparent:true})}
 stores.forEach(([x,color,name])=>{const g=new THREE.Group();g.name='v20FacadeDetail';g.position.set(x,0,-9.95);world.add(g);const facadeMat=new THREE.MeshStandardMaterial({color,roughness:.78});
  // pilastras e cornija criam profundidade sem substituir as lojas existentes
  [-5.35,5.35].forEach(px=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.48,6.3,.42),stone);p.position.set(px,3.15,.18);p.castShadow=true;g.add(p)});
  const corn=new THREE.Mesh(new THREE.BoxGeometry(11.4,.42,.72),stone);corn.position.set(0,6.18,.12);corn.castShadow=true;g.add(corn);
  const band=new THREE.Mesh(new THREE.BoxGeometry(11.0,.28,.52),facadeMat);band.position.set(0,3.18,.24);g.add(band);
  // vitrines com moldura e profundidade, manequins/silhuetas internas simples
  [-3.55,0,3.55].forEach((px,i)=>{const frame=new THREE.Mesh(new THREE.BoxGeometry(2.65,2.75,.24),dark);frame.position.set(px,1.62,.34);g.add(frame);const win=new THREE.Mesh(new THREE.BoxGeometry(2.35,2.45,.12),glass);win.position.set(px,1.62,.48);g.add(win);const shelf=new THREE.Mesh(new THREE.BoxGeometry(1.7,.09,.3),wood);shelf.position.set(px,.72,.58);g.add(shelf);if(i!==1){const body=new THREE.Mesh(new THREE.CapsuleGeometry(.28,.72,4,8),new THREE.MeshStandardMaterial({color:i?0xc99158:0x536f91,roughness:.8}));body.position.set(px,1.35,.66);g.add(body)}});
  // placa integrada à fachada
  const s=new THREE.Sprite(sign(name,color));s.position.set(0,3.75,.72);s.scale.set(5.6,1.32,1);g.add(s);
  // janelas superiores com pequenas sacadas de ferro
  [-3.6,0,3.6].forEach(px=>{const fr=new THREE.Mesh(new THREE.BoxGeometry(2.0,1.9,.20),dark);fr.position.set(px,5.05,.28);g.add(fr);const w=new THREE.Mesh(new THREE.BoxGeometry(1.72,1.62,.10),new THREE.MeshStandardMaterial({color:0xaed0cf,roughness:.28,metalness:.06}));w.position.set(px,5.05,.4);g.add(w);const rail=new THREE.Mesh(new THREE.BoxGeometry(2.35,.10,.10),dark);rail.position.set(px,4.25,.82);g.add(rail);for(let j=-3;j<=3;j++){const bar=new THREE.Mesh(new THREE.BoxGeometry(.055,.72,.055),dark);bar.position.set(px+j*.31,4.55,.82);g.add(bar)}const box=new THREE.Mesh(new THREE.BoxGeometry(1.9,.3,.45),stone);box.position.set(px,4.08,.68);g.add(box);for(let j=-2;j<=2;j++){const plant=new THREE.Mesh(new THREE.IcosahedronGeometry(.18,1),new THREE.MeshStandardMaterial({color:j%2?0x3d783d:0x55954a,roughness:.95}));plant.position.set(px+j*.32,4.38,.68);g.add(plant)}});
 });
 // mobiliário lateral para quebrar grandes áreas vazias sem bloquear o eixo principal
 function cafe(x,z,rot=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;world.add(g);const top=new THREE.Mesh(new THREE.CylinderGeometry(.72,.72,.09,24),wood);top.position.y=.83;g.add(top);const stem=new THREE.Mesh(new THREE.CylinderGeometry(.07,.09,.8,10),dark);stem.position.y=.4;g.add(stem);for(const sx of[-1.05,1.05]){const chair=new THREE.Mesh(new THREE.BoxGeometry(.55,.12,.55),wood);chair.position.set(sx,.52,0);g.add(chair);const back=new THREE.Mesh(new THREE.BoxGeometry(.55,.75,.10),wood);back.position.set(sx,.88,-.27);g.add(back)}addObstacle(x,z,3.0,1.5,.12)}
 cafe(-15,10,.25);cafe(15,10,-.25);
 // placas de calçada próximas às lojas
 [[-15,-5.4],[15,-5.4]].forEach(([x,z])=>{const g=new THREE.Group();g.position.set(x,0,z);world.add(g);const board=new THREE.Mesh(new THREE.BoxGeometry(1.25,1.45,.10),dark);board.position.y=.92;board.rotation.x=-.12;g.add(board);const leg1=new THREE.Mesh(new THREE.BoxGeometry(.08,.85,.08),gold),leg2=leg1.clone();leg1.position.set(-.48,.42,.1);leg2.position.set(.48,.42,.1);g.add(leg1,leg2);addObstacle(x,z,1.4,.8,.1)});
 if(status)status.textContent='v0.20: fachadas, vitrines, sacadas e mobiliário urbano refinados.';
}
