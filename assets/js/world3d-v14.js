// Vibe Mundo Virtual v0.14.0 — Pavimentação histórica e mobiliário circular
import './world3d-v13.js';
import * as THREE from 'three';

const status=document.getElementById('status');
const wait=setInterval(()=>{const world=window.__VIBE_WORLD__;if(!world)return;clearInterval(wait);buildHistoricGround(world);},180);

function buildHistoricGround(world){
  const stoneMat=new THREE.MeshStandardMaterial({color:0x817a70,roughness:.97,metalness:0});
  const stoneAlt=new THREE.MeshStandardMaterial({color:0x948a7c,roughness:.96});
  const mortar=new THREE.MeshStandardMaterial({color:0x5f5b55,roughness:1});
  const curbMat=new THREE.MeshStandardMaterial({color:0xb8ad99,roughness:.94});
  const sidewalkMat=new THREE.MeshStandardMaterial({color:0xc8baa1,roughness:.96});
  const wood=new THREE.MeshStandardMaterial({color:0x74421f,roughness:.76});
  const iron=new THREE.MeshStandardMaterial({color:0x17191a,roughness:.4,metalness:.72});

  // Base escura entre as pedras para dar profundidade às juntas.
  const base=new THREE.Mesh(new THREE.CircleGeometry(31.5,96),mortar);base.rotation.x=-Math.PI/2;base.position.set(0,.035,2);base.receiveShadow=true;world.add(base);

  // Paralelepípedos individuais, levemente irregulares, formando a praça antiga.
  const cobbles=new THREE.Group();cobbles.name='historicCobblestones';
  const size=.72,gap=.09,extent=30;
  for(let x=-extent;x<=extent;x+=size+gap){
    for(let z=-extent;z<=extent;z+=size+gap){
      const dx=x,dz=z-2;if(dx*dx+dz*dz>31*31)continue;
      // Mantém um pequeno respiro imediato sob a fonte para o acabamento circular existente.
      if(dx*dx+dz*dz<6.7*6.7)continue;
      const g=new THREE.BoxGeometry(size*(.88+Math.random()*.12),.10,size*(.82+Math.random()*.15));
      const p=new THREE.Mesh(g,Math.random()>.58?stoneAlt:stoneMat);
      p.position.set(x+(Math.random()-.5)*.08,.09,z+(Math.random()-.5)*.08);
      p.rotation.y=(Math.random()-.5)*.08;p.receiveShadow=true;cobbles.add(p);
    }
  }
  world.add(cobbles);

  // Faixa de calçada e meio-fio ao redor do núcleo da praça.
  const sidewalk=new THREE.Mesh(new THREE.RingGeometry(31.7,35.2,96),sidewalkMat);sidewalk.rotation.x=-Math.PI/2;sidewalk.position.set(0,.075,2);sidewalk.receiveShadow=true;world.add(sidewalk);
  const curb=new THREE.Mesh(new THREE.RingGeometry(31.2,31.85,96),curbMat);curb.rotation.x=-Math.PI/2;curb.position.set(0,.145,2);curb.receiveShadow=true;world.add(curb);
  // Segunda linha fina simula pedra de acabamento do acostamento/calçada.
  const curbOuter=new THREE.Mesh(new THREE.RingGeometry(35.0,35.45,96),curbMat);curbOuter.rotation.x=-Math.PI/2;curbOuter.position.set(0,.12,2);world.add(curbOuter);

  // Caminhos radiais em pedra mais clara até as lojas/portal.
  [[0,-1.25,9,22],[-Math.PI/2,-18,2,8],[Math.PI/2,18,2,8]].forEach(([rot,x,z,w],i)=>{
    const path=new THREE.Mesh(new THREE.BoxGeometry(i?8:9,.055,i?18:22),sidewalkMat);path.position.set(x,.13,z);path.rotation.y=rot;path.receiveShadow=true;world.add(path);
  });

  // Bancos curvos planejados acompanhando o círculo da fonte.
  function curvedBench(start,end,radius){
    const group=new THREE.Group();group.name='curvedFountainBench';
    const segments=14;
    for(let i=0;i<segments;i++){
      const t0=start+(end-start)*i/segments,t1=start+(end-start)*(i+1)/segments,tm=(t0+t1)/2;
      const len=radius*(t1-t0)*.98;
      const x=Math.cos(tm)*radius,z=2+Math.sin(tm)*radius;
      const seat=new THREE.Mesh(new THREE.BoxGeometry(len,.18,.72),wood);seat.position.set(x,.7,z);seat.rotation.y=-tm;seat.castShadow=seat.receiveShadow=true;group.add(seat);
      const back=new THREE.Mesh(new THREE.BoxGeometry(len,.75,.14),wood);back.position.set(Math.cos(tm)*(radius+.34),1.18,2+Math.sin(tm)*(radius+.34));back.rotation.y=-tm;back.rotation.x=-.06;back.castShadow=true;group.add(back);
      if(i%3===0){const leg=new THREE.Mesh(new THREE.BoxGeometry(.12,.72,.5),iron);leg.position.set(x,.35,z);leg.rotation.y=-tm;group.add(leg)}
    }
    world.add(group);return group;
  }
  // Quatro módulos deixam acessos livres entre os bancos.
  curvedBench(.18,.98,7.55);curvedBench(1.75,2.55,7.55);curvedBench(3.32,4.12,7.55);curvedBench(4.89,5.69,7.55);

  // Pequenas pedras de borda ao redor do jardim da fonte.
  const borderMat=new THREE.MeshStandardMaterial({color:0xa89c88,roughness:.96});
  for(let i=0;i<56;i++){const a=i/56*Math.PI*2,r=6.75;const block=new THREE.Mesh(new THREE.BoxGeometry(.68,.34,.48),borderMat);block.position.set(Math.cos(a)*r,.2,2+Math.sin(a)*r);block.rotation.y=-a;block.castShadow=block.receiveShadow=true;world.add(block)}

  if(status)status.textContent='Praça histórica carregada: paralelepípedos, calçadas, meio-fio e bancos curvos.';
}
