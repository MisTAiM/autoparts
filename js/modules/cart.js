/**
 * MODULE: cart.js
 * Shopping cart state management with localStorage persistence.
 * Emits custom events on change.
 */

const Cart = (() => {
  const STORAGE_KEY = 'ap_cart';
  let _items = [];
  const _listeners = [];

  // ─── Persistence ────────────────────────────────────────
  function _save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(_items)); }
  function load() {
    try { _items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch(e) { _items = []; }
    _notify();
  }

  // ─── Notify ─────────────────────────────────────────────
  function _notify() {
    _listeners.forEach(fn => fn(getCart()));
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: getCart() }));
  }

  function onChange(fn) { _listeners.push(fn); }

  // ─── Public API ─────────────────────────────────────────
  function getCart() {
    return {
      items: [..._items],
      count: _items.reduce((t, i) => t + i.qty, 0),
      subtotal: getSubtotal(),
    };
  }

  function getItems() { return [..._items]; }

  function addItem(part, qty = 1) {
    const idx = _items.findIndex(i => i.id === part.id);
    if (idx > -1) {
      _items[idx].qty = Math.min(_items[idx].qty + qty, part.stockQty || 99);
    } else {
      _items.push({ ...part, qty: Math.min(qty, part.stockQty || 99) });
    }
    _save(); _notify();
    return getCart();
  }

  function updateQty(partId, qty) {
    const idx = _items.findIndex(i => i.id === partId);
    if (idx === -1) return;
    if (qty <= 0) { removeItem(partId); return; }
    _items[idx].qty = qty;
    _save(); _notify();
  }

  function removeItem(partId) {
    _items = _items.filter(i => i.id !== partId);
    _save(); _notify();
  }

  function clearCart() { _items = []; _save(); _notify(); }

  function getSubtotal() {
    return _items.reduce((t, i) => t + i.price * i.qty, 0);
  }

  function getCoreTotal() {
    return _items.reduce((t, i) => t + (i.coreCharge || 0) * i.qty, 0);
  }

  function hasItem(partId) { return _items.some(i => i.id === partId); }
  function getItemQty(partId) { return (_items.find(i => i.id === partId) || {}).qty || 0; }

  // ─── Formatting helpers ──────────────────────────────────
  function formatPrice(cents) { return `$${(cents/100).toFixed(2)}`; }
  function formatPriceNum(num) { return `$${Number(num).toFixed(2)}`; }

  return { load, getCart, getItems, addItem, updateQty, removeItem, clearCart, getSubtotal, getCoreTotal, hasItem, getItemQty, onChange, formatPrice, formatPriceNum };
})();

window.Cart = Cart;
