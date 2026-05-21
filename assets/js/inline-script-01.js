/* Extracted from index_tienda_popup_recuperado_sin_aceite_extra.html */

// =====================================================
// NUEVAS FUNCIONALIDADES — AutoRepara.es v3.2
// =====================================================

// --- READING PROGRESS BAR ---
window.addEventListener('scroll', function() {
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
  const bar = document.getElementById('reading-progress');
  if (bar) bar.style.width = pct + '%';

  // Back to top visibility
  const btn = document.getElementById('back-to-top');
  if (btn) {
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }
});

// --- COOKIE BANNER ---
function acceptCookies() {
  localStorage.setItem('ar_cookies_accepted', 'all');
  hideCookieBanner();
  closeModal('cookie-modal');
  showToast('success', 'fa-check-circle', 'Preferencias guardadas correctamente.');
}
function saveCookieConfig() {
  const analytics = document.getElementById('cookie-analytics')?.checked;
  const prefs = document.getElementById('cookie-prefs')?.checked;
  localStorage.setItem('ar_cookies_accepted', JSON.stringify({ technical: true, analytics, prefs }));
  hideCookieBanner();
  closeModal('cookie-modal');
  showToast('success', 'fa-check-circle', 'Configuración de cookies guardada.');
}
function hideCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (banner) { banner.style.transition = 'opacity 0.3s, transform 0.3s'; banner.style.opacity = '0'; banner.style.transform = 'translateY(100%)'; setTimeout(() => banner.remove(), 350); }
}
function showCookieModal() {
  document.getElementById('cookie-modal').style.display = 'flex';
}

// --- GENERIC MODAL OPEN/CLOSE ---
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'flex';
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}
// Close modal on overlay click
document.addEventListener('click', function(e) {
  ['cookie-modal', 'newsletter-modal', 'about-modal', 'contact-modal'].forEach(id => {
    const overlay = document.getElementById(id);
    if (e.target === overlay) overlay.style.display = 'none';
  });
});

// --- NEWSLETTER ---
let nlShownThisSession = false;
function showNewsletterModal() {
  nlShownThisSession = true;
  document.getElementById('newsletter-modal').style.display = 'flex';
}
function closeNewsletterModal() {
  document.getElementById('newsletter-modal').style.display = 'none';
}
function submitNewsletter() {
  const email = document.getElementById('nl-email')?.value?.trim();
  if (!email || !email.includes('@')) {
    showToast('default', 'fa-triangle-exclamation', 'Introduce un email válido para suscribirte.');
    return;
  }
  const form = document.getElementById('newsletter-form');
  if (form) form.innerHTML = `
    <div class="newsletter-success">
      <i class="fa-solid fa-circle-check"></i>
      <h4>¡Ya eres parte de la comunidad!</h4>
      <p>Recibirás el próximo boletín con las últimas guías publicadas. Revisa tu carpeta de spam si no aparece en 24h.</p>
    </div>`;
  showToast('success', 'fa-envelope', 'Suscripción confirmada. ¡Bienvenido!');
  setTimeout(() => closeNewsletterModal(), 3200);
}
// Auto-show newsletter after 35s if not shown and no cookie stored
setTimeout(() => {
  if (!nlShownThisSession && !localStorage.getItem('ar_nl_dismissed')) {
    showNewsletterModal();
    nlShownThisSession = true;
  }
}, 35000);

// --- CONTACT ---
function submitContact() {
  const modal = document.querySelector('.contact-modal');
  const email = modal?.querySelector('input[type="email"]')?.value?.trim();
  const msg = modal?.querySelector('textarea')?.value?.trim();
  if (!email || !msg) {
    showToast('default', 'fa-triangle-exclamation', 'Rellena email y mensaje antes de enviar.');
    return;
  }
  modal.innerHTML = `
    <div style="text-align:center;padding:40px 20px">
      <i class="fa-solid fa-paper-plane" style="font-size:48px;color:var(--accent-orange);margin-bottom:18px;display:block"></i>
      <h3 style="font-family:var(--font-display);font-size:22px;font-weight:800;margin-bottom:10px;color:var(--text-primary)">Mensaje enviado</h3>
      <p style="font-size:13px;color:var(--text-secondary);line-height:1.65">Gracias por escribirnos. Te responderemos en un plazo de 2–3 días laborables. Si es una corrección técnica urgente, la revisaremos antes.</p>
      <button onclick="closeModal('contact-modal')" style="margin-top:20px;background:var(--accent-orange);border:none;color:white;font-family:var(--font-display);font-weight:700;font-size:13px;padding:10px 24px;border-radius:var(--radius);cursor:pointer;letter-spacing:0.05em;text-transform:uppercase">Cerrar</button>
    </div>`;
  showToast('success', 'fa-check-circle', 'Mensaje enviado correctamente.');
}

