(function(){
  function load(src){return new Promise(function(resolve){var s=document.createElement('script');s.src=src+'?v=20260904';s.onload=resolve;s.onerror=resolve;document.body.appendChild(s)})}
  function css(href){var l=document.createElement('link');l.rel='stylesheet';l.href=href+'?v=20260904';document.head.appendChild(l)}
  css('/visual-theme.css');
  try{Object.defineProperty(window,'__horizonte',{configurable:true,get:function(){return {get db(){return db}}}})}catch(e){window.__horizonte={get db(){return window.db}}}
  load('/enhancements.js').then(function(){return load('/admin-tools.js')}).then(function(){return load('/nav-fix.js')}).then(function(){return load('/provas-v2.js')});
})();