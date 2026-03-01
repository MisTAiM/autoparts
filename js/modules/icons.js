/**
 * AutoParts Icon System — v3
 * Custom inline SVG icons. No Font Awesome dependency.
 * All 24x24 viewBox, stroke-based, bold and readable at small sizes.
 */
window.APIcons = (function() {

  const ICONS = {

    // ── BRAKES — vented disc rotor with 8 radial slots ───────────────
    brakes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="3.8"/>
      <line x1="12" y1="3" x2="12" y2="8.2"/>
      <line x1="12" y1="15.8" x2="12" y2="21"/>
      <line x1="3" y1="12" x2="8.2" y2="12"/>
      <line x1="15.8" y1="12" x2="21" y2="12"/>
      <line x1="5.6" y1="5.6" x2="9.3" y2="9.3"/>
      <line x1="14.7" y1="14.7" x2="18.4" y2="18.4"/>
      <line x1="18.4" y1="5.6" x2="14.7" y2="9.3"/>
      <line x1="9.3" y1="14.7" x2="5.6" y2="18.4"/>
    </svg>`,

    // ── ENGINE — spark plug (universally = engine) ──────────────────────
    engine: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <rect x="8" y="2" width="8" height="5" rx="1"/>
      <path d="M9 7 L8 11 L16 11 L15 7"/>
      <rect x="9" y="11" width="6" height="5" rx="0.5"/>
      <path d="M11 16 L10 19"/>
      <path d="M13 16 L14 19"/>
      <line x1="10" y1="19" x2="14" y2="19"/>
      <line x1="11" y1="21" x2="13" y2="21"/>
      <line x1="11" y1="19" x2="10.5" y2="21"/>
      <line x1="13" y1="19" x2="13.5" y2="21"/>
    </svg>`,

    // ── ELECTRICAL — clean bold lightning bolt ────────────────────────
    electrical: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M13 2 L4 13 L12 13 L11 22 L20 11 L12 11 Z"/>
    </svg>`,

    // ── COOLING — radiator: outer frame + 5 horizontal cooling fins ────
    cooling: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="18" rx="1.5"/>
      <line x1="2" y1="7.5" x2="22" y2="7.5"/>
      <line x1="2" y1="11" x2="22" y2="11"/>
      <line x1="2" y1="14.5" x2="22" y2="14.5"/>
      <line x1="2" y1="18" x2="22" y2="18"/>
      <line x1="7" y1="3" x2="7" y2="21"/>
      <line x1="12" y1="3" x2="12" y2="21"/>
      <line x1="17" y1="3" x2="17" y2="21"/>
    </svg>`,

    // ── SUSPENSION — helical coil spring side view ───────────────────────
    suspension: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <line x1="7" y1="2" x2="17" y2="2"/>
      <line x1="7" y1="22" x2="17" y2="22"/>
      <path d="M12 2 Q17 4 17 6.5 Q17 9 7 9 Q7 11.5 17 11.5 Q17 14 7 14 Q7 16.5 17 16.5 Q17 19 12 22"/>
    </svg>`,

    // ── EXHAUST — curved pipe with circular tip outlet + 3 smoke puffs ──
    exhaust: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 18 L3 14 Q3 12 5 12 L14 12 Q16 12 16 10 L16 7"/>
      <circle cx="16" cy="5.5" r="1.5"/>
      <path d="M8 9 Q9 7 8 5"/>
      <path d="M11 8 Q12.5 6 11 4"/>
      <path d="M14 9 Q15.5 7 14 5"/>
    </svg>`,

    // ── FILTERS — clean funnel ────────────────────────────────────────
    filters: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 3 L2 3 L10 12.5 L10 19 L14 21 L14 12.5 Z"/>
    </svg>`,

    // ── DRIVETRAIN — driveshaft: two u-joints + center shaft ───────────
    drivetrain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="4" cy="12" r="3"/>
      <circle cx="20" cy="12" r="3"/>
      <line x1="7" y1="12" x2="17" y2="12"/>
      <line x1="4" y1="9" x2="4" y2="15"/>
      <line x1="20" y1="9" x2="20" y2="15"/>
      <rect x="9" y="10" width="6" height="4" rx="1"/>
    </svg>`,

    // ── FUEL SYSTEM — gas pump ────────────────────────────────────────
    fuel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="11" height="17" rx="1"/>
      <line x1="7" y1="8" x2="10" y2="8"/>
      <line x1="7" y1="11" x2="10" y2="11"/>
      <path d="M14 8 L18 10 L18 12 Q20 12 20 14 L20 17 Q20 19 18 19"/>
    </svg>`,

    // ── BODY & TRIM — side profile sedan with clear roof + wheel arches ─
    body: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 13 L3 13 L5 10 L8 7 L16 7 L19 10 L22 11 L22 13 Z"/>
      <path d="M8 7 L9 13"/>
      <path d="M16 7 L15 13"/>
      <path d="M1 13 Q1 16 3 16 Q5 16 5 13"/>
      <path d="M16 13 Q16 16 19 16 Q22 16 22 13"/>
      <line x1="5" y1="13" x2="16" y2="13"/>
    </svg>`,

    // ── LIGHTING — circle headlight + diverging beam rays ──────────────
    lighting: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="7" cy="12" r="4"/>
      <circle cx="7" cy="12" r="1.5"/>
      <line x1="11" y1="9" x2="22" y2="5"/>
      <line x1="11" y1="12" x2="22" y2="12"/>
      <line x1="11" y1="15" x2="22" y2="19"/>
    </svg>`,

    // ── A/C & HEATING — clean 6-arm snowflake with V-tips ──────────────
    ac: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="2" x2="12" y2="22"/>
      <line x1="2.7" y1="7" x2="21.3" y2="17"/>
      <line x1="21.3" y1="7" x2="2.7" y2="17"/>
      <polyline points="9.5,4.5 12,7 14.5,4.5"/>
      <polyline points="9.5,19.5 12,17 14.5,19.5"/>
      <polyline points="4,9.5 6.5,8.5 5.5,6"/>
      <polyline points="20,14.5 17.5,15.5 18.5,18"/>
      <polyline points="20,9.5 17.5,8.5 18.5,6"/>
      <polyline points="4,14.5 6.5,15.5 5.5,18"/>
    </svg>`,

    // ── TRUST BADGES ──────────────────────────────────────────────────
    shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22 C12 22 4 18 4 12 L4 5 L12 2 L20 5 L20 12 C20 18 12 22 12 22 Z"/>
      <path d="M9 12 L11 14 L15 10"/>
    </svg>`,

    genuine: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2 L14.4 7.2 L20 8 L16 12 L16.9 17.6 L12 15 L7.1 17.6 L8 12 L4 8 L9.6 7.2 Z"/>
      <path d="M9 12 L11 14 L15 10"/>
    </svg>`,

    verified: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2 L14 6.5 L19 7.3 L15.5 10.7 L16.4 16 L12 13.5 L7.6 16 L8.5 10.7 L5 7.3 L10 6.5 Z"/>
      <path d="M9.5 11.5 L11 13 L14.5 10"/>
    </svg>`,

    engineParts: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <rect x="6" y="3" width="12" height="9" rx="1.5"/>
      <line x1="6" y1="7" x2="18" y2="7"/>
      <line x1="6" y1="9.5" x2="18" y2="9.5"/>
      <line x1="4" y1="5" x2="6" y2="5"/>
      <line x1="18" y1="5" x2="20" y2="5"/>
      <path d="M9 12 L9 15 L12 17 L15 15 L15 12"/>
      <line x1="12" y1="17" x2="12" y2="20"/>
      <circle cx="12" cy="21" r="1.2" fill="currentColor" stroke="none"/>
    </svg>`,
  };

  function get(id, opts = {}) {
    const svg = ICONS[id] || ICONS['engine'];
    const size = opts.size || '1em';
    const cls  = opts.class || '';
    const sty  = opts.style || '';
    return svg.replace('<svg ', `<svg width="${size}" height="${size}" class="ap-icon ${cls}" style="${sty}" `);
  }

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
    'fa-bolt':            'electrical',
  };

  function patchFA(root) {
    root = root || document;
    Object.entries(FA_MAP).forEach(([faClass, iconId]) => {
      root.querySelectorAll(`i.${faClass}, i.fa-solid.${faClass}, i.fa-regular.${faClass}`).forEach(el => {
        const span = document.createElement('span');
        span.className = 'ap-icon-wrap';
        span.innerHTML = get(iconId, { size: '1em', style: 'vertical-align:-.125em;display:inline-block' });
        el.parentNode.replaceChild(span, el);
      });
    });
  }

  (function injectCSS() {
    const style = document.createElement('style');
    style.textContent = `
      .ap-icon { display:inline-block; vertical-align:-.125em; flex-shrink:0; }
      .ap-icon-wrap { display:inline-flex; align-items:center; justify-content:center; }
    `;
    document.head.appendChild(style);
  })();

  return { get, patchFA, ICONS, FA_MAP };
})();
