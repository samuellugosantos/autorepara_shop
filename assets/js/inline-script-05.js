/* Extracted from index_tienda_popup_recuperado_sin_aceite_extra.html */

/* ===================================================
   AUTOREPARA · SUPABASE SHOP IMPLEMENTATION
   1) Replace SUPABASE_URL and SUPABASE_ANON_KEY.
   2) Run supabase/schema.sql in Supabase SQL Editor.
   3) Run supabase/seed_products.sql once to load the initial catalog.
=================================================== */
const SUPABASE_URL = 'https://akvixlkljvtqmhkqxmpj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ub0SPCwkNnQ9PDPx_mXqfA_3Zj6MAQ5';
const SUPABASE_IS_CONFIGURED = /^https:\/\/.+\.supabase\.co$/i.test(SUPABASE_URL) && !SUPABASE_ANON_KEY.includes('TU_SUPABASE');
const supabaseDb = SUPABASE_IS_CONFIGURED ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const SHOP_DEMO_PRODUCTS = [{"id": "kit-basico-reparacion", "name": "Kit básico AutoRepara 42 piezas", "category": "kits", "price": 34.9, "sizes": ["42 piezas", "68 piezas", "96 piezas"], "keywords": "kit basico reparación herramientas carraca vasos puntas", "desc": "Kit pensado para mantenimiento doméstico serio: carraca compacta, vasos métricos habituales, puntas Torx/Allen/Phillips y adaptadores. Seleccionado para cubrir filtros, tapas, abrazaderas y trabajos de interior sin comprar herramientas sueltas. Estuche rígido, piezas marcadas y garantía de sustitución ante defecto de fabricación.", "features": ["Acero Cr-V", "Estuche ordenado", "Uso principiante"]}, {"id": "destornillador-plano", "name": "Destornillador plano de precisión reforzado", "category": "manuales", "price": 4.95, "sizes": ["3x75 mm", "5x100 mm", "6x150 mm"], "keywords": "destornillador plano filtro aire abrazaderas grapas", "desc": "Punta endurecida y mango antideslizante para soltar grapas, tapas de filtro y abrazaderas ligeras sin dañar plásticos. Es una herramienta básica pero elegida con varilla resistente y buena ergonomía para trabajar con control.", "features": ["Punta magnética", "Mango bimaterial", "Garantía 2 años"]}, {"id": "trapo-microfibra", "name": "Pack de microfibras técnicas", "category": "limpieza", "price": 6.5, "sizes": ["Pack 5", "Pack 10", "Pack 20"], "keywords": "trapo limpio microfibra limpieza motor admision aceite", "desc": "Microfibra densa para limpiar alojamientos, varillas, tapas y restos de aceite o polvo. No suelta pelusa y puede lavarse varias veces, ideal para trabajos de admisión, lubricación y acabado antes de cerrar componentes.", "features": ["Sin pelusa", "Lavable", "Alta absorción"]}, {"id": "aspirador-taller", "name": "Aspirador compacto para taller", "category": "electricas", "price": 49.9, "sizes": ["12 L", "18 L", "25 L"], "keywords": "aspirador polvo caja filtro aire taller", "desc": "Aspirador seco/húmedo para retirar suciedad de cajas de filtro, moquetas y zonas de trabajo. Incluye boquilla estrecha para compartimento motor y filtro lavable. Precio ajustado para usuarios que necesitan fiabilidad sin pagar por potencia industrial innecesaria.", "features": ["Seco/húmedo", "Filtro lavable", "Boquilla fina"]}, {"id": "lector-obd2", "name": "Lector OBD-II AutoRepara Scan", "category": "diagnostico", "price": 24.9, "sizes": ["Bluetooth", "USB", "WiFi"], "keywords": "lector obd obd2 diagnóstico códigos p0101 p0011 temperatura refrigerante", "desc": "Lector OBD-II compatible con apps habituales para leer y borrar códigos, revisar datos en vivo y comprobar temperatura, caudal de aire o fallos de distribución. Incluye guía rápida en español y tabla de códigos frecuentes.", "features": ["Datos en vivo", "Guía española", "Compacto"]}, {"id": "gato-hidraulico", "name": "Gato hidráulico perfil bajo", "category": "elevacion", "price": 64.9, "sizes": ["2 T", "2.5 T", "3 T"], "keywords": "gato hidráulico elevador levantar coche perfil bajo", "desc": "Gato de perfil bajo para compactos europeos con faldones deportivos. Ruedas metálicas, válvula de seguridad y plato con goma. Recomendado siempre junto con borriquetas; no se vende como sustituto de apoyo seguro.", "features": ["Perfil bajo", "Válvula seguridad", "Plato goma"]}, {"id": "borriquetas", "name": "Juego de borriquetas reforzadas", "category": "elevacion", "price": 29.9, "sizes": ["2 T par", "3 T par", "6 T par"], "keywords": "borriquetas caballetes seguridad elevación coche", "desc": "Par de borriquetas con trinquete de bloqueo y base estable. Imprescindibles para trabajar bajo el vehículo con seguridad después de elevarlo con gato. Etiquetado visible de carga y acabado resistente a golpes.", "features": ["Par incluido", "Bloqueo trinquete", "Base ancha"]}, {"id": "llaves-vaso", "name": "Juego de llaves de vaso métricas", "category": "manuales", "price": 22.9, "sizes": ["1/4” 4-14 mm", "3/8” 8-22 mm", "1/2” 10-32 mm"], "keywords": "llaves de vaso carraca tornillos termostato filtro aceite", "desc": "Vasos métricos de acero cromo-vanadio con marcaje grande. Diseñado para mantenimiento de motor, tapas, termostatos y soportes. La selección evita medidas poco usadas y prioriza las más comunes en coches europeos.", "features": ["Cr-V", "Marcaje grande", "Métrico"]}, {"id": "torquimetro", "name": "Torquímetro calibrado", "category": "precision", "price": 39.9, "sizes": ["5-25 Nm", "20-110 Nm", "40-210 Nm"], "keywords": "torquímetro llave dinamométrica par apriete tornillos aceite ruedas", "desc": "Llave dinamométrica para apretar al par correcto y evitar roscas pasadas o fugas. Cada unidad se entrega con certificado de comprobación y estuche. Muy recomendable para termostatos, filtros de aceite, bujías y ruedas.", "features": ["Certificado", "Click audible", "Estuche"]}, {"id": "alicates-abrazaderas", "name": "Alicates para abrazaderas de manguito", "category": "manuales", "price": 13.9, "sizes": ["Recto", "45°", "Cable flexible"], "keywords": "alicates abrazaderas manguitos refrigeración termostato", "desc": "Alicates específicos para abrazaderas elásticas de refrigeración y admisión. Evitan pellizcos, reducen tiempo de desmontaje y permiten trabajar en zonas estrechas sin dañar el manguito.", "features": ["Agarre seguro", "Zonas estrechas", "Acero templado"]}, {"id": "cubo-refrigerante", "name": "Cubo graduado para refrigerante/aceite", "category": "fluidos", "price": 8.9, "sizes": ["5 L", "8 L", "12 L"], "keywords": "cubo refrigerante aceite drenaje fluidos graduado", "desc": "Recipiente graduado con pico de vertido para drenar refrigerante o aceite usado con menos derrames. Plástico resistente a hidrocarburos y marcas de capacidad visibles para medir el volumen extraído.", "features": ["Graduado", "Pico vertido", "Resistente"]}, {"id": "embudo-purga", "name": "Embudo de purga para refrigeración", "category": "fluidos", "price": 18.9, "sizes": ["Universal", "VAG/PSA", "Kit adaptadores"], "keywords": "embudo purga refrigeracion anticongelante sistema vag peugeot renault", "desc": "Embudo elevado con adaptadores para purgar circuitos de refrigeración evitando bolsas de aire. Especialmente útil en motores con termostato alto o circuitos complejos. Incluye tapón de cierre para retirar sin derrames.", "features": ["Adaptadores", "Sin burbujas", "Tapón cierre"]}, {"id": "boroscopio", "name": "Endoscopio/boroscopio USB", "category": "diagnostico", "price": 27.9, "sizes": ["1 m", "3 m", "5 m"], "keywords": "endoscopio boroscopio inspección cilindro cadena distribución", "desc": "Cámara flexible con luz LED regulable para inspeccionar cadenas, fugas, cilindros y zonas ocultas. Funciona con móvil u ordenador mediante adaptador incluido. Una herramienta económica para diagnosticar antes de desmontar.", "features": ["LED regulable", "IP67", "Adaptador incluido"]}, {"id": "termometro-infrarrojo", "name": "Termómetro infrarrojo de pistola", "category": "diagnostico", "price": 19.9, "sizes": ["–50 a 380°C", "–50 a 550°C", "–50 a 1200°C"], "keywords": "termómetro infrarrojo temperatura manguito termostato radiador frenos", "desc": "Termómetro láser para medir sin contacto: manguitos de refrigeración, discos de freno, colector de escape y zonas de motor. Imprescindible para diagnosticar termostatos, fugas de calor y distribución de temperatura en motores modernos. Respuesta en < 1 segundo.", "features": ["Sin contacto", "Puntero láser", "Respuesta rápida"]}, {"id": "aceite-motor-vw504", "name": "Aceite motor VW 504/507 0W-30 (5L)", "category": "fluidos", "price": 42.9, "sizes": ["5 L", "5 L x2", "20 L"], "keywords": "aceite motor vw 504 507 0w30 ea888 lubricante cambio", "desc": "Aceite sintético homologado VW 504.00/507.00 especificación necesaria para el EA888 Gen3 y motores VAG modernos de gasolina y diésel con filtro de partículas (DPF). Usar un aceite fuera de especificación acorta la vida del tensor de cadena. Cada lata incluye ficha técnica.", "features": ["VW 504.00/507.00", "0W-30 sintético", "Apto DPF"]}, {"id": "refrigerante-g13", "name": "Refrigerante G13 concentrado (1.5L)", "category": "fluidos", "price": 14.9, "sizes": ["1.5 L concentrado", "5 L diluido 50%", "10 L diluido 50%"], "keywords": "refrigerante anticongelante g13 g12 vag purga circuito refrigeración", "desc": "Refrigerante G13 violeta compatible con G12+ y G12++ para sistemas de refrigeración VAG, Seat, Skoda y Audi. Formulación sin nitritos ni aminas. Mezclar siempre con agua destilada al 50% para protección hasta –35°C. Esencial después de cualquier intervención en el circuito de refrigeración.", "features": ["Compatible G12+", "Sin nitritos", "Concentrado"]}, {"id": "limpiador-maf", "name": "Limpiador sensor MAF/cuerpo de aceleración", "category": "limpieza", "price": 9.9, "sizes": ["400 ml", "2 × 400 ml"], "keywords": "limpiador maf sensor masa aire cuerpo aceleración admisión mariposa", "desc": "Spray de limpieza para sensores MAF y cuerpos de aceleración electrónicos. Fórmula sin residuos que elimina depósitos de aceite y partículas sin afectar al sensor ni descalibrar el cuerpo de aceleración. Aplicar con distancia de 5 cm, dejar secar 2 minutos antes de arrancar.", "features": ["Sin residuos", "Seguro para sensores", "Secado rápido"]}, {"id": "kit-bujias-ngk", "name": "Kit bujías NGK Iridium para EA888", "category": "kits", "price": 32.9, "sizes": ["4 uds. (1.4/1.6 TSI)", "4 uds. (2.0 TSI EA888)", "4 uds. + precalentamiento diesel"], "keywords": "bujías ngk iridio bujia encendido ignición ea888 tsi vag", "desc": "Bujías de iridio NGK específicas para motores TSI del grupo VAG. El electrodo de iridio garantiza encendido consistente a alta carga y mejora la eficiencia de combustión. Cambio recomendado cada 30.000–60.000 km según versión del motor. Incluye torca recomendada en la caja.", "features": ["Iridio NGK", "OEM compatible", "Par incluido"]}, {"id": "limpiacontactos", "name": "Spray limpiacontactos eléctrico 400ml", "category": "limpieza", "price": 7.9, "sizes": ["400 ml"], "keywords": "limpiacontactos eléctrico sensor conectores oxidación contacto bornas", "desc": "Limpiador de contactos eléctricos para conectores de sensores, bornas de batería, conectores ABS y módulos de control. Elimina oxidación y película de grasa sin dañar el plástico. Esencial en diagnósticos eléctricos intermitentes antes de sustituir un sensor.", "features": ["Dieléctrico", "Secado rápido", "No daña plásticos"]}];
let shopProductsCache = [];
let currentStoreQuery = '';
let currentStoreCategory = 'all';
const CART_STORAGE_KEY = 'autorepara_cart_v1';

