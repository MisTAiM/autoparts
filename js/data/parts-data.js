/**
 * DATA: parts-data.js
 * Parts data layer. 
 * 
 * This file is the ONLY file you need to modify to connect your real inventory.
 * Currently loads sample data. For production, replace the fetch functions
 * with your actual API calls or database queries.
 * 
 * HOW TO CONNECT YOUR INVENTORY:
 *   Option A — CSV upload: Import your inventory CSV → convert to JSON format below
 *   Option B — API:        Replace functions with fetch('/api/parts?...') calls
 *   Option C — Static:     Replace SAMPLE_PARTS array with your full catalog JSON
 */

// ─── Categories ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'brakes',     name: 'Brakes',           icon: '🛑', count: 0 },
  { id: 'engine',     name: 'Engine',            icon: '⚙️', count: 0 },
  { id: 'electrical', name: 'Electrical',        icon: '⚡', count: 0 },
  { id: 'cooling',    name: 'Cooling System',    icon: '🌡️', count: 0 },
  { id: 'suspension', name: 'Suspension',        icon: '🔩', count: 0 },
  { id: 'exhaust',    name: 'Exhaust',           icon: '💨', count: 0 },
  { id: 'filters',    name: 'Filters',           icon: '🔳', count: 0 },
  { id: 'drivetrain', name: 'Drivetrain',        icon: '⚙️', count: 0 },
  { id: 'fuel',       name: 'Fuel System',       icon: '⛽', count: 0 },
  { id: 'body',       name: 'Body & Exterior',   icon: '🚗', count: 0 },
  { id: 'lighting',   name: 'Lighting',          icon: '💡', count: 0 },
  { id: 'ac',         name: 'A/C & Heating',     icon: '❄️', count: 0 },
];

