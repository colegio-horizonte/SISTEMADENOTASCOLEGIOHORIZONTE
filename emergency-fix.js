(function(){
  function fix(){
    var p=document.getElementById('gradePeriod');
    if(p){var v=p.value;var w='<option value="1">1º Bimestre — Fechado</option><option value="2">2º Bimestre — Aberto</option><option value="3">3º Bimestre — Aberto</option>';if(p.innerHTML!==w)p.innerHTML=w;if(v==='2'||v==='3')p.value=v;}
    document.querySelectorAll('.nav.admin').forEach(function(x){
      fetch('/api/me',{credentials:'same-origin',cache:'no-store'}).then(function(r){return r.ok?r.json():null}).then(function(x){if(x&&x.user&&x.user.role==='admin')x.classList.remove('hidden')}).catch(function(){});
    });
  }
  fix();setInterval(fix,1000);
})();
