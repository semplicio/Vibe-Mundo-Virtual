import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const host=document.getElementById('world3d');
const status=document.getElementById('status');
const panel=document.getElementById('shopPanel');
const title=document.getElementById('shopTitle');
const products=document.getElementById('products');
const interaction=document.getElementById('interaction');
const interactionText=document.getElementById('interactionText');
const interactBtn=document.getElementById('interactBtn');
if(!host) throw new Error('world3d não encontrado');

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x91b96f);
scene.fog=new THREE.Fog(0x91b96f,38,72);
const camera=new THREE.PerspectiveCamera(48,1,.1,150);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
host.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xfff4dc,0x526b45,2.2));
const sun=new THREE.DirectionalLight(0xfff1d0,3.2);sun.position.set(-18,30,15);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-35;sun.shadow.camera.right=35;sun.shadow.camera.top=30;sun.shadow.camera.bottom=-30;scene.add(sun);

const mat=(color,rough=.85)=>new THREE.MeshStandardMaterial({color,roughness:rough});
const box=(w,h,d,color)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));m.castShadow=m.receiveShadow=true;return m};
const cyl=(rt,rb,h,color,n=24)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,n),mat(color));m.castShadow=m.receiveShadow=true;return m};
const group=new THREE.Group();scene.add(group);

const ground=new THREE.Mesh(new THREE.PlaneGeometry(70,46),mat(0x7fa95e));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;group.add(ground);
const stone=mat(0xbab0a2);const road1=new THREE.Mesh(new THREE.PlaneGeometry(70,13),stone);road1.rotation.x=-Math.PI/2;road1.position.y=.012;road1.receiveShadow=true;group.add(road1);const road2=new THREE.Mesh(new THREE.PlaneGeometry(13,46),stone);road2.rotation.x=-Math.PI/2;road2.position.y=.014;road2.receiveShadow=true;group.add(road2);
const grid=new THREE.GridHelper(70,70,0xc9c0b4,0xc9c0b4);grid.position.y=.025;grid.material.opacity=.18;grid.material.transparent=true;group.add(grid);

const obstacles=[];const shops=[];
function obstacle(x,z,w,d,pad=.45){obstacles.push({x,z,w:w+pad*2,d:d+pad*2})}
function addStore(name,x,z,color,awning){const g=new THREE.Group();g.position.set(x,0,z);const body=box(8,5,5.8,color);body.position.y=2.5;g.add(body);const upper=box(7.4,3.8,5.2,0xc99a73);upper.position.set(0,6.8,.15);g.add(upper);for(const wx of [-2.2,0,2.2]){const win=box(1.2,1.55,.12,0x79a9b5);win.position.set(wx,6.9,2.78);g.add(win)}const canopy=box(8.8,.35,2.25,awning);canopy.position.set(0,5.0,3.35);canopy.rotation.x=-.12;g.add(canopy);const glass=box(6.7,2.8,.15,0x365b65);glass.position.set(0,2.2,2.98);g.add(glass);const sign=box(4.5,.75,.25,0x24272b);sign.position.set(0,4.05,3.12);g.add(sign);group.add(g);obstacle(x,z,8.8,6.4,.7);shops.push({name,x,z,entrance:new THREE.Vector3(x,0,z+4.4)});return g}
addStore('Tech World',-20,-12,0x537d91,0x315f7a);addStore('Loja JP',-7,-12,0xa9554b,0xd85c5c);addStore('Vibe Fashion',9,-12,0x7d628e,0x7653a0);addStore('Vibe Style',22,-12,0x936e46,0x3b8a6b);

function tree(x,z,s=1){const g=new THREE.Group();const trunk=cyl(.28,.38,2.2,0x725034,10);trunk.position.y=1.1;g.add(trunk);const crown=new THREE.Mesh(new THREE.SphereGeometry(1.45*s,14,10),mat(0x3d8f45));crown.scale.y=1.2;crown.position.y=3.1;crown.castShadow=true;g.add(crown);g.position.set(x,0,z);group.add(g);obstacle(x,z,2.2*s,2.2*s,.35)}
[[-28,-3],[-27,14],[28,-2],[27,14],[-20,15],[20,15]].forEach(p=>tree(...p));
function lamp(x,z){const g=new THREE.Group();const pole=cyl(.08,.11,3.5,0x24292d,10);pole.position.y=1.75;g.add(pole);const glow=new THREE.PointLight(0xffd87a,1.5,5);glow.position.y=3.6;g.add(glow);const head=new THREE.Mesh(new THREE.SphereGeometry(.24,10,8),mat(0xffd87a));head.position.y=3.55;g.add(head);g.position.set(x,0,z);group.add(g);obstacle(x,z,.6,.6,.25)}
[[-8,-2],[8,-2],[-8,11],[8,11]].forEach(p=>lamp(...p));
function bench(x,z){const g=new THREE.Group();const seat=box(2.8,.3,.75,0x7c4d2b);seat.position.y=.75;g.add(seat);const back=box(2.8,1,.2,0x704426);back.position.set(0,1.25,-.35);g.add(back);g.position.set(x,0,z);group.add(g);obstacle(x,z,3.2,1.3,.25)}
bench(-12,8);bench(12,8);

