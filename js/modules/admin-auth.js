/**
 * MODULE: admin-auth.js
 * Admin authentication with brute force protection.
 * Default: admin / autoparts2025 — CHANGE IMMEDIATELY in Admin Settings.
 */
const AdminAuth = (() => {
  const ADMINS_KEY  = 'ap_admin_users';
  const SESSION_KEY = 'ap_admin_session';
  const LOG_KEY     = 'ap_admin_log';
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_MS   = 15 * 60 * 1000; // 15 min

  // ─── Hashing (demo only — use bcrypt server-side in production) ───
  function _hash(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 0x01000193) >>> 0;
    }
    return h.toString(36);
  }

  // ─── Admins store ────────────────────────────────────────
  function _getAdmins() {
    try {
      let admins = JSON.parse(localStorage.getItem(ADMINS_KEY));
      if (!admins || admins.length === 0) {
        admins = [{
          id: 'ADMIN-1',
          username: 'admin',
          passwordHash: _hash('autoparts2025'),
          name: 'Owner',
          role: 'owner',
          createdAt: new Date().toISOString(),
          mustChangePassword: true,
        }];
        localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
      }
      return admins;
    } catch(e) { return []; }
  }

  function _saveAdmins(a) { localStorage.setItem(ADMINS_KEY, JSON.stringify(a)); }

  // ─── Brute force protection ──────────────────────────────
  const LOCK_KEY = 'ap_admin_lock';

  function _getLock() {
    try { return JSON.parse(localStorage.getItem(LOCK_KEY)) || {}; } catch { return {}; }
  }

  function _checkLock() {
    const lock = _getLock();
    if (!lock.until) return null;
    if (Date.now() > lock.until) { localStorage.removeItem(LOCK_KEY); return null; }
    return lock;
  }

  function _recordFail() {
    const lock = _getLock();
    const now  = Date.now();
    lock.attempts = ((lock.attempts || []).filter(t => now - t < 10 * 60 * 1000));
    lock.attempts.push(now);
    if (lock.attempts.length >= MAX_ATTEMPTS) lock.until = now + LOCKOUT_MS;
    localStorage.setItem(LOCK_KEY, JSON.stringify(lock));
    return lock;
  }

  function _clearLock() { localStorage.removeItem(LOCK_KEY); }

  // ─── Activity log ────────────────────────────────────────
  function _log(action, detail = '') {
    try {
      const log = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
      log.unshift({ action, detail, at: new Date().toISOString() });
      localStorage.setItem(LOG_KEY, JSON.stringify(log.slice(0, 200)));
    } catch {}
  }

  function getLog() {
    try { return JSON.parse(localStorage.getItem(LOG_KEY) || '[]'); } catch { return []; }
  }

  // ─── Login ───────────────────────────────────────────────
  function login(username, password) {
    const lock = _checkLock();
    if (lock) {
      const mins = Math.ceil((lock.until - Date.now()) / 60000);
      return { ok: false, error: `Too many attempts. Try again in ${mins} minute${mins !== 1 ? 's' : ''}.`, locked: true };
    }

    const admins = _getAdmins();
    const admin  = admins.find(a => a.username === username.toLowerCase().trim());

    if (!admin || admin.passwordHash !== _hash(password)) {
      const lockData = _recordFail();
      const remaining = MAX_ATTEMPTS - lockData.attempts.length;
      _log('LOGIN_FAIL', username);
      if (remaining <= 0) {
        return { ok: false, error: 'Account locked for 15 minutes due to too many failed attempts.', locked: true };
      }
      return { ok: false, error: `Invalid credentials. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.` };
    }

    _clearLock();
    const session = {
      adminId: admin.id, username: admin.username,
      name: admin.name, role: admin.role,
      mustChangePassword: admin.mustChangePassword || false,
      expiresAt: Date.now() + 8 * 3600000,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    _log('LOGIN_OK', admin.username);
    return { ok: true, admin: session };
  }

  // ─── Session ─────────────────────────────────────────────
  function logout() {
    _log('LOGOUT');
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
  }

  function getSession() {
    try {
      const s = JSON.parse(localStorage.getItem(SESSION_KEY));
      if (!s) return null;
      if (Date.now() > s.expiresAt) { localStorage.removeItem(SESSION_KEY); return null; }
      return s;
    } catch(e) { return null; }
  }

  function isLoggedIn() { return !!getSession(); }

  function requireAdmin() {
    if (!isLoggedIn()) { window.location.href = 'login.html'; return false; }
    return true;
  }

  // ─── Password management ─────────────────────────────────
  function changePassword(username, currentPassword, newPassword) {
    if (!newPassword || newPassword.length < 8) return { ok: false, error: 'Password must be at least 8 characters.' };
    const admins = _getAdmins();
    const idx    = admins.findIndex(a => a.username === username);
    if (idx === -1) return { ok: false, error: 'User not found.' };
    if (admins[idx].passwordHash !== _hash(currentPassword)) return { ok: false, error: 'Incorrect current password.' };
    admins[idx].passwordHash = _hash(newPassword);
    admins[idx].mustChangePassword = false;
    _saveAdmins(admins);
    _log('PASSWORD_CHANGE', username);
    // Update session
    const s = getSession();
    if (s) { s.mustChangePassword = false; localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
    return { ok: true };
  }

  function addAdmin(username, password, name, role = 'staff') {
    if (!username || !password || password.length < 8) return { ok: false, error: 'Username and password (8+ chars) required.' };
    const admins = _getAdmins();
    if (admins.find(a => a.username === username.toLowerCase())) return { ok: false, error: 'Username already exists.' };
    admins.push({
      id: 'ADMIN-' + Date.now(), username: username.toLowerCase().trim(),
      passwordHash: _hash(password), name, role,
      createdAt: new Date().toISOString(), mustChangePassword: false,
    });
    _saveAdmins(admins);
    _log('ADMIN_ADDED', username);
    return { ok: true };
  }

  function getAdmins() {
    return _getAdmins().map(({ passwordHash, ...a }) => a);
  }

  function removeAdmin(adminId) {
    const s = getSession();
    if (s?.adminId === adminId) return { ok: false, error: 'Cannot remove yourself.' };
    const admins = _getAdmins().filter(a => a.id !== adminId);
    _saveAdmins(admins);
    _log('ADMIN_REMOVED', adminId);
    return { ok: true };
  }

  // ─── Store settings ──────────────────────────────────────
  function getSettings() {
    try { return JSON.parse(localStorage.getItem('ap_store_settings') || '{}'); } catch { return {}; }
  }

  function saveSettings(updates) {
    const current = getSettings();
    const merged  = { ...current, ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem('ap_store_settings', JSON.stringify(merged));
    _log('SETTINGS_UPDATED');
    return { ok: true };
  }

  return {
    login, logout, getSession, isLoggedIn, requireAdmin,
    changePassword, addAdmin, getAdmins, removeAdmin,
    getSettings, saveSettings, getLog,
  };
})();

window.AdminAuth = AdminAuth;
