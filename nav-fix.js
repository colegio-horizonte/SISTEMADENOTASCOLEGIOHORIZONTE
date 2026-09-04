(function(){
  function go(page){
    document.querySelectorAll('.page').forEach(function(x){x.classList.toggle('active',x.id===page)})
    document.querySelectorAll('.nav').forEach(function(x){x.classList.toggle('active',x.dataset.page===page)})
    window.scrollTo(0,0)
  }
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.nav[data-page]');if(b){e.preventDefault();go(b.dataset.page)}})
  window.hzGo=go
})();