function euro(value) {
  return `${Number(value || 0).toFixed(2).replace('.', ',')}€`;
}
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}
function makeVariantId(productId, label) {
  return `${productId}__${String(label).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'default'}`;
}
function normalizeDemoProduct(product) {
  const variants = (product.sizes || ['Única']).map((label, index) => ({
    id: makeVariantId(product.id, label),
    product_id: product.id,
    label,
    price: Number(product.price),
    stock: 25,
    is_default: index === 0
  }));
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: Number(product.price),
    keywords: product.keywords || '',
    description: product.desc || product.description || '',
    features: product.features || [],
    active: true,
    variants
  };
}
function normalizeSupabaseProduct(row) {
  const variants = Array.isArray(row.product_variants) ? row.product_variants : [];
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    keywords: row.keywords || '',
    description: row.description || row.desc || '',
    features: Array.isArray(row.features) ? row.features : [],
    image_url: row.image_url || '',
    active: row.active,
    variants: variants.map(v => ({
      id: v.id,
      product_id: row.id,
      label: v.label,
      price: Number(v.price),
      stock: Number(v.stock || 0),
      is_default: Boolean(v.is_default)
    }))
  };
}
async function fetchProductsFromSupabase(query = '', category = 'all') {
  let request = supabaseDb
    .from('products')
    .select('id,name,category,price,keywords,description,features,image_url,active,product_variants(id,product_id,label,price,stock,is_default)')
    .eq('active', true)
    .order('name', { ascending: true });

  if (category && category !== 'all') request = request.eq('category', category);
  if (query) {
    const safe = query.replaceAll('%', '').replaceAll(',', ' ').trim();
    if (safe) request = request.or(`name.ilike.%${safe}%,keywords.ilike.%${safe}%,description.ilike.%${safe}%`);
  }

  const { data, error } = await request;
  if (error) throw error;
  return (data || []).map(normalizeSupabaseProduct);
}
async function loadStoreProducts(query = '', category = 'all') {
  currentStoreQuery = query || '';
  currentStoreCategory = category || 'all';
  if (supabaseDb) {
    shopProductsCache = await fetchProductsFromSupabase(currentStoreQuery, currentStoreCategory);
  } else {
    const q = currentStoreQuery.toLowerCase().trim();
    shopProductsCache = SHOP_DEMO_PRODUCTS.map(normalizeDemoProduct).filter(p => {
      const matchesQ = !q || `${p.name} ${p.keywords} ${p.description}`.toLowerCase().includes(q);
      const matchesCat = currentStoreCategory === 'all' || p.category === currentStoreCategory;
      return matchesQ && matchesCat;
    });
  }
  return shopProductsCache;
}
function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartCounter();
}
function updateCartCounter() {
  const total = getCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = String(total); });
}
function findProduct(productId) {
  return shopProductsCache.find(p => p.id === productId) || SHOP_DEMO_PRODUCTS.map(normalizeDemoProduct).find(p => p.id === productId);
}
function addToCartByProduct(productId) {
  const product = findProduct(productId);
  if (!product) return showToast('Producto no encontrado.', 'error');
  const select = document.getElementById(`variant-${productId}`);
  const variantId = select ? select.value : (product.variants[0] && product.variants[0].id);
  const variant = product.variants.find(v => v.id === variantId) || product.variants[0];
  if (!variant) return showToast('Este producto no tiene variante disponible.', 'error');
  if (Number(variant.stock) <= 0) return showToast('Sin stock disponible para esta variante.', 'error');

  const cart = getCart();
  const existing = cart.find(item => item.variant_id === variant.id);
  if (existing) existing.quantity = Math.min(Number(existing.quantity) + 1, Number(variant.stock || 99));
  else cart.push({
    product_id: product.id,
    variant_id: variant.id,
    name: product.name,
    variant_label: variant.label,
    unit_price: Number(variant.price),
    quantity: 1
  });
  saveCart(cart);
  showToast(`${product.name} añadido al carrito.`, 'success');
}
function addToCart(button) {
  const card = button && button.closest ? button.closest('.product-card') : null;
  const productId = card ? card.dataset.productId : null;
  if (!productId) return;
  addToCartByProduct(productId);
  const original = button.innerHTML;
  button.innerHTML = '<i class="fa-solid fa-check"></i> Añadido';
  button.classList.add('added');
  button.disabled = true;
  setTimeout(() => {
    button.innerHTML = original;
    button.classList.remove('added');
    button.disabled = false;
  }, 1000);
}
async function renderStore(query = '', category = 'all') {
  const container = document.getElementById('tienda-container');
  if (!container) return;
  currentStoreQuery = query || '';
  currentStoreCategory = category || 'all';
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-label">Tienda AutoRepara · Supabase</div>
      <h1>Herramientas claras,<br>pedidos conectados</h1>
      <p>AutoRepara.es / tienda</p>
    </div>
    <div class="store-loading"><i class="fa-solid fa-circle-notch fa-spin"></i> Cargando catálogo desde ${SUPABASE_IS_CONFIGURED ? 'Supabase' : 'modo demo local'}…</div>
  `;
  try {
    const products = await loadStoreProducts(currentStoreQuery, currentStoreCategory);
    const sourceLabel = SUPABASE_IS_CONFIGURED ? 'Base de datos Supabase activa' : 'Modo demo: configura Supabase para datos reales';
    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-label">Tienda AutoRepara · Herramientas seleccionadas</div>
        <h1>Herramientas claras,<br>precios honestos</h1>
        <p>AutoRepara.es / tienda</p>
      </div>
      <div class="alert alert-success">
        <i class="fa-solid fa-database"></i>
        <div>El catálogo, las variantes y el stock están preparados para leerse desde Supabase. Los pedidos se crean con una función SQL que recalcula precios y descuenta stock en la base de datos.</div>
      </div>
      <div class="shop-status-bar">
        <div class="shop-status-chip"><i class="fa-solid fa-plug-circle-check"></i>${sourceLabel}</div>
        <button class="shop-cart-button" onclick="openCartModal()"><i class="fa-solid fa-cart-shopping"></i> Carrito <span class="cart-count-badge" data-cart-count>0</span></button>
      </div>
      <div class="product-toolbar">
        <input class="store-search" id="store-search" value="${escapeHtml(currentStoreQuery)}" placeholder="Buscar herramientas, OBD, torquímetro…" oninput="renderStore(this.value, document.getElementById('store-filter').value)">
        <select class="store-filter" id="store-filter" onchange="renderStore(document.getElementById('store-search').value, this.value)">
          ${['all','kits','manuales','diagnostico','precision','elevacion','fluidos','limpieza','electricas'].map(c => `<option value="${c}" ${c===currentStoreCategory?'selected':''}>${c === 'all' ? 'Todas' : c}</option>`).join('')}
        </select>
      </div>
      ${products.length ? `<div class="store-grid">${products.map(renderProductCard).join('')}</div>` : `<div class="store-empty">No hay resultados. Prueba con “OBD”, “vaso”, “refrigerante”, “kit” o “torquímetro”.</div>`}
    `;
    updateCartCounter();
  } catch (error) {
    console.error(error);
    container.innerHTML = `
      <div class="page-header"><div class="page-header-label">Tienda AutoRepara · Error</div><h1>No se pudo cargar<br>la tienda</h1><p>AutoRepara.es / tienda</p></div>
      <div class="alert alert-danger"><i class="fa-solid fa-triangle-exclamation"></i><div><strong>Error de Supabase:</strong> ${escapeHtml(error.message || error)}. Revisa la URL, la anon key, las políticas RLS y que hayas ejecutado el SQL de creación.</div></div>
    `;
  }
}
function renderProductCard(product) {
  const variants = product.variants && product.variants.length ? product.variants : [{ id: makeVariantId(product.id, 'Única'), label:'Única', price: product.price, stock: 0, is_default: true }];
  const defaultVariant = variants.find(v => v.is_default) || variants[0];
  const stockTotal = variants.reduce((sum, v) => sum + Number(v.stock || 0), 0);
  return `
    <div class="product-card" id="shop-${escapeHtml(product.id)}" data-product-id="${escapeHtml(product.id)}">
      <div class="product-kicker">${escapeHtml(product.category || 'producto')}</div>
      <h3>${escapeHtml(product.name)}</h3>
      <div class="product-price">${euro(defaultVariant.price)}</div>
      <div class="product-stock"><strong>${stockTotal}</strong> unidades disponibles · stock por variante</div>
      <p class="product-description">${escapeHtml(product.description)}</p>
      <div class="product-features">${(product.features || []).map(f => `<span class="product-feature">${escapeHtml(f)}</span>`).join('')}</div>
      <select class="product-size-select" id="variant-${escapeHtml(product.id)}" aria-label="Variante de ${escapeHtml(product.name)}">
        ${variants.map(v => `<option value="${escapeHtml(v.id)}" ${v.id===defaultVariant.id?'selected':''}>${escapeHtml(v.label)} · ${euro(v.price)} · stock ${Number(v.stock || 0)}</option>`).join('')}
      </select>
      <button class="btn-cart" onclick="addToCart(this)" ${stockTotal <= 0 ? 'disabled' : ''}><i class="fa-solid fa-cart-plus"></i> Añadir al carrito</button>
    </div>
  `;
}
function cartTotal(cart) {
  return cart.reduce((sum, item) => sum + Number(item.unit_price || 0) * Number(item.quantity || 0), 0);
}
function openCartModal() {
  closeCartModal();
  const modal = document.createElement('div');
  modal.className = 'cart-modal-overlay';
  modal.id = 'cart-modal-overlay';
  modal.innerHTML = renderCartModal();
  document.body.appendChild(modal);
}
function closeCartModal() {
  const existing = document.getElementById('cart-modal-overlay');
  if (existing) existing.remove();
}
function renderCartModal() {
  const cart = getCart();
  const itemsHtml = cart.length ? cart.map((item, index) => `
    <div class="cart-item">
      <div>
        <div class="cart-item-title">${escapeHtml(item.name)}</div>
        <div class="cart-item-sub">${escapeHtml(item.variant_label)} · ${euro(item.unit_price)}</div>
      </div>
      <div class="cart-qty">
        <button type="button" onclick="changeCartQty(${index}, -1)">−</button>
        <strong>${Number(item.quantity)}</strong>
        <button type="button" onclick="changeCartQty(${index}, 1)">+</button>
      </div>
      <div class="cart-line-total">${euro(Number(item.unit_price) * Number(item.quantity))}</div>
      <button class="cart-remove" type="button" onclick="removeCartItem(${index})"><i class="fa-solid fa-trash"></i></button>
    </div>`).join('') : `<div class="cart-empty-state">Tu carrito está vacío. Añade una herramienta desde la tienda.</div>`;
  return `
    <div class="cart-modal" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <div class="cart-modal-header">
        <div><h3 id="cart-title">Carrito y pedido</h3><p style="color:var(--text-secondary);font-size:13px;margin-top:6px">El pedido se guardará en Supabase con stock validado en la base de datos.</p></div>
        <button class="cart-close" onclick="closeCartModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="cart-items-list">${itemsHtml}</div>
      <div class="cart-summary">Total: ${euro(cartTotal(cart))}</div>
      <form class="checkout-form" onsubmit="submitOrder(event)">
        <label>Nombre completo<input name="customer_name" required maxlength="120" autocomplete="name"></label>
        <label>Email<input type="email" name="customer_email" required maxlength="180" autocomplete="email"></label>
        <label>Teléfono<input name="customer_phone" maxlength="40" autocomplete="tel"></label>
        <label class="full">Dirección de envío<textarea name="shipping_address" required rows="3" maxlength="500" autocomplete="street-address"></textarea></label>
        <label class="full">Notas del pedido<textarea name="notes" rows="2" maxlength="500" placeholder="Horario de entrega, observaciones, etc."></textarea></label>
        <button class="checkout-submit" type="submit" ${cart.length ? '' : 'disabled'}><i class="fa-solid fa-check"></i> Crear pedido</button>
      </form>
    </div>`;
}
function changeCartQty(index, delta) {
  const cart = getCart();
  if (!cart[index]) return;
  cart[index].quantity = Math.max(1, Number(cart[index].quantity || 1) + delta);
  saveCart(cart);
  openCartModal();
}
function removeCartItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  openCartModal();
}
async function submitOrder(event) {
  event.preventDefault();
  const cart = getCart();
  if (!cart.length) return showToast('El carrito está vacío.', 'error');
  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Creando pedido…';
  const formData = new FormData(form);
  const payload = {
    p_customer_name: String(formData.get('customer_name') || '').trim(),
    p_customer_email: String(formData.get('customer_email') || '').trim(),
    p_customer_phone: String(formData.get('customer_phone') || '').trim(),
    p_shipping_address: String(formData.get('shipping_address') || '').trim(),
    p_notes: String(formData.get('notes') || '').trim(),
    p_items: cart.map(item => ({ product_id: item.product_id, variant_id: item.variant_id, quantity: Number(item.quantity) }))
  };

  try {
    if (!supabaseDb) {
      const demoId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
      localStorage.setItem('autorepara_last_demo_order', JSON.stringify({ id: demoId, total: cartTotal(cart), payload, created_at: new Date().toISOString() }));
      saveCart([]);
      closeCartModal();
      await renderStore(currentStoreQuery, currentStoreCategory);
      return showToast(`Pedido demo creado correctamente: ${demoId.slice(0,8)}.`, 'success');
    }
    const { data, error } = await supabaseDb.rpc('create_order', payload);
    if (error) throw error;
    const result = Array.isArray(data) ? data[0] : data;
    saveCart([]);
    closeCartModal();
    await renderStore(currentStoreQuery, currentStoreCategory);
    showToast(`Pedido creado correctamente. Nº ${String(result.order_id).slice(0,8)} · total ${euro(result.order_total)}.`, 'success');
  } catch (error) {
    console.error(error);
    showToast(`No se pudo crear el pedido: ${error.message || error}`, 'error');
    submitButton.disabled = false;
    submitButton.innerHTML = '<i class="fa-solid fa-check"></i> Crear pedido';
  }
}
window.showToastOriginal = window.showToast;
function showToast(message, type = 'info') {
  if (typeof window.showToastOriginal === 'function') return window.showToastOriginal(message, type);
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info'}"></i><span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('fade-out'); setTimeout(() => toast.remove(), 300); }, 3600);
}

window.addToCart = addToCart;
window.addToCartByProduct = addToCartByProduct;
window.renderStore = renderStore;
window.openCartModal = openCartModal;
window.closeCartModal = closeCartModal;
window.changeCartQty = changeCartQty;
window.removeCartItem = removeCartItem;
window.submitOrder = submitOrder;
window.updateCartCounter = updateCartCounter;

document.addEventListener('DOMContentLoaded', updateCartCounter);
