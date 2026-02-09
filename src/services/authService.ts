/**
 * Authentication Service
 * 
 * Provides authentication functionality using Spring Boot REST API.
 */

import apiClient from './apiClient';
import type { UserRole } from '../store/authStore';

// ============================================================================
// Type Definitions
// ============================================================================

export interface LoginCredentials {
  mobile: string;
  pin: string;
}

export interface User {
  id: string;
  name: string;
  mobile: string;
  role: UserRole;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string; // pin
  phone: string;
  role: UserRole;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  serviceProviderId?: number; // For cleaners
}

export interface AuthResponse {
  token: string;
  type: string; // "Bearer"
  userId: number;
  email: string;
  name: string;
  role: string;
  serviceProviderId?: number;
  customerId?: number;
  cleanerId?: number;
}

interface ApiWrapper<T> {
  success: boolean;
  messageCodes: string[];
  body: T;
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Authenticates user with provided credentials
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    // Map mobile/pin to username/password for backend
    const payload = {
      username: credentials.mobile,
      password: credentials.pin
    };

    const response = await apiClient.post<ApiWrapper<AuthResponse>>('/api/auth/login', payload);
    
    // Interceptor now handles success: false by rejecting
    if (response.data.success) {
      const body = response.data.body;
      return {
        success: true,
        user: {
          id: body.userId.toString(),
          name: body.name,
          mobile: credentials.mobile,
          role: body.role as UserRole
        },
        token: body.token
      };
    }
    // This part is technically unreachable now due to interceptor, but keeps TS happy if return type requires it
    return { success: false, error: 'Unexpected response' };
  } catch (error: any) {
    console.error('Login error:', error);
    const apiError = error.response?.data;
    // Prefer message from body (messageCodes), then body message, then error object message
    const errorMessage = (apiError?.messageCodes && apiError.messageCodes[0]) ||
                         apiError?.message ||
                         error.message ||
                         'Unable to connect to server.';
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Registers a new customer
 */
export const registerCustomer = async (data: Omit<RegisterRequest, 'role' | 'serviceProviderId'>): Promise<LoginResponse> => {
  try {
    const payload = {
      ...data,
      role: 'CUSTOMER',
      serviceProviderId: 1
    };

    const response = await apiClient.post<ApiWrapper<AuthResponse>>('/api/auth/register/customer', payload);

    // Interceptor now handles success: false by rejecting
    if (response.data.success) {
      const body = response.data.body;
      return {
        success: true,
        user: {
          id: body.userId.toString(),
          name: body.name,
          mobile: data.phone,
          role: body.role as UserRole
        },
        token: body.token
      };
    }
    return { success: false, error: 'Unexpected response' };
  } catch (error: any) {
    console.error('Registration error:', error);
    const apiError = error.response?.data;
    const errorMessage = (apiError?.messageCodes && apiError.messageCodes[0]) ||
                         apiError?.message ||
                         error.message ||
                         'Registration failed.';
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Logs out the current user
 */
export const logout = async (): Promise<void> => {
  // Client-side logout is sufficient for JWT, but we could call a backend endpoint if needed
  return Promise.resolve();
};
