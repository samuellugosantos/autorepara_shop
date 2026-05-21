/* Extracted from index_tienda_popup_recuperado_sin_aceite_extra.html | original script id: profile-garage-script */

(function(){
  const STORAGE_KEY = 'autorepara_user_profile_v1';
  const LAST_NOTIFY_KEY = 'autorepara_profile_last_notify_v1';
  const DEFAULT_PROFILE = { owner: { name: '', email: '', notes: '' }, selectedVehicleId: '', vehicles: [], repairs: [] };
  let profileState = loadProfileState();

  function uid(prefix){ return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,8); }
  function todayISO(){ return new Date().toISOString().slice(0,10); }
  function parseDate(value){ if(!value) return null; const d = new Date(value + 'T00:00:00'); return Number.isNaN(d.getTime()) ? null : d; }
  function daysUntil(value){ const d = parseDate(value); if(!d) return null; const now = new Date(); const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); return Math.ceil((d - today) / 86400000); }
  function money(value){ const n = Number(value || 0); return n ? n.toLocaleString('es-ES',{style:'currency',currency:'EUR'}) : '—'; }
  function escapeProfileHtml(value){ return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function normalizePlate(value){ return String(value || '').toUpperCase().replace(/\s+/g,' ').trim(); }

  function loadProfileState(){
    try {
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
  function saveProfileState(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profileState));
    updateProfileBadge();
  }
  function selectedVehicle(){
    return profileState.vehicles.find(v => v.id === profileState.selectedVehicleId) || profileState.vehicles[0] || null;
  }
  function repairsFor(vehicleId){
    return profileState.repairs.filter(r => r.vehicleId === vehicleId).sort((a,b) => String(b.date).localeCompare(String(a.date)) || Number(b.mileage||0)-Number(a.mileage||0));
  }
  function lastRepairMileage(vehicleId, categoryIncludes){
    const terms = Array.isArray(categoryIncludes) ? categoryIncludes : [categoryIncludes];
    const match = repairsFor(vehicleId).find(r => terms.some(t => String(r.category || '').toLowerCase().includes(String(t).toLowerCase())));
    return match ? Number(match.mileage || 0) : 0;
  }
  function getVehicleAlerts(vehicle){
    if(!vehicle) return [];
    const alerts = [];
    const km = Number(vehicle.mileage || 0);
    const itvDays = daysUntil(vehicle.itvDate);
    if(itvDays !== null){
      if(itvDays < 0) alerts.push({level:'danger', title:'ITV caducada', text:`La ITV de ${vehicle.brand} ${vehicle.model} venció hace ${Math.abs(itvDays)} días. Conviene resolverlo antes de circular.`, meta:`${vehicle.plate} · ${vehicle.itvDate}`});
      else if(itvDays <= 30) alerts.push({level:'danger', title:'ITV próxima a caducar', text:`Quedan ${itvDays} días para la caducidad de la ITV. Reserva cita y revisa luces, neumáticos, frenos, emisiones y niveles.`, meta:`${vehicle.plate} · ${vehicle.itvDate}`});
      else if(itvDays <= 60) alerts.push({level:'warning', title:'Preparar ITV', text:`La ITV caduca en ${itvDays} días. Es buen momento para revisar fallos visibles, diagnosis OBD y desgaste de neumáticos.`, meta:`${vehicle.plate} · ${vehicle.itvDate}`});
    }
    const oilInterval = Number(vehicle.oilInterval || 15000);
    const lastOil = lastRepairMileage(vehicle.id, 'aceite');
    if(lastOil){
      const nextOil = lastOil + oilInterval;
      const remaining = nextOil - km;
      if(remaining <= 0) alerts.push({level:'danger', title:'Cambio de aceite vencido', text:`El último cambio registrado fue a ${lastOil.toLocaleString('es-ES')} km. Ya corresponde cambiar aceite y filtro.`, meta:`${vehicle.plate} · próximo: ${nextOil.toLocaleString('es-ES')} km`});
      else if(remaining <= 1500) alerts.push({level:'warning', title:'Cambio de aceite próximo', text:`Faltan aproximadamente ${remaining.toLocaleString('es-ES')} km para el cambio de aceite y filtro.`, meta:`${vehicle.plate} · próximo: ${nextOil.toLocaleString('es-ES')} km`});
    } else if(km >= oilInterval) {
      alerts.push({level:'warning', title:'Registrar mantenimiento de aceite', text:'No hay cambio de aceite registrado. Añade el último mantenimiento para calcular avisos precisos.', meta:`${vehicle.plate} · ${km.toLocaleString('es-ES')} km`});
    }
    const generalInterval = Number(vehicle.generalInterval || 30000);
    const lastGeneral = lastRepairMileage(vehicle.id, ['revisión general','revision general']);
    if(lastGeneral){
      const nextGeneral = lastGeneral + generalInterval;
      const remaining = nextGeneral - km;
      if(remaining <= 0) alerts.push({level:'warning', title:'Revisión general recomendada', text:'Por kilometraje, conviene revisar frenos, suspensión, neumáticos, fugas, batería, luces, filtros y diagnosis.', meta:`${vehicle.plate} · objetivo: ${nextGeneral.toLocaleString('es-ES')} km`});
      else if(remaining <= 3000) alerts.push({level:'warning', title:'Revisión general próxima', text:`Faltan aproximadamente ${remaining.toLocaleString('es-ES')} km para la próxima revisión general.`, meta:`${vehicle.plate} · objetivo: ${nextGeneral.toLocaleString('es-ES')} km`});
    }
    const lastBrakes = lastRepairMileage(vehicle.id, 'frenos');
    if(lastBrakes && km - lastBrakes >= 45000) alerts.push({level:'warning', title:'Revisar sistema de frenos', text:'Han pasado bastantes kilómetros desde la última intervención de frenos. Revisa pastillas, discos, líquido y tacto del pedal.', meta:`${vehicle.plate} · desde ${lastBrakes.toLocaleString('es-ES')} km`});
    const lastTyres = lastRepairMileage(vehicle.id, ['neumáticos','neumaticos']);
    if(lastTyres && km - lastTyres >= 35000) alerts.push({level:'warning', title:'Revisar neumáticos', text:'Comprueba profundidad de dibujo, desgaste irregular, fecha DOT, presiones y alineación.', meta:`${vehicle.plate} · desde ${lastTyres.toLocaleString('es-ES')} km`});
    if(!alerts.length) alerts.push({level:'success', title:'Sin avisos urgentes', text:'No hay mantenimientos críticos pendientes según la información guardada. Mantén el kilometraje actualizado para recibir avisos útiles.', meta:`${vehicle.plate} · ${km.toLocaleString('es-ES')} km`});
    return alerts;
  }
  function allAlerts(){ return profileState.vehicles.flatMap(v => getVehicleAlerts(v).filter(a => a.level !== 'success').map(a => ({...a, vehicleId:v.id}))); }

  function fillOwnerForm(){
    const owner = profileState.owner || {};
    const set = (id, value) => { const el = document.getElementById(id); if(el) el.value = value || ''; };
    set('profileOwnerName', owner.name);
    set('profileOwnerEmail', owner.email);
    set('profileOwnerNotes', owner.notes);
  }
  function updateSummary(){
    const repairs = profileState.repairs.length;
    const vehicles = profileState.vehicles.length;
    const activeAlerts = allAlerts().length;
    const selected = selectedVehicle();
    const summary = document.getElementById('profileSummaryStats');
    if(summary){
      summary.innerHTML = `
        <div class="profile-stat"><span>Vehículos</span><strong>${vehicles}</strong></div>
        <div class="profile-stat"><span>Reparaciones</span><strong>${repairs}</strong></div>
        <div class="profile-stat"><span>Avisos</span><strong>${activeAlerts}</strong></div>
        <div class="profile-stat"><span>Kilometraje</span><strong>${selected ? Number(selected.mileage || 0).toLocaleString('es-ES') : '—'}</strong></div>`;
    }
  }
  function renderGarage(){
    const list = document.getElementById('profileGarageList');
    if(!list) return;
    if(!profileState.vehicles.length){
      list.innerHTML = '<div class="profile-empty"><i class="fa-solid fa-car-side"></i>Aún no hay vehículos guardados. Crea el primero para activar el historial y las alertas.</div>';
      return;
    }
    list.innerHTML = profileState.vehicles.map(v => {
      const isActive = v.id === (profileState.selectedVehicleId || selectedVehicle()?.id);
      const alertCount = getVehicleAlerts(v).filter(a => a.level !== 'success').length;
      return `<div class="garage-item ${isActive ? 'active' : ''}">
        <div class="garage-title">${escapeProfileHtml(v.brand)} ${escapeProfileHtml(v.model)}</div>
        <div class="garage-meta"><span>${escapeProfileHtml(v.plate)}</span><span>${Number(v.mileage || 0).toLocaleString('es-ES')} km</span><span>ITV: ${escapeProfileHtml(v.itvDate || 'sin fecha')}</span><span>${alertCount} avisos</span></div>
        ${v.notes ? `<p class="profile-hint">${escapeProfileHtml(v.notes)}</p>` : ''}
        <div class="profile-actions">
          <button class="profile-btn primary" type="button" onclick="selectProfileVehicle('${v.id}')"><i class="fa-solid fa-check"></i> Seleccionar</button>
          <button class="profile-btn" type="button" onclick="editProfileVehicle('${v.id}')"><i class="fa-solid fa-pen"></i> Editar</button>
          <button class="profile-btn danger" type="button" onclick="deleteProfileVehicle('${v.id}')"><i class="fa-solid fa-trash"></i> Eliminar</button>
        </div>
      </div>`;
    }).join('');
  }
  function fillRepairVehicleSelect(){
    const select = document.getElementById('repairVehicleId');
    if(!select) return;
    if(!profileState.vehicles.length){ select.innerHTML = '<option value="">Crea primero un vehículo</option>'; return; }
    const selectedId = profileState.selectedVehicleId || selectedVehicle()?.id || '';
    select.innerHTML = profileState.vehicles.map(v => `<option value="${v.id}" ${v.id === selectedId ? 'selected' : ''}>${escapeProfileHtml(v.brand)} ${escapeProfileHtml(v.model)} · ${escapeProfileHtml(v.plate)}</option>`).join('');
  }
  function renderRepairs(){
    const list = document.getElementById('profileRepairList');
    if(!list) return;
    const selected = selectedVehicle();
    const repairs = selected ? repairsFor(selected.id) : [];
    if(!selected){ list.innerHTML = '<div class="profile-empty"><i class="fa-solid fa-clipboard-list"></i>Crea un vehículo para empezar a registrar reparaciones.</div>'; return; }
    if(!repairs.length){ list.innerHTML = '<div class="profile-empty"><i class="fa-solid fa-screwdriver-wrench"></i>No hay reparaciones registradas para el vehículo seleccionado.</div>'; return; }
    list.innerHTML = repairs.map(r => `<div class="repair-item">
      <div class="repair-title">${escapeProfileHtml(r.title)}</div>
      <div class="repair-meta"><span>${escapeProfileHtml(r.category)}</span><span>${escapeProfileHtml(r.date)}</span><span>${Number(r.mileage || 0).toLocaleString('es-ES')} km</span><span>${money(r.cost)}</span></div>
      ${r.notes ? `<p class="profile-hint">${escapeProfileHtml(r.notes)}</p>` : ''}
      <div class="profile-actions"><button class="profile-btn danger" type="button" onclick="deleteRepairLog('${r.id}')"><i class="fa-solid fa-trash"></i> Eliminar</button></div>
    </div>`).join('');
  }
  function alertMarkup(alert){
    return `<div class="vehicle-alert-item ${escapeProfileHtml(alert.level)}">
      <div class="vehicle-alert-title">${escapeProfileHtml(alert.title)}</div>
      <div class="vehicle-alert-meta"><span>${escapeProfileHtml(alert.meta || '')}</span></div>
      <p class="profile-hint">${escapeProfileHtml(alert.text)}</p>
    </div>`;
  }
  function renderAlerts(){
    const selected = selectedVehicle();
    const quick = document.getElementById('profileQuickAlerts');
    const full = document.getElementById('profileAlertsList');
    if(!selected){
      const empty = '<div class="profile-empty"><i class="fa-solid fa-bell"></i>Añade un vehículo para generar alertas por ITV, kilometraje y mantenimiento.</div>';
      if(quick) quick.innerHTML = empty;
      if(full) full.innerHTML = empty;
      return;
    }
    const selectedAlerts = getVehicleAlerts(selected);
    if(quick) quick.innerHTML = selectedAlerts.slice(0,3).map(alertMarkup).join('');
    if(full){
      full.innerHTML = profileState.vehicles.map(v => {
        const alerts = getVehicleAlerts(v);
        return `<div style="margin-bottom:18px"><div class="profile-card-title" style="font-size:18px;margin-bottom:10px"><span>${escapeProfileHtml(v.brand)} ${escapeProfileHtml(v.model)} · ${escapeProfileHtml(v.plate)}</span></div>${alerts.map(alertMarkup).join('')}</div>`;
      }).join('');
    }
  }
  function updateProfileBadge(){
    const alerts = allAlerts().length;
    const btn = document.getElementById('profileTrigger');
    const dot = document.getElementById('profileAlertDot');
    if(btn) btn.classList.toggle('has-alerts', alerts > 0);
    if(dot) dot.textContent = alerts > 9 ? '9+' : String(alerts);
  }
  function renderProfilePanel(){
    fillOwnerForm();
    updateSummary();
    renderGarage();
    fillRepairVehicleSelect();
    renderRepairs();
    renderAlerts();
    updateProfileBadge();
  }

  window.openProfilePanel = function(){
    const overlay = document.getElementById('profileOverlay');
    if(!overlay) return;
    renderProfilePanel();
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden','false');
  };
  window.closeProfilePanel = function(){
    const overlay = document.getElementById('profileOverlay');
    if(!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden','true');
  };
  window.switchProfileTab = function(tab){
    document.querySelectorAll('.profile-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.profileTab === tab));
    document.querySelectorAll('.profile-panel').forEach(panel => panel.classList.toggle('active', panel.id === 'profile-panel-' + tab));
    renderProfilePanel();
  };
  window.saveOwnerProfile = function(event){
    event.preventDefault();
    profileState.owner = {
      name: document.getElementById('profileOwnerName')?.value.trim() || '',
      email: document.getElementById('profileOwnerEmail')?.value.trim() || '',
      notes: document.getElementById('profileOwnerNotes')?.value.trim() || ''
    };
    saveProfileState();
    renderProfilePanel();
    if(typeof showToast === 'function') showToast('Perfil guardado correctamente', 'success');
  };
  window.saveVehicleProfile = function(event){
    event.preventDefault();
    const id = document.getElementById('vehicleEditId')?.value || uid('veh');
    const vehicle = {
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
      updatedAt: new Date().toISOString()
    };
    const index = profileState.vehicles.findIndex(v => v.id === id);
    if(index >= 0) profileState.vehicles[index] = vehicle; else profileState.vehicles.push(vehicle);
    profileState.selectedVehicleId = id;
    saveProfileState();
    resetVehicleForm();
    renderProfilePanel();
    window.switchProfileTab('vehiculos');
    if(typeof showToast === 'function') showToast('Vehículo guardado en tu garaje', 'success');
  };
  window.resetVehicleForm = function(){
    const form = document.getElementById('profileVehicleForm');
    if(form) form.reset();
    const edit = document.getElementById('vehicleEditId'); if(edit) edit.value = '';
    const oil = document.getElementById('vehicleOilInterval'); if(oil) oil.value = 15000;
    const gen = document.getElementById('vehicleGeneralInterval'); if(gen) gen.value = 30000;
  };
  window.editProfileVehicle = function(id){
    const v = profileState.vehicles.find(item => item.id === id);
    if(!v) return;
    window.switchProfileTab('vehiculos');
    const set = (field, value) => { const el = document.getElementById(field); if(el) el.value = value || ''; };
    set('vehicleEditId', v.id);
    set('vehicleBrand', v.brand);
    set('vehicleModel', v.model);
    set('vehiclePlate', v.plate);
    set('vehicleYear', v.year);
    set('vehicleMileage', v.mileage);
    set('vehicleItvDate', v.itvDate);
    set('vehicleOilInterval', v.oilInterval || 15000);
    set('vehicleGeneralInterval', v.generalInterval || 30000);
    set('vehicleNotes', v.notes);
  };
  window.selectProfileVehicle = function(id){
    profileState.selectedVehicleId = id;
    saveProfileState();
    renderProfilePanel();
    if(typeof showToast === 'function') showToast('Vehículo seleccionado', 'info');
  };
  window.deleteProfileVehicle = function(id){
    const vehicle = profileState.vehicles.find(v => v.id === id);
    if(!vehicle) return;
    if(!confirm(`¿Eliminar ${vehicle.brand} ${vehicle.model} y sus reparaciones asociadas?`)) return;
    profileState.vehicles = profileState.vehicles.filter(v => v.id !== id);
    profileState.repairs = profileState.repairs.filter(r => r.vehicleId !== id);
    if(profileState.selectedVehicleId === id) profileState.selectedVehicleId = profileState.vehicles[0]?.id || '';
    saveProfileState();
    renderProfilePanel();
  };
  window.saveRepairLog = function(event){
    event.preventDefault();
    const vehicleId = document.getElementById('repairVehicleId')?.value;
    if(!vehicleId){ if(typeof showToast === 'function') showToast('Crea primero un vehículo', 'info'); return; }
    const repair = {
      id: uid('rep'),
      vehicleId,
      date: document.getElementById('repairDate')?.value || todayISO(),
      mileage: Number(document.getElementById('repairMileage')?.value || 0),
      category: document.getElementById('repairCategory')?.value || 'Otra reparación',
      title: document.getElementById('repairTitle')?.value.trim() || 'Reparación registrada',
      cost: Number(document.getElementById('repairCost')?.value || 0),
      notes: document.getElementById('repairNotes')?.value.trim() || '',
      createdAt: new Date().toISOString()
    };
    profileState.repairs.push(repair);
    const v = profileState.vehicles.find(item => item.id === vehicleId);
    if(v && repair.mileage > Number(v.mileage || 0)) v.mileage = repair.mileage;
    profileState.selectedVehicleId = vehicleId;
    saveProfileState();
    const form = document.getElementById('profileRepairForm'); if(form) form.reset();
    const date = document.getElementById('repairDate'); if(date) date.value = todayISO();
    renderProfilePanel();
    if(typeof showToast === 'function') showToast('Reparación añadida al historial', 'success');
  };
  window.deleteRepairLog = function(id){
    if(!confirm('¿Eliminar esta reparación del historial?')) return;
    profileState.repairs = profileState.repairs.filter(r => r.id !== id);
    saveProfileState();
    renderProfilePanel();
  };
  window.requestProfileNotifications = async function(){
    if(!('Notification' in window)) { if(typeof showToast === 'function') showToast('Tu navegador no soporta notificaciones', 'info'); return; }
    const permission = await Notification.requestPermission();
    if(permission === 'granted') {
      new Notification('AutoRepara', { body: 'Recordatorios activados para este navegador.' });
      if(typeof showToast === 'function') showToast('Recordatorios activados', 'success');
    } else if(typeof showToast === 'function') showToast('Permiso de notificaciones no concedido', 'info');
  };
  function maybeNotifyAlerts(){
    if(!('Notification' in window) || Notification.permission !== 'granted') return;
    const alerts = allAlerts();
    if(!alerts.length) return;
    const today = todayISO();
    if(localStorage.getItem(LAST_NOTIFY_KEY) === today) return;
    const first = alerts[0];
    new Notification('AutoRepara · Aviso de mantenimiento', { body: `${first.title}: ${first.text}` });
    localStorage.setItem(LAST_NOTIFY_KEY, today);
  }
  document.addEventListener('keydown', e => { if(e.key === 'Escape') window.closeProfilePanel(); });
  document.addEventListener('click', e => { const overlay = document.getElementById('profileOverlay'); if(e.target === overlay) window.closeProfilePanel(); });
  document.addEventListener('DOMContentLoaded', () => {
    const date = document.getElementById('repairDate'); if(date && !date.value) date.value = todayISO();
    updateProfileBadge();
    maybeNotifyAlerts();
  });
})();
