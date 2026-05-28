(function(){
  const money = (value) => new Intl.NumberFormat('es-ES', { style:'currency', currency:'EUR' }).format(Number(value || 0));

  function safe(text){
    return String(text ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }

  function normalize(text){
    return String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  }

  function injectHomeEnhancements(){
    const hero = document.querySelector('#section-inicio .hero');
    if(!hero || document.getElementById('home-commercial-enhancements')) return;
    const block = document.createElement('div');
    block.id = 'home-commercial-enhancements';
    block.innerHTML = `
      <div class="hero-cta-row">
        <button class="hero-cta-main" onclick="openProfilePanel()"><i class="fa-solid fa-car-on"></i> Crear mi garaje</button>
        <button class="hero-cta-secondary" onclick="navigate('tienda')"><i class="fa-solid fa-box-open"></i> Ver kits de mantenimiento</button>
        <button class="hero-cta-secondary" onclick="navigate('guias')"><i class="fa-solid fa-book-open"></i> Empezar con una guía</button>
      </div>
      <div class="value-prop-strip">
        <div class="value-prop-card"><i class="fa-solid fa-book-open"></i><div><strong>Guías claras</strong><span>Procedimientos paso a paso con herramientas, materiales, tiempos y advertencias antes de empezar.</span></div></div>
        <div class="value-prop-card"><i class="fa-solid fa-car-rear"></i><div><strong>Kits por vehículo</strong><span>Organiza la tienda según tu coche y compra soluciones completas, no piezas sueltas sin contexto.</span></div></div>
        <div class="value-prop-card"><i class="fa-solid fa-sack-euro"></i><div><strong>Ahorro frente al taller</strong><span>Compara el coste del kit con intervenciones habituales de mantenimiento básico.</span></div></div>
        <div class="value-prop-card"><i class="fa-solid fa-shield-halved"></i><div><strong>Compra con confianza</strong><span>Stock validado, carrito con IVA y envío, y avisos cuando la compatibilidad es estimada.</span></div></div>
      </div>`;
    const searchWrap = hero.querySelector('.search-wrap');
    const catChips = hero.querySelector('.cat-chips');
    if(catChips) catChips.insertAdjacentElement('afterend', block);
    else if(searchWrap) searchWrap.insertAdjacentElement('afterend', block);
  }

  function injectHomeSections(){
    const vehicleTitle = document.querySelector('#section-inicio .section-title');
    if(!vehicleTitle || document.getElementById('how-works-section')) return;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <section class="how-works-section" id="how-works-section">
        <div class="home-section-head">
          <h2>Cómo funciona<br><span style="color:var(--accent-orange)">AutoRepara</span></h2>
          <p>Una experiencia pensada para que el usuario pase de la duda inicial a una reparación documentada, con materiales claros y seguimiento de su propio vehículo.</p>
        </div>
        <div class="how-works-grid">
          <div class="how-step-card"><div class="how-step-number">Paso 01</div><div class="how-step-icon"><i class="fa-solid fa-user-gear"></i></div><strong>Crea tu perfil</strong><span>Añade tu vehículo, kilometraje, matrícula, ITV y una foto para personalizar el mantenimiento.</span></div>
          <div class="how-step-card"><div class="how-step-number">Paso 02</div><div class="how-step-icon"><i class="fa-solid fa-magnifying-glass"></i></div><strong>Busca una reparación</strong><span>Consulta guías por sistema, dificultad, tiempo y materiales necesarios antes de comprar nada.</span></div>
          <div class="how-step-card"><div class="how-step-number">Paso 03</div><div class="how-step-icon"><i class="fa-solid fa-boxes-packing"></i></div><strong>Compra el kit adecuado</strong><span>La tienda recomienda complementos útiles y evita duplicados o productos incompatibles.</span></div>
          <div class="how-step-card"><div class="how-step-number">Paso 04</div><div class="how-step-icon"><i class="fa-solid fa-clipboard-check"></i></div><strong>Guarda el historial</strong><span>Registra reparaciones, costes, guías utilizadas y avisos de ITV o mantenimiento futuro.</span></div>
        </div>
      </section>
      <section class="savings-section">
        <div class="home-section-head">
          <h2>Ahorro orientativo<br><span style="color:var(--accent-orange)">en mantenimiento básico</span></h2>
          <p>El usuario no compra solo una herramienta: compra una solución guiada para ahorrar tiempo, dudas y desplazamientos.</p>
        </div>
        <div class="savings-grid">
          <div class="savings-card"><strong>Cambio de aceite</strong><span>Aceite, filtro, embudo y bandeja de recogida.</span><div class="savings-price-row"><span>Taller estimado</span><strong>90–130 €</strong></div><div class="savings-price-row"><span>Kit orientativo</span><strong>45–65 €</strong></div><div class="savings-badge"><i class="fa-solid fa-arrow-trend-down"></i>Ahorro visible</div></div>
          <div class="savings-card"><strong>Preparación ITV</strong><span>Escobillas, luces, OBD, limpieza y checklist visual.</span><div class="savings-price-row"><span>Revisión previa</span><strong>50–90 €</strong></div><div class="savings-price-row"><span>Kit orientativo</span><strong>25–45 €</strong></div><div class="savings-badge"><i class="fa-solid fa-shield-check"></i>Menos sorpresas</div></div>
          <div class="savings-card"><strong>Diagnóstico básico</strong><span>Lector OBD-II, linterna, guantes y guía de interpretación.</span><div class="savings-price-row"><span>Diagnosis taller</span><strong>35–70 €</strong></div><div class="savings-price-row"><span>Kit reutilizable</span><strong>30–50 €</strong></div><div class="savings-badge"><i class="fa-solid fa-repeat"></i>Reutilizable</div></div>
        </div>
      </section>
      <section class="customer-proof-section">
        <div class="home-section-head">
          <h2>Usuarios que quieren<br><span style="color:var(--accent-orange)">entender su coche</span></h2>
          <p>Mensajes de ejemplo para reforzar confianza y explicar el valor de la plataforma antes de llegar a la tienda.</p>
        </div>
        <div class="reviews-grid">
          <div class="review-card"><div class="review-stars">★★★★★</div><p>“El kit de aceite venía con lo justo. No tuve que buscar cada herramienta por separado.”</p><strong>Propietario de Golf</strong><div class="review-meta">Mantenimiento básico</div></div>
          <div class="review-card"><div class="review-stars">★★★★★</div><p>“La guía de ITV me ayudó a revisar luces, neumáticos y fallos OBD antes de ir.”</p><strong>Usuario particular</strong><div class="review-meta">Preparación ITV</div></div>
          <div class="review-card"><div class="review-stars">★★★★☆</div><p>“Me gustó guardar la reparación en el perfil del coche y tener el historial con kilometraje.”</p><strong>Conductor urbano</strong><div class="review-meta">Garaje personal</div></div>
        </div>
      </section>`;
    vehicleTitle.parentElement.insertBefore(wrapper, vehicleTitle);
  }

  function enhanceShopAfterRender(){
    const container = document.getElementById('tienda-container');
    if(!container || !container.classList.contains('section')) {}
    if(!document.getElementById('shop-confidence-panel') && container && container.querySelector('.shop-status-bar')){
      const panel = document.createElement('div');
      panel.id = 'shop-confidence-panel';
      panel.className = 'shop-confidence-panel';
      panel.innerHTML = `
        <div class="shop-confidence-grid">
          <div class="shop-confidence-card"><i class="fa-solid fa-truck-fast"></i><div><strong>Envío 24/48h</strong><span>Gastos visibles en carrito y envío gratis desde el umbral configurado.</span></div></div>
          <div class="shop-confidence-card"><i class="fa-solid fa-rotate-left"></i><div><strong>Devolución sencilla</strong><span>Productos sin montar y en buen estado pueden devolverse durante el periodo indicado.</span></div></div>
          <div class="shop-confidence-card"><i class="fa-solid fa-lock"></i><div><strong>Pago seguro</strong><span>El pedido se calcula desde base de datos, no desde precios manipulables del navegador.</span></div></div>
          <div class="shop-confidence-card"><i class="fa-solid fa-headset"></i><div><strong>Soporte de compatibilidad</strong><span>Si una pieza es crítica, la web avisa para verificar referencia OEM y homologación.</span></div></div>
        </div>`;
      const status = container.querySelector('.shop-status-bar');
      status.insertAdjacentElement('afterend', panel);
    }
    container?.querySelectorAll('.product-card').forEach(card => {
      if(card.dataset.salesEnhanced === 'true') return;
      card.dataset.salesEnhanced = 'true';
      card.dataset.hasModal = 'true';
      const desc = card.querySelector('.product-description');
      if(desc && !card.querySelector('.product-sales-note')){
        const note = document.createElement('div');
        note.className = 'product-sales-note';
        note.innerHTML = `<strong>Uso recomendado:</strong> pensado para mantenimiento doméstico con guía, variantes claras y validación de stock antes del pedido.`;
        desc.insertAdjacentElement('afterend', note);
      }
      const existingFitBadge = card.querySelector('.vehicle-fit-badge');
      const oldCompatibilityRow = card.querySelector('.compatibility-badge-row');
      if(existingFitBadge){
        if(oldCompatibilityRow) oldCompatibilityRow.remove();
      } else if(!oldCompatibilityRow){
        const row = document.createElement('div');
        row.className = 'compatibility-badge-row';
        const text = normalize(card.textContent);
        const universal = /universal|obd|gato|borriqueta|guante|linterna|embudo|bandeja/.test(text);
        row.innerHTML = universal
          ? `<span class="compatibility-badge ok">Universal</span><span class="compatibility-badge">Reutilizable</span>`
          : `<span class="compatibility-badge warn">Verificar compatibilidad</span><span class="compatibility-badge">Referencia técnica</span>`;
        const price = card.querySelector('.product-price');
        if(price) price.insertAdjacentElement('afterend', row);
      }
    });
  }

  function addGuideCommerceCta(guideId){
    const detail = document.querySelector('#guias-container .guide-detail');
    if(!detail || detail.querySelector('.guide-commerce-cta')) return;
    const guide = (window.guidesData || []).find(g => g.id === guideId) || {};
    const title = guide.title || 'esta reparación';
    const cta = document.createElement('div');
    cta.className = 'guide-commerce-cta';
    cta.innerHTML = `<div><h3>Compra el kit para esta guía</h3><p>Prepara herramientas, materiales y consumibles antes de empezar. La tienda buscará productos relacionados con <strong>${safe(title)}</strong> y mostrará kits compatibles o universales.</p></div><button class="guide-kit-cta-btn" onclick="openGuideKitInShop('${safe(guideId)}')"><i class="fa-solid fa-box-open"></i> Comprar kit de esta guía</button>`;
    const materials = detail.querySelector('.guide-materials-box');
    if(materials) materials.insertAdjacentElement('beforebegin', cta);
    else detail.querySelector('.guide-detail-header')?.insertAdjacentElement('afterend', cta);
  }

  window.openGuideKitInShop = function(guideId){
    const guide = (window.guidesData || []).find(g => g.id === guideId);
    const query = guide ? `${guide.title} ${(guide.tools || []).join(' ')} ${(guide.parts || []).join(' ')}` : '';
    navigate('tienda');
    setTimeout(() => {
      const input = document.getElementById('store-search');
      if(input){ input.value = query.split(/\s+/).slice(0, 5).join(' '); }
      if(typeof renderStore === 'function') renderStore(input ? input.value : query, 'all');
      setTimeout(enhanceShopAfterRender, 300);
    }, 250);
  };

  const originalNavigate = window.navigate;
  if(typeof originalNavigate === 'function'){
    window.navigate = function(sectionId, options){
      const result = originalNavigate.apply(this, arguments);
      if(sectionId === 'inicio') setTimeout(() => { injectHomeEnhancements(); injectHomeSections(); }, 80);
      if(sectionId === 'tienda') setTimeout(enhanceShopAfterRender, 500);
      return result;
    };
  }

  const originalRenderStore = window.renderStore;
  if(typeof originalRenderStore === 'function'){
    window.renderStore = async function(){
      const result = await originalRenderStore.apply(this, arguments);
      setTimeout(enhanceShopAfterRender, 100);
      setTimeout(enhanceShopAfterRender, 500);
      return result;
    };
  }

  const originalOpenGuide = window.openGuide;
  if(typeof originalOpenGuide === 'function'){
    window.openGuide = function(id){
      const result = originalOpenGuide.apply(this, arguments);
      setTimeout(() => addGuideCommerceCta(id), 250);
      setTimeout(() => addGuideCommerceCta(id), 800);
      return result;
    };
  }

  document.addEventListener('click', function(ev){
    const card = ev.target.closest('.product-card[data-has-modal="true"]');
    if(!card) return;
    if(ev.target.closest('button, select, input, a')) return;
    const id = card.getAttribute('data-product-id');
    if(id && typeof window.openProductModal === 'function') window.openProductModal(id);
  });

  document.addEventListener('DOMContentLoaded', function(){
    injectHomeEnhancements();
    injectHomeSections();
    setTimeout(enhanceShopAfterRender, 800);
  });
})();
