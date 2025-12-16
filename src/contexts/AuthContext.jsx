'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  startTransition,
} from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import authService from '@/services/authService';

const AuthContext = createContext(null);

/**
 * Authentication Provider Component
 * Manages user authentication state and role-based access control
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for existing session on mount using startTransition for non-urgent updates
    startTransition(() => {
      const storedUser = Cookies.get('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      if (parsedUser) {
        setUser(parsedUser);
      }
      setLoading(false);
    });
  }, []);

  /**
   * Map backend roles to frontend roles
   * Backend: user, SUPER_ADMIN, superAdmin, partner
   * Frontend: user, admin, partner
   */
  const mapRoleToFrontend = (backendRole) => {
    // Normalize the role to lowercase for comparison
    const normalizedRole = backendRole?.toLowerCase().replace(/_/g, '');

    const roleMapping = {
      user: 'user',
      superadmin: 'admin',
      partner: 'partner',
    };

    return roleMapping[normalizedRole] || 'user';
  };

  /**
   * Login function with real backend API
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User object or error
   */
  const login = async (email, password) => {
    try {
      // Call backend API for login
      // Note: authService.login already returns response.data (see api.js)
      const loginData = await authService.login({ email, password });

      console.log('Login response:', loginData); // Debug log

      // Extract token from login response
      // Backend structure: { success, message, data: { user, token, refreshToken } }
      const token = loginData.data?.token || loginData.token || loginData.accessToken;
      const refreshToken = loginData.data?.refreshToken || loginData.refreshToken;

      if (!token) {
        console.error('No token in response:', loginData);
        throw new Error('No token received from server');
      }

      // Store token temporarily to make authenticated profile request
      Cookies.set('token', token, { expires: 1, sameSite: 'Lax', path: '/' });
      if (refreshToken) {
        Cookies.set('refreshToken', refreshToken, { expires: 7, sameSite: 'Lax', path: '/' });
      }

      // Fetch complete user profile from /auth/profile
      const profileData = await authService.getCurrentUser();
      console.log('Profile response:', profileData); // Debug log

      // Extract user from profile response
      const backendUser = profileData.data?.user || profileData.user || profileData.data || profileData;

      // Map backend role to frontend role
      const frontendRole = mapRoleToFrontend(backendUser.role);

      // Build complete user data with profile information
      const userData = {
        id: backendUser.id || backendUser._id,
        email: backendUser.email,
        firstName: backendUser.firstName,
        lastName: backendUser.lastName,
        fullName: `${backendUser.firstName || ''} ${backendUser.lastName || ''}`.trim(),
        phone: backendUser.phone,
        role: frontendRole,
        backendRole: backendUser.role, // Keep original backend role
        token: token,
        refreshToken: refreshToken,
        avatar: backendUser.avatar,
        isVerified: backendUser.isVerified,
        isActive: backendUser.isActive,
        createdAt: backendUser.createdAt,
        updatedAt: backendUser.updatedAt,
        lastLoginAt: backendUser.lastLoginAt,
      };

      // Store token in secure cookies
      Cookies.set('token', userData.token, { expires: 1, sameSite: 'Lax', path: '/' });
      if (userData.refreshToken) {
        Cookies.set('refreshToken', userData.refreshToken, { expires: 7, sameSite: 'Lax', path: '/' });
      }

      // Store user data in cookie (without token for security)
      const userDataWithoutToken = { ...userData };
      delete userDataWithoutToken.token;
      delete userDataWithoutToken.refreshToken;
      Cookies.set('user', JSON.stringify(userDataWithoutToken), { expires: 1, sameSite: 'Lax', path: '/' });

      setUser(userData);

      // Determine redirect destination:
      // - If a `redirect` query param exists (set by middleware when protecting pages), use it
      // - Otherwise send the user to their role dashboard
      const locale = pathname.split('/')[1] || 'en';
      const dashboardRoutes = {
        admin: `/${locale}/dashboard/admin`,
        user: `/${locale}/dashboard/user`,
        partner: `/${locale}/dashboard/partner`,
      };

      const redirectParam = searchParams?.get?.('redirect');
      // Only allow same-origin absolute paths to avoid open-redirect issues
      const safeRedirect =
        redirectParam && typeof redirectParam === 'string' && redirectParam.startsWith('/')
          ? redirectParam
          : null;

      router.push(safeRedirect || dashboardRoutes[frontendRole]);
      return userData;
    } catch (error) {
      // Clear any temporary data on error (ensure same path used when setting)
      Cookies.remove('token', { path: '/' });
      Cookies.remove('refreshToken', { path: '/' });
      Cookies.remove('user', { path: '/' });

      // Handle API errors
      const errorMessage =
        error.message || error.data?.message || 'Invalid credentials';
      throw new Error(errorMessage);
    }
  };

  /**
   * Logout function with backend API call
   */
  const logout = async () => {
    try {
      // Call backend logout API (optional - depends on your backend)
      await authService.logout();
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API fails
    } finally {
      // Clear all cookies (make sure to remove using same path)
      Cookies.remove('token', { path: '/' });
      Cookies.remove('refreshToken', { path: '/' });
      Cookies.remove('user', { path: '/' });

      setUser(null);
      const locale = pathname.split('/')[1] || 'en';
      router.push(`/${locale}/login`);
    }
  };

  /**
   * Register new user
   * @param {object} userData - User registration data
   * @returns {Promise<Object>} User object or error
   */
  const register = async (userData) => {
    try {
      // Call backend API
      const response = await authService.register(userData);

      console.log('Registration response:', response); // Debug log

      // Registration successful - redirect to login page
      const locale = pathname.split('/')[1] || 'en';
      router.push(`/${locale}/login`);

      return response;
    } catch (error) {
      const errorMessage =
        error.message || error.data?.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  };

  /**
   * DEV-ONLY: Impersonate a partner user for local development/testing.
   * This should never run in production. It sets cookies and the local user state
   * so you can quickly access the partner dashboard without a backend.
   */
  const devImpersonate = (email = 'dev@local', password = 'dev123') => {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('devImpersonate is only available in development');
      return;
    }

    const locale = pathname.split('/')[1] || 'en';

    const userData = {
      id: 'dev-partner',
      email,
      firstName: 'Dev',
      lastName: 'Partner',
      fullName: 'Dev Partner',
      phone: null,
      role: 'partner',
      backendRole: 'partner',
      avatar: null,
      isVerified: true,
      isActive: true,
    };

    // Set a dummy token and user cookie so middleware/client reads them
    Cookies.set('token', 'dev-token', { expires: 1, sameSite: 'Lax', path: '/' });
    Cookies.set('user', JSON.stringify(userData), { expires: 1, sameSite: 'Lax', path: '/' });

    setUser(userData);
    // Navigate to partner dashboard
    router.push(`/${locale}/dashboard/partner`);
  };

  /**
   * Update user data in state and cookies
   */
  const updateUserData = (updates) => {
    setUser(prev => {
      const updatedUser = { ...prev, ...updates };
      // Update cookie without token
      const userDataWithoutToken = { ...updatedUser };
      delete userDataWithoutToken.token;
      delete userDataWithoutToken.refreshToken;
      Cookies.set('user', JSON.stringify(userDataWithoutToken), { expires: 1, sameSite: 'Lax', path: '/' });
      return updatedUser;
    });
  };

  /**
   * Check if user has required role
   * @param {string} requiredRole - Required role for access
   * @returns {boolean}
   */
  const hasRole = (requiredRole) => {
    return user?.role === requiredRole;
  };

  const value = {
    user,
    setUser,
    updateUserData,
    login,
    logout,
    register,
    devImpersonate,
    hasRole,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to use authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
