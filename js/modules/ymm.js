/**
 * MODULE: ymm.js
 * Year / Make / Model / Engine lookup via NHTSA public API
 * No API key required. Caches responses in sessionStorage.
 */

const YMM = (() => {
  const NHTSA = 'https://vpic.nhtsa.dot.gov/api/vehicles';
  const cache = {};

  const cacheKey = (type, ...args) => `ymm_${type}_${args.join('_')}`;

  async function fetchJSON(url) {
    if (cache[url]) return cache[url];
    const stored = sessionStorage.getItem(url);
    if (stored) { cache[url] = JSON.parse(stored); return cache[url]; }
    const res = await fetch(url);
    const data = await res.json();
    cache[url] = data;
    sessionStorage.setItem(url, JSON.stringify(data));
    return data;
  }

  /** Get all years (1995 → current) */
  function getYears() {
    const currentYear = new Date().getFullYear() + 1;
    const years = [];
    for (let y = currentYear; y >= 1981; y--) years.push(y);
    return years;
  }

  /** Get all makes for a given year */
  async function getMakes(year) {
    const url = `${NHTSA}/GetMakesForVehicleType/passenger%20car?modelyear=${year}&format=json`;
    const data = await fetchJSON(url);
    return (data.Results || [])
      .map(r => ({ id: r.MakeId, name: r.MakeName }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /** Get all models for a given year + make */
  async function getModels(year, makeId) {
    const url = `${NHTSA}/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}/vehicleType/passenger%20car?format=json`;
    const data = await fetchJSON(url);
    return (data.Results || [])
      .map(r => ({ id: r.Model_ID, name: r.Model_Name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /** 
   * Engine/trim data is limited in NHTSA — we use WMI decode 
   * For production: swap with a proper VIN decode or parts API 
   */
  async function getEngines(year, makeId, modelId) {
    // NHTSA doesn't have direct engine lookup by model/year without VIN
    // Return common engine sizes as a practical placeholder
    // In production, replace with your parts supplier's vehicle fitment API
    return [
      { id: 'all', name: 'All Engines' },
      { id: '4cyl', name: '4-Cylinder' },
      { id: '6cyl', name: '6-Cylinder / V6' },
      { id: '8cyl', name: '8-Cylinder / V8' },
    ];
  }

  // ─── State ───────────────────────────────────────────────
  let _state = { year: '', makeId: '', makeName: '', modelId: '', modelName: '', engine: '' };

  function getState() { return { ..._state }; }

  function setState(updates) {
    _state = { ..._state, ...updates };
    localStorage.setItem('selectedVehicle', JSON.stringify(_state));
    _notifyListeners();
  }

  function loadState() {
    try {
      const saved = localStorage.getItem('selectedVehicle');
      if (saved) _state = JSON.parse(saved);
    } catch(e) {}
    return _state;
  }

  function clearVehicle() {
    _state = { year: '', makeId: '', makeName: '', modelId: '', modelName: '', engine: '' };
    localStorage.removeItem('selectedVehicle');
    _notifyListeners();
  }

  function getVehicleLabel() {
    if (!_state.year) return null;
    return `${_state.year} ${_state.makeName} ${_state.modelName}${_state.engine && _state.engine !== 'all' ? ' · ' + _state.engine : ''}`;
  }

  // ─── Listeners ──────────────────────────────────────────
  const _listeners = [];
  function onChange(fn) { _listeners.push(fn); }
  function _notifyListeners() { _listeners.forEach(fn => fn(_state)); }

  // ─── Widget builder ─────────────────────────────────────
  /**
   * Mount a YMM selection widget into a container element
   * @param {HTMLElement} container
   * @param {Function} onComplete  Called with (state) when vehicle is fully selected
   */
  async function mountWidget(container, onComplete) {
    loadState();

    const html = `
      <div class="ymm-loading" id="ymm-status"></div>
      <div class="ymm-selects">
        <div>
          <label class="text-xs text-dim" style="display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.06em">Year</label>
          <select id="ymm-year"><option value="">Select Year</option></select>
        </div>
        <div>
          <label class="text-xs text-dim" style="display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.06em">Make</label>
          <select id="ymm-make" disabled><option value="">Select Make</option></select>
        </div>
        <div>
          <label class="text-xs text-dim" style="display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.06em">Model</label>
          <select id="ymm-model" disabled><option value="">Select Model</option></select>
        </div>
      </div>
      <div class="ymm-selects-row2">
        <div>
          <label class="text-xs text-dim" style="display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.06em">Engine</label>
          <select id="ymm-engine" disabled><option value="">Select Engine</option></select>
        </div>
        <div style="display:flex;align-items:flex-end">
          <button class="btn btn-primary btn-full" id="ymm-submit" disabled>Find Parts →</button>
        </div>
      </div>
    `;
    container.innerHTML = html;

    const yearSel   = container.querySelector('#ymm-year');
    const makeSel   = container.querySelector('#ymm-make');
    const modelSel  = container.querySelector('#ymm-model');
    const engineSel = container.querySelector('#ymm-engine');
    const submitBtn = container.querySelector('#ymm-submit');
    const status    = container.querySelector('#ymm-status');

    function setStatus(msg) { status.innerHTML = msg ? `<span class="spinner" style="width:14px;height:14px"></span> ${msg}` : ''; }
    function populateSelect(sel, items, valueKey, labelKey, placeholder) {
      sel.innerHTML = `<option value="">${placeholder}</option>`;
      items.forEach(item => {
        const o = document.createElement('option');
        o.value = item[valueKey]; o.textContent = item[labelKey];
        sel.appendChild(o);
      });
      sel.disabled = false;
    }

    // Populate years
    getYears().forEach(y => {
      const o = document.createElement('option'); o.value = y; o.textContent = y; yearSel.appendChild(o);
    });

    // Restore state
    if (_state.year) {
      yearSel.value = _state.year;
      yearSel.dispatchEvent(new Event('change'));
    }

    yearSel.addEventListener('change', async () => {
      setState({ year: yearSel.value, makeId: '', makeName: '', modelId: '', modelName: '', engine: '' });
      makeSel.innerHTML = '<option value="">Loading makes...</option>'; makeSel.disabled = true;
      modelSel.innerHTML = '<option value="">Select Model</option>'; modelSel.disabled = true;
      engineSel.innerHTML = '<option value="">Select Engine</option>'; engineSel.disabled = true;
      submitBtn.disabled = true;
      if (!yearSel.value) return;
      setStatus('Loading makes...');
      try {
        const makes = await getMakes(yearSel.value);
        populateSelect(makeSel, makes, 'id', 'name', 'Select Make');
        if (_state.makeId) { makeSel.value = _state.makeId; makeSel.dispatchEvent(new Event('change')); }
      } catch(e) { makeSel.innerHTML = '<option value="">Error loading makes</option>'; }
      setStatus('');
    });

    makeSel.addEventListener('change', async () => {
      const opt = makeSel.options[makeSel.selectedIndex];
      setState({ makeId: makeSel.value, makeName: opt?.text || '', modelId: '', modelName: '', engine: '' });
      modelSel.innerHTML = '<option value="">Loading models...</option>'; modelSel.disabled = true;
      engineSel.innerHTML = '<option value="">Select Engine</option>'; engineSel.disabled = true;
      submitBtn.disabled = true;
      if (!makeSel.value) return;
      setStatus('Loading models...');
      try {
        const models = await getModels(yearSel.value, makeSel.value);
        populateSelect(modelSel, models, 'id', 'name', 'Select Model');
        if (_state.modelId) { modelSel.value = _state.modelId; modelSel.dispatchEvent(new Event('change')); }
      } catch(e) { modelSel.innerHTML = '<option value="">Error loading models</option>'; }
      setStatus('');
    });

    modelSel.addEventListener('change', async () => {
      const opt = modelSel.options[modelSel.selectedIndex];
      setState({ modelId: modelSel.value, modelName: opt?.text || '', engine: '' });
      engineSel.innerHTML = '<option value="">Loading engines...</option>'; engineSel.disabled = true;
      submitBtn.disabled = true;
      if (!modelSel.value) return;
      setStatus('Loading engines...');
      try {
        const engines = await getEngines(yearSel.value, makeSel.value, modelSel.value);
        populateSelect(engineSel, engines, 'id', 'name', 'Select Engine');
        if (_state.engine) { engineSel.value = _state.engine; engineSel.dispatchEvent(new Event('change')); }
      } catch(e) { engineSel.innerHTML = '<option value="">Error</option>'; }
      setStatus('');
    });

    engineSel.addEventListener('change', () => {
      setState({ engine: engineSel.value });
      submitBtn.disabled = !engineSel.value;
    });

    submitBtn.addEventListener('click', () => {
      if (onComplete) onComplete(getState());
    });
  }

  return { getYears, getMakes, getModels, getEngines, getState, setState, loadState, clearVehicle, getVehicleLabel, onChange, mountWidget };
})();

window.YMM = YMM;
