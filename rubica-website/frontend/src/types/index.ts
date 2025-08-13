export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  isVerified: boolean;
  isActive: boolean;
  role: 'user' | 'admin' | 'moderator';
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
    };
    privacy: {
      showPhone: boolean;
      showEmail: boolean;
    };
  };
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  parentCategory?: string;
  isActive: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  adCount: number;
  subcategories?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  _id: string;
  name: string;
  slug: string;
  type: 'country' | 'state' | 'city' | 'area';
  parent?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  timezone?: string;
  population?: number;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  adCount: number;
  children?: Location[];
  createdAt: string;
  updatedAt: string;
}

export interface AdImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
}

export interface Ad {
  _id: string;
  title: string;
  description: string;
  slug: string;
  category: Category;
  subcategory?: Category;
  location: Location;
  user: User;
  images: AdImage[];
  contact: {
    name: string;
    phone?: string;
    email?: string;
    whatsapp?: string;
    telegram?: string;
  };
  pricing: {
    currency: string;
    hourly?: number;
    halfHour?: number;
    overnight?: number;
    customRates: Array<{
      duration: string;
      price: number;
    }>;
  };
  details: {
    age?: number;
    height?: string;
    weight?: string;
    ethnicity?: string;
    languages: string[];
    services: string[];
    availability: {
      days: string[];
      hours: {
        from: string;
        to: string;
      };
    };
  };
  status: 'draft' | 'active' | 'paused' | 'expired' | 'blocked' | 'deleted';
  isPremium: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  views: number;
  contacts: number;
  expiresAt: string;
  lastBumped: string;
  moderationNotes?: string;
  reportCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface AdsResponse {
  ads: Ad[];
  pagination: PaginationInfo;
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AdFilters {
  page?: number;
  limit?: number;
  category?: string;
  location?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  isPremium?: boolean;
  isFeatured?: boolean;
}

export interface CreateAdData {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  location: string;
  contact: {
    name: string;
    phone?: string;
    email?: string;
    whatsapp?: string;
    telegram?: string;
  };
  pricing?: {
    currency?: string;
    hourly?: number;
    halfHour?: number;
    overnight?: number;
    customRates?: Array<{
      duration: string;
      price: number;
    }>;
  };
  details?: {
    age?: number;
    height?: string;
    weight?: string;
    ethnicity?: string;
    languages?: string[];
    services?: string[];
    availability?: {
      days?: string[];
      hours?: {
        from?: string;
        to?: string;
      };
    };
  };
}