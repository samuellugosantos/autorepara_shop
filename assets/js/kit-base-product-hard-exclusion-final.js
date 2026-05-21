(function(){
  const CART_KEY = 'autorepara_cart_v1';

  function normalize(value){
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function words(value){
    return normalize(value).split(' ').filter(Boolean);
  }

  function textOf(product){
    if (!product) return '';
    return normalize([
      product.name,
      product.title,
      product.category,
      product.description,
      product.variant_label,
      product.variantLabel,
      product.keywords,
      Array.isArray(product.features) ? product.features.join(' ') : ''
    ].filter(Boolean).join(' '));
  }

  function productId(product){
    if (!product) return '';
    return String(product.product_id || product.id || product.slug || '').trim();
  }

  function variantId(product){
    if (!product) return '';
    return String(product.variant_id || product.variantId || '').trim();
  }

  function familyFromText(value){
    const t = normalize(value);
    if (!t) return 'otro';

    if (/(filtro|filter)/.test(t) && /(aceite|oil)/.test(t)) return 'filtro_aceite';
    if (/(filtro|filter)/.test(t) && /(aire|air)/.test(t)) return 'filtro_aire';
    if (/(filtro|filter)/.test(t) && /(habitaculo|cabina|cabin|polen|pollen)/.test(t)) return 'filtro_habitaculo';
    if (/(filtro|filter)/.test(t) && /(combustible|fuel|gasoleo|diesel)/.test(t)) return 'filtro_combustible';
    if (/(aceite|oil|lubricante|lubricant|0w|5w|10w|vw 504|vw 507|rn17|ll 04|longlife)/.test(t)) return 'aceite_motor';

    if (/(pastilla|pastillas|brake pad|brake pads)/.test(t)) return 'pastillas_freno';
    if (/(disco|discos|brake disc|brake rotor)/.test(t)) return 'discos_freno';
    if (/(liquido|liquid|fluid)/.test(t) && /(freno|brake|dot4|dot 4)/.test(t)) return 'liquido_frenos';
    if (/(limpiador|cleaner)/.test(t) && /(freno|brake)/.test(t)) return 'limpiador_frenos';

    if (/(refrigerante|anticongelante|coolant|g12|g13|g12evo)/.test(t)) return 'refrigerante';
    if (/(adblue|urea)/.test(t)) return 'adblue';
    if (/(bujia|bujias|spark plug|spark plugs|ngk|iridium|iridio)/.test(t)) return 'bujias';
    if (/(bobina|coil|encendido|ignition)/.test(t)) return 'bobinas';
    if (/(bateria|battery|bornas|alternador)/.test(t)) return 'bateria';
    if (/(correa|cadena|distribucion|distribución|timing|tensor|polea|poleas)/.test(t)) return 'distribucion';
    if (/(limpiaparabrisas|escobilla|wiper)/.test(t)) return 'limpiaparabrisas';

    if (/(obd|scanner|diagnostico|diagnóstico|codigo|código)/.test(t)) return 'obd';
    if (/(torquimetro|torquímetro|dinamometrica|dinamométrica|torque wrench)/.test(t)) return 'torquimetro';
    if (/(gato|hydraulic jack|jack)/.test(t)) return 'gato';
    if (/(borriqueta|borriquetas|caballete|caballetes|jack stand)/.test(t)) return 'borriquetas';
    if (/(embudo|funnel)/.test(t)) return 'embudo';
    if (/(bandeja|drenaje|recipiente|drain pan)/.test(t)) return 'bandeja_drenaje';
    if (/(guante|guantes|glove|gloves)/.test(t)) return 'guantes';
    if (/(multimetro|multímetro|tester)/.test(t)) return 'multimetro';

    return 'otro';
  }

  function brandSignature(value){
    const t = normalize(value);
    const brands = [];
    const brandMap = {
      renault: ['renault','megane','clio','captur','dacia','rn17'],
      seat: ['seat','leon','ibiza','ateca'],
      volkswagen: ['volkswagen','vw','golf','passat','polo','vag'],
      peugeot: ['peugeot','308','208','puretech','psa'],
      ford: ['ford','focus','fiesta','ecoboost'],
      toyota: ['toyota','corolla','yaris','hybrid','hibrido'],
      bmw: ['bmw','320d','serie 3','b47','ll 04']
    };
    Object.entries(brandMap).forEach(([brand, terms]) => {
      if (terms.some(term => t.includes(normalize(term)))) brands.push(brand);
    });
    return brands;
  }

  function specSignature(value){
    const t = normalize(value);
    const specs = [];
    const patterns = [
      /\b0w\s?20\b/g, /\b0w\s?30\b/g, /\b5w\s?20\b/g, /\b5w\s?30\b/g, /\b5w\s?40\b/g, /\b10w\s?40\b/g,
      /\bvw\s?504\b/g, /\bvw\s?507\b/g, /\brn17\b/g, /\bll\s?04\b/g, /\bdot\s?4\b/g, /\bg12\b/g, /\bg13\b/g,
      /\bea888\b/g, /\bea211\b/g, /\beb2\b/g, /\bh5ht\b/g, /\becoboost\b/g, /\bb47\b/g, /\b2zr\b/g
    ];
    patterns.forEach(pattern => {
      const matches = t.match(pattern);
      if (matches) matches.forEach(match => specs.push(normalize(match)));
    });
    return specs;
  }

  function lockFromCard(card){
    if (!card) return null;
    const select = card.querySelector('select');
    const option = select && select.options ? select.options[select.selectedIndex] : null;
    const raw = [
      card.dataset.productId,
      card.id ? card.id.replace(/^shop-/, '') : '',
      card.querySelector('h3')?.textContent || '',
      card.querySelector('.product-kicker')?.textContent || '',
      card.querySelector('.product-description')?.textContent || '',
      card.querySelector('.product-brief')?.textContent || '',
      option?.textContent || ''
    ].filter(Boolean).join(' ');
    const name = card.querySelector('h3')?.textContent?.trim() || '';
    const id = String(card.dataset.productId || (card.id || '').replace(/^shop-/, '') || '').trim();
    return {
      product_id: id,
      id,
      variant_id: option?.dataset?.variantId || option?.value || '',
      name,
      text: normalize(raw),
      family: familyFromText(raw),
      brands: brandSignature(raw),
      specs: specSignature(raw),
      tokens: words(raw)
    };
  }

  function lockFromProduct(product){
    const raw = textOf(product);
    return {
      product_id: productId(product),
      id: productId(product),
      variant_id: variantId(product),
      name: product?.name || product?.title || '',
      text: raw,
      family: familyFromText(raw),
      brands: brandSignature(raw),
      specs: specSignature(raw),
      tokens: words(raw)
    };
  }

  function intersectionCount(a, b){
    const bs = new Set(b || []);
    return (a || []).filter(x => bs.has(x)).length;
  }

  function isBaseEquivalent(product, baseOverride){
    const base = baseOverride || window.__kitLockedBaseProduct || window.__kitCurrentBaseProduct || null;
    if (!product || !base) return false;

    const baseLock = base.family ? base : lockFromProduct(base);
    const candidateLock = product.family ? product : lockFromProduct(product);

    const pId = productId(product) || String(candidateLock.product_id || candidateLock.id || '');
    const bId = String(baseLock.product_id || baseLock.id || productId(base) || '');
    const pVariant = variantId(product) || String(candidateLock.variant_id || '');
    const bVariant = String(baseLock.variant_id || variantId(base) || '');

    if (pId && bId && pId === bId) return true;
    if (pVariant && bVariant && pVariant === bVariant) return true;

    const pName = normalize(product.name || product.title || candidateLock.name || '');
    const bName = normalize(baseLock.name || base.name || base.title || '');
    if (pName && bName) {
      if (pName === bName) return true;
      if (pName.length > 8 && bName.length > 8 && (pName.includes(bName) || bName.includes(pName))) return true;
    }

    const pFamily = candidateLock.family || familyFromText(candidateLock.text);
    const bFamily = baseLock.family || familyFromText(baseLock.text);

    if (pFamily !== 'otro' && bFamily !== 'otro' && pFamily === bFamily) {
      const brandOverlap = intersectionCount(candidateLock.brands, baseLock.brands);
      const specOverlap = intersectionCount(candidateLock.specs, baseLock.specs);
      const tokenOverlap = intersectionCount(candidateLock.tokens, baseLock.tokens);

      // Same family + same brand/spec is the same product line, even if one card is labelled as generic.
      if (brandOverlap > 0 || specOverlap > 0) return true;

      // If both names are very close, block it as a duplicate too.
      const minWords = Math.min((candidateLock.tokens || []).length, (baseLock.tokens || []).length);
      if (minWords > 0 && tokenOverlap >= Math.max(2, Math.ceil(minWords * 0.55))) return true;

      // For consumables, do not recommend another item of the exact same consumable family.
      const consumableFamilies = new Set([
        'aceite_motor','filtro_aceite','filtro_aire','filtro_habitaculo','filtro_combustible',
        'pastillas_freno','discos_freno','liquido_frenos','refrigerante','adblue','bujias','bobinas',
        'bateria','distribucion','limpiaparabrisas','obd','torquimetro','gato','borriquetas'
      ]);
      if (consumableFamilies.has(pFamily)) return true;
    }

    return false;
  }

  function filterRecommendationsHard(list){
    const base = window.__kitLockedBaseProduct || window.__kitCurrentBaseProduct || null;
    const seen = new Set();
    return (Array.isArray(list) ? list : []).filter(product => {
      if (!product || isBaseEquivalent(product, base)) return false;
      const key = [productId(product), variantId(product), normalize(product.name || product.title || '')].filter(Boolean).join('|');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function removeBaseCardsFromVisiblePopup(){
    const popup = document.getElementById('kit-upsell-popup');
    if (!popup) return;

    const recommendations = filterRecommendationsHard(window.__kitCurrentRecommendations || []);
    window.__kitCurrentRecommendations = recommendations;
    const allowedNames = new Set(recommendations.map(product => normalize(product.name || product.title || '')));

    popup.querySelectorAll('.kit-product-card').forEach(card => {
      const title = normalize(card.querySelector('h4')?.textContent || '');
      const virtualProduct = { name: title };
      if (!title || isBaseEquivalent(virtualProduct) || !allowedNames.has(title)) {
        card.remove();
      }
    });

    const ids = recommendations.map(product => productId(product)).filter(Boolean);
    popup.querySelectorAll('.kit-primary-btn').forEach(button => {
      button.onclick = function(){ return window.addFullRecommendedKitStable(ids); };
    });

    const countTarget = popup.querySelector('.kit-saving-card .kit-saving-value');
    if (countTarget) countTarget.textContent = `${recommendations.length} productos`;

    if (!recommendations.length) popup.remove();
  }

  function readCart(){
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch (error) { return []; }
  }

  function writeCart(cart){
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    const total = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = String(total); });
    if (typeof window.updateCartCounter === 'function') {
      try { window.updateCartCounter(); } catch (error) {}
    }
  }

  function addCartItem(product){
    if (!product || isBaseEquivalent(product)) return false;
    const id = productId(product) || normalize(product.name || product.title || '');
    const variant = variantId(product) || `${id}__default`;
    if (!id) return false;

    const cart = readCart();
    const existing = cart.find(item => String(item.variant_id) === String(variant));
    if (existing) existing.quantity = Math.max(1, Number(existing.quantity || 1) + 1);
    else cart.push({
      product_id: String(id),
      variant_id: String(variant),
      name: product.name || product.title || 'Producto',
      variant_label: product.variant_label || product.variantLabel || 'Única',
      unit_price: Number(product.unit_price ?? product.price ?? 0),
      quantity: 1
    });
    writeCart(cart);
    return true;
  }

  function openCartReliably(){
    let attempts = 0;
    const run = function(){
      attempts += 1;
      try {
        if (typeof window.openCartModal === 'function') {
          window.openCartModal();
          return;
        }
      } catch (error) {}
      const button = document.querySelector('.shop-cart-button, [onclick*="openCartModal"], [data-open-cart]');
      if (button) {
        try { button.click(); return; } catch (error) {}
      }
      if (attempts === 1 && typeof window.navigate === 'function') {
        try { window.navigate('tienda'); } catch (error) {}
      }
      if (attempts < 12) setTimeout(run, 150);
    };
    setTimeout(run, 80);
  }

  function closePopup(){
    document.getElementById('kit-upsell-popup')?.remove();
    document.querySelectorAll('.kit-upsell-overlay').forEach(node => node.remove());
  }

  document.addEventListener('click', function(event){
    const button = event.target.closest && event.target.closest('.product-card .btn-cart');
    if (!button || window.__kitPopupInternalAdd) return;
    const card = button.closest('.product-card');
    if (!card) return;
    window.__kitLockedBaseProduct = lockFromCard(card);
    // The popup is rendered asynchronously by the original code. Clean it after render.
    setTimeout(removeBaseCardsFromVisiblePopup, 700);
    setTimeout(removeBaseCardsFromVisiblePopup, 1000);
    setTimeout(removeBaseCardsFromVisiblePopup, 1400);
  }, true);

  const observer = new MutationObserver(() => {
    if (document.getElementById('kit-upsell-popup')) {
      setTimeout(removeBaseCardsFromVisiblePopup, 40);
    }
  });
  observer.observe(document.body, { childList:true, subtree:true });

  window.addKitRecommendedProductStable = function(productId){
    const recommendations = filterRecommendationsHard(window.__kitCurrentRecommendations || []);
    window.__kitCurrentRecommendations = recommendations;
    const product = recommendations.find(item => String(productId(item) || item.product_id || item.id || item.slug) === String(productId));
    if (!product || isBaseEquivalent(product)) return false;
    const ok = addCartItem(product);
    const btn = document.querySelector(`[data-kit-add="${CSS.escape(String(productId))}"]`);
    if (btn && ok) {
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Añadido';
      btn.disabled = true;
    }
    if (ok && typeof window.showToast === 'function') {
      try { window.showToast(`${product.name || 'Producto'} añadido al carrito.`, 'success'); } catch (error) {}
    }
    return ok;
  };

  window.addKitRecommendedProduct = window.addKitRecommendedProductStable;
  window.addKitRecommendedProductFinal = window.addKitRecommendedProductStable;

  window.addFullRecommendedKitStable = function(ids){
    const allowed = Array.isArray(ids) && ids.length ? new Set(ids.map(String)) : null;
    const recommendations = filterRecommendationsHard(window.__kitCurrentRecommendations || []);
    window.__kitCurrentRecommendations = recommendations;
    let added = 0;
    recommendations.forEach(product => {
      const id = String(productId(product) || product.id || product.slug || '');
      if (!id || (allowed && !allowed.has(id)) || isBaseEquivalent(product)) return;
      if (addCartItem(product)) added += 1;
    });
    closePopup();
    if (typeof window.showToast === 'function') {
      try { window.showToast(added > 0 ? `${added} productos del kit añadidos al carrito.` : 'El kit no contenía productos nuevos.', added > 0 ? 'success' : 'info'); } catch (error) {}
    }
    openCartReliably();
    return added;
  };

  window.addFullRecommendedKit = window.addFullRecommendedKitStable;
  window.addFullRecommendedKitFinal = window.addFullRecommendedKitStable;
  window.openKitCartStable = openCartReliably;
})();
