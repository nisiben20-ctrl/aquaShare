/**
 * AquaShare — API Service Layer
 * Centralizes all HTTP calls to the PHP backend.
 * Uses a localStorage-backed database for Requests, Chat, Search, and Ratings.
 * Also includes automatic localStorage fallbacks for Authentication and Profiles
 * to ensure the app works 100% in-browser even if the PHP server is not running.
 */

const API_BASE = '/backend';

// LocalStorage Database Keys
const KEYS = {
  USERS: 'aquashare_mock_users',
  PROFILES: 'aquashare_mock_profiles',
  SUPPLIERS: 'aquashare_mock_suppliers',
  REQUESTS: 'aquashare_mock_requests',
  MESSAGES: 'aquashare_mock_messages',
  RATINGS: 'aquashare_mock_ratings',
};

async function request(url, options = {}) {
  const defaultHeaders = {};

  // Don't set Content-Type for FormData (browser sets multipart boundary)
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  try {
    const res = await fetch(`${API_BASE}${url}`, {
      credentials: 'include',
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const text = await res.text();

    // PHP endpoints return JSON — parse it
    try {
      return JSON.parse(text);
    } catch {
      // If response is not JSON, wrap it
      return { error: { code: -1, message: text || 'Unknown error' } };
    }
  } catch (err) {
    // Network/Connection error (e.g., PHP server is not running)
    return { error: { code: -2, message: err.message || 'Connection refused' } };
  }
}

/**
 * Special handler for register.php which uses die() for errors (plain text)
 * and header("Location: login.html") on success (causes a redirect).
 * We treat a redirected or 200 OK response that is non-JSON as SUCCESS.
 */
async function registerRequest(url, options = {}) {
  const defaultHeaders = { 'Content-Type': 'application/x-www-form-urlencoded' };
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      credentials: 'include',
      redirect: 'manual', // Don't auto-follow redirects — detect success ourselves
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
    });

    // A 3xx redirect from register.php means registration succeeded
    // (it redirects to login.html on success)
    if (res.type === 'opaqueredirect' || res.status === 302 || res.status === 301) {
      return { data: { registered: true } };
    }

    const text = await res.text();

    // If we get an OK but non-redirect response — check if it's an error message
    if (text && text.trim().length > 0) {
      // register.php outputs error strings directly via die() or echo
      // These are plain text, never JSON
      return { error: { code: res.status, message: text.trim() } };
    }

    // Empty 200 = success fallback
    return { data: { registered: true } };
  } catch (err) {
    return { error: { code: -2, message: err.message || 'Connection refused' } };
  }
}

/** Encode a plain object as application/x-www-form-urlencoded */
function encode(data) {
  return new URLSearchParams(data).toString();
}

