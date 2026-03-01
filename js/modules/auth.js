/**
 * MODULE: auth.js
 * Customer authentication — register, login, session, profile.
 * Storage: localStorage (swap fetch() calls to your backend API for production)
 *
 * Production swap:
 *   register()  → POST /api/auth/register
 *   login()     → POST /api/auth/login
 *   logout()    → POST /api/auth/logout
 *   getProfile()→ GET  /api/account/profile
 *   saveOrder() → POST /api/account/orders
 */

// Requires: security.js loaded before auth.js
const Auth = (() => {
  const USERS_KEY   = 'ap_users';
  const SESSION_KEY = 'ap_session';
  const ORDERS_KEY  = 'ap_customer_orders';

  // ─── Helpers ────────────────────────────────────────────
  function _getUsers()    { try { return JSON.parse(localStorage.getItem(USERS_KEY))  || []; } catch(e) { return []; } }
  function _saveUsers(u)  { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
  function _getSession()  { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch(e) { return null; } }
  function _saveSession(s){ localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
  function _clearSession(){ localStorage.removeItem(SESSION_KEY); }
  function _hash(str) {
    // Demo hash — replace with bcrypt on a real backend
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) { h = (h ^ str.charCodeAt(i)) * 0x01000193 >>> 0; }
    return h.toString(36);
  }

  // ─── Register ────────────────────────────────────────────
  function register({ firstName, lastName, email, password, phone = '' }) {
    const users = _getUsers();
    // Sanitize inputs
    if (window.Security) {
      firstName = Security.sanitizeText(firstName, 50);
      lastName  = Security.sanitizeText(lastName, 50);
      email     = Security.sanitizeEmail(email);
      phone     = Security.sanitizePhone(phone);
    }
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const user = {
      id:        'U-' + Date.now().toString(36).toUpperCase(),
      firstName, lastName, email: email.toLowerCase(), phone,
      passwordHash: _hash(password),
      createdAt: new Date().toISOString(),
      savedVehicles: [],
    };
    users.push(user);
    _saveUsers(users);
    _startSession(user);
    return { ok: true, user: _sanitize(user) };
  }

  // ─── Login ───────────────────────────────────────────────
  function login(email, password) {
    // Rate limiting
    if (window.Security && Security.isLocked('customer')) {
      const ms = Security.lockoutRemaining('customer');
      return { ok: false, error: `Too many attempts. Try again in ${Security.formatLockoutTime(ms)}.`, locked: true };
    }
    const users = _getUsers();
    const user  = users.find(u => u.email === (window.Security ? Security.sanitizeEmail(email) : email.toLowerCase()));
    if (!user || user.passwordHash !== _hash(password)) {
      if (window.Security) {
        const count = Security.recordFailedAttempt('customer');
        const rem   = Security.attemptsRemaining('customer');
        if (rem === 0) return { ok: false, error: 'Account locked for 15 minutes due to too many failed attempts.', locked: true };
        return { ok: false, error: `Invalid email or password. ${rem} attempt${rem !== 1 ? 's' : ''} remaining.` };
      }
      return { ok: false, error: 'Invalid email or password.' };
    }
    if (window.Security) Security.clearAttempts('customer');
    _startSession(user);
    return { ok: true, user: _sanitize(user) };
  }

  function _startSession(user) {
    _saveSession({ userId: user.id, email: user.email, name: user.firstName, expiresAt: Date.now() + 7 * 86400000 });
  }

  // ─── Logout ─────────────────────────────────────────────
  function logout() { _clearSession(); window.dispatchEvent(new Event('auth:logout')); }

  // ─── Session ─────────────────────────────────────────────
  function getSession() {
    const s = _getSession();
    if (!s) return null;
    if (Date.now() > s.expiresAt) { _clearSession(); return null; }
    return s;
  }

  function isLoggedIn() { return !!getSession(); }

  function requireLogin(redirectUrl = 'login.html') {
    if (!isLoggedIn()) { window.location.href = redirectUrl + '?redirect=' + encodeURIComponent(window.location.href); return false; }
    return true;
  }

  // ─── Profile ─────────────────────────────────────────────
  function getProfile() {
    const s = getSession();
    if (!s) return null;
    const user = _getUsers().find(u => u.id === s.userId);
    return user ? _sanitize(user) : null;
  }

  function updateProfile(updates) {
    const s = getSession();
    if (!s) return { ok: false, error: 'Not logged in.' };
    const users = _getUsers();
    const idx   = users.findIndex(u => u.id === s.userId);
    if (idx === -1) return { ok: false, error: 'User not found.' };
    const allowed = ['firstName', 'lastName', 'phone'];
    allowed.forEach(k => { if (updates[k] !== undefined) users[idx][k] = updates[k]; });
    if (updates.newPassword && _hash(updates.currentPassword) === users[idx].passwordHash) {
      users[idx].passwordHash = _hash(updates.newPassword);
    } else if (updates.newPassword) {
      return { ok: false, error: 'Current password is incorrect.' };
    }
    _saveUsers(users);
    return { ok: true };
  }

  // ─── Saved Vehicles ──────────────────────────────────────
  function saveVehicle(vehicle) {
    const s = getSession();
    if (!s) return;
    const users = _getUsers();
    const idx   = users.findIndex(u => u.id === s.userId);
    if (idx === -1) return;
    if (!users[idx].savedVehicles) users[idx].savedVehicles = [];
    const exists = users[idx].savedVehicles.find(v => v.year === vehicle.year && v.makeId === vehicle.makeId && v.modelId === vehicle.modelId);
    if (!exists) { users[idx].savedVehicles.unshift({ ...vehicle, savedAt: new Date().toISOString() }); }
    _saveUsers(users);
  }

  function getSavedVehicles() {
    const p = getProfile();
    return p?.savedVehicles || [];
  }

  function removeVehicle(makeId, modelId, year) {
    const s = getSession();
    if (!s) return;
    const users = _getUsers();
    const idx   = users.findIndex(u => u.id === s.userId);
    if (idx === -1) return;
    users[idx].savedVehicles = (users[idx].savedVehicles || []).filter(v => !(v.makeId === makeId && v.modelId === modelId && v.year === year));
    _saveUsers(users);
  }

  // ─── Orders ──────────────────────────────────────────────
  function saveOrder(order) {
    const s = getSession();
    if (!s) return;
    const all = _getAllOrders();
    order.customerId  = s.userId;
    order.customerEmail = s.email;
    all.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
    // Also save to admin orders
    const adminOrders = JSON.parse(localStorage.getItem('ap_admin_orders') || '[]');
    if (!adminOrders.find(o => o.orderNumber === order.orderNumber)) {
      order.status = 'pending';
      adminOrders.unshift(order);
      localStorage.setItem('ap_admin_orders', JSON.stringify(adminOrders));
    }
  }

  function _getAllOrders() { try { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; } catch(e) { return []; } }

  function getMyOrders() {
    const s = getSession();
    if (!s) return [];
    return _getAllOrders().filter(o => o.customerId === s.userId);
  }

  function getOrderById(orderNumber) {
    return _getAllOrders().find(o => o.orderNumber === orderNumber) || null;
  }

  // ─── Warranties ──────────────────────────────────────────
  function getWarranties() {
    const orders = getMyOrders();
    const warranties = [];
    orders.forEach(order => {
      (order.items || []).forEach(item => {
        if (item.specs?.Warranty) {
          const placed = new Date(order.createdAt);
          const warrantyText = item.specs.Warranty;
          const years = parseInt(warrantyText) || 0;
          const expiresAt = new Date(placed);
          expiresAt.setFullYear(expiresAt.getFullYear() + years);
          warranties.push({
            orderNumber:  order.orderNumber,
            orderedDate:  order.createdAt,
            partName:     item.name,
            partNumber:   item.partNumber,
            brand:        item.brand,
            warrantyText,
            expiresAt:    years > 0 ? expiresAt.toISOString() : null,
            isActive:     years > 0 && new Date() < expiresAt,
          });
        }
      });
    });
    return warranties;
  }

  // ─── Pending Cores ───────────────────────────────────────
  function getPendingCores() {
    const orders = getMyOrders();
    const cores = [];
    orders.forEach(order => {
      (order.items || []).forEach(item => {
        if ((item.coreCharge || 0) > 0) {
          cores.push({
            orderNumber: order.orderNumber,
            orderedDate: order.createdAt,
            partName:    item.name,
            partNumber:  item.partNumber,
            brand:       item.brand,
            coreCharge:  item.coreCharge,
            qty:         item.qty,
            totalCore:   item.coreCharge * item.qty,
            deadline:    (() => { const d = new Date(order.createdAt); d.setDate(d.getDate() + 90); return d.toISOString(); })(),
            returned:    item.coreReturned || false,
          });
        }
      });
    });
    return cores;
  }

  function markCoreReturned(orderNumber, partNumber) {
    const all = _getAllOrders();
    const idx = all.findIndex(o => o.orderNumber === orderNumber);
    if (idx === -1) return;
    const iIdx = all[idx].items.findIndex(i => i.partNumber === partNumber);
    if (iIdx !== -1) all[idx].items[iIdx].coreReturned = true;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
  }

  // ─── Util ────────────────────────────────────────────────
  function _sanitize(user) {
    const { passwordHash, ...safe } = user;
    return safe;
  }

  // ─── UI Helpers ──────────────────────────────────────────
  function updateNavForAuth() {
    const s = getSession();
    const acctLinks = document.querySelectorAll('.auth-account-link');
    const loginLinks = document.querySelectorAll('.auth-login-link');
    const nameSpans  = document.querySelectorAll('.auth-user-name');
    acctLinks.forEach(el  => el.style.display = s ? '' : 'none');
    loginLinks.forEach(el => el.style.display = s ? 'none' : '');
    nameSpans.forEach(el  => el.textContent = s ? s.name : '');
  }

  return {
    register, login, logout, getSession, isLoggedIn, requireLogin,
    getProfile, updateProfile,
    saveVehicle, getSavedVehicles, removeVehicle,
    saveOrder, getMyOrders, getOrderById,
    getWarranties, getPendingCores, markCoreReturned,
    updateNavForAuth,
  };
})();

window.Auth = Auth;
