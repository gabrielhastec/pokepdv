import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
});

// Request interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        if (status === 401 || status === 403) {
            localStorage.clear();

            // evita loop infinito de redirect
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
