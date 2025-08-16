const API_BASE = '/api/pharmacy-inventory';

const defaultHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  const text = await res.text();
  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  } catch (err) {
    throw err;
  }
}

export const auth = {
  async login({ email, password }) {
    return request('/auth/login', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ email, password }),
    });
  },
  async register(payload) {
    return request('/auth/register', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(payload),
    });
  },
};

export const inventory = {
  list: async ({ token, page = 1, limit = 20, search, sortBy, order, lowStock } = {}) => {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('limit', limit);
    if (search) params.set('search', search);
    if (sortBy) params.set('sortBy', sortBy);
    if (order) params.set('order', order);
    if (lowStock) params.set('stockStatus', 'low_stock');
    return request(`/inventory?${params.toString()}`, {
      headers: defaultHeaders(token),
    });
  },
  get: async ({ token, id }) => request(`/inventory/${id}`, { headers: defaultHeaders(token) }),
  create: async ({ token, payload }) =>
    request('/inventory', { method: 'POST', headers: defaultHeaders(token), body: JSON.stringify(payload) }),
  update: async ({ token, id, payload }) =>
    request(`/inventory/${id}`, { method: 'PUT', headers: defaultHeaders(token), body: JSON.stringify(payload) }),
  remove: async ({ token, id }) => request(`/inventory/${id}`, { method: 'DELETE', headers: defaultHeaders(token) }),
  stats: async ({ token }) => request('/inventory/stats', { headers: defaultHeaders(token) }),
  lowStock: async ({ token }) => request('/inventory/low-stock', { headers: defaultHeaders(token) }),
};

export default { auth, inventory };
