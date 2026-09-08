(function(){
  const SUBJECTS=['Português','Matemática','História','Geografia','Biologia','Física','Química','Inglês'];
  const D=()=>window.__horizonte?.db||window.db;
  const saveDb=()=>typeof window.save==='function'?window.save():Promise.resolve();
  const getStudent=id=>(D()?.students||[]).find(s=>String(s.id)===String(id));
  function bindRecovery(){
    const btn=document.getElementById('recoverySave');
    if(!btn||btn.dataset.directRecovery==='1')return;
    btn.dataset.directRecovery='1';
    btn.addEventListener('click',async function(e){
      e.preventDefault();e.stopImmediatePropagation();
      const d=D(),s=getStudent(document.getElementById('recoveryStudent')?.value),p=Number(document.getElementById('recoveryPeriod')?.value),sub=document.getElementById('recoverySubject')?.value,status=document.getElementById('recuperacao')?.dataset.status,a=Number(document.getElementById('recoveryAverage')?.value);
      if(!s)return alert('Selecione um aluno.');
      if(!sub)return alert('Selecione a matéria.');
      if(!status)return alert('Escolha a situação.');
      if(!Number.isFinite(a)||a<0||a>10)return alert('Informe uma média entre 0 e 10.');
      s.recoveryResults??={};s.recoveryResults[p]??={};
      s.recoveryResults[p][sub]={status,average:a,savedAt:new Date().toISOString()};
      s.recoverySubjects??={};s.recoverySubjects[p]??=[];
      if(!s.recoverySubjects[p].includes(sub))s.recoverySubjects[p].push(sub);
      if(status==='aprovado'){
        s.recoveryOverrides??={};s.recoveryOverrides[p]??={};
        s.recoveryOverrides[p][sub]=a;
      }else if(s.recoveryOverrides?.[p]){
        delete s.recoveryOverrides[p][sub];
      }
      try{await saveDb();
        const gradeTable=document.getElementById('gradeTable');if(gradeTable)gradeTable.dataset.horizonteSig='';
        if(typeof window.renderGrades==='function')window.renderGrades();
        if(typeof window.hzOpenStudentProfile==='function')window.hzOpenStudentProfile(s);
        window.toast&&toast(status==='aprovado'?'Recuperação aprovada e média aplicada ao boletim do aluno!':'Registro de recuperação salvo!');
      }catch(err){alert(err?.message||'Não foi possível salvar.')}
    },true);
  }
  function bindGrades(){
    const table=document.getElementById('gradeTable');if(!table||table.dataset.directSync==='1')return;table.dataset.directSync='1';
    table.addEventListener('input',e=>{
      const i=e.target.closest('.gi');if(!i)return;
      const d=D(),s=getStudent(i.dataset.id),p=Number(document.getElementById('gradePeriod')?.value),sub=document.getElementById('gradeSubject')?.value;if(!s||!p||!sub)return;
      s.grades??={};s.grades[p]??={};s.grades[p][sub]??={};s.grades[p][sub][i.dataset.k]=i.value===''?'':Number(i.value);
      // O mesmo objeto de aluno é usado pelo perfil/boletim; a persistência ocorre no Salvar.
      const profile=document.getElementById('alunoPerfil');if(profile&&profile.classList.contains('active')&&typeof window.hzOpenStudentProfile==='function')window.hzOpenStudentProfile(s);
    });
  }
  function boot(){bindRecovery();bindGrades();setTimeout(boot,700)}
  window.addEventListener('load',()=>setTimeout(boot,400));boot();
})();