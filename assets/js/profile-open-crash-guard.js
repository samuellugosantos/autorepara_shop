(function(){
  function openOverlayDirectly(){
    const overlay = document.getElementById('profileOverlay');
    if(!overlay) return;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('profile-modal-open');
    if(typeof window.ensureProfileSidebarLayout === 'function') window.ensureProfileSidebarLayout();
    const tabs = document.querySelector('#profileOverlay .profile-tabs');
    const body = document.querySelector('#profileOverlay .profile-body');
    if(tabs){ tabs.style.display = 'flex'; tabs.removeAttribute('hidden'); }
    if(body){ body.removeAttribute('hidden'); body.scrollTop = 0; }
  }

  function closeOverlayDirectly(){
    const overlay = document.getElementById('profileOverlay');
    if(!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('profile-modal-open');
  }

  function switchTabDirectly(tab){
    if(!tab) tab = 'resumen';
    document.querySelectorAll('#profileOverlay .profile-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.profileTab === tab);
    });
    document.querySelectorAll('#profileOverlay .profile-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === 'profile-panel-' + tab);
    });
    const body = document.querySelector('#profileOverlay .profile-body');
    if(body) body.scrollTop = 0;
  }

  function patch(){
    if(typeof window.openProfilePanel === 'function' && !window.openProfilePanel.__crashGuard){
      const originalOpen = window.openProfilePanel;
      const guardedOpen = function(){
        let result;
        try {
          result = originalOpen.apply(this, arguments);
          if(result && typeof result.catch === 'function') {
            result.catch(error => console.error('Async profile open failed:', error));
          }
        } catch(error) {
          console.error('Profile open crashed, using safe fallback:', error);
        }
        openOverlayDirectly();
        setTimeout(openOverlayDirectly, 100);
        setTimeout(() => window.dispatchEvent(new CustomEvent('autorepara:profile-opened')), 120);
        return result;
      };
      guardedOpen.__crashGuard = true;
      window.openProfilePanel = guardedOpen;
    }

    if(typeof window.closeProfilePanel === 'function' && !window.closeProfilePanel.__crashGuard){
      const originalClose = window.closeProfilePanel;
      const guardedClose = function(){
        try { return originalClose.apply(this, arguments); }
        catch(error) { console.error('Profile close crashed, using safe fallback:', error); }
        finally { closeOverlayDirectly(); }
      };
      guardedClose.__crashGuard = true;
      window.closeProfilePanel = guardedClose;
    }

    if(typeof window.switchProfileTab === 'function' && !window.switchProfileTab.__crashGuard){
      const originalSwitch = window.switchProfileTab;
      const guardedSwitch = function(tab){
        let result;
        try { result = originalSwitch.apply(this, arguments); }
        catch(error) { console.error('Profile tab switch crashed, using safe fallback:', error); }
        switchTabDirectly(tab);
        if(typeof window.ensureProfileSidebarLayout === 'function') setTimeout(window.ensureProfileSidebarLayout, 30);
        return result;
      };
      guardedSwitch.__crashGuard = true;
      window.switchProfileTab = guardedSwitch;
    }
  }

  document.addEventListener('DOMContentLoaded', patch);
  window.addEventListener('load', patch);
  setTimeout(patch, 300);
  setTimeout(patch, 1200);
})();
