(function(){
  const NOTES={
    1126:[3.4,4,8.9,6],1127:[4,4,6.7,4.5],1128:[4,4,7.7,5.7],1129:[3.5,4,7,3.5],1130:[1.6,4,4.7,8.9],
    1131:[5,4,5.8,7.6],1132:[5.7,4,5.6,7.3],1133:[6,4,5,7.7],1134:[4.5,4,5,8.7],1135:[3.4,4,5,9],
    1136:[3.2,4,4.8,8.7],1137:[3.1,4,4.6,8],1138:[4.3,4,3.5,7.7],1139:[5.6,4,3,7],1140:[4.9,4,4.7,7.8],
    1141:[6,4,1.8,8.9],1142:[3.2,4,2.7,8.7],1143:[3.93,4,4.3,8.7],1144:[6,4,9.8,8],1145:[6,4,9,8],
    1146:[6,4,9,8],1147:[6,4,9,8],1148:[5.7,4,8.7,8],1149:[0.98,4,8.6,8],1150:[0.77,4,8.3,8]
  };
  async function boot(){
    if(!window.db||!Array.isArray(db.students)||typeof window.save!=='function'){return setTimeout(boot,500)}
    if(db.__restores?.portugues3B2==='1')return;
    let changed=false;
    for(const [id,vals] of Object.entries(NOTES)){
      const s=db.students.find(x=>String(x.id)===id);
      if(!s)continue;
      s.grades??={};s.grades[2]??={};s.grades[2].Português??={};
      ['n1','n2','n3','n4'].forEach((k,i)=>{if(s.grades[2].Português[k]!==vals[i]){s.grades[2].Português[k]=vals[i];changed=true}});
    }
    db.__restores??={};db.__restores.portugues3B2='1';
    if(changed){
      try{await window.save();window.toast&&toast('Notas do 3º B — Português — 2º bimestre adicionadas ao sistema.')}catch(e){delete db.__restores.portugues3B2;console.error(e)}
    }
  }
  boot();
})();
