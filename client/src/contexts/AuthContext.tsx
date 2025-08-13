import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authAPI } from '../utils/api';
import { toast } from 'react-toastify';

// Types
interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  preferences: {
    language: string;
    currency: string;
    notifications: {
      email: boolean;
      sms: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: { login: string; password: string }) => Promise<void>;
  register: (userData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAIL' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('authToken'),
  isLoading: false,
  isAuthenticated: false,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'AUTH_FAIL':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          dispatch({ type: 'AUTH_START' });
          const response = await authAPI.getProfile();
          
          if (response.success) {
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: response.data.user,
                token,
              },
            });
          } else {
            throw new Error('Failed to get profile');
          }
        } catch (error) {
          dispatch({ type: 'AUTH_FAIL' });
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials: { login: string; password: string }) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.login(credentials);

      if (response.success) {
        const { user, token } = response.data;
        
        // Store in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token },
        });

        toast.success('Login successful!');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAIL' });
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  // Register function
  const register = async (userData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.register(userData);

      if (response.success) {
        const { user, token } = response.data;
        
        // Store in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token },
        });

        toast.success('Registration successful!');
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAIL' });
      const message = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    try {
      authAPI.logout().catch(() => {}); // Fire and forget
    } catch (error) {
      // Ignore logout API errors
    }
    
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  // Update profile function
  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await authAPI.updateProfile(userData);

      if (response.success) {
        dispatch({
          type: 'UPDATE_USER',
          payload: response.data.user,
        });

        // Update localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        toast.success('Profile updated successfully');
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Update failed';
      toast.error(message);
      throw error;
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await authAPI.getProfile();
      
      if (response.success) {
        dispatch({
          type: 'UPDATE_USER',
          payload: response.data.user,
        });
        
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};