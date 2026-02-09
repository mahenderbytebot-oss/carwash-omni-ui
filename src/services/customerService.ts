/**
 * Customer Service
 * 
 * Handles all customer-related API calls.
 */

import apiClient from './apiClient';
import type { User, AuthResponse } from './authService';

export interface Customer extends User {
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  serviceProviderId?: number;
  vehicleCount?: number;
  vehicles?: Vehicle[]; // Keep for backward compatibility or detail view
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  customerId: string;
  subscriptions?: Subscription[];
}

export interface Subscription {
  id: string;
  planId?: string; // Optional as backend might not return it in all views
  planName: string;
  startDate: string;
  endDate: string;
  status: string; // 'ACTIVE', 'INACTIVE' from backend
  price: number;
  customer?: Customer;
  vehicle?: Vehicle;
  scheduledDays?: string[]; // e.g. ["MONDAY", "WEDNESDAY"]
  cleanerId?: number;
  cleanerName?: string;
  customerName?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehiclePlate?: string;
}

export interface Payment {
  id: string;
  amount: number;
  paymentMethod: string;
  status: string;
  paymentDate: string;
  transactionId: string;
  notes?: string;
}

export interface WashHistory {
  id: string;
  vehicleInfo: string;
  status: string;
  scheduledDate: string;
  completedDate?: string;
  cleanerName: string;
  rating?: number;
}

export interface CreateCustomerRequest {
  name: string;
  mobile: string;
  email?: string;
  pin: string; // password
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface ApiWrapper<T> {
  success: boolean;
  messageCodes: string[];
  body: T;
}

/**
 * Fetches all customers
 */
export const getAllCustomers = async (query?: string): Promise<Customer[]> => {
  try {
    const params = query ? { query } : {};
    const response = await apiClient.get<ApiWrapper<Customer[]>>('/api/customers', { params });
    return response.data.body || [];
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

/**
 * Fetches a single customer by ID (includes vehicles and subscriptions)
 */
export const getCustomerById = async (id: string): Promise<Customer> => {
  try {
    const response = await apiClient.get<ApiWrapper<Customer>>(`/api/customers/${id}`);
    return response.data.body;
  } catch (error) {
    console.error(`Error fetching customer ${id}:`, error);
    throw error;
  }
};

/**
 * Fetches customer payments
 */
export const getCustomerPayments = async (id: string): Promise<Payment[]> => {
  try {
    const response = await apiClient.get<ApiWrapper<Payment[]>>(`/api/customers/${id}/payments`);
    return response.data.body || [];
  } catch (error) {
    console.error(`Error fetching payments for customer ${id}:`, error);
    throw error;
  }
};

/**
 * Fetches customer wash history
 */
export const getCustomerHistory = async (id: string): Promise<WashHistory[]> => {
  try {
    const response = await apiClient.get<ApiWrapper<WashHistory[]>>(`/api/customers/${id}/history`);
    return response.data.body || [];
  } catch (error) {
    console.error(`Error fetching history for customer ${id}:`, error);
    throw error;
  }
};

/**
 * Creates a new customer
 */
export const createCustomer = async (data: CreateCustomerRequest): Promise<Customer> => {
  try {
    // Determine service provider ID from current user (admin/SP)
    // For now hardcoded or fetched from auth store if needed, but backend often handles "my customers"
    const payload = { 
      ...data, 
      phone: data.mobile,
      password: data.pin,
      role: 'CUSTOMER' 
    }; 
    const response = await apiClient.post<ApiWrapper<AuthResponse>>('/api/customers', payload);
    // Map AuthResponse to Customer (frontend expects Customer, but backend returns AuthResponse for registration)
    // Actually, AdminCustomerController returns AuthResponse. 
    // We need to fetch the created customer or map it.
    // AuthResponse has customerId.
    const authBody = response.data.body;
    return {
       ...payload,
       id: authBody.customerId?.toString() || '0',
       role: 'CUSTOMER',
       serviceProviderId: authBody.serviceProviderId,
       vehicles: []
    } as any as Customer;

  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};
