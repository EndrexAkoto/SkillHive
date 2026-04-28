const API_BASE = 'http://127.0.0.1:2345';

async function postJson(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.message || `Request failed: ${res.status}`);
    }
    return data;
}

async function postForm(path, formData) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        body: formData
    });
    const text = await res.text();
    if (!res.ok) {
        throw new Error(text || `Request failed: ${res.status}`);
    }
    return text;
}

const auth = {
    async register({ firstName, lastName, email, password }) {
        const data = await postJson('/api/auth/register', { firstName, lastName, email, password });
        if (data.token) localStorage.setItem('token', data.token);
        return data;
    },
    async login({ email, password }) {
        const data = await postJson('/api/auth/login', { email, password });
        if (data.token) localStorage.setItem('token', data.token);
        return data;
    },
    async logout() {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const res = await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST', headers });
        const data = await res.json().catch(() => ({}));
        localStorage.removeItem('token');
        if (!res.ok) throw new Error(data.message || `Logout failed: ${res.status}`);
        return data;
    },
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },
    getToken() {
        return localStorage.getItem('token');
    }
};

const portfolio = {
    async submit(formData) {
        return postForm('/api/submit-form', formData);
    }
};

window.SkillHive = { auth, portfolio };
