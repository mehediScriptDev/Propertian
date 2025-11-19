'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  startTransition,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
   * Frontend: client, admin, partner
   */
  const mapRoleToFrontend = (backendRole) => {
    // Normalize the role to lowercase for comparison
    const normalizedRole = backendRole?.toLowerCase().replace(/_/g, '');

    const roleMapping = {
      user: 'client',
      superadmin: 'admin',
      partner: 'partner',
    };

    return roleMapping[normalizedRole] || 'client';
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

      // Redirect based on mapped frontend role
      const locale = pathname.split('/')[1] || 'en';
      const dashboardRoutes = {
        admin: `/${locale}/dashboard/admin`,
        client: `/${locale}/dashboard/client`,
        partner: `/${locale}/dashboard/partner`,
      };

      router.push(dashboardRoutes[frontendRole]);
      return userData;
    } catch (error) {
      // Clear any temporary data on error
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      Cookies.remove('user');

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
      // Clear all cookies
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      Cookies.remove('user');

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
   * Check if user has required role
   * @param {string} requiredRole - Required role for access
   * @returns {boolean}
   */
  const hasRole = (requiredRole) => {
    return user?.role === requiredRole;
  };

  const value = {
    user,
    login,
    logout,
    register,
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
