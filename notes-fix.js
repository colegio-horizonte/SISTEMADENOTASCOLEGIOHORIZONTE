(function(){
  const SUBJECTS=['Português','Matemática','História','Geografia','Biologia','Física','Química','Inglês'];
  const MAX=[6,5,10,9];
  const SECOND_UNIT_NOTES={1001:[4.5,3.1,7.8,4.7],1002:[3.3,4,3.4,8.2],1003:[4,5.4,7.1,6],1004:[2.8,2.5,5.6,7.1],1005:[3.5,1.2,8.8,4.3],1006:[4.5,5.6,4.4,2.3],1007:[2.8,2.7,5.6,5],1008:[5.1,7.7,7,8.8],1009:[3.4,4.6,7,2.1],1010:[2.5,4,8.2,1.3],1011:[4.6,3.5,3.3,1.9],1012:[5.6,4,3.3,5.8],1013:[2.7,2.1,1.1,5.3],1014:[4.3,3.1,4.5,7.1],1015:[5,1.7,3.2,4.4],1016:[1.4,2.3,6.7,5.9],1017:[1.1,.9,3.1,.7],1018:[1.2,1.4,2,8.8],1019:[2.2,1.2,7.7,5.6],1020:[1.1,.7,5.6,8],1021:[5.3,5.6,8.9,7.4],1022:[4,5.1,4.3,6],1023:[3.5,5.3,4,4.5],1024:[1.1,2.3,1.8,8.9],1025:[4.7,6.7,6.2,5.4]};
  function D(){return window.__horizonte?.db||window.db}
  function total(g){const a=['n1','n2','n3','n4'].map(k=>g?.[k]).filter(v=>v!==''&&v!=null&&!Number.isNaN(Number(v))).map(Number);return a.length?a.reduce((x,y)=>x+y,0):null}
  function avg(g){const t=total(g);return t==null?null:t/3}
  function unitAvg(s,p){const a=SUBJECTS.map(sub=>avg(s.grades?.[p]?.[sub]||{})).filter(v=>v!=null);return a.length?a.reduce((x,y)=>x+y,0)/a.length:null}
  function sit(unit,subjectTotal,manual){if(manual==='aprovado')return['Aprovado','ok'];if(manual==='recuperacao')return['Recuperação','rec'];if(manual==='reprovado')return['Reprovado','bad'];if(subjectTotal==null||unit==null)return['Sem nota','neutral'];return subjectTotal>=15?['Aprovado','ok']:['Recuperação','rec']}
  function esc(s){return String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]))}
  async function seedSecondUnit(d){let changed=false;for(const [id,vals] of Object.entries(SECOND_UNIT_NOTES)){const s=d.students.find(x=>String(x.id)===String(id));if(!s)continue;s.grades??={};s.grades[2]??={};s.grades[2].Português??={};const g=s.grades[2].Português;const keys=['n1','n2','n3','n4'];keys.forEach((k,i)=>{if(g[k]!==vals[i]){g[k]=vals[i];changed=true}})}if(changed&&typeof window.save==='function'){try{await window.save()}catch(e){console.warn('Não foi possível salvar automaticamente as notas da 2ª unidade.',e)}}}
  function patchPeriod(per){if(!per)return;const v=per.value;const wanted='<option value="1">1º Bimestre — Fechado</option><option value="2">2º Bimestre — Aberto</option><option value="3">3º Bimestre — Aberto</option>';if(per.innerHTML!==wanted)per.innerHTML=wanted;if(v==='2'||v==='3')per.value=v;}
  function patchHeader(table){const tr=table?.closest('table')?.querySelector('thead tr');if(!tr)return;tr.innerHTML='<th>Aluno</th><th>Nota 1 <small>(6)</small></th><th>Nota 2 <small>(5)</small></th><th>Nota 3 <small>(10)</small></th><th>Nota 4 <small>(9)</small></th><th>Total / 30</th><th>Média da Disciplina</th><th>Média da Unidade</th><th>Situação</th>';}
  function injectRecoveryTab(){
    const aside=document.querySelector('aside'),main=document.querySelector('main');
    if(!aside||!main)return false;
    let nav=document.getElementById('recoveryNav');
    if(!nav){
      nav=document.createElement('button');nav.id='recoveryNav';nav.className='nav';nav.dataset.page='recuperacao';nav.type='button';nav.textContent='🛟 Recuperação';aside.appendChild(nav);
      nav.addEventListener('click',openRecovery);
    }
    let page=document.getElementById('recuperacao');
    if(!page){
      page=document.createElement('section');page.id='recuperacao';page.className='page';main.appendChild(page);
    }
    return true;
  }
  function openRecovery(){
    injectRecoveryTab();
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    document.querySelectorAll('.nav').forEach(n=>n.classList.remove('active'));
    const nav=document.getElementById('recoveryNav'),page=document.getElementById('recuperacao');
    nav?.classList.add('active');page?.classList.add('active');renderRecovery();
  }
  function closeRecoveryIfOtherPage(){
    if(!document.getElementById('recuperacao')?.classList.contains('active'))return;
    document.getElementById('recoveryNav')?.classList.remove('active');
  }
  function renderRecovery(){
    const d=D();if(!d||!Array.isArray(d.students))return;
    injectRecoveryTab();
    const page=document.getElementById('recuperacao');
    const oldQuery=document.getElementById('recoverySearch')?.value||'';
    const oldId=document.getElementById('recoveryStudent')?.value||'';
    const oldStatus=page.dataset.status||'';
    const oldAvg=page.dataset.average||'';
    const q=oldQuery.trim().toLowerCase();
    const filtered=d.students.filter(s=>!q||String(s.name||'').toLowerCase().includes(q)||String(s.id).includes(q));
    page.innerHTML='<div class="head"><div><h2>Recuperação</h2><p>Busque o aluno, escolha a situação e informe a média final.</p></div></div>'+
      '<div class="panel" style="margin-bottom:15px"><div class="pad">'+
      '<div class="field" style="margin-top:0"><label><b>1. Buscar aluno</b></label><input id="recoverySearch" placeholder="Digite o nome ou matrícula do aluno..." value="'+esc(oldQuery)+'"></div>'+
      '<div class="field"><label>Aluno encontrado</label><select id="recoveryStudent"><option value="">Selecione o aluno...</option>'+filtered.map(s=>'<option value="'+esc(s.id)+'">'+esc(s.name)+' — '+esc(s.id)+'</option>').join('')+'</select></div>'+
      '<div style="font-weight:800;margin:18px 0 9px">2. Escolha a situação</div>'+
      '<div style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" id="recoveryApprove" class="gold" style="background:#15803d">✓ Aprovar</button><button type="button" id="recoveryRecovery" class="gold" style="background:#d97706">↻ Recuperação</button><button type="button" id="recoveryFail" class="gold" style="background:#be123c">✕ Reprovar</button></div>'+
      '<div id="recoveryChosen" style="margin-top:12px;color:#64748b;font-size:13px">'+(oldStatus?'Situação escolhida: '+({aprovado:'Aprovado',recuperacao:'Recuperação',reprovado:'Reprovado'}[oldStatus]||oldStatus):'Nenhuma situação escolhida ainda.')+'</div>'+
      '<div id="recoveryAverageBox" class="field" style="display:'+(oldStatus?'flex':'none')+';max-width:280px;margin-top:16px"><label><b>3. Média</b></label><input id="recoveryAverage" type="number" min="0" max="10" step="0.01" placeholder="Ex.: 7,50" value="'+esc(oldAvg)+'"><small style="color:#64748b">Informe a média do aluno, de 0 a 10.</small></div>'+
      '<button type="button" id="recoverySave" class="primary" style="max-width:240px;margin-top:10px;display:'+(oldStatus?'block':'none')+'">Salvar situação e média</button>'+ 
      '<div id="recoveryCurrent" style="margin-top:12px"></div></div></div>'+ 
      '<div class="panel"><div class="ph"><b>Registros de recuperação</b></div><div class="wrap"><table><thead><tr><th>Aluno</th><th>Situação</th><th>Média</th></tr></thead><tbody id="recoveryTable"></tbody></table></div></div>';
    const sel=document.getElementById('recoveryStudent');if(oldId&&filtered.some(s=>String(s.id)===String(oldId)))sel.value=oldId;
    const search=document.getElementById('recoverySearch');
    function choose(v){page.dataset.status=v;const labels={aprovado:'Aprovado',recuperacao:'Recuperação',reprovado:'Reprovado'};document.getElementById('recoveryChosen').textContent='Situação escolhida: '+labels[v];document.getElementById('recoveryAverageBox').style.display='flex';document.getElementById('recoverySave').style.display='block';}
    function current(){const s=d.students.find(x=>String(x.id)===String(sel.value));const r=s?.recoveryStatus;document.getElementById('recoveryCurrent').innerHTML=s?(r?'<div class="tile"><b>Registro atual:</b> '+esc({aprovado:'Aprovado',recuperacao:'Recuperação',reprovado:'Reprovado'}[r.status]||r.status)+' com média <b>'+Number(r.average).toFixed(2)+'</b></div>':'<div style="color:#64748b">Este aluno ainda não possui situação registrada nesta aba.</div>'):''}
    search.oninput=()=>{const v=search.value;page.dataset.status='';page.dataset.average='';renderRecovery();setTimeout(()=>{const s=document.getElementById('recoveryStudent');const matches=d.students.filter(x=>String(x.name||'').toLowerCase().includes(v.trim().toLowerCase())||String(x.id).includes(v.trim()));if(matches.length===1)s.value=String(matches[0].id);current()},0)};
    sel.onchange=()=>{const s=d.students.find(x=>String(x.id)===String(sel.value));const r=s?.recoveryStatus;if(r){page.dataset.status=r.status;page.dataset.average=r.average;document.getElementById('recoveryAverage').value=r.average;choose(r.status)}current()};
    document.getElementById('recoveryApprove').onclick=()=>choose('aprovado');document.getElementById('recoveryRecovery').onclick=()=>choose('recuperacao');document.getElementById('recoveryFail').onclick=()=>choose('reprovado');
    document.getElementById('recoverySave').onclick=async()=>{const s=d.students.find(x=>String(x.id)===String(sel.value));const status=page.dataset.status;const a=Number(document.getElementById('recoveryAverage').value);if(!s)return alert('Busque e selecione um aluno primeiro.');if(!status)return alert('Escolha Aprovar, Recuperação ou Reprovar.');if(!Number.isFinite(a)||a<0||a>10)return alert('Informe uma média válida entre 0 e 10.');const old=s.recoveryStatus;s.recoveryStatus={status,average:a};s.manualStatus=status;try{await window.save();page.dataset.average=String(a);renderRecovery();window.toast&&toast('Situação e média salvas com sucesso!')}catch(e){s.recoveryStatus=old;alert(e.message||'Não foi possível salvar o registro.')}};
    const rows=d.students.filter(s=>s.recoveryStatus).map(s=>{const r=s.recoveryStatus;const label={aprovado:'Aprovado',recuperacao:'Recuperação',reprovado:'Reprovado'}[r.status]||r.status;const cls=r.status==='aprovado'?'ok':r.status==='reprovado'?'bad':'rec';return '<tr><td><b>'+esc(s.name)+'</b><br><small>'+esc(s.id)+'</small></td><td><span class="badge '+cls+'">'+label+'</span></td><td><b>'+Number(r.average).toFixed(2)+'</b></td></tr>'}).join('');
    document.getElementById('recoveryTable').innerHTML=rows||'<tr><td colspan="3">Nenhum registro salvo.</td></tr>';
    current();
  }
  function injectStatusPanel(cl){return;}
  function render(){const d=D(),table=document.getElementById('gradeTable'),cl=document.getElementById('gradeClass'),sub=document.getElementById('gradeSubject'),per=document.getElementById('gradePeriod');if(!d||!Array.isArray(d.students)||!table||!cl||!sub||!per)return;patchPeriod(per);patchHeader(table);const p=Number(per.value),subject=sub.value,students=d.students.filter(x=>x.class===cl.value);table.innerHTML=students.map(s=>{const g=s.grades?.[p]?.[subject]||{},t=total(g),m=avg(g),u=unitAvg(s,p),z=sit(u,t,s.manualStatus);return '<tr><td><b>'+esc(s.name)+'</b><br><small>'+esc(s.id)+'</small></td>'+['n1','n2','n3','n4'].map((k,i)=>'<td><input class="gi" data-id="'+esc(s.id)+'" data-k="'+k+'" type="number" min="0" max="'+MAX[i]+'" step=".1" value="'+(g[k]??'')+'" '+(p===1?'disabled':'')+'></td>').join('')+'<td><strong>'+(t==null?'—':t.toFixed(1))+' / 30</strong></td><td><strong>'+(m==null?'—':m.toFixed(2))+'</strong></td><td><strong>'+(u==null?'—':u.toFixed(2))+'</strong></td><td><span class="badge '+z[1]+'">'+z[0]+'</span></td></tr>'}).join('')||'<tr><td colspan="9">Nenhum aluno.</td></tr>'}
  window.renderGrades=render;
  window.saveGrades=async function(){const d=D(),per=document.getElementById('gradePeriod'),sub=document.getElementById('gradeSubject');if(!d||!per||!sub)return;const p=Number(per.value);if(p===1)return window.toast?toast('O 1º bimestre está fechado.'):alert('O 1º bimestre está fechado.');document.querySelectorAll('#gradeTable .gi').forEach(i=>{const s=d.students.find(x=>String(x.id)===String(i.dataset.id));if(!s)return;s.grades??={};s.grades[p]??={};s.grades[p][sub.value]??={};s.grades[p][sub.value][i.dataset.k]=i.value===''?'':Number(i.value)});try{await window.save();render();window.toast&&toast('Notas salvas! Cada nota respeita seu valor máximo: 6, 5, 10 e 9.')}catch(e){alert(e.message||'Não foi possível salvar as notas.')}}
  async function boot(){const d=D();if(!d||!Array.isArray(d.students)){return setTimeout(boot,300)}await seedSecondUnit(d);const per=document.getElementById('gradePeriod');patchPeriod(per);if(per&&!per.dataset.horizonteChange){per.dataset.horizonteChange='1';per.addEventListener('change',()=>setTimeout(render,0))}injectRecoveryTab();render();}
  setTimeout(boot,1200);setTimeout(boot,3000);setTimeout(boot,6000);
})();