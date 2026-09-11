(function(){
  'use strict';
  // Notas não podem ser salvas automaticamente ao perder o foco.
  // O fechamento/salvamento oficial passa obrigatoriamente pelo botão
  // "Salvar notas", que exige o crachá do professor.
  function boot(){
    const table=document.getElementById('gradeTable');
    if(!table)return setTimeout(boot,400);
    if(table.dataset.persistenceBound==='1')return;
    table.dataset.persistenceBound='1';
    window.addEventListener('beforeunload',function(){
      try{if(window.db)localStorage.setItem('horizonte_state',JSON.stringify(window.db))}catch(e){}
    });
  }
  boot();
})();