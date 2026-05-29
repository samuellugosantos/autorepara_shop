(function(){
  function getOverlay(){ return document.getElementById('profileOverlay'); }
  function getBody(){ return document.querySelector('#profileOverlay .profile-body'); }

  function setBodyLock(){
    const overlay = getOverlay();
    document.body.classList.toggle('profile-modal-open', !!overlay && overlay.classList.contains('open'));
  }

  function ensureProfileTabsVisible(){
    const tabs = document.querySelector('#profileOverlay .profile-tabs');
    const body = getBody();
    if(tabs){ tabs.style.display = 'flex'; tabs.removeAttribute('hidden'); }
    if(body){ body.style.overflowY = 'auto'; body.removeAttribute('hidden'); }
  }

  function enhanceSummaryCards(){
    const cards = Array.from(document.querySelectorAll('#profileSummaryStats .profile-summary-card'));
    if(!cards.length) return;
    const actions = [
      { tab: 'vehiculos', title: 'Abrir vehículos' },
      { tab: 'reparaciones', title: 'Abrir reparaciones' },
      { tab: 'alertas', title: 'Abrir avisos' },
      { tab: 'vehiculos', title: 'Actualizar kilometraje del vehículo' },
      { tab: 'vehiculos', title: 'Abrir vehículo seleccionado' }
    ];
    cards.forEach((card, index) => {
      const action = actions[index];
      if(!action || card.dataset.profileSummaryEnhanced === '1') return;
      card.dataset.profileSummaryEnhanced = '1';
      card.classList.add('is-clickable');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('title', action.title);
      const run = () => {
        if(typeof window.switchProfileTab === 'function') window.switchProfileTab(action.tab);
        if(index === 3){
          setTimeout(() => document.getElementById('vehicleMileage')?.focus({ preventScroll:false }), 120);
        }
      };
      card.addEventListener('click', run);
      card.addEventListener('keydown', event => {
        if(event.key === 'Enter' || event.key === ' '){ event.preventDefault(); run(); }
      });
    });
  }

  function afterProfileUiChange(){
    setBodyLock();
    ensureProfileTabsVisible();
    enhanceSummaryCards();
    if(typeof window.ensureProfileSidebarLayout === 'function') window.ensureProfileSidebarLayout();
  }

  function patchOpenClose(){
    if(typeof window.openProfilePanel === 'function' && !window.openProfilePanel.__scrollTabsFixedSafe){
      const originalOpen = window.openProfilePanel;
      const wrappedOpen = function(){
        let result;
        try { result = originalOpen.apply(this, arguments); }
        catch(error) { console.error('Profile open failed:', error); }
        setTimeout(afterProfileUiChange, 80);
        return result;
      };
      wrappedOpen.__scrollTabsFixedSafe = true;
      window.openProfilePanel = wrappedOpen;
    }

    if(typeof window.closeProfilePanel === 'function' && !window.closeProfilePanel.__scrollTabsFixedSafe){
      const originalClose = window.closeProfilePanel;
      const wrappedClose = function(){
        let result;
        try { result = originalClose.apply(this, arguments); }
        catch(error) { console.error('Profile close failed:', error); }
        setTimeout(setBodyLock, 40);
        return result;
      };
      wrappedClose.__scrollTabsFixedSafe = true;
      window.closeProfilePanel = wrappedClose;
    }

    if(typeof window.switchProfileTab === 'function' && !window.switchProfileTab.__scrollTabsFixedSafe){
      const originalSwitch = window.switchProfileTab;
      const wrappedSwitch = function(tab){
        let result;
        try { result = originalSwitch.apply(this, arguments); }
        catch(error) { console.error('Profile tab switch failed:', error); }
        setTimeout(() => {
          afterProfileUiChange();
          const body = getBody();
          if(body) body.scrollTop = 0;
        }, 70);
        return result;
      };
      wrappedSwitch.__scrollTabsFixedSafe = true;
      window.switchProfileTab = wrappedSwitch;
    }
  }

  function init(){
    patchOpenClose();
    afterProfileUiChange();
  }

  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);
})();
