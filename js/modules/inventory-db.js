/**
 * MODULE: inventory-db.js
 * Admin inventory management — full CRUD with photo support.
 * 
 * Storage: localStorage (photos stored as base64 data URLs — fine for demo).
 * Production: store photos in S3/Cloudinary, parts in your database.
 *
 * Replaces/augments parts-data.js. When admin adds parts, they appear in storefront.
 */

const InventoryDB = (() => {
  const KEY         = 'ap_inventory';
  const COUNTER_KEY = 'ap_inventory_id';

  function _nextId() {
    const n = parseInt(localStorage.getItem(COUNTER_KEY) || '100') + 1;
    localStorage.setItem(COUNTER_KEY, String(n));
    return n;
  }

  function _getAll() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(e) { return []; }
  }

  function _save(parts) { localStorage.setItem(KEY, JSON.stringify(parts)); }

  // ─── Read ────────────────────────────────────────────────
  function getAll()          { return [..._getAll()]; }
  function getById(id)       { return _getAll().find(p => p.id === parseInt(id)) || null; }
  function getByCategory(cat){ return _getAll().filter(p => p.categoryId === cat); }
  function getRelated(part, limit = 4) {
    if (!part) return [];
    return _getAll()
      .filter(p => p.id !== part.id && (p.categoryId === part.categoryId || p.brand === part.brand))
      .slice(0, limit);
  }

  function search(query) {
    const q = (query || '').toLowerCase();
    return _getAll().filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.partNumber?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.categoryId?.toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }

  function getLowStock(threshold = 5) {
    return _getAll().filter(p => p.stockQty <= threshold && p.stockQty > 0);
  }

  function getOutOfStock() {
    return _getAll().filter(p => p.stockQty === 0);
  }

  // ─── Create ──────────────────────────────────────────────
  /**
   * @param {Object} data - Part fields
   * @param {File|null} photoFile - Optional photo file
   */
  async function addPart(data, photoFile = null) {
    const parts = _getAll();
    let thumbnail = null;
    let images = [];

    if (photoFile) {
      const dataUrl = await _fileToDataUrl(photoFile);
      thumbnail = dataUrl;
      images = [dataUrl];
    }

    const part = {
      id:           _nextId(),
      name:         data.name || '',
      categoryId:   data.categoryId || 'engine',
      categoryName: data.categoryName || '',
      brand:        data.brand || '',
      partNumber:   data.partNumber || '',
      condition:    data.condition || 'new',
      price:        parseFloat(data.price) || 0,
      coreCharge:   parseFloat(data.coreCharge) || 0,
      weight:       parseFloat(data.weight) || 1,
      stockQty:     parseInt(data.stockQty) || 0,
      lowStockThreshold: parseInt(data.lowStockThreshold) || 3,
      inStock:      (parseInt(data.stockQty) || 0) > 0,
      description:  data.description || '',
      specs:        data.specs || {},
      fitment:      data.fitment || [],
      tags:         typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : (data.tags || []),
      warrantyText: data.warrantyText || '',
      thumbnail,
      images,
      createdAt:    new Date().toISOString(),
      updatedAt:    new Date().toISOString(),
    };

    parts.push(part);
    _save(parts);
    return part;
  }

  // ─── Update ──────────────────────────────────────────────
  async function updatePart(id, data, newPhotoFile = null) {
    const parts = _getAll();
    const idx   = parts.findIndex(p => p.id === parseInt(id));
    if (idx === -1) return null;

    if (newPhotoFile) {
      const dataUrl = await _fileToDataUrl(newPhotoFile);
      data.thumbnail = dataUrl;
      data.images    = [dataUrl, ...(parts[idx].images || []).slice(1)];
    }

    if (typeof data.tags === 'string') {
      data.tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (data.price)      data.price      = parseFloat(data.price);
    if (data.coreCharge) data.coreCharge = parseFloat(data.coreCharge);
    if (data.weight)     data.weight     = parseFloat(data.weight);
    if (data.stockQty !== undefined) {
      data.stockQty = parseInt(data.stockQty);
      data.inStock  = data.stockQty > 0;
    }

    parts[idx] = { ...parts[idx], ...data, updatedAt: new Date().toISOString() };
    _save(parts);
    return parts[idx];
  }

  // ─── Delete ──────────────────────────────────────────────
  function deletePart(id) {
    const parts = _getAll();
    const filtered = parts.filter(p => p.id !== parseInt(id));
    _save(filtered);
    return filtered.length < parts.length;
  }

  // ─── Stock adjustment ────────────────────────────────────
  function adjustStock(id, qty) {
    const parts = _getAll();
    const idx   = parts.findIndex(p => p.id === parseInt(id));
    if (idx === -1) return;
    parts[idx].stockQty = Math.max(0, (parts[idx].stockQty || 0) + qty);
    parts[idx].inStock  = parts[idx].stockQty > 0;
    parts[idx].updatedAt = new Date().toISOString();
    _save(parts);
    return parts[idx];
  }

  // ─── Bulk CSV import ─────────────────────────────────────
  /**
   * Parse CSV and bulk-import parts
   * Expected columns: name,brand,partNumber,categoryId,condition,price,coreCharge,weight,stockQty,description,warrantyText,tags
   */
  async function importCSV(csvText) {
    const lines   = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g,''));
    const results = { added: 0, errors: [] };

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      try {
        const values = _parseCSVLine(lines[i]);
        const data   = {};
        headers.forEach((h, idx) => { data[h] = values[idx] || ''; });
        // Map categoryId → categoryName
        const cat = (window.CATEGORIES || []).find(c => c.id === data.categoryId);
        data.categoryName = cat?.name || data.categoryId;
        await addPart(data);
        results.added++;
      } catch(e) {
        results.errors.push(`Row ${i}: ${e.message}`);
      }
    }
    return results;
  }

  function _parseCSVLine(line) {
    const result = []; let current = ''; let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { inQuotes = !inQuotes; }
      else if (line[i] === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
      else { current += line[i]; }
    }
    result.push(current.trim());
    return result;
  }

  // ─── Export CSV ──────────────────────────────────────────
  function exportCSV() {
    const parts = _getAll();
    const headers = ['id','name','brand','partNumber','categoryId','condition','price','coreCharge','weight','stockQty','description','warrantyText','tags'];
    const rows    = parts.map(p => headers.map(h => {
      const v = h === 'tags' ? (p.tags || []).join(';') : (p[h] ?? '');
      return `"${String(v).replace(/"/g,'""')}"`;
    }));
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  // ─── Stats ───────────────────────────────────────────────
  function getStats() {
    const parts = _getAll();
    return {
      total:      parts.length,
      inStock:    parts.filter(p => p.inStock).length,
      outOfStock: parts.filter(p => !p.inStock).length,
      lowStock:   parts.filter(p => p.stockQty > 0 && p.stockQty <= 5).length,
      totalValue: parts.reduce((t, p) => t + p.price * p.stockQty, 0),
      byCategory: parts.reduce((acc, p) => { acc[p.categoryId] = (acc[p.categoryId] || 0) + 1; return acc; }, {}),
    };
  }

  // ─── File util ───────────────────────────────────────────
  function _fileToDataUrl(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload  = () => res(r.result);
      r.onerror = () => rej(new Error('Failed to read file'));
      r.readAsDataURL(file);
    });
  }

  // ─── Merge with sample data ──────────────────────────────
  /**
   * Seed InventoryDB with sample parts from parts-data.js (once).
   * Run on first launch so the store isn't empty.
   */
  function seedFromSampleData() {
    const SEED_VERSION = 'v4'; // bump to force re-seed with new images/fitment
    if (localStorage.getItem('ap_inventory_seeded') === SEED_VERSION) return;
    const samples = window.SAMPLE_PARTS || [];
    if (!samples.length) return;
    const seeded = samples.map((p, i) => ({
      ...p,
      id: 1000 + i,
      warrantyText: p.warrantyText || p.specs?.Warranty || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    _save(seeded);
    localStorage.setItem(COUNTER_KEY, String(1000 + samples.length));
    localStorage.setItem('ap_inventory_seeded', SEED_VERSION);
  }

  return {
    getAll, getById, getByCategory, getRelated, search, getLowStock, getOutOfStock,
    addPart, updatePart, deletePart, adjustStock,
    importCSV, exportCSV, getStats, seedFromSampleData,
  };
})();

window.InventoryDB = InventoryDB;
