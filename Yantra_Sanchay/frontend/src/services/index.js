import api from './api';
import { offlineAuthService } from './offlineAuthService';

export const authService = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getCurrentUser: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
};

export { offlineAuthService };

export const userService = {
    getDashboard: () => api.get('/users/dashboard'),
    getProfile: (id) => api.get(`/users/${id}`),
    updateProfile: (data) => api.put('/users/profile', data),
    getAll: () => api.get('/users'),
};

export const machineryService = {
    getAll: (params) => api.get('/machinery', { params }),
    getById: (id) => api.get(`/machinery/${id}`),
    create: (data) => api.post('/machinery', data),
    update: (id, data) => api.put(`/machinery/${id}`, data),
    delete: (id) => api.delete(`/machinery/${id}`),
    search: (query) => api.get('/machinery/search', { params: { q: query } }),
    getUserMachinery: () => api.get('/machinery/user/my-machinery'),
};

export const requestService = {
    getAll: (params) => api.get('/requests', { params }),
    getById: (id) => api.get(`/requests/${id}`),
    create: (data) => api.post('/requests', data),
    updateStatus: (id, data) => api.put(`/requests/${id}/status`, data),
    getUserRequests: () => api.get('/requests/user/my-requests'),
};

export const poolingService = {
    getAll: (params) => api.get('/pooling', { params }),
    getById: (id) => api.get(`/pooling/${id}`),
    create: (data) => api.post('/pooling', data),
    join: (id, data) => api.post(`/pooling/${id}/join`, data),
    updateStatus: (id, data) => api.put(`/pooling/${id}/status`, data),
    getUserPooling: () => api.get('/pooling/user/my-pooling'),
};

export const adminService = {
    getStatistics: () => api.get('/admin/statistics'),
    getAllUsers: (params) => api.get('/admin/users', { params }),
    getAllMachinery: (params) => api.get('/admin/machinery', { params }),
    getAllRequests: () => api.get('/admin/requests'),
    verifyMachinery: (id, data) => api.put(`/admin/machinery/${id}/verify`, data),
    getAllPooling: () => api.get('/admin/pooling'),
};

export const translationService = {
    translate: (text, source = 'english', target = 'telugu') =>
        api.post('/translate', { text, source, target }),
};

export const assessmentService = {
    assess: (image, farmSize, crop) => api.post('/assessment', { image, farmSize, crop }),
};
