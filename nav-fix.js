(function(){
  function go(page){
    document.querySelectorAll('.page').forEach(function(x){x.classList.toggle('active',x.id===page)})
    document.querySelectorAll('.nav').forEach(function(x){x.classList.toggle('active',x.dataset.page===page)})
    window.scrollTo(0,0)
  }
  let teacherUnlocked=false;
  async function digest(v){const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v));return [...new Uint8Array(d)].map(b=>b.toString(16).padStart(2,'0')).join('')}
  async function teacherAccess(){
    if(teacherUnlocked)return true;
    const code=window.prompt('Credencial do professor:');
    if(code===null)return false;
    const ok=(await digest(code))==='ef7e2166ed4b8315a171b7628a1a9fd79a8bf976e17c98ef0827fc2d9c8ab0db';
    if(!ok){alert('Credencial inválida.');return false}
    teacherUnlocked=true;return true;
  }
  function installGate(){
    if(typeof window.save!=='function'||window.save.__teacherGate)return;
    const original=window.save;
    async function gatedSave(initial){
      const role=(document.getElementById('userRole')?.textContent||'').trim();
      if(role==='Professor'&&!initial){if(!(await teacherAccess()))throw Error('Operação cancelada.');}
      return original.apply(this,arguments);
    }
    gatedSave.__teacherGate=true;window.save=gatedSave;
  }
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.nav[data-page]');if(b){e.preventDefault();go(b.dataset.page);setTimeout(installGate,0)}})
  window.hzGo=go;window.addEventListener('load',()=>setTimeout(installGate,1200));setTimeout(installGate,1600);
})();