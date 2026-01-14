const API_URL = '/api/v1';

// UI Elements
const authContainer = document.getElementById('auth-container');
const loginCard = document.getElementById('login-card');
const registerCard = document.getElementById('register-card');
const dashboardContainer = document.getElementById('dashboard-container');
const clientList = document.getElementById('client-list');

// Error Elements
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');

// Event Listeners
document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('register-form').addEventListener('submit', handleRegister);

// Check if already logged in on load
window.onload = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
        showDashboard();
    }
};

// Navigation Functions
function showLogin() {
    registerCard.classList.add('hidden');
    loginCard.classList.remove('hidden');
    authContainer.classList.remove('hidden');
    dashboardContainer.classList.add('hidden');
    clearErrors();
}

function showRegister() {
    loginCard.classList.add('hidden');
    registerCard.classList.remove('hidden');
    authContainer.classList.remove('hidden');
    dashboardContainer.classList.add('hidden');
    clearErrors();
}

function showDashboard() {
    authContainer.classList.add('hidden');
    dashboardContainer.classList.remove('hidden');
    fetchClients();
}

function clearErrors() {
    loginError.textContent = '';
    registerError.textContent = '';
}

function logout() {
    localStorage.removeItem('access_token');
    showLogin();
}

// API Functions
async function handleLogin(e) {
    e.preventDefault();
    clearErrors();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Login failed');
        }

        localStorage.setItem('access_token', data.access_token);
        showDashboard();

    } catch (error) {
        loginError.textContent = error.message;
    }
}

async function handleRegister(e) {
    e.preventDefault();
    clearErrors();

    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Registration failed');
        }

        // Auto login after register or just show success
        alert('Registration successful! Please sign in.');
        showLogin();
        // Pre-fill login
        document.getElementById('login-username').value = username;

    } catch (error) {
        registerError.textContent = error.message;
    }
}

async function fetchClients() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        logout();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/clients`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            logout();
            return;
        }

        const clients = await response.json();
        renderClients(clients);

    } catch (error) {
        clientList.innerHTML = `<p style="color: red; text-align: center;">Error loading clients</p>`;
    }
}

function renderClients(clients) {
    if (clients.length === 0) {
        clientList.innerHTML = `<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No clients found.</p>`;
        return;
    }

    clientList.innerHTML = clients.map(client => `
        <li class="client-item">
            <div>
                <strong style="display: block; color: var(--text-primary);">${client.name}</strong>
                <span style="font-size: 0.875rem; color: var(--text-secondary);">${client.email}</span>
            </div>
            <span style="font-size: 0.875rem; color: var(--text-secondary);">${client.phone || ''}</span>
        </li>
    `).join('');
}
