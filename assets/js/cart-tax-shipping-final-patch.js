/* AutoRepara cart totals patch: VAT + realistic shipping + free-shipping threshold */
(function(){
  const CART_KEY = 'autorepara_cart_v1';
  const VAT_RATE = 0.21;
  const STANDARD_SHIPPING = 4.90;
  const FREE_SHIPPING_THRESHOLD = 60.00;

  function readCart(){
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch { return []; }
  }

  function writeCart(cart){
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCounterSafe();
  }

  function updateCartCounterSafe(){
    const totalItems = readCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = String(totalItems); });
  }

  function money(value){
    const n = Number(value || 0);
    try { return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }); }
    catch { return `${n.toFixed(2)} €`; }
  }

  function esc(value){
    const div = document.createElement('div');
    div.textContent = value == null ? '' : String(value);
    return div.innerHTML;
  }

  function subtotalNet(cart){
    return cart.reduce((sum, item) => sum + Number(item.unit_price || 0) * Number(item.quantity || 0), 0);
  }

  function calculateCartBreakdown(cart){
    const base = subtotalNet(cart);
    const vat = base * VAT_RATE;
    const productsWithVat = base + vat;
    const shipping = base === 0 ? 0 : (productsWithVat >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING);
    const missingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - productsWithVat);
    const total = productsWithVat + shipping;
    return {
      base,
      vat,
      productsWithVat,
      shipping,
      total,
      missingForFreeShipping,
      freeShipping: shipping === 0 && base > 0,
      shippingThreshold: FREE_SHIPPING_THRESHOLD,
      standardShipping: STANDARD_SHIPPING
    };
  }

  function renderShippingAdvice(b){
    if (b.base <= 0) return '';
    if (b.freeShipping) {
      return `<div class="shipping-advice shipping-free"><i class="fa-solid fa-truck-fast"></i><span>Envío gratuito aplicado al superar ${money(b.shippingThreshold)}.</span></div>`;
    }
    const isWorthAdding = b.missingForFreeShipping <= b.standardShipping;
    return `<div class="shipping-advice ${isWorthAdding ? 'shipping-worth' : ''}"><i class="fa-solid ${isWorthAdding ? 'fa-lightbulb' : 'fa-circle-info'}"></i><span>${isWorthAdding ? `Te compensa añadir ${money(b.missingForFreeShipping)} más para ahorrar ${money(b.standardShipping)} de envío.` : `Te faltan ${money(b.missingForFreeShipping)} para envío gratis.`}</span></div>`;
  }

  function renderCartItems(cart){
    if (!cart.length) return `<div class="cart-empty-state">Tu carrito está vacío. Añade una herramienta desde la tienda.</div>`;
    return cart.map((item, index) => `
      <div class="cart-item">
        <div>
          <div class="cart-item-title">${esc(item.name)}</div>
          <div class="cart-item-sub">${esc(item.variant_label)} · ${money(item.unit_price)} sin IVA</div>
        </div>
        <div class="cart-qty">
          <button type="button" onclick="changeCartQty(${index},-1)">−</button>
          <strong>${Number(item.quantity || 1)}</strong>
          <button type="button" onclick="changeCartQty(${index},1)">+</button>
        </div>
        <div class="cart-line-total">${money(Number(item.unit_price || 0) * Number(item.quantity || 0))}</div>
        <button class="cart-remove" type="button" onclick="removeCartItem(${index})"><i class="fa-solid fa-trash"></i></button>
      </div>
    `).join('');
  }

  function renderCartSummary(b){
    return `
      <div class="cart-summary-card cart-tax-summary">
        <div class="summary-line"><span>Productos sin IVA</span><strong>${money(b.base)}</strong></div>
        <div class="summary-line"><span>IVA 21%</span><strong>${money(b.vat)}</strong></div>
        <div class="summary-line"><span>Productos con IVA</span><strong>${money(b.productsWithVat)}</strong></div>
        <div class="summary-line"><span>Gastos de envío</span><strong>${b.shipping === 0 ? 'Gratis' : money(b.shipping)}</strong></div>
        ${renderShippingAdvice(b)}
        <div class="summary-line total"><span>Total a pagar</span><strong>${money(b.total)}</strong></div>
      </div>
    `;
  }

  function renderCartDrawer(){
    const cart = readCart();
    const b = calculateCartBreakdown(cart);
    return `
      <aside class="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div class="cart-drawer-header">
          <div>
            <h3 id="cart-title">Carrito</h3>
            <p style="color:var(--text-secondary);font-size:13px;margin-top:6px">El total incluye IVA y gastos de envío antes de crear el pedido.</p>
          </div>
          <button class="cart-close" onclick="closeCartModal()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="cart-items-list">${renderCartItems(cart)}</div>
        ${renderCartSummary(b)}
        <form class="checkout-form" onsubmit="submitOrder(event)">
          <label>Nombre completo<input name="customer_name" required maxlength="120" autocomplete="name"></label>
          <label>Email<input type="email" name="customer_email" required maxlength="180" autocomplete="email"></label>
          <label>Teléfono<input name="customer_phone" maxlength="40" autocomplete="tel"></label>
          <label class="full">Dirección de envío<textarea name="shipping_address" required rows="3" maxlength="500" autocomplete="street-address"></textarea></label>
          <label class="full">Notas del pedido<textarea name="notes" rows="2" maxlength="500" placeholder="Horario de entrega, observaciones, etc."></textarea></label>
          <button class="checkout-submit" type="submit" ${cart.length ? '' : 'disabled'}><i class="fa-solid fa-check"></i> Crear pedido</button>
        </form>
      </aside>
    `;
  }

  function closeCartModal(){
    const existing = document.getElementById('cart-modal-overlay');
    if (existing) existing.remove();
  }

  function openCartModal(){
    closeCartModal();
    const modal = document.createElement('div');
    modal.className = 'cart-modal-overlay';
    modal.id = 'cart-modal-overlay';
    modal.innerHTML = renderCartDrawer();
    document.body.appendChild(modal);
  }

  function changeCartQty(index, delta){
    const cart = readCart();
    if (!cart[index]) return;
    cart[index].quantity = Math.max(1, Number(cart[index].quantity || 1) + Number(delta || 0));
    writeCart(cart);
    openCartModal();
  }

  function removeCartItem(index){
    const cart = readCart();
    cart.splice(index, 1);
    writeCart(cart);
    openCartModal();
  }

  function showOrderConfirmationWithBreakdown(orderId, payload, items, b){
    const overlay = document.createElement('div');
    overlay.className = 'order-confirm-overlay';
    overlay.id = 'order-confirm-overlay';
    overlay.innerHTML = `
      <div class="order-confirm-modal">
        <div class="order-confirm-header">
          <div><h3>Pedido recibido</h3><p style="color:var(--text-secondary)">Guarda este número para cualquier consulta.</p></div>
          <button class="modal-close-btn" onclick="closeOrderConfirmation()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="order-confirm-id">${esc(String(orderId))}</div>
        <div class="cart-summary-card">
          <div class="summary-line"><span>Cliente</span><strong>${esc(payload.p_customer_name)}</strong></div>
          <div class="summary-line"><span>Email</span><strong>${esc(payload.p_customer_email)}</strong></div>
          <div class="summary-line"><span>Productos sin IVA</span><strong>${money(b.base)}</strong></div>
          <div class="summary-line"><span>IVA 21%</span><strong>${money(b.vat)}</strong></div>
          <div class="summary-line"><span>Envío</span><strong>${b.shipping === 0 ? 'Gratis' : money(b.shipping)}</strong></div>
          <div class="summary-line total"><span>Total pedido</span><strong>${money(b.total)}</strong></div>
        </div>
        <div class="section-title" style="font-size:16px">Resumen</div>
        <div class="cart-items-list">
          ${items.map(item => `<div class="cart-item"><div><div class="cart-item-title">${esc(item.name)}</div><div class="cart-item-sub">${esc(item.variant_label)} · cantidad ${Number(item.quantity || 1)}</div></div><div class="cart-line-total">${money(Number(item.unit_price || 0) * Number(item.quantity || 0))}</div></div>`).join('')}
        </div>
        <div class="order-confirm-actions">
          <button class="btn-cart" onclick="closeOrderConfirmation();navigate('tienda')"><i class="fa-solid fa-store"></i> Volver a tienda</button>
          <button class="btn-product-detail" onclick="window.print()"><i class="fa-solid fa-print"></i> Imprimir</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  async function submitOrder(event){
    event.preventDefault();
    const cart = readCart();
    if (!cart.length) return (typeof showToast === 'function' ? showToast('El carrito está vacío.', 'error') : alert('El carrito está vacío.'));

    const b = calculateCartBreakdown(cart);
    const form = event.currentTarget;
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Creando pedido…';

    const formData = new FormData(form);
    const userNotes = String(formData.get('notes') || '').trim();
    const totalsNote = `\n\n--- Desglose visible en tienda ---\nProductos sin IVA: ${money(b.base)}\nIVA 21%: ${money(b.vat)}\nProductos con IVA: ${money(b.productsWithVat)}\nEnvío: ${b.shipping === 0 ? 'Gratis' : money(b.shipping)}\nTotal a pagar: ${money(b.total)}`;
    const payload = {
      p_customer_name: String(formData.get('customer_name') || '').trim(),
      p_customer_email: String(formData.get('customer_email') || '').trim(),
      p_customer_phone: String(formData.get('customer_phone') || '').trim(),
      p_shipping_address: String(formData.get('shipping_address') || '').trim(),
      p_notes: `${userNotes}${totalsNote}`.trim(),
      p_items: cart.map(item => ({ product_id: item.product_id, variant_id: item.variant_id, quantity: Number(item.quantity) }))
    };

    try {
      let orderId;
      if (typeof supabaseDb === 'undefined' || !supabaseDb) {
        orderId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
        localStorage.setItem('autorepara_last_demo_order', JSON.stringify({ id: orderId, breakdown: b, payload, created_at: new Date().toISOString() }));
      } else {
        const { data, error } = await supabaseDb.rpc('create_order', payload);
        if (error) throw error;
        const result = Array.isArray(data) ? data[0] : data;
        orderId = result && result.order_id ? result.order_id : (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
      }

      const oldCart = [...cart];
      writeCart([]);
      closeCartModal();
      if (typeof renderStore === 'function') {
        try { await renderStore(typeof currentStoreQuery !== 'undefined' ? currentStoreQuery : '', typeof currentStoreCategory !== 'undefined' ? currentStoreCategory : 'all'); } catch {}
      }
      showOrderConfirmationWithBreakdown(orderId, payload, oldCart, b);
    } catch (error) {
      console.error(error);
      if (typeof showToast === 'function') showToast(`No se pudo crear el pedido: ${error.message || error}`, 'error');
      else alert(`No se pudo crear el pedido: ${error.message || error}`);
      submitButton.disabled = false;
      submitButton.innerHTML = '<i class="fa-solid fa-check"></i> Crear pedido';
    }
  }

  function injectStyles(){
    if (document.getElementById('cart-tax-shipping-final-style')) return;
    const style = document.createElement('style');
    style.id = 'cart-tax-shipping-final-style';
    style.textContent = `
      .cart-tax-summary .summary-line strong{white-space:nowrap}
      .shipping-advice{display:flex;align-items:flex-start;gap:9px;background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.22);border-radius:var(--radius);padding:10px 12px;margin:12px 0;color:#93c5fd;font-size:12px;line-height:1.45}
      .shipping-advice i{margin-top:2px;color:#60a5fa}.shipping-free{background:var(--accent-green-dim);border-color:rgba(34,197,94,.28);color:#86efac}.shipping-free i{color:var(--accent-green)}.shipping-worth{background:var(--accent-orange-dim);border-color:var(--border-accent);color:#fed7aa}.shipping-worth i{color:var(--accent-orange)}
    `;
    document.head.appendChild(style);
  }

  injectStyles();
  window.calculateCartBreakdown = calculateCartBreakdown;
  window.openCartModal = openCartModal;
  window.closeCartModal = closeCartModal;
  window.changeCartQty = changeCartQty;
  window.removeCartItem = removeCartItem;
  window.submitOrder = submitOrder;
  window.updateCartCounter = updateCartCounterSafe;
  document.addEventListener('DOMContentLoaded', updateCartCounterSafe);
})();
