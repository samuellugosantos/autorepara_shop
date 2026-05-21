(function(){
  function normalize(value){
    return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  }
  function isOilLike(text){
    const t = normalize(text);
    return /\baceite\b|lubricante|motor oil|oil filter|0w\s*-?\s*20|0w\s*-?\s*30|5w\s*-?\s*20|5w\s*-?\s*30|504\s*\/?\s*507|508\s*\/?\s*509|vw\s*504|vw\s*507|vw\s*508|vw\s*509|ll\s*-?\s*04|rn17|psa\s*b71|b71\s*2010/.test(t);
  }
  function productText(product){
    if (!product) return '';
    return [
      product.name, product.title, product.category, product.description, product.desc,
      product.variant_label, product.variantLabel, product.keywords,
      Array.isArray(product.features) ? product.features.join(' ') : product.features
    ].filter(Boolean).join(' ');
  }
  function rememberBaseFromButton(button){
    const card = button && button.closest ? button.closest('.product-card') : null;
    if (!card) return;
    const selected = card.querySelector('select option:checked')?.textContent || '';
    const text = `${card.textContent || ''} ${selected}`;
    window.__autoreparaLastKitBaseText = text;
    window.__autoreparaLastKitBaseIsOil = isOilLike(text);
  }
  function filterOilRecommendations(){
    if (!window.__autoreparaLastKitBaseIsOil) return;
    if (Array.isArray(window.__kitCurrentRecommendations)) {
      window.__kitCurrentRecommendations = window.__kitCurrentRecommendations.filter(product => !isOilLike(productText(product)));
    }
  }
  function cleanOilCardsFromPopup(){
    if (!window.__autoreparaLastKitBaseIsOil) return;
    filterOilRecommendations();
    const popup = document.getElementById('kit-upsell-popup') || document.querySelector('.kit-upsell-modal');
    if (!popup) return;
    popup.querySelectorAll('.kit-product-card, .kit-upsell-product, [data-kit-product]').forEach(card => {
      if (isOilLike(card.textContent || '')) card.remove();
    });
    const remaining = popup.querySelectorAll('.kit-product-card, .kit-upsell-product, [data-kit-product]').length;
    if (!remaining && !popup.querySelector('.kit-oil-filter-note')) {
      const body = popup.querySelector('.kit-upsell-products, .kit-upsell-body, .kit-products-grid') || popup;
      const note = document.createElement('div');
      note.className = 'kit-oil-filter-note';
      note.style.cssText = 'border:1px solid var(--border);background:var(--bg-elevated);border-radius:var(--radius);padding:14px;color:var(--text-secondary);font-size:13px;line-height:1.5;margin:12px 0;';
      note.innerHTML = '<i class="fa-solid fa-circle-info" style="color:var(--accent-orange);margin-right:8px"></i>Ya has añadido el aceite seleccionado. No se recomienda otro aceite diferente dentro del mismo kit; añade solo herramientas o materiales complementarios disponibles.';
      body.appendChild(note);
    }
  }

  document.addEventListener('click', function(event){
    const btn = event.target.closest && event.target.closest('.product-card .btn-cart');
    if (btn) {
      rememberBaseFromButton(btn);
      setTimeout(cleanOilCardsFromPopup, 250);
      setTimeout(cleanOilCardsFromPopup, 700);
      setTimeout(cleanOilCardsFromPopup, 1200);
    }
  }, true);

  const wrapFullKit = function(name){
    const original = window[name];
    if (typeof original !== 'function' || original.__oilPatchWrapped) return;
    const wrapped = function(ids){
      if (window.__autoreparaLastKitBaseIsOil) {
        filterOilRecommendations();
        if (Array.isArray(ids) && Array.isArray(window.__kitCurrentRecommendations)) {
          const allowed = new Set(window.__kitCurrentRecommendations.map(p => String(p.product_id || p.id || p.slug || '')));
          ids = ids.filter(id => allowed.has(String(id)));
        }
      }
      cleanOilCardsFromPopup();
      return original.call(this, ids);
    };
    wrapped.__oilPatchWrapped = true;
    window[name] = wrapped;
  };
  const wrapSingleAdd = function(name){
    const original = window[name];
    if (typeof original !== 'function' || original.__oilPatchWrapped) return;
    const wrapped = function(productId){
      if (window.__autoreparaLastKitBaseIsOil && Array.isArray(window.__kitCurrentRecommendations)) {
        const product = window.__kitCurrentRecommendations.find(p => String(p.product_id || p.id || p.slug || '') === String(productId));
        if (product && isOilLike(productText(product))) return false;
      }
      return original.apply(this, arguments);
    };
    wrapped.__oilPatchWrapped = true;
    window[name] = wrapped;
  };
  function installWrappers(){
    ['addFullRecommendedKit','addFullRecommendedKitStable','addFullRecommendedKitFinal'].forEach(wrapFullKit);
    ['addKitRecommendedProduct','addKitRecommendedProductStable','addKitRecommendedProductFinal'].forEach(wrapSingleAdd);
  }
  installWrappers();
  setInterval(installWrappers, 800);

  const observer = new MutationObserver(function(){ cleanOilCardsFromPopup(); });
  if (document.body) observer.observe(document.body, { childList:true, subtree:true });
})();
