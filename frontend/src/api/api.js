import axios from 'axios';

const DJANGO_URL = import.meta.env.VITE_DJANGO_URL || 'http://localhost:8080/api';
const FASTAPI_URL = import.meta.env.VITE_FASTAPI_URL || 'http://localhost:8000/api';

export const djangoApi = axios.create({
    baseURL: DJANGO_URL
});

export const fastapiApi = axios.create({
    baseURL: FASTAPI_URL
});

const setupInterceptors = (apiInstance) => {
    apiInstance.interceptors.request.use(config => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
};

setupInterceptors(djangoApi);
setupInterceptors(fastapiApi);
