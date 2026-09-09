(function(){
  'use strict';
  const SUBJECTS=['Português','Matemática','História','Geografia','Biologia','Física','Química','Inglês'];
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const D=()=>window.__horizonte?.db||window.db;
  const go=page=>{document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.id===page));document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('active',x.dataset.page===page));window.scrollTo(0,0)};
  function ensureData(){const d=D();if(!d)return false;d.observations??=[];d.activities??=[];return true}
  function classes(){return D()?.classes||[]}
  function students(){return D()?.students||[]}
  function page(){let p=document.getElementById('observacoesAtividades');if(!p){p=document.createElement('section');p.id='observacoesAtividades';p.className='page';document.querySelector('main')?.appendChild(p)}return p}
  function render(){
    if(!ensureData())return;
    const p=page(),cs=classes(),ss=students();
    p.innerHTML=`<div class="head"><div><h2>Observações e Atividades</h2><p>Registre acompanhamento pedagógico e atividades das turmas.</p></div><button class="gold" id="oaRefresh">Atualizar</button></div>
    <div class="grid2">
      <div class="panel"><div class="ph"><b>📝 Nova observação</b><span>Aluno individual</span></div><div class="pad">
        <div class="field"><label><b>Turma</b></label><select id="oaObsClass"><option value="">Selecione...</option>${cs.map(c=>`<option value="${esc(c.id)}">${esc(c.name||c.id)}</option>`).join('')}</select></div>
        <div class="field"><label><b>Aluno</b></label><select id="oaObsStudent"><option value="">Selecione a turma primeiro...</option></select></div>
        <div class="grid2"><div class="field"><label><b>Matéria</b></label><select id="oaObsSubject"><option value="">Geral</option>${SUBJECTS.map(s=>`<option>${esc(s)}</option>`).join('')}</select></div><div class="field"><label><b>Bimestre</b></label><select id="oaObsPeriod"><option value="1">1º</option><option value="2">2º</option><option value="3">3º</option></select></div></div>
        <div class="field"><label><b>Observação</b></label><textarea id="oaObsText" rows="5" placeholder="Ex.: Participa bem das aulas, precisa reforçar a interpretação de textos..."></textarea></div>
        <button class="primary" id="oaSaveObs">Salvar observação</button>
      </div></div>
      <div class="panel"><div class="ph"><b>📚 Nova atividade</b><span>Turma inteira</span></div><div class="pad">
        <div class="field"><label><b>Turma</b></label><select id="oaActClass"><option value="">Selecione...</option>${cs.map(c=>`<option value="${esc(c.id)}">${esc(c.name||c.id)}</option>`).join('')}</select></div>
        <div class="grid2"><div class="field"><label><b>Matéria</b></label><select id="oaActSubject">${SUBJECTS.map(s=>`<option>${esc(s)}</option>`).join('')}</select></div><div class="field"><label><b>Data de entrega</b></label><input id="oaActDate" type="date"></div></div>
        <div class="field"><label><b>Título</b></label><input id="oaActTitle" placeholder="Ex.: Lista de exercícios — Função quadrática"></div>
        <div class="field"><label><b>Descrição</b></label><textarea id="oaActDesc" rows="5" placeholder="Orientações, páginas, critérios, materiais etc."></textarea></div>
        <button class="primary" id="oaSaveAct">Salvar atividade</button>
      </div></div>
    </div>
    <div class="panel" style="margin-top:15px"><div class="ph"><b>Histórico de observações</b><span>${D().observations.length} registro(s)</span></div><div class="wrap"><table><thead><tr><th>Data</th><th>Aluno</th><th>Turma</th><th>Matéria</th><th>Bim.</th><th>Observação</th></tr></thead><tbody id="oaObsList">${D().observations.slice().reverse().map(o=>{const s=ss.find(x=>String(x.id)===String(o.studentId));return `<tr><td>${o.createdAt?new Date(o.createdAt).toLocaleDateString('pt-BR'):'—'}</td><td><b>${esc(s?.name||o.studentId)}</b><br><small>${esc(o.studentId)}</small></td><td>${esc(s?.class||'—')}</td><td>${esc(o.subject||'Geral')}</td><td>${esc(o.period||'—')}º</td><td>${esc(o.text)}</td></tr>`}).join('')||'<tr><td colspan="6">Nenhuma observação registrada.</td></tr>'}</tbody></table></div></div>
    <div class="panel" style="margin-top:15px"><div class="ph"><b>Atividades cadastradas</b><span>${D().activities.length} atividade(s)</span></div><div class="wrap"><table><thead><tr><th>Data</th><th>Turma</th><th>Matéria</th><th>Título</th><th>Descrição</th></tr></thead><tbody>${D().activities.slice().reverse().map(a=>`<tr><td>${a.date?new Date(a.date+'T00:00:00').toLocaleDateString('pt-BR'):'—'}</td><td>${esc(a.classId)}</td><td>${esc(a.subject)}</td><td><b>${esc(a.title)}</b></td><td>${esc(a.description)}</td></tr>`).join('')||'<tr><td colspan="5">Nenhuma atividade cadastrada.</td></tr>'}</tbody></table></div></div>`;
    const oc=document.getElementById('oaObsClass'),os=document.getElementById('oaObsStudent');
    oc.onchange=()=>{const id=oc.value;os.innerHTML='<option value="">Selecione...</option>'+ss.filter(s=>String(s.class)===String(id)).map(s=>`<option value="${esc(s.id)}">${esc(s.name)} — ${esc(s.id)}</option>`).join('')};
    document.getElementById('oaSaveObs').onclick=async()=>{const studentId=os.value,text=document.getElementById('oaObsText').value.trim();if(!studentId||!text){alert('Selecione o aluno e escreva a observação.');return}D().observations.push({id:'obs-'+Date.now(),studentId,subject:document.getElementById('oaObsSubject').value,period:Number(document.getElementById('oaObsPeriod').value),text,author:window.me?.name||'',createdAt:new Date().toISOString()});try{await window.save();render();go('observacoesAtividades');window.toast?.('Observação salva com sucesso!')}catch(e){alert(e.message||'Não foi possível salvar.')}};
    document.getElementById('oaSaveAct').onclick=async()=>{const classId=document.getElementById('oaActClass').value,title=document.getElementById('oaActTitle').value.trim(),description=document.getElementById('oaActDesc').value.trim();if(!classId||!title){alert('Selecione a turma e informe o título da atividade.');return}D().activities.push({id:'act-'+Date.now(),classId,subject:document.getElementById('oaActSubject').value,date:document.getElementById('oaActDate').value,title,description,author:window.me?.name||'',createdAt:new Date().toISOString()});try{await window.save();render();go('observacoesAtividades');window.toast?.('Atividade salva com sucesso!')}catch(e){alert(e.message||'Não foi possível salvar.')}};
    document.getElementById('oaRefresh').onclick=render;
  }
  function install(){
    if(!document.querySelector('aside')||document.getElementById('oaNav'))return;
    const nav=document.querySelector('aside');
    const b=document.createElement('button');b.id='oaNav';b.className='nav';b.dataset.page='observacoesAtividades';b.textContent='📌 Observações e Atividades';nav.appendChild(b);
    b.addEventListener('click',e=>{e.preventDefault();render();go('observacoesAtividades')});
    document.addEventListener('click',e=>{const n=e.target.closest?.('.nav[data-page]');if(n&&n.dataset.page==='observacoesAtividades'){e.preventDefault();render();go('observacoesAtividades')}});
  }
  function boot(){install();if(document.getElementById('oaNav')){}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,700),{once:true});else setTimeout(boot,700);
})();
