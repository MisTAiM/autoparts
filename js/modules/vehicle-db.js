/**
 * MODULE: vehicle-db.js
 * Comprehensive vehicle database using:
 *   - NHTSA vPIC API: All makes & models (no key required)
 *   - fueleconomy.gov API: Trim levels, engine sizes, drive types (no key required)
 *   - Fitment matching engine: Cross-reference parts to vehicles
 *
 * Data provided per vehicle:
 *   Year / Make / Model / Trim / Engine (displacement + cylinders) /
 *   Drivetrain (FWD/RWD/AWD/4WD) / Transmission / Fuel Type /
 *   Brake Code hints / Caliper type (from fitment lookup)
 */

const VehicleDB = (() => {

  // ─── API Endpoints ───────────────────────────────────────────
  const NHTSA   = 'https://vpic.nhtsa.dot.gov/api/vehicles';
  const FUELGOV = 'https://www.fueleconomy.gov/ws/rest/vehicle/menu';
  const FUELSPEC = 'https://www.fueleconomy.gov/ws/rest/vehicle';

  // ─── Cache (sessionStorage + in-memory) ─────────────────────
  const _mem = {};
  function _cacheKey(...args) { return 'vdb_' + args.join('_'); }

  async function _fetch(url, parser = 'json') {
    const key = url;
    if (_mem[key]) return _mem[key];
    try {
      const stored = sessionStorage.getItem(key);
      if (stored) { _mem[key] = JSON.parse(stored); return _mem[key]; }
    } catch {}
    try {
      const res  = await fetch(url, { headers: { Accept: parser === 'xml' ? 'application/xml' : 'application/json' } });
      let data;
      if (parser === 'xml') {
        const text = await res.text();
        data = _parseXML(text);
      } else {
        data = await res.json();
      }
      _mem[key] = data;
      try { sessionStorage.setItem(key, JSON.stringify(data)); } catch {}
      return data;
    } catch (e) {
      console.warn('VehicleDB fetch error:', url, e);
      return null;
    }
  }

  /** Parse fueleconomy.gov XML menuItems → [{text, value}] */
  function _parseXML(xml) {
    try {
      const parser = new DOMParser();
      const doc    = parser.parseFromString(xml, 'text/xml');
      const items  = Array.from(doc.querySelectorAll('menuItem'));
      return items.map(el => ({
        text:  el.querySelector('text')?.textContent  || '',
        value: el.querySelector('value')?.textContent || ''
      }));
    } catch { return []; }
  }

  /** Parse fueleconomy.gov vehicle spec XML → object */
  function _parseSpecXML(xml) {
    try {
      const parser = new DOMParser();
      const doc    = parser.parseFromString(xml, 'text/xml');
      const obj    = {};
      Array.from(doc.documentElement.children).forEach(el => {
        if (el.textContent.trim()) obj[el.tagName] = el.textContent.trim();
      });
      return obj;
    } catch { return {}; }
  }

  // ─── Consumer brand filter ────────────────────────────────────
  const CONSUMER_MAKES = new Set([
    'Acura','Alfa Romeo','Audi','BMW','Buick','Cadillac','Chevrolet','Chrysler',
    'Dodge','Fiat','Ford','Genesis','GMC','Honda','Hyundai','Infiniti','Jaguar',
    'Jeep','Kia','Land Rover','Lexus','Lincoln','Lucid','Maserati','Mazda',
    'Mercedes-Benz','Mercury','MINI','Mitsubishi','Nissan','Oldsmobile','Pontiac',
    'Porsche','Ram','Rivian','Rolls-Royce','Saturn','Subaru','Tesla','Toyota',
    'Volkswagen','Volvo','Bentley','Ferrari','Lamborghini','McLaren Automotive'
  ]);

  // ─── Public API ──────────────────────────────────────────────

  /** Get available model years (1981 → next year) */
  function getYears() {
    const next = new Date().getFullYear() + 1;
    const years = [];
    for (let y = next; y >= 1981; y--) years.push(y);
    return years;
  }

  /**
   * Get consumer makes for a given year
   * Uses fueleconomy.gov for best make list (very accurate for consumer vehicles)
   */
  async function getMakes(year) {
    const url  = `${FUELGOV}/make?year=${year}`;
    const data = await _fetch(url, 'xml');
    if (!data || !data.length) {
      // Fallback to NHTSA
      const nhtsaData = await _fetch(`${NHTSA}/GetMakesForVehicleType/passenger%20car?modelyear=${year}&format=json`);
      return (nhtsaData?.Results || [])
        .map(r => ({ id: String(r.MakeId), name: r.MakeName }))
        .filter(m => CONSUMER_MAKES.has(m.name))
        .sort((a, b) => a.name.localeCompare(b.name));
    }
    return data
      .filter(m => m.text && CONSUMER_MAKES.has(m.text))
      .map(m => ({ id: m.value, name: m.text }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get models for year + make
   * fueleconomy.gov groups trims under model names (e.g. "Camry AWD LE/SE")
   * We extract base model names and deduplicate
   */
  async function getModels(year, makeName) {
    const url  = `${FUELGOV}/model?year=${year}&make=${encodeURIComponent(makeName)}`;
    const data = await _fetch(url, 'xml');
    if (!data || !data.length) {
      // Fallback to NHTSA
      const nhtsaData = await _fetch(`${NHTSA}/GetModelsForMakeYear/make/${encodeURIComponent(makeName)}/modelyear/${year}?format=json`);
      return (nhtsaData?.Results || [])
        .map(r => ({ id: r.Model_Name, name: r.Model_Name }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }
    // Extract base model (before AWD/FWD/trim descriptors)
    const baseModels = new Map();
    data.forEach(m => {
      // fueleconomy.gov model string is "Base Model + trim/drivetrain"
      // e.g. "Camry AWD LE/SE", "RAV4 AWD" → base = "Camry", "RAV4"
      const base = m.text.replace(/\s+(AWD|FWD|RWD|4WD|2WD|4x4|4x2|Hybrid|PHEV|EV|FFV|CNG|Diesel).*$/i, '').trim();
      if (!baseModels.has(base)) {
        baseModels.set(base, { id: base, name: base, fullList: [] });
      }
      baseModels.get(base).fullList.push(m.text);
    });
    return Array.from(baseModels.values())
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get trims for year + make + model
   * Returns full trim list from fueleconomy.gov with drivetrain included in name
   */
  async function getTrims(year, makeName, modelName) {
    const url  = `${FUELGOV}/options?year=${year}&make=${encodeURIComponent(makeName)}&model=${encodeURIComponent(modelName)}`;
    const data = await _fetch(url, 'xml');
    if (data && data.length) {
      return data.map(t => ({ id: t.value, name: t.text }));
    }
    // Fallback: broader model search (handles base models we extracted above)
    const allUrl  = `${FUELGOV}/model?year=${year}&make=${encodeURIComponent(makeName)}`;
    const allData = await _fetch(allUrl, 'xml');
    if (allData) {
      const matches = allData.filter(m => m.text.startsWith(modelName));
      const results = [];
      for (const m of matches) {
        const trimUrl = `${FUELGOV}/options?year=${year}&make=${encodeURIComponent(makeName)}&model=${encodeURIComponent(m.text)}`;
        const trimData = await _fetch(trimUrl, 'xml');
        if (trimData) {
          results.push(...trimData.map(t => ({ id: t.value, name: `${m.text} — ${t.text}` })));
        }
      }
      return results.length ? results : [{ id: 'all', name: 'All Trims' }];
    }
    return [{ id: 'all', name: 'All Trims' }];
  }

  /**
   * Get detailed vehicle specs from fueleconomy.gov vehicle ID
   * Returns: { engine, cylinders, displacement, drivetrain, transmission,
   *            fuelType, mpgCity, mpgHwy, horsepower, make, model, year, trim }
   */
  async function getVehicleSpecs(vehicleId) {
    if (!vehicleId || vehicleId === 'all') return null;
    const url  = `${FUELSPEC}/${vehicleId}`;
    const res  = await _fetch(url, 'xml_spec');
    return res;
  }

  // Overloaded _fetch for spec endpoint (returns object not array)
  const _origFetch = _fetch;
  async function _fetchSpec(url) {
    const key = url;
    if (_mem[key]) return _mem[key];
    try {
      const stored = sessionStorage.getItem(key);
      if (stored) { _mem[key] = JSON.parse(stored); return _mem[key]; }
    } catch {}
    try {
      const res  = await fetch(url);
      const text = await res.text();
      const data = _parseSpecXML(text);
      _mem[key] = data;
      try { sessionStorage.setItem(key, JSON.stringify(data)); } catch {}
      return data;
    } catch { return null; }
  }

  /** Full vehicle spec lookup by fueleconomy vehicle ID */
  async function getSpecs(vehicleId) {
    if (!vehicleId || vehicleId === 'all') return null;
    const url  = `${FUELSPEC}/${vehicleId}`;
    const raw  = await _fetchSpec(url);
    if (!raw) return null;

    const drive = raw.drive || '';
    const driveCode = _normalizeDrive(drive);

    return {
      year:         raw.year || '',
      make:         raw.make || '',
      model:        raw.model || '',
      trim:         raw.trany || '',
      engine:       _buildEngineString(raw),
      cylinders:    raw.cylinders || '',
      displacement: raw.displ ? `${raw.displ}L` : '',
      drivetrain:   driveCode,
      driveLabel:   drive,
      transmission: raw.trany || '',
      fuelType:     raw.fuelType1 || raw.fuelType || '',
      mpgCity:      raw.city08 || '',
      mpgHwy:       raw.highway08 || '',
      mpgComb:      raw.comb08 || '',
      vClass:       raw.VClass || '',
    };
  }

  function _buildEngineString(raw) {
    const parts = [];
    if (raw.displ) parts.push(`${raw.displ}L`);
    if (raw.cylinders) {
      const cylNum = parseInt(raw.cylinders);
      const config = raw.eng_dscr || '';
      if (cylNum === 3) parts.push('3-Cyl');
      else if (cylNum === 4) parts.push('I4');
      else if (cylNum === 5) parts.push('I5');
      else if (cylNum === 6) parts.push('V6');
      else if (cylNum === 8) parts.push('V8');
      else if (cylNum === 10) parts.push('V10');
      else if (cylNum === 12) parts.push('V12');
    }
    if (raw.eng_dscr) {
      if (raw.eng_dscr.includes('DOHC')) parts.push('DOHC');
      else if (raw.eng_dscr.includes('SOHC')) parts.push('SOHC');
      if (raw.eng_dscr.includes('Turbo') || raw.eng_dscr.includes('TURBO')) parts.push('Turbo');
      if (raw.eng_dscr.includes('Supercharged')) parts.push('Supercharged');
      if (raw.eng_dscr.includes('Diesel')) parts.push('Diesel');
      if (raw.eng_dscr.includes('Hybrid')) parts.push('Hybrid');
    }
    return parts.join(' ') || 'Unknown Engine';
  }

  function _normalizeDrive(drive) {
    const d = drive.toLowerCase();
    if (d.includes('front')) return 'FWD';
    if (d.includes('rear'))  return 'RWD';
    if (d.includes('all') || d.includes('awd')) return 'AWD';
    if (d.includes('4') && (d.includes('wd') || d.includes('wheel'))) return '4WD';
    if (d.includes('part-time')) return '4WD';
    return drive;
  }

  // ─── Fitment Matching Engine ──────────────────────────────────

  /**
   * Get compatible parts for a vehicle selection
   * @param {Object} vehicle - { year, makeName, modelName, specs }
   * @param {Array}  parts   - SAMPLE_PARTS array
   * @returns {Array} compatible parts with compatibility score
   */
  function getCompatibleParts(vehicle, parts) {
    if (!vehicle || !vehicle.year) return parts;
    const { year, makeName, modelName, specs } = vehicle;
    const yr = parseInt(year);
    const drive = specs?.drivetrain || '';
    const displacement = specs?.displacement || '';

    return parts.map(part => {
      const f = part.fitment;
      if (!f) return { ...part, _compat: 'unknown', _compatScore: 0 };

      let score = 0;
      let issues = [];
      let notes  = [];

      // Year range check
      if (f.yearStart && f.yearEnd) {
        if (yr >= f.yearStart && yr <= f.yearEnd) score += 30;
        else {
          issues.push(`Year ${yr} out of range (${f.yearStart}–${f.yearEnd})`);
          return { ...part, _compat: 'incompatible', _compatScore: -1, _issues: issues };
        }
      }

      // Make check (case-insensitive)
      if (f.makes && f.makes.length) {
        const makeMatch = f.makes.some(m => makeName.toLowerCase().includes(m.toLowerCase()) || m.toLowerCase().includes(makeName.toLowerCase()));
        if (makeMatch) score += 25;
        else {
          issues.push(`Not listed for ${makeName}`);
          return { ...part, _compat: 'incompatible', _compatScore: -1, _issues: issues };
        }
      }

      // Model check
      if (f.models && f.models.length) {
        const modelMatch = f.models.some(m => modelName.toLowerCase().includes(m.toLowerCase()) || m.toLowerCase().includes(modelName.toLowerCase()));
        if (modelMatch) score += 25;
        else {
          issues.push(`Not listed for ${modelName}`);
          return { ...part, _compat: 'incompatible', _compatScore: -1, _issues: issues };
        }
      }

      // Engine check
      if (f.engines && f.engines.length && displacement) {
        const engMatch = f.engines.some(e => displacement.startsWith(e.replace('L', '')));
        if (engMatch) score += 15;
        else notes.push(`Verify fitment for your ${displacement} engine`);
      }

      // Drive type check
      if (f.driveTypes && f.driveTypes.length && drive) {
        const driveMatch = f.driveTypes.includes(drive);
        if (driveMatch) score += 5;
        else notes.push(`Verify fitment for ${drive} drivetrain`);
      }

      const compat = score >= 75 ? 'verified' : score >= 50 ? 'likely' : 'check';
      return { ...part, _compat: compat, _compatScore: score, _issues: issues, _notes: notes };
    }).filter(p => p._compatScore !== -1)
      .sort((a, b) => b._compatScore - a._compatScore);
  }

  /**
   * Check if a specific part fits a vehicle
   * Returns: { fits: bool, confidence: 'verified'|'likely'|'check', notes: [] }
   */
  function checkFitment(part, vehicle) {
    if (!part?.fitment || !vehicle?.year) {
      return { fits: true, confidence: 'unknown', notes: ['No fitment data available. Verify with VIN.'] };
    }

    const results = getCompatibleParts(vehicle, [part]);
    if (!results.length) {
      return { fits: false, confidence: 'verified', notes: part.fitment?.notes ? [part.fitment.notes] : [] };
    }

    const r = results[0];
    return {
      fits:       r._compat !== 'incompatible',
      confidence: r._compat,
      score:      r._compatScore,
      notes:      [...(r._notes || []), part.fitment?.notes].filter(Boolean),
      issues:     r._issues || []
    };
  }

  // ─── Vehicle state management ─────────────────────────────────
  let _state = {};

  function getState()         { return { ..._state }; }
  function clearState()       { _state = {}; localStorage.removeItem('vdb_vehicle'); }
  function saveState(updates) {
    _state = { ..._state, ...updates };
    try { localStorage.setItem('vdb_vehicle', JSON.stringify(_state)); } catch {}
    window.dispatchEvent(new CustomEvent('vehicle:changed', { detail: _state }));
  }
  function loadState() {
    try {
      const s = localStorage.getItem('vdb_vehicle');
      if (s) _state = JSON.parse(s);
    } catch {}
    return _state;
  }

  function getVehicleLabel() {
    if (!_state.year) return null;
    const parts = [_state.year, _state.makeName, _state.modelName].filter(Boolean);
    if (_state.specs?.engine) parts.push(`(${_state.specs.engine})`);
    return parts.join(' ');
  }

  // Legacy YMM compatibility shim
  function getYMM() {
    return {
      year:      _state.year || '',
      makeId:    _state.makeName || '',
      makeName:  _state.makeName || '',
      modelId:   _state.modelName || '',
      modelName: _state.modelName || '',
      engine:    _state.specs?.engine || ''
    };
  }

  // ─── Full Widget ──────────────────────────────────────────────
  async function mountWidget(container, onComplete) {
    loadState();
    container.innerHTML = `
      <div id="vdb-status" style="font-size:.8rem;color:var(--c-text-3);min-height:18px;margin-bottom:6px"></div>
      <div class="ymm-selects">
        <div>
          <label class="text-xs text-dim" style="display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.06em">Year</label>
          <select id="vdb-year"><option value="">Select Year</option></select>
        </div>
        <div>
          <label class="text-xs text-dim" style="display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.06em">Make</label>
          <select id="vdb-make" disabled><option value="">Select Make</option></select>
        </div>
        <div>
          <label class="text-xs text-dim" style="display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.06em">Model</label>
          <select id="vdb-model" disabled><option value="">Select Model</option></select>
        </div>
      </div>
      <div class="ymm-selects-row2">
        <div>
          <label class="text-xs text-dim" style="display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.06em">Trim / Engine</label>
          <select id="vdb-trim" disabled><option value="">Select Trim</option></select>
        </div>
        <div style="display:flex;align-items:flex-end">
          <button class="btn btn-primary btn-full" id="vdb-submit" disabled>
            <i class="fa-solid fa-wrench"></i> Find My Parts
          </button>
        </div>
      </div>
      <div id="vdb-specs" style="display:none;margin-top:12px;padding:12px;background:var(--c-surface-2);border:1px solid var(--c-border);border-radius:var(--radius);font-size:.8rem"></div>`;

    const yearSel  = container.querySelector('#vdb-year');
    const makeSel  = container.querySelector('#vdb-make');
    const modelSel = container.querySelector('#vdb-model');
    const trimSel  = container.querySelector('#vdb-trim');
    const submitBtn= container.querySelector('#vdb-submit');
    const status   = container.querySelector('#vdb-status');
    const specsBox = container.querySelector('#vdb-specs');

    function setStatus(msg) {
      status.innerHTML = msg ? `<span class="spinner" style="width:12px;height:12px;display:inline-block;vertical-align:middle"></span> ${msg}` : '';
    }
    function populate(sel, items, valKey, labelKey, placeholder) {
      sel.innerHTML = `<option value="">${placeholder}</option>`;
      items.forEach(item => {
        const o   = document.createElement('option');
        o.value   = item[valKey];
        o.textContent = item[labelKey];
        sel.appendChild(o);
      });
      sel.disabled = false;
    }

    // Populate years
    getYears().forEach(y => {
      const o = document.createElement('option');
      o.value = y; o.textContent = y;
      yearSel.appendChild(o);
    });

    // Restore saved state
    if (_state.year) {
      yearSel.value = _state.year;
      yearSel.dispatchEvent(new Event('change'));
    }

    yearSel.addEventListener('change', async () => {
      const yr = yearSel.value;
      saveState({ year: yr, makeName: '', modelName: '', trimId: '', specs: null });
      makeSel.innerHTML  = '<option value="">Loading makes…</option>'; makeSel.disabled  = true;
      modelSel.innerHTML = '<option value="">Select Model</option>';    modelSel.disabled = true;
      trimSel.innerHTML  = '<option value="">Select Trim</option>';     trimSel.disabled  = true;
      submitBtn.disabled = true; specsBox.style.display = 'none';
      if (!yr) return;
      setStatus('Loading makes…');
      const makes = await getMakes(yr);
      populate(makeSel, makes, 'id', 'name', 'Select Make');
      if (_state.makeName) {
        const found = makes.find(m => m.name === _state.makeName);
        if (found) { makeSel.value = found.id; makeSel.dispatchEvent(new Event('change')); }
      }
      setStatus('');
    });

    makeSel.addEventListener('change', async () => {
      const opt = makeSel.options[makeSel.selectedIndex];
      const makeName = opt?.text || '';
      saveState({ makeName, modelName: '', trimId: '', specs: null });
      modelSel.innerHTML = '<option value="">Loading models…</option>'; modelSel.disabled = true;
      trimSel.innerHTML  = '<option value="">Select Trim</option>';     trimSel.disabled  = true;
      submitBtn.disabled = true; specsBox.style.display = 'none';
      if (!makeName) return;
      setStatus('Loading models…');
      const models = await getModels(yearSel.value, makeName);
      populate(modelSel, models, 'id', 'name', 'Select Model');
      if (_state.modelName) {
        const found = models.find(m => m.name === _state.modelName);
        if (found) { modelSel.value = found.id; modelSel.dispatchEvent(new Event('change')); }
      }
      setStatus('');
    });

    modelSel.addEventListener('change', async () => {
      const modelName = modelSel.value;
      const opt = modelSel.options[modelSel.selectedIndex];
      saveState({ modelName: opt?.text || modelName, trimId: '', specs: null });
      trimSel.innerHTML = '<option value="">Loading trims…</option>'; trimSel.disabled = true;
      submitBtn.disabled = true; specsBox.style.display = 'none';
      if (!modelName) return;
      setStatus('Loading trims & engines…');
      const makeName = makeSel.options[makeSel.selectedIndex]?.text || '';
      const trims = await getTrims(yearSel.value, makeName, modelName);
      populate(trimSel, trims, 'id', 'name', 'Select Trim / Engine');
      if (_state.trimId) {
        trimSel.value = _state.trimId;
        if (trimSel.value) trimSel.dispatchEvent(new Event('change'));
      }
      setStatus('');
    });

    trimSel.addEventListener('change', async () => {
      const trimId   = trimSel.value;
      const trimName = trimSel.options[trimSel.selectedIndex]?.text || '';
      submitBtn.disabled = !trimId;
      specsBox.style.display = 'none';
      if (!trimId || trimId === 'all') {
        saveState({ trimId, trimName, specs: null });
        return;
      }
      setStatus('Loading vehicle specs…');
      const specs = await getSpecs(trimId);
      saveState({ trimId, trimName, specs });
      if (specs) {
        specsBox.style.display = 'block';
        specsBox.innerHTML = _renderSpecs(specs);
      }
      setStatus('');
      submitBtn.disabled = false;
    });

    submitBtn.addEventListener('click', () => {
      if (onComplete) onComplete(getState());
    });
  }

  function _renderSpecs(s) {
    if (!s) return '';
    const rows = [
      ['Engine',        s.engine],
      ['Displacement',  s.displacement],
      ['Drivetrain',    s.driveLabel || s.drivetrain],
      ['Transmission',  s.transmission],
      ['Fuel',          s.fuelType],
      ['MPG',           s.mpgComb ? `${s.mpgComb} combined (${s.mpgCity} city / ${s.mpgHwy} hwy)` : null],
      ['Class',         s.vClass],
    ].filter(([, v]) => v);

    const badges = [];
    if (s.drivetrain === 'FWD')  badges.push('<span style="background:rgba(59,130,246,.15);color:#3b82f6;border:1px solid rgba(59,130,246,.3);padding:2px 8px;border-radius:999px;font-size:.72rem;font-weight:700">FWD</span>');
    if (s.drivetrain === 'RWD')  badges.push('<span style="background:rgba(239,68,68,.12);color:#ef4444;border:1px solid rgba(239,68,68,.3);padding:2px 8px;border-radius:999px;font-size:.72rem;font-weight:700">RWD</span>');
    if (s.drivetrain === 'AWD')  badges.push('<span style="background:rgba(34,197,94,.12);color:#22c55e;border:1px solid rgba(34,197,94,.3);padding:2px 8px;border-radius:999px;font-size:.72rem;font-weight:700">AWD</span>');
    if (s.drivetrain === '4WD')  badges.push('<span style="background:rgba(245,158,11,.12);color:#f59e0b;border:1px solid rgba(245,158,11,.3);padding:2px 8px;border-radius:999px;font-size:.72rem;font-weight:700">4WD</span>');

    return `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span style="font-weight:700;color:var(--c-accent);font-size:.85rem">
          <i class="fa-solid fa-circle-check" style="margin-right:4px"></i>Vehicle Specs Loaded
        </span>
        <div style="display:flex;gap:4px">${badges.join('')}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px">
        ${rows.map(([k, v]) => `
          <div style="color:var(--c-text-3);font-size:.75rem">${k}</div>
          <div style="font-weight:600;font-size:.78rem">${v}</div>
        `).join('')}
      </div>`;
  }

  return {
    getYears, getMakes, getModels, getTrims, getSpecs,
    getCompatibleParts, checkFitment,
    getState, saveState, loadState, clearState, getVehicleLabel, getYMM,
    mountWidget
  };

})();

window.VehicleDB = VehicleDB;

// Legacy YMM shim — keep existing YMM.js calls working
if (!window.YMM) {
  window.YMM = {
    getYears:     VehicleDB.getYears,
    getMakes:     (year) => VehicleDB.getMakes(year),
    getModels:    (year, makeId) => VehicleDB.getModels(year, makeId),
    getEngines:   async () => [{ id:'all', name:'All Engines' }],
    getState:     () => VehicleDB.getYMM(),
    setState:     (u) => VehicleDB.saveState(u),
    loadState:    VehicleDB.loadState,
    clearVehicle: VehicleDB.clearState,
    getVehicleLabel: VehicleDB.getVehicleLabel,
    onChange:     (fn) => window.addEventListener('vehicle:changed', (e) => fn(e.detail)),
    mountWidget:  VehicleDB.mountWidget
  };
}
