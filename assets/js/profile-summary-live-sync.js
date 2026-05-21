(function(){
  const PROFILE_KEY = 'autorepara_user_profile_v1';

  function readProfileState(){
    try {
      const state = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
      return {
        owner: state.owner || {},
        selectedVehicleId: state.selectedVehicleId || '',
        vehicles: Array.isArray(state.vehicles) ? state.vehicles : [],
        repairs: Array.isArray(state.repairs) ? state.repairs : []
      };
    } catch(e){
      return { owner:{}, selectedVehicleId:'', vehicles:[], repairs:[] };
    }
  }

  function parseDate(value){
    if(!value) return null;
    const date = new Date(value + 'T00:00:00');
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function daysUntil(value){
    const date = parseDate(value);
    if(!date) return null;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.ceil((date - today) / 86400000);
  }

  function normalize(value){
    return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function selectedVehicle(state){
    return state.vehicles.find(v => String(v.id) === String(state.selectedVehicleId)) || state.vehicles[0] || null;
  }

  function vehicleRepairs(state, vehicleId){
    return state.repairs
      .filter(repair => String(repair.vehicleId) === String(vehicleId))
      .sort((a,b) => String(b.date || '').localeCompare(String(a.date || '')) || Number(b.mileage || 0) - Number(a.mileage || 0));
  }

  function lastRepairMileage(state, vehicleId, terms){
    const searchTerms = Array.isArray(terms) ? terms : [terms];
    const repairs = vehicleRepairs(state, vehicleId);
    const match = repairs.find(repair => {
      const text = normalize(`${repair.category || ''} ${repair.title || ''} ${repair.planQuery || ''} ${repair.notes || ''}`);
      return searchTerms.some(term => text.includes(normalize(term)));
    });
    return match ? Number(match.mileage || 0) : 0;
  }

  function vehicleAlerts(state, vehicle){
    if(!vehicle) return [];
    const alerts = [];
    const mileage = Number(vehicle.mileage || 0);
    const itvDays = daysUntil(vehicle.itvDate);

    if(itvDays !== null){
      if(itvDays < 0) alerts.push({ level:'danger', title:'ITV caducada' });
      else if(itvDays <= 30) alerts.push({ level:'danger', title:'ITV próxima' });
      else if(itvDays <= 60) alerts.push({ level:'warning', title:'Preparar ITV' });
    }

    const oilInterval = Number(vehicle.oilInterval || 15000);
    const lastOil = lastRepairMileage(state, vehicle.id, ['aceite', 'filtro aceite']);
    if(lastOil){
      const remaining = (lastOil + oilInterval) - mileage;
      if(remaining <= 0) alerts.push({ level:'danger', title:'Cambio de aceite vencido' });
      else if(remaining <= 1500) alerts.push({ level:'warning', title:'Cambio de aceite próximo' });
    } else if(mileage >= oilInterval){
      alerts.push({ level:'warning', title:'Registrar aceite' });
    }

    const generalInterval = Number(vehicle.generalInterval || 30000);
    const lastGeneral = lastRepairMileage(state, vehicle.id, ['revision general', 'revisión general']);
    if(lastGeneral){
      const remaining = (lastGeneral + generalInterval) - mileage;
      if(remaining <= 0) alerts.push({ level:'warning', title:'Revisión general recomendada' });
      else if(remaining <= 3000) alerts.push({ level:'warning', title:'Revisión general próxima' });
    }

    const lastBrakes = lastRepairMileage(state, vehicle.id, ['frenos', 'pastillas', 'discos']);
    if(lastBrakes && mileage - lastBrakes >= 45000) alerts.push({ level:'warning', title:'Revisar frenos' });

    const lastTyres = lastRepairMileage(state, vehicle.id, ['neumaticos', 'neumáticos', 'ruedas']);
    if(lastTyres && mileage - lastTyres >= 35000) alerts.push({ level:'warning', title:'Revisar neumáticos' });

    return alerts;
  }

  function activeAlertCount(state){
    return state.vehicles.reduce((total, vehicle) => total + vehicleAlerts(state, vehicle).length, 0);
  }

  function updateProfileSummaryStats(){
    const state = readProfileState();
    const selected = selectedVehicle(state);
    const summary = document.getElementById('profileSummaryStats');
    if(summary){
      summary.innerHTML = `
        <div class="profile-stat"><span>Vehículos</span><strong>${state.vehicles.length}</strong></div>
        <div class="profile-stat"><span>Reparaciones</span><strong>${state.repairs.length}</strong></div>
        <div class="profile-stat"><span>Avisos</span><strong>${activeAlertCount(state)}</strong></div>
        <div class="profile-stat"><span>Kilometraje</span><strong>${selected ? Number(selected.mileage || 0).toLocaleString('es-ES') : '—'}</strong></div>`;
    }

    const trigger = document.getElementById('profileTrigger');
    const dot = document.getElementById('profileAlertDot');
    const alerts = activeAlertCount(state);
    if(trigger) trigger.classList.toggle('has-alerts', alerts > 0);
    if(dot) dot.textContent = alerts > 9 ? '9+' : String(alerts);
  }

  function refreshSoon(){
    window.setTimeout(updateProfileSummaryStats, 30);
    window.setTimeout(updateProfileSummaryStats, 160);
  }

  function wrapProfileAction(name){
    const original = window[name];
    if(typeof original !== 'function' || original.__profileSummaryWrapped) return;
    const wrapped = function(...args){
      const result = original.apply(this, args);
      refreshSoon();
      return result;
    };
    wrapped.__profileSummaryWrapped = true;
    window[name] = wrapped;
  }

  const originalSetItem = localStorage.setItem.bind(localStorage);
  localStorage.setItem = function(key, value){
    const result = originalSetItem(key, value);
    if(key === PROFILE_KEY) refreshSoon();
    return result;
  };

  function installWrappers(){
    [
      'openProfilePanel',
      'switchProfileTab',
      'saveOwnerProfile',
      'saveVehicleProfile',
      'selectProfileVehicle',
      'editProfileVehicle',
      'deleteProfileVehicle',
      'saveRepairLog',
      'deleteRepairLog',
      'resetVehicleForm'
    ].forEach(wrapProfileAction);
    updateProfileSummaryStats();
  }

  window.refreshUserProfileSummary = updateProfileSummaryStats;
  document.addEventListener('DOMContentLoaded', () => {
    installWrappers();
    window.setTimeout(installWrappers, 300);
  });
})();
