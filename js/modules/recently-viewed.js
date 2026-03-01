/**
 * MODULE: recently-viewed.js
 * Tracks last 8 viewed parts. Persists in localStorage.
 */
const RecentlyViewed = (() => {
  const KEY   = 'ap_recently_viewed';
  const LIMIT = 8;

  function _get() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
  }

  function track(part) {
    if (!part?.id) return;
    let items = _get().filter(i => i.id !== part.id);
    items.unshift({ id: part.id, name: part.name, brand: part.brand, partNumber: part.partNumber, price: part.price, thumbnail: part.thumbnail || null, viewedAt: new Date().toISOString() });
    localStorage.setItem(KEY, JSON.stringify(items.slice(0, LIMIT)));
  }

  function getItems() { return [..._get()]; }
  function clear()    { localStorage.removeItem(KEY); }

  return { track, getItems, clear };
})();

window.RecentlyViewed = RecentlyViewed;
