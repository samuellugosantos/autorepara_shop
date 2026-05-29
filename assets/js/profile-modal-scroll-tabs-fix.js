(function(){
  function getOverlay(){ return document.getElementById('profileOverlay'); }
  function getModal(){ return document.querySelector('#profileOverlay .profile-modal'); }

  function setBodyLock(){
    const overlay = getOverlay();
    document.body.classList.toggle('profile-modal-open', !!overlay && overlay.classList.contains('open'));
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
        if(index === 3) {
          setTimeout(() => {
            const mileage = document.getElementById('vehicleMileage');
            if(mileage) mileage.focus({ preventScroll: false });
          }, 120);
        }
      };
      card.addEventListener('click', run);
      card.addEventListener('keydown', (event) => {
        if(event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          run();
        }
      });
    });
  }

  function ensureProfileTabsVisible(){
    const tabs = document.querySelector('#profileOverlay .profile-tabs');
    const body = document.querySelector('#profileOverlay .profile-body');
    if(tabs) {
      tabs.style.display = 'flex';
      tabs.removeAttribute('hidden');
    }
    if(body) {
      body.style.overflowY = 'auto';
    }
  }

  function patchOpenClose(){
    if(typeof window.openProfilePanel === 'function' && !window.openProfilePanel.__scrollTabsFixed){
      const originalOpen = window.openProfilePanel;
      const wrappedOpen = function(){
        const result = originalOpen.apply(this, arguments);
        setTimeout(() => {
          setBodyLock();
          ensureProfileTabsVisible();
          enhanceSummaryCards();
        }, 80);
        return result;
      };
      wrappedOpen.__scrollTabsFixed = true;
      window.openProfilePanel = wrappedOpen;
    }
    if(typeof window.closeProfilePanel === 'function' && !window.closeProfilePanel.__scrollTabsFixed){
      const originalClose = window.closeProfilePanel;
      const wrappedClose = function(){
        const result = originalClose.apply(this, arguments);
        setTimeout(setBodyLock, 40);
        return result;
      };
      wrappedClose.__scrollTabsFixed = true;
      window.closeProfilePanel = wrappedClose;
    }
    if(typeof window.switchProfileTab === 'function' && !window.switchProfileTab.__scrollTabsFixed){
      const originalSwitch = window.switchProfileTab;
      const wrappedSwitch = function(tab){
        const result = originalSwitch.apply(this, arguments);
        setTimeout(() => {
          ensureProfileTabsVisible();
          enhanceSummaryCards();
          const body = document.querySelector('#profileOverlay .profile-body');
          if(body) body.scrollTop = 0;
        }, 70);
        return result;
      };
      wrappedSwitch.__scrollTabsFixed = true;
      window.switchProfileTab = wrappedSwitch;
    }
  }

  function setupScrollContainment(){
    const overlay = getOverlay();
    if(!overlay || overlay.dataset.scrollContainmentFixed === '1') return;
    overlay.dataset.scrollContainmentFixed = '1';

    overlay.addEventListener('wheel', (event) => {
      const modal = getModal();
      if(!modal || !modal.contains(event.target)) {
        event.preventDefault();
      }
    }, { passive: false });

    overlay.addEventListener('touchmove', (event) => {
      const modal = getModal();
      if(!modal || !modal.contains(event.target)) {
        event.preventDefault();
      }
    }, { passive: false });

    const observer = new MutationObserver(() => {
      setBodyLock();
      ensureProfileTabsVisible();
      enhanceSummaryCards();
    });
    observer.observe(overlay, { attributes: true, attributeFilter: ['class'], subtree: true, childList: true });
  }

  function init(){
    patchOpenClose();
    setupScrollContainment();
    setBodyLock();
    ensureProfileTabsVisible();
    enhanceSummaryCards();
  }

  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);
  setTimeout(init, 300);
  setTimeout(init, 1000);
})();
