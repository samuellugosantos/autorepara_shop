(function(){
  let currentStoreSort = 'relevance';
  let currentStockFilter = 'all';
  const ivaRate = 0.21;

  function productText(product){
    return `${product.name || ''} ${product.category || ''} ${product.description || ''} ${product.keywords || ''} ${(product.features || []).join(' ')}`.toLowerCase();
  }
  function productStock(product){
    return (product.variants || []).reduce((sum,v)=>sum + Number(v.stock || 0), 0);
  }
  function sortProducts(products){
    const list = [...products];
    if (currentStockFilter === 'available') list.splice(0, list.length, ...list.filter(p => productStock(p) > 0));
    if (currentStockFilter === 'low') list.splice(0, list.length, ...list.filter(p => productStock(p) > 0 && productStock(p) <= 5));
    if (currentStoreSort === 'price-asc') return list.sort((a,b)=>Number(a.price || 0)-Number(b.price || 0));
    if (currentStoreSort === 'price-desc') return list.sort((a,b)=>Number(b.price || 0)-Number(a.price || 0));
    if (currentStoreSort === 'stock-desc') return list.sort((a,b)=>productStock(b)-productStock(a));
    return list;
  }
  function stockClass(stock){ return stock <= 0 ? 'stock-out' : stock <= 5 ? 'stock-low' : 'stock-ok'; }
  function stockLabel(stock){ return stock <= 0 ? 'Agotado' : stock <= 5 ? 'Últimas unidades' : 'Disponible'; }

  window.renderStore = async function renderStoreEnhanced(query = '', category = 'all') {
    const container = document.getElementById('tienda-container');
    if (!container) return;
    container.innerHTML = `<div class="page-header"><div class="page-header-label">Tienda AutoRepara · Cargando</div><h1>Preparando<br>catálogo</h1><p>AutoRepara.es / tienda</p></div>`;
    try {
      const loaded = await loadStoreProducts(query, category);
      const products = sortProducts(loaded);
      const sourceLabel = supabaseDb ? 'Catálogo conectado a Supabase' : 'Catálogo demo local';
      container.innerHTML = `
        <div class="page-header">
          <div class="page-header-label">Tienda AutoRepara · Herramientas seleccionadas</div>
          <h1>Herramientas claras,<br>precios honestos</h1>
          <p>AutoRepara.es / tienda</p>
        </div>
        <div class="shop-trust-strip">
          <div class="shop-trust-item"><i class="fa-solid fa-truck-fast"></i><div><strong>Envío sencillo</strong>Preparado para pedidos pequeños y kits completos.</div></div>
          <div class="shop-trust-item"><i class="fa-solid fa-shield-halved"></i><div><strong>Stock validado</strong>La disponibilidad se comprueba antes de crear el pedido.</div></div>
          <div class="shop-trust-item"><i class="fa-solid fa-screwdriver-wrench"></i><div><strong>Selección útil</strong>Herramientas pensadas para mantenimiento real.</div></div>
          <div class="shop-trust-item"><i class="fa-solid fa-headset"></i><div><strong>Soporte técnico</strong>Ayuda para elegir medidas y variantes.</div></div>
        </div>
        <div class="shop-status-bar">
          <div class="shop-status-chip"><i class="fa-solid fa-plug-circle-check"></i>${sourceLabel}</div>
          <button class="shop-cart-button" onclick="openCartModal()"><i class="fa-solid fa-cart-shopping"></i> Carrito <span class="cart-count-badge" data-cart-count>0</span></button>
        </div>
        <div class="shop-controls-advanced">
          <input class="store-search" id="store-search" value="${escapeHtml(query)}" placeholder="Buscar herramientas, OBD, torquímetro…" oninput="renderStore(this.value, document.getElementById('store-filter').value)">
          <select class="store-filter" id="store-filter" onchange="renderStore(document.getElementById('store-search').value, this.value)">
            ${['all','kits','manuales','diagnostico','precision','elevacion','fluidos','limpieza','electricas'].map(c => `<option value="${c}" ${c===category?'selected':''}>${c === 'all' ? 'Todas' : c}</option>`).join('')}
          </select>
          <select class="store-filter" id="store-sort" onchange="currentStoreSort=this.value;renderStore(document.getElementById('store-search').value, document.getElementById('store-filter').value)">
            <option value="relevance" ${currentStoreSort==='relevance'?'selected':''}>Relevancia</option>
            <option value="price-asc" ${currentStoreSort==='price-asc'?'selected':''}>Precio bajo</option>
            <option value="price-desc" ${currentStoreSort==='price-desc'?'selected':''}>Precio alto</option>
            <option value="stock-desc" ${currentStoreSort==='stock-desc'?'selected':''}>Más stock</option>
          </select>
        </div>
        <div class="product-toolbar" style="grid-template-columns:auto auto 1fr;margin-top:-12px">
          <button class="cat-chip" onclick="currentStockFilter='all';renderStore(document.getElementById('store-search').value, document.getElementById('store-filter').value)"><i class="fa-solid fa-layer-group"></i> Todos</button>
          <button class="cat-chip" onclick="currentStockFilter='available';renderStore(document.getElementById('store-search').value, document.getElementById('store-filter').value)"><i class="fa-solid fa-check"></i> Con stock</button>
          <button class="cat-chip" onclick="currentStockFilter='low';renderStore(document.getElementById('store-search').value, document.getElementById('store-filter').value)"><i class="fa-solid fa-bolt"></i> Últimas unidades</button>
        </div>
        ${products.length ? `<div class="store-grid">${products.map(renderProductCardEnhanced).join('')}</div>` : `<div class="store-empty">No hay resultados. Prueba con “OBD”, “vaso”, “refrigerante”, “kit” o “torquímetro”.</div>`}
      `;
      updateCartCounter();
    } catch (error) {
      console.error(error);
      container.innerHTML = `<div class="page-header"><div class="page-header-label">Tienda AutoRepara · Error</div><h1>No se pudo cargar<br>la tienda</h1><p>AutoRepara.es / tienda</p></div><div class="alert alert-danger"><i class="fa-solid fa-triangle-exclamation"></i><div><strong>Error:</strong> ${escapeHtml(error.message || error)}</div></div>`;
    }
  };

  function renderProductCardEnhanced(product){
    const variants = product.variants && product.variants.length ? product.variants : [{ id: makeVariantId(product.id, 'Única'), label:'Única', price: product.price, stock: 0, is_default: true }];
    const defaultVariant = variants.find(v => v.is_default) || variants[0];
    const stockTotal = productStock(product);
    return `<div class="product-card" id="shop-${escapeHtml(product.id)}" data-product-id="${escapeHtml(product.id)}">
      <div class="product-kicker">${escapeHtml(product.category || 'producto')}</div>
      <h3>${escapeHtml(product.name)}</h3>
      <div class="product-price">${euro(defaultVariant.price)}</div>
      <div class="stock-pill ${stockClass(stockTotal)}"><i class="fa-solid ${stockTotal > 0 ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>${stockLabel(stockTotal)} · ${stockTotal} uds.</div>
      <p class="product-description">${escapeHtml(product.description)}</p>
      <div class="product-features">${(product.features || []).map(f => `<span class="product-feature">${escapeHtml(f)}</span>`).join('')}</div>
      <select class="product-size-select" id="variant-${escapeHtml(product.id)}" aria-label="Variante de ${escapeHtml(product.name)}">
        ${variants.map(v => `<option value="${escapeHtml(v.id)}" ${v.id===defaultVariant.id?'selected':''}>${escapeHtml(v.label)} · ${euro(v.price)} · stock ${Number(v.stock || 0)}</option>`).join('')}
      </select>
      <div class="product-card-actions">
        <button class="btn-product-detail" onclick="openProductModal('${escapeHtml(product.id)}')"><i class="fa-solid fa-circle-info"></i> Detalles</button>
        <button class="btn-cart" onclick="addToCart(this)" ${stockTotal <= 0 ? 'disabled' : ''}><i class="fa-solid fa-cart-plus"></i> Añadir</button>
      </div>
    </div>`;
  }

  window.openProductModal = function(productId){
    const product = findProduct(productId);
    if (!product) return showToast('Producto no encontrado.', 'error');
    const variants = product.variants || [];
    const defaultVariant = variants.find(v => v.is_default) || variants[0];
    const overlay = document.createElement('div');
    overlay.className = 'product-modal-overlay';
    overlay.id = 'product-modal-overlay';
    overlay.innerHTML = `<div class="product-modal" role="dialog" aria-modal="true">
      <div class="product-modal-header"><div><div class="product-kicker">${escapeHtml(product.category || 'producto')}</div><h3>${escapeHtml(product.name)}</h3><div class="product-price">${euro(defaultVariant ? defaultVariant.price : product.price)}</div></div><button class="modal-close-btn" onclick="closeProductModal()"><i class="fa-solid fa-xmark"></i></button></div>
      <div class="product-modal-grid">
        <div><p class="product-description" style="font-size:14px">${escapeHtml(product.description)}</p><div class="product-features">${(product.features || []).map(f=>`<span class="product-feature">${escapeHtml(f)}</span>`).join('')}</div><div class="alert alert-info"><i class="fa-solid fa-circle-info"></i><div>Selecciona la variante adecuada antes de añadir al carrito. El stock se valida de nuevo al crear el pedido.</div></div></div>
        <div class="product-detail-box"><h4>Variantes disponibles</h4><div class="variant-list">${variants.map(v=>`<div class="variant-row"><span>${escapeHtml(v.label)}</span><strong>${euro(v.price)} · ${Number(v.stock || 0)} uds.</strong></div>`).join('')}</div><select class="product-size-select" id="modal-variant-${escapeHtml(product.id)}" style="margin-top:14px">${variants.map(v=>`<option value="${escapeHtml(v.id)}">${escapeHtml(v.label)} · ${euro(v.price)}</option>`).join('')}</select><button class="btn-cart" style="width:100%" onclick="addModalProductToCart('${escapeHtml(product.id)}')"><i class="fa-solid fa-cart-plus"></i> Añadir al carrito</button></div>
      </div>
    </div>`;
    document.body.appendChild(overlay);
  };
  window.closeProductModal = function(){ const el = document.getElementById('product-modal-overlay'); if (el) el.remove(); };
  window.addModalProductToCart = function(productId){
    const product = findProduct(productId);
    const select = document.getElementById(`modal-variant-${productId}`);
    const variant = (product.variants || []).find(v => v.id === (select && select.value)) || (product.variants || [])[0];
    if (!product || !variant) return showToast('Producto no disponible.', 'error');
    if (Number(variant.stock) <= 0) return showToast('Sin stock disponible.', 'error');
    const cart = getCart();
    const existing = cart.find(item => item.product_id === product.id && item.variant_id === variant.id);
    if (existing) existing.quantity = Number(existing.quantity || 1) + 1;
    else cart.push({ product_id: product.id, variant_id: variant.id, name: product.name, variant_label: variant.label, unit_price: Number(variant.price), quantity: 1 });
    saveCart(cart); closeProductModal(); showToast('Producto añadido al carrito.', 'success');
  };

  function cartBreakdown(cart){
    const subtotal = cartTotal(cart);
    const iva = subtotal * ivaRate;
    const shipping = subtotal >= 60 || subtotal === 0 ? 0 : 4.90;
    return { subtotal, iva, shipping, total: subtotal + shipping };
  }
  window.openCartModal = function(){ closeCartModal(); const modal = document.createElement('div'); modal.className='cart-modal-overlay'; modal.id='cart-modal-overlay'; modal.innerHTML=renderCartDrawer(); document.body.appendChild(modal); };
  window.closeCartModal = function(){ const existing=document.getElementById('cart-modal-overlay'); if(existing) existing.remove(); };
  function renderCartDrawer(){
    const cart = getCart(); const b = cartBreakdown(cart);
    const itemsHtml = cart.length ? cart.map((item,index)=>`<div class="cart-item"><div><div class="cart-item-title">${escapeHtml(item.name)}</div><div class="cart-item-sub">${escapeHtml(item.variant_label)} · ${euro(item.unit_price)}</div></div><div class="cart-qty"><button type="button" onclick="changeCartQty(${index},-1)">−</button><strong>${Number(item.quantity)}</strong><button type="button" onclick="changeCartQty(${index},1)">+</button></div><div class="cart-line-total">${euro(Number(item.unit_price)*Number(item.quantity))}</div><button class="cart-remove" type="button" onclick="removeCartItem(${index})"><i class="fa-solid fa-trash"></i></button></div>`).join('') : `<div class="cart-empty-state">Tu carrito está vacío. Añade una herramienta desde la tienda.</div>`;
    return `<aside class="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title"><div class="cart-drawer-header"><div><h3 id="cart-title">Carrito</h3><p style="color:var(--text-secondary);font-size:13px;margin-top:6px">Revisa variantes, cantidades y total antes de crear el pedido.</p></div><button class="cart-close" onclick="closeCartModal()"><i class="fa-solid fa-xmark"></i></button></div><div class="cart-items-list">${itemsHtml}</div><div class="cart-summary-card"><div class="summary-line"><span>Subtotal</span><strong>${euro(b.subtotal)}</strong></div><div class="summary-line"><span>IVA incluido estimado</span><strong>${euro(b.iva)}</strong></div><div class="summary-line"><span>Envío</span><strong>${b.shipping === 0 ? 'Gratis' : euro(b.shipping)}</strong></div><div class="summary-line total"><span>Total</span><strong>${euro(b.total)}</strong></div></div><form class="checkout-form" onsubmit="submitOrder(event)"><label>Nombre completo<input name="customer_name" required maxlength="120" autocomplete="name"></label><label>Email<input type="email" name="customer_email" required maxlength="180" autocomplete="email"></label><label>Teléfono<input name="customer_phone" maxlength="40" autocomplete="tel"></label><label class="full">Dirección de envío<textarea name="shipping_address" required rows="3" maxlength="500" autocomplete="street-address"></textarea></label><label class="full">Notas del pedido<textarea name="notes" rows="2" maxlength="500" placeholder="Horario de entrega, observaciones, etc."></textarea></label><button class="checkout-submit" type="submit" ${cart.length?'':'disabled'}><i class="fa-solid fa-check"></i> Crear pedido</button></form></aside>`;
  }

  window.submitOrder = async function(event){
    event.preventDefault();
    const cart = getCart(); if(!cart.length) return showToast('El carrito está vacío.', 'error');
    const form = event.currentTarget; const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true; submitButton.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Creando pedido…';
    const formData = new FormData(form);
    const payload = { p_customer_name:String(formData.get('customer_name')||'').trim(), p_customer_email:String(formData.get('customer_email')||'').trim(), p_customer_phone:String(formData.get('customer_phone')||'').trim(), p_shipping_address:String(formData.get('shipping_address')||'').trim(), p_notes:String(formData.get('notes')||'').trim(), p_items:cart.map(item=>({ product_id:item.product_id, variant_id:item.variant_id, quantity:Number(item.quantity) })) };
    try{
      let orderId, orderTotal;
      if(!supabaseDb){ orderId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()); orderTotal = cartTotal(cart); localStorage.setItem('autorepara_last_demo_order', JSON.stringify({ id:orderId, total:orderTotal, payload, created_at:new Date().toISOString() })); }
      else { const {data,error} = await supabaseDb.rpc('create_order', payload); if(error) throw error; const result = Array.isArray(data) ? data[0] : data; orderId = result.order_id; orderTotal = result.order_total; }
      const oldCart = [...cart]; saveCart([]); closeCartModal(); await renderStore(currentStoreQuery, currentStoreCategory); showOrderConfirmation(orderId, orderTotal, payload, oldCart);
    } catch(error){ console.error(error); showToast(`No se pudo crear el pedido: ${error.message || error}`, 'error'); submitButton.disabled=false; submitButton.innerHTML='<i class="fa-solid fa-check"></i> Crear pedido'; }
  };
  function showOrderConfirmation(orderId, total, payload, items){
    const overlay = document.createElement('div'); overlay.className='order-confirm-overlay'; overlay.id='order-confirm-overlay';
    overlay.innerHTML = `<div class="order-confirm-modal"><div class="order-confirm-header"><div><h3>Pedido recibido</h3><p style="color:var(--text-secondary)">Guarda este número para cualquier consulta.</p></div><button class="modal-close-btn" onclick="closeOrderConfirmation()"><i class="fa-solid fa-xmark"></i></button></div><div class="order-confirm-id">${escapeHtml(String(orderId))}</div><div class="cart-summary-card"><div class="summary-line"><span>Cliente</span><strong>${escapeHtml(payload.p_customer_name)}</strong></div><div class="summary-line"><span>Email</span><strong>${escapeHtml(payload.p_customer_email)}</strong></div><div class="summary-line total"><span>Total pedido</span><strong>${euro(total)}</strong></div></div><div class="section-title" style="font-size:16px">Resumen</div><div class="cart-items-list">${items.map(item=>`<div class="cart-item"><div><div class="cart-item-title">${escapeHtml(item.name)}</div><div class="cart-item-sub">${escapeHtml(item.variant_label)} · cantidad ${Number(item.quantity)}</div></div><div class="cart-line-total">${euro(Number(item.unit_price)*Number(item.quantity))}</div></div>`).join('')}</div><div class="order-confirm-actions"><button class="btn-cart" onclick="closeOrderConfirmation();navigate('tienda')"><i class="fa-solid fa-store"></i> Volver a tienda</button><button class="btn-product-detail" onclick="window.print()"><i class="fa-solid fa-print"></i> Imprimir</button></div></div>`;
    document.body.appendChild(overlay);
  }
  window.closeOrderConfirmation = function(){ const el=document.getElementById('order-confirm-overlay'); if(el) el.remove(); };

  const originalOpenGuide = window.openGuide;
  window.openGuide = async function(id){
    if (typeof originalOpenGuide === 'function') originalOpenGuide(id);
    setTimeout(()=>injectGuideRecommendations(id), 150);
  };
  async function injectGuideRecommendations(guideId){
    const guide = (typeof guidesData !== 'undefined' ? guidesData : []).find(g=>g.id===guideId);
    const container = document.querySelector('#guias-container .guide-detail');
    if(!guide || !container || container.querySelector('.recommended-products-box')) return;
    try{
      if(!shopProductsCache || !shopProductsCache.length) await loadStoreProducts('', 'all');
      const terms = `${guide.title} ${guide.description} ${guide.tags || ''} ${(guide.tools || []).join(' ')} ${(guide.parts || []).join(' ')}`.toLowerCase().split(/[^a-záéíóúüñ0-9]+/).filter(w=>w.length>3);
      const scored = (shopProductsCache || []).map(p=>({p, score:terms.reduce((s,t)=>s + (productText(p).includes(t) ? 1 : 0),0)})).filter(x=>x.score>0 && productStock(x.p)>0).sort((a,b)=>b.score-a.score).slice(0,3).map(x=>x.p);
      if(!scored.length) return;
      const box = document.createElement('div'); box.className='recommended-products-box';
      box.innerHTML = `<div class="section-title" style="font-size:18px">Herramientas recomendadas para esta guía</div><div class="recommended-products-grid">${scored.map(p=>`<div class="recommended-product-card"><div class="product-kicker">${escapeHtml(p.category)}</div><h4>${escapeHtml(p.name)}</h4><p>${escapeHtml((p.description || '').slice(0,120))}…</p><div class="product-price" style="font-size:22px">${euro((p.variants && p.variants[0] ? p.variants[0].price : p.price))}</div><button class="btn-product-detail" style="width:100%;margin-top:10px" onclick="navigate('tienda');setTimeout(()=>openProductModal('${escapeHtml(p.id)}'),350)"><i class="fa-solid fa-eye"></i> Ver producto</button></div>`).join('')}</div>`;
      const videos = container.querySelector('.guide-videos-section');
      if(videos) container.insertBefore(box, videos); else container.appendChild(box);
    }catch(e){ console.warn('No se pudieron cargar recomendaciones de guía', e); }
  }

  window.currentStoreSort = currentStoreSort;
  window.currentStockFilter = currentStockFilter;
})();