// --- TOAST SYSTEM ---
function showToast(type, icon, message, duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

// --- FAVORITES (guide system) ---
let favorites = JSON.parse(localStorage.getItem('ar_favorites') || '[]');
function toggleFavorite(guideId, btn) {
  const idx = favorites.indexOf(guideId);
  if (idx === -1) {
    favorites.push(guideId);
    btn.classList.add('favorited');
    btn.querySelector('i').className = 'fa-solid fa-bookmark';
    btn.querySelector('span').textContent = 'Guardada';
    showToast('success', 'fa-bookmark', 'Guía guardada en tus favoritos.');
  } else {
    favorites.splice(idx, 1);
    btn.classList.remove('favorited');
    btn.querySelector('i').className = 'fa-regular fa-bookmark';
    btn.querySelector('span').textContent = 'Guardar';
    showToast('default', 'fa-bookmark', 'Guía eliminada de favoritos.');
  }
  localStorage.setItem('ar_favorites', JSON.stringify(favorites));
}

// --- SHARE GUIDE ---
function shareGuide(title) {
  if (navigator.share) {
    navigator.share({ title: title + ' — AutoRepara.es', url: window.location.href }).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('info', 'fa-link', 'Enlace copiado al portapapeles.');
    });
  }
}

// --- STAR RATING ---
function initRating(container, guideId) {
  const stars = container.querySelectorAll('.rating-star');
  const saved = parseInt(localStorage.getItem('ar_rating_' + guideId) || '0');
  stars.forEach((s, i) => {
    if (i < saved) s.classList.add('lit');
    s.addEventListener('mouseenter', () => stars.forEach((x, j) => x.classList.toggle('lit', j <= i)));
    s.addEventListener('mouseleave', () => stars.forEach((x, j) => x.classList.toggle('lit', j < (parseInt(localStorage.getItem('ar_rating_' + guideId) || '0')))));
    s.addEventListener('click', () => {
      const val = i + 1;
      localStorage.setItem('ar_rating_' + guideId, val);
      stars.forEach((x, j) => x.classList.toggle('lit', j < val));
      showToast('success', 'fa-star', `Valoración de ${val} estrellas guardada. ¡Gracias!`);
    });
  });
}

// --- INJECT GUIDE ACTION BAR INTO GUIDE DETAIL ---
// Hooked into openGuide post-render
function injectGuideActionsBar(guideId, guideTitle) {
  const container = document.getElementById('guide-detail') || document.querySelector('.guide-detail');
  if (!container) return;
  const isFav = favorites.includes(guideId);
  const bar = document.createElement('div');
  bar.className = 'guide-actions-bar';
  bar.id = 'guide-actions-' + guideId;
  bar.innerHTML = `
    <button class="guide-action-btn ${isFav ? 'favorited' : ''}" onclick="toggleFavorite('${guideId}', this)">
      <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i><span>${isFav ? 'Guardada' : 'Guardar'}</span>
    </button>
    <button class="guide-action-btn" onclick="shareGuide('${guideTitle.replace(/'/g,"\\'")}')">
      <i class="fa-solid fa-share-nodes"></i><span>Compartir</span>
    </button>
    <button class="guide-action-btn" onclick="window.print()">
      <i class="fa-solid fa-print"></i><span>Imprimir</span>
    </button>
    <div class="guide-rating">
      <span class="guide-rating-label">Valorar</span>
      <div class="rating-stars" id="stars-${guideId}">
        ${[1,2,3,4,5].map(n => `<span class="rating-star" title="${n} estrella${n>1?'s':''}">★</span>`).join('')}
      </div>
    </div>`;
  container.insertBefore(bar, container.firstChild);
  const starsContainer = document.getElementById('stars-' + guideId);
  if (starsContainer) initRating(starsContainer, guideId);
}

// --- LIVE USER COUNT ANIMATION ---
(function() {
  const el = document.getElementById('live-count');
  if (!el) return;
  let base = 230 + Math.floor(Math.random() * 40);
  el.textContent = base;
  setInterval(() => {
    base += Math.floor(Math.random() * 7) - 3;
    base = Math.max(180, Math.min(320, base));
    el.textContent = base;
  }, 8000);
})();

// --- INIT: check cookie state + patch filterGuides after all scripts load ---
document.addEventListener('DOMContentLoaded', function() {
  // Hide cookie banner if already accepted
  if (localStorage.getItem('ar_cookies_accepted')) {
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.remove();
  }

  // Patch filterGuides to show empty state (must run after filterGuides is defined)
  const _origFilterGuides = window.filterGuides;
  if (typeof _origFilterGuides === 'function') {
    window.filterGuides = function(q) {
      _origFilterGuides(q);
      setTimeout(() => {
        const container = document.getElementById('guias-container');
        if (!container) return;
        const pills = container.querySelectorAll('.guide-card, .guide-pill-big, [class*="guide-card"]');
        const visible = Array.from(pills).filter(el => el.style.display !== 'none');
        if (q && visible.length === 0) {
          const existing = container.querySelector('.search-no-results');
          if (!existing) {
            const noRes = document.createElement('div');
            noRes.className = 'search-no-results';
            noRes.innerHTML = `
              <i class="fa-solid fa-magnifying-glass-minus"></i>
              <h3>Sin resultados para "${q}"</h3>
              <p>No hemos encontrado guías que coincidan con esa búsqueda. Prueba con términos como "filtro", "sensor", "refrigeración" o navega por sistema en el Mapa Motor.</p>
              <button class="btn-read" onclick="window.navigate('motor')">Ver Mapa Motor →</button>`;
            container.appendChild(noRes);
          }
        } else {
          const existing = container.querySelector('.search-no-results');
          if (existing) existing.remove();
        }
      }, 80);
    };
  }
});
