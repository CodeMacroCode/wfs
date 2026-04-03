import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

/**
 * Attendance Service to handle attendance-related API operations
 */
export const attendanceService = {
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
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to upload attendance';
      toast.error(errorMessage);
      throw error;
    }
  },
};

export default attendanceService;
