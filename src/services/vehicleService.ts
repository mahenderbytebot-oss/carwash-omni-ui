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
  licensePlate: string;
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
      registrationNumber: data.licensePlate,
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
