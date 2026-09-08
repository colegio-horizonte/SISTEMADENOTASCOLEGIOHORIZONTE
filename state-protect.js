(function(){
  function protect(){
    if(typeof window.save!=='function')return false;
    if(window.save.__horizonteProtected)return true;
    const original=window.save;
    async function safeSave(){
      try{if(window.db)window.db.stateVersion=3}catch(e){}
      return original.apply(this,arguments);
    }
    safeSave.__horizonteProtected=true;
    safeSave.__originalSave=original;
    window.save=safeSave;
    return true;
  }
  function boot(){if(protect())return;setTimeout(boot,250)}
  boot();
})();
