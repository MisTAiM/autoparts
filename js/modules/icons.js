/**
 * AutoParts Icon System
 * Custom inline SVG icons for automotive categories and trust badges
 * Replaces Font Awesome Pro icons that aren't available in free tier
 */
window.APIcons = (function() {

  // All icons are 24x24 viewBox SVGs, stroke-based for crisp rendering
  const ICONS = {

    // ── Automotive Categories ──────────────────────────────────────────
    engine: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="8" width="4" height="8" rx="1"/>
      <path d="M7 10h3l2-2h4l2 2v4l-2 2h-4l-2-2H7"/>
      <path d="M17 10h3v4h-3"/>
      <path d="M7 12H3"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>
    </svg>`,

    suspension: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 3c0 0 1 1.5 1 3s-1 3-1 3 1 1.5 1 3-1 3-1 3"/>
      <path d="M12 3c0 0 1 1.5 1 3s-1 3-1 3 1 1.5 1 3-1 3-1 3"/>
      <path d="M16 3c0 0 1 1.5 1 3s-1 3-1 3 1 1.5 1 3-1 3-1 3"/>
      <line x1="6" y1="3" x2="18" y2="3"/>
      <line x1="6" y1="21" x2="18" y2="21"/>
    </svg>`,

    brakes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>
      <path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>
    </svg>`,

    electrical: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M13 2L4.5 13.5H12L11 22l8.5-11.5H12L13 2Z"/>
    </svg>`,

    cooling: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
      <path d="M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/>
      <path d="M12 9V6M12 18v-3M9 12H6M18 12h-3"/>
    </svg>`,

    exhaust: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 17h6a2 2 0 0 0 2-2v-4a2 2 0 0 1 2-2h5"/>
      <circle cx="20" cy="9" r="2"/>
      <path d="M11 7c.5-1 1.5-2 2.5-2s1.5.5 2 1.5"/>
      <path d="M14.5 4c.5-1 1-1.5 1.5-1.5"/>
      <path d="M17 5.5c.3-.7.8-1 1.2-1"/>
    </svg>`,

    filters: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>`,

    drivetrain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="12" r="3"/>
      <path d="M9 12h6"/>
      <path d="M6 9V5l3-2"/>
      <path d="M18 9V5l-3-2"/>
      <path d="M6 15v4l3 2"/>
      <path d="M18 15v4l-3 2"/>
    </svg>`,

    fuel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 22h12V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v18Z"/>
      <path d="M15 11h.01"/>
      <path d="M15 7l4 2v2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4"/>
      <line x1="7" y1="7" x2="11" y2="7"/>
      <line x1="7" y1="11" x2="11" y2="11"/>
    </svg>`,

    body: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v5h-2"/>
      <circle cx="9" cy="17" r="2"/>
      <circle cx="19" cy="17" r="2"/>
      <path d="M17 5H9.5L7 10H21v3a2 2 0 0 1-2 2h-2"/>
    </svg>`,

    lighting: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
      <path d="M9 18h6"/>
      <path d="M10 22h4"/>
    </svg>`,

    ac: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 12h20"/>
      <path d="M12 2v20"/>
      <path d="M5.6 5.6l12.8 12.8"/>
      <path d="M18.4 5.6L5.6 18.4"/>
      <circle cx="12" cy="12" r="2.5"/>
    </svg>`,

    // ── Trust & Verification Badges ────────────────────────────────────
    genuine: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 14.1l-4.8 2.5.9-5.3L4.3 7.6l5.3-.8L12 2Z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>`,

    verified: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L6.2 6.2l4-.6L12 2Z"/>
      <path d="M10.5 11.5l1.5 1.5 3-3"/>
    </svg>`,

    shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>`,

    // ── Engine Parts (specific sub-category) ──────────────────────────
    engineParts: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 10h2l1-2h4l1 2h2l1-2h4l1 2h2"/>
      <path d="M3 14h2l1 2h4l1-2h2l1 2h4l1-2h2"/>
      <rect x="5" y="10" width="4" height="4" rx=".5"/>
      <rect x="15" y="10" width="4" height="4" rx=".5"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>
    </svg>`,
  };

  /**
   * Get SVG markup for a given icon id
   * @param {string} id - icon identifier
   * @param {object} opts - { size, class, style }
   */
  function get(id, opts = {}) {
    const svg = ICONS[id] || ICONS['engine'];
    const size = opts.size || '1em';
    const cls  = opts.class || '';
    const sty  = opts.style || '';
    // Inject size and class into the SVG tag
    return svg.replace('<svg ', `<svg width="${size}" height="${size}" class="ap-icon ${cls}" style="${sty}" `);
  }

  /**
   * Map FA class name → icon id
   */
  const FA_MAP = {
    'fa-engine':          'engine',
    'fa-car-bump':        'suspension',
    'fa-circle-dot':      'brakes',
    'fa-temperature-low': 'cooling',
    'fa-wind':            'exhaust',
    'fa-filter':          'filters',
    'fa-gears':           'drivetrain',
    'fa-gas-pump':        'fuel',
    'fa-car-side':        'body',
    'fa-lightbulb':       'lighting',
    'fa-snowflake':       'ac',
    'fa-shield-check':    'shield',
    'fa-shield-halved':   'shield',
  };

  /**
   * Replace broken FA icons in a container with inline SVGs
   * Call after DOM is ready
   */
  function patchFA(root) {
    root = root || document;
    Object.entries(FA_MAP).forEach(([faClass, iconId]) => {
      root.querySelectorAll(`i.${faClass}, i.fa-solid.${faClass}, i.fa-regular.${faClass}`).forEach(el => {
        const span = document.createElement('span');
        span.className = `ap-icon-wrap ${el.className.replace(/fa-solid|fa-regular|fa-brands/g, '').trim()}`;
        span.innerHTML = get(iconId, { size: '1em', style: 'vertical-align:-.125em;display:inline-block' });
        el.parentNode.replaceChild(span, el);
      });
    });
  }

  /**
   * Inject global CSS for ap-icon
   */
  (function injectCSS() {
    const style = document.createElement('style');
    style.textContent = `
      .ap-icon { display:inline-block; vertical-align:-.125em; flex-shrink:0; }
      .ap-icon-wrap { display:inline-flex; align-items:center; justify-content:center; }
      .cat-icon .ap-icon { width:28px; height:28px; }
      .trust-item .ap-icon { width:22px; height:22px; color:var(--c-accent,#f59e0b); }
    `;
    document.head.appendChild(style);
  })();

  return { get, patchFA, ICONS, FA_MAP };
})();
