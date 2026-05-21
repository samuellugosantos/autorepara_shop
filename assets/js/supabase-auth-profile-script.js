/* Extracted from index_tienda_popup_recuperado_sin_aceite_extra.html | original script id: supabase-auth-profile-script */

(function(){
  const LOCAL_PROFILE_KEY = 'autorepara_user_profile_v1';
  const SELECTED_VEHICLE_KEY = 'autorepara_cloud_selected_vehicle_v1';
  const VEHICLE_PHOTO_BUCKET = 'vehicle-photos';
  let authClient = null;
  let authReady = false;
  let currentUser = null;
  let cloudState = { owner: { name:'', email:'', notes:'' }, selectedVehicleId:'', vehicles: [], repairs: [] };
  let pendingVehiclePhotoFile = null;

  function getClient(){
    if(authClient) return authClient;
    try {
      if(typeof supabaseDb !== 'undefined' && supabaseDb) authClient = supabaseDb;
      else if(typeof window.supabase !== 'undefined' && typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_ANON_KEY !== 'undefined') authClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch(e){ authClient = null; }
    return authClient;
  }
  function escapeHtml(value){ return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function normalizePlate(value){ return String(value || '').toUpperCase().replace(/\s+/g,' ').trim(); }
  function todayISO(){ return new Date().toISOString().slice(0,10); }
  function money(value){ const n = Number(value || 0); return n ? n.toLocaleString('es-ES',{style:'currency',currency:'EUR'}) : '—'; }
  function parseDate(value){ if(!value) return null; const d = new Date(value + 'T00:00:00'); return Number.isNaN(d.getTime()) ? null : d; }
  function daysUntil(value){ const d = parseDate(value); if(!d) return null; const now = new Date(); const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); return Math.ceil((d - today) / 86400000); }
  function safeToast(message, type='info'){
    try {
      if(typeof showToast === 'function') {
        if(showToast.length >= 3) showToast(type === 'success' ? 'success' : 'info', type === 'success' ? 'fa-check-circle' : 'fa-circle-info', message);
        else showToast(message, type);
      }
    } catch(e) {}
  }
  function blankState(){ return { owner: { name:'', email: currentUser?.email || '', notes:'' }, selectedVehicleId: localStorage.getItem(SELECTED_VEHICLE_KEY) || '', vehicles: [], repairs: [] }; }

  function injectAuthUi(){
    if(document.getElementById('profileAuthBox')) return;
    const modal = document.querySelector('#profileOverlay .profile-modal');
    const tabs = document.querySelector('#profileOverlay .profile-tabs');
    if(!modal || !tabs) return;
    const box = document.createElement('div');
    box.id = 'profileAuthBox';
    box.className = 'profile-auth-box';
    box.innerHTML = `
      <div class="profile-auth-status" id="profileAuthStatus"></div>
      <form id="profileAuthForm" class="profile-auth-form" onsubmit="event.preventDefault(); loginProfileUser();">
        <input id="profileAuthEmail" type="email" autocomplete="email" placeholder="Email" required>
        <input id="profileAuthPassword" type="password" autocomplete="current-password" placeholder="Contraseña" required>
        <button type="submit" class="profile-btn primary"><i class="fa-solid fa-right-to-bracket"></i> Entrar</button>
        <button type="button" class="profile-btn" onclick="registerProfileUser()"><i class="fa-solid fa-user-plus"></i> Crear cuenta</button>
      </form>
      <div class="profile-auth-actions" id="profileAuthActions" style="display:none">
        <button type="button" class="profile-btn" onclick="importLocalProfileToSupabase()"><i class="fa-solid fa-cloud-arrow-up"></i> Importar datos locales</button>
        <button type="button" class="profile-btn" onclick="reloadCloudProfile()"><i class="fa-solid fa-rotate"></i> Sincronizar</button>
        <button type="button" class="profile-btn danger" onclick="logoutProfileUser()"><i class="fa-solid fa-arrow-right-from-bracket"></i> Cerrar sesión</button>
      </div>
    `;
    modal.insertBefore(box, tabs);
  }

  function renderAuthUi(){
    injectAuthUi();
    const status = document.getElementById('profileAuthStatus');
    const form = document.getElementById('profileAuthForm');
    const actions = document.getElementById('profileAuthActions');
    if(!status || !form || !actions) return;
    if(!getClient()) {
      status.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i><span>Supabase no está configurado. El perfil en la nube no está disponible.</span>';
      form.style.display = 'none';
      actions.style.display = 'none';
      return;
    }
    if(currentUser){
      status.innerHTML = `<i class="fa-solid fa-cloud-check"></i><span>Perfil sincronizado como <strong>${escapeHtml(currentUser.email || '')}</strong>. Los vehículos y reparaciones se guardan en Supabase y se recuperan desde cualquier dispositivo.</span>`;
      form.style.display = 'none';
      actions.style.display = 'flex';
    } else {
      status.innerHTML = '<i class="fa-solid fa-user-lock"></i><span>Inicia sesión o crea una cuenta para guardar tus vehículos, fotos, reparaciones, ITV y recordatorios por usuario. Sin sesión, no se guardará en la nube.</span>';
      form.style.display = 'grid';
      actions.style.display = 'none';
    }
  }

  async function initAuth(){
    const client = getClient();
    injectAuthUi();
    if(!client){ renderAuthUi(); return; }
    if(authReady) return;
    authReady = true;
    const { data } = await client.auth.getSession();
    currentUser = data?.session?.user || null;
    client.auth.onAuthStateChange(async (_event, session) => {
      currentUser = session?.user || null;
      await reloadCloudProfile();
    });
    await reloadCloudProfile();
  }

  window.loginProfileUser = async function(){
    const client = getClient(); if(!client) return safeToast('Supabase no está configurado', 'info');
    const email = document.getElementById('profileAuthEmail')?.value.trim();
    const password = document.getElementById('profileAuthPassword')?.value;
    if(!email || !password) return safeToast('Introduce email y contraseña', 'info');
    const { error } = await client.auth.signInWithPassword({ email, password });
    if(error) return safeToast(error.message || 'No se pudo iniciar sesión', 'info');
    safeToast('Sesión iniciada', 'success');
  };
  window.registerProfileUser = async function(){
    const client = getClient(); if(!client) return safeToast('Supabase no está configurado', 'info');
    const email = document.getElementById('profileAuthEmail')?.value.trim();
    const password = document.getElementById('profileAuthPassword')?.value;
    if(!email || !password || password.length < 6) return safeToast('Usa un email válido y una contraseña de al menos 6 caracteres', 'info');
    const { error } = await client.auth.signUp({ email, password });
    if(error) return safeToast(error.message || 'No se pudo crear la cuenta', 'info');
    safeToast('Cuenta creada. Revisa el email si Supabase solicita confirmación.', 'success');
  };
  window.logoutProfileUser = async function(){
    const client = getClient(); if(!client) return;
    await client.auth.signOut();
    currentUser = null; cloudState = blankState(); renderCloudProfile(); renderAuthUi(); safeToast('Sesión cerrada', 'info');
  };

  async function reloadCloudProfile(){
    const client = getClient();
    renderAuthUi();
    if(!client || !currentUser){ cloudState = blankState(); renderCloudProfile(); return; }
    const ownerMeta = currentUser.user_metadata || {};
    const { data: vehicles, error: vehicleError } = await client
      .from('user_vehicles')
      .select('*')
      .order('created_at', { ascending:false });
    if(vehicleError){
      safeToast('No se pudieron cargar los vehículos. Revisa las tablas user_vehicles y las políticas RLS.', 'info');
      cloudState = blankState(); renderCloudProfile(); return;
    }
    const { data: repairs, error: repairError } = await client
      .from('vehicle_repairs')
      .select('*')
      .order('repair_date', { ascending:false });
    if(repairError) safeToast('No se pudo cargar el historial de reparaciones.', 'info');
    cloudState = {
      owner: { name: ownerMeta.name || '', email: currentUser.email || '', notes: ownerMeta.notes || '' },
      selectedVehicleId: localStorage.getItem(SELECTED_VEHICLE_KEY) || vehicles?.[0]?.id || '',
      vehicles: (vehicles || []).map(dbVehicleToLocal),
      repairs: (repairs || []).map(dbRepairToLocal)
    };
    if(cloudState.selectedVehicleId && !cloudState.vehicles.some(v => v.id === cloudState.selectedVehicleId)) cloudState.selectedVehicleId = cloudState.vehicles[0]?.id || '';
    renderCloudProfile();
    renderAuthUi();
  }
  window.reloadCloudProfile = reloadCloudProfile;

  function dbVehicleToLocal(v){
    return {
      id: v.id,
      brand: v.brand || '',
      model: v.model || '',
      plate: v.plate || '',
      year: v.year || '',
      mileage: Number(v.mileage || 0),
      itvDate: v.itv_expiry || '',
      oilInterval: Number(v.oil_interval || 15000),
      generalInterval: Number(v.general_interval || 30000),
      notes: v.notes || '',
      photoData: v.photo_url || '',
      updatedAt: v.updated_at || v.created_at || ''
    };
  }
  function dbRepairToLocal(r){
    return {
      id: r.id,
      vehicleId: r.vehicle_id,
      date: r.repair_date || todayISO(),
      mileage: Number(r.mileage || 0),
      category: r.repair_type || '',
      title: r.title || r.repair_type || '',
      cost: Number(r.cost || 0),
      notes: r.notes || '',
      guideId: r.guide_id || '',
      guideTitle: r.guide_title || '',
      guideTools: Array.isArray(r.tools) ? r.tools : [],
      guideParts: Array.isArray(r.materials) ? r.materials : []
    };
  }
  function selectedVehicle(){ return cloudState.vehicles.find(v => v.id === cloudState.selectedVehicleId) || cloudState.vehicles[0] || null; }
  function repairsFor(vehicleId){ return cloudState.repairs.filter(r => r.vehicleId === vehicleId).sort((a,b) => String(b.date).localeCompare(String(a.date)) || Number(b.mileage||0)-Number(a.mileage||0)); }
  function lastRepairMileage(vehicleId, terms){
    const arr = Array.isArray(terms) ? terms : [terms];
    const match = repairsFor(vehicleId).find(r => arr.some(t => String(r.category || '').toLowerCase().includes(String(t).toLowerCase()) || String(r.title || '').toLowerCase().includes(String(t).toLowerCase())));
    return match ? Number(match.mileage || 0) : 0;
  }
  function getVehicleAlerts(vehicle){
    if(!vehicle) return [];
    const alerts = [];
    const km = Number(vehicle.mileage || 0);
    const itvDays = daysUntil(vehicle.itvDate);
    if(itvDays !== null){
      if(itvDays < 0) alerts.push({level:'danger', title:'ITV caducada', text:`La ITV venció hace ${Math.abs(itvDays)} días.`, meta:`${vehicle.plate} · ${vehicle.itvDate}`});
      else if(itvDays <= 30) alerts.push({level:'danger', title:'ITV próxima a caducar', text:`Quedan ${itvDays} días para la ITV. Revisa luces, neumáticos, frenos, emisiones y niveles.`, meta:`${vehicle.plate} · ${vehicle.itvDate}`});
      else if(itvDays <= 60) alerts.push({level:'warning', title:'Preparar ITV', text:`La ITV caduca en ${itvDays} días.`, meta:`${vehicle.plate} · ${vehicle.itvDate}`});
    }
    const oilInterval = Number(vehicle.oilInterval || 15000);
    const lastOil = lastRepairMileage(vehicle.id, 'aceite');
    if(lastOil){
      const nextOil = lastOil + oilInterval;
      const remaining = nextOil - km;
      if(remaining <= 0) alerts.push({level:'danger', title:'Cambio de aceite vencido', text:'Ya corresponde cambiar aceite y filtro.', meta:`Próximo: ${nextOil.toLocaleString('es-ES')} km`});
      else if(remaining <= 1500) alerts.push({level:'warning', title:'Cambio de aceite próximo', text:`Faltan ${remaining.toLocaleString('es-ES')} km aproximadamente.`, meta:`Próximo: ${nextOil.toLocaleString('es-ES')} km`});
    } else if(km >= oilInterval) alerts.push({level:'warning', title:'Registrar mantenimiento de aceite', text:'No hay cambio de aceite registrado para calcular avisos precisos.', meta:`${km.toLocaleString('es-ES')} km`});
    const lastBrakes = lastRepairMileage(vehicle.id, 'frenos');
    if(lastBrakes && km - lastBrakes >= 45000) alerts.push({level:'warning', title:'Revisar frenos', text:'Han pasado bastantes kilómetros desde la última intervención de frenos.', meta:`Desde ${lastBrakes.toLocaleString('es-ES')} km`});
    const lastTyres = lastRepairMileage(vehicle.id, ['neumáticos','neumaticos']);
    if(lastTyres && km - lastTyres >= 35000) alerts.push({level:'warning', title:'Revisar neumáticos', text:'Comprueba dibujo, desgaste irregular, fecha DOT y presiones.', meta:`Desde ${lastTyres.toLocaleString('es-ES')} km`});
    if(!alerts.length) alerts.push({level:'success', title:'Sin avisos urgentes', text:'Mantén actualizado el kilometraje y el historial para recibir avisos útiles.', meta: vehicle.plate || ''});
    return alerts;
  }

  function renderCloudProfile(){
    renderOwnerForm();
    renderSummary();
    renderGarage();
    fillRepairVehicleSelect();
    renderRepairs();
    renderAlerts();
    updateProfileBadge();
    try { if(typeof window.updateRepairPlanSuggestion === 'function') window.updateRepairPlanSuggestion(); } catch(e) {}
  }
  function renderOwnerForm(){
    const set = (id, value) => { const el = document.getElementById(id); if(el && document.activeElement !== el) el.value = value || ''; };
    set('profileOwnerName', cloudState.owner.name);
    set('profileOwnerEmail', cloudState.owner.email);
    set('profileOwnerNotes', cloudState.owner.notes);
  }
  function renderSummary(){
    const el = document.getElementById('profileSummaryStats'); if(!el) return;
    const selected = selectedVehicle();
    const activeAlerts = cloudState.vehicles.flatMap(v => getVehicleAlerts(v).filter(a => a.level !== 'success')).length;
    const totalKm = cloudState.vehicles.reduce((sum,v)=>sum+Number(v.mileage || 0),0);
    el.innerHTML = `
      <div class="profile-summary-card"><span>Vehículos</span><strong>${cloudState.vehicles.length}</strong></div>
      <div class="profile-summary-card"><span>Reparaciones</span><strong>${cloudState.repairs.length}</strong></div>
      <div class="profile-summary-card"><span>Avisos</span><strong>${activeAlerts}</strong></div>
      <div class="profile-summary-card"><span>Kilometraje total</span><strong>${totalKm.toLocaleString('es-ES')}</strong></div>
      <div class="profile-summary-card"><span>Seleccionado</span><strong>${selected ? escapeHtml(selected.plate || selected.model) : '—'}</strong></div>`;
  }
  function renderGarage(){
    const list = document.getElementById('profileGarageList'); if(!list) return;
    if(!currentUser){ list.innerHTML = '<div class="profile-empty"><i class="fa-solid fa-user-lock"></i>Inicia sesión para ver y guardar tu garaje en Supabase.</div>'; return; }
    if(!cloudState.vehicles.length){ list.innerHTML = '<div class="profile-empty"><i class="fa-solid fa-car-side"></i>Aún no hay vehículos guardados. Crea el primero para activar historial, ITV y alertas.</div>'; return; }
    list.innerHTML = cloudState.vehicles.map(v => {
      const active = selectedVehicle()?.id === v.id;
      const warningCount = getVehicleAlerts(v).filter(a => a.level !== 'success').length;
      return `<div class="garage-item ${active ? 'active' : ''}">
        <div class="garage-item-with-photo">
          <div class="garage-photo">${v.photoData ? `<img src="${escapeHtml(v.photoData)}" alt="${escapeHtml(v.brand)} ${escapeHtml(v.model)}">` : '<i class="fa-solid fa-car-side"></i>'}</div>
          <div>
            <div class="garage-title">${escapeHtml(v.brand)} ${escapeHtml(v.model)}</div>
            <div class="garage-meta"><span>${escapeHtml(v.plate || 'Sin matrícula')}</span><span>${Number(v.mileage || 0).toLocaleString('es-ES')} km</span><span>ITV: ${escapeHtml(v.itvDate || 'sin fecha')}</span><span>${warningCount} avisos</span></div>
            ${v.notes ? `<p class="profile-hint">${escapeHtml(v.notes)}</p>` : ''}
            <div class="profile-actions">
              <button class="profile-btn primary" type="button" onclick="selectProfileVehicle('${v.id}')"><i class="fa-solid fa-check"></i> Seleccionar</button>
              <button class="profile-btn" type="button" onclick="editProfileVehicle('${v.id}')"><i class="fa-solid fa-pen"></i> Editar</button>
              <button class="profile-btn danger" type="button" onclick="deleteProfileVehicle('${v.id}')"><i class="fa-solid fa-trash"></i> Eliminar</button>
            </div>
          </div>
        </div>
      </div>`;
    }).join('');
  }
  function fillRepairVehicleSelect(){
    const select = document.getElementById('repairVehicleId'); if(!select) return;
    if(!cloudState.vehicles.length){ select.innerHTML = '<option value="">Crea primero un vehículo</option>'; return; }
    const selectedId = selectedVehicle()?.id || '';
    select.innerHTML = cloudState.vehicles.map(v => `<option value="${v.id}" ${v.id === selectedId ? 'selected' : ''}>${escapeHtml(v.brand)} ${escapeHtml(v.model)} · ${escapeHtml(v.plate || 'sin matrícula')}</option>`).join('');
  }
  function renderRepairs(){
    const list = document.getElementById('profileRepairList'); if(!list) return;
    if(!currentUser){ list.innerHTML = '<div class="profile-empty"><i class="fa-solid fa-user-lock"></i>Inicia sesión para guardar reparaciones asociadas a tu cuenta.</div>'; return; }
    const vehicle = selectedVehicle();
    if(!vehicle){ list.innerHTML = '<div class="profile-empty"><i class="fa-solid fa-clipboard-list"></i>Crea un vehículo para empezar a registrar reparaciones.</div>'; return; }
    const repairs = repairsFor(vehicle.id);
    if(!repairs.length){ list.innerHTML = '<div class="profile-empty"><i class="fa-solid fa-screwdriver-wrench"></i>No hay reparaciones registradas para el vehículo seleccionado.</div>'; return; }
    list.innerHTML = repairs.map(r => {
      const tools = Array.isArray(r.guideTools) ? r.guideTools : [];
      const parts = Array.isArray(r.guideParts) ? r.guideParts : [];
      return `<div class="repair-item">
        <div class="repair-title">${escapeHtml(r.title)}</div>
        <div class="repair-meta"><span>${escapeHtml(r.category)}</span><span>${escapeHtml(r.date)}</span><span>${Number(r.mileage || 0).toLocaleString('es-ES')} km</span><span>${money(r.cost)}</span></div>
        ${r.notes ? `<p class="profile-hint">${escapeHtml(r.notes)}</p>` : ''}
        ${r.guideId ? `<div class="repair-associated-guide"><div class="repair-plan-kicker">Guía asociada al vehículo</div><div class="repair-plan-title">${escapeHtml(r.guideTitle || 'Guía relacionada')}</div>${tools.length ? `<div class="repair-chip-row">${tools.slice(0,8).map(t=>`<span class="repair-chip"><i class="fa-solid fa-screwdriver-wrench"></i>${escapeHtml(t)}</span>`).join('')}</div>` : ''}${parts.length ? `<div class="repair-chip-row">${parts.slice(0,8).map(t=>`<span class="repair-chip"><i class="fa-solid fa-box-open"></i>${escapeHtml(t)}</span>`).join('')}</div>` : ''}<button class="repair-guide-link" type="button" onclick="openAssociatedGuide('${escapeHtml(r.guideId)}')"><i class="fa-solid fa-book-open"></i> Ver guía guardada</button></div>` : ''}
        <div class="profile-actions"><button class="profile-btn danger" type="button" onclick="deleteRepairLog('${r.id}')"><i class="fa-solid fa-trash"></i> Eliminar</button></div>
      </div>`;
    }).join('');
  }
  function renderAlerts(){
    const list = document.getElementById('profileAlertsList'); if(!list) return;
    if(!currentUser){ list.innerHTML = '<div class="profile-empty"><i class="fa-solid fa-user-lock"></i>Inicia sesión para recibir avisos basados en tus vehículos.</div>'; return; }
    const vehicle = selectedVehicle();
    if(!vehicle){ list.innerHTML = '<div class="profile-empty"><i class="fa-solid fa-bell"></i>Crea un vehículo para generar avisos de mantenimiento e ITV.</div>'; return; }
    const alerts = getVehicleAlerts(vehicle);
    list.innerHTML = alerts.map(a => `<div class="vehicle-alert-item ${a.level || 'info'}"><div class="vehicle-alert-title"><i class="fa-solid ${a.level === 'danger' ? 'fa-triangle-exclamation' : a.level === 'success' ? 'fa-circle-check' : 'fa-bell'}"></i> ${escapeHtml(a.title)}</div><div class="vehicle-alert-text">${escapeHtml(a.text)}</div>${a.meta ? `<div class="vehicle-alert-meta">${escapeHtml(a.meta)}</div>` : ''}</div>`).join('');
  }
  function updateProfileBadge(){
    const trigger = document.getElementById('profileTrigger');
    const dot = document.getElementById('profileAlertDot');
    const count = currentUser ? cloudState.vehicles.flatMap(v => getVehicleAlerts(v).filter(a=>a.level !== 'success')).length : 0;
    if(trigger) trigger.classList.toggle('has-alerts', count > 0);
    if(dot){ dot.textContent = count > 9 ? '9+' : String(count); dot.style.display = count > 0 ? 'flex' : 'none'; }
  }

  async function uploadVehiclePhotoIfNeeded(vehicleId){
    if(!pendingVehiclePhotoFile) return document.getElementById('vehiclePhotoData')?.value || '';
    const client = getClient(); if(!client || !currentUser) return '';
    const file = pendingVehiclePhotoFile;
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g,'') || 'jpg';
    const path = `${currentUser.id}/${vehicleId || 'new'}-${Date.now()}.${ext}`;
    const { error } = await client.storage.from(VEHICLE_PHOTO_BUCKET).upload(path, file, { cacheControl:'3600', upsert:true });
    if(error){ safeToast('No se pudo subir la foto. Revisa el bucket vehicle-photos.', 'info'); return document.getElementById('vehiclePhotoData')?.value || ''; }
    const { data } = client.storage.from(VEHICLE_PHOTO_BUCKET).getPublicUrl(path);
    return data?.publicUrl || '';
  }

  window.handleVehiclePhotoChange = function(event){
    const file = event.target.files?.[0];
    pendingVehiclePhotoFile = file || null;
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = String(reader.result || '');
      const hidden = document.getElementById('vehiclePhotoData'); if(hidden) hidden.value = data;
      if(typeof window.renderPhotoPreview === 'function') window.renderPhotoPreview(data);
      else { const prev = document.getElementById('vehiclePhotoPreview'); if(prev) prev.innerHTML = `<img src="${data}" alt="Foto del vehículo">`; }
    };
    reader.readAsDataURL(file);
  };
  window.clearVehiclePhoto = function(){
    pendingVehiclePhotoFile = null;
    const file = document.getElementById('vehiclePhoto'); if(file) file.value = '';
    const hidden = document.getElementById('vehiclePhotoData'); if(hidden) hidden.value = '';
    const prev = document.getElementById('vehiclePhotoPreview'); if(prev) prev.innerHTML = '<i class="fa-solid fa-camera"></i>';
  };

  window.saveOwnerProfile = async function(event){
    event.preventDefault();
    const client = getClient();
    if(!client || !currentUser) return safeToast('Inicia sesión para guardar el perfil en Supabase', 'info');
    const name = document.getElementById('profileOwnerName')?.value.trim() || '';
    const notes = document.getElementById('profileOwnerNotes')?.value.trim() || '';
    const { error } = await client.auth.updateUser({ data: { name, notes } });
    if(error) return safeToast('No se pudo guardar el perfil', 'info');
    cloudState.owner.name = name; cloudState.owner.notes = notes;
    renderCloudProfile(); safeToast('Perfil actualizado', 'success');
  };

  window.saveVehicleProfile = async function(event){
    event.preventDefault();
    const client = getClient();
    if(!client || !currentUser) return safeToast('Inicia sesión para guardar vehículos por usuario', 'info');
    const id = document.getElementById('vehicleEditId')?.value || '';
    const current = id ? cloudState.vehicles.find(v=>v.id === id) : null;
    let photoUrl = document.getElementById('vehiclePhotoData')?.value || current?.photoData || '';
    if(pendingVehiclePhotoFile) photoUrl = await uploadVehiclePhotoIfNeeded(id || crypto.randomUUID());
    const payload = {
      user_id: currentUser.id,
      brand: document.getElementById('vehicleBrand')?.value.trim() || '',
      model: document.getElementById('vehicleModel')?.value.trim() || '',
      plate: normalizePlate(document.getElementById('vehiclePlate')?.value || ''),
      year: Number(document.getElementById('vehicleYear')?.value || null),
      mileage: Number(document.getElementById('vehicleMileage')?.value || 0),
      itv_expiry: document.getElementById('vehicleItvDate')?.value || null,
      oil_interval: Number(document.getElementById('vehicleOilInterval')?.value || 15000),
      general_interval: Number(document.getElementById('vehicleGeneralInterval')?.value || 30000),
      notes: document.getElementById('vehicleNotes')?.value.trim() || '',
      photo_url: photoUrl || null,
      updated_at: new Date().toISOString()
    };
    if(!payload.brand || !payload.model) return safeToast('Marca y modelo son obligatorios', 'info');
    let result;
    if(id) result = await client.from('user_vehicles').update(payload).eq('id', id).select('id').single();
    else result = await client.from('user_vehicles').insert(payload).select('id').single();
    if(result.error) return safeToast(result.error.message || 'No se pudo guardar el vehículo', 'info');
    localStorage.setItem(SELECTED_VEHICLE_KEY, result.data.id);
    pendingVehiclePhotoFile = null;
    if(typeof window.resetVehicleForm === 'function') window.resetVehicleForm();
    await reloadCloudProfile();
    safeToast('Vehículo guardado en Supabase', 'success');
  };
  window.selectProfileVehicle = function(id){ cloudState.selectedVehicleId = id; localStorage.setItem(SELECTED_VEHICLE_KEY, id); renderCloudProfile(); safeToast('Vehículo seleccionado', 'info'); };
  window.editProfileVehicle = function(id){
    const v = cloudState.vehicles.find(item => item.id === id); if(!v) return;
    if(typeof window.switchProfileTab === 'function') window.switchProfileTab('vehiculos');
    setTimeout(() => {
      const set = (field, value) => { const el = document.getElementById(field); if(el) el.value = value ?? ''; };
      set('vehicleEditId', v.id); set('vehicleBrand', v.brand); set('vehicleModel', v.model); set('vehiclePlate', v.plate); set('vehicleYear', v.year); set('vehicleMileage', v.mileage); set('vehicleItvDate', v.itvDate); set('vehicleOilInterval', v.oilInterval || 15000); set('vehicleGeneralInterval', v.generalInterval || 30000); set('vehicleNotes', v.notes); set('vehiclePhotoData', v.photoData || '');
      const prev = document.getElementById('vehiclePhotoPreview'); if(prev) prev.innerHTML = v.photoData ? `<img src="${escapeHtml(v.photoData)}" alt="Foto del vehículo">` : '<i class="fa-solid fa-camera"></i>';
    }, 80);
  };
  window.deleteProfileVehicle = async function(id){
    const client = getClient(); if(!client || !currentUser) return;
    const v = cloudState.vehicles.find(item => item.id === id); if(!v) return;
    if(!confirm(`¿Eliminar ${v.brand} ${v.model} y sus reparaciones asociadas?`)) return;
    const { error } = await client.from('user_vehicles').delete().eq('id', id);
    if(error) return safeToast('No se pudo eliminar el vehículo', 'info');
    if(localStorage.getItem(SELECTED_VEHICLE_KEY) === id) localStorage.removeItem(SELECTED_VEHICLE_KEY);
    await reloadCloudProfile();
  };
  window.saveRepairLog = async function(event){
    event.preventDefault();
    const client = getClient(); if(!client || !currentUser) return safeToast('Inicia sesión para guardar reparaciones por usuario', 'info');
    const vehicleId = document.getElementById('repairVehicleId')?.value;
    if(!vehicleId) return safeToast('Crea primero un vehículo', 'info');
    let suggestedGuide = null;
    try {
      if(typeof window.suggestGuide === 'function') suggestedGuide = window.suggestGuide(document.getElementById('repairPlanQuery')?.value || document.getElementById('repairTitle')?.value || '', document.getElementById('repairCategory')?.value || '');
    } catch(e) {}
    const guideId = document.getElementById('repairGuideId')?.value || suggestedGuide?.id || '';
    const guideTitle = document.getElementById('repairGuideTitle')?.value || suggestedGuide?.title || '';
    const tools = parseJsonHidden('repairGuideTools');
    const materials = parseJsonHidden('repairGuideParts');
    const payload = {
      user_id: currentUser.id,
      vehicle_id: vehicleId,
      repair_date: document.getElementById('repairDate')?.value || todayISO(),
      mileage: Number(document.getElementById('repairMileage')?.value || 0),
      repair_type: document.getElementById('repairCategory')?.value || 'Otra reparación',
      title: document.getElementById('repairTitle')?.value.trim() || document.getElementById('repairPlanQuery')?.value.trim() || 'Reparación registrada',
      cost: Number(document.getElementById('repairCost')?.value || 0),
      notes: document.getElementById('repairNotes')?.value.trim() || '',
      guide_id: guideId || null,
      guide_title: guideTitle || null,
      tools: tools,
      materials: materials
    };
    const { error } = await client.from('vehicle_repairs').insert(payload);
    if(error) return safeToast(error.message || 'No se pudo guardar la reparación', 'info');
    const form = document.getElementById('profileRepairForm'); if(form) form.reset();
    const d = document.getElementById('repairDate'); if(d) d.value = todayISO();
    await reloadCloudProfile();
    safeToast('Reparación guardada y asociada al vehículo', 'success');
  };
  function parseJsonHidden(id){
    const raw = document.getElementById(id)?.value || '[]';
    try { const val = JSON.parse(raw); return Array.isArray(val) ? val : []; } catch(e){ return []; }
  }
  window.deleteRepairLog = async function(id){
    const client = getClient(); if(!client || !currentUser) return;
    if(!confirm('¿Eliminar esta reparación?')) return;
    const { error } = await client.from('vehicle_repairs').delete().eq('id', id);
    if(error) return safeToast('No se pudo eliminar la reparación', 'info');
    await reloadCloudProfile();
  };
  window.importLocalProfileToSupabase = async function(){
    const client = getClient(); if(!client || !currentUser) return safeToast('Inicia sesión primero', 'info');
    let local;
    try { local = JSON.parse(localStorage.getItem(LOCAL_PROFILE_KEY) || 'null'); } catch(e) { local = null; }
    if(!local || !Array.isArray(local.vehicles) || !local.vehicles.length) return safeToast('No hay vehículos locales para importar', 'info');
    const localToCloud = new Map();
    for(const v of local.vehicles){
      const payload = { user_id: currentUser.id, brand: v.brand || '', model: v.model || '', plate: normalizePlate(v.plate), year: Number(v.year || null), mileage: Number(v.mileage || 0), itv_expiry: v.itvDate || null, oil_interval: Number(v.oilInterval || 15000), general_interval: Number(v.generalInterval || 30000), notes: v.notes || '', photo_url: v.photoData || null, updated_at: new Date().toISOString() };
      if(!payload.brand || !payload.model) continue;
      const { data, error } = await client.from('user_vehicles').insert(payload).select('id').single();
      if(!error && data?.id) localToCloud.set(v.id, data.id);
    }
    if(Array.isArray(local.repairs)){
      for(const r of local.repairs){
        const vehicleId = localToCloud.get(r.vehicleId); if(!vehicleId) continue;
        await client.from('vehicle_repairs').insert({ user_id: currentUser.id, vehicle_id: vehicleId, repair_date: r.date || todayISO(), mileage: Number(r.mileage || 0), repair_type: r.category || 'Otra reparación', title: r.title || 'Reparación importada', cost: Number(r.cost || 0), notes: r.notes || '', guide_id: r.guideId || null, guide_title: r.guideTitle || null, tools: Array.isArray(r.guideTools) ? r.guideTools : [], materials: Array.isArray(r.guideParts) ? r.guideParts : [] });
      }
    }
    await reloadCloudProfile();
    safeToast('Datos locales importados a Supabase', 'success');
  };

  const originalOpenProfilePanel = window.openProfilePanel;
  window.openProfilePanel = async function(){
    if(typeof originalOpenProfilePanel === 'function') originalOpenProfilePanel();
    await initAuth();
    renderAuthUi();
    renderCloudProfile();
  };
  const originalSwitchProfileTab = window.switchProfileTab;
  window.switchProfileTab = function(tab){
    if(typeof originalSwitchProfileTab === 'function') originalSwitchProfileTab(tab);
    setTimeout(renderCloudProfile, 40);
  };
  document.addEventListener('DOMContentLoaded', async () => {
    injectAuthUi();
    const help = document.querySelector('.profile-photo-help');
    if(help) help.textContent = 'Sube una foto propia de tu coche. Si has iniciado sesión, se guarda en Supabase Storage y estará disponible desde otros dispositivos.';
    await initAuth();
  });
})();
