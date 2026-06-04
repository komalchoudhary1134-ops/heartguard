const API_URL = 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, method = 'GET', data = null, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options = {
        method,
        headers,
        body: data ? JSON.stringify(data) : null,
    };
    
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();
    
    if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
    }
    
    return result;
};

// ============ AUTH APIS ============

export const signup = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        
        if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    } catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
};

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// ============ READINGS APIS ============

export const addReading = async (reading) => {
    const token = getToken();
    return await apiCall('/readings/add', 'POST', reading, token);
};

export const getReadings = async () => {
    const token = getToken();
    return await apiCall('/readings', 'GET', null, token);
};

export const deleteReading = async (id) => {
    const token = getToken();
    return await apiCall(`/readings/${id}`, 'DELETE', null, token);
};

export const getStats = async () => {
    const token = getToken();
    return await apiCall('/readings/stats', 'GET', null, token);
};

// ============ REMINDERS APIS ============

export const getReminders = async () => {
    const token = getToken();
    return await apiCall('/reminders', 'GET', null, token);
};

export const addReminder = async (reminder) => {
    const token = getToken();
    return await apiCall('/reminders/add', 'POST', reminder, token);
};

export const deleteReminder = async (index) => {
    const token = getToken();
    return await apiCall(`/reminders/${index}`, 'DELETE', null, token);
};

// ============ GOALS APIS ============

export const getGoals = async () => {
    const token = getToken();
    return await apiCall('/goals', 'GET', null, token);
};

export const updateGoals = async (goals) => {
    const token = getToken();
    return await apiCall('/goals/update', 'PUT', goals, token);
};

// ============ HEALTH APIS ============

export const getHealthData = async () => {
    const token = getToken();
    return await apiCall('/health', 'GET', null, token);
};

export const updateBMI = async (bmiData) => {
    const token = getToken();
    return await apiCall('/health/bmi', 'POST', bmiData, token);
};

export const updateWaterIntake = async (count) => {
    const token = getToken();
    return await apiCall('/health/water', 'POST', { count }, token);
};

export const updateChallenge = async (completedDays) => {
    const token = getToken();
    return await apiCall('/health/challenge', 'POST', { completedDays }, token);
};

// ============ CONTACT APIS (UPDATED WITH TOKEN) ============

export const submitContact = async (formData) => {
    const token = getToken();  // ✅ Token le raha hai
    
    try {
        const response = await fetch(`${API_URL}/contact/submit`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''  // ✅ Token bhej raha hai
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    } catch (error) {
        console.error('Contact submit error:', error);
        throw error;
    }
};