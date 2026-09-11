(function(){
  'use strict';
  function D(){return window.__horizonte?.db||window.db}
  function patchPeriod(){
    const p=document.getElementById('gradePeriod');
    if(!p)return;
    const current=p.value||'3';
    const html='<option value="1">1º Bimestre — Fechado</option><option value="2">2º Bimestre — Aberto</option><option value="3">3º Bimestre — Aberto</option>';
    if(p.innerHTML!==html){p.innerHTML=html}
    if(['1','2','3'].includes(current))p.value=current;
  }
  function askBadge(){
    return new Promise(resolve=>{
      const old=document.getElementById('teacherBadgeModal');
      if(old)old.remove();
      const m=document.createElement('div');
      m.id='teacherBadgeModal';
      m.style='position:fixed;inset:0;background:rgba(0,0,0,.55);display:grid;place-items:center;padding:20px;z-index:99999';
      m.innerHTML='<div style="background:#fff;border-radius:14px;padding:24px;width:min(430px,100%);box-shadow:0 20px 60px rgba(0,0,0,.3)"><h3 style="margin:0 0 8px;color:#09284b">Crachá do professor</h3><p style="margin:0 0 14px;color:#64748b">Para fechar/salvar as notas, o crachá do professor é obrigatório. Se o crachá usar leitor, passe o crachá com o cursor neste campo.</p><input id="teacherBadgeInput" type="text" inputmode="numeric" autocomplete="off" autofocus placeholder="Leia ou digite o código do crachá" style="width:100%;box-sizing:border-box;padding:12px;border:1px solid #cbd5e1;border-radius:8px"><div style="display:flex;gap:8px;justify-content:flex-end;margin-top:14px"><button id="teacherBadgeCancel" type="button" class="outline">Cancelar</button><button id="teacherBadgeOk" type="button" class="primary" style="width:auto">Confirmar e fechar notas</button></div></div>';
      document.body.appendChild(m);
      const input=m.querySelector('#teacherBadgeInput');
      input.focus();
      const finish=ok=>{
        const badge=input.value.trim();
        m.remove();
        resolve(ok&&badge?badge:null);
      };
      m.querySelector('#teacherBadgeCancel').onclick=()=>finish(false);
      m.querySelector('#teacherBadgeOk').onclick=()=>finish(true);
      input.addEventListener('keydown',e=>{
        if(e.key==='Enter'){e.preventDefault();finish(true)}
        if(e.key==='Escape')finish(false);
      });
    });
  }
  async function saveGradesWithBadge(){
    const d=D();
    const per=document.getElementById('gradePeriod');
    const sub=document.getElementById('gradeSubject');
    if(!d||!per||!sub)return;
    const p=Number(per.value);
    if(p===1){alert('O 1º bimestre está fechado.');return}
    const badge=await askBadge();
    const CRAchaO_OFICIAL='PROF2026';
    if(badge!==CRAchaO_OFICIAL){alert('Crachá inválido. Informe o código oficial do professor.');return}
    if(!badge){alert('O crachá do professor é obrigatório para fechar/salvar as notas.');return}
    const inputs=[...document.querySelectorAll('#gradeTable .gi:not(:disabled),#gradeTable .gradeInput:not(:disabled)')];
    for(const i of inputs){
      const max=10;
      const raw=String(i.value??'').trim().replace(',','.');
      if(raw==='')continue;
      const n=Number(raw);
      if(!Number.isFinite(n)||n<0||n>max){
        i.focus();
        alert('Nota inválida. Informe um valor entre 0 e 10.');
        return;
      }
    }
    inputs.forEach(i=>{
      const s=d.students.find(x=>String(x.id)===String(i.dataset.id));
      if(!s)return;
      s.grades??={};
      s.grades[p]??={};
      s.grades[p][sub.value]??={};
      const raw=String(i.value??'').trim().replace(',','.');
      s.grades[p][sub.value][i.dataset.k]=raw===''?'':Number(raw);
    });
    try{
      await window.save();
      window.__teacherBadge=badge;
      window.toast?.('Notas salvas/fechadas com crachá do professor.');
      // Atualiza apenas os valores calculados sem reconstruir a tabela durante a edição.
      const table=document.getElementById('gradeTable');
      if(table){
        table.querySelectorAll('.gi,.gradeInput').forEach(i=>{
          const s=d.students.find(x=>String(x.id)===String(i.dataset.id));
          const g=s?.grades?.[p]?.[sub.value];
          if(g&&g[i.dataset.k]!=null)i.value=String(g[i.dataset.k]);
        });
      }
    }catch(e){
      alert(e.message||'Falha ao salvar as notas.');
    }
  }
  function install(){
    if(!D()?.students)return false;
    patchPeriod();
    window.saveGrades=saveGradesWithBadge;
    const p=document.getElementById('gradePeriod');
    if(p&&!p.dataset.badgePolicyBound){
      p.dataset.badgePolicyBound='1';
      p.addEventListener('change',patchPeriod);
    }
    return true;
  }
  function boot(){
    if(!install())setTimeout(boot,300);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
  window.addEventListener('load',()=>setTimeout(install,500));
})();