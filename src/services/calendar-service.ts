import apiClient from '@/lib/api-client';
import { 
  CalendarResponse, 
  UpdateDatePayload, 
  InitializeYearPayload 
} from '@/types/calendar';
import { toast } from 'sonner';

/**
 * Calendar Service handles all operations with /company-calendar endpoints
 */
export const calendarService = {
  /**
   * Get calendar data for a specific year and month
   * @param year - Numerical year (e.g. 2026)
   * @param month - Numerical month (1-12)
   */
  getMonthlyData: async (year: number, month: number): Promise<CalendarResponse> => {
    try {
      return await apiClient.get<void, CalendarResponse>('/company-calendar/month', {
        params: { year, month: month.toString().padStart(2, '0') }
      });
    } catch (error: unknown) {
      toast.error('Failed to fetch calendar data');
      throw error;
    }
  },

  /**
   * Update details for a specific date
   * @param data - Update payload
   */
  updateDate: async (data: UpdateDatePayload): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiClient.put<UpdateDatePayload, { success: boolean; message?: string }>(
        '/company-calendar/update-date', 
        data
      );
      toast.success('Calendar updated successfully');
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update calendar';
      toast.error(message);
      throw error;
    }
  },

  /**
   * Initialize calendar for a specific year
   * @param year - The year to initialize
   */
  initializeYear: async (year: number): Promise<{ success: boolean }> => {
    try {
      const response = await apiClient.post<InitializeYearPayload, { success: boolean }>(
        '/company-calendar', 
        { year }
      );
      toast.success(`Calendar initialized for ${year}`);
      return response;
    } catch (error: unknown) {
      toast.error('Failed to initialize calendar year');
      throw error;
    }
  }
};

export default calendarService;
