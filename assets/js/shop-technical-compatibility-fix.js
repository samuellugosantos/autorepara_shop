(function(){
  function cleanupCompatibilityBadges(){
    document.querySelectorAll('.product-card').forEach(card => {
      const mainBadges = card.querySelectorAll('.vehicle-fit-badge');
      if(mainBadges.length > 1){
        Array.from(mainBadges).slice(1).forEach(b => b.remove());
      }
      const hasMain = card.querySelector('.vehicle-fit-badge');
      if(hasMain){
        card.querySelectorAll('.compatibility-badge-row').forEach(row => row.remove());
      }
      const status = card.dataset.compatStatus || '';
      if(status === 'exact') card.classList.add('is-verified-fit');
      if(status === 'verify') card.classList.add('requires-fit-check');
    });
  }
  const originalRenderStore = window.renderStore;
  if(typeof originalRenderStore === 'function'){
    window.renderStore = async function(...args){
      const result = await originalRenderStore.apply(this,args);
      cleanupCompatibilityBadges();
      return result;
    };
  }
  document.addEventListener('DOMContentLoaded', cleanupCompatibilityBadges);
  document.addEventListener('click', function(){ setTimeout(cleanupCompatibilityBadges, 50); }, true);
})();
