(function(){
  'use strict';

  const LOCAL_PROFILE_KEY = 'autorepara_user_profile_v1';
  const STORE_VEHICLE_KEY = 'autorepara_store_vehicle_filter_v1';
  const CLOUD_SELECTED_KEY = 'autorepara_cloud_selected_vehicle_v1';

  let savingVehicle = false;
  let syncInFlight = false;

  function client(){
    try { return (typeof supabaseDb !== 'undefined' && supabaseDb) ? supabaseDb : null; }
    catch(e){ return null; }
  }
  function esc(value){
    return String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }
  function toast(message, type='info'){
    try {
      if (typeof showToast === 'function') {
        if (showToast.length >= 3) showToast(type, type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info', message);
        else showToast(message, type);
      }
    } catch(e) {}
  }
  function setStatus(message, type='info'){
    const status = document.getElementById('profileAuthStatus');
    if (!status) return;
    const icon = type === 'success' ? 'fa-cloud-check' : type === 'error' ? 'fa-triangle-exclamation' : type === 'loading' ? 'fa-circle-notch fa-spin' : 'fa-circle-info';
    status.innerHTML = `<i class="fa-solid ${icon}"></i><span>${esc(message)}</span>`;
  }
  function normalPlate(value){
    return String(value || '').toUpperCase().replace(/\s+/g, ' ').trim();
  }
  function dbVehicleToLocal(v){
    return {
      id: String(v.id),
      brand: v.brand || '',
      model: v.model || '',
      plate: v.plate || '',
      year: v.year || '',
      mileage: Number(v.mileage || 0),
      itvDate: v.itv_expiry || '',
      oilInterval: Number(v.oil_interval || 15000),
      generalInterval: Number(v.general_interval || 30000),
      notes: v.notes || '',
      photoData: v.photo_url || ''
    };
  }
  function dbRepairToLocal(r){
    return {
      id: String(r.id),
      vehicleId: String(r.vehicle_id),
      date: r.repair_date || '',
      mileage: Number(r.mileage || 0),
      category: r.repair_type || '',
      title: r.title || r.repair_type || 'Reparación',
      cost: Number(r.cost || 0),
      notes: r.notes || '',
      guideId: r.guide_id || '',
      guideTitle: r.guide_title || '',
      guideTools: Array.isArray(r.tools) ? r.tools : [],
      guideParts: Array.isArray(r.materials) ? r.materials : []
    };
  }
  function readLocalProfile(){
    try { return JSON.parse(localStorage.getItem(LOCAL_PROFILE_KEY) || '{}') || {}; } catch(e){ return {}; }
  }
  function writeLocalMirror(vehicles, repairs, user){
    const current = readLocalProfile();
    const selected = localStorage.getItem(CLOUD_SELECTED_KEY) || current.selectedVehicleId || vehicles[0]?.id || '';
    const validSelected = vehicles.some(v => String(v.id) === String(selected)) ? selected : (vehicles[0]?.id || '');
    const mirror = {
      ...current,
      owner: { ...(current.owner || {}), email: user?.email || current.owner?.email || '' },
      selectedVehicleId: validSelected,
      vehicles,
      repairs
    };
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(mirror));
    if (validSelected) localStorage.setItem(CLOUD_SELECTED_KEY, validSelected);
    else localStorage.removeItem(CLOUD_SELECTED_KEY);
    cleanStoreVehicleSelection(vehicles);
    window.dispatchEvent(new CustomEvent('autorepara:profile-vehicles-synced', { detail: { vehicles, repairs, selectedVehicleId: validSelected }}));
    return mirror;
  }
  function cleanStoreVehicleSelection(vehicles){
    const value = localStorage.getItem(STORE_VEHICLE_KEY) || 'all';
    if (!value.startsWith('profile:')) return;
    const id = value.split(':')[1];
    const exists = vehicles.some(v => String(v.id) === String(id));
    if (!exists) localStorage.setItem(STORE_VEHICLE_KEY, 'all');
  }
  async function getUser(){
    const c = client();
    if (!c) return null;
    const { data } = await c.auth.getUser();
    return data?.user || null;
  }
  async function syncCloudGarage({ rerenderStore = true } = {}){
    if (syncInFlight) return readLocalProfile();
    const c = client();
    if (!c) return readLocalProfile();
    syncInFlight = true;
    try {
      const user = await getUser();
      if (!user) {
        // When logged out, never let a stale profile selection act as if it were a real garage vehicle.
        const value = localStorage.getItem(STORE_VEHICLE_KEY) || '';
        if (value.startsWith('profile:')) localStorage.setItem(STORE_VEHICLE_KEY, 'all');
        return readLocalProfile();
      }
      const [{ data: vehicleRows, error: vehicleError }, { data: repairRows, error: repairError }] = await Promise.all([
        c.from('user_vehicles').select('*').order('created_at', { ascending: false }),
        c.from('vehicle_repairs').select('*').order('repair_date', { ascending: false })
      ]);
      if (vehicleError) throw vehicleError;
      if (repairError) console.warn('No se pudieron sincronizar reparaciones:', repairError.message || repairError);
      const vehicles = (vehicleRows || []).map(dbVehicleToLocal);
      const repairs = (repairRows || []).map(dbRepairToLocal);
      const mirror = writeLocalMirror(vehicles, repairs, user);
      if (rerenderStore && typeof window.renderStore === 'function' && document.getElementById('section-tienda')?.classList.contains('active')) {
        setTimeout(() => window.renderStore(document.getElementById('store-search')?.value || '', document.getElementById('store-filter')?.value || 'all'), 30);
      }
      return mirror;
    } catch(error){
      console.warn('Profile cloud sync failed:', error);
      setStatus(error.message || 'No se pudo sincronizar el garaje con Supabase.', 'error');
      return readLocalProfile();
    } finally {
      syncInFlight = false;
    }
  }

  async function uploadVehiclePhoto(file, vehicleId){
    const c = client();
    const user = await getUser();
    if (!c || !user || !file) return '';
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const path = `${user.id}/${vehicleId || 'new'}-${Date.now()}.${ext}`;
    const { error } = await c.storage.from('vehicle-photos').upload(path, file, { cacheControl: '3600', upsert: true });
    if (error) {
      toast('No se pudo subir la foto. El vehículo se guardará sin imagen.', 'info');
      return '';
    }
    const { data } = c.storage.from('vehicle-photos').getPublicUrl(path);
    return data?.publicUrl || '';
  }

  async function robustSaveVehicle(event){
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
    }
    if (savingVehicle) return;
    const c = client();
    if (!c) return toast('Supabase no está configurado.', 'error');
    const user = await getUser();
    if (!user) return toast('Inicia sesión para guardar vehículos en tu perfil.', 'info');

    const brand = document.getElementById('vehicleBrand')?.value.trim() || '';
    const model = document.getElementById('vehicleModel')?.value.trim() || '';
    if (!brand || !model) return toast('Marca y modelo son obligatorios.', 'info');

    savingVehicle = true;
    const submitBtn = document.querySelector('#profileVehicleForm button[type="submit"], #profileVehicleForm .profile-btn.primary');
    if (submitBtn) submitBtn.disabled = true;
    setStatus('Guardando vehículo en Supabase...', 'loading');
    try {
      const editId = document.getElementById('vehicleEditId')?.value || '';
      const file = document.getElementById('vehiclePhoto')?.files?.[0] || null;
      const localPhoto = document.getElementById('vehiclePhotoData')?.value || '';
      let photoUrl = localPhoto && !localPhoto.startsWith('data:') ? localPhoto : '';
      if (file) photoUrl = await uploadVehiclePhoto(file, editId || crypto.randomUUID());

      const payload = {
        user_id: user.id,
        brand,
        model,
        plate: normalPlate(document.getElementById('vehiclePlate')?.value || ''),
        year: document.getElementById('vehicleYear')?.value ? Number(document.getElementById('vehicleYear').value) : null,
        mileage: Number(document.getElementById('vehicleMileage')?.value || 0),
        itv_expiry: document.getElementById('vehicleItvDate')?.value || null,
        oil_interval: Number(document.getElementById('vehicleOilInterval')?.value || 15000),
        general_interval: Number(document.getElementById('vehicleGeneralInterval')?.value || 30000),
        notes: document.getElementById('vehicleNotes')?.value.trim() || '',
        photo_url: photoUrl || null,
        updated_at: new Date().toISOString()
      };

      let result;
      if (editId) {
        result = await c.from('user_vehicles').update(payload).eq('id', editId).select('id').single();
      } else {
        result = await c.from('user_vehicles').insert(payload).select('id').single();
      }
      if (result.error) throw result.error;
      const savedId = String(result.data.id);
      localStorage.setItem(CLOUD_SELECTED_KEY, savedId);

      const form = document.getElementById('profileVehicleForm');
      if (form) form.reset();
      const edit = document.getElementById('vehicleEditId'); if (edit) edit.value = '';
      const hidden = document.getElementById('vehiclePhotoData'); if (hidden) hidden.value = '';
      const preview = document.getElementById('vehiclePhotoPreview'); if (preview) preview.innerHTML = '<i class="fa-solid fa-camera"></i>';

      await syncCloudGarage({ rerenderStore: true });
      if (typeof window.reloadCloudProfile === 'function') {
        try { await window.reloadCloudProfile(); } catch(e) {}
      }
      if (typeof window.switchProfileTab === 'function') window.switchProfileTab('vehiculos');
      setStatus('Vehículo guardado correctamente.', 'success');
      toast('Vehículo guardado en tu garaje', 'success');
    } catch(error){
      console.error('Vehicle save failed:', error);
      setStatus(error.message || 'No se pudo guardar el vehículo.', 'error');
      toast(error.message || 'No se pudo guardar el vehículo', 'error');
    } finally {
      savingVehicle = false;
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  // Public helpers used by other shop/profile modules.
  window.syncCloudGarageToLocalProfile = syncCloudGarage;
  window.saveVehicleProfile = robustSaveVehicle;

  // Capture the vehicle form before older localStorage handlers can create ghost vehicles.
  document.addEventListener('submit', function(event){
    if (event.target && event.target.id === 'profileVehicleForm') {
      robustSaveVehicle(event);
    }
  }, true);

  document.addEventListener('click', function(event){
    const btn = event.target.closest('#profileVehicleForm button[type="submit"], #profileVehicleForm .profile-btn.primary');
    if (btn) {
      const form = document.getElementById('profileVehicleForm');
      if (form) {
        event.preventDefault();
        event.stopPropagation();
        if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
        robustSaveVehicle(event);
      }
    }
  }, true);

  // Clean stale profile vehicle selections before rendering the shop.
  const originalRenderStore = window.renderStore;
  if (typeof originalRenderStore === 'function') {
    window.renderStore = function(query, category){
      const state = readLocalProfile();
      cleanStoreVehicleSelection(Array.isArray(state.vehicles) ? state.vehicles : []);
      return originalRenderStore.apply(this, arguments);
    };
  }

  // Keep the local mirror in sync with the authenticated Supabase garage.
  document.addEventListener('DOMContentLoaded', function(){
    setTimeout(() => syncCloudGarage({ rerenderStore: false }), 900);
  });
  window.addEventListener('focus', function(){ syncCloudGarage({ rerenderStore: false }); });
  window.addEventListener('autorepara:profile-opened', function(){ syncCloudGarage({ rerenderStore: true }); });
})();
