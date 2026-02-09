/**
 * Cleaner Dashboard Service
 * 
 * Handles API calls for the cleaner dashboard.
 */

import apiClient from './apiClient';

export interface WashAssignment {
  id: number;
  subscriptionId: number;
  scheduledDateTime: string;
  status: 'SCHEDULED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED' | 'VEHICLE_NOT_AVAILABLE' | 'SKIPPED' | 'CANCELLED';
  startedAt?: string;
  completedAt?: string;
  beforePhotos?: string[];
  afterPhotos?: string[];
  notes?: string;
  
  // Customer info
  customerName?: string;
  customerAddress?: string;
  customerPhone?: string;
  
  // Vehicle info
  vehicleMake?: string;
  vehicleModel?: string;
  vehiclePlate?: string;
  
  // Plan info
  planName?: string;
}

interface ApiWrapper<T> {
  success: boolean;
  messageCodes: string[];
  body: T;
}

/**
 * Fetches washes assigned to the current cleaner
 */
export const getAssignedWashes = async (): Promise<WashAssignment[]> => {
  try {
    const response = await apiClient.get<ApiWrapper<WashAssignment[]>>('/api/cleaner/washes/assigned');
    return response.data.body || [];
  } catch (error) {
    console.error('Error fetching assigned washes:', error);
    throw error;
  }
};

/**
 * Fetches wash history for the current cleaner
 */
export const getWashHistory = async (): Promise<WashAssignment[]> => {
  try {
    const response = await apiClient.get<ApiWrapper<WashAssignment[]>>('/api/cleaner/washes/history');
    return response.data.body || [];
  } catch (error) {
    console.error('Error fetching wash history:', error);
    throw error;
  }
};

/**
 * Updates the status of a wash
 */
export const updateWashStatus = async (
  washId: number, 
  status: 'IN_PROGRESS' | 'COMPLETED' | 'VEHICLE_NOT_AVAILABLE',
  notes?: string,
  photos?: File[]
): Promise<WashAssignment> => {
  try {
    if (photos && photos.length > 0) {
      // Use Multipart if photos are present
      const formData = new FormData();
      const jsonBlob = new Blob([JSON.stringify({ status, notes })], { type: 'application/json' }); 
      formData.append('request', jsonBlob);
      photos.forEach(photo => formData.append('photos', photo));
      
      const response = await apiClient.put<ApiWrapper<WashAssignment>>(
        `/api/cleaner/washes/${washId}/status`,
        formData
      );
      return response.data.body;
    } else {
      // Use standard JSON endpoint if no photos
      const response = await apiClient.put<ApiWrapper<WashAssignment>>(
        `/api/cleaner/washes/${washId}/status`,
        { status, notes }
      );
      return response.data.body;
    }
  } catch (error) {
    console.error('Error updating wash status:', error);
    throw error;
  }
};

/**
 * Gets cleaner's clock-in status
 */
export const getClockInStatus = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get<ApiWrapper<boolean>>('/api/cleaner/attendance/status');
    return response.data.body;
  } catch (error) {
    console.error('Error checking clock-in status:', error);
    return false;
  }
};

/**
 * Clock in with location
 */
export const clockIn = async (latitude: number, longitude: number): Promise<void> => {
  try {
    await apiClient.post<ApiWrapper<unknown>>('/api/cleaner/attendance/clock-in', {
      latitude,
      longitude
    });
  } catch (error) {
    console.error('Error clocking in:', error);
    throw error;
  }
};

/**
 * Clock out with location
 */
export const clockOut = async (latitude: number, longitude: number): Promise<void> => {
  try {
    await apiClient.post<ApiWrapper<unknown>>('/api/cleaner/attendance/clock-out', {
      latitude,
      longitude
    });
  } catch (error) {
    console.error('Error clocking out:', error);
    throw error;
  }
};