// ─── Sample Parts Catalog ────────────────────────────────────────────────────
// FORMAT: Add your real parts here or replace with API call.
// weight = lbs, price = dollars, coreCharge = dollars (0 if no core)
const SAMPLE_PARTS = [
  {
    id: 1, name: 'Front Brake Pad Set - Premium Ceramic', categoryId: 'brakes',
    categoryName: 'Brakes', brand: 'Wagner', partNumber: 'WGN-ZD1295',
    condition: 'new', price: 39.99, coreCharge: 0, weight: 2.5, stockQty: 12,
    description: 'Premium ceramic brake pads offer quiet, dust-free stopping power. Direct-fit replacement with integrally molded noise insulator.',
    specs: { 'Material': 'Ceramic', 'Position': 'Front', 'Includes Hardware': 'Yes', 'Shim Included': 'Yes', 'Warranty': '2 Years' },
    fitment: [], // empty = universal/check catalog, populate with { year, makeId, modelId } objects
    images: [], thumbnail: null,
    inStock: true, tags: ['brake pads', 'ceramic', 'front brakes'],
  },
  {
    id: 2, name: 'Rear Brake Pad Set - OE Replacement', categoryId: 'brakes',
    categoryName: 'Brakes', brand: 'Bosch', partNumber: 'BSH-BP921',
    condition: 'new', price: 29.99, coreCharge: 0, weight: 1.8, stockQty: 8,
    description: 'OE-equivalent rear brake pads. Made with same friction formula as factory pads for reliable performance.',
    specs: { 'Material': 'Semi-Metallic', 'Position': 'Rear', 'Includes Hardware': 'No', 'Warranty': '1 Year' },
    fitment: [], images: [], thumbnail: null, inStock: true, tags: ['brake pads', 'rear', 'OE'],
  },
  {
    id: 3, name: 'Drilled & Slotted Brake Rotor - Front Driver', categoryId: 'brakes',
    categoryName: 'Brakes', brand: 'Power Stop', partNumber: 'PWR-JBR1141XL',
    condition: 'new', price: 64.99, coreCharge: 0, weight: 8.5, stockQty: 5,
    description: 'High-performance drilled and slotted brake rotor improves cooling and debris evacuation for consistent fade-free stopping.',
    specs: { 'Diameter': '12.60"', 'Thickness': '1.10"', 'Position': 'Front Left', 'Coating': 'Zinc Plated', 'Warranty': '1 Year' },
    fitment: [], images: [], thumbnail: null, inStock: true, tags: ['rotor', 'drilled', 'slotted', 'performance'],
  },
  {
    id: 4, name: 'Alternator - Remanufactured 140A', categoryId: 'electrical',
    categoryName: 'Electrical', brand: 'Remy', partNumber: 'RMY-94610',
    condition: 'reman', price: 119.99, coreCharge: 45.00, weight: 11.0, stockQty: 3,
    description: 'Remanufactured alternator rebuilt to OE specifications. Includes a refundable core charge — return your old alternator for a $45 credit.',
    specs: { 'Amperage': '140A', 'Voltage': '12V', 'Rotation': 'CW', 'Pulley Type': 'Serpentine', 'Warranty': '3 Years' },
    fitment: [], images: [], thumbnail: null, inStock: true, tags: ['alternator', 'charging', 'electrical', 'reman'],
  },
  {
    id: 5, name: 'Oil Filter - Extended Life', categoryId: 'filters',
    categoryName: 'Filters', brand: 'Motorcraft', partNumber: 'MCF-FL400S',
    condition: 'new', price: 8.99, coreCharge: 0, weight: 0.4, stockQty: 50,
    description: 'Extended life oil filter with silicone anti-drainback valve. Filters particles down to 10 microns.',
    specs: { 'Thread': '3/4-16', 'Height': '4.0"', 'OD': '3.03"', 'Micron Rating': '10μm', 'Change Interval': '10,000 mi' },
    fitment: [], images: [], thumbnail: null, inStock: true, tags: ['oil filter', 'maintenance'],
  },
  {
    id: 6, name: 'Air Filter - High Flow Performance', categoryId: 'filters',
    categoryName: 'Filters', brand: 'K&N', partNumber: 'KN-33-2304',
    condition: 'new', price: 54.99, coreCharge: 0, weight: 0.8, stockQty: 7,
    description: 'Washable and reusable high-flow air filter. Engineered to increase horsepower while providing excellent filtration.',
    specs: { 'Type': 'Panel', 'Washable': 'Yes', 'Warranty': 'Million Mile' },
    fitment: [], images: [], thumbnail: null, inStock: true, tags: ['air filter', 'K&N', 'performance', 'intake'],
  },
  {
    id: 7, name: 'Water Pump - OE Replacement with Gasket', categoryId: 'cooling',
    categoryName: 'Cooling System', brand: 'Gates', partNumber: 'GAT-41047',
    condition: 'new', price: 79.99, coreCharge: 0, weight: 5.2, stockQty: 4,
    description: 'Premium water pump replacement with pre-installed gasket for easier installation. Cast iron impeller for maximum flow.',
    specs: { 'Impeller': 'Cast Iron', 'Includes Gasket': 'Yes', 'Inlet Diameter': '1.50"', 'Warranty': '3 Years' },
    fitment: [], images: [], thumbnail: null, inStock: true, tags: ['water pump', 'cooling', 'coolant'],
  },
  {
    id: 8, name: 'Radiator Hose Kit - Upper and Lower', categoryId: 'cooling',
    categoryName: 'Cooling System', brand: 'Dayco', partNumber: 'DAY-71813K',
    condition: 'new', price: 24.99, coreCharge: 0, weight: 1.2, stockQty: 11,
    description: 'EPDM rubber radiator hose kit. Heat and ozone resistant for long service life.',
    specs: { 'Material': 'EPDM Rubber', 'Kit Includes': 'Upper + Lower Hose', 'Warranty': '2 Years' },
    fitment: [], images: [], thumbnail: null, inStock: true, tags: ['radiator hose', 'cooling', 'EPDM'],
  },
  {
    id: 9, name: 'Starter Motor - Remanufactured', categoryId: 'electrical',
    categoryName: 'Electrical', brand: 'Remy', partNumber: 'RMY-17466',
    condition: 'reman', price: 89.99, coreCharge: 35.00, weight: 9.0, stockQty: 2,
    description: 'Remanufactured starter motor with new solenoid and brushes. Tested for proper engagement and amperage draw.',
    specs: { 'Voltage': '12V', 'kW': '1.4', 'Teeth': '10', 'Warranty': '1 Year' },
    fitment: [], images: [], thumbnail: null, inStock: true, tags: ['starter', 'electrical', 'reman'],
  },
  {
    id: 10, name: 'Shock Absorber - Front Left Gas-Charged', categoryId: 'suspension',
    categoryName: 'Suspension', brand: 'Monroe', partNumber: 'MON-71643',
    condition: 'new', price: 44.99, coreCharge: 0, weight: 6.0, stockQty: 6,
    description: 'Nitrogen gas-charged shock absorber for a controlled, comfortable ride. OE direct replacement.',
    specs: { 'Type': 'Gas', 'Position': 'Front Left', 'Extended Length': '19.9"', 'Compressed': '13.2"', 'Warranty': '1 Year' },
    fitment: [], images: [], thumbnail: null, inStock: true, tags: ['shock', 'suspension', 'front'],
  },
  {
    id: 11, name: 'Catalytic Converter - Direct Fit', categoryId: 'exhaust',
    categoryName: 'Exhaust', brand: 'MagnaFlow', partNumber: 'MGF-23295',
    condition: 'new', price: 189.99, coreCharge: 0, weight: 14.5, stockQty: 2,
    description: 'Direct-fit catalytic converter with stainless steel body and high-efficiency precious metal catalyst.',
    specs: { 'Body': 'Stainless Steel', 'Substrate': 'Ceramic', 'EPA Compliant': 'Yes', 'CARB': 'Check Application', 'Warranty': '5 Years / 50k mi' },
    fitment: [], images: [], thumbnail: null, inStock: true, tags: ['catalytic converter', 'exhaust', 'emissions'],
  },
  {
    id: 12, name: 'Fuel Pump Module Assembly', categoryId: 'fuel',
    categoryName: 'Fuel System', brand: 'Delphi', partNumber: 'DEL-FG0166',
    condition: 'new', price: 124.99, coreCharge: 0, weight: 3.5, stockQty: 3,
    description: 'Complete in-tank fuel pump module with sending unit and strainer. OE connector for plug-and-play installation.',
    specs: { 'Type': 'In-Tank Module', 'Includes Strainer': 'Yes', 'Includes Float': 'Yes', 'Warranty': '2 Years' },
    fitment: [], images: [], thumbnail: null, inStock: true, tags: ['fuel pump', 'fuel module', 'in-tank'],
  },
];

