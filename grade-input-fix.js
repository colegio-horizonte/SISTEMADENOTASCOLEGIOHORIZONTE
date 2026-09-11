(function(){
  function normalizeInput(i){
    if(!i||!i.classList.contains('gi')&&!i.classList.contains('gradeInput'))return;
    if(i.type==='number'){
      i.type='text';
      i.inputMode='decimal';
      i.autocomplete='off';
      i.setAttribute('aria-label','Nota');
    }
    i.removeAttribute('step');
  }
  function patch(){document.querySelectorAll('#gradeTable input.gi,#gradeTable input.gradeInput').forEach(normalizeInput)}
  function validValue(v,max){if(v==='' )return '';const n=Number(String(v).replace(',','.'));if(!Number.isFinite(n))return null;if(n<0||n>max)return null;return n}
  document.addEventListener('input',function(e){const i=e.target;if(!i.matches('#gradeTable input.gi,#gradeTable input.gradeInput'))return;normalizeInput(i)});
  document.addEventListener('blur',function(e){const i=e.target;if(!i.matches('#gradeTable input.gi,#gradeTable input.gradeInput'))return;const v=i.value.trim();if(v!==''){const n=Number(v.replace(',','.'));if(Number.isFinite(n))i.value=String(n).replace('.',',')}} ,true);
  document.addEventListener('click',function(e){const b=e.target.closest?.('#notas button[onclick="saveGrades()"]');if(!b)return;document.querySelectorAll('#gradeTable input.gi,#gradeTable input.gradeInput').forEach((i)=>{const max=Number(i.max)||10;const v=validValue(i.value.trim(),max);if(v===null&&i.value.trim()!==''){i.focus();throw new Error('A nota deve ser um número válido entre 0 e '+max+'.')}i.value=v===''?'':String(v).replace('.',',')})},true);
  const obs=new MutationObserver(patch);obs.observe(document.getElementById('gradeTable')||document.body,{childList:true,subtree:true});
  patch();setTimeout(patch,300);setTimeout(patch,1000);setTimeout(patch,2500);
})();