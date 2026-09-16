// Vibe Mundo Virtual v0.11.1
// Mantém o motor 3D v0.10, adiciona Avatar Vibe e publica o bridge do cenário para as próximas camadas.
import './world3d-v10.js';

const statusEl=document.getElementById('status');
const avatarBtn=document.getElementById('avatarBtn');
const sceneEl=document.getElementById('scene');

// O motor v0.10 é carregado dinamicamente. Localiza a cena e o grupo principal após o boot
// sem interferir no A*, animações ou eventos já estáveis.
(function exposeWorldBridge(){
  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    const canvas=document.querySelector('#world3d canvas');
    if(canvas && window.__VIBE_SCENE__ && window.__VIBE_WORLD__) clearInterval(timer);
    if(tries>40) clearInterval(timer);
  },250);
})();

const state={skin:'#c98f68',hair:'#2b211d',shirt:'#315f8f',pants:'#26364f',shoes:'#20242a',hat:false};
function createCustomizer(){
  const panel=document.createElement('aside');panel.id='avatarCustomizer';panel.className='avatar-customizer';panel.hidden=true;
  panel.innerHTML=`<div class="avatar-customizer-head"><div><h2>Meu Avatar</h2><p>Personalização Vibe</p></div><button type="button" data-close>×</button></div><div class="avatar-preview"><div class="preview-head"><i></i><b></b></div><div class="preview-body"></div><div class="preview-legs"><i></i><i></i></div><div class="preview-shoes"><i></i><i></i></div></div><div class="avatar-options"><label>Pele<input type="color" data-part="skin" value="${state.skin}"></label><label>Cabelo<input type="color" data-part="hair" value="${state.hair}"></label><label>Camiseta<input type="color" data-part="shirt" value="${state.shirt}"></label><label>Calça<input type="color" data-part="pants" value="${state.pants}"></label><label>Tênis<input type="color" data-part="shoes" value="${state.shoes}"></label><label class="hat-option"><input type="checkbox" data-part="hat"> Boné</label></div><button type="button" class="save-avatar">Salvar visual</button><small>Estrutura preparada para produtos virtuais das lojas.</small>`;
  sceneEl.appendChild(panel);
  const update=()=>{panel.style.setProperty('--skin',state.skin);panel.style.setProperty('--hair',state.hair);panel.style.setProperty('--shirt',state.shirt);panel.style.setProperty('--pants',state.pants);panel.style.setProperty('--shoes',state.shoes);panel.classList.toggle('has-hat',state.hat)};
  panel.querySelectorAll('[data-part]').forEach(el=>el.addEventListener('input',()=>{const p=el.dataset.part;state[p]=el.type==='checkbox'?el.checked:el.value;update()}));
  panel.querySelector('[data-close]').onclick=()=>panel.hidden=true;
  panel.querySelector('.save-avatar').onclick=()=>{localStorage.setItem('vibe-avatar-v1',JSON.stringify(state));panel.hidden=true;if(statusEl)statusEl.textContent='Visual do avatar salvo neste dispositivo.'};
  try{Object.assign(state,JSON.parse(localStorage.getItem('vibe-avatar-v1')||'{}'))}catch(e){}
  panel.querySelectorAll('input[type=color]').forEach(el=>el.value=state[el.dataset.part]);panel.querySelector('[data-part=hat]').checked=!!state.hat;update();return panel;
}
const customizer=createCustomizer();
if(avatarBtn)avatarBtn.addEventListener('click',()=>{customizer.hidden=!customizer.hidden;if(!customizer.hidden&&statusEl)statusEl.textContent='Personalize o Avatar Vibe e salve seu visual.'});
