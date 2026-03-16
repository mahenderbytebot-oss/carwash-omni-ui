/**
 * Subscription Service
 * 
 * Handles subscription and plan related API calls.
 */

import apiClient from './apiClient';
import type { Subscription } from './customerService';

export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  washesPerWeek?: number;
  waterWashes?: number;
  active?: boolean;
}

export interface CreateSubscriptionRequest {
  planId: string;
  startDate: string;
  scheduledDays?: string[]; // Array of strings like "MONDAY", "WEDNESDAY"
  discount?: number;
  paymentStatus?: string;
  paymentMode?: string;
  onlinePaymentType?: string;
  paymentReference?: string;
}

interface ApiWrapper<T> {
  success: boolean;
  messageCodes: string[];
  body: T;
}

/**
 * Fetches all available subscription plans
 */
export const getPlans = async (): Promise<Plan[]> => {
  try {
    const response = await apiClient.get<ApiWrapper<Plan[]>>('/api/plans');
    return response.data.body || [];
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw error;
  }
};

/**
 * Adds a subscription to a vehicle
 */
export const addSubscription = async (vehicleId: string, data: CreateSubscriptionRequest): Promise<Subscription> => {
  try {
    const response = await apiClient.post<ApiWrapper<Subscription>>(`/api/vehicles/${vehicleId}/subscriptions`, { ...data, vehicleId });
    return response.data.body;
  } catch (error) {
    console.error('Error adding subscription:', error);
    throw error;
  }
};

/**
 * Updates a subscription's plan
 */
export const updateSubscriptionPlan = async (subscriptionId: string | number, data: CreateSubscriptionRequest): Promise<Subscription> => {
  try {
    const response = await apiClient.put<ApiWrapper<Subscription>>(`/api/subscriptions/${subscriptionId}/plan`, data);
    return response.data.body;
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    throw error;
  }
};

export interface SubscriptionPlanRequest {
  name: string;
  description: string;
  price: number;
  durationDays: number;
  washesPerWeek: number;
  waterWashes: number;
  active: boolean;
}

/**
 * Creates a new subscription plan
 */
export const createPlan = async (data: SubscriptionPlanRequest): Promise<Plan> => {
  try {
    const response = await apiClient.post<ApiWrapper<Plan>>('/api/plans', data);
    return response.data.body;
  } catch (error) {
    console.error('Error creating plan:', error);
    throw error;
  }
};

/**
 * Updates an existing subscription plan
 */
export const updatePlan = async (id: string, data: SubscriptionPlanRequest): Promise<Plan> => {
  try {
    const response = await apiClient.put<ApiWrapper<Plan>>(`/api/plans/${id}`, data);
    return response.data.body;
  } catch (error) {
    console.error('Error updating plan:', error);
    throw error;
  }
};

/**
 * Fetches all subscriptions for the service provider
 */
export const getSubscriptions = async (): Promise<Subscription[]> => {
  try {
    const response = await apiClient.get<ApiWrapper<Subscription[]>>('/api/subscriptions');
    return response.data.body || [];
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    throw error;
  }
};

/**
 * Assigns a cleaner to a subscription
 */
export const assignCleaner = async (subscriptionId: number, cleanerId: number): Promise<void> => {
  try {
    await apiClient.post<ApiWrapper<void>>(`/api/subscriptions/${subscriptionId}/assign-cleaner`, null, {
      params: { cleanerId }
    });
  } catch (error) {
    console.error('Error assigning cleaner:', error);
    throw error;
  }
};

/**
 * Search subscriptions
 */
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

/**
 * Search subscriptions with pagination
 */
export const searchSubscriptions = async (keyword?: string, status?: string, unassignedOnly: boolean = false, page: number = 0, size: number = 10): Promise<Page<Subscription>> => {
  try {
    const response = await apiClient.get<ApiWrapper<Page<Subscription>>>('/api/subscriptions/search', {
      params: { keyword, status, unassignedOnly, page, size }
    });
    return response.data.body || { content: [], totalPages: 0, totalElements: 0, size, number: 0 };
  } catch (error) {
    console.error('Error searching subscriptions:', error);
    throw error;
  }
};

/**
 * Renew subscription
 */
export const renewSubscription = async (id: string | number): Promise<void> => {
  try {
    await apiClient.post<ApiWrapper<void>>(`/api/subscriptions/${id}/renew`);
  } catch (error) {
    console.error('Error renewing subscription:', error);
    throw error;
  }
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (
  id: string | number, 
  status: string, 
  mode?: string, 
  type?: string, 
  reference?: string
): Promise<void> => {
  try {
    await apiClient.put<ApiWrapper<void>>(`/api/subscriptions/${id}/payment`, null, {
      params: { 
        status, 
        mode, 
        type, 
        reference 
      }
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

/**
 * Get active subscriptions scheduled for the current day.
 */
export const getScheduledSubscriptionsToday = async (): Promise<Subscription[]> => {
  try {
    const response = await apiClient.get<ApiWrapper<Subscription[]>>('/api/admin/subscriptions/scheduled-today');
    return response.data.body || [];
  } catch (error) {
    console.error('Error fetching today\'s scheduled subscriptions:', error);
    throw error;
  }
};
