/**
 * MODULE: security.js
 * Client-side security utilities:
 *   - XSS sanitization (escape HTML before innerHTML)
 *   - Rate limiting / brute-force lockout for login forms
 *   - Input validation helpers
 *   - CSRF token generation (for when you add a backend)
 */
const Security = (() => {

  // ─── HTML Escaping (XSS Prevention) ────────────────────
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Safe innerHTML - escapes all interpolated values
  // Usage: Security.safeHtml`<div>${userInput}</div>`
  function safeHtml(strings, ...values) {
    return strings.reduce((result, str, i) => {
      const val = values[i - 1];
      return result + escapeHtml(val) + str;
    });
  }

  // ─── Brute Force / Rate Limiting ───────────────────────
  const LOCKOUT_KEY    = 'ap_login_attempts';
  const MAX_ATTEMPTS   = 5;
  const LOCKOUT_MS     = 15 * 60 * 1000; // 15 minutes
  const ATTEMPT_WINDOW = 10 * 60 * 1000; // 10 minute rolling window

  function _getAttempts(namespace) {
    try {
      const data = JSON.parse(localStorage.getItem(LOCKOUT_KEY + '_' + namespace) || '{}');
      return data;
    } catch { return {}; }
  }

  function _saveAttempts(namespace, data) {
    localStorage.setItem(LOCKOUT_KEY + '_' + namespace, JSON.stringify(data));
  }

  function recordFailedAttempt(namespace = 'customer') {
    const data = _getAttempts(namespace);
    const now  = Date.now();
    // Clear old attempts outside the window
    data.attempts = (data.attempts || []).filter(t => now - t < ATTEMPT_WINDOW);
    data.attempts.push(now);
    if (data.attempts.length >= MAX_ATTEMPTS) {
      data.lockedUntil = now + LOCKOUT_MS;
    }
    _saveAttempts(namespace, data);
    return data.attempts.length;
  }

  function clearAttempts(namespace = 'customer') {
    localStorage.removeItem(LOCKOUT_KEY + '_' + namespace);
  }

  function isLocked(namespace = 'customer') {
    const data = _getAttempts(namespace);
    if (!data.lockedUntil) return false;
    if (Date.now() > data.lockedUntil) {
      clearAttempts(namespace);
      return false;
    }
    return true;
  }

  function lockoutRemaining(namespace = 'customer') {
    const data = _getAttempts(namespace);
    if (!data.lockedUntil) return 0;
    const remaining = data.lockedUntil - Date.now();
    return remaining > 0 ? remaining : 0;
  }

  function attemptsRemaining(namespace = 'customer') {
    const data = _getAttempts(namespace);
    const now  = Date.now();
    const recent = (data.attempts || []).filter(t => now - t < ATTEMPT_WINDOW);
    return Math.max(0, MAX_ATTEMPTS - recent.length);
  }

  function formatLockoutTime(ms) {
    const mins = Math.ceil(ms / 60000);
    return mins === 1 ? '1 minute' : `${mins} minutes`;
  }

  // ─── Input Sanitization ─────────────────────────────────
  function sanitizeText(str, maxLength = 500) {
    if (!str) return '';
    return String(str).trim().slice(0, maxLength);
  }

  function sanitizeEmail(email) {
    return String(email || '').trim().toLowerCase().slice(0, 254);
  }

  function sanitizePhone(phone) {
    return String(phone || '').replace(/[^\d\-\+\(\)\s\.]/g, '').slice(0, 20);
  }

  function sanitizePrice(val) {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : Math.max(0, Math.round(n * 100) / 100);
  }

  function sanitizeInt(val, min = 0, max = 999999) {
    const n = parseInt(val);
    return isNaN(n) ? min : Math.min(max, Math.max(min, n));
  }

  // ─── Validators ─────────────────────────────────────────
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || ''));
  }

  function isValidZip(zip) {
    return /^\d{5}(-\d{4})?$/.test(String(zip || ''));
  }

  function isValidPhone(phone) {
    return /^[\d\-\+\(\)\s\.]{7,20}$/.test(String(phone || ''));
  }

  function isStrongPassword(pw) {
    return pw && pw.length >= 8;
  }

  // ─── CSRF Token ─────────────────────────────────────────
  // For when you add a real backend — store token in session, send with every mutation
  function generateCsrfToken() {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    const token = Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
    sessionStorage.setItem('ap_csrf', token);
    return token;
  }

  function getCsrfToken() {
    return sessionStorage.getItem('ap_csrf') || generateCsrfToken();
  }

  return {
    escapeHtml, safeHtml,
    recordFailedAttempt, clearAttempts, isLocked, lockoutRemaining, attemptsRemaining, formatLockoutTime,
    sanitizeText, sanitizeEmail, sanitizePhone, sanitizePrice, sanitizeInt,
    isValidEmail, isValidZip, isValidPhone, isStrongPassword,
    generateCsrfToken, getCsrfToken,
  };
})();

window.Security = Security;
