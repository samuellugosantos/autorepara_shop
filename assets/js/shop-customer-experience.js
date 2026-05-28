(function(){
  'use strict';

  const STORE_VEHICLE_KEY = 'autorepara_store_vehicle_filter_v1';
  const STORE_NEED_KEY = 'autorepara_store_need_filter_v1';
  const SHOW_COMPAT_KEY = 'autorepara_shop_show_only_compatible_v1';
  const RECENT_KEY = 'autorepara_recent_products_v1';
  const FAVORITES_KEY = 'autorepara_favorite_products_v1';
  const CART_KEY = 'autorepara_cart_v1';

  const INTENTS = [
    { need:'Aceite', icon:'fa-oil-can', title:'Cambiar aceite', desc:'Aceite, filtro, embudo, bandeja y básicos de limpieza.' },
    { need:'ITV', icon:'fa-clipboard-check', title:'Preparar ITV', desc:'Elementos rápidos para revisar luces, visibilidad, diagnóstico y seguridad.' },
    { need:'Frenos', icon:'fa-brake-warning', fallbackIcon:'fa-circle-dot', title:'Revisar frenos', desc:'Pastillas, discos, limpiador y apoyo de elevación.' },
    { need:'Diagnóstico', icon:'fa-stethoscope', title:'Diagnosticar avería', desc:'OBD-II, multímetro, linterna y herramientas de comprobación.' },
    { need:'Refrigeración', icon:'fa-temperature-half', title:'Refrigeración', desc:'Refrigerante, purga, embudos y control de temperatura.' },
    { need:'Filtros', icon:'fa-filter', title:'Cambiar filtros', desc:'Filtro de aceite, aire, habitáculo o combustible según vehículo.' }
  ];

  function q(sel, root=document){ return root.querySelector(sel); }
  function qa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }
  function esc(value){
    if (typeof window.escapeHtml === 'function') return window.escapeHtml(value == null ? '' : String(value));
    return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function money(value){
    if (typeof window.euro === 'function') return window.euro(Number(value || 0));
    return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(Number(value || 0));
  }
  function normalize(value){
    return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  }
  function getProducts(){ return Array.isArray(window.shopProductsCache) ? window.shopProductsCache : []; }
  function getProduct(id){ return getProducts().find(p => String(p.id) === String(id)); }
  function getDefaultVariant(product){
    const variants = product && Array.isArray(product.variants) && product.variants.length ? product.variants : [{ id: product?.id + '__default', label:'Única', price: product?.price || 0, stock: 0 }];
    return variants.find(v => v.is_default) || variants[0];
  }
  function stockTotal(product){ return (product?.variants || []).reduce((s,v)=>s+Number(v.stock||0), 0); }
  function selectedVehicle(){ return localStorage.getItem(STORE_VEHICLE_KEY) || 'all'; }
  function selectedNeed(){ return localStorage.getItem(STORE_NEED_KEY) || 'all'; }
  function selectedVehicleLabel(){
    const select = q('#vehicle-shop-select');
    if (select && select.selectedOptions && select.selectedOptions[0]) return select.selectedOptions[0].textContent.trim();
    const raw = selectedVehicle();
    return raw === 'all' ? 'todos los vehículos' : raw.replace(/^profile:/,'vehículo del perfil ');
  }
  function productText(product){
    return normalize([product?.id, product?.name, product?.category, product?.description, product?.need, ...(product?.features || []), ...(product?.vehicleKeys || [])].join(' '));
  }
  function inferNeed(product){
    if (product?.need) return product.need;
    const t = productText(product);
    if (/(aceite|oil|0w|5w|504|507|508|509)/.test(t)) return 'Aceite';
    if (/(filtro|filter)/.test(t)) return 'Filtros';
    if (/(freno|brake|pastilla|disco)/.test(t)) return 'Frenos';
    if (/(refrigerante|coolant|anticongelante|g12|g13)/.test(t)) return 'Refrigeración';
    if (/(obd|diagnost|scanner|elm|multimetro|multímetro)/.test(t)) return 'Diagnóstico';
    if (/(itv|escobilla|limpiaparabrisas|luz|bombilla)/.test(t)) return 'ITV';
    if (/(bateria|batería|electrico|eléctrico)/.test(t)) return 'Electricidad';
    if (/(bujia|bujía|encendido|bobina)/.test(t)) return 'Encendido';
    if (/(gato|borriqueta|llave|vaso|torquimetro|torquímetro|herramienta)/.test(t)) return 'Herramientas';
    return product?.category ? String(product.category).replace(/^./, m=>m.toUpperCase()) : 'General';
  }
  function compatStatusFromCard(card){
    const status = card?.getAttribute('data-compat-status') || q('[data-compat-status]', card)?.getAttribute('data-compat-status') || '';
    const match = card?.getAttribute('data-vehicle-match');
    return { status, match };
  }
  function isStrictCompatible(product, card){
    const status = compatStatusFromCard(card);
    if (selectedVehicle() === 'all') return true;
    if (status.match === 'false') return false;
    return ['exact','family','universal','category'].includes(status.status) || card?.getAttribute('data-vehicle-match') === 'true';
  }
  function family(product){ return inferNeed(product); }
  function readJson(key, fallback){ try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } }
  function writeJson(key, value){ localStorage.setItem(key, JSON.stringify(value)); }

  function addToRecent(productId){
    const arr = readJson(RECENT_KEY, []).filter(id => String(id) !== String(productId));
    arr.unshift(productId);
    writeJson(RECENT_KEY, arr.slice(0, 8));
  }
  function toggleFavorite(productId){
    const arr = readJson(FAVORITES_KEY, []);
    const idx = arr.findIndex(id => String(id) === String(productId));
    if (idx >= 0) arr.splice(idx,1); else arr.unshift(productId);
    writeJson(FAVORITES_KEY, arr.slice(0, 50));
    enhanceShopAfterRender();
  }
  function isFavorite(productId){ return readJson(FAVORITES_KEY, []).some(id => String(id) === String(productId)); }

  function addProductToCartDirect(product, variantId){
    if (!product) return;
    const variants = Array.isArray(product.variants) && product.variants.length ? product.variants : [{ id: product.id + '__default', label:'Única', price: product.price || 0, stock: 0 }];
    const variant = variants.find(v => String(v.id) === String(variantId)) || variants.find(v => v.is_default) || variants[0];
    if (typeof window.addToCartByProduct === 'function') {
      const select = q(`#variant-${CSS.escape(String(product.id))}`);
      if (select && variant?.id) select.value = variant.id;
      try { window.addToCartByProduct(product.id); return; } catch {}
    }
    const cart = readJson(CART_KEY, []);
    const existing = cart.find(item => String(item.variant_id) === String(variant.id));
    if (existing) existing.quantity = Number(existing.quantity || 0) + 1;
    else cart.push({ product_id: product.id, variant_id: variant.id, name: product.name, variant_label: variant.label, unit_price: Number(variant.price || product.price || 0), quantity: 1 });
    writeJson(CART_KEY, cart);
    if (typeof window.updateCartCounter === 'function') window.updateCartCounter();
    else qa('[data-cart-count]').forEach(el => { el.textContent = String(cart.reduce((s,i)=>s+Number(i.quantity||0), 0)); });
    if (typeof window.showToast === 'function') window.showToast('Producto añadido al carrito.', 'success');
  }

  function currentProfileSignals(){
    const text = normalize(document.body.textContent || '');
    const itvSoon = /itv caduca|itv expira|itv próxima|itv proxima/.test(text);
    const mileageHigh = /(120\.000|120000|150\.000|150000|180\.000|180000|200\.000|200000)/.test(text);
    return { itvSoon, mileageHigh };
  }

  function pickProductsForNeed(need, products, count=4){
    const selected = selectedVehicle();
    let list = products.filter(p => inferNeed(p) === need && !p.localOnly);
    if (!list.length) list = products.filter(p => productText(p).includes(normalize(need)) && !p.localOnly);
    list.sort((a,b) => {
      const av = (a.vehicleKeys || []).some(k => selected !== 'all' && String(k) === String(selected)) ? 10 : 0;
      const bv = (b.vehicleKeys || []).some(k => selected !== 'all' && String(k) === String(selected)) ? 10 : 0;
      return (bv-av) || stockTotal(b)-stockTotal(a) || Number(getDefaultVariant(a).price)-Number(getDefaultVariant(b).price);
    });
    const seen = new Set();
    return list.filter(p => { const f = family(p); if (seen.has(f) && need !== 'Filtros') return false; seen.add(f); return true; }).slice(0,count);
  }
  function buildKitTemplates(){
    const products = getProducts();
    const signals = currentProfileSignals();
    const templates = [
      { id:'oil', title:'Kit cambio de aceite', need:'Aceite', desc:'Para hacer un mantenimiento completo sin olvidar filtro ni consumibles.', wanted:['Aceite','Filtros','Herramientas','Limpieza'] },
      { id:'itv', title:'Kit revisión ITV', need:'ITV', desc:'Para revisar visibilidad, diagnosis y puntos rápidos antes de la inspección.', wanted:['ITV','Diagnóstico','Limpieza','Herramientas'] },
      { id:'brakes', title:'Kit revisión de frenos', need:'Frenos', desc:'Para trabajar con pastillas, discos y limpieza de forma más segura.', wanted:['Frenos','Limpieza','Herramientas'] },
      { id:'diagnostic', title:'Kit diagnóstico inicial', need:'Diagnóstico', desc:'Para localizar averías antes de cambiar piezas innecesarias.', wanted:['Diagnóstico','Electricidad','Herramientas'] }
    ];
    if (signals.itvSoon) templates.unshift({ id:'itv-soon', title:'ITV próxima: kit prioritario', need:'ITV', desc:'Tu perfil indica ITV próxima o pendiente. Prioriza revisión y visibilidad.', wanted:['ITV','Diagnóstico','Limpieza'] });
    if (signals.mileageHigh) templates.unshift({ id:'mileage', title:'Kit mantenimiento por kilometraje', need:'Aceite', desc:'Por kilometraje alto conviene revisar aceite, filtros, refrigeración y diagnosis.', wanted:['Aceite','Filtros','Refrigeración','Diagnóstico'] });
    return templates.map(t => ({...t, products: uniqueKitProducts(t.wanted.flatMap(n => pickProductsForNeed(n, products, 2))).slice(0,5)})).filter(t => t.products.length >= 2).slice(0,4);
  }
  function uniqueKitProducts(list){
    const ids = new Set(); const fams = new Set(); const out = [];
    for (const p of list) {
      if (!p || ids.has(String(p.id))) continue;
      const f = family(p);
      if (f === 'Aceite' && fams.has('Aceite')) continue;
      ids.add(String(p.id)); fams.add(f); out.push(p);
    }
    return out;
  }
  function kitPrice(products){ return products.reduce((s,p)=>s+Number(getDefaultVariant(p).price || p.price || 0),0); }
  function addKitProducts(products){
    uniqueKitProducts(products).forEach(p => addProductToCartDirect(p, getDefaultVariant(p).id));
    if (typeof window.openCartModal === 'function') setTimeout(()=>window.openCartModal(), 80);
  }
  window.addAutoReparaFixedKit = function(ids){
    const products = (ids || []).map(getProduct).filter(Boolean);
    addKitProducts(products);
  };
  window.openAutoReparaKitInStore = function(need){
    if (typeof window.setVehicleShopNeed === 'function') window.setVehicleShopNeed(encodeURIComponent(need));
    setTimeout(()=>document.getElementById('tienda-container')?.scrollIntoView({behavior:'smooth',block:'start'}), 120);
  };

  function buildIntentPanel(){
    const active = selectedNeed();
    return `<div class="shop-intent-panel" id="shop-intent-panel">
      <h3><i class="fa-solid fa-route"></i> ¿Qué quieres hacer hoy?</h3>
      <p>Elige una intención y la tienda se ordenará por soluciones, no solo por productos sueltos.</p>
      <div class="shop-intent-grid">
        ${INTENTS.map(item => `<button type="button" class="shop-intent-card ${active === item.need ? 'active' : ''}" onclick="setVehicleShopNeed('${encodeURIComponent(item.need)}')">
          <i class="fa-solid ${item.icon || item.fallbackIcon}"></i><strong>${esc(item.title)}</strong><span>${esc(item.desc)}</span>
        </button>`).join('')}
      </div>
    </div>`;
  }
  function buildCompatToolbar(){
    const checked = localStorage.getItem(SHOW_COMPAT_KEY) === 'true';
    const vehicle = selectedVehicleLabel();
    return `<div class="shop-compat-toolbar">
      <label class="shop-compat-toggle"><input type="checkbox" id="show-compatible-only" ${checked?'checked':''} onchange="toggleCompatibleOnly(this.checked)"> Mostrar solo compatibles con mi vehículo</label>
      <div class="shop-compat-note"><i class="fa-solid fa-car"></i> Comprando para: ${esc(vehicle)}</div>
    </div>`;
  }
  function buildKitsPanel(){
    const kits = buildKitTemplates();
    if (!kits.length) return '';
    return `<div class="shop-kits-panel" id="shop-kits-panel">
      <h3><i class="fa-solid fa-box-open"></i> Kits recomendados para tu vehículo</h3>
      <p>Soluciones agrupadas según el vehículo seleccionado, tu perfil y las tareas más habituales.</p>
      <div class="shop-kit-grid">
        ${kits.map(kit => {
          const base = kitPrice(kit.products); const discounted = base * 0.94; const ids = kit.products.map(p=>p.id);
          return `<article class="shop-kit-card">
            <div class="kit-label">${esc(kit.need)} · Pack sugerido</div>
            <h4>${esc(kit.title)}</h4>
            <p>${esc(kit.desc)}</p>
            <ul class="shop-kit-items">${kit.products.map(p=>`<li><i class="fa-solid fa-check"></i><span>${esc(p.name)}</span></li>`).join('')}</ul>
            <div class="shop-kit-price-row"><strong>${money(discounted)}</strong><span>Ahorro aprox. ${money(base-discounted)}</span></div>
            <div class="shop-kit-actions"><button class="shop-kit-btn" onclick='addAutoReparaFixedKit(${JSON.stringify(ids)})'><i class="fa-solid fa-cart-plus"></i> Añadir kit</button><button class="shop-kit-secondary" onclick="openAutoReparaKitInStore('${esc(kit.need)}')">Ver productos</button></div>
          </article>`;
        }).join('')}
      </div>
    </div>`;
  }
  function buildRecentlyViewedPanel(){
    const recent = readJson(RECENT_KEY, []).map(getProduct).filter(Boolean).slice(0,4);
    if (!recent.length) return '';
    return `<div class="shop-recent-panel"><h3><i class="fa-solid fa-clock-rotate-left"></i> Vistos recientemente</h3><div class="shop-recent-grid">
      ${recent.map(p => `<article class="shop-recent-card"><h4>${esc(p.name)}</h4><p>${esc((p.description || '').slice(0,110))}${(p.description||'').length>110?'…':''}</p><div class="product-price" style="font-size:22px">${money(getDefaultVariant(p).price || p.price)}</div><button class="shop-kit-secondary" onclick="openProductModal('${esc(p.id)}')">Ver detalle</button></article>`).join('')}
    </div></div>`;
  }
  function buildHelpPanel(){
    return `<div class="shop-help-panel">
      <h3><i class="fa-solid fa-circle-question"></i> Cómo elegir recambios sin equivocarte</h3>
      <div class="shop-help-grid">
        <div class="shop-help-card"><strong>Aceite</strong>Respeta la homologación de la ficha técnica. 508/509 y 504/507 no son intercambiables sin comprobar especificación.</div>
        <div class="shop-help-card"><strong>Filtros</strong>Comprueba motor, año y referencia. En diésel revisa también filtro de combustible.</div>
        <div class="shop-help-card"><strong>Frenos</strong>Verifica eje, diámetro de disco y referencia antes de comprar piezas críticas.</div>
        <div class="shop-help-card"><strong>Compatibilidad</strong>Los productos universales sirven como apoyo; las piezas críticas requieren referencia exacta u OEM.</div>
      </div>
    </div>`;
  }

  function injectShopBlocks(){
    const container = q('#tienda-container');
    if (!container || q('#shop-intent-panel', container)) return;
    const vehiclePanel = q('.vehicle-shop-panel', container);
    if (vehiclePanel) vehiclePanel.insertAdjacentHTML('beforebegin', buildIntentPanel());
    const toolbar = q('.product-toolbar', container);
    if (toolbar) toolbar.insertAdjacentHTML('beforebegin', buildCompatToolbar() + buildKitsPanel() + buildRecentlyViewedPanel());
    const grid = q('.store-grid', container);
    if (grid && !q('.shop-help-panel', container)) grid.insertAdjacentHTML('afterend', buildHelpPanel());
    enhanceProductCards();
    applyCompatibleOnlyFilter();
  }

  function enhanceProductCards(){
    const favorites = readJson(FAVORITES_KEY, []);
    qa('.product-card').forEach(card => {
      card.classList.add('shop-card-compact');
      const id = card.getAttribute('data-product-id') || String(card.id || '').replace(/^shop-/,'');
      const product = getProduct(id);
      if (!product) return;
      if (!q('.product-secondary-note', card)) {
        const status = compatStatusFromCard(card).status;
        const text = status === 'exact' ? 'Producto recomendado según la ficha técnica del vehículo seleccionado.' : status === 'family' ? 'Compatible por familia mecánica; revisa variante antes de comprar.' : status === 'universal' ? 'Uso universal para mantenimiento y diagnosis.' : 'Revisa medidas, referencia u homologación antes de montar.';
        const btn = `<button type="button" class="favorite-product-btn ${favorites.some(f=>String(f)===String(id))?'active':''}" onclick="event.stopPropagation();toggleAutoReparaFavorite('${esc(id)}')"><i class="fa-${favorites.some(f=>String(f)===String(id))?'solid':'regular'} fa-heart"></i> Guardar</button>`;
        const actions = q('.product-card-actions', card) || q('.btn-cart', card)?.parentElement;
        if (actions) actions.insertAdjacentHTML('beforebegin', `<div class="product-secondary-note">${esc(text)}</div>`);
        if (actions && !q('.favorite-product-btn', card)) actions.insertAdjacentHTML('afterbegin', btn);
      }
    });
  }
  window.toggleAutoReparaFavorite = function(id){ toggleFavorite(id); };

  window.toggleCompatibleOnly = function(value){
    localStorage.setItem(SHOW_COMPAT_KEY, value ? 'true' : 'false');
    applyCompatibleOnlyFilter();
  };
  function applyCompatibleOnlyFilter(){
    const active = localStorage.getItem(SHOW_COMPAT_KEY) === 'true';
    qa('.product-card').forEach(card => {
      const id = card.getAttribute('data-product-id') || String(card.id || '').replace(/^shop-/,'');
      const product = getProduct(id);
      if (!active || selectedVehicle() === 'all') { card.style.display = ''; return; }
      card.style.display = isStrictCompatible(product, card) ? '' : 'none';
    });
    const countVisible = qa('.product-card').filter(c => c.style.display !== 'none').length;
    const chip = q('.shop-status-chip');
    if (chip && active && selectedVehicle() !== 'all') chip.innerHTML = `<i class="fa-solid fa-filter"></i>${countVisible} compatibles visibles · ${esc(selectedVehicleLabel())}`;
  }

  function productImageHtml(product){
    if (product?.image_url) return `<img src="${esc(product.image_url)}" alt="${esc(product.name)}" loading="lazy">`;
    return `<div class="shop-product-photo-placeholder"><i class="fa-solid fa-image"></i><strong>Imagen pendiente</strong><br><span>Usa una imagen real en Supabase: image_url.</span></div>`;
  }
  function variantOptions(product){
    const variants = Array.isArray(product.variants) && product.variants.length ? product.variants : [{ id: product.id+'__default', label:'Única', price: product.price || 0, stock: 0 }];
    return variants.map(v => `<option value="${esc(v.id)}">${esc(v.label)} · ${money(v.price)} · stock ${Number(v.stock||0)}</option>`).join('');
  }
  function relatedProducts(product){
    const need = inferNeed(product);
    return getProducts().filter(p => String(p.id)!==String(product.id) && inferNeed(p) === need).slice(0,3);
  }
  window.openProductModal = function(productId){
    const product = getProduct(productId);
    if (!product) return;
    addToRecent(product.id);
    q('#auto-product-modal')?.remove();
    const stock = stockTotal(product);
    const compat = q(`#shop-${CSS.escape(String(product.id))} [data-compat-status]`)?.textContent?.trim() || 'Compatibilidad según vehículo seleccionado';
    const rel = relatedProducts(product);
    const modal = document.createElement('div');
    modal.className = 'shop-product-modal-overlay';
    modal.id = 'auto-product-modal';
    modal.innerHTML = `<div class="shop-product-modal" role="dialog" aria-modal="true" aria-labelledby="auto-product-title">
      <div class="shop-product-modal-header"><div><div class="product-kicker">${esc(product.category || 'producto')}</div><h3 id="auto-product-title">${esc(product.name)}</h3></div><button class="shop-product-modal-close" onclick="closeProductModal()"><i class="fa-solid fa-xmark"></i></button></div>
      <div class="shop-product-modal-body">
        <div class="shop-product-photo">${productImageHtml(product)}</div>
        <div>
          <div class="vehicle-fit-badge secondary"><i class="fa-solid fa-car-side"></i>${esc(compat)}</div>
          <p class="product-description" style="margin-top:14px">${esc(product.description || 'Producto para mantenimiento y reparación del vehículo.')}</p>
          <div class="product-detail-grid">
            <div class="product-detail-box"><span>Uso recomendado</span><strong>${esc(inferNeed(product))}</strong></div>
            <div class="product-detail-box"><span>Stock</span><strong>${stock > 5 ? 'Disponible' : stock > 0 ? 'Últimas unidades' : 'Agotado'} · ${stock} uds.</strong></div>
            <div class="product-detail-box"><span>Precio desde</span><strong>${money(getDefaultVariant(product).price || product.price)}</strong></div>
            <div class="product-detail-box"><span>Vehículo</span><strong>${esc(selectedVehicleLabel())}</strong></div>
          </div>
          <div class="compat-help-box"><strong>Consejo de compatibilidad:</strong> si el producto afecta a seguridad, frenos, aceite, filtros específicos o distribución, verifica medida, referencia OEM u homologación antes de montarlo.</div>
          <label style="display:block;color:var(--text-muted);font-family:var(--font-mono);font-size:11px;text-transform:uppercase;margin-bottom:6px">Variante</label>
          <select class="product-size-select" id="auto-modal-variant-${esc(product.id)}">${variantOptions(product)}</select>
          ${rel.length ? `<div class="product-detail-box" style="margin-top:12px"><span>También suele ir con</span><strong>${rel.map(p=>esc(p.name)).join(' · ')}</strong></div>` : ''}
          <div class="product-detail-actions"><button class="btn-cart" onclick="addAutoModalProductToCart('${esc(product.id)}')"><i class="fa-solid fa-cart-plus"></i> Añadir al carrito</button><button class="shop-kit-secondary" onclick="closeProductModal();openAutoReparaKitInStore('${esc(inferNeed(product))}')">Ver kit relacionado</button><button class="shop-kit-secondary" onclick="toggleAutoReparaFavorite('${esc(product.id)}')"><i class="fa-regular fa-heart"></i> Guardar</button></div>
        </div>
      </div>
    </div>`;
    document.body.appendChild(modal);
  };
  window.closeProductModal = function(){ q('#auto-product-modal')?.remove(); };
  window.addAutoModalProductToCart = function(productId){
    const product = getProduct(productId); if (!product) return;
    const variantId = q(`#auto-modal-variant-${CSS.escape(String(productId))}`)?.value;
    addProductToCartDirect(product, variantId);
    closeProductModal();
  };

  const previousRenderStore = window.renderStore;
  if (typeof previousRenderStore === 'function') {
    window.renderStore = async function(){
      const result = await previousRenderStore.apply(this, arguments);
      setTimeout(enhanceShopAfterRender, 40);
      setTimeout(enhanceShopAfterRender, 260);
      return result;
    };
  }
  function enhanceShopAfterRender(){ injectShopBlocks(); }
  window.enhanceShopAfterRender = enhanceShopAfterRender;

  const prevSetVehicle = window.setVehicleShopFilter;
  if (typeof prevSetVehicle === 'function') {
    window.setVehicleShopFilter = function(value){
      const r = prevSetVehicle.apply(this, arguments);
      setTimeout(enhanceShopAfterRender, 180);
      return r;
    };
  }
  const prevSetNeed = window.setVehicleShopNeed;
  if (typeof prevSetNeed === 'function') {
    window.setVehicleShopNeed = function(value){
      const r = prevSetNeed.apply(this, arguments);
      setTimeout(enhanceShopAfterRender, 180);
      return r;
    };
  }
  const prevNavigate = window.navigate;
  if (typeof prevNavigate === 'function') {
    window.navigate = function(sectionId){
      const r = prevNavigate.apply(this, arguments);
      if (sectionId === 'tienda') setTimeout(enhanceShopAfterRender, 500);
      return r;
    };
  }
  document.addEventListener('click', function(ev){
    const card = ev.target.closest('.product-card[data-product-id]');
    if (!card) return;
    if (ev.target.closest('button, select, input, a, .favorite-product-btn')) return;
    const id = card.getAttribute('data-product-id');
    if (id) window.openProductModal(id);
  });
  document.addEventListener('DOMContentLoaded', () => setTimeout(enhanceShopAfterRender, 900));
})();
