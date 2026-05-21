/* Extracted from index_tienda_popup_recuperado_sin_aceite_extra.html | original script id: kit-carrito-robust-final-patch */

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

  function asCartItem(product){
    if (!product) return null;
    const productId = product.product_id || product.id || product.slug || normalize(product.name);
    const variantId = product.variant_id || product.variantId || `${productId}__default`;
    return {
      product_id: String(productId),
      variant_id: String(variantId),
      name: product.name || 'Producto',
      variant_label: product.variant_label || product.variantLabel || product.size || 'Única',
      unit_price: Number(product.unit_price ?? product.price ?? 0),
      quantity: 1
    };
  }

  function productIdentity(product){
    if (!product) return new Set();
    return new Set([
      product.product_id,
      product.id,
      product.slug,
      product.variant_id,
      product.variantId,
      normalize(product.name)
    ].filter(Boolean).map(String));
  }

  function isBaseProduct(product){
    const base = window.__kitCurrentBaseProduct;
    if (!product || !base) return false;
    const productIds = productIdentity(product);
    const baseIds = productIdentity(base);
    for (const id of productIds) {
      if (baseIds.has(id)) return true;
    }
    const productName = normalize(product.name);
    const baseName = normalize(base.name);
    return Boolean(productName && baseName && (productName === baseName || productName.includes(baseName) || baseName.includes(productName)));
  }

  function addOneKitProduct(product, cart){
    const item = asCartItem(product);
    if (!item || isBaseProduct(product)) return false;
    const exists = cart.find(row => String(row.variant_id) === String(item.variant_id));
    if (exists) {
      exists.quantity = Math.max(1, Number(exists.quantity || 1) + 1);
    } else {
      cart.push(item);
    }
    return true;
  }

  function openCartReliably(){
    let attempts = 0;
    const tryOpen = function(){
      attempts += 1;
      try {
        if (typeof window.openCartModal === 'function') {
          window.openCartModal();
          return true;
        }
      } catch (error) {}

      const cartButton = document.querySelector('.shop-cart-button, [onclick*="openCartModal"], [data-open-cart]');
      if (cartButton) {
        cartButton.click();
        return true;
      }

      if (attempts === 1 && typeof window.navigate === 'function') {
        try { window.navigate('tienda'); } catch (error) {}
      }

      if (attempts < 8) {
        setTimeout(tryOpen, 180);
      }
      return false;
    };
    setTimeout(tryOpen, 60);
  }

  function closeKitPopup(){
    document.getElementById('kit-upsell-popup')?.remove();
  }

  function markKitButtonsAdded(ids){
    ids.forEach(id => {
      try {
        const selector = `[data-kit-add="${String(id).replace(/"/g, '\\"')}"]`;
        const btn = document.querySelector(selector);
        if (btn) {
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Añadido';
          btn.disabled = true;
        }
      } catch (error) {}
    });
  }

  function addFullKitRobust(ids){
    const recommendations = Array.isArray(window.__kitCurrentRecommendations) ? window.__kitCurrentRecommendations : [];
    const allowedIds = Array.isArray(ids) && ids.length ? new Set(ids.map(String)) : null;
    const selected = recommendations.filter(product => {
      const productId = String(product.product_id || product.id || product.slug || '');
      return productId && (!allowedIds || allowedIds.has(productId)) && !isBaseProduct(product);
    });

    const cart = readCart();
    let added = 0;
    const addedIds = [];
    selected.forEach(product => {
      if (addOneKitProduct(product, cart)) {
        added += 1;
        addedIds.push(product.product_id || product.id || product.slug);
      }
    });
    writeCart(cart);
    markKitButtonsAdded(addedIds);
    closeKitPopup();

    if (typeof window.showToast === 'function') {
      try {
        window.showToast(added > 0 ? `${added} productos del kit añadidos al carrito.` : 'El kit ya estaba añadido al carrito.', added > 0 ? 'success' : 'info');
      } catch (error) {}
    }

    openCartReliably();
    return added;
  }

  function addSingleKitProductRobust(productId){
    const product = (Array.isArray(window.__kitCurrentRecommendations) ? window.__kitCurrentRecommendations : [])
      .find(item => String(item.product_id || item.id || item.slug) === String(productId));
    if (!product || isBaseProduct(product)) return false;
    const cart = readCart();
    const ok = addOneKitProduct(product, cart);
    writeCart(cart);
    markKitButtonsAdded([productId]);
    if (ok && typeof window.showToast === 'function') {
      try { window.showToast(`${product.name} añadido al carrito.`, 'success'); } catch (error) {}
    }
    return ok;
  }

  window.addFullRecommendedKitStable = addFullKitRobust;
  window.addFullRecommendedKit = addFullKitRobust;
  window.addFullRecommendedKitFinal = addFullKitRobust;
  window.addKitRecommendedProductStable = addSingleKitProductRobust;
  window.addKitRecommendedProduct = addSingleKitProductRobust;
  window.addKitRecommendedProductFinal = addSingleKitProductRobust;
  window.openKitCartStable = openCartReliably;
})();
