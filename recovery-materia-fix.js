(function(){
  const SUBJECTS=['Português','Matemática','História','Geografia','Biologia','Física','Química','Inglês'];
  function boot(){
    const page=document.getElementById('recuperacao');
    if(!page)return setTimeout(boot,500);
    let subject=document.getElementById('recoverySubject');
    if(!subject){
      const field=document.createElement('div');field.className='field';
      field.innerHTML='<label><b>Matéria</b></label><select id="recoverySubject"><option value="">Selecione a matéria...</option>'+SUBJECTS.map(s=>'<option value="'+s+'">'+s+'</option>').join('')+'</select>';
      const avg=document.getElementById('recoveryCurrent');
      if(avg)avg.before(field);else page.querySelector('.pad')?.appendChild(field);
      subject=field.querySelector('#recoverySubject');
    }
    if(subject.options.length<9){const current=subject.value;subject.innerHTML='<option value="">Selecione a matéria...</option>'+SUBJECTS.map(s=>'<option value="'+s+'">'+s+'</option>').join('');subject.value=current}
    subject.disabled=false;subject.style.display='block';
    const label=subject.parentElement?.querySelector('label');if(label)label.innerHTML='<b>Matéria</b>';
    page.dataset.recoveryMateriaReady='1';
    setTimeout(boot,1000);
  }
  boot();
})();
