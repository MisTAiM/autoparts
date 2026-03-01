/**
 * MODULE: analytics-tracker.js
 * Client-side analytics for the store owner.
 * Tracks: pageviews, searches, vehicle lookups, cart actions, product views.
 * All data stored in localStorage under ap_analytics_* keys.
 * Owner dashboard reads these keys via admin/analytics.html
 */

const AnalyticsTracker = (() => {
  const PREFIX = 'ap_analytics_';
  const MAX_EVENTS = 500; // keep last 500 events per type

  function _now() { return Date.now(); }
  function _today() { return new Date().toISOString().slice(0,10); }

  function _push(key, event) {
    const fullKey = PREFIX + key;
    let arr = [];
    try { arr = JSON.parse(localStorage.getItem(fullKey) || '[]'); } catch {}
    arr.push({ ...event, ts: _now(), date: _today() });
    if (arr.length > MAX_EVENTS) arr = arr.slice(-MAX_EVENTS);
    try { localStorage.setItem(fullKey, JSON.stringify(arr)); } catch {}
  }

  function _inc(key) {
    const fullKey = PREFIX + key;
    const val = parseInt(localStorage.getItem(fullKey) || '0') + 1;
    try { localStorage.setItem(fullKey, String(val)); } catch {}
    return val;
  }

  // Session tracking
  function _getSessionId() {
    let sid = sessionStorage.getItem('ap_session_id');
    if (!sid) {
      sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem('ap_session_id', sid);
      _inc('total_sessions');
      _logDailyVisit();
    }
    return sid;
  }

  function _logDailyVisit() {
    const key = PREFIX + 'daily_visits';
    let daily = {};
    try { daily = JSON.parse(localStorage.getItem(key) || '{}'); } catch {}
    const today = _today();
    daily[today] = (daily[today] || 0) + 1;
    // Keep last 90 days
    const keys = Object.keys(daily).sort();
    if (keys.length > 90) {
      keys.slice(0, keys.length - 90).forEach(k => delete daily[k]);
    }
    try { localStorage.setItem(key, JSON.stringify(daily)); } catch {}
  }

  /** Track a page view */
  function trackPageview(page) {
    _getSessionId();
    _push('pageviews', { page: page || location.pathname, ref: document.referrer ? 'external' : 'direct' });
    _inc('total_pageviews');
  }

  /** Track a product view */
  function trackProductView(partId, partName, brand, price) {
    _push('product_views', { partId, partName, brand, price });
    // Track top viewed products
    const key = PREFIX + 'product_view_counts';
    let counts = {};
    try { counts = JSON.parse(localStorage.getItem(key) || '{}'); } catch {}
    counts[partId] = { partId, partName, brand, price, views: (counts[partId]?.views || 0) + 1 };
    try { localStorage.setItem(key, JSON.stringify(counts)); } catch {}
  }

  /** Track a search query */
  function trackSearch(query, resultsCount) {
    if (!query?.trim()) return;
    _push('searches', { query: query.trim().toLowerCase(), resultsCount });
    // Track search term frequency
    const key = PREFIX + 'search_terms';
    let terms = {};
    try { terms = JSON.parse(localStorage.getItem(key) || '{}'); } catch {}
    const q = query.trim().toLowerCase();
    terms[q] = (terms[q] || 0) + 1;
    try { localStorage.setItem(key, JSON.stringify(terms)); } catch {}
  }

  /** Track a vehicle lookup */
  function trackVehicleLookup(year, make, model, trim) {
    _push('vehicle_lookups', { year, make, model, trim });
    // Track popular vehicle combos
    const key = PREFIX + 'vehicle_lookup_counts';
    let counts = {};
    try { counts = JSON.parse(localStorage.getItem(key) || '{}'); } catch {}
    const combo = `${year} ${make} ${model}`;
    counts[combo] = (counts[combo] || 0) + 1;
    try { localStorage.setItem(key, JSON.stringify(counts)); } catch {}
  }

  /** Track add to cart */
  function trackAddToCart(partId, partName, price, qty) {
    _push('cart_adds', { partId, partName, price, qty });
    _inc('total_cart_adds');
  }

  /** Track add to wishlist */
  function trackWishlist(partId, partName, action) {
    _push('wishlist_actions', { partId, partName, action }); // action: 'add' | 'remove'
  }

  /** Track coupon usage */
  function trackCoupon(code, discount) {
    _push('coupon_uses', { code, discount });
  }

  /** Track checkout started */
  function trackCheckoutStart(cartTotal, itemCount) {
    _push('checkout_starts', { cartTotal, itemCount });
    _inc('total_checkout_starts');
  }

  /** Track order placed (called by checkout.html on success) */
  function trackOrderPlaced(orderNum, total, itemCount, coupon) {
    _push('orders_placed', { orderNum, total, itemCount, coupon });
    _inc('total_orders_placed');
    // Track conversion funnel
    const starts = parseInt(localStorage.getItem(PREFIX + 'total_checkout_starts') || '0');
    const orders = parseInt(localStorage.getItem(PREFIX + 'total_orders_placed') || '0');
    try { localStorage.setItem(PREFIX + 'conversion_rate', starts > 0 ? (orders / starts * 100).toFixed(1) : '0'); } catch {}
  }

  /** Track newsletter signup */
  function trackNewsletter(email) {
    _push('newsletter_signups', { email: email ? '***' : 'unknown' }); // anonymized
    _inc('total_newsletter_signups');
  }

  /** Get all analytics data for admin dashboard */
  function getAllData() {
    const keys = ['pageviews','product_views','searches','vehicle_lookups',
                  'cart_adds','wishlist_actions','coupon_uses','checkout_starts','orders_placed',
                  'newsletter_signups'];
    const data = {};
    keys.forEach(k => {
      try { data[k] = JSON.parse(localStorage.getItem(PREFIX + k) || '[]'); } catch { data[k] = []; }
    });

    const counts = ['total_sessions','total_pageviews','total_cart_adds',
                    'total_checkout_starts','total_orders_placed','total_newsletter_signups'];
    counts.forEach(k => {
      data[k] = parseInt(localStorage.getItem(PREFIX + k) || '0');
    });

    // Daily visits
    try { data.daily_visits = JSON.parse(localStorage.getItem(PREFIX + 'daily_visits') || '{}'); } catch { data.daily_visits = {}; }
    try { data.product_view_counts = JSON.parse(localStorage.getItem(PREFIX + 'product_view_counts') || '{}'); } catch { data.product_view_counts = {}; }
    try { data.search_terms = JSON.parse(localStorage.getItem(PREFIX + 'search_terms') || '{}'); } catch { data.search_terms = {}; }
    try { data.vehicle_lookup_counts = JSON.parse(localStorage.getItem(PREFIX + 'vehicle_lookup_counts') || '{}'); } catch { data.vehicle_lookup_counts = {}; }
    data.conversion_rate = localStorage.getItem(PREFIX + 'conversion_rate') || '0';

    return data;
  }

  /** Clear all analytics data */
  function clearAll() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k));
  }

  // Auto-track the current page on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => trackPageview());
  } else {
    trackPageview();
  }

  return {
    trackPageview, trackProductView, trackSearch, trackVehicleLookup,
    trackAddToCart, trackWishlist, trackCoupon, trackCheckoutStart,
    trackOrderPlaced, trackNewsletter, getAllData, clearAll
  };
})();

window.AnalyticsTracker = AnalyticsTracker;