// Helper to get logged-in user info from frontend AuthContext storage
function getLoggedInUser() {
  try {
    const stored = localStorage.getItem('aquashare_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// ── Auth Module ────────────────────────────────────────────
export const auth = {
  async login(email, password) {
    const res = await request('/auth-module/login.php', {
      method: 'POST',
      body: encode({ email, password })
    });

    return res;
  },

  async register({ full_name, phone, email, password, address, role }) {
    const res = await registerRequest('/auth-module/register.php', {
      method: 'POST',
      body: encode({
        full_name,
        phone,
        email,
        address,
        password: password,
        role: role || 'resident',
      }),
    });

    return res;
  },
};

// ── User Module ────────────────────────────────────────────
export const user = {
  async createProfile({ address, landmark, ...extra }) {
    const res = await request('/user-module/createprofile.php', {
      method: 'POST',
      body: encode({ address, landmark, ...extra }),
    });

    return res;
  },
};

// Buea Water Suppliers Mock Pool
const INITIAL_SUPPLIERS = [
  { id: 101, full_name: 'Camwater Express', phone: '675111222', address: 'Molyko, Buea', price_per_unit: 500, unit_description: '25L jerry can', is_available: true, rating: 4.5, delivery_available: true },
  { id: 102, full_name: 'BlueDrop Supplies', phone: '675333444', address: 'Bonduma, Buea', price_per_unit: 400, unit_description: '25L jerry can', is_available: true, rating: 4.2, delivery_available: true },
  { id: 103, full_name: 'AquaPure Delivery', phone: '675555666', address: 'Malingo, Buea', price_per_unit: 600, unit_description: '50L drum', is_available: false, rating: 3.8, delivery_available: false },
  { id: 104, full_name: 'Fresh Springs Co.', phone: '675777888', address: 'Clerks Quarters, Buea', price_per_unit: 450, unit_description: '25L jerry can', is_available: true, rating: 4.7, delivery_available: true },
];

function initSuppliers() {
  if (!localStorage.getItem(KEYS.SUPPLIERS)) {
    localStorage.setItem(KEYS.SUPPLIERS, JSON.stringify(INITIAL_SUPPLIERS));
  }
}

/** Sync active supplier to mock list so residents can find them */
export function syncActiveSupplierToMockList(activeUser, profile) {
  if (!activeUser || activeUser.role !== 'supplier') return;
  initSuppliers();
  const list = JSON.parse(localStorage.getItem(KEYS.SUPPLIERS) || '[]');
  const index = list.findIndex(s => s.id === activeUser.id);

  const supplierData = {
    id: activeUser.id,
    full_name: activeUser.full_name,
    phone: activeUser.phone,
    address: profile?.address || 'Buea, Cameroon',
    landmark: profile?.landmark || '',
    price_per_unit: profile?.price_per_unit || 500,
    unit_description: profile?.unit_description || '25L jerry can',
    is_available: profile?.is_available !== undefined ? profile.is_available : true,
    rating: profile?.rating || 5.0,
    delivery_available: profile?.delivery_available !== undefined ? profile.delivery_available : true,
  };

  if (index >= 0) {
    list[index] = { ...list[index], ...supplierData };
  } else {
    list.push(supplierData);
  }
  localStorage.setItem(KEYS.SUPPLIERS, JSON.stringify(list));
}

// ── Supplier / Search Module (Mocked via LocalStorage) ─────
export const suppliers = {
  list(searchTerm = '') {
    initSuppliers();
    let list = JSON.parse(localStorage.getItem(KEYS.SUPPLIERS) || '[]');

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(s =>
        s.full_name.toLowerCase().includes(term) ||
        s.address.toLowerCase().includes(term) ||
        (s.landmark && s.landmark.toLowerCase().includes(term))
      );
    }
    return Promise.resolve({ data: list });
  },

  updateAvailability(isAvailable) {
    const activeUser = getLoggedInUser();
    if (!activeUser) return Promise.resolve({ error: { message: 'Not authenticated' } });

    initSuppliers();
    const list = JSON.parse(localStorage.getItem(KEYS.SUPPLIERS) || '[]');
    const index = list.findIndex(s => s.id === activeUser.id);
    if (index >= 0) {
      list[index].is_available = !!isAvailable;
      localStorage.setItem(KEYS.SUPPLIERS, JSON.stringify(list));
      return Promise.resolve({ data: list[index] });
    }
    return Promise.resolve({ error: { message: 'Supplier profile not found' } });
  },

  updatePrice(price, description = '25L jerry can') {
    const activeUser = getLoggedInUser();
    if (!activeUser) return Promise.resolve({ error: { message: 'Not authenticated' } });

    initSuppliers();
    const list = JSON.parse(localStorage.getItem(KEYS.SUPPLIERS) || '[]');
    const index = list.findIndex(s => s.id === activeUser.id);
    if (index >= 0) {
      list[index].price_per_unit = Number(price);
      list[index].unit_description = description;
      localStorage.setItem(KEYS.SUPPLIERS, JSON.stringify(list));
      return Promise.resolve({ data: list[index] });
    }
    return Promise.resolve({ error: { message: 'Supplier profile not found' } });
  }
};

// ── Request Module (Mocked via LocalStorage) ───────────────
export const requests = {
  create({ supplierId, quantity, note }) {
    const activeUser = getLoggedInUser();
    if (!activeUser) return Promise.resolve({ error: { message: 'Not authenticated' } });

    initSuppliers();
    const suppliersList = JSON.parse(localStorage.getItem(KEYS.SUPPLIERS) || '[]');
    const supplier = suppliersList.find(s => s.id === Number(supplierId));

    const reqList = JSON.parse(localStorage.getItem(KEYS.REQUESTS) || '[]');
    const newRequest = {
      id: Date.now(),
      resident_id: activeUser.id,
      resident_name: activeUser.full_name,
      resident_phone: activeUser.phone,
      supplier_id: Number(supplierId),
      supplier_name: supplier ? supplier.full_name : 'Unknown Supplier',
      quantity: Number(quantity) || 1,
      note: note || '',
      status: 'pending',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    reqList.unshift(newRequest);
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify(reqList));
    return Promise.resolve({ data: newRequest });
  },

  getAll() {
    const activeUser = getLoggedInUser();
    if (!activeUser) return Promise.resolve({ data: [] });

    const reqList = JSON.parse(localStorage.getItem(KEYS.REQUESTS) || '[]');
    const filtered = reqList.filter(r =>
      activeUser.role === 'supplier'
        ? r.supplier_id === activeUser.id
        : r.resident_id === activeUser.id
    );
    return Promise.resolve({ data: filtered });
  },

  updateStatus(requestId, status) {
    const reqList = JSON.parse(localStorage.getItem(KEYS.REQUESTS) || '[]');
    const index = reqList.findIndex(r => r.id === Number(requestId));
    if (index === -1) return Promise.resolve({ error: { message: 'Request not found' } });

    reqList[index].status = status;
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify(reqList));
    return Promise.resolve({ data: reqList[index] });
  }
};

// ── Communication Module (Real Backend) ─────────────────────
export const messages = {
  async get(requestId) {
    return request(`/communication-module/get.php?request_id=${requestId}`);
  },

  async send({ requestId, type = 'text', body }) {
    const formData = new FormData();
    formData.append('request_id', requestId);
    formData.append('type', type);
    formData.append('body', body);

    return request('/communication-module/send.php', {
      method: 'POST',
      body: formData,
    });
  },

  async sendImage({ requestId, file }) {
    const formData = new FormData();
    formData.append('request_id', requestId);
    formData.append('type', 'image');
    formData.append('image', file);

    return request('/communication-module/send.php', {
      method: 'POST',
      body: formData,
    });
  },

  async markRead(requestId) {
    const formData = new FormData();
    formData.append('request_id', requestId);

    return request('/communication-module/markread.php', {
      method: 'POST',
      body: formData,
    });
  },
};

// ── Rating Module (Mocked via LocalStorage) ────────────────
export const ratings = {
  create({ supplierId, score, comment }) {
    const activeUser = getLoggedInUser();
    if (!activeUser) return Promise.resolve({ error: { message: 'Not authenticated' } });

    const ratingList = JSON.parse(localStorage.getItem(KEYS.RATINGS) || '[]');
    const existingIndex = ratingList.findIndex(r => r.resident_id === activeUser.id && r.supplier_id === Number(supplierId));

    const newRating = {
      id: Date.now(),
      resident_id: activeUser.id,
      resident_name: activeUser.full_name,
      supplier_id: Number(supplierId),
      score: Number(score),
      comment: comment || '',
      created_at: new Date().toISOString().split('T')[0],
    };

    if (existingIndex >= 0) {
      ratingList[existingIndex] = newRating;
    } else {
      ratingList.push(newRating);
    }
    localStorage.setItem(KEYS.RATINGS, JSON.stringify(ratingList));

    // Recalculate average rating
    initSuppliers();
    const suppliersList = JSON.parse(localStorage.getItem(KEYS.SUPPLIERS) || '[]');
    const supplierIndex = suppliersList.findIndex(s => s.id === Number(supplierId));
    if (supplierIndex >= 0) {
      const supplierRatings = ratingList.filter(r => r.supplier_id === Number(supplierId));
      const avg = supplierRatings.reduce((sum, r) => sum + r.score, 0) / supplierRatings.length;
      suppliersList[supplierIndex].rating = Number(avg.toFixed(1));
      localStorage.setItem(KEYS.SUPPLIERS, JSON.stringify(suppliersList));
    }

    return Promise.resolve({ data: newRating });
  },

  getForSupplier(supplierId) {
    const ratingList = JSON.parse(localStorage.getItem(KEYS.RATINGS) || '[]');
    const filtered = ratingList.filter(r => r.supplier_id === Number(supplierId));
    return Promise.resolve({ data: filtered });
  }
};

export default { auth, user, suppliers, requests, messages, ratings, syncActiveSupplierToMockList };
