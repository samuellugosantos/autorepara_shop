/* Extracted from index_tienda_popup_recuperado_sin_aceite_extra.html | original script id: kit-recomendado-popup-stable-script */

(function(){
  const CART_KEY = 'autorepara_cart_v1';
  const LOCAL_PROFILE_KEY = 'autorepara_user_profile_v1';
  const SELECTED_VEHICLE_KEY = 'autorepara_cloud_selected_vehicle_v1';
  const KIT_DISCOUNT = 0.08;
  const MAX_RECOMMENDATIONS = 5;

  const KIT_TEMPLATES = {
    aceite: {
      title: 'Kit de cambio de aceite',
      terms: ['aceite','filtro aceite','lubricacion','lubricación','drenaje'],
      slots: [
        { label:'Aceite correcto', terms:['aceite motor','0w30','5w30','vw 504','504/507','lubricante'], category:['fluidos'] },
        { label:'Filtro de aceite', terms:['filtro aceite','filtro de aceite'], avoid:['filtro aire','habitaculo','habitáculo'] },
        { label:'Recogida de fluido', terms:['bandeja','cubo','drenaje','recipiente'], category:['fluidos'] },
        { label:'Vertido limpio', terms:['embudo','relleno'] },
        { label:'Limpieza y protección', terms:['guantes','microfibra','trapo','limpiador'] }
      ]
    },
    filtro: {
      title: 'Kit de sustitución de filtros',
      terms: ['filtro','filtro aire','filtro habitaculo','filtro habitáculo','filtro combustible'],
      slots: [
        { label:'Filtro principal', terms:['filtro aire','filtro aceite','filtro habitaculo','filtro habitáculo','filtro combustible'] },
        { label:'Herramienta manual', terms:['destornillador','llave','vaso','carraca'] },
        { label:'Limpieza de alojamiento', terms:['microfibra','trapo','aspirador','limpiador'] },
        { label:'Diagnóstico rápido', terms:['obd','scanner','diagnostico','diagnóstico'] }
      ]
    },
    freno: {
      title: 'Kit de frenos',
      terms: ['freno','pastilla','disco','dot4','purgador'],
      slots: [
        { label:'Consumible de freno', terms:['pastilla','pastillas','disco','discos','freno'] },
        { label:'Limpieza de frenos', terms:['limpiador frenos','limpiador de frenos','brake cleaner'] },
        { label:'Líquido o purga', terms:['dot4','liquido frenos','líquido frenos','purgador','purga'] },
        { label:'Elevación segura', terms:['gato','borriqueta','borriquetas','caballetes'] },
        { label:'Par de apriete', terms:['torquimetro','torquímetro','dinamometrica','dinamométrica'] }
      ]
    },
    refrigerante: {
      title: 'Kit de refrigeración',
      terms: ['refrigerante','anticongelante','termostato','purga','radiador','manguito'],
      slots: [
        { label:'Refrigerante', terms:['refrigerante','anticongelante','g12','g13','coolant'] },
        { label:'Purga del circuito', terms:['embudo','purga','kit adaptadores'] },
        { label:'Recogida de fluido', terms:['cubo','bandeja','drenaje'] },
        { label:'Abrazaderas y manguitos', terms:['alicates','abrazaderas','manguito'] },
        { label:'Control de temperatura', terms:['termometro','termómetro','infrarrojo'] }
      ]
    },
    diagnostico: {
      title: 'Kit de diagnóstico',
      terms: ['diagnostico','diagnóstico','obd','sensor','codigo','código','fallo'],
      slots: [
        { label:'Lectura OBD', terms:['obd','obd-ii','scanner','diagnostico','diagnóstico'] },
        { label:'Comprobación eléctrica', terms:['multimetro','multímetro','tester'] },
        { label:'Conectores', terms:['limpiacontactos','contactos','electrico','eléctrico'] },
        { label:'Inspección visual', terms:['boroscopio','endoscopio','camara','cámara'] },
        { label:'Temperatura', terms:['termometro','termómetro','infrarrojo'] }
      ]
    },
    bateria: {
      title: 'Kit de batería y electricidad',
      terms: ['bateria','batería','alternador','bornas','electricidad'],
      slots: [
        { label:'Medición', terms:['multimetro','multímetro','tester'] },
        { label:'Conectores limpios', terms:['limpiacontactos','bornas','contactos'] },
        { label:'Seguridad', terms:['guantes','gafas'] },
        { label:'Diagnóstico', terms:['obd','scanner','diagnostico','diagnóstico'] }
      ]
    },
    bujia: {
      title: 'Kit de encendido',
      terms: ['bujia','bujía','bujias','bujías','bobina','encendido','ignicion','ignición'],
      slots: [
        { label:'Bujías', terms:['bujia','bujía','bujias','bujías','ngk','iridium','iridio'] },
        { label:'Par correcto', terms:['torquimetro','torquímetro','dinamometrica','dinamométrica'] },
        { label:'Vasos y llaves', terms:['vaso','llave bujia','llave bujía','carraca'] },
        { label:'Conectores', terms:['limpiacontactos','contactos','bobina'] },
        { label:'Diagnóstico', terms:['obd','scanner','diagnostico','diagnóstico'] }
      ]
    },
    itv: {
      title: 'Kit de preparación ITV',
      terms: ['itv','inspeccion','inspección','preitv','luces','neumaticos','neumáticos'],
      slots: [
        { label:'Diagnóstico previo', terms:['obd','scanner','diagnostico','diagnóstico'] },
        { label:'Visibilidad', terms:['limpiaparabrisas','escobilla','cristales'] },
        { label:'Luces', terms:['bombilla','bombillas','luces'] },
        { label:'Neumáticos', terms:['manometro','manómetro','presion','presión'] },
        { label:'Limpieza', terms:['limpiador','microfibra','trapo'] }
      ]
    },
    distribucion: {
      title: 'Kit de distribución',
      terms: ['distribucion','distribución','correa','cadena','tensor','calado'],
      slots: [
        { label:'Kit de distribución', terms:['distribucion','distribución','correa','cadena','tensor','calado'] },
        { label:'Par de apriete', terms:['torquimetro','torquímetro','dinamometrica','dinamométrica'] },
        { label:'Inspección', terms:['boroscopio','endoscopio','camara','cámara'] },
        { label:'Lubricación relacionada', terms:['aceite','filtro aceite','lubricante'] },
        { label:'Herramienta manual', terms:['vaso','llave','carraca'] }
      ]
    },
    neumatico: {
      title: 'Kit de ruedas y neumáticos',
      terms: ['neumatico','neumático','neumaticos','neumáticos','rueda','llanta'],
      slots: [
        { label:'Elevación', terms:['gato','hidraulico','hidráulico'] },
        { label:'Apoyo seguro', terms:['borriqueta','borriquetas','caballetes'] },
        { label:'Presión', terms:['manometro','manómetro','presion','presión'] },
        { label:'Par de ruedas', terms:['torquimetro','torquímetro','llave ruedas'] },
        { label:'Limpieza', terms:['microfibra','limpiador'] }
      ]
    },
    basico: {
      title: 'Kit básico de mantenimiento y diagnóstico',
      terms: ['basico','básico','mantenimiento','general'],
      slots: [
        { label:'Kit de herramientas', terms:['kit basico','kit básico','kit','carraca','vasos','puntas'] },
        { label:'Diagnóstico inicial', terms:['obd','obd-ii','scanner','diagnostico','diagnóstico'] },
        { label:'Elevación segura', terms:['gato','hidraulico','hidráulico','borriquetas','caballetes'] },
        { label:'Limpieza', terms:['microfibra','trapo','limpiador'] },
        { label:'Fluidos básicos', terms:['bandeja','cubo','embudo'] }
      ]
    }
  };

  function norm(value){
    return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  }
  function esc(value){
    return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function money(value){ return `${Number(value || 0).toFixed(2).replace('.', ',')}€`; }
  function parsePrice(value){
    const clean = String(value || '').replace(/\./g,'').replace(',', '.');
    const match = clean.match(/(\d+(?:\.\d+)?)/);
    return match ? Number(match[1]) : 0;
  }
  function firstSentence(text){
    const clean = String(text || '').replace(/\s+/g,' ').trim();
    if (!clean) return 'Producto complementario para completar la reparación con más seguridad.';
    const sentence = clean.split(/[.!?]/).filter(Boolean)[0] || clean;
    return sentence.length > 128 ? sentence.slice(0,125) + '…' : sentence;
  }
  function productText(product){
    return norm(`${product.id || ''} ${product.product_id || ''} ${product.name || ''} ${product.category || ''} ${product.description || ''} ${product.desc || ''} ${product.keywords || ''} ${(product.features || []).join ? product.features.join(' ') : ''}`);
  }
  function optionData(option){
    const text = option ? option.textContent || '' : '';
    const parts = text.split('·').map(p => p.trim()).filter(Boolean);
    return {
      variantId: option ? option.value : '',
      variantLabel: parts[0] || 'Única',
      price: parsePrice(parts[1] || text),
      stock: parsePrice(parts.find(p => norm(p).includes('stock')) || '')
    };
  }
  function productFromCard(card){
    if (!card) return null;
    const select = card.querySelector('select');
    const selectedOption = select && select.options ? select.options[select.selectedIndex] : null;
    const opt = optionData(selectedOption);
    const name = card.querySelector('h3')?.textContent?.trim() || 'Producto';
    const category = card.querySelector('.product-kicker')?.textContent?.trim() || '';
    const description = card.querySelector('.product-description')?.textContent?.trim() || card.querySelector('.product-brief')?.textContent?.replace(/^Resumen/i,'').trim() || '';
    const features = Array.from(card.querySelectorAll('.product-feature')).map(el => el.textContent.trim()).join(' ');
    const productId = card.dataset.productId || (card.id || '').replace(/^shop-/, '') || name;
    const fallbackPrice = parsePrice(card.querySelector('.product-price')?.textContent || '');
    return normalizeCandidate({
      id: productId,
      name,
      category,
      description,
      price: opt.price || fallbackPrice,
      stock: opt.stock || 99,
      variant_id: opt.variantId || `${productId}__default`,
      variant_label: opt.variantLabel || 'Única',
      keywords: features,
      source: 'card'
    });
  }
  function normalizeCandidate(product){
    if (!product) return null;
    const variants = Array.isArray(product.variants) ? product.variants : [];
    const variant = variants.find(v => Number(v.stock || 0) > 0 && (v.is_default || v.default)) || variants.find(v => Number(v.stock || 0) > 0) || variants[0] || {};
    const id = product.id || product.product_id || product.slug || product.name;
    const price = Number(variant.price ?? product.price ?? product.unit_price ?? 0);
    const stock = Number(variant.stock ?? product.stock ?? 99);
    const candidate = {
      product_id: id,
      id,
      variant_id: product.variant_id || variant.id || `${id}__default`,
      variant_label: product.variant_label || variant.label || product.size || 'Única',
      name: product.name || 'Producto',
      category: product.category || '',
      description: product.description || product.desc || '',
      keywords: product.keywords || '',
      features: Array.isArray(product.features) ? product.features : [],
      unit_price: price,
      price,
      stock,
      localOnly: Boolean(product.localOnly),
      source: product.source || 'cache'
    };
    candidate.text = productText(candidate);
    return candidate;
  }
  function getGlobalArray(name){
    try {
      if (name === 'shopProductsCache' && typeof shopProductsCache !== 'undefined') return shopProductsCache;
      if (name === 'shopProducts' && typeof shopProducts !== 'undefined') return shopProducts;
      if (name === 'SHOP_DEMO_PRODUCTS' && typeof SHOP_DEMO_PRODUCTS !== 'undefined') return SHOP_DEMO_PRODUCTS;
    } catch(e) {}
    return [];
  }
  async function getCandidateProducts(){
    const byId = new Map();
    const add = p => {
      const c = normalizeCandidate(p);
      if (!c || !c.product_id) return;
      if (Number(c.stock || 0) <= 0 && c.source !== 'card') return;
      byId.set(String(c.product_id), c);
    };
    getGlobalArray('shopProductsCache').forEach(add);
    if (typeof window.shopProductsCache !== 'undefined' && Array.isArray(window.shopProductsCache)) window.shopProductsCache.forEach(add);
    getGlobalArray('shopProducts').forEach(add);
    getGlobalArray('SHOP_DEMO_PRODUCTS').forEach(add);
    Array.from(document.querySelectorAll('.product-card[data-product-id], .product-card[id^="shop-"]')).map(productFromCard).filter(Boolean).forEach(add);
    if (byId.size < 3 && typeof loadStoreProducts === 'function') {
      try { (await loadStoreProducts('', 'all')).forEach(add); } catch(e) {}
    }
    return Array.from(byId.values());
  }
  function readLocalRepairData(){
    try {
      const profile = JSON.parse(localStorage.getItem(LOCAL_PROFILE_KEY) || 'null');
      if (!profile || !Array.isArray(profile.repairs)) return [];
      return profile.repairs.map(r => ({
        repair_type: r.category || r.title || '',
        title: r.title || '',
        notes: r.notes || '',
        guide_title: r.guideTitle || '',
        tools: Array.isArray(r.guideTools) ? r.guideTools : [],
        materials: Array.isArray(r.guideParts) ? r.guideParts : []
      }));
    } catch(e) { return []; }
  }
  async function readSupabaseRepairData(){
    try {
      if (typeof supabaseDb === 'undefined' || !supabaseDb) return [];
      const { data: auth } = await supabaseDb.auth.getUser();
      if (!auth?.user) return [];
      let request = supabaseDb
        .from('vehicle_repairs')
        .select('repair_type,title,notes,guide_title,tools,materials,repair_date,vehicle_id')
        .order('repair_date', { ascending:false })
        .limit(12);
      const selectedVehicleId = localStorage.getItem(SELECTED_VEHICLE_KEY);
      if (selectedVehicleId) request = request.eq('vehicle_id', selectedVehicleId);
      const { data, error } = await request;
      return error ? [] : (data || []);
    } catch(e) { return []; }
  }
  function contextFromText(text){
    const clean = norm(text);
    const scores = Object.entries(KIT_TEMPLATES).map(([key, tpl]) => {
      if (key === 'basico') return { key, score: 0, template: tpl };
      let score = 0;
      (tpl.terms || []).forEach(term => { if (clean.includes(norm(term))) score += 4; });
      (tpl.slots || []).forEach(slot => (slot.terms || []).forEach(term => { if (clean.includes(norm(term))) score += 1; }));
      return { key, score, template: tpl };
    }).filter(x => x.score > 0).sort((a,b) => b.score - a.score);
    return scores[0] || null;
  }
  function detectBrands(product){
    const text = product && product.text ? product.text : productText(product || {});
    const brands = [];
    const brandTerms = [
      ['renault', ['renault','megane','mégane','clio','captur','dacia']],
      ['seat', ['seat','leon','león','ibiza','ateca']],
      ['volkswagen', ['volkswagen','vw','golf','passat','polo']],
      ['peugeot', ['peugeot','308','208','3008','puretech','hdi']],
      ['ford', ['ford','focus','fiesta','ecoboost']],
      ['toyota', ['toyota','corolla','yaris','hybrid','hibrido','híbrido']],
      ['bmw', ['bmw','320d','serie 3','b47']],
      ['opel', ['opel','astra','corsa','cdti']],
      ['audi', ['audi','a3','a4']],
      ['skoda', ['skoda','octavia','fabia']],
      ['citroen', ['citroen','citroën','c4','c3']],
      ['mercedes', ['mercedes','benz','clase']],
      ['nissan', ['nissan','qashqai','juke']]
    ];
    brandTerms.forEach(([brand, terms]) => {
      if (terms.some(term => text.includes(norm(term)))) brands.push(brand);
    });
    return [...new Set(brands)];
  }
  function productFamily(product){
    const text = product && product.text ? product.text : productText(product || {});
    const checks = [
      ['aceite', ['aceite motor','lubricante','0w30','0w-30','5w30','5w-30','504/507','vw 504','ll-04','rn17']],
      ['filtro_aceite', ['filtro aceite','filtro de aceite']],
      ['filtro_aire', ['filtro aire','filtro de aire']],
      ['filtro_habitaculo', ['filtro habitaculo','filtro habitáculo','polen','cabina']],
      ['filtro_combustible', ['filtro combustible','filtro gasoil','filtro diésel','filtro diesel']],
      ['pastillas_freno', ['pastilla','pastillas']],
      ['discos_freno', ['disco de freno','discos de freno']],
      ['liquido_frenos', ['dot4','liquido frenos','líquido frenos']],
      ['refrigerante', ['refrigerante','anticongelante','g12','g13','coolant']],
      ['obd', ['obd','obd-ii','scanner','diagnostico','diagnóstico']],
      ['torquimetro', ['torquimetro','torquímetro','dinamometrica','dinamométrica']],
      ['gato', ['gato hidraulico','gato hidráulico']],
      ['borriquetas', ['borriqueta','borriquetas','caballetes']],
      ['bujias', ['bujia','bujía','bujias','bujías','iridium','iridio']],
      ['bateria', ['bateria','batería','bornas']],
      ['distribucion', ['distribucion','distribución','correa','cadena','tensor','calado']],
      ['limpieza', ['limpiador','microfibra','trapo','limpiacontactos']],
      ['embudo', ['embudo']],
      ['bandeja', ['bandeja','cubo','drenaje','recipiente']],
      ['herramienta_manual', ['vaso','carraca','llave','destornillador','alicates']]
    ];
    for (const [family, terms] of checks) {
      if (terms.some(term => text.includes(norm(term)))) return family;
    }
    return 'otro';
  }
  function isGenericProduct(product){
    const text = product && product.text ? product.text : productText(product || {});
    const brands = detectBrands(product);
    return brands.length === 0 || /universal|generico|genérico|multimarca|compatible general|uso general/.test(text);
  }
  function sameProductFamily(a, b){
    if (!a || !b) return false;
    const fa = productFamily(a);
    const fb = productFamily(b);
    if (fa === 'otro' || fb === 'otro') return false;
    return fa === fb;
  }

  function cleanProductNameForCompare(value){
    return norm(value)
      .replace(/\b(para|compatible|compatibilidad|universal|generico|generica|genérico|genérica|kit|pack|set|producto|auto|autorepara)\b/g, ' ')
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function comparableProductIds(product){
    if (!product) return [];
    return [product.product_id, product.id, product.slug, product.variant_id]
      .filter(Boolean)
      .map(value => String(value));
  }
  function meaningfulProductTokens(value){
    const stop = new Set(['de','del','la','el','los','las','para','con','sin','por','un','una','y','o','en','auto','autorepara','kit','pack','set','producto','compatible','universal','generico','generica','genérico','genérica']);
    return cleanProductNameForCompare(value)
      .split(' ')
      .filter(token => token.length > 2 && !stop.has(token));
  }
  function tokenOverlapRatio(a, b){
    const ta = meaningfulProductTokens(a);
    const tb = meaningfulProductTokens(b);
    if (!ta.length || !tb.length) return 0;
    const sb = new Set(tb);
    const hits = ta.filter(token => sb.has(token)).length;
    return hits / Math.min(ta.length, tb.length);
  }
  function isSameOrBaseProduct(candidate, base){
    if (!candidate || !base) return false;
    const candidateIds = comparableProductIds(candidate);
    const baseIds = comparableProductIds(base);
    if (candidateIds.some(id => baseIds.includes(id))) return true;

    const candidateName = cleanProductNameForCompare(candidate.name || '');
    const baseName = cleanProductNameForCompare(base.name || '');
    if (candidateName && baseName) {
      if (candidateName === baseName) return true;
      if (candidateName.length > 12 && baseName.includes(candidateName)) return true;
      if (baseName.length > 12 && candidateName.includes(baseName)) return true;
      if (tokenOverlapRatio(candidate.name || '', base.name || '') >= 0.85) return true;
    }

    const candidateText = productText(candidate);
    const baseText = productText(base);
    const candidateFamily = productFamily(candidate);
    const baseFamily = productFamily(base);
    if (candidateFamily !== 'otro' && baseFamily !== 'otro' && candidateFamily === baseFamily) {
      const candidateBrands = detectBrands(candidate);
      const baseBrands = detectBrands(base);
      const sameKnownBrand = candidateBrands.length && baseBrands.length && candidateBrands.some(brand => baseBrands.includes(brand));
      const candidateGeneric = isGenericProduct(candidate);
      const baseGeneric = isGenericProduct(base);
      if (sameKnownBrand || candidateGeneric || baseGeneric) return true;
    }

    const candidateTokens = meaningfulProductTokens(candidateText);
    const baseTokens = meaningfulProductTokens(baseText);
    if (candidateTokens.length && baseTokens.length) {
      const sb = new Set(baseTokens);
      const hits = candidateTokens.filter(t => sb.has(t)).length;
      if (hits >= 4 && candidateFamily === baseFamily) return true;
    }
    return false;
  }
  function filterOutBaseProduct(list, base){
    const seen = new Set();
    return (Array.isArray(list) ? list : []).filter(item => {
      if (!item || isSameOrBaseProduct(item, base)) return false;
      const family = productFamily(item);
      const nameKey = cleanProductNameForCompare(item.name || '');
      const idKey = String(item.product_id || item.id || item.variant_id || nameKey);
      const key = `${family}::${nameKey || idKey}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  function slotIsAlreadyCoveredByBase(base, slot){
    if (!base || !slot) return false;
    const baseScore = slotScore(base, slot, null);
    if (baseScore <= 0) return false;
    const slotLabel = norm(slot.label || '');
    const mainFamilies = ['aceite','filtro_aceite','filtro_aire','filtro_habitaculo','filtro_combustible','pastillas_freno','discos_freno','liquido_frenos','refrigerante','obd','bujias','bateria','distribucion'];
    const baseFamily = productFamily(base);
    return mainFamilies.includes(baseFamily) || /principal|aceite correcto|consumible|refrigerante|lectura obd|bujias|bujias|kit de distribucion|kit de distribución/.test(slotLabel);
  }
  async function buildKitContext(base){
    const repairs = [...(await readSupabaseRepairData()), ...readLocalRepairData()].slice(0, 12);
    const baseCtx = contextFromText(`${base?.name || ''} ${base?.category || ''} ${base?.description || ''} ${base?.keywords || ''}`);
    if (baseCtx) return { ...baseCtx, mode:'product', repairs, baseBrands: detectBrands(base), baseFamily: productFamily(base) };
    const repairText = repairs.map(r => `${r.repair_type || ''} ${r.title || ''} ${r.guide_title || ''} ${r.notes || ''} ${(r.tools || []).join(' ')} ${(r.materials || []).join(' ')}`).join(' ');
    const repairCtx = contextFromText(repairText);
    if (repairCtx) return { ...repairCtx, mode:'repairs', repairs, baseBrands: detectBrands(base), baseFamily: productFamily(base) };
    return { key:'basico', template:KIT_TEMPLATES.basico, score:0, mode:'basic', repairs, baseBrands: detectBrands(base), baseFamily: productFamily(base) };
  }
  function slotScore(product, slot, context){
    const text = product.text || productText(product);
    let score = 0;
    (slot.terms || []).forEach((term, idx) => {
      const t = norm(term);
      if (text.includes(t)) score += idx === 0 ? 40 : 30;
    });
    (slot.category || []).forEach(cat => { if (norm(product.category).includes(norm(cat))) score += 10; });
    (slot.avoid || []).forEach(term => { if (text.includes(norm(term))) score -= 50; });
    const isTorque = /torquimetro|torquimetro|dinamometrica|dinamometrica/.test(text);
    const torqueSlot = (slot.terms || []).some(term => /torqu/i.test(norm(term)) || /dinamometr/i.test(norm(term)));
    if (isTorque && !torqueSlot) score -= 80;
    if (/kit|pack|set/.test(text) && /kit/i.test(slot.label)) score += 15;
    if (context && context.baseBrands && context.baseBrands.length) {
      const productBrands = detectBrands(product);
      const sameBrand = productBrands.some(b => context.baseBrands.includes(b));
      const generic = isGenericProduct(product);
      if (sameBrand) score += 35;
      else if (generic) score += 0;
      else score -= 35;
    }
    if (Number(product.stock || 0) > 0) score += 2;
    return score;
  }
  function uniqueRecommendationKey(product){
    return `${productFamily(product)}::${norm(product.name || '').replace(/\b(universal|generico|genérico|compatible|para|de|el|la|los|las)\b/g,'').replace(/\s+/g,' ').trim()}`;
  }
  function pickForSlots(pool, context, base){
    const selected = [];
    const baseId = String(base?.product_id || base?.id || '');
    const baseVariant = String(base?.variant_id || '');
    const used = new Set([baseId, baseVariant].filter(Boolean));
    const usedNames = new Set([norm(base?.name || '')]);
    const usedFamilies = new Set([productFamily(base)].filter(f => f && f !== 'otro'));
    const slots = context.template.slots || KIT_TEMPLATES.basico.slots;
    const baseBrands = context.baseBrands || detectBrands(base);

    for (const slot of slots) {
      if (slotIsAlreadyCoveredByBase(base, slot)) continue;
      const candidates = pool
        .filter(p => p && !used.has(String(p.product_id)) && !used.has(String(p.variant_id)))
        .filter(p => !usedNames.has(norm(p.name)))
        .filter(p => !isSameOrBaseProduct(p, base))
        .filter(p => !sameProductFamily(p, base))
        .filter(p => !usedFamilies.has(productFamily(p)))
        .map(p => ({ product:p, score:slotScore(p, slot, context), brands:detectBrands(p), generic:isGenericProduct(p) }))
        .filter(x => x.score > 0);

      let ranked = candidates;
      if (baseBrands.length) {
        const specific = candidates.filter(x => x.brands.some(b => baseBrands.includes(b)));
        if (specific.length) ranked = specific;
        else ranked = candidates.filter(x => x.generic || !x.brands.length);
      }
      ranked = ranked.sort((a,b) => b.score - a.score);
      if (ranked[0]) {
        const picked = { ...ranked[0].product, kitSlot: slot.label };
        selected.push(picked);
        used.add(String(picked.product_id));
        used.add(String(picked.variant_id));
        usedNames.add(norm(picked.name));
        const family = productFamily(picked);
        if (family !== 'otro') usedFamilies.add(family);
      }
      if (selected.length >= MAX_RECOMMENDATIONS) break;
    }

    if (selected.length < 3 && context.key !== 'basico') {
      const extras = pickForSlots(pool.filter(p => !used.has(String(p.product_id)) && !isSameOrBaseProduct(p, base) && !sameProductFamily(p, base)), { template:KIT_TEMPLATES.basico, key:'basico', baseBrands, baseFamily:productFamily(base) }, base);
      extras.forEach(p => {
        const family = productFamily(p);
        if (selected.length < MAX_RECOMMENDATIONS && !used.has(String(p.product_id)) && !usedFamilies.has(family) && !isSameOrBaseProduct(p, base) && !sameProductFamily(p, base)) {
          selected.push(p);
          used.add(String(p.product_id));
          if (family !== 'otro') usedFamilies.add(family);
        }
      });
    }
    return selected.slice(0, MAX_RECOMMENDATIONS);
  }
  async function pickRecommendations(base){
    const context = await buildKitContext(base);
    const pool = await getCandidateProducts();
    let recommendations = pickForSlots(pool, context, base);
    if (!recommendations.length) recommendations = pickForSlots(pool, { key:'basico', template:KIT_TEMPLATES.basico, mode:'basic', baseBrands:detectBrands(base), baseFamily:productFamily(base) }, base);
    recommendations = filterOutBaseProduct(recommendations, base).filter(item => item && !sameProductFamily(item, base));
    return { context, recommendations };
  }
  function getCart(){
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
  }
  function saveCart(cart){
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    if (typeof window.updateCartCounter === 'function') window.updateCartCounter();
    document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = String(cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0)); });
  }
  function addProductToCart(product, options = {}){
    if (!product) return false;
    const cart = getCart();
    const existing = cart.find(item => String(item.variant_id) === String(product.variant_id));
    if (existing) existing.quantity = Math.min(Number(existing.quantity || 1) + 1, Number(product.stock || 99));
    else cart.push({
      product_id: product.product_id,
      variant_id: product.variant_id,
      name: product.name,
      variant_label: product.variant_label || 'Única',
      unit_price: Number(product.unit_price || product.price || 0),
      quantity: 1
    });
    saveCart(cart);
    if (!options.silent && typeof window.showToast === 'function') window.showToast(`${product.name} añadido al carrito.`, 'success');
    return true;
  }
  function closePopup(){ const popup = document.getElementById('kit-upsell-popup'); if (popup) popup.remove(); }
  function openCartNow(){
    const tryOpen = () => {
      if (typeof window.openCartModal === 'function') { window.openCartModal(); return true; }
      const cartButton = document.querySelector('.shop-cart-button, [onclick*="openCartModal"]');
      if (cartButton) { cartButton.click(); return true; }
      return false;
    };
    if (tryOpen()) return;
    if (typeof window.navigate === 'function') window.navigate('tienda');
    setTimeout(() => { if (!tryOpen()) setTimeout(tryOpen, 250); }, 250);
  }
  function addProductById(productId, options = {}){
    const product = (window.__kitCurrentRecommendations || []).find(item => String(item.product_id) === String(productId));
    if (isSameOrBaseProduct(product, window.__kitCurrentBaseProduct)) return false;
    const ok = addProductToCart(product, options);
    const btn = document.querySelector(`[data-kit-add="${CSS.escape(String(productId))}"]`);
    if (btn && ok) { btn.innerHTML = '<i class="fa-solid fa-check"></i> Añadido'; btn.disabled = true; }
    return ok;
  }
  function addFullKit(ids){
    const list = Array.isArray(ids) ? ids.filter(id => {
      const product = (window.__kitCurrentRecommendations || []).find(item => String(item.product_id) === String(id));
      return product && !isSameOrBaseProduct(product, window.__kitCurrentBaseProduct);
    }) : [];
    let added = 0;
    list.forEach(id => { if (addProductById(id, { silent:true })) added += 1; });
    closePopup();
    if (typeof window.showToast === 'function') window.showToast(`${added} productos del kit añadidos al carrito.`, 'success');
    setTimeout(openCartNow, 120);
  }
  function renderPopup(base, recommendations, context){
    recommendations = filterOutBaseProduct(recommendations, base).filter(item => item && !sameProductFamily(item, base));
    if (!recommendations.length) return;
    window.__kitCurrentBaseProduct = base;
    window.__kitCurrentRecommendations = recommendations;
    closePopup();
    const subtotal = recommendations.reduce((sum, item) => sum + Number(item.unit_price || item.price || 0), 0);
    const discounted = subtotal * (1 - KIT_DISCOUNT);
    const saved = subtotal - discounted;
    const ids = recommendations.map(item => item.product_id);
    const modeTitle = context.mode === 'repairs' ? context.template.title + ' según tu historial' : context.template.title;
    const modeText = context.mode === 'repairs'
      ? 'Se ha generado a partir de las reparaciones registradas en tu perfil.'
      : context.mode === 'product'
        ? 'Se ha generado según el producto que acabas de añadir.'
        : 'Todavía no hay reparaciones suficientes, así que se muestra un kit básico útil para mantenimiento general.';
    const cards = recommendations.map(item => `
      <div class="kit-product-card">
        <span class="kit-discount-pill"><i class="fa-solid fa-tag"></i> -8% en pack</span>
        <h4>${esc(item.name)}</h4>
        <p><strong>${esc(item.kitSlot || 'Producto recomendado')}.</strong> ${esc(firstSentence(item.description))}</p>
        <div class="kit-price-row"><span class="kit-price-old">${money(item.unit_price || item.price)}</span><span class="kit-price-new">${money(Number(item.unit_price || item.price || 0) * (1 - KIT_DISCOUNT))}</span></div>
        <button class="kit-card-btn" data-kit-add="${esc(item.product_id)}" onclick="addKitRecommendedProductStable('${esc(item.product_id)}')"><i class="fa-solid fa-plus"></i> Añadir</button>
      </div>`).join('');
    const overlay = document.createElement('div');
    overlay.id = 'kit-upsell-popup';
    overlay.className = 'kit-upsell-overlay';
    overlay.innerHTML = `
      <div class="kit-upsell-modal" role="dialog" aria-modal="true" aria-label="Kit recomendado">
        <div class="kit-upsell-header">
          <div><div class="kit-upsell-kicker">${esc(modeTitle)}</div><h3>Completa tu reparación con un kit recomendado</h3><p>Has añadido <strong>${esc(base.name)}</strong>. ${esc(modeText)}</p></div>
          <button class="kit-upsell-close" onclick="closeKitPopupStable()" aria-label="Cerrar"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="kit-upsell-body">
          <div class="kit-context-box"><i class="fa-solid fa-screwdriver-wrench"></i><div><strong>Recomendación dinámica</strong><span>${esc(modeText)}</span></div></div>
          <div class="kit-base-product"><div><strong>${esc(base.name)}</strong><span>Producto añadido al carrito</span></div><div style="font-family:var(--font-display);font-size:24px;color:var(--accent-orange);font-weight:800">${money(base.unit_price || base.price)}</div></div>
          <div class="kit-savings-box"><div class="kit-saving-card"><span class="kit-saving-label">Pack sugerido</span><span class="kit-saving-value">${recommendations.length} productos</span></div><div class="kit-saving-card"><span class="kit-saving-label">Ahorro pack</span><span class="kit-saving-value">${money(saved)}</span></div><div class="kit-saving-card"><span class="kit-saving-label">Precio pack</span><span class="kit-saving-value">${money(discounted)}</span></div></div>
          <div class="kit-products-grid">${cards}</div>
          <div class="kit-actions"><button class="kit-primary-btn" onclick='addFullRecommendedKitStable(${JSON.stringify(ids)})'><i class="fa-solid fa-cart-plus"></i> Añadir kit y ver carrito</button><button class="kit-secondary-btn" onclick="closeKitPopupStable()"><i class="fa-solid fa-arrow-right"></i> Seguir comprando</button><button class="kit-secondary-btn" onclick="closeKitPopupStable(); openKitCartStable();"><i class="fa-solid fa-basket-shopping"></i> Ver carrito</button></div>
          <p class="kit-note"><strong>Nota:</strong> el descuento es una propuesta visual del pack. El pedido final mantiene la validación de stock y precios en Supabase.</p>
        </div>
      </div>`;
    overlay.addEventListener('click', event => { if (event.target === overlay) closePopup(); });
    document.body.appendChild(overlay);
  }
  async function showPopupFromCard(card){
    const base = productFromCard(card);
    if (!base) return;
    const { recommendations, context } = await pickRecommendations(base);
    renderPopup(base, recommendations, context);
  }

  document.addEventListener('click', function(event){
    const button = event.target.closest && event.target.closest('.product-card .btn-cart');
    if (!button || button.disabled || window.__kitPopupInternalAdd) return;
    const card = button.closest('.product-card');
    if (!card) return;
    setTimeout(() => showPopupFromCard(card), 550);
  }, true);

  window.closeKitPopupStable = closePopup;
  window.openKitCartStable = openCartNow;
  window.addKitRecommendedProductStable = function(productId){ return addProductById(productId); };
  window.addFullRecommendedKitStable = addFullKit;
  window.closeKitPopup = closePopup;
  window.closeKitPopupFinal = closePopup;
  window.addKitRecommendedProduct = window.addKitRecommendedProductStable;
  window.addKitRecommendedProductFinal = window.addKitRecommendedProductStable;
  window.addFullRecommendedKit = window.addFullRecommendedKitStable;
  window.addFullRecommendedKitFinal = window.addFullRecommendedKitStable;
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closePopup(); });
})();
