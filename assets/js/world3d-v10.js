// Vibe Mundo Virtual v0.10.0
// Evolução visual não destrutiva sobre o motor 3D estável da v0.9.
// Mantém movimentação, A*, avatar e lojas; adiciona acabamento urbano via Three.js.

const statusEl=document.getElementById('status');

async function bootV10(){
  try{
    if(statusEl) statusEl.textContent='Carregando Praça Central 3D v0.10...';
    const sourceUrl=new URL('./world3d-v08.js',import.meta.url);
    sourceUrl.searchParams.set('v10',Date.now().toString());
    const response=await fetch(sourceUrl,{cache:'no-store'});
    if(!response.ok) throw new Error(`Falha ao carregar motor 3D: HTTP ${response.status}`);
    let source=await response.text();

    // Soldier.glb: corrige orientação para acompanhar o vetor real de deslocamento.
    source=source.replace('avatarRoot.rotation.y=Math.atan2(dx,dz)','avatarRoot.rotation.y=Math.atan2(dx,dz)+Math.PI');

    // Atmosfera e renderização.
    source=source
      .replace('scene.background=new THREE.Color(0x9fc7e7)','scene.background=new THREE.Color(0xb9ddf2)')
      .replace('scene.fog=new THREE.Fog(0xb9d5e8,48,90)','scene.fog=new THREE.Fog(0xd3e8f2,62,112)')
      .replace('renderer.toneMappingExposure=1.08','renderer.toneMappingExposure=1.16');

    // Injeta detalhes visuais depois da fonte, sem alterar colisões/pathfinding.
    const anchor='function simplePerson(x,z,color=0x86506f)';
    const enhancement=`
function addV10Visuals(){
  // Praça com anéis decorativos e canteiros.
  const stone=new THREE.MeshStandardMaterial({color:0xe1d2b6,roughness:.88});
  const ring=new THREE.Mesh(new THREE.RingGeometry(5.15,6.05,64),stone);ring.rotation.x=-Math.PI/2;ring.position.set(0,.025,2);ring.receiveShadow=true;world.add(ring);
  const grassMat=new THREE.MeshStandardMaterial({color:0x6fa84f,roughness:1});
  for(const [x,z,w,d] of [[-22,13,11,6],[22,13,11,6],[-28,3,8,5],[28,3,8,5]]){
    const bed=new THREE.Mesh(new THREE.BoxGeometry(w,.18,d),grassMat);bed.position.set(x,.09,z);bed.receiveShadow=true;world.add(bed);
  }
  // Flores estilizadas: placeholders 3D próprios, prontos para troca futura por GLB.
  const flowerColors=[0xff5c8a,0xffd24a,0xf3f0e8,0xb76cff];
  [[-25,12],[-22,14],[-19,12],[19,12],[22,14],[25,12],[-29,3],[29,3]].forEach((p,i)=>{
    const stem=cyl(.035,.045,.55,0x347b3f,8);stem.position.set(p[0],.3,p[1]);world.add(stem);
    const bloom=new THREE.Mesh(new THREE.SphereGeometry(.16,10,8),new THREE.MeshStandardMaterial({color:flowerColors[i%flowerColors.length],roughness:.7}));bloom.position.set(p[0],.62,p[1]);bloom.castShadow=true;world.add(bloom);
  });
  // Vasos e lixeiras urbanas.
  for(const [x,z] of [[-16,5],[16,5],[-16,16],[16,16]]){
    const pot=cyl(.45,.58,.55,0x9a6545,16);pot.position.set(x,.28,z);world.add(pot);
    const bush=new THREE.Mesh(new THREE.SphereGeometry(.72,14,10),new THREE.MeshStandardMaterial({color:0x4f9847,roughness:.9}));bush.position.set(x,1.0,z);bush.castShadow=true;world.add(bush);
  }
  // Placas flutuantes das lojas para tornar a cidade legível mesmo antes dos GLBs finais.
  const labels=[['TECH WORLD',-23,-10.9,0x315f7a],['LOJA JP',-8,-10.9,0xd85c5c],['VIBE FASHION',9,-10.9,0x7952a0],['VIBE STYLE',24,-10.9,0x3d896b]];
  labels.forEach(([name,x,z,c])=>{
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle='#101820';ctx.roundRect(8,8,496,112,24);ctx.fill();ctx.strokeStyle='#ffffff';ctx.lineWidth=5;ctx.stroke();ctx.fillStyle='#ffffff';ctx.font='bold 48px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(name,256,64);
    const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;const sm=new THREE.SpriteMaterial({map:tex,transparent:true});const sp=new THREE.Sprite(sm);sp.position.set(x,6.1,z);sp.scale.set(5.5,1.38,1);world.add(sp);
  });
  // Portal Vibe B&S ao fundo: marco visual da cidade.
  const gate=new THREE.Group();
  const gm=new THREE.MeshStandardMaterial({color:0x334b61,roughness:.7,metalness:.08});
  for(const x of[-4.2,4.2]){const pillar=new THREE.Mesh(new THREE.BoxGeometry(1.15,6.5,1.15),gm);pillar.position.set(x,3.25,0);pillar.castShadow=true;gate.add(pillar)}
  const top=new THREE.Mesh(new THREE.BoxGeometry(9.6,1.1,1.3),gm);top.position.y=6.1;top.castShadow=true;gate.add(top);
  const signCanvas=document.createElement('canvas');signCanvas.width=768;signCanvas.height=160;const sctx=signCanvas.getContext('2d');sctx.fillStyle='#17232d';sctx.fillRect(0,0,768,160);sctx.fillStyle='#f7c95c';sctx.font='bold 66px Arial';sctx.textAlign='center';sctx.textBaseline='middle';sctx.fillText('VIBE B&S',384,80);const st=new THREE.CanvasTexture(signCanvas);st.colorSpace=THREE.SRGBColorSpace;const ss=new THREE.Sprite(new THREE.SpriteMaterial({map:st}));ss.position.set(0,6.2,.75);ss.scale.set(7.2,1.5,1);gate.add(ss);gate.position.set(0,0,-24);world.add(gate);
}
addV10Visuals();
`;
    if(source.includes(anchor)) source=source.replace(anchor,enhancement+'\n'+anchor);
    else console.warn('[Vibe v0.10] Âncora visual não encontrada; iniciando motor base.');

    const blob=new Blob([source],{type:'text/javascript'});const moduleUrl=URL.createObjectURL(blob);
    try{await import(moduleUrl);if(statusEl) statusEl.textContent='Praça Central 3D v0.10 carregada.';}finally{URL.revokeObjectURL(moduleUrl)}
  }catch(error){console.error('[Vibe v0.10] Erro:',error);if(statusEl)statusEl.textContent='Falha ao carregar o Mundo Virtual 3D. Recarregue a página.';}
}
bootV10();