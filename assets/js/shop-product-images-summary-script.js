/* Extracted from index_tienda_popup_recuperado_sin_aceite_extra.html | original script id: shop-product-images-summary-script */

(function(){
  function normalizeText(value){
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'');
  }

  function esc(value){
    return String(value ?? '')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function getProductDescription(product){
    return String(product?.description || product?.desc || product?.summary || '').replace(/\s+/g,' ').trim();
  }

  function shortenText(text, max = 165){
    const clean = String(text || '').replace(/\s+/g,' ').trim();
    if (!clean) return '';
    const firstSentence = clean.match(/^(.+?[.!?])\s+/);
    const base = firstSentence && firstSentence[1].length >= 45 ? firstSentence[1] : clean;
    return base.length > max ? base.slice(0, max - 1).trim().replace(/[,.]$/,'') + '…' : base;
  }

  function productNeed(product){
    const text = normalizeText(`${product?.id || ''} ${product?.slug || ''} ${product?.name || ''} ${product?.category || ''} ${product?.description || ''} ${product?.desc || ''} ${(product?.features || []).join(' ')} ${product?.keywords || ''} ${product?.need || ''}`);

    // Orden importante: primero piezas concretas y después categorías genéricas.
    if (/filtro.*habitaculo|habitaculo|polen|cabina|carbon activo/.test(text)) return 'filtro habitáculo';
    if (/filtro.*aceite|oil filter|cartucho.*aceite/.test(text)) return 'filtro aceite';
    if (/filtro.*aire|air filter|admision/.test(text)) return 'filtro aire';
    if (/filtro.*gasoil|filtro.*diesel|filtro.*combustible|fuel filter/.test(text)) return 'filtro combustible';
    if (/pastilla|disco.*freno|freno|brake|sensor.*desgaste/.test(text)) return 'frenos';
    if (/adblue|scr|urea/.test(text)) return 'AdBlue / emisiones';
    if (/refrigerante|anticongelante|coolant|g12|g13|sllc|type d|yellow|azul|purga|manguito/.test(text)) return 'refrigeración';
    if (/bujia|bujias|bobina|encendido|spark|iridium/.test(text)) return 'encendido';
    if (/cadena|correa|distribucion|timing|tensor|tamiz|aspiracion/.test(text)) return 'distribución';
    if (/obd|diagnost|scanner|averia|codigo|elm327/.test(text)) return 'diagnóstico';
    if (/gato|borriqueta|elevacion|elevador/.test(text)) return 'elevación';
    if (/torquimetro|dinamometr|par de apriete/.test(text)) return 'precisión';
    if (/bandeja.*aceite|recogida.*aceite|embudo|fluido/.test(text)) return 'manejo de fluidos';
    if (/limpiador.*freno|limpia.*freno/.test(text)) return 'limpieza de frenos';
    if (/limpiador.*contacto|contactos electricos/.test(text)) return 'limpieza eléctrica';
    if (/limpia|limpieza|desengras|spray|egr/.test(text)) return 'limpieza';
    if (/bateria|electrico|multimetro|fusible|12v/.test(text)) return 'electricidad';
    if (/aceite|lubric|0w|5w|ll-04|vw 50|rn17|b71|wss/.test(text)) return 'aceite';
    if (/kit|juego|pack/.test(text)) return 'kit';
    if (/itv|inspeccion/.test(text)) return 'ITV';
    return product?.need || product?.category || 'producto';
  }

  function productBrief(product){
    const description = shortenText(getProductDescription(product), 150);
    if (description) return description;

    const text = normalizeText(`${product?.id || ''} ${product?.slug || ''} ${product?.name || ''} ${product?.category || ''} ${(product?.features || []).join(' ')} ${product?.keywords || ''}`);

    // Fallbacks only when Supabase has no description. These are intentionally specific
    // and are not used before the real product description.
    if (/lector.*obd|obd.*bluetooth|scanner/.test(text)) return 'Lee códigos de avería y datos básicos del motor para apoyar el diagnóstico del vehículo.';
    if (/multimetro/.test(text)) return 'Permite comprobar batería, alternador, fusibles, continuidad y señales eléctricas básicas.';
    if (/torquimetro|dinamometr/.test(text)) return 'Ayuda a aplicar el par de apriete correcto en tornillería, ruedas, frenos y bujías.';
    if (/gato.*hidraulico/.test(text)) return 'Eleva el vehículo para poder colocar borriquetas y trabajar con más seguridad.';
    if (/borriqueta/.test(text)) return 'Mantiene el vehículo apoyado de forma estable después de levantarlo con el gato.';
    if (/bandeja.*aceite|recogida.*aceite/.test(text)) return 'Recoge aceite u otros fluidos durante cambios y purgas para evitar derrames.';
    if (/embudo/.test(text)) return 'Facilita rellenar líquidos del vehículo sin derrames ni salpicaduras.';
    if (/purgador.*freno/.test(text)) return 'Ayuda a purgar el circuito de frenos o embrague hidráulico con mayor control.';
    if (/manometro.*neumatico/.test(text)) return 'Mide la presión de los neumáticos para ajustar seguridad, consumo e ITV.';
    if (/lampara.*inspeccion/.test(text)) return 'Ilumina bajos, vano motor y zonas estrechas durante diagnosis o reparación.';
    if (/limpiador.*freno|limpia.*freno/.test(text)) return 'Elimina grasa y residuos en discos, pinzas y piezas metálicas del sistema de freno.';
    if (/limpiador.*contacto|contactos electricos/.test(text)) return 'Limpia conectores, sensores y contactos eléctricos sin dejar residuos conductores.';
    if (/grasa.*cobre|antigripante/.test(text)) return 'Evita agarrotamientos en tornillería y superficies metálicas donde proceda su uso.';
    if (/escobilla|limpiaparabrisas/.test(text)) return 'Mejora la visibilidad sustituyendo escobillas desgastadas o ruidosas.';
    if (/bateria/.test(text)) return 'Sustituye la batería de 12 V cuando hay problemas de arranque o baja capacidad.';
    if (/adblue|scr|urea/.test(text)) return 'Rellena sistemas SCR diésel compatibles para el tratamiento de emisiones.';

    if (/filtro.*habitaculo|habitaculo|polen|carbon activo/.test(text)) return 'Filtra polvo, polen y olores del aire que entra al interior del coche.';
    if (/filtro.*aceite|oil filter/.test(text)) return 'Retiene partículas del aceite para proteger el motor durante la lubricación.';
    if (/filtro.*aire|air filter|admision/.test(text)) return 'Filtra el aire de admisión para proteger motor, turbo y sensores.';
    if (/filtro.*gasoil|filtro.*diesel|filtro.*combustible|fuel filter/.test(text)) return 'Protege bomba e inyectores reteniendo impurezas del combustible.';

    if (/pastilla|pastillas/.test(text)) return 'Sustituye el material de fricción para recuperar frenada y tacto de pedal.';
    if (/disco.*freno|discos.*freno/.test(text)) return 'Renueva la superficie de frenado cuando hay desgaste, vibraciones o surcos.';
    if (/sensor.*desgaste/.test(text)) return 'Detecta el desgaste de pastillas en vehículos con aviso de freno compatible.';

    if (/aceite|0w|5w|ll-04|vw 50|rn17|b71|wss/.test(text)) return 'Lubrica y protege el motor; debe elegirse según la homologación del fabricante.';
    if (/refrigerante|anticongelante|coolant|g12|g13|sllc|type d|yellow|azul/.test(text)) return 'Controla la temperatura del motor y protege el circuito contra corrosión y congelación.';
    if (/liquido.*frenos|dot4/.test(text)) return 'Transmite presión hidráulica en el sistema de frenos y debe renovarse periódicamente.';
    if (/fluido.*ecvt|transmision/.test(text)) return 'Fluido específico para transmisión compatible; debe verificarse especificación antes de usarlo.';

    if (/bujia|bujias|spark|iridium/.test(text)) return 'Genera la chispa de combustión en motores gasolina compatibles.';
    if (/bobina/.test(text)) return 'Alimenta las bujías con alta tensión y ayuda a corregir fallos de encendido.';
    if (/pcv/.test(text)) return 'Gestiona vapores del cárter y ayuda a corregir ralentí irregular o consumo de aceite.';
    if (/bomba.*agua|termostato/.test(text)) return 'Ayuda a mantener estable la temperatura del motor y corregir fugas o sobrecalentamiento.';
    if (/manguito/.test(text)) return 'Sustituye conductos de refrigeración envejecidos, agrietados o con fugas.';
    if (/kit.*correa|correa.*humeda/.test(text)) return 'Kit de distribución por correa; requiere verificar referencia y procedimiento.';
    if (/kit.*cadena|cadena.*distribucion/.test(text)) return 'Kit de cadena de distribución para intervención especializada tras diagnóstico.';
    if (/tamiz.*aspiracion|pick.?up/.test(text)) return 'Ayuda a revisar la captación de aceite cuando existen residuos u obstrucciones.';
    if (/egr|admision.*diesel/.test(text)) return 'Ayuda a limpiar carbonilla en admisión o EGR cuando el diseño permite la operación.';

    if (/kit/.test(text)) return 'Agrupa herramientas o consumibles relacionados para realizar una revisión completa.';
    return 'Producto para mantenimiento o reparación. Verifica compatibilidad, medidas y especificación antes de usarlo.';
  }

  function realProductImage(product){
    const existing = String(product?.image_url || '').trim();
    if (/^https?:\/\//i.test(existing) && !/placeholder|dummy|generated|svg/i.test(existing)) return existing;
    return '';
  }

  function productSvg(product){
    const need = productNeed(product);
    const n = normalizeText(need);
    const title = esc((product?.name || 'Producto').slice(0,42));
    const label = esc(String(need || 'Producto').slice(0,22));
    let icon = '';
    if (n.includes('diagnost')) {
      icon = '<rect x="150" y="86" width="220" height="130" rx="18" fill="none" stroke="#93e7ff" stroke-width="8"/><rect x="182" y="116" width="156" height="42" rx="8" fill="rgba(147,231,255,.18)" stroke="#93e7ff" stroke-width="5"/><path d="M205 184h110M230 184v24M290 184v24" stroke="#f97316" stroke-width="7" stroke-linecap="round"/>';
    } else if (n.includes('aceite')) {
      icon = '<path d="M205 62h86l16 38v132H190V100z" fill="rgba(147,231,255,.12)" stroke="#93e7ff" stroke-width="8"/><path d="M218 125h60l18 34-31 39-39-28z" fill="rgba(249,115,22,.28)" stroke="#f97316" stroke-width="6"/><rect x="218" y="44" width="60" height="32" rx="8" fill="rgba(249,115,22,.18)" stroke="#f97316" stroke-width="6"/>';
    } else if (n.includes('filtro')) {
      icon = '<ellipse cx="260" cy="86" rx="86" ry="30" fill="rgba(147,231,255,.18)" stroke="#93e7ff" stroke-width="7"/><path d="M174 86v110c0 17 38 31 86 31s86-14 86-31V86" fill="none" stroke="#93e7ff" stroke-width="7"/><path d="M208 112v88M238 116v92M268 116v92M298 116v88" stroke="#f97316" stroke-width="5" stroke-linecap="round"/>';
    } else if (n.includes('freno')) {
      icon = '<circle cx="260" cy="148" r="78" fill="none" stroke="#93e7ff" stroke-width="10"/><circle cx="260" cy="148" r="28" fill="rgba(147,231,255,.16)" stroke="#93e7ff" stroke-width="7"/><path d="M335 92c42 38 42 94 4 132" fill="none" stroke="#f97316" stroke-width="18" stroke-linecap="round"/><circle cx="260" cy="82" r="7" fill="#f97316"/><circle cx="322" cy="148" r="7" fill="#f97316"/><circle cx="260" cy="214" r="7" fill="#f97316"/><circle cx="198" cy="148" r="7" fill="#f97316"/>';
    } else if (n.includes('refriger')) {
      icon = '<path d="M260 58c34 44 78 96 78 139 0 43-35 72-78 72s-78-29-78-72c0-43 44-95 78-139z" fill="rgba(147,231,255,.16)" stroke="#93e7ff" stroke-width="8"/><path d="M220 195c28 16 54 16 80 0" stroke="#f97316" stroke-width="7" stroke-linecap="round"/><path d="M230 148h60" stroke="#93e7ff" stroke-width="7" stroke-linecap="round"/>';
    } else if (n.includes('elev')) {
      icon = '<path d="M150 216h220" stroke="#93e7ff" stroke-width="9" stroke-linecap="round"/><path d="M196 210l64-116 64 116" fill="none" stroke="#f97316" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M260 94v116" stroke="#93e7ff" stroke-width="8"/><path d="M214 146h92" stroke="#93e7ff" stroke-width="7" stroke-linecap="round"/>';
    } else if (n.includes('precision')) {
      icon = '<path d="M142 190l160-104 42 42-160 104z" fill="rgba(147,231,255,.14)" stroke="#93e7ff" stroke-width="8" stroke-linejoin="round"/><circle cx="334" cy="96" r="34" fill="none" stroke="#f97316" stroke-width="8"/><path d="M330 96l18-18" stroke="#f97316" stroke-width="6" stroke-linecap="round"/>';
    } else if (n.includes('electric')) {
      icon = '<rect x="178" y="88" width="164" height="132" rx="14" fill="rgba(147,231,255,.12)" stroke="#93e7ff" stroke-width="8"/><path d="M230 68h60M218 88V70M302 88V70" stroke="#f97316" stroke-width="8" stroke-linecap="round"/><path d="M272 112l-44 62h38l-22 42 54-70h-40z" fill="#f97316" opacity=".92"/>';
    } else if (n.includes('limpieza')) {
      icon = '<path d="M206 68h72l26 38v134h-124V106z" fill="rgba(147,231,255,.12)" stroke="#93e7ff" stroke-width="8"/><path d="M304 126h48c22 0 22 42 0 42h-48" fill="none" stroke="#f97316" stroke-width="8"/><path d="M208 158h68M208 190h68" stroke="#93e7ff" stroke-width="6" stroke-linecap="round"/>';
    } else {
      icon = '<path d="M175 194l106-106c16-16 43-16 59 0l10 10-48 48 34 34 48-48 10 10c16 16 16 43 0 59L288 307" fill="none" stroke="#93e7ff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" transform="translate(-18 -34)"/><circle cx="210" cy="200" r="28" fill="rgba(249,115,22,.18)" stroke="#f97316" stroke-width="8"/>';
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 292">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#111827"/><stop offset="1" stop-color="#1f2d3d"/></linearGradient>
        <radialGradient id="glow" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="rgba(249,115,22,.35)"/><stop offset="1" stop-color="rgba(249,115,22,0)"/></radialGradient>
      </defs>
      <rect width="520" height="292" rx="18" fill="url(#bg)"/>
      <rect width="520" height="292" rx="18" fill="url(#glow)"/>
      <g opacity=".20" stroke="#ffffff"><path d="M0 58h520M0 116h520M0 174h520M0 232h520M104 0v292M208 0v292M312 0v292M416 0v292"/></g>
      <g transform="translate(0,-4)">${icon}</g>
      <text x="24" y="38" fill="#f97316" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="2">AUTOREPARA SHOP</text>
      <text x="24" y="258" fill="#e8e4dc" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800">${title}</text>
      <text x="24" y="278" fill="#9aa5b4" font-family="Arial, Helvetica, sans-serif" font-size="12">${label}</text>
    </svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  function findProductByCard(card){
    const id = card?.getAttribute('data-product-id') || String(card?.id || '').replace(/^shop-/, '');
    const list = Array.isArray(window.shopProductsCache) ? window.shopProductsCache : [];
    const title = (card?.querySelector('h3')?.textContent || '').trim();
    const desc = (card?.querySelector('.product-description')?.textContent || '').trim();
    const category = (card?.querySelector('.product-kicker')?.textContent || '').trim();

    return list.find(p => String(p.id) === String(id))
      || list.find(p => normalizeText(p.name) === normalizeText(title))
      || list.find(p => normalizeText(p.description || '') === normalizeText(desc) && normalizeText(p.category || '') === normalizeText(category))
      || {
        id,
        name: title || 'Producto',
        category,
        description: desc,
        features: Array.from(card?.querySelectorAll('.product-feature') || []).map(el => el.textContent.trim())
      };
  }

  function enhanceProductCards(){
    document.querySelectorAll('#tienda-container .product-card').forEach(card => {
      if (card.dataset.visualEnhanced === 'true') return;
      const product = findProductByCard(card);
      const title = product?.name || card.querySelector('h3')?.textContent || 'Producto';
      const source = realProductImage(product);
      const h3 = card.querySelector('h3');
      if (source) {
        const fig = document.createElement('div');
        fig.className = 'product-image-wrap';
        fig.innerHTML = `<img src="${esc(source)}" alt="${esc(title)}" loading="lazy" referrerpolicy="no-referrer"><span class="product-image-tag">Imagen del producto · ${esc(productNeed(product))}</span>`;
        if (h3) card.insertBefore(fig, h3);
        else card.insertBefore(fig, card.firstChild);
      } else {
        const pending = document.createElement('div');
        pending.className = 'product-image-pending';
        pending.innerHTML = `<i class="fa-solid fa-image"></i><span>Imagen pendiente: añade una URL real en <strong>image_url</strong> para este producto.</span>`;
        if (h3) card.insertBefore(pending, h3);
        else card.insertBefore(pending, card.firstChild);
      }

      const brief = document.createElement('div');
      brief.className = 'product-brief';
      brief.innerHTML = `<strong>Resumen</strong>${esc(productBrief(product))}`;
      const price = card.querySelector('.product-price');
      if (price) price.insertAdjacentElement('afterend', brief);
      else if (h3) h3.insertAdjacentElement('afterend', brief);
      card.dataset.visualEnhanced = 'true';
    });
  }

  const previousRenderStore = window.renderStore;
  if (typeof previousRenderStore === 'function') {
    window.renderStore = async function(...args){
      const result = await previousRenderStore.apply(this, args);
      enhanceProductCards();
      return result;
    };
  }

  const observer = new MutationObserver(() => enhanceProductCards());
  document.addEventListener('DOMContentLoaded', () => {
    const target = document.getElementById('tienda-container') || document.body;
    observer.observe(target, { childList:true, subtree:true });
    enhanceProductCards();
  });
})();
