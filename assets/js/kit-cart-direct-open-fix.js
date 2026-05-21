(function(){
  function sleep(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }
  function normalizeText(value){
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }
  function isBaseProduct(product, base){
    if (!product || !base) return false;
    const productId = String(product.product_id || product.id || '');
    const baseId = String(base.product_id || base.id || '');
    const productVariant = String(product.variant_id || '');
    const baseVariant = String(base.variant_id || '');
    const productName = normalizeText(product.name || product.title || '');
    const baseName = normalizeText(base.name || base.title || '');
    if (productId && baseId && productId === baseId) return true;
    if (productVariant && baseVariant && productVariant === baseVariant) return true;
    if (productName && baseName && productName === baseName) return true;
    return false;
  }
  function closeKitPopupHard(){
    ['kit-upsell-popup','kit-popup','kit-recommended-popup'].forEach(id => {
      const node = document.getElementById(id);
      if (node) node.remove();
    });
    document.querySelectorAll('.kit-upsell-overlay').forEach(node => node.remove());
  }
  async function forceOpenCart(){
    if (typeof window.navigate === 'function') {
      try { window.navigate('tienda'); } catch (error) {}
    }
    await sleep(180);
    closeKitPopupHard();
    for (let attempt = 0; attempt < 12; attempt += 1) {
      if (typeof window.openCartModal === 'function') {
        try { window.openCartModal(); } catch (error) {}
      }
      await sleep(90);
      const cartOpen = document.getElementById('cart-modal-overlay') || document.querySelector('.cart-modal-overlay .cart-modal, .cart-drawer, .cart-modal');
      if (cartOpen) return true;
      const cartButton = document.querySelector('.shop-cart-button, button[onclick*="openCartModal"], [data-open-cart]');
      if (cartButton) {
        try { cartButton.click(); } catch (error) {}
      }
      await sleep(90);
      if (document.getElementById('cart-modal-overlay') || document.querySelector('.cart-drawer, .cart-modal')) return true;
    }
    return false;
  }
  async function addFullRecommendedKitAndOpenCart(ids){
    const recommendations = Array.isArray(window.__kitCurrentRecommendations) ? window.__kitCurrentRecommendations : [];
    const base = window.__kitCurrentBaseProduct || null;
    const rawIds = Array.isArray(ids) && ids.length ? ids : recommendations.map(item => item && (item.product_id || item.id));
    const uniqueIds = [];
    rawIds.forEach(id => {
      const key = String(id || '');
      if (key && !uniqueIds.includes(key)) uniqueIds.push(key);
    });
    let added = 0;
    window.__kitPopupInternalAdd = true;
    uniqueIds.forEach(id => {
      const product = recommendations.find(item => String(item && (item.product_id || item.id)) === String(id));
      if (!product || isBaseProduct(product, base)) return;
      if (typeof window.addKitRecommendedProductStable === 'function') {
        const result = window.addKitRecommendedProductStable(id);
        if (result !== false) added += 1;
      }
    });
    window.__kitPopupInternalAdd = false;
    if (typeof window.updateCartCounter === 'function') {
      try { window.updateCartCounter(); } catch (error) {}
    }
    closeKitPopupHard();
    if (typeof window.showToast === 'function') {
      const message = added > 0
        ? `${added} productos del kit añadidos al carrito.`
        : 'El kit ya estaba añadido o no contenía productos nuevos.';
      window.showToast(message, added > 0 ? 'success' : 'info');
    }
    await forceOpenCart();
  }
  window.addFullRecommendedKitStable = addFullRecommendedKitAndOpenCart;
  window.addFullRecommendedKit = addFullRecommendedKitAndOpenCart;
  window.addFullRecommendedKitFinal = addFullRecommendedKitAndOpenCart;
  window.openKitCartStable = forceOpenCart;
})();
