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
}

export interface CreateSubscriptionRequest {
  planId: string;
  startDate: string;
  scheduledDays?: string[]; // Array of strings like "MONDAY", "WEDNESDAY"
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

export interface SubscriptionPlanRequest {
  name: string;
  description: string;
  price: number;
  durationDays: number;
  washesPerWeek: number;
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
