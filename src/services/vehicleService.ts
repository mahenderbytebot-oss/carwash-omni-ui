/**
 * Vehicle Service
 * 
 * Handles vehicle-related API calls.
 */

import apiClient from './apiClient';
import type { Vehicle } from './customerService';

export interface AddVehicleRequest {
  make: string;
  model: string;
  year: number;
  color: string;
  registrationNumber: string;
  type: string; // sedan, suv, etc.
}

interface ApiWrapper<T> {
  success: boolean;
  messageCodes: string[];
  body: T;
}

/**
 * Adds a new vehicle to a customer
 */
export const addVehicle = async (customerId: string, data: AddVehicleRequest): Promise<Vehicle> => {
  try {
    const payload = {
      registrationNumber: data.registrationNumber,
      model: data.model,
      make: data.make,
      color: data.color,
      year: data.year,
      customerId: parseInt(customerId, 10),
      parkingLocation: 'Default', // Required by backend
      specialInstructions: '',
      type: data.type
    };
    
    const response = await apiClient.post<ApiWrapper<Vehicle>>(`/api/vehicles`, payload);
    return response.data.body;
  } catch (error) {
    console.error('Error adding vehicle:', error);
    throw error;
  }
};

/**
 * Deletes a vehicle
 */
export const deleteVehicle = async (vehicleId: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/vehicles/${vehicleId}`);
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    throw error;
  }
};

/**
 * Fetches all vehicles for the current user
 */
export const getMyVehicles = async (customerId: string): Promise<Vehicle[]> => {
  try {
    const response = await apiClient.get<ApiWrapper<Vehicle[]>>('/api/customer/vehicles', {
      params: { customerId }
    });
    return response.data.body || [];
  } catch (error) {
    console.error('Error fetching my vehicles:', error);
    throw error;
  }
};
