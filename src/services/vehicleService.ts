/**
 * Vehicle Service
 * 
 * Handles vehicle-related API calls.
 */

import apiClient from './apiClient';
import type { Vehicle } from './customerService';
import { useAuthStore } from '../store/authStore';

export interface AddVehicleRequest {
  make: string;
  model: string;
  year: number;
  color: string;
  registrationNumber: string;
  type: string; // sedan, suv, etc.
  parkingLocation: string;
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
      parkingLocation: data.parkingLocation,
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
 * Updates an empty vehicle
 */
export const updateVehicle = async (vehicleId: string, data: AddVehicleRequest): Promise<Vehicle> => {
  try {
    // For update, we might not need all fields, but the request DTO likely requires them.
    // We'll pass the full object as confirmed by the backend controller accepting VehicleRequest.
    const payload = {
      registrationNumber: data.registrationNumber,
      model: data.model,
      make: data.make,
      color: data.color,
      year: data.year,
      customerId: 0, // Customer ID is set by backend from security context or ignored if not needed for update validation
      parkingLocation: data.parkingLocation,
      specialInstructions: '',
      type: data.type
    };
    
    const userRole = useAuthStore.getState().user?.role;
    const endpoint = userRole === 'CUSTOMER' 
      ? `/api/customer/vehicles/${vehicleId}` 
      : `/api/vehicles/${vehicleId}`;

    const response = await apiClient.put<ApiWrapper<Vehicle>>(endpoint, payload);
    return response.data.body;
  } catch (error) {
    console.error('Error updating vehicle:', error);
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
