/**
 * MODULE: ui.js
 * Shared UI utilities: toasts, loading states, page routing helpers,
 * header cart counter, vehicle banner.
 */

const UI = (() => {

  // ─── Toast ──────────────────────────────────────────────
  function toast(message, type = 'success', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    const icons = { success: '<i class="fa-solid fa-circle-check"></i>', danger: '<i class="fa-solid fa-circle-xmark"></i>', warning: '<i class="fa-solid fa-triangle-exclamation"></i>', info: '<i class="fa-solid fa-circle-info"></i>' };
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-msg">${message}</span>
    `;
    container.appendChild(el);
    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 350);
    }, duration);
  }

  // ─── Loading overlay ────────────────────────────────────
  function showLoader(container, height = '200px') {
    const el = typeof container === 'string' ? document.querySelector(container) : container;
    if (!el) return;
    el.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:${height}"><span class="spinner" style="width:32px;height:32px"></span></div>`;
  }

  function showError(container, message) {
    const el = typeof container === 'string' ? document.querySelector(container) : container;
    if (!el) return;
    el.innerHTML = `<div class="alert alert-danger" style="margin:24px 0">${message}</div>`;
  }

  // ─── Cart counter in header ──────────────────────────────
  function initCartCounter() {
    window.addEventListener('cart:updated', (e) => {
      const { count } = e.detail;
      const badge = document.querySelector('.cart-count');
      if (!badge) return;
      badge.textContent = count;
      badge.classList.toggle('visible', count > 0);
    });
  }

  // ─── Vehicle banner ─────────────────────────────────────
  function updateVehicleBanner() {
    const banner = document.getElementById('vehicle-banner');
    if (!banner) return;
    const label = YMM.getVehicleLabel();
    if (label) {
      banner.querySelector('.vehicle-banner-name').textContent = label;
      banner.classList.add('active');
    } else {
      banner.classList.remove('active');
    }
  }

  function initVehicleBanner() {
    YMM.onChange(() => updateVehicleBanner());
    updateVehicleBanner();
    const changeBtn = document.getElementById('vehicle-change-btn');
    if (changeBtn) changeBtn.addEventListener('click', () => {
      YMM.clearVehicle();
      updateVehicleBanner();
      window.location.href = 'index.html';
    });
  }

  // ─── Mobile nav ──────────────────────────────────────────
  function initMobileNav() {
    const toggle = document.querySelector('.menu-toggle');
    const nav    = document.getElementById('mobile-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.addEventListener('click', (e) => {
      if (e.target === nav) nav.classList.remove('open');
    });
  }

  // ─── Active nav link ────────────────────────────────────
  function setActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.header-nav a, .mobile-nav-inner a').forEach(a => {
      const href = a.getAttribute('href');
      a.classList.toggle('active', href === path);
    });
  }

  // ─── Header search ───────────────────────────────────────
  function initHeaderSearch() {
    const input   = document.getElementById('header-search-input');
    const results = document.getElementById('header-search-results');
    if (!input || !results) return;

    let debounceTimer;
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      const q = input.value.trim();
      if (q.length < 2) { results.classList.remove('open'); return; }
      debounceTimer = setTimeout(async () => {
        const parts = await window.PartsData.search(q);
        if (!parts.length) { results.classList.remove('open'); return; }
        results.innerHTML = parts.slice(0, 6).map(p => `
          <div class="search-result-item" data-id="${p.id}">
            <div class="sri-thumb">${p.thumbnail ? `<img src="${p.thumbnail}" alt="">` : '<i class="fa-solid fa-gear"></i>'}</div>
            <div>
              <div class="sri-name">${p.name}</div>
              <div class="sri-cat">${p.categoryName || ''}</div>
            </div>
            <div class="sri-price">$${Number(p.price).toFixed(2)}</div>
          </div>
        `).join('');
        results.classList.add('open');
        results.querySelectorAll('.search-result-item').forEach(el => {
          el.addEventListener('click', () => {
            window.location.href = `product.html?id=${el.dataset.id}`;
          });
        });
      }, 280);
    });
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !results.contains(e.target)) {
        results.classList.remove('open');
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        results.classList.remove('open');
        window.location.href = `catalog.html?q=${encodeURIComponent(input.value)}`;
      }
    });
  }

  // ─── Breadcrumbs ─────────────────────────────────────────
  function setBreadcrumbs(crumbs) {
    const el = document.querySelector('.catalog-breadcrumb, .product-breadcrumb');
    if (!el) return;
    el.innerHTML = crumbs.map((c, i) =>
      i < crumbs.length - 1
        ? `<a href="${c.href}">${c.label}</a><span>›</span>`
        : `<span>${c.label}</span>`
    ).join('');
  }

  // ─── Format helpers ─────────────────────────────────────
  function fmt$$(num) { return `$${Number(num).toFixed(2)}`; }
  function fmtCondition(c) { return ({ new:'New', used:'Used', reman:'Remanufactured', oe:'OE' })[c] || c; }

  // ─── URL params ──────────────────────────────────────────
  function getParam(key) { return new URLSearchParams(window.location.search).get(key); }
  function setParam(key, val) {
    const u = new URLSearchParams(window.location.search);
    if (val) u.set(key, val); else u.delete(key);
    history.replaceState(null, '', `?${u.toString()}`);
  }

  // ─── Init all shared UI ─────────────────────────────────
  function init() {
    Cart.load();
    YMM.loadState();
    initCartCounter();
    initVehicleBanner();
    initMobileNav();
    setActiveNav();
    initHeaderSearch();
    // Dispatch initial cart event
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: Cart.getCart() }));
  }

  return { toast, showLoader, showError, initCartCounter, updateVehicleBanner, initVehicleBanner, initMobileNav, setActiveNav, initHeaderSearch, setBreadcrumbs, fmt$$, fmtCondition, getParam, setParam, init };
})();

window.UI = UI;
