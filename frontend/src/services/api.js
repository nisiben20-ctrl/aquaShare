/**
 * AquaShare — API Service Layer
 * Centralizes all HTTP calls to the PHP backend.
 */

const API_BASE = '/backend';

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

    try {
      return JSON.parse(text);
    } catch {
      return { error: { code: -1, message: text || 'Unknown error' } };
    }
  } catch (err) {
    return { error: { code: -2, message: err.message || 'Connection refused' } };
  }
}

async function registerRequest(url, options = {}) {
  const defaultHeaders = { 'Content-Type': 'application/x-www-form-urlencoded' };
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      credentials: 'include',
      redirect: 'manual',
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
    });

    if (res.type === 'opaqueredirect' || res.status === 302 || res.status === 301) {
      return { data: { registered: true } };
    }

    const text = await res.text();

    if (text && text.trim().length > 0) {
      return { error: { code: res.status, message: text.trim() } };
    }

    return { data: { registered: true } };
  } catch (err) {
    return { error: { code: -2, message: err.message || 'Connection refused' } };
  }
}

function encode(data) {
  return new URLSearchParams(data).toString();
}

// ── Auth Module ────────────────────────────────────────────
export const auth = {
  async login(email, password) {
    return request('/auth-module/login.php', {
      method: 'POST',
      body: encode({ email, password })
    });
  },

  async register({ full_name, phone, email, password, address, role }) {
    return registerRequest('/auth-module/register.php', {
      method: 'POST',
      body: encode({ full_name, phone, email, password, address, role: role || 'resident' }),
    });
  },
};

// ── User Module ────────────────────────────────────────────
export const user = {
  async createProfile({ full_name, phone, email, address, landmark }) {
    return request('/user-module/createprofile.php', {
      method: 'POST',
      body: encode({ full_name, phone, email, address, landmark }),
    });
  },
};

// ── Search Module ──────────────────────────────────────────
export const suppliers = {
  async list(searchTerm = '') {
    return request(`/search-module/index.php?q=${encodeURIComponent(searchTerm)}`);
  },

  async updateAvailability(isAvailable) {
    return request('/supplier-module/update_availability.php', {
      method: 'POST',
      body: encode({ is_available: isAvailable ? 1 : 0 })
    });
  },

  async updatePrice(price, description = '25L jerry can') {
    return request('/supplier-module/update_price.php', {
      method: 'POST',
      body: encode({ price, description })
    });
  }
};

// ── Request Module ─────────────────────────────────────────
export const requests = {
  async create({ supplierId, quantity, note }) {
    return request('/request-module/create.php', {
      method: 'POST',
      body: encode({ supplier_id: supplierId, quantity, note: note || '' })
    });
  },

  async getAll() {
    return request('/request-module/get_all.php');
  },

  async updateStatus(requestId, status) {
    return request('/request-module/update_status.php', {
      method: 'POST',
      body: encode({ request_id: requestId, status })
    });
  }
};

// ── Communication Module ───────────────────────────────────
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

// ── Rating Module ──────────────────────────────────────────
export const ratings = {
  async create({ supplierId, score, comment }) {
    return request('/rating-module/create.php', {
      method: 'POST',
      body: encode({ supplier_id: supplierId, score, comment: comment || '' })
    });
  },

  async getForSupplier(supplierId) {
    return request(`/rating-module/get.php?supplier_id=${supplierId}`);
  }
};

// ── Contact Module ─────────────────────────────────────────
export const contact = {
  async submit({ name, email, message }) {
    return request('/contact-module/submit.php', {
      method: 'POST',
      body: encode({ name, email, message })
    });
  }
};

// ── Admin Module ───────────────────────────────────────────
export const admin = {
  async getStats() {
    return request('/admin-module/get_stats.php');
  },
  async getUsers() {
    return request('/admin-module/get_users.php');
  },
  async banUser(userId, isActive = 0) {
    return request('/admin-module/ban_user.php', {
      method: 'POST',
      body: encode({ user_id: userId, is_active: isActive })
    });
  },
  async getMessages() {
    return request('/admin-module/get_messages.php');
  },
  async getPendingSuppliers() {
    return request('/admin-module/get_pending_suppliers.php');
  },
  async verifySupplier(supplierId) {
    return request('/admin-module/verify_supplier.php', {
      method: 'POST',
      body: encode({ supplier_id: supplierId })
    });
  }
};

export function syncActiveSupplierToMockList() {
  // No-op. Mock lists are completely removed. Real DB is used instead!
}

export default { auth, user, suppliers, requests, messages, ratings, contact, admin, syncActiveSupplierToMockList };