const fountain=new THREE.Group();const basin=cyl(3.9,4.4,.75,0xd8c4a2,40);basin.position.y=.38;fountain.add(basin);const water=cyl(3.45,3.45,.12,0x42c4df,40);water.position.y=.8;fountain.add(water);const stem=cyl(.45,.65,3.4,0xd9c4a2,20);stem.position.y=2.2;fountain.add(stem);const bowl=cyl(1.55,1.1,.5,0xe0ceb0,28);bowl.position.y=3.35;fountain.add(bowl);fountain.position.set(0,0,2);group.add(fountain);obstacle(0,2,8.8,8.8,.6);

function npc(x,z,color=0x9b5b45){const g=new THREE.Group();const body=cyl(.38,.6,1.6,color,12);body.position.y=1.05;g.add(body);const head=new THREE.Mesh(new THREE.SphereGeometry(.48,16,12),mat(0xd9a57d));head.position.y=2.25;head.castShadow=true;g.add(head);g.position.set(x,0,z);group.add(g);obstacle(x,z,1.2,1.2,.35)}
npc(-11,1,0x8d4770);npc(-5,5,0x3f6d95);npc(10,3,0x456b9d);npc(15,7,0x9b6546);

const avatar=new THREE.Group();const body=cyl(.42,.62,1.7,0x9a3f66,14);body.position.y=1.1;avatar.add(body);const head=new THREE.Mesh(new THREE.SphereGeometry(.52,18,14),mat(0xd8a178));head.position.y=2.35;head.castShadow=true;avatar.add(head);const hair=new THREE.Mesh(new THREE.SphereGeometry(.55,18,10,0,Math.PI*2,0,Math.PI*.55),mat(0x29231f));hair.position.y=2.55;avatar.add(hair);avatar.position.set(0,0,14);group.add(avatar);
const marker=new THREE.Mesh(new THREE.RingGeometry(.55,.8,32),new THREE.MeshBasicMaterial({color:0x3cc8ff,side:THREE.DoubleSide,transparent:true,opacity:.9}));marker.rotation.x=-Math.PI/2;marker.position.y=.05;marker.visible=false;group.add(marker);

