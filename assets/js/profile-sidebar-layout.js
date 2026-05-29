(function(){
  function getModal(){ return document.querySelector('#profileOverlay .profile-modal'); }

  function ensureSidebarLayout(){
    const modal = getModal();
    if(!modal) return;

    const tabs = modal.querySelector('.profile-tabs');
    const body = modal.querySelector('.profile-body');
    if(!tabs || !body) return;

    let main = modal.querySelector('.profile-main-layout');
    let sidebar = modal.querySelector('.profile-sidebar');

    if(!main){
      main = document.createElement('div');
      main.className = 'profile-main-layout';
      modal.appendChild(main);
    }

    if(!sidebar){
      sidebar = document.createElement('aside');
      sidebar.className = 'profile-sidebar';
      sidebar.setAttribute('aria-label', 'Perfil y navegación');
      main.appendChild(sidebar);
    }

    if(!sidebar.querySelector('.profile-sidebar-title')){
      const title = document.createElement('div');
      title.className = 'profile-sidebar-title';
      title.innerHTML = 'Panel personal<strong>Mi <span>garaje</span></strong>';
      sidebar.insertBefore(title, sidebar.firstChild);
    }

    const authBox = modal.querySelector('#profileAuthBox');
    if(authBox && authBox.parentElement !== sidebar){
      const title = sidebar.querySelector('.profile-sidebar-title');
      title ? title.insertAdjacentElement('afterend', authBox) : sidebar.appendChild(authBox);
    }

    if(tabs.parentElement !== sidebar){
      sidebar.appendChild(tabs);
    }

    if(body.parentElement !== main){
      main.appendChild(body);
    }

    modal.classList.add('profile-sidebar-ready');
    tabs.removeAttribute('hidden');
    body.removeAttribute('hidden');
  }

  function patchProfileFunctions(){
    if(typeof window.openProfilePanel === 'function' && !window.openProfilePanel.__sidebarLayout){
      const original = window.openProfilePanel;
      const wrapped = function(){
        const result = original.apply(this, arguments);
        setTimeout(ensureSidebarLayout, 60);
        setTimeout(ensureSidebarLayout, 180);
        return result;
      };
      wrapped.__sidebarLayout = true;
      window.openProfilePanel = wrapped;
    }

    if(typeof window.switchProfileTab === 'function' && !window.switchProfileTab.__sidebarLayout){
      const original = window.switchProfileTab;
      const wrapped = function(tab){
        const result = original.apply(this, arguments);
        setTimeout(() => {
          ensureSidebarLayout();
          const body = document.querySelector('#profileOverlay .profile-body');
          if(body) body.scrollTop = 0;
        }, 50);
        return result;
      };
      wrapped.__sidebarLayout = true;
      window.switchProfileTab = wrapped;
    }
  }

  function observeProfileModal(){
    const overlay = document.getElementById('profileOverlay');
    if(!overlay || overlay.dataset.sidebarObserver === '1') return;
    overlay.dataset.sidebarObserver = '1';

    const observer = new MutationObserver(() => {
      if(overlay.classList.contains('open')) ensureSidebarLayout();
    });
    observer.observe(overlay, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
  }

  document.addEventListener('DOMContentLoaded', () => {
    patchProfileFunctions();
    observeProfileModal();
    setTimeout(() => { patchProfileFunctions(); observeProfileModal(); ensureSidebarLayout(); }, 500);
    setTimeout(() => { patchProfileFunctions(); ensureSidebarLayout(); }, 1200);
  });

  window.ensureProfileSidebarLayout = ensureSidebarLayout;
})();
