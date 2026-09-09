(function(){
  'use strict';
  const SUBJECTS=['Português','Matemática','História','Geografia','Biologia','Física','Química','Inglês'];
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const notes=g=>['n1','n2','n3','n4'].map(k=>g?.[k]).filter(v=>v!==''&&v!=null&&!Number.isNaN(Number(v))).map(Number);
  const avg=g=>{const a=notes(g);return a.length?a.reduce((x,y)=>x+y,0)/3:null};
  const status=m=>m==null?['Sem nota','neutral']:m>=6?['Aprovado','ok']:['Recuperação','rec'];
  let originalLogin=null;
  async function studentLogin(){
    const u=String(document.getElementById('loginUser')?.value||'').trim().toLowerCase();
    const p=String(document.getElementById('loginPass')?.value||'');
    if(!u||!p)return alert('Digite o usuário e a senha.');
    try{
      const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({user:u,pass:p})});
      const x=await r.json();
      if(!r.ok||!x.user)throw Error(x.error||'Usuário ou senha inválidos.');
      if(x.user.role!=='student'){
        if(originalLogin)return originalLogin();
        throw Error('Acesso de aluno não identificado.');
      }
      window.me=x.user;
      const sr=await fetch('/api/student',{credentials:'same-origin',cache:'no-store'}),data=await sr.json();
      if(!sr.ok)throw Error(data.error||'Não foi possível carregar seus dados.');
      render(data.student);
    }catch(e){alert(e.message||'Não foi possível entrar.');}
  }
  function render(s){
    const app=document.getElementById('app'),login=document.getElementById('login'),aside=app?.querySelector('aside'),main=app?.querySelector('main');
    if(!app||!main)return;
    login?.classList.add('hidden');app.classList.remove('hidden');
    document.getElementById('userName').textContent=s.name;
    document.getElementById('userRole').textContent='Aluno';
    if(aside)aside.style.display='none';
    const rows=SUBJECTS.map(sub=>{
      const b=[1,2,3].map(p=>avg(s.grades?.[p]?.[sub]||{}));
      const vals=b.filter(v=>v!=null),final=vals.length?vals.reduce((a,c)=>a+c,0)/vals.length:null,z=status(final);
      return `<tr><td><b>${esc(sub)}</b></td>${b.map(v=>`<td>${v==null?'—':v.toFixed(2)}</td>`).join('')}<td><b>${final==null?'—':final.toFixed(2)}</b></td><td><span class="badge ${z[1]}">${z[0]}</span></td></tr>`;
    }).join('');
    main.innerHTML=`<section class="page active"><div class="head"><div><h2>Meu boletim</h2><p>Acesso exclusivo do aluno. Consulta somente leitura.</p></div><button class="gold" onclick="window.print()">Imprimir / PDF</button></div><div class="grid"><div class="card pad"><div>Aluno</div><div style="font-size:20px;font-weight:900;color:var(--n)">${esc(s.name)}</div></div><div class="card pad"><div>Matrícula</div><div class="num">${esc(s.id)}</div></div><div class="card pad"><div>Turma</div><div class="num">${esc(s.class)}</div></div><div class="card pad"><div>Unidade</div><div style="font-size:18px;font-weight:900;color:var(--n)">${esc(s.unit)}</div></div></div><div class="panel" style="margin-top:15px"><div class="ph"><b>Notas e médias</b><span>3 bimestres</span></div><div class="wrap"><table><thead><tr><th>Disciplina</th><th>1º Bim.</th><th>2º Bim.</th><th>3º Bim.</th><th>Final</th><th>Situação</th></tr></thead><tbody>${rows}</tbody></table></div></div><div class="tile" style="margin-top:15px"><b>Permissões do acesso aluno</b><p style="margin:8px 0 0;color:var(--mut)">Visualizar seu boletim e suas notas. Não é permitido lançar, alterar ou excluir notas, frequência, provas ou dados de outros alunos.</p></div></section>`;
  }
  function install(){
    if(typeof window.doLogin==='function'&&!window.doLogin.__studentAccess){originalLogin=window.doLogin;const fn=studentLogin;fn.__studentAccess=true;window.doLogin=fn;}
    if(typeof window.logout==='function'&&!window.logout.__studentAccess){const old=window.logout;window.logout=async function(){if(originalLogin){}return old.apply(this,arguments)};window.logout.__studentAccess=true;}
  }
  install();setInterval(install,500);
})();
