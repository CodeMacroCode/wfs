import apiClient from '@/lib/api-client';
import { 
  AttendancePoliciesResponse, 
  CreateAttendancePolicyDto 
} from '@/types/attendance-policy';
import { toast } from 'sonner';

/**
 * Attendance Policy Service to handle all policy-related API operations
 */
export const attendancePolicyService = {
  /**
   * Get all attendance policies
   */
  getAll: async (): Promise<AttendancePoliciesResponse> => {
    try {
      return await apiClient.get<void, AttendancePoliciesResponse>('/attendance/policy');
    } catch (error: unknown) {
      toast.error('Failed to fetch attendance policies');
      throw error;
    }
  },

  /**
   * Create a new attendance policy
   */
  create: async (data: CreateAttendancePolicyDto): Promise<void> => {
    try {
      await apiClient.post<CreateAttendancePolicyDto, void>('/attendance/policy', data);
      toast.success('Attendance policy created successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create attendance policy';
      toast.error(errorMessage);
      throw error;
    }
  },
  /**
   * Update an existing attendance policy
   */
  update: async (id: string, data: CreateAttendancePolicyDto): Promise<void> => {
    try {
      await apiClient.put<CreateAttendancePolicyDto, void>(`/attendance/policy/${id}`, data);
      toast.success('Attendance policy updated successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update attendance policy';
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Delete an attendance policy
   */
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete<void, void>(`/attendance/policy/${id}`);
      toast.success('Attendance policy deleted successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete attendance policy';
      toast.error(errorMessage);
      throw error;
    }
  },
};

export default attendancePolicyService;
