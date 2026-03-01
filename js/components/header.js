/**
 * COMPONENT: header.js
 * Builds and injects the full 3-row site header into every page.
 * Call SiteHeader.init() after DOM is ready.
 * Detects current page to mark active nav items.
 */

const SiteHeader = (() => {

  const CATEGORIES = [
    { id:'brakes',    name:'Brakes',       icon:'fa-circle-dot',   svgIcon:'brakes'     },
    { id:'engine',    name:'Engine',       icon:'fa-engine',    svgIcon:'engine'     },
    { id:'electrical',name:'Electrical',   icon:'fa-bolt',      svgIcon:'electrical' },
    { id:'cooling',   name:'Cooling',      icon:'fa-temperature-low', svgIcon:'cooling' },
    { id:'suspension',name:'Suspension',   icon:'fa-car-bump',  svgIcon:'suspension' },
    { id:'exhaust',   name:'Exhaust',      icon:'fa-wind',      svgIcon:'exhaust'    },
    { id:'filters',   name:'Filters',      icon:'fa-filter',    svgIcon:'filters'    },
    { id:'drivetrain',name:'Drivetrain',   icon:'fa-gears',         svgIcon:'drivetrain' },
    { id:'fuel',      name:'Fuel System',  icon:'fa-gas-pump',      svgIcon:'fuel'       },
    { id:'body',      name:'Body & Trim',  icon:'fa-car-side',      svgIcon:'body'       },
    { id:'lighting',  name:'Lighting',     icon:'fa-lightbulb',     svgIcon:'lighting'   },
    { id:'ac',        name:'A/C & Heating',icon:'fa-snowflake',     svgIcon:'ac'         },
  ];

  // Resolve relative paths from any depth (admin pages need ../)
  function _root() {
    const depth = window.location.pathname.split('/').filter(Boolean).length;
    // admin pages are 1 level deep from root
    return window.location.pathname.includes('/admin/') ? '../' : '';
  }

  function _catNavHTML(root) {
    const CAT_SVGS = {"engine": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 20 20\\" fill=\\"none\\" style=\\"vertical-align:-2px;display:inline-block\\"><rect x=\\"1\\" y=\\"6\\" width=\\"4\\" height=\\"8\\" rx=\\"1\\" stroke=\\"currentColor\\" stroke-width=\\"1.5\\"/><path d=\\"M5 8.5h3l1.5-2h3L14 8.5h1.5a1 1 0 011 1v1a1 1 0 01-1 1H14l-1.5 2h-3L8 11.5H5\\" stroke=\\"currentColor\\" stroke-width=\\"1.5\\" stroke-linejoin=\\"round\\"/><circle cx=\\"10\\" cy=\\"10\\" r=\\"1.2\\" fill=\\"currentColor\\"/></svg>", "suspension": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 20 20\\" fill=\\"none\\" style=\\"vertical-align:-2px;display:inline-block\\"><path d=\\"M6 2h8\\" stroke=\\"currentColor\\" stroke-width=\\"1.5\\" stroke-linecap=\\"round\\"/><path d=\\"M14 2c0 1.33-1.5 2-3 2s-3 .67-3 2 1.5 2 3 2-3 .67-3 2 1.5 2 3 2-3 .67-3 2 1.5 2 3 2\\" stroke=\\"currentColor\\" stroke-width=\\"1.5\\" stroke-linecap=\\"round\\"/><path d=\\"M6 18h8\\" stroke=\\"currentColor\\" stroke-width=\\"1.5\\" stroke-linecap=\\"round\\"/></svg>", "brakes": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 20 20\\" fill=\\"none\\" style=\\"vertical-align:-2px;display:inline-block\\"><circle cx=\\"10\\" cy=\\"10\\" r=\\"8\\" stroke=\\"currentColor\\" stroke-width=\\"1.4\\"/><circle cx=\\"10\\" cy=\\"10\\" r=\\"3.5\\" stroke=\\"currentColor\\" stroke-width=\\"1.4\\"/><path d=\\"M10 2v2.5M10 15.5V18M2 10h2.5M15.5 10H18M4.1 4.1l1.77 1.77M14.13 14.13l1.77 1.77M4.1 15.9l1.77-1.77M14.13 5.87l1.77-1.77\\" stroke=\\"currentColor\\" stroke-width=\\"1.2\\" stroke-linecap=\\"round\\"/></svg>", "cooling": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 20 20\\" fill=\\"none\\" style=\\"vertical-align:-2px;display:inline-block\\"><circle cx=\\"10\\" cy=\\"10\\" r=\\"3\\" stroke=\\"currentColor\\" stroke-width=\\"1.5\\"/><path d=\\"M10 2v3M10 15v3M2 10h3M15 10h3M4.22 4.22l2.12 2.12M13.66 13.66l2.12 2.12M4.22 15.78l2.12-2.12M13.66 6.34l2.12-2.12\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\" stroke-linecap=\\"round\\"/></svg>", "exhaust": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 20 20\\" fill=\\"none\\" style=\\"vertical-align:-2px;display:inline-block\\"><path d=\\"M2 15h5a2 2 0 002-2V9a2 2 0 012-2h5\\" stroke=\\"currentColor\\" stroke-width=\\"1.5\\" stroke-linecap=\\"round\\"/><circle cx=\\"17\\" cy=\\"7\\" r=\\"2\\" stroke=\\"currentColor\\" stroke-width=\\"1.4\\"/><path d=\\"M9.5 5c.5-1.5 1.5-2.5 2.5-2.5\\" stroke=\\"currentColor\\" stroke-width=\\"1.4\\" stroke-linecap=\\"round\\"/><path d=\\"M12 3.5c.5-1 1-1.5 1.5-1.5\\" stroke=\\"currentColor\\" stroke-width=\\"1.4\\" stroke-linecap=\\"round\\"/></svg>", "drivetrain": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 20 20\\" fill=\\"none\\" style=\\"vertical-align:-2px;display:inline-block\\"><circle cx=\\"5\\" cy=\\"10\\" r=\\"3\\" stroke=\\"currentColor\\" stroke-width=\\"1.5\\"/><circle cx=\\"15\\" cy=\\"10\\" r=\\"3\\" stroke=\\"currentColor\\" stroke-width=\\"1.5\\"/><path d=\\"M8 10h4\\" stroke=\\"currentColor\\" stroke-width=\\"1.5\\" stroke-linecap=\\"round\\"/><path d=\\"M5 7V4l2-1.5M15 7V4l-2-1.5M5 13v3l2 1.5M15 13v3l-2 1.5\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\" stroke-linecap=\\"round\\"/></svg>", "fuel": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 20 20\\" fill=\\"none\\" style=\\"vertical-align:-2px;display:inline-block\\"><path d=\\"M3 18V4a1 1 0 011-1h8a1 1 0 011 1v14H3Z\\" stroke=\\"currentColor\\" stroke-width=\\"1.4\\"/><path d=\\"M13 9l3.5 1.5V14a1.5 1.5 0 01-3 0v-2.5\\" stroke=\\"currentColor\\" stroke-width=\\"1.4\\" stroke-linecap=\\"round\\"/><path d=\\"M6 7h4M6 11h4\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\" stroke-linecap=\\"round\\"/></svg>", "lighting": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 20 20\\" fill=\\"none\\" style=\\"vertical-align:-2px;display:inline-block\\"><path d=\\"M13.5 8A3.5 3.5 0 1010 4.5c0 1.5.6 2.3 1.5 3.2.7.7 1.2 1.5 1.5 2.3h-6c.3-.8.8-1.6 1.5-2.3C9.4 6.8 10 6 10 4.5\\" stroke=\\"currentColor\\" stroke-width=\\"1.4\\" stroke-linecap=\\"round\\"/><path d=\\"M8 13.5h4M8.5 17h3\\" stroke=\\"currentColor\\" stroke-width=\\"1.4\\" stroke-linecap=\\"round\\"/></svg>", "ac": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 20 20\\" fill=\\"none\\" style=\\"vertical-align:-2px;display:inline-block\\"><path d=\\"M10 2v16M2 10h16M4.93 4.93l10.14 10.14M15.07 4.93L4.93 15.07\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\" stroke-linecap=\\"round\\"/><circle cx=\\"10\\" cy=\\"10\\" r=\\"2.5\\" stroke=\\"currentColor\\" stroke-width=\\"1.4\\"/></svg>", "body": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 20 20\\" fill=\\"none\\" style=\\"vertical-align:-2px;display:inline-block\\"><path d=\\"M2 13h16M4 13V9l3-4h6l3 4v4\\" stroke=\\"currentColor\\" stroke-width=\\"1.4\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><circle cx=\\"6\\" cy=\\"14.5\\" r=\\"1.5\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\"/><circle cx=\\"14\\" cy=\\"14.5\\" r=\\"1.5\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\"/><path d=\\"M7 9h6\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\" stroke-linecap=\\"round\\"/></svg>", "filters": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 20 20\\" fill=\\"none\\" style=\\"vertical-align:-2px;display:inline-block\\"><path d=\\"M18 3H2l6.5 7.5V17l3-1.5V10.5L18 3Z\\" stroke=\\"currentColor\\" stroke-width=\\"1.4\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/></svg>", "electrical": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 20 20\\" fill=\\"none\\" style=\\"vertical-align:-2px;display:inline-block\\"><path d=\\"M11 2L3 11h7l-1 7 8-9h-7l1-7Z\\" stroke=\\"currentColor\\" stroke-width=\\"1.4\\" stroke-linejoin=\\"round\\"/></svg>"};
    return CATEGORIES.map(c => {
      const svg = CAT_SVGS[c.id] || `<i class="fa-solid ${c.icon}"></i>`;
      return `<a href="${root}catalog.html?cat=${c.id}" class="nav-cat">${svg}${c.name}</a>`;
    }).join('');
  }

  function _mobileCatHTML(root) {
    return CATEGORIES.map(c => {
      const svg = CAT_SVGS[c.id] || `<i class="fa-solid ${c.icon}"></i>`;
      return `<a href="${root}catalog.html?cat=${c.id}">${svg}${c.name}</a>`;
    }).join('');
  }

  function _build(root) {
    return `
    <!-- Utility bar -->
    <div class="header-utility">
      <div class="header-utility-inner">
        <div class="utility-left">
          <span><i class="fa-solid fa-truck-fast"></i> Free shipping over $150</span>
          <span><i class="fa-solid fa-phone"></i> (555) 555-5555</span>
          <span><i class="fa-solid fa-clock"></i> Mon–Fri 8am–6pm EST</span>
        </div>
        <div class="utility-right">
          <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="#"><i class="fa-brands fa-instagram"></i></a>
          <a href="${root}admin/login.html"><i class="fa-solid fa-lock"></i> Admin</a>
        </div>
      </div>
    </div>

    <!-- Main bar -->
    <div class="header-main">
      <div class="header-main-inner">
        <a href="${root}index.html" class="site-logo">
          <div class="logo-icon"><i class="fa-solid fa-gear"></i></div>
          <div>
            <div class="logo-text">Auto<span>Parts</span></div>
            <span class="logo-sub">Warehouse</span>
          </div>
        </a>

        <div id="header-vehicle-compact" class="vehicle-banner-compact empty"
             onclick="window.location.href='${root}index.html'">
          <i class="fa-solid fa-car"></i>
          <span class="vb-text" id="header-vb-text">Select Vehicle</span>
          <i class="fa-solid fa-chevron-down" style="font-size:.55rem;color:var(--c-text-3)"></i>
        </div>

        <div class="header-search">
          <div class="header-search-inner">
            <input type="text" id="header-search-input"
              placeholder="Search part name, number, keyword…" autocomplete="off">
            <button class="header-search-btn" type="button"
              onclick="SiteHeader.submitSearch()">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
          <div class="header-search-results" id="header-search-results"></div>
        </div>

        <div class="header-actions">
          <a href="${root}login.html" class="header-action-btn auth-login-link">
            <i class="fa-regular fa-user"></i><span>Sign In</span>
          </a>
          <a href="${root}account.html" class="header-action-btn auth-account-link" style="display:none">
            <i class="fa-solid fa-user-check"></i><span id="auth-user-name">Account</span>
          </a>
          <a href="${root}wishlist.html" class="header-action-btn wishlist-btn" title="Wishlist">
            <i class="fa-regular fa-heart"></i>
            <span class="cart-badge hidden" id="wishlist-count">0</span>
          </a>
          <a href="${root}cart.html" class="header-action-btn cart-btn">
            <i class="fa-solid fa-cart-shopping"></i>
            <span>Cart</span>
            <span class="cart-badge hidden" id="cart-count">0</span>
          </a>
          <button class="menu-toggle" id="menu-toggle">
            <i class="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Category nav -->
    <nav class="header-nav">
      <div class="header-nav-inner">
        ${_catNavHTML(root)}
      </div>
    </nav>`;
  }

  function _buildMobileNav(root) {
    return `
    <div class="mobile-nav-inner">
      <div style="display:flex;align-items:center;justify-content:space-between;
                  margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--c-border)">
        <div style="font-family:var(--font-display);font-weight:700;font-size:1rem">
          AutoParts Warehouse
        </div>
        <button id="close-mobile-nav"
          style="background:none;border:none;color:var(--c-text-2);font-size:1.2rem;cursor:pointer">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <a href="${root}index.html"><i class="fa-solid fa-house"></i> Home</a>
      <a href="${root}catalog.html"><i class="fa-solid fa-list"></i> All Parts</a>
      <a href="${root}login.html" class="auth-login-link"><i class="fa-solid fa-right-to-bracket"></i> Sign In</a>
      <a href="${root}account.html" class="auth-account-link" style="display:none">
        <i class="fa-solid fa-user"></i> My Account
      </a>
      <a href="${root}cart.html"><i class="fa-solid fa-cart-shopping"></i> Cart</a>
      <div style="margin:12px 0;border-top:1px solid var(--c-border)"></div>
      <div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;
                  color:var(--c-text-3);padding:8px 16px">Categories</div>
      ${_mobileCatHTML(root)}
    </div>`;
  }

  function init() {
    const root = _root();

    // Inject header HTML
    const header = document.getElementById('site-header');
    if (header) header.innerHTML = _build(root);

    // Inject mobile nav
    let mobileNav = document.getElementById('mobile-nav');
    if (!mobileNav) {
      mobileNav = document.createElement('div');
      mobileNav.id = 'mobile-nav';
      mobileNav.className = 'mobile-nav';
      document.body.insertBefore(mobileNav, document.body.firstChild.nextSibling);
    }
    mobileNav.innerHTML = _buildMobileNav(root);

    // Mobile nav toggle
    document.getElementById('menu-toggle')?.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
    document.getElementById('close-mobile-nav')?.addEventListener('click', () => {
      mobileNav.classList.remove('open');
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (mobileNav.classList.contains('open') &&
          !mobileNav.contains(e.target) &&
          !document.getElementById('menu-toggle')?.contains(e.target)) {
        mobileNav.classList.remove('open');
      }
    });

    // Auth state
    _updateAuth(root);

    // Cart count
    _updateCartCount();
    window.addEventListener('cart:updated', _updateCartCount);

    // Wishlist count
    _updateWishlistCount();
    window.addEventListener('wishlist:updated', _updateWishlistCount);

    // Vehicle state
    _updateVehicleBanner();
    window.addEventListener('ymm:changed', _updateVehicleBanner);

    // Search
    _initSearch(root);

    // Active nav highlight
    _markActiveNav();

    // Expose categories globally for pages that need it
    window.CATEGORIES = CATEGORIES;
  }

  function _updateAuth(root) {
    const session = window.Auth?.getSession?.();
    document.querySelectorAll('.auth-account-link').forEach(el => {
      el.style.display = session ? '' : 'none';
    });
    document.querySelectorAll('.auth-login-link').forEach(el => {
      el.style.display = session ? 'none' : '';
    });
    if (session) {
      const nameEl = document.getElementById('auth-user-name');
      if (nameEl) nameEl.textContent = session.name;
    }
  }

  function _updateCartCount() {
    const count = window.Cart?.getCount?.() || 0;
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  }

  function _updateWishlistCount() {
    const count = window.Wishlist?.getCount?.() || 0;
    const badge = document.getElementById('wishlist-count');
    if (!badge) return;
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  }

  function _updateVehicleBanner() {
    const state = window.VehicleDB?.getState?.();
    const el = document.getElementById('header-vb-text');
    const banner = document.getElementById('header-vehicle-compact');
    if (!el || !banner) return;
    if (state?.year && state?.makeName && state?.modelName) {
      el.textContent = `${state.year} ${state.makeName} ${state.modelName}`;
      banner.classList.remove('empty');
    } else {
      el.textContent = 'Select Vehicle';
      banner.classList.add('empty');
    }
  }

  let _searchTimeout;
  function _initSearch(root) {
    const input   = document.getElementById('header-search-input');
    const results = document.getElementById('header-search-results');
    if (!input || !results) return;

    input.addEventListener('input', () => {
      clearTimeout(_searchTimeout);
      const q = input.value.trim();
      if (q.length < 2) { results.classList.remove('open'); return; }
      _searchTimeout = setTimeout(() => _renderSearch(q, root, results), 180);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitSearch(root);
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !results.contains(e.target)) {
        results.classList.remove('open');
      }
    });
  }

  function _renderSearch(q, root, results) {
    const db     = window.InventoryDB;
    const parts  = db ? db.search(q).slice(0, 6) : [];
    if (!parts.length) {
      results.innerHTML = `<div style="padding:20px;text-align:center;color:var(--c-text-3);font-size:.85rem">
        <i class="fa-solid fa-magnifying-glass" style="margin-right:8px"></i>No results for "${q}"
      </div>`;
      results.classList.add('open'); return;
    }
    results.innerHTML = parts.map(p => `
      <a href="${root}product.html?id=${p.id}" class="search-result-item">
        <div class="search-result-img">
          ${p.thumbnail
            ? `<img src="${p.thumbnail}" alt="${p.name}">`
            : `<i class="fa-solid fa-gear"></i>`}
        </div>
        <div class="search-result-info" style="flex:1">
          <div class="name">${p.name}</div>
          <div class="meta">${p.brand} &middot; <span style="font-family:var(--font-mono)">${p.partNumber}</span></div>
        </div>
        <div class="price" style="font-family:var(--font-display);font-weight:700;color:var(--c-accent)">
          $${Number(p.price).toFixed(2)}
        </div>
      </a>`).join('') +
      `<div style="padding:12px 16px;border-top:1px solid var(--c-border)">
        <a href="${root}catalog.html?q=${encodeURIComponent(q)}"
           style="font-size:.82rem;color:var(--c-accent);display:flex;align-items:center;gap:6px">
          <i class="fa-solid fa-arrow-right"></i> See all results for "${q}"
        </a>
      </div>`;
    results.classList.add('open');
  }

  function submitSearch(root) {
    root = root || _root();
    const q = document.getElementById('header-search-input')?.value?.trim();
    if (q) window.location.href = `${root}catalog.html?q=${encodeURIComponent(q)}`;
  }

  function _markActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-cat, .header-action-btn, .mobile-nav a').forEach(el => {
      const href = el.getAttribute('href') || '';
      if (href && href !== '#' && path && href.includes(path.replace('.html', ''))) {
        el.classList.add('active');
      }
    });
  }

  return { init, submitSearch, updateCart: _updateCartCount, updateVehicle: _updateVehicleBanner };
})();

window.SiteHeader = SiteHeader;
