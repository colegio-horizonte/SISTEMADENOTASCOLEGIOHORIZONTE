(function(){
  'use strict';
  var REQUIRED='445678';
  var KEY='horizonte_teacher_grade_auth';
  function isTeacher(){return !!(window.me&&window.me.role==='professor')}
  function check(){
    if(!isTeacher()) return true;
    var code=window.prompt('Credencial obrigatória do professor para acessar e alterar notas:');
    if(code===REQUIRED){try{sessionStorage.setItem(KEY,'1')}catch(e){} return true}
    alert('Credencial inválida. Acesso às ferramentas de notas bloqueado.');
    return false;
  }
  function guardNotesNavigation(e){
    var b=e.target.closest&&e.target.closest('.nav[data-page="notas"]');
    if(!b||!isTeacher()) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if(check() && typeof window.hzGo==='function') window.hzGo('notas');
  }
  document.addEventListener('click',guardNotesNavigation,true);
  function installSaveGuard(){
    if(typeof window.saveGrades!=='function') return setTimeout(installSaveGuard,200);
    var original=window.saveGrades;
    if(original.__teacherGuarded) return;
    var guarded=async function(){
      if(isTeacher()&&!check()) return;
      return original.apply(this,arguments);
    };
    guarded.__teacherGuarded=true;
    window.saveGrades=guarded;
  }
  installSaveGuard();
})();