// ─── PartsData API ───────────────────────────────────────────────────────────
const PartsData = (() => {

  let _parts = null;

  async function _ensure() {
    if (!_parts) {
      // Production: replace with await fetch('/api/parts').then(r => r.json())
      _parts = SAMPLE_PARTS;
      // Update category counts
      CATEGORIES.forEach(cat => {
        cat.count = _parts.filter(p => p.categoryId === cat.id).length;
      });
    }
    return _parts;
  }

  async function getAll() { return [...(await _ensure())]; }

  async function getById(id) {
    const parts = await _ensure();
    return parts.find(p => p.id === parseInt(id)) || null;
  }

  async function getByCategory(catId) {
    const parts = await _ensure();
    return parts.filter(p => p.categoryId === catId);
  }

  async function search(query) {
    const parts = await _ensure();
    const q = query.toLowerCase();
    return parts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.partNumber.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.includes(q)) ||
      p.categoryName.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  }

  async function getRelated(part, limit = 4) {
    const parts = await _ensure();
    return parts
      .filter(p => p.id !== part.id && p.categoryId === part.categoryId)
      .slice(0, limit);
  }

  function getCategories() { return [...CATEGORIES]; }

  /** 
   * Add a new part (for admin use) 
   * In production: POST /api/parts
   */
  async function addPart(part) {
    await _ensure();
    const maxId = Math.max(..._parts.map(p => p.id));
    const newPart = { ...part, id: maxId + 1 };
    _parts.push(newPart);
    return newPart;
  }

  /**
   * Update part (for admin use)
   * In production: PUT /api/parts/:id
   */
  async function updatePart(id, updates) {
    await _ensure();
    const idx = _parts.findIndex(p => p.id === parseInt(id));
    if (idx === -1) return null;
    _parts[idx] = { ..._parts[idx], ...updates };
    return _parts[idx];
  }

  return { getAll, getById, getByCategory, search, getRelated, getCategories, addPart, updatePart };
})();

window.PartsData = PartsData;
window.CATEGORIES = CATEGORIES;

// ─── Live delegation to InventoryDB ─────────────────────────────────────────
// When InventoryDB is loaded (admin has added parts), use that as the source.
// This replaces the static SAMPLE_PARTS transparently so the storefront
// always reflects the current inventory.
const _originalPartsData = window.PartsData;
window.PartsData = {
  getAll:        async () => { if (window.InventoryDB) return InventoryDB.getAll();        return _originalPartsData.getAll(); },
  getById:       async (id) => { if (window.InventoryDB) return InventoryDB.getById(id);  return _originalPartsData.getById(id); },
  getByCategory: async (c) => { if (window.InventoryDB) return InventoryDB.getByCategory(c); return _originalPartsData.getByCategory(c); },
  search:        async (q) => { if (window.InventoryDB) return InventoryDB.search(q);     return _originalPartsData.search(q); },
  getRelated:    async (p, n) => { if (window.InventoryDB) { const all = InventoryDB.getAll(); return all.filter(x=>x.id!==p.id&&x.categoryId===p.categoryId).slice(0,n||4); } return _originalPartsData.getRelated(p, n); },
  getCategories: () => window.CATEGORIES || [],
  addPart:    _originalPartsData.addPart,
  updatePart: _originalPartsData.updatePart,
};
