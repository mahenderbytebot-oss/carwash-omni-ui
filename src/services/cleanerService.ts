/**
 * Cleaner Service
 * 
 * Handles cleaner management API calls.
 */

import apiClient from './apiClient';

export interface Cleaner {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  dateOfJoining?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  active: boolean;
  assignedSubscriptionsCount: number;
}

export interface CreateCleanerRequest {
  name: string;
  email?: string;
  phone: string;
  password: string;
  serviceProviderId: number;
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
 * Fetches all cleaners
 */
export const getAllCleaners = async (query?: string): Promise<Cleaner[]> => {
  try {
    const params = query ? { query } : {};
    const response = await apiClient.get<ApiWrapper<Cleaner[]>>('/api/cleaners', { params });
    return response.data.body || [];
  } catch (error) {
    console.error('Error fetching cleaners:', error);
    throw error;
  }
};

/**
 * Fetches a single cleaner by ID
 */
export const getCleanerById = async (id: number): Promise<Cleaner> => {
  try {
    const response = await apiClient.get<ApiWrapper<Cleaner>>(`/api/cleaners/${id}`);
    return response.data.body;
  } catch (error) {
    console.error(`Error fetching cleaner ${id}:`, error);
    throw error;
  }
};

/**
 * Creates a new cleaner
 */
export const createCleaner = async (data: CreateCleanerRequest): Promise<Cleaner> => {
  try {
    const response = await apiClient.post<ApiWrapper<Cleaner>>('/api/cleaners', data);
    return response.data.body;
  } catch (error) {
    console.error('Error creating cleaner:', error);
    throw error;
  }
};

/**
 * Updates a cleaner
 */
export const updateCleaner = async (id: number, data: CreateCleanerRequest): Promise<Cleaner> => {
  try {
    const response = await apiClient.put<ApiWrapper<Cleaner>>(`/api/cleaners/${id}`, data);
    return response.data.body;
  } catch (error) {
    console.error('Error updating cleaner:', error);
    throw error;
  }
};

/**
 * Deactivates a cleaner
 */
export const deactivateCleaner = async (id: number): Promise<void> => {
  try {
    await apiClient.delete<ApiWrapper<void>>(`/api/cleaners/${id}`);
  } catch (error) {
    console.error('Error deactivating cleaner:', error);
    throw error;
  }
};
