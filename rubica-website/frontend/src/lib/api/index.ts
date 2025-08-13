import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import {
  User,
  Ad,
  Category,
  Location,
  AdsResponse,
  LoginCredentials,
  RegisterData,
  AdFilters,
  CreateAdData,
} from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = Cookies.get('token');
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
    this.client.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        const message = error.response?.data?.message || error.message || 'An error occurred';
        
        // Auto logout on 401
        if (error.response?.status === 401) {
          Cookies.remove('token');
          window.location.href = '/login';
        }
        
        return Promise.reject(new Error(message));
      }
    );
  }

  // Generic request method
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    return this.client.request(config);
  }

  // Auth API
  auth = {
    login: async (credentials: LoginCredentials) => {
      return this.request<{ token: string; user: User }>({
        method: 'POST',
        url: '/auth/login',
        data: credentials,
      });
    },

    register: async (userData: RegisterData) => {
      return this.request<{ token: string; user: User }>({
        method: 'POST',
        url: '/auth/register',
        data: userData,
      });
    },

    getProfile: async (token?: string) => {
      const config: AxiosRequestConfig = {
        method: 'GET',
        url: '/auth/me',
      };
      
      if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
      }
      
      return this.request<{ user: User }>(config);
    },

    updateProfile: async (userData: Partial<User>) => {
      return this.request<{ user: User }>({
        method: 'PUT',
        url: '/auth/profile',
        data: userData,
      });
    },

    changePassword: async (currentPassword: string, newPassword: string) => {
      return this.request<{ message: string }>({
        method: 'POST',
        url: '/auth/change-password',
        data: { currentPassword, newPassword },
      });
    },
  };

  // Ads API
  ads = {
    getAds: async (filters: AdFilters = {}) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      return this.request<AdsResponse>({
        method: 'GET',
        url: `/ads?${params.toString()}`,
      });
    },

    getAd: async (id: string) => {
      return this.request<{ ad: Ad }>({
        method: 'GET',
        url: `/ads/${id}`,
      });
    },

    createAd: async (adData: CreateAdData, images: File[]) => {
      const formData = new FormData();
      
      // Append form fields
      Object.entries(adData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Append images
      images.forEach((image) => {
        formData.append('images', image);
      });

      return this.request<{ ad: Ad }>({
        method: 'POST',
        url: '/ads',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },

    updateAd: async (id: string, adData: Partial<CreateAdData>) => {
      return this.request<{ ad: Ad }>({
        method: 'PUT',
        url: `/ads/${id}`,
        data: adData,
      });
    },

    deleteAd: async (id: string) => {
      return this.request<{ message: string }>({
        method: 'DELETE',
        url: `/ads/${id}`,
      });
    },

    contactAd: async (id: string) => {
      return this.request<{ message: string }>({
        method: 'POST',
        url: `/ads/${id}/contact`,
      });
    },

    getMyAds: async (filters: AdFilters = {}) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      return this.request<AdsResponse>({
        method: 'GET',
        url: `/ads/user/my-ads?${params.toString()}`,
      });
    },
  };

  // Categories API
  categories = {
    getCategories: async () => {
      return this.request<{ categories: Category[] }>({
        method: 'GET',
        url: '/categories',
      });
    },

    getCategory: async (slug: string) => {
      return this.request<{ category: Category }>({
        method: 'GET',
        url: `/categories/${slug}`,
      });
    },
  };

  // Locations API
  locations = {
    getLocations: async (params: { type?: string; parent?: string; featured?: boolean } = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, value.toString());
        }
      });

      return this.request<{ locations: Location[] }>({
        method: 'GET',
        url: `/locations?${searchParams.toString()}`,
      });
    },

    getLocation: async (slug: string) => {
      return this.request<{ location: Location }>({
        method: 'GET',
        url: `/locations/${slug}`,
      });
    },
  };

  // Users API
  users = {
    getUser: async (username: string) => {
      return this.request<{ user: User }>({
        method: 'GET',
        url: `/users/${username}`,
      });
    },
  };
}

// Create and export API instance
const api = new ApiClient();

export const authApi = api.auth;
export const adsApi = api.ads;
export const categoriesApi = api.categories;
export const locationsApi = api.locations;
export const usersApi = api.users;

export default api;