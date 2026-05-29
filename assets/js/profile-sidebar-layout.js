(function(){
  function getOverlay(){ return document.getElementById('profileOverlay'); }
  function getModal(){ return document.querySelector('#profileOverlay .profile-modal'); }

  function ensureSidebarLayout(){
    try {
      const modal = getModal();
      if(!modal) return;
      const tabs = modal.querySelector('.profile-tabs');
      const body = modal.querySelector('.profile-body');
      if(!tabs || !body) return;

      let main = modal.querySelector('.profile-main-layout');
      if(!main){
        main = document.createElement('div');
        main.className = 'profile-main-layout';
        modal.appendChild(main);
      }

      let sidebar = main.querySelector('.profile-sidebar');
      if(!sidebar){
        sidebar = document.createElement('aside');
        sidebar.className = 'profile-sidebar';
        sidebar.setAttribute('aria-label', 'Perfil y navegación');
        main.insertBefore(sidebar, main.firstChild);
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

      if(tabs.parentElement !== sidebar) sidebar.appendChild(tabs);
      if(body.parentElement !== main) main.appendChild(body);

      modal.classList.add('profile-sidebar-ready');
      tabs.removeAttribute('hidden');
      body.removeAttribute('hidden');
      tabs.style.display = 'flex';
    } catch(error) {
      console.warn('Profile sidebar layout failed:', error);
    }
  }

  function patchProfileFunctions(){
    if(typeof window.openProfilePanel === 'function' && !window.openProfilePanel.__sidebarLayoutSafe){
      const original = window.openProfilePanel;
      const wrapped = function(){
        let result;
        try { result = original.apply(this, arguments); }
        catch(error) { console.error('Profile open failed before sidebar layout:', error); }
        setTimeout(ensureSidebarLayout, 50);
        setTimeout(ensureSidebarLayout, 180);
        return result;
      };
      wrapped.__sidebarLayoutSafe = true;
      window.openProfilePanel = wrapped;
    }

    if(typeof window.switchProfileTab === 'function' && !window.switchProfileTab.__sidebarLayoutSafe){
      const original = window.switchProfileTab;
      const wrapped = function(tab){
        let result;
        try { result = original.apply(this, arguments); }
        catch(error) { console.error('Profile tab switch failed before sidebar layout:', error); }
        setTimeout(() => {
          ensureSidebarLayout();
          const body = document.querySelector('#profileOverlay .profile-body');
          if(body) body.scrollTop = 0;
        }, 50);
        return result;
      };
      wrapped.__sidebarLayoutSafe = true;
      window.switchProfileTab = wrapped;
    }
  }

  function init(){
    patchProfileFunctions();
    ensureSidebarLayout();
  }

  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);
  window.ensureProfileSidebarLayout = ensureSidebarLayout;
})();
