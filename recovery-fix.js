(function(){
  const SUBJECTS=['Português','Matemática','História','Geografia','Biologia','Física','Química','Inglês'];
  const D=()=>window.__horizonte?.db||window.db;
  const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  function avg(s,p,sub){const o=s?.recoveryOverrides?.[p]?.[sub];if(o!=null)return Number(o);const g=s?.grades?.[p]?.[sub]||{};const a=['n1','n2','n3','n4'].map(k=>g[k]).filter(v=>v!==''&&v!=null&&!Number.isNaN(Number(v))).map(Number);return a.length?a.reduce((x,y)=>x+y,0)/3:null}
  function setup(){
    const page=document.getElementById('recuperacao'); if(!page)return false;
    const box=page.querySelector('#recoveryAverageBox'); const save=page.querySelector('#recoverySave'); const student=page.querySelector('#recoveryStudent'); const period=page.querySelector('#recoveryPeriod'); const subject=page.querySelector('#recoverySubject');
    if(!box||!save||!student||!period||!subject)return false;
    if(page.dataset.recoveryFix==='1')return true; page.dataset.recoveryFix='1';
    const old=page.querySelector('.head p'); if(old)old.textContent='Salve o aluno na recuperação informando a matéria, a unidade e a média recuperada. A média aprovada será aplicada diretamente ao boletim da unidade escolhida.';
    const label=box.querySelector('label b'); if(label)label.textContent='Média recuperada (0 a 10)';
    save.textContent='💾 Salvar aluno na recuperação';
    const note=document.createElement('div'); note.id='recoveryAppliedHint'; note.className='muted'; note.style.margin='8px 0 0'; save.parentNode.insertBefore(note,save);
    function update(){const d=D(),s=d?.students?.find(x=>String(x.id)===String(student.value)),p=Number(period.value),sub=subject.value; if(!s||!sub){note.textContent='';return} const v=avg(s,p,sub);note.textContent='Unidade selecionada: '+p+'ª Unidade · Matéria: '+sub+' · Média atual: '+(v==null?'sem nota':v.toFixed(2));}
    [student,period,subject].forEach(e=>e.addEventListener('change',update)); update();
    save.addEventListener('click',async function(e){
      e.preventDefault(); e.stopImmediatePropagation();
      const d=D(),s=d?.students?.find(x=>String(x.id)===String(student.value)),p=Number(period.value),sub=subject.value,status=page.dataset.status,a=Number(page.querySelector('#recoveryAverage')?.value);
      if(!s)return alert('Selecione o aluno pela matrícula.');
      if(!sub)return alert('Selecione a matéria.');
      if(![1,2,3].includes(p))return alert('Selecione a unidade em que a recuperação foi realizada.');
      if(!status)return alert('Escolha Aprovar, Recuperação ou Reprovar.');
      if(!Number.isFinite(a)||a<0||a>10)return alert('Informe a média recuperada entre 0 e 10.');
      s.recoveryResults??={}; s.recoveryResults[p]??={}; s.recoveryResults[p][sub]={status,average:a,savedAt:new Date().toISOString()};
      s.recoverySubjects??={}; s.recoverySubjects[p]??=[]; if(!s.recoverySubjects[p].includes(sub))s.recoverySubjects[p].push(sub);
      s.recoveryOverrides??={}; s.recoveryOverrides[p]??={};
      if(status==='aprovado')s.recoveryOverrides[p][sub]=a; else delete s.recoveryOverrides[p][sub];
      try{await window.save(); update(); if(typeof window.hzOpenStudentProfile==='function')window.hzOpenStudentProfile(s); window.toast&&toast('Aluno salvo na recuperação. Média da '+p+'ª unidade registrada e boletim atualizado.');}catch(err){alert(err?.message||'Não foi possível salvar o aluno na recuperação.');}
    },true);
    return true;
  }
  function boot(){if(!setup())setTimeout(boot,300)}
  window.addEventListener('load',()=>setTimeout(boot,600)); boot();
})();