const CELL=.75,BOUNDS={minX:-33,maxX:33,minZ:-21,maxZ:21};let path=[],pathIndex=0,moving=false,nearShop=null;const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();
function blocked(x,z){if(x<BOUNDS.minX||x>BOUNDS.maxX||z<BOUNDS.minZ||z>BOUNDS.maxZ)return true;return obstacles.some(o=>Math.abs(x-o.x)<=o.w/2&&Math.abs(z-o.z)<=o.d/2)}
const cell=(x,z)=>({x:Math.round(x/CELL),z:Math.round(z/CELL)}),point=c=>({x:c.x*CELL,z:c.z*CELL}),key=c=>`${c.x},${c.z}`;function free(c){const p=point(c);return !blocked(p.x,p.z)}function nearestFree(c,max=18){if(free(c))return c;for(let r=1;r<=max;r++)for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++){if(Math.abs(dx)!==r&&Math.abs(dz)!==r)continue;const n={x:c.x+dx,z:c.z+dz};if(free(n))return n}return null}
function findPath(sx,sz,tx,tz){const start=nearestFree(cell(sx,sz),5),goal=nearestFree(cell(tx,tz),20);if(!start||!goal)return null;const open=[start],openSet=new Set([key(start)]),came=new Map(),g=new Map([[key(start),0]]),f=new Map([[key(start),Math.hypot(goal.x-start.x,goal.z-start.z)]]),dirs=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];let loops=0;while(open.length&&loops++<18000){let bi=0;for(let i=1;i<open.length;i++)if((f.get(key(open[i]))??Infinity)<(f.get(key(open[bi]))??Infinity))bi=i;const cur=open.splice(bi,1)[0];openSet.delete(key(cur));if(cur.x===goal.x&&cur.z===goal.z){const out=[cur];let k=key(cur);while(came.has(k)){const p=came.get(k);out.push(p);k=key(p)}return out.reverse().map(point)}for(const[dX,dZ]of dirs){const n={x:cur.x+dX,z:cur.z+dZ};if(!free(n))continue;if(dX&&dZ&&(!free({x:cur.x+dX,z:cur.z})||!free({x:cur.x,z:cur.z+dZ})))continue;const nk=key(n),ck=key(cur),tent=(g.get(ck)??Infinity)+(dX&&dZ?1.414:1);if(tent<(g.get(nk)??Infinity)){came.set(nk,cur);g.set(nk,tent);f.set(nk,tent+Math.hypot(goal.x-n.x,goal.z-n.z));if(!openSet.has(nk)){open.push(n);openSet.add(nk)}}}}return null}
function walkTo(x,z){const route=findPath(avatar.position.x,avatar.position.z,x,z);if(!route||route.length<2){status.textContent='Não encontrei uma rota livre até esse ponto.';return}path=route;pathIndex=1;moving=true;const end=route[route.length-1];marker.position.set(end.x,.05,end.z);marker.visible=true;status.textContent='Caminhando até o destino e desviando dos obstáculos...'}
function openShop(name){title.textContent=name;products.replaceChildren();[['⌚','Produto em destaque','R$ 99,90'],['🛍️','Novo produto','R$ 149,90'],['✨','Item virtual','R$ 9,90']].forEach(([i,n,p])=>{const a=document.createElement('article');a.className='product';a.innerHTML=`<div class="product-icon">${i}</div><div class="product-name">${n}</div><div class="product-price">${p}</div><button>Ver produto</button>`;products.appendChild(a)});panel.hidden=false;moving=false;marker.visible=false}
function updateMovement(dt){if(!moving||pathIndex>=path.length)return;const t=path[pathIndex],dx=t.x-avatar.position.x,dz=t.z-avatar.position.z,d=Math.hypot(dx,dz);const speed=4.4;if(d<.12){avatar.position.x=t.x;avatar.position.z=t.z;pathIndex++;if(pathIndex>=path.length){moving=false;marker.visible=false;status.textContent='Destino alcançado.'}return}const step=Math.min(d,speed*dt),nx=avatar.position.x+dx/d*step,nz=avatar.position.z+dz/d*step;if(blocked(nx,nz)){const end=path[path.length-1],reroute=findPath(avatar.position.x,avatar.position.z,end.x,end.z);if(reroute){path=reroute;pathIndex=1;status.textContent='Obstáculo detectado. Nova rota calculada.'}else{moving=false;status.textContent='O caminho ficou bloqueado.'}return}avatar.position.x=nx;avatar.position.z=nz;avatar.rotation.y=Math.atan2(dx,dz);body.rotation.z=Math.sin(performance.now()*.012)*.05}
function updateProximity(){nearShop=null;let best=Infinity;for(const s of shops){const d=avatar.position.distanceTo(s.entrance);if(d<4.2&&d<best){best=d;nearShop=s}}if(interaction){interaction.hidden=!nearShop;if(nearShop)interactionText.textContent=nearShop.name}}
renderer.domElement.addEventListener('pointerdown',e=>{if(!panel.hidden)return;const r=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;ray.setFromCamera(pointer,camera);const hits=ray.intersectObject(ground);if(hits.length)walkTo(hits[0].point.x,hits[0].point.z)});
interactBtn?.addEventListener('click',()=>nearShop&&openShop(nearShop.name));document.getElementById('closeShop')?.addEventListener('click',()=>panel.hidden=true);
window.addEventListener('keydown',e=>{if(!panel.hidden)return;if((e.key==='Enter'||e.key.toLowerCase()==='e')&&nearShop){openShop(nearShop.name);return}const k=e.key.toLowerCase(),s=.8;let dx=0,dz=0;if(k==='w'||k==='arrowup')dz=-s;else if(k==='s'||k==='arrowdown')dz=s;else if(k==='a'||k==='arrowleft')dx=-s;else if(k==='d'||k==='arrowright')dx=s;else return;e.preventDefault();moving=false;marker.visible=false;const nx=avatar.position.x+dx,nz=avatar.position.z+dz;if(!blocked(nx,nz)){avatar.position.x=nx;avatar.position.z=nz}});
function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}window.addEventListener('resize',resize);resize();
const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);updateMovement(dt);updateProximity();const target=new THREE.Vector3(avatar.position.x,0,avatar.position.z);const desired=new THREE.Vector3(target.x+15,22,target.z+22);camera.position.lerp(desired,.055);camera.lookAt(target.x,0,target.z-2);marker.rotation.z+=dt*1.5;renderer.render(scene,camera)}camera.position.set(15,22,36);animate();status.textContent='Modo 3D ativo. Clique no chão para caminhar.';
