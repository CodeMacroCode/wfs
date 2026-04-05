import apiClient from '@/lib/api-client';
import { AttendanceResponse } from '@/types/attendance';
import { toast } from 'sonner';

/**
 * Attendance Service to handle attendance-related API operations
 */
export const attendanceService = {
  /**
   * Get all attendance records with pagination
   */
  getAll: async (page: number = 1, limit: number = 10): Promise<AttendanceResponse> => {
    try {
      return await apiClient.get<void, AttendanceResponse>('/attendance', {
        params: { page, limit }
      });
    } catch (error: unknown) {
      toast.error('Failed to fetch attendance records');
      throw error;
    }
  },

  /**
   * Upload attendance file
   * @param file - The file to upload
   */
  uploadAttendance: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await apiClient.post<FormData, void>('/attendance/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Attendance uploaded successfully');
    } catch (error) {
      const apiError = error as { data?: { message?: string }; message?: string };
      const errorMessage = apiError.data?.message || apiError.message || 'Failed to upload attendance';
      toast.error(errorMessage);
      throw error;
    }
  },
};

export default attendanceService;
