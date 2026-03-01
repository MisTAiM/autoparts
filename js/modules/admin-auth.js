/**
 * MODULE: admin-auth.js
 * Admin authentication — separate from customer accounts.
 * Default credentials: admin / autoparts2025
 * Change immediately after first login via admin settings.
 *
 * Production: replace with server-side session + hashed passwords in DB.
 */

const AdminAuth = (() => {
  const ADMINS_KEY = 'ap_admin_users';
  const SESSION_KEY = 'ap_admin_session';

  function _hash(str) {
    let h = 0; for (let i = 0; i < str.length; i++) { h = Math.imul(31, h) + str.charCodeAt(i) | 0; } return h.toString(36);
  }

  function _getAdmins() {
    try {
      let admins = JSON.parse(localStorage.getItem(ADMINS_KEY));
      if (!admins || admins.length === 0) {
        // Seed default admin on first run
        admins = [{
          id: 'ADMIN-1',
          username: 'admin',
          passwordHash: _hash('autoparts2025'),
          name: 'Owner',
          role: 'owner',
          createdAt: new Date().toISOString(),
        }];
        localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
      }
      return admins;
    } catch(e) { return []; }
  }

  function login(username, password) {
    const admins = _getAdmins();
    const admin  = admins.find(a => a.username === username.toLowerCase());
    if (!admin || admin.passwordHash !== _hash(password)) {
      return { ok: false, error: 'Invalid username or password.' };
    }
    const session = { adminId: admin.id, username: admin.username, name: admin.name, role: admin.role, expiresAt: Date.now() + 8 * 3600000 };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { ok: true, admin: session };
  }

  function logout() { localStorage.removeItem(SESSION_KEY); window.location.href = 'login.html'; }

  function getSession() {
    try {
      const s = JSON.parse(localStorage.getItem(SESSION_KEY));
      if (!s) return null;
      if (Date.now() > s.expiresAt) { localStorage.removeItem(SESSION_KEY); return null; }
      return s;
    } catch(e) { return null; }
  }

  function isLoggedIn() { return !!getSession(); }

  function requireLogin() {
    if (!isLoggedIn()) { window.location.href = 'login.html'; return false; }
    return true;
  }

  function changePassword(username, currentPassword, newPassword) {
    const admins  = _getAdmins();
    const idx     = admins.findIndex(a => a.username === username);
    if (idx === -1) return { ok: false, error: 'User not found.' };
    if (admins[idx].passwordHash !== _hash(currentPassword)) return { ok: false, error: 'Incorrect current password.' };
    admins[idx].passwordHash = _hash(newPassword);
    localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
    return { ok: true };
  }

  function addAdmin(username, password, name, role = 'staff') {
    const admins = _getAdmins();
    if (admins.find(a => a.username === username)) return { ok: false, error: 'Username already exists.' };
    admins.push({ id: 'ADMIN-' + Date.now(), username: username.toLowerCase(), passwordHash: _hash(password), name, role, createdAt: new Date().toISOString() });
    localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
    return { ok: true };
  }

  return { login, logout, getSession, isLoggedIn, requireLogin, changePassword, addAdmin };
})();

window.AdminAuth = AdminAuth;
