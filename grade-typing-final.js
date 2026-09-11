(function(){
  function boot(){
    const table=document.getElementById('gradeTable');
    if(!table){return setTimeout(boot,300)}
    if(table.dataset.typingFix==='1')return;
    table.dataset.typingFix='1';
    let active=null;
    function key(i){return String(i.dataset.id)+'|'+String(i.dataset.k)}
    function convert(i){
      if(!i.matches('.gi,.gradeInput'))return;
      if(i.type==='number')i.type='text';
      i.inputMode='decimal';
      i.autocomplete='off';
      i.removeAttribute('step');
    }
    table.addEventListener('focusin',e=>{const i=e.target.closest('.gi,.gradeInput');if(i){convert(i);active={key:key(i),value:i.value,selStart:i.selectionStart};}},true);
    table.addEventListener('input',e=>{const i=e.target.closest('.gi,.gradeInput');if(!i)return;convert(i);active={key:key(i),value:i.value,selStart:i.selectionStart};},true);
    table.addEventListener('keydown',e=>{const i=e.target.closest('.gi,.gradeInput');if(!i)return;if(e.key===','){e.preventDefault();const a=i.selectionStart??i.value.length,b=i.selectionEnd??a;i.setRangeText('.',a,b,'end');active={key:key(i),value:i.value,selStart:i.selectionStart};}},true);
    table.addEventListener('blur',()=>{active=null},true);
    const observer=new MutationObserver(()=>{
      if(!active)return;
      const i=Array.from(table.querySelectorAll('.gi,.gradeInput')).find(x=>key(x)===active.key);
      if(!i)return;
      convert(i);
      if(document.activeElement!==i){i.value=active.value;i.focus();try{i.setSelectionRange(active.selStart,active.selStart)}catch(e){}}
      else active.value=i.value;
    });
    observer.observe(table,{childList:true,subtree:true});
    table.querySelectorAll('.gi,.gradeInput').forEach(convert);
  }
  boot();
})();