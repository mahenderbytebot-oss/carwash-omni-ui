
import apiClient from './apiClient';

export interface WashRecord {
  id: number;
  subscriptionId?: number;
  status: 'SCHEDULED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'VEHICLE_NOT_AVAILABLE' | 'SKIPPED' | 'MISSED' | 'VERIFIED';
  scheduledDateTime: string;
  startedAt?: string;
  completedAt?: string;
  beforePhotos?: string[];
  afterPhotos?: string[];
  notes?: string;
  
  // Cleaner info
  cleanerId?: number;
  cleanerName?: string;
  cleanerPhone?: string;

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

interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

interface ApiWrapper<T> {
  success: boolean;
  messageCodes: string[];
  body: T;
}

/**
 * Get wash history for the current logged-in customer.
 * 
 * @param filterType 'TODAY' | 'UPCOMING' | 'PAST'
 * @param page Page number (0-indexed)
 * @param size Page size
 */
export const getMyWashes = async (filterType?: string, page = 0, size = 10): Promise<Page<WashRecord>> => {
  try {
    const params: Record<string, string | number> = { page, size };
    if (filterType) {
      params.filterType = filterType;
    }
    const response = await apiClient.get<ApiWrapper<Page<WashRecord>>>('/api/customer/washes/history', { params });
    return response.data.body;
  } catch (error) {
    console.error('Error fetching wash history:', error);
    throw error;
  }
};

/**
 * Get today's scheduled washes for admin dashboard.
 */
export const getTodayWashes = async (): Promise<WashRecord[]> => {
  try {
    const response = await apiClient.get<ApiWrapper<WashRecord[]>>('/api/admin/washes/today');
    return response.data.body || [];
  } catch (error) {
    console.error('Error fetching today\'s washes:', error);
    throw error;
  }
};

/**
 * Manually generate a wash task for today for a given subscription.
 */
export const generateWashTask = async (subscriptionId: number): Promise<WashRecord> => {
  try {
    const response = await apiClient.post<ApiWrapper<WashRecord>>(`/api/admin/washes/generate/${subscriptionId}`);
    return response.data.body;
  } catch (error) {
    console.error('Error generating wash task:', error);
    throw error;
  }
};
