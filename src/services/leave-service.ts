import apiClient from '@/lib/api-client';
import { LeaveRequest, LeaveResponse, UpdateLeaveRequest } from '@/types/leave';
import { toast } from 'sonner';

/**
 * Leave Service to handle leave-related API operations
 */
export const leaveService = {
  /**
   * Create a new leave request
   */
  create: async (data: LeaveRequest): Promise<LeaveResponse> => {
    try {
      const response = await apiClient.post<LeaveRequest, LeaveResponse>('/leave', data);
      toast.success('Leave marked successfully');
      return response;
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to mark leave';
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Get leaves for a specific user filtered by month and year
   */
  getByUser: async (userId: string, month: string, year: string): Promise<{ data: any[] }> => {
    try {
      return await apiClient.get('/leave/by-user', {
        params: { userId, month, year }
      });
    } catch (error: unknown) {
      toast.error('Failed to fetch employee leaves');
      throw error;
    }
  },

  /**
   * Get all leave requests for management
   */
  getAll: async (
    page: number = 1, 
    limit: number = 10,
    month?: string,
    year?: string
  ): Promise<{ data: any[], total: number }> => {
    try {
      return await apiClient.get('/leave', {
        params: { page, limit, month, year }
      });
    } catch (error: unknown) {
      toast.error('Failed to fetch leave records');
      throw error;
    }
  },

  /**
   * Update leave request status (Approve/Reject)
   */
  updateStatus: async (id: string, data: UpdateLeaveRequest): Promise<LeaveResponse> => {
    try {
      const response = await apiClient.put<UpdateLeaveRequest, LeaveResponse>(`/leave/${id}`, data);
      toast.success(`Leave ${data.status.toLowerCase()} successfully`);
      return response;
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || `Failed to ${data.status.toLowerCase()} leave`;
      toast.error(errorMessage);
      throw error;
    }
  },
};

export default leaveService;
