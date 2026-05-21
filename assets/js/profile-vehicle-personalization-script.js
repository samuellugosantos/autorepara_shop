(function(){
  const STORAGE_KEY = 'autorepara_user_profile_v1';
  const DEFAULT_PROFILE = { owner: { name: '', email: '', notes: '' }, selectedVehicleId: '', vehicles: [], repairs: [] };
  const REPAIR_GUIDE_RULES = [
    { guideId:'g-aceite', category:'Aceite y filtros', terms:['aceite','filtro aceite','cambio aceite','lubricacion','lubricación','5w30','0w30','0w20'] },
    { guideId:'g-filtro-aire', category:'Aceite y filtros', terms:['filtro aire','aire','admision','admisión','caja filtro'] },
    { guideId:'g-maf', category:'Diagnosis', terms:['maf','sensor maf','caudalimetro','caudalímetro','diagnosis','obd','mezcla','fallo motor','testigo motor'] },
    { guideId:'g-cuerpo-aceleracion', category:'Diagnosis', terms:['cuerpo aceleracion','cuerpo de aceleracion','cuerpo de aceleración','mariposa','ralenti','ralentí','limpieza admision'] },
    { guideId:'g-purga-refrigeracion', category:'Revisión general', terms:['refrigerante','anticongelante','purga','purgar','circuito refrigeracion','circuito refrigeración','liquido refrigerante','líquido refrigerante'] },
    { guideId:'g-termostato', category:'Revisión general', terms:['termostato','temperatura baja','temperatura alta','no calienta','calienta mucho'] },
    { guideId:'g-sobrecalentamiento', category:'Diagnosis', terms:['sobrecalentamiento','se calienta','temperatura','calenton','calentón','radiador','ventilador'] },
    { guideId:'g-ruido-cadena', category:'Distribución', terms:['ruido cadena','cadena','traqueteo','arranque frio','arranque frío','tensor cadena'] },
    { guideId:'g-cuando-cadena', category:'Distribución', terms:['distribucion','distribución','cambiar cadena','kit distribucion','kit distribución','correa','cadena distribucion'] }
  ];

  function uid(prefix){ return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,8); }
  function todayISO(){ return new Date().toISOString().slice(0,10); }
  function escapeHtml(value){ return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function normalizePlate(value){ return String(value || '').toUpperCase().replace(/\s+/g,' ').trim(); }
  function money(value){ const n = Number(value || 0); return n ? n.toLocaleString('es-ES',{style:'currency',currency:'EUR'}) : '—'; }
  function safeToast(message, type='success'){
    if(typeof showToast !== 'function') return;
    try { showToast(type, type === 'success' ? 'fa-check-circle' : 'fa-circle-info', message); }
    catch(e){ try { showToast(message, type); } catch(_){} }
  }
  function loadState(){
    try{
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if(!saved || typeof saved !== 'object') return structuredClone(DEFAULT_PROFILE);
      return {
        owner: { ...DEFAULT_PROFILE.owner, ...(saved.owner || {}) },
        selectedVehicleId: saved.selectedVehicleId || '',
        vehicles: Array.isArray(saved.vehicles) ? saved.vehicles : [],
        repairs: Array.isArray(saved.repairs) ? saved.repairs : []
      };
    } catch(e){ return structuredClone(DEFAULT_PROFILE); }
  }
  function saveState(state){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); updateBadge(state); }
  function selectedVehicle(state){ return state.vehicles.find(v => v.id === state.selectedVehicleId) || state.vehicles[0] || null; }
  function repairsFor(state, vehicleId){ return state.repairs.filter(r => r.vehicleId === vehicleId).sort((a,b) => String(b.date).localeCompare(String(a.date)) || Number(b.mileage||0)-Number(a.mileage||0)); }
  function guideById(id){ return (Array.isArray(window.guidesData) ? window.guidesData : (typeof guidesData !== 'undefined' ? guidesData : [])).find(g => g.id === id) || null; }
  function allGuides(){ return Array.isArray(window.guidesData) ? window.guidesData : (typeof guidesData !== 'undefined' ? guidesData : []); }
  function suggestGuide(query, category){
    const q = String(query || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
    const cat = String(category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    let best = null;
    REPAIR_GUIDE_RULES.forEach(rule => {
      let score = 0;
      rule.terms.forEach(term => {
        const t = term.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        if(q.includes(t)) score += t.length > 8 ? 4 : 2;
        if(cat && rule.category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(cat)) score += 1;
      });
      if(!best || score > best.score) best = { ...rule, score };
    });
    if(best && best.score > 0) return guideById(best.guideId);
    const guides = allGuides();
    return guides.find(g => String(g.title + ' ' + (g.description||'') + ' ' + (g.tags||'')).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q)) || null;
  }
  function guideTools(guide){ return [...new Set([...(guide?.tools || []), ...((guide?.steps || []).flatMap(s => s.tools || []))])].filter(Boolean); }
  function guideParts(guide){ return [...new Set([...(guide?.parts || [])])].filter(Boolean); }
  function setHiddenPlan(guide){
    const tools = guideTools(guide);
    const parts = guideParts(guide);
    const set = (id, value) => { const el = document.getElementById(id); if(el) el.value = value || ''; };
    set('repairGuideId', guide?.id || '');
    set('repairGuideTitle', guide?.title || '');
    set('repairGuideTools', JSON.stringify(tools));
    set('repairGuideParts', JSON.stringify(parts));
  }
  function planMarkup(guide){
    if(!guide) return `<div class="repair-plan-card"><div class="repair-plan-kicker">Sin coincidencia exacta</div><div class="repair-plan-title">Escribe una reparación más concreta</div><p class="repair-plan-description">Prueba con términos como cambio de aceite, filtro de aire, sensor MAF, purga de refrigerante, termostato o distribución.</p></div>`;
    const tools = guideTools(guide);
    const parts = guideParts(guide);
    return `<div class="repair-plan-card">
      <div class="repair-plan-kicker">Guía recomendada</div>
      <div class="repair-plan-title">${escapeHtml(guide.title)}</div>
      <p class="repair-plan-description">${escapeHtml(guide.description || 'Guía asociada a esta reparación para conservarla dentro del historial del vehículo.')}</p>
      ${tools.length ? `<div class="repair-chip-row">${tools.slice(0,8).map(t=>`<span class="repair-chip"><i class="fa-solid fa-screwdriver-wrench"></i>${escapeHtml(t)}</span>`).join('')}</div>` : ''}
      ${parts.length ? `<div class="repair-chip-row">${parts.slice(0,8).map(t=>`<span class="repair-chip"><i class="fa-solid fa-box-open"></i>${escapeHtml(t)}</span>`).join('')}</div>` : ''}
      <button class="repair-guide-link" type="button" onclick="openAssociatedGuide('${guide.id}')"><i class="fa-solid fa-book-open"></i> Abrir guía</button>
    </div>`;
  }
  window.updateRepairPlanSuggestion = function(){
    const query = document.getElementById('repairPlanQuery')?.value || document.getElementById('repairTitle')?.value || '';
    const category = document.getElementById('repairCategory')?.value || '';
    const guide = suggestGuide(query, category);
    setHiddenPlan(guide);
    const result = document.getElementById('repairPlanResult');
    if(result) result.innerHTML = query.trim() ? planMarkup(guide) : '';
  };
  window.openAssociatedGuide = function(guideId){
    if(!guideId) return;
    if(typeof closeProfilePanel === 'function') closeProfilePanel();
    if(typeof navigate === 'function') navigate('guias');
    setTimeout(() => { if(typeof openGuide === 'function') openGuide(guideId); }, 100);
  };
  function renderPhotoPreview(data){
    const preview = document.getElementById('vehiclePhotoPreview');
    if(!preview) return;
    preview.innerHTML = data ? `<img src="${data}" alt="Foto del vehículo">` : '<i class="fa-solid fa-camera"></i>';
  }
  window.handleVehiclePhotoChange = function(event){
    const file = event.target.files && event.target.files[0];
    if(!file) return;
    if(!file.type.startsWith('image/')) { safeToast('El archivo debe ser una imagen', 'info'); return; }
    if(file.size > 2.5 * 1024 * 1024) { safeToast('Usa una imagen menor de 2,5 MB para que se guarde correctamente', 'info'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const data = String(reader.result || '');
      const hidden = document.getElementById('vehiclePhotoData');
      if(hidden) hidden.value = data;
      renderPhotoPreview(data);
    };
    reader.readAsDataURL(file);
  };
  window.clearVehiclePhoto = function(){
    const hidden = document.getElementById('vehiclePhotoData'); if(hidden) hidden.value = '';
    const file = document.getElementById('vehiclePhoto'); if(file) file.value = '';
    renderPhotoPreview('');
  };
  function updateBadge(state){
    const dot = document.getElementById('profileAlertDot');
    const trigger = document.getElementById('profileTrigger');
    if(!dot || !trigger) return;
    const count = state.vehicles.reduce((acc,v)=>acc + getAlerts(state, v).filter(a=>a.level !== 'success').length, 0);
    trigger.classList.toggle('has-alerts', count > 0);
    dot.textContent = count > 9 ? '9+' : String(count);
  }
  function daysUntil(value){ const d = value ? new Date(value + 'T00:00:00') : null; if(!d || Number.isNaN(d.getTime())) return null; const n = new Date(); const today = new Date(n.getFullYear(), n.getMonth(), n.getDate()); return Math.ceil((d - today) / 86400000); }
  function lastMileage(state, vehicleId, terms){
    const list = repairsFor(state, vehicleId);
    const arr = Array.isArray(terms) ? terms : [terms];
    const found = list.find(r => arr.some(t => String(r.category + ' ' + r.title).toLowerCase().includes(String(t).toLowerCase())));
    return found ? Number(found.mileage || 0) : 0;
  }
  function getAlerts(state, vehicle){
    const alerts = [];
    const km = Number(vehicle.mileage || 0);
    const itv = daysUntil(vehicle.itvDate);
    if(itv !== null && itv < 0) alerts.push({level:'danger', title:'ITV caducada', text:`Venció hace ${Math.abs(itv)} días.`, meta:vehicle.plate});
    else if(itv !== null && itv <= 30) alerts.push({level:'danger', title:'ITV próxima', text:`Quedan ${itv} días para la ITV.`, meta:vehicle.plate});
    else if(itv !== null && itv <= 60) alerts.push({level:'warning', title:'Preparar ITV', text:`La ITV caduca en ${itv} días.`, meta:vehicle.plate});
    const oil = lastMileage(state, vehicle.id, 'aceite');
    if(oil && km - oil >= Number(vehicle.oilInterval || 15000)) alerts.push({level:'danger', title:'Aceite vencido', text:'Corresponde cambio de aceite y filtro.', meta:vehicle.plate});
    if(!alerts.length) alerts.push({level:'success', title:'Sin avisos urgentes', text:'Mantén actualizado el kilometraje.', meta:vehicle.plate});
    return alerts;
  }
  function renderGarageEnhanced(state){
    const list = document.getElementById('profileGarageList');
    if(!list) return;
    if(!state.vehicles.length){ list.innerHTML = '<div class="profile-empty"><i class="fa-solid fa-car-side"></i>Aún no hay vehículos guardados. Crea el primero para activar el historial y las alertas.</div>'; return; }
    const selected = selectedVehicle(state);
    list.innerHTML = state.vehicles.map(v => {
      const active = selected && selected.id === v.id;
      const count = getAlerts(state, v).filter(a=>a.level !== 'success').length;
      return `<div class="garage-item ${active ? 'active' : ''}"><div class="garage-item-with-photo">
        <div class="garage-photo">${v.photoData ? `<img src="${v.photoData}" alt="${escapeHtml(v.brand)} ${escapeHtml(v.model)}">` : '<i class="fa-solid fa-car-side"></i>'}</div>
        <div>
          <div class="garage-title">${escapeHtml(v.brand)} ${escapeHtml(v.model)}</div>
          <div class="garage-meta"><span>${escapeHtml(v.plate)}</span><span>${Number(v.mileage || 0).toLocaleString('es-ES')} km</span><span>ITV: ${escapeHtml(v.itvDate || 'sin fecha')}</span><span>${count} avisos</span></div>
          ${v.notes ? `<p class="profile-hint">${escapeHtml(v.notes)}</p>` : ''}
          <div class="profile-actions">
            <button class="profile-btn primary" type="button" onclick="selectProfileVehicle('${v.id}')"><i class="fa-solid fa-check"></i> Seleccionar</button>
            <button class="profile-btn" type="button" onclick="editProfileVehicle('${v.id}')"><i class="fa-solid fa-pen"></i> Editar</button>
            <button class="profile-btn danger" type="button" onclick="deleteProfileVehicle('${v.id}')"><i class="fa-solid fa-trash"></i> Eliminar</button>
          </div>
        </div>
      </div></div>`;
    }).join('');
  }
  function fillRepairVehicleSelectEnhanced(state){
    const select = document.getElementById('repairVehicleId');
    if(!select) return;
    if(!state.vehicles.length){ select.innerHTML = '<option value="">Crea primero un vehículo</option>'; return; }
    const selectedId = state.selectedVehicleId || selectedVehicle(state)?.id || '';
    select.innerHTML = state.vehicles.map(v => `<option value="${v.id}" ${v.id === selectedId ? 'selected' : ''}>${escapeHtml(v.brand)} ${escapeHtml(v.model)} · ${escapeHtml(v.plate)}</option>`).join('');
  }
  function renderRepairsEnhanced(state){
    const list = document.getElementById('profileRepairList');
    if(!list) return;
    const selected = selectedVehicle(state);
    const repairs = selected ? repairsFor(state, selected.id) : [];
    if(!selected){ list.innerHTML = '<div class="profile-empty"><i class="fa-solid fa-clipboard-list"></i>Crea un vehículo para empezar a registrar reparaciones.</div>'; return; }
    if(!repairs.length){ list.innerHTML = '<div class="profile-empty"><i class="fa-solid fa-screwdriver-wrench"></i>No hay reparaciones registradas para el vehículo seleccionado.</div>'; return; }
    list.innerHTML = repairs.map(r => {
      const tools = Array.isArray(r.guideTools) ? r.guideTools : [];
      const parts = Array.isArray(r.guideParts) ? r.guideParts : [];
      return `<div class="repair-item">
        <div class="repair-title">${escapeHtml(r.title)}</div>
        <div class="repair-meta"><span>${escapeHtml(r.category)}</span><span>${escapeHtml(r.date)}</span><span>${Number(r.mileage || 0).toLocaleString('es-ES')} km</span><span>${money(r.cost)}</span></div>
        ${r.notes ? `<p class="profile-hint">${escapeHtml(r.notes)}</p>` : ''}
        ${r.guideId ? `<div class="repair-associated-guide"><div class="repair-plan-kicker">Guía asociada al vehículo</div><div class="repair-plan-title">${escapeHtml(r.guideTitle || 'Guía relacionada')}</div>${tools.length ? `<div class="repair-chip-row">${tools.slice(0,8).map(t=>`<span class="repair-chip"><i class="fa-solid fa-screwdriver-wrench"></i>${escapeHtml(t)}</span>`).join('')}</div>` : ''}${parts.length ? `<div class="repair-chip-row">${parts.slice(0,8).map(t=>`<span class="repair-chip"><i class="fa-solid fa-box-open"></i>${escapeHtml(t)}</span>`).join('')}</div>` : ''}<button class="repair-guide-link" type="button" onclick="openAssociatedGuide('${r.guideId}')"><i class="fa-solid fa-book-open"></i> Ver guía guardada</button></div>` : ''}
        <div class="profile-actions"><button class="profile-btn danger" type="button" onclick="deleteRepairLog('${r.id}')"><i class="fa-solid fa-trash"></i> Eliminar</button></div>
      </div>`;
    }).join('');
  }
  function renderPanel(){
    const state = loadState();
    renderGarageEnhanced(state);
    fillRepairVehicleSelectEnhanced(state);
    renderRepairsEnhanced(state);
    updateBadge(state);
    window.updateRepairPlanSuggestion();
  }
  const originalOpen = window.openProfilePanel;
  window.openProfilePanel = function(){ if(typeof originalOpen === 'function') originalOpen(); setTimeout(renderPanel, 40); };
  const originalSwitch = window.switchProfileTab;
  window.switchProfileTab = function(tab){ if(typeof originalSwitch === 'function') originalSwitch(tab); setTimeout(renderPanel, 40); };
  window.saveVehicleProfile = function(event){
    event.preventDefault();
    const state = loadState();
    const id = document.getElementById('vehicleEditId')?.value || uid('veh');
    const previous = state.vehicles.find(v => v.id === id) || {};
    const vehicle = {
      ...previous,
      id,
      brand: document.getElementById('vehicleBrand')?.value.trim() || '',
      model: document.getElementById('vehicleModel')?.value.trim() || '',
      plate: normalizePlate(document.getElementById('vehiclePlate')?.value || ''),
      year: document.getElementById('vehicleYear')?.value || '',
      mileage: Number(document.getElementById('vehicleMileage')?.value || 0),
      itvDate: document.getElementById('vehicleItvDate')?.value || '',
      oilInterval: Number(document.getElementById('vehicleOilInterval')?.value || 15000),
      generalInterval: Number(document.getElementById('vehicleGeneralInterval')?.value || 30000),
      notes: document.getElementById('vehicleNotes')?.value.trim() || '',
      photoData: document.getElementById('vehiclePhotoData')?.value || previous.photoData || '',
      updatedAt: new Date().toISOString()
    };
    const index = state.vehicles.findIndex(v => v.id === id);
    if(index >= 0) state.vehicles[index] = vehicle; else state.vehicles.push(vehicle);
    state.selectedVehicleId = id;
    saveState(state);
    window.resetVehicleForm();
    renderPanel();
    safeToast('Vehículo guardado en tu garaje', 'success');
  };
  window.resetVehicleForm = function(){
    const form = document.getElementById('profileVehicleForm'); if(form) form.reset();
    const edit = document.getElementById('vehicleEditId'); if(edit) edit.value = '';
    const photo = document.getElementById('vehiclePhotoData'); if(photo) photo.value = '';
    const oil = document.getElementById('vehicleOilInterval'); if(oil) oil.value = 15000;
    const gen = document.getElementById('vehicleGeneralInterval'); if(gen) gen.value = 30000;
    renderPhotoPreview('');
  };
  window.editProfileVehicle = function(id){
    const state = loadState(); const v = state.vehicles.find(item => item.id === id); if(!v) return;
    if(typeof window.switchProfileTab === 'function') window.switchProfileTab('vehiculos');
    setTimeout(() => {
      const set = (field, value) => { const el = document.getElementById(field); if(el) el.value = value || ''; };
      set('vehicleEditId', v.id); set('vehicleBrand', v.brand); set('vehicleModel', v.model); set('vehiclePlate', v.plate); set('vehicleYear', v.year); set('vehicleMileage', v.mileage); set('vehicleItvDate', v.itvDate); set('vehicleOilInterval', v.oilInterval || 15000); set('vehicleGeneralInterval', v.generalInterval || 30000); set('vehicleNotes', v.notes); set('vehiclePhotoData', v.photoData || ''); renderPhotoPreview(v.photoData || '');
    }, 60);
  };
  window.selectProfileVehicle = function(id){ const state = loadState(); state.selectedVehicleId = id; saveState(state); renderPanel(); safeToast('Vehículo seleccionado', 'info'); };
  window.deleteProfileVehicle = function(id){
    const state = loadState(); const v = state.vehicles.find(item => item.id === id); if(!v) return;
    if(!confirm(`¿Eliminar ${v.brand} ${v.model} y sus reparaciones asociadas?`)) return;
    state.vehicles = state.vehicles.filter(item => item.id !== id); state.repairs = state.repairs.filter(r => r.vehicleId !== id); if(state.selectedVehicleId === id) state.selectedVehicleId = state.vehicles[0]?.id || ''; saveState(state); renderPanel();
  };
  window.saveRepairLog = function(event){
    event.preventDefault();
    const state = loadState();
    const vehicleId = document.getElementById('repairVehicleId')?.value;
    if(!vehicleId){ safeToast('Crea primero un vehículo', 'info'); return; }
    const planQuery = document.getElementById('repairPlanQuery')?.value.trim() || '';
    const suggestedGuide = suggestGuide(planQuery || document.getElementById('repairTitle')?.value || '', document.getElementById('repairCategory')?.value || '');
    const tools = suggestedGuide ? guideTools(suggestedGuide) : [];
    const parts = suggestedGuide ? guideParts(suggestedGuide) : [];
    const repair = {
      id: uid('rep'), vehicleId,
      date: document.getElementById('repairDate')?.value || todayISO(),
      mileage: Number(document.getElementById('repairMileage')?.value || 0),
      category: document.getElementById('repairCategory')?.value || 'Otra reparación',
      title: document.getElementById('repairTitle')?.value.trim() || planQuery || 'Reparación registrada',
      cost: Number(document.getElementById('repairCost')?.value || 0),
      notes: document.getElementById('repairNotes')?.value.trim() || '',
      planQuery,
      guideId: suggestedGuide?.id || '',
      guideTitle: suggestedGuide?.title || '',
      guideTools: tools,
      guideParts: parts,
      createdAt: new Date().toISOString()
    };
    state.repairs.push(repair);
    const v = state.vehicles.find(item => item.id === vehicleId); if(v && repair.mileage > Number(v.mileage || 0)) v.mileage = repair.mileage;
    state.selectedVehicleId = vehicleId;
    saveState(state);
    const form = document.getElementById('profileRepairForm'); if(form) form.reset();
    const date = document.getElementById('repairDate'); if(date) date.value = todayISO();
    const result = document.getElementById('repairPlanResult'); if(result) result.innerHTML = '';
    renderPanel();
    safeToast(repair.guideId ? 'Reparación guardada con guía asociada' : 'Reparación añadida al historial', 'success');
  };
  window.deleteRepairLog = function(id){
    if(!confirm('¿Eliminar esta reparación del historial?')) return;
    const state = loadState(); state.repairs = state.repairs.filter(r => r.id !== id); saveState(state); renderPanel();
  };
  document.addEventListener('DOMContentLoaded', () => {
    const category = document.getElementById('repairCategory'); if(category) category.addEventListener('change', window.updateRepairPlanSuggestion);
    const title = document.getElementById('repairTitle'); if(title) title.addEventListener('input', () => { const q = document.getElementById('repairPlanQuery'); if(q && !q.value.trim()) window.updateRepairPlanSuggestion(); });
    renderPanel();
  });
})();
