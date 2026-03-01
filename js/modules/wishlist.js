/**
 * MODULE: wishlist.js
 * Save-for-later wishlist. Persists per user (localStorage keyed by userId)
 * or as guest (shared key). Fires 'wishlist:updated' on window.
 */
const Wishlist = (() => {
  const GUEST_KEY = 'ap_wishlist_guest';

  function _key() {
    const s = window.Auth?.getSession?.();
    return s ? `ap_wishlist_${s.userId}` : GUEST_KEY;
  }

  function _get() {
    try { return JSON.parse(localStorage.getItem(_key()) || '[]'); } catch { return []; }
  }

  function _save(items) {
    localStorage.setItem(_key(), JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('wishlist:updated', { detail: { count: items.length } }));
  }

  function getItems()       { return [..._get()]; }
  function getCount()       { return _get().length; }
  function has(partId)      { return _get().some(i => i.id === parseInt(partId)); }

  function add(part) {
    const items = _get();
    if (!items.some(i => i.id === part.id)) {
      items.unshift({ id: part.id, name: part.name, brand: part.brand, partNumber: part.partNumber, price: part.price, thumbnail: part.thumbnail || null, addedAt: new Date().toISOString() });
      _save(items);
      return true;
    }
    return false;
  }

  function remove(partId) {
    _save(_get().filter(i => i.id !== parseInt(partId)));
  }

  function toggle(part) {
    if (has(part.id)) { remove(part.id); return false; }
    else { add(part); return true; }
  }

  function clear() { _save([]); }

  return { getItems, getCount, has, add, remove, toggle, clear };
})();

window.Wishlist = Wishlist;
