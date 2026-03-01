/**
 * MODULE: stripe-integration.js
 * Stripe payment processing wrapper.
 *
 * SETUP:
 *   1. Create a Stripe account at stripe.com
 *   2. Replace PUBLISHABLE_KEY below with your real key (pk_live_... or pk_test_...)
 *   3. For real charges you NEED a backend endpoint — Stripe requires server-side secret key
 *   4. See BACKEND NOTES below for what your server endpoint should do
 *
 * BACKEND NOTES (Node.js/Express example):
 *   POST /api/payment/create-intent
 *     body: { amount: 1500, currency: 'usd', metadata: { orderNumber: 'AP-xxx' } }
 *     → returns { clientSecret: 'pi_xxx_secret_xxx' }
 *
 *   POST /api/payment/confirm
 *     body: { paymentIntentId, orderNumber }
 *     → charges card, returns { success: true, chargeId }
 */

const StripeIntegration = (() => {

  // ─── CONFIG ─────────────────────────────────────────────
  // Replace with your real Stripe publishable key
  const PUBLISHABLE_KEY = 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY';

  // Your backend endpoint (required for actual charges)
  const BACKEND_URL = '/api/payment';

  let _stripe   = null;
  let _elements = null;
  let _cardEl   = null;
  let _mounted  = false;

  // ─── Init ────────────────────────────────────────────────
  function init() {
    if (!window.Stripe) { console.warn('[Stripe] Stripe.js not loaded'); return false; }
    if (PUBLISHABLE_KEY.includes('YOUR_STRIPE')) {
      console.warn('[Stripe] No publishable key set — running in demo mode');
      return false;
    }
    _stripe = Stripe(PUBLISHABLE_KEY);
    return true;
  }

  // ─── Mount card element ──────────────────────────────────
  function mountCardElement(containerId) {
    if (!_stripe) {
      // Fall back to manual inputs
      const container = document.getElementById(containerId);
      if (container) container.style.display = 'none';
      const manual = document.getElementById('manual-card');
      if (manual) manual.style.display = 'block';
      return false;
    }

    _elements = _stripe.elements({
      appearance: {
        theme: 'night',
        variables: {
          colorPrimary:    '#e8a020',
          colorBackground: '#1a1f26',
          colorText:       '#e8eaf0',
          colorDanger:     '#ef4444',
          fontFamily:      'IBM Plex Sans, sans-serif',
          borderRadius:    '6px',
        },
      },
    });

    _cardEl = _elements.create('card', {
      hidePostalCode: false,
    });

    const container = document.getElementById(containerId);
    if (container) {
      _cardEl.mount(container);
      _mounted = true;
      _cardEl.on('change', ({ error }) => {
        const errEl = document.getElementById('stripe-card-errors');
        if (errEl) errEl.textContent = error ? error.message : '';
      });
    }
    return true;
  }

  // ─── Create payment intent (calls your backend) ──────────
  async function createPaymentIntent(amountDollars, orderNumber) {
    if (PUBLISHABLE_KEY.includes('YOUR_STRIPE')) return { ok: false, demo: true };
    try {
      const res = await fetch(`${BACKEND_URL}/create-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount:   Math.round(amountDollars * 100), // Stripe uses cents
          currency: 'usd',
          metadata: { orderNumber },
        }),
      });
      if (!res.ok) throw new Error('Backend error: ' + res.status);
      return await res.json();
    } catch(e) {
      return { ok: false, error: e.message };
    }
  }

  // ─── Confirm payment ─────────────────────────────────────
  async function confirmPayment(clientSecret, billingDetails) {
    if (!_stripe || !_cardEl) return { ok: false, demo: true };
    const { error, paymentIntent } = await _stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: _cardEl,
        billing_details: billingDetails,
      },
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, paymentIntentId: paymentIntent.id, last4: null };
  }

  // ─── Full charge flow ────────────────────────────────────
  /**
   * Complete payment flow: create intent → confirm → return result
   * @param {number} totalDollars
   * @param {string} orderNumber
   * @param {Object} billingDetails { name, email, address: { line1, city, state, postal_code, country } }
   */
  async function charge(totalDollars, orderNumber, billingDetails) {
    // Demo mode (no Stripe key) — simulate success
    if (PUBLISHABLE_KEY.includes('YOUR_STRIPE')) {
      await new Promise(r => setTimeout(r, 1200));
      return { ok: true, demo: true, last4: '4242', brand: 'Visa', chargeId: 'ch_demo_' + Date.now() };
    }

    const intent = await createPaymentIntent(totalDollars, orderNumber);
    if (!intent.clientSecret) return { ok: false, error: intent.error || 'Could not create payment.' };

    const result = await confirmPayment(intent.clientSecret, billingDetails);
    if (!result.ok) return result;

    return { ok: true, last4: result.last4, chargeId: result.paymentIntentId };
  }

  // ─── Get manual card values (fallback) ──────────────────
  function getManualCardValues() {
    return {
      number:  document.getElementById('card-number')?.value || '',
      expiry:  document.getElementById('card-expiry')?.value || '',
      cvc:     document.getElementById('card-cvc')?.value    || '',
      name:    document.getElementById('card-name')?.value   || '',
    };
  }

  function isReady() { return _mounted || !PUBLISHABLE_KEY.includes('YOUR_STRIPE'); }

  return { init, mountCardElement, charge, getManualCardValues, isReady };
})();

window.StripeIntegration = StripeIntegration;
