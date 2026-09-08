// Busca de alunos por nome ou matrícula
(function(){
  function boot(){
    if(typeof window.renderStudents==='function' && !window.renderStudents.__matriculaSearch){
      const original=window.renderStudents;
      function normalized(v){return String(v??'').toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
      function wrapped(){
        original.apply(this,arguments);
        const input=document.getElementById('studentSearch');
        const term=normalized(input?.value).trim();
        if(!term)return;
        const students=window.db?.students||window.__horizonte?.db?.students||[];
        const table=document.getElementById('studentTable');
        if(!table)return;
        Array.from(table.querySelectorAll('tr')).forEach(tr=>{
          const cells=tr.querySelectorAll('td');
          if(cells.length<4)return;
          const name=normalized(cells[0].textContent);
          const enrollment=normalized(cells[3].textContent);
          const student=students.find(s=>normalized(s.name)===name || String(s.id)===String(enrollment).trim());
          const match=student ? normalized(student.name).includes(term)||normalized(student.id).includes(term) : name.includes(term)||enrollment.includes(term);
          tr.style.display=match?'':'none';
        });
      }
      wrapped.__matriculaSearch=true;
      window.renderStudents=wrapped;
    }
    const input=document.getElementById('studentSearch');
    if(input&&!input.dataset.enrollmentPlaceholder){input.placeholder='Pesquisar por nome ou matrícula...';input.dataset.enrollmentPlaceholder='1'}
    setTimeout(boot,700);
  }
  boot();
})();
