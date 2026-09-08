(function(){
  function boot(){
    const table=document.getElementById('gradeTable');
    if(!table||table.dataset.persistenceBound==='1'){if(!table)return setTimeout(boot,400);return;}
    table.dataset.persistenceBound='1';
    let timer=null;
    async function persist(){
      try{if(typeof window.save==='function')await window.save();window.toast&&toast('Nota salva no sistema.')}catch(e){console.error(e);window.toast&&toast('Não foi possível salvar a nota no servidor.');}
    }
    table.addEventListener('input',function(e){
      const i=e.target.closest('.gi');
      if(!i)return;
      clearTimeout(timer);
      timer=setTimeout(persist,450);
    });
    window.addEventListener('beforeunload',function(){
      try{if(window.db)localStorage.setItem('horizonte_state',JSON.stringify(window.db))}catch(e){}
    });
  }
  boot();
})();
