(function(){
  function boot(){
    const table=document.getElementById('gradeTable');
    if(!table||table.dataset.persistenceBound==='1'){if(!table)return setTimeout(boot,400);return;}
    table.dataset.persistenceBound='1';
    let timer=null;
    async function persist(){
      try{if(typeof window.save==='function')await window.save();window.toast&&toast('Nota salva no sistema.')}catch(e){console.error(e);window.toast&&toast('Não foi possível salvar a nota no servidor.');}
    }
    // Nunca salve enquanto o usuário ainda está digitando: o save pode reconstruir a tabela
    // e remover o input que está recebendo foco. Salve somente depois que o campo perder o foco.
    table.addEventListener('focusout',function(e){
      const i=e.target.closest('.gi,.gradeInput');
      if(!i)return;
      clearTimeout(timer);
      timer=setTimeout(persist,250);
    });
    table.addEventListener('change',function(e){
      const i=e.target.closest('.gi,.gradeInput');
      if(!i)return;
      clearTimeout(timer);
      timer=setTimeout(persist,250);
    });
    window.addEventListener('beforeunload',function(){
      try{if(window.db)localStorage.setItem('horizonte_state',JSON.stringify(window.db))}catch(e){}
    });
  }
  boot();
})();