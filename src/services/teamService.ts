/**
 * Team Service
 * 
 * Handles team management API calls.
 */

import apiClient from './apiClient';

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  active: boolean;
}

export interface CreateTeamMemberRequest {
  name: string;
  email?: string;
  phone: string;
  password: string;
}

interface ApiWrapper<T> {
  success: boolean;
  messageCodes: string[];
  body: T;
}

/**
 * Fetches all team members
 */
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const response = await apiClient.get<ApiWrapper<TeamMember[]>>('/api/admin/team');
    return response.data.body || [];
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
};

/**
 * Adds a new team member
 */
export const addTeamMember = async (data: CreateTeamMemberRequest): Promise<TeamMember> => {
  try {
    const response = await apiClient.post<ApiWrapper<TeamMember>>('/api/admin/team', data);
    return response.data.body;
  } catch (error) {
    console.error('Error adding team member:', error);
    throw error;
  }
};

/**
 * Removes a team member (deactivates)
 */
export const removeTeamMember = async (userId: number): Promise<void> => {
  try {
    await apiClient.delete<ApiWrapper<void>>(`/api/admin/team/${userId}`);
  } catch (error) {
    console.error('Error removing team member:', error);
    throw error;
  }
};
