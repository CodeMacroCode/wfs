import apiClient from '@/lib/api-client';
import { Reminder, CreateReminderDto } from '@/types/reminder';
import { toast } from 'sonner';

export const reminderService = {
  /**
   * Create a new reminder
   */
  create: async (data: CreateReminderDto): Promise<Reminder> => {
    try {
      const response = await apiClient.post<{ data: Reminder }, { data: Reminder }>('/reminder', data);
      return response.data;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      const msg = err?.data?.message || err?.message || 'Failed to create reminder';
      toast.error(msg);
      throw error;
    }
  },

  /**
   * Get all reminders
   */
  getAll: async (): Promise<{ data: Reminder[] }> => {
    try {
      return await apiClient.get<void, { data: Reminder[] }>('/reminder');
    } catch (error: unknown) {
      toast.error('Failed to fetch reminders');
      throw error;
    }
  }
};

export default reminderService;
