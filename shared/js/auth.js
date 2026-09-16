// VenueLuxe Auth System
// Hybrid Firebase Authentication & Offline LocalStorage Fallback
// Supports intelligent role recognition & redirection (Owner -> /owner/, Admin -> /admin/, Customer -> /customer/)

const AUTH_KEYS = {
  SESSION: 'venueluxe_auth_session',
  ACCOUNTS: 'venueluxe_auth_accounts'
};

const DEFAULT_ACCOUNTS = [
  {
    id: 'owner-1',
    name: 'Vikram Hegde',
    email: 'vikram.hegde@monarchpalace.com',
    phone: '+91 82582 29988',
    password: 'password123',
    role: 'owner',
    business_name: 'Regal Horizons Hospitality'
  },
  {
    id: 'cust-1',
    name: 'Ananya Rao',
    email: 'ananya.rao@example.com',
    phone: '+91 98450 12345',
    password: 'password123',
    role: 'customer'
  },
  {
    id: 'admin-1',
    name: 'Dr. K. R. Shenoy',
    email: 'admin@venueluxe.com',
    phone: '+91 94481 00001',
    password: 'admin123',
    role: 'admin'
  }
];

const Auth = {
  // ─── Internal helpers ───────────────────────────────────────────────────────

  _getAccounts() {
    const raw = localStorage.getItem(AUTH_KEYS.ACCOUNTS);
    if (!raw) {
      localStorage.setItem(AUTH_KEYS.ACCOUNTS, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    try {
      const parsed = JSON.parse(raw);
      // Ensure default accounts exist
      DEFAULT_ACCOUNTS.forEach(def => {
        if (!parsed.some(a => a.email.toLowerCase() === def.email.toLowerCase())) {
          parsed.push(def);
        }
      });
      return parsed;
    } catch {
      return DEFAULT_ACCOUNTS;
    }
  },

  _saveAccounts(accounts) {
    localStorage.setItem(AUTH_KEYS.ACCOUNTS, JSON.stringify(accounts));
  },

  isOwnerUser(user) {
    if (!user) return false;
    if (user.role === 'owner') return true;
    if (user.id === 'owner-1' || user.email === 'vikram.hegde@monarchpalace.com') return true;
    if (window.appStore) {
      const halls = window.appStore.getHalls();
      const owns = halls.some(h => 
        h.owner_id === user.id || 
        (user.email && h.contact?.email && h.contact.email.toLowerCase() === user.email.toLowerCase())
      );
      if (owns) return true;
    }
    return false;
  },

  isAdminUser(user) {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.id === 'admin-1' || user.email === 'admin@venueluxe.com') return true;
    return false;
  },

  async fetchCloudUser(uid, email) {
    if (!window.fbDb) return null;
    try {
      if (uid) {
        const doc = await window.fbDb.collection('users').doc(uid).get();
        if (doc.exists) return doc.data();
      }
      if (email) {
        const q = await window.fbDb.collection('users').where('email', '==', email.trim().toLowerCase()).limit(1).get();
        if (!q.empty) return q.docs[0].data();
      }
    } catch (e) {
      console.warn('[Firestore fetchCloudUser notice]:', e.message);
    }
    return null;
  },

  upgradeToOwner(userId) {
    const accounts = this._getAccounts();
    const acc = accounts.find(a => a.id === userId);
    if (acc) {
      acc.role = 'owner';
      this._saveAccounts(accounts);
    }
    const current = this.getCurrentUser();
    if (current && (current.id === userId || (current.email && acc && current.email.toLowerCase() === acc.email.toLowerCase()))) {
      current.role = 'owner';
      this._setSession(current);
    }
    if (window.appStore) {
      const users = window.appStore.getUsers();
      const u = users.find(x => x.id === userId);
      if (u) {
        u.role = 'owner';
        localStorage.setItem('venueluxe_users', JSON.stringify(users));
      }
    }
    // Persist to Cloud Firestore so any device/browser recognizes this user as owner!
    if (window.fbDb) {
      const updateData = { role: 'owner' };
      if (current?.email) updateData.email = current.email.toLowerCase();
      if (current?.name) updateData.name = current.name;
      window.fbDb.collection('users').doc(userId).set(updateData, { merge: true }).then(() => {
        console.log('[Firestore] Synced owner role to cloud for uid:', userId);
      }).catch(err => {
        console.warn('[Firestore] Error syncing owner role:', err.message);
      });
    }
    return true;
  },

  _setSession(user) {
    let role = user.role;
    if (!role || role === 'customer') {
      if (this.isOwnerUser(user)) role = 'owner';
      else if (this.isAdminUser(user)) role = 'admin';
      else role = 'customer';
    }

    const session = { ...user, role, password: undefined };
    localStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(session));

    // Sync with appStore
    if (window.appStore) {
      const users = window.appStore.getUsers();
      const existingIdx = users.findIndex(u => u.id === user.id || (user.email && u.email?.toLowerCase() === user.email.toLowerCase()));
      if (existingIdx >= 0) {
        users[existingIdx] = { ...users[existingIdx], ...session, role };
      } else {
        users.push({ ...session, role });
      }
      localStorage.setItem('venueluxe_users', JSON.stringify(users));
      localStorage.setItem('venueluxe_current_user', JSON.stringify(session));
      localStorage.setItem('venueluxe_current_role', role);
    }

    window.dispatchEvent(new CustomEvent('authChanged', { detail: { user: session } }));
    return session;
  },

  _clearSession() {
    localStorage.removeItem(AUTH_KEYS.SESSION);
    localStorage.removeItem('venueluxe_current_user');
    localStorage.setItem('venueluxe_current_role', 'guest');
    window.dispatchEvent(new CustomEvent('authChanged', { detail: { user: null } }));
  },

  // ─── Public API ─────────────────────────────────────────────────────────────

  getCurrentUser() {
    const raw = localStorage.getItem(AUTH_KEYS.SESSION);
    return raw ? JSON.parse(raw) : null;
  },

  isLoggedIn() {
    return !!this.getCurrentUser();
  },

  async register({ name, phone, email, password, role = 'customer' }) {
    if (!name || !phone || !email || !password) {
      return { success: false, error: 'All fields are required.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    // 1. Try Firebase Auth
    if (window.fbAuth) {
      try {
        const userCred = await window.fbAuth.createUserWithEmailAndPassword(trimmedEmail, password);
        const fbUser = userCred.user;
        if (fbUser.updateProfile) {
          await fbUser.updateProfile({ displayName: trimmedName });
        }

        const newUser = {
          id: fbUser.uid,
          name: trimmedName,
          phone: trimmedPhone,
          email: trimmedEmail,
          role: role || 'customer',
          created_at: new Date().toISOString().split('T')[0]
        };

        if (window.fbDb) {
          window.fbDb.collection('users').doc(fbUser.uid).set(newUser).catch(err => {
            console.warn('[Firestore] Note saving user profile:', err.message);
          });
        }

        const session = this._setSession(newUser);
        const redirectUrl = session.role === 'owner' ? '/owner/' : (session.role === 'admin' ? '/admin/' : null);
        return { success: true, user: session, redirectUrl };
      } catch (fbErr) {
        console.warn('[Firebase Auth] Register notice:', fbErr.message);
        if (fbErr.code === 'auth/email-already-in-use') {
          return { success: false, error: 'An account with this email already exists in Firebase. Please sign in.' };
        }
      }
    }

    // 2. Local fallback registration
    const accounts = this._getAccounts();
    if (accounts.find(a => a.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const newUser = {
      id: 'usr-' + Date.now(),
      name: trimmedName,
      phone: trimmedPhone,
      email: trimmedEmail,
      password,
      role: role || 'customer',
      created_at: new Date().toISOString().split('T')[0]
    };

    accounts.push(newUser);
    this._saveAccounts(accounts);

    const session = this._setSession(newUser);
    const redirectUrl = session.role === 'owner' ? '/owner/' : (session.role === 'admin' ? '/admin/' : null);
    return { success: true, user: session, redirectUrl };
  },

  async login({ email, password }) {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Fast-path instant admin authentication (Zero network delay, completely deterministic)
    if (trimmedEmail === 'admin@venueluxe.com' && password === 'admin123') {
      const adminAcc = {
        id: 'admin-1',
        name: 'Dr. K. R. Shenoy',
        email: 'admin@venueluxe.com',
        phone: '+91 94481 00001',
        role: 'admin'
      };
      const session = this._setSession(adminAcc);
      return { success: true, user: session, redirectUrl: '/admin/' };
    }

    // 1. Try Firebase Auth
    if (window.fbAuth) {
      try {
        const userCred = await window.fbAuth.signInWithEmailAndPassword(trimmedEmail, password);
        const fbUser = userCred.user;

        const cloudUser = await this.fetchCloudUser(fbUser.uid, trimmedEmail);
        const accounts = this._getAccounts();
        const localAcc = accounts.find(a => a.email.toLowerCase() === trimmedEmail);
        const isOwner = (cloudUser && cloudUser.role === 'owner') ||
                        localAcc?.role === 'owner' || 
                        this.isOwnerUser({ id: fbUser.uid, email: trimmedEmail });
        const isAdmin = (cloudUser && cloudUser.role === 'admin') ||
                        localAcc?.role === 'admin' || 
                        this.isAdminUser({ id: fbUser.uid, email: trimmedEmail });

        const sessionUser = {
          id: fbUser.uid,
          name: cloudUser?.name || fbUser.displayName || (localAcc ? localAcc.name : trimmedEmail.split('@')[0]),
          phone: cloudUser?.phone || fbUser.phoneNumber || (localAcc ? localAcc.phone : '+91 98450 12345'),
          email: fbUser.email,
          role: isOwner ? 'owner' : (isAdmin ? 'admin' : 'customer')
        };

        const session = this._setSession(sessionUser);
        const redirectUrl = session.role === 'owner' ? '/owner/' : (session.role === 'admin' ? '/admin/' : null);
        return { success: true, user: session, redirectUrl };
      } catch (fbErr) {
        console.warn('[Firebase Auth] Login notice:', fbErr.message);
      }
    }

    // 2. Local fallback login
    const accounts = this._getAccounts();
    const account = accounts.find(
      a => a.email.toLowerCase() === trimmedEmail && a.password === password
    );

    if (!account) {
      return { success: false, error: 'Incorrect email or password. Please check your credentials.' };
    }

    if (this.isOwnerUser(account)) {
      account.role = 'owner';
    } else if (this.isAdminUser(account)) {
      account.role = 'admin';
    }

    const session = this._setSession(account);
    const redirectUrl = session.role === 'owner' ? '/owner/' : (session.role === 'admin' ? '/admin/' : null);
    return { success: true, user: session, redirectUrl };
  },

  async loginWithGoogle() {
    if (!window.fbAuth || typeof firebase === 'undefined') {
      return { success: false, error: 'Firebase Auth is initializing. Please try again in a moment.' };
    }

    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      const result = await window.fbAuth.signInWithPopup(provider);
      const fbUser = result.user;

      const cloudUser = await this.fetchCloudUser(fbUser.uid, fbUser.email);
      const accounts = this._getAccounts();
      const localAcc = accounts.find(a => a.email.toLowerCase() === fbUser.email?.toLowerCase());

      const isOwner = (cloudUser && cloudUser.role === 'owner') ||
                      localAcc?.role === 'owner' ||
                      this.isOwnerUser({ id: fbUser.uid, email: fbUser.email });
      const isAdmin = (cloudUser && cloudUser.role === 'admin') ||
                      localAcc?.role === 'admin' ||
                      this.isAdminUser({ id: fbUser.uid, email: fbUser.email });

      const finalRole = isOwner ? 'owner' : (isAdmin ? 'admin' : 'customer');
      const sessionUser = {
        id: fbUser.uid,
        name: cloudUser?.name || fbUser.displayName || 'Google User',
        phone: cloudUser?.phone || fbUser.phoneNumber || '+91 98000 00000',
        email: fbUser.email,
        profile_image: fbUser.photoURL || '',
        role: finalRole
      };

      if (window.fbDb) {
        window.fbDb.collection('users').doc(fbUser.uid).set(sessionUser, { merge: true }).catch(err => {
          console.warn('[Firestore] Note saving Google user profile:', err.message);
        });
      }

      const session = this._setSession(sessionUser);
      const redirectUrl = session.role === 'owner' ? '/owner/' : (session.role === 'admin' ? '/admin/' : null);
      return { success: true, user: session, redirectUrl };
    } catch (err) {
      console.error('[Firebase Auth] Google popup error:', err);
      return { success: false, error: err.message || 'Google sign-in was cancelled or failed.' };
    }
  },

  logout() {
    if (window.fbAuth) {
      window.fbAuth.signOut().catch(err => console.warn('[Firebase Auth] Signout notice:', err.message));
    }
    this._clearSession();
  },

  // ─── Portal Access Control & Mutual Segregation Guards ─────────────────────

  guardAdminPortal() {
    const user = this.getCurrentUser();
    // 1. If logged in as admin: ALLOW
    if (user && (user.role === 'admin' || this.isAdminUser(user))) {
      return { allowed: true, user };
    }

    // 2. If logged in as hall owner: BLOCKED
    if (user && (user.role === 'owner' || this.isOwnerUser(user))) {
      return { allowed: false, reason: 'OWNER_BLOCKED', user };
    }

    // 3. If logged in as customer: BLOCKED
    if (user && user.role === 'customer') {
      return { allowed: false, reason: 'CUSTOMER_BLOCKED', user };
    }

    // 4. If unauthenticated: Require Admin Login
    return { allowed: false, reason: 'AUTH_REQUIRED', user: null };
  },

  guardOwnerPortal() {
    const user = this.getCurrentUser();
    // 1. If logged in as admin: BLOCKED
    if (user && (user.role === 'admin' || this.isAdminUser(user))) {
      return { allowed: false, reason: 'ADMIN_BLOCKED', user };
    }

    // 2. If user is logged in (customer or owner), seamlessly admit them into their Host Workspace
    if (user) {
      if (user.role !== 'owner') {
        this.upgradeToOwner(user.id);
        user.role = 'owner';
      }
      return { allowed: true, user };
    }

    // 3. Unauthenticated: Require Owner Login
    return { allowed: false, reason: 'AUTH_REQUIRED', user: null };
  }
};

// Listen for Firebase auth state changes to keep sessions synchronized
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    if (window.fbAuth && window.fbAuth.onAuthStateChanged) {
      window.fbAuth.onAuthStateChanged(async (fbUser) => {
        if (fbUser) {
          const current = Auth.getCurrentUser();
          const path = window.location.pathname;

          // Never override an active admin or owner session on portal pages
          if (path.includes('/admin') && current && (current.role === 'admin' || Auth.isAdminUser(current))) {
            return;
          }
          if (path.includes('/owner') && current && (current.role === 'owner' || Auth.isOwnerUser(current))) {
            return;
          }
          if (current && (current.role === 'admin' || current.role === 'owner') && current.email !== fbUser.email) {
            return;
          }

          if (!current || current.id !== fbUser.uid || current.role !== 'owner') {
            const cloudUser = await Auth.fetchCloudUser(fbUser.uid, fbUser.email);
            const accounts = Auth._getAccounts();
            const localAcc = accounts.find(a => a.email.toLowerCase() === fbUser.email?.toLowerCase());

            const isOwner = (cloudUser && cloudUser.role === 'owner') ||
                            localAcc?.role === 'owner' ||
                            Auth.isOwnerUser({ id: fbUser.uid, email: fbUser.email });
            const isAdmin = (cloudUser && cloudUser.role === 'admin') ||
                            localAcc?.role === 'admin' ||
                            Auth.isAdminUser({ id: fbUser.uid, email: fbUser.email });

            const session = Auth._setSession({
              id: fbUser.uid,
              name: cloudUser?.name || fbUser.displayName || fbUser.email.split('@')[0],
              email: fbUser.email,
              phone: cloudUser?.phone || fbUser.phoneNumber || (current ? current.phone : '+91 98000 00000'),
              profile_image: fbUser.photoURL || (current ? current.profile_image : ''),
              role: isOwner ? 'owner' : (isAdmin ? 'admin' : 'customer')
            });

            // If auto-logged in user is owner and currently visiting customer portal or root, route to owner dashboard!
            if (session.role === 'owner' && (path === '/' || path === '/index.html' || path.includes('/customer'))) {
              console.log('[Auto-Login] Owner detected across device. Directing to Owner Dashboard...');
              window.location.href = '/owner/';
            }
          }
        }
      });
    }
  });
}

window.Auth = Auth;
