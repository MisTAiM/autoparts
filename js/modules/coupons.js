/**
 * MODULE: coupons.js
 * Coupon / promo code system.
 * Admin creates coupons; customers redeem them in cart.
 */
const Coupons = (() => {
  const KEY = 'ap_coupons';

  // ─── Default seed coupons (admin can manage these) ───
  function _getAll() {
    try {
      let coupons = JSON.parse(localStorage.getItem(KEY));
      if (!coupons) {
        coupons = [
          { code: 'SAVE10',    type: 'percent', value: 10, minOrder: 0,   maxUses: null, uses: 0, active: true, description: '10% off any order', expiresAt: null },
          { code: 'FIRST20',   type: 'percent', value: 20, minOrder: 50,  maxUses: 1,    uses: 0, active: true, description: '20% off orders over $50 (first order)', expiresAt: null },
          { code: 'FREESHIP',  type: 'shipping', value: 0, minOrder: 0,   maxUses: null, uses: 0, active: true, description: 'Free shipping on any order', expiresAt: null },
          { code: 'SUMMER25',  type: 'flat',    value: 25, minOrder: 100, maxUses: null, uses: 0, active: false, description: '$25 off orders over $100', expiresAt: '2025-09-01' },
        ];
        localStorage.setItem(KEY, JSON.stringify(coupons));
      }
      return coupons;
    } catch { return []; }
  }

  function _save(coupons) { localStorage.setItem(KEY, JSON.stringify(coupons)); }

  // ─── Customer: validate a code ───────────────────────
  function validate(code, subtotal = 0) {
    const all    = _getAll();
    const coupon = all.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
    if (!coupon)            return { ok: false, error: 'Invalid coupon code.' };
    if (!coupon.active)     return { ok: false, error: 'This coupon is no longer active.' };
    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt))
                            return { ok: false, error: 'This coupon has expired.' };
    if (coupon.maxUses !== null && coupon.uses >= coupon.maxUses)
                            return { ok: false, error: 'This coupon has reached its usage limit.' };
    if (subtotal < coupon.minOrder)
                            return { ok: false, error: `Minimum order of $${coupon.minOrder.toFixed(2)} required.` };
    return { ok: true, coupon };
  }

  function apply(code, subtotal) {
    const result = validate(code, subtotal);
    if (!result.ok) return result;
    const { coupon } = result;
    let discount = 0;
    let freeShipping = false;
    if (coupon.type === 'percent')  discount = Math.round(subtotal * coupon.value / 100 * 100) / 100;
    if (coupon.type === 'flat')     discount = Math.min(coupon.value, subtotal);
    if (coupon.type === 'shipping') freeShipping = true;
    return { ok: true, coupon, discount, freeShipping };
  }

  function redeem(code) {
    const all = _getAll();
    const idx = all.findIndex(c => c.code.toUpperCase() === code.toUpperCase().trim());
    if (idx !== -1) { all[idx].uses++; _save(all); }
  }

  // ─── Admin: manage coupons ───────────────────────────
  function getAll() { return _getAll(); }

  function create({ code, type, value, minOrder = 0, maxUses = null, description = '', expiresAt = null }) {
    const all = _getAll();
    if (all.find(c => c.code.toUpperCase() === code.toUpperCase())) return { ok: false, error: 'Code already exists.' };
    all.unshift({ code: code.toUpperCase().trim(), type, value: parseFloat(value), minOrder: parseFloat(minOrder) || 0, maxUses: maxUses ? parseInt(maxUses) : null, uses: 0, active: true, description, expiresAt: expiresAt || null });
    _save(all);
    return { ok: true };
  }

  function update(code, updates) {
    const all = _getAll();
    const idx = all.findIndex(c => c.code === code.toUpperCase());
    if (idx === -1) return { ok: false, error: 'Code not found.' };
    Object.assign(all[idx], updates);
    _save(all);
    return { ok: true };
  }

  function remove(code) {
    _save(_getAll().filter(c => c.code !== code.toUpperCase()));
    return { ok: true };
  }

  return { validate, apply, redeem, getAll, create, update, remove };
})();

window.Coupons = Coupons;
