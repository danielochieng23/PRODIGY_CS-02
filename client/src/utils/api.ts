import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - remove token and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  register: async (userData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: { login: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (userData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    preferences?: any;
  }) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// Categories API functions
export const categoriesAPI = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  },
};

// Ads API functions
export const adsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    subcategory?: string;
    city?: string;
    state?: string;
    country?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    priority?: string;
  }) => {
    const response = await api.get('/ads', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/ads/${id}`);
    return response.data;
  },

  create: async (adData: any) => {
    const response = await api.post('/ads', adData);
    return response.data;
  },

  update: async (id: string, adData: any) => {
    const response = await api.put(`/ads/${id}`, adData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/ads/${id}`);
    return response.data;
  },

  getMyAds: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const response = await api.get('/ads/user/my-ads', { params });
    return response.data;
  },

  toggleFavorite: async (id: string) => {
    const response = await api.post(`/ads/${id}/favorite`);
    return response.data;
  },
};

// Cities API functions
export const citiesAPI = {
  getPopular: async () => {
    const response = await api.get('/cities');
    return response.data;
  },

  search: async (query: string) => {
    const response = await api.get('/cities/search', { params: { q: query } });
    return response.data;
  },
};

// Users API functions
export const usersAPI = {
  getByUsername: async (username: string) => {
    const response = await api.get(`/users/${username}`);
    return response.data;
  },
};

export default api;