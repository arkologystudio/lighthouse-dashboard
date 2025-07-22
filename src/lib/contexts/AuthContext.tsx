'use client';

import React, {
  createContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react';
import { authApi, matchResult, setGlobalLogoutCallback } from '../api';
import Cookies from 'js-cookie';
import { STORAGE_KEYS, MESSAGES } from '../constants';
import type { AuthState, User } from '../../types';
import toast from 'react-hot-toast';

// Auth actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' };

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, error: null };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOGOUT':
      return {
        user: null,
        token: null,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  error: null,
};

// Context type
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  forceLogout: () => void;
}

// Create context
export const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Force logout function (for expired tokens)
  const forceLogout = (): void => {
    // Clear localStorage (only on client side)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }

    // Clear auth state
    dispatch({ type: 'LOGOUT' });

    // Show message and redirect to login
    toast.error('Your session has expired. Please log in again.');

    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  // Register global logout callback
  useEffect(() => {
    setGlobalLogoutCallback(forceLogout);
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Only access localStorage on client side
        if (typeof window === 'undefined') {
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }

        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

        if (storedUser && storedToken) {
          const user = JSON.parse(storedUser) as User;
          dispatch({ type: 'SET_USER', payload: user });
          dispatch({ type: 'SET_TOKEN', payload: storedToken });
        }
      } catch (error) {
        console.error('Failed to initialize auth state:', error);
        // Clear invalid data (only on client side)
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEYS.USER);
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        }
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    const result = await authApi.login({ email, password });

    matchResult(result, {
      success: data => {
        // Convert AuthResponse.user to full User with timestamps
        const fullUser: User = {
          ...data.user,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        dispatch({ type: 'SET_USER', payload: fullUser });
        dispatch({ type: 'SET_TOKEN', payload: data.token });

        // Save to localStorage (only on client side)
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(fullUser));
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
        }

        dispatch({ type: 'SET_LOADING', payload: false });
        toast.success(MESSAGES.SUCCESS.LOGIN);
      },
      error: error => {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        toast.error(error.message || MESSAGES.ERROR.LOGIN_FAILED);
      },
    });
  };

  // Register function
  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    const result = await authApi.register({ email, password, name });

    matchResult(result, {
      success: data => {
        // Convert AuthResponse.user to full User with timestamps
        const fullUser: User = {
          ...data.user,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        dispatch({ type: 'SET_USER', payload: fullUser });
        dispatch({ type: 'SET_TOKEN', payload: data.token });

        // Save to localStorage (only on client side)
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(fullUser));
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
        }

        dispatch({ type: 'SET_LOADING', payload: false });
        toast.success(MESSAGES.SUCCESS.REGISTER);
      },
      error: error => {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        toast.error(error.message || MESSAGES.ERROR.REGISTER_FAILED);
      },
    });
  };

  // Logout function
  const logout = (): void => {
    dispatch({ type: 'SET_LOADING', payload: true });

    // Clear auth state
    dispatch({ type: 'LOGOUT' });

    // Clear localStorage and cookies (only on client side)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      Cookies.remove(STORAGE_KEYS.AUTH_TOKEN);
    }

    toast.success(MESSAGES.SUCCESS.LOGOUT);

    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    forceLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
