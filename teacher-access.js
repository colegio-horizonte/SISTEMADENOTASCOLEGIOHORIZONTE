(function(){
  const ACCESS_MESSAGE='Esta ação exige a credencial do professor.';
  let unlocked=false;
  async function unlock(){
    if(unlocked)return true;
    const code=window.prompt('Digite a credencial do professor para lançar/alterar notas e salvar atividades:');
    if(code===null)return false;
    try{
      const r=await fetch('/api/teacher-access',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({code})});
      const x=await r.json().catch(()=>({}));
      if(!r.ok)throw Error(x.error||'Credencial inválida.');
      unlocked=true;
      return true;
    }catch(e){alert(e.message||ACCESS_MESSAGE);return false}
  }
  function install(){
    if(typeof window.save!=='function'||window.save.__teacherGate)return;
    const original=window.save;
    async function gatedSave(initial){
      if(window.me?.role==='professor'&&!initial){
        const ok=await unlock();
        if(!ok)throw Error('Operação cancelada: credencial do professor não validada.');
      }
      return original.apply(this,arguments);
    }
    gatedSave.__teacherGate=true;
    window.save=gatedSave;
    const oldShow=window.showApp;
    if(oldShow&&!oldShow.__teacherGate){
      const f=oldShow;
      window.showApp=async function(){
        const r=await f.apply(this,arguments);
        unlocked=false;
        return r;
      };
      window.showApp.__teacherGate=true;
    }
  }
  window.addEventListener('load',()=>setTimeout(install,1200));
  setTimeout(install,1500);
})();
