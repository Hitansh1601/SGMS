// ============================================================
// API Service
// Centralized API calls using Axios
// ============================================================

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// ============================================================
// AUTH API
// ============================================================

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register/student', userData),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
    changePassword: (data) => api.put('/auth/change-password', data),
};

// ============================================================
// GRIEVANCE API
// ============================================================

export const grievanceAPI = {
    create: (formData) => api.post('/grievances', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    getAll: (params) => api.get('/grievances/student', { params }),
    getById: (id) => api.get(`/grievances/${id}`),
    update: (id, data) => api.put(`/grievances/${id}`, data),
    delete: (id) => api.delete(`/grievances/${id}`),
    getStats: () => api.get('/grievances/stats/student'),
};

// ============================================================
// STUDENT API
// ============================================================

export const studentAPI = {
    getMessages: (grievanceId) => api.get(`/student/grievances/${grievanceId}/messages`),
    sendMessage: (grievanceId, data) => api.post(`/student/grievances/${grievanceId}/messages`, data),
    submitFeedback: (grievanceId, data) => api.post(`/student/grievances/${grievanceId}/feedback`, data),
    getNotifications: (params) => api.get('/student/notifications', { params }),
    markNotificationRead: (id) => api.put(`/student/notifications/${id}/read`),
    getCategories: () => api.get('/student/categories'),
    getStatusOptions: () => api.get('/student/status'),
};

// ============================================================
// FACULTY API
// ============================================================

export const facultyAPI = {
    getGrievances: (params) => api.get('/faculty/grievances', { params }),
    getStats: () => api.get('/faculty/stats'),
    getMessages: (grievanceId) => api.get(`/faculty/grievances/${grievanceId}/messages`),
    sendMessage: (grievanceId, data) => api.post(`/faculty/grievances/${grievanceId}/messages`, data),
    getNotifications: (params) => api.get('/faculty/notifications', { params }),
    markNotificationRead: (id) => api.put(`/faculty/notifications/${id}/read`),
};

// ============================================================
// ADMIN API
// ============================================================

export const adminAPI = {
    // User Management
    getStudents: (params) => api.get('/admin/students', { params }),
    getFaculty: (params) => api.get('/admin/faculty', { params }),
    addStudent: (data) => api.post('/admin/students', data),
    addFaculty: (data) => api.post('/admin/faculty', data),
    updateStudent: (id, data) => api.put(`/admin/students/${id}`, data),
    updateFaculty: (id, data) => api.put(`/admin/faculty/${id}`, data),
    
    // Grievance Management
    getAllGrievances: (params) => api.get('/admin/grievances', { params }),
    assignGrievance: (id, facultyId) => api.put(`/admin/grievances/${id}/assign`, { faculty_id: facultyId }),
    
    // Category Management
    getCategories: () => api.get('/admin/categories'),
    addCategory: (data) => api.post('/admin/categories', data),
    updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
    
    // Statistics
    getDashboardStats: () => api.get('/admin/stats'),
    getFacultyWorkload: () => api.get('/admin/faculty/workload'),
};

export default api;
