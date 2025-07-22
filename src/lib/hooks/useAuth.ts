import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { AuthState } from '../../types';

// Custom hook to use auth context
export const useAuth = (): AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  forceLogout: () => void;
} => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
