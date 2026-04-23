import apiClient from '@/lib/api-client';
import { FuelExpense, FuelExpenseResponse, FuelQueryParams } from '@/types/fuel';
import { toast } from 'sonner';

export const fuelService = {
  /**
   * Get all fuel expenses with pagination and filters
   */
  getAll: async (params?: FuelQueryParams): Promise<FuelExpenseResponse> => {
    try {
      return await apiClient.get<void, FuelExpenseResponse>('/fuel-expenses', { params });
    } catch (error: unknown) {
      toast.error('Failed to fetch fuel expenses');
      throw error;
    }
  },

  /**
   * Log a new fuel expense
   */
  create: async (data: Partial<FuelExpense>): Promise<void> => {
    try {
      await apiClient.post<Partial<FuelExpense>, void>('/fuel-expenses', data);
      toast.success('Fuel expense logged successfully');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      const msg = err?.data?.message || err?.message || 'Failed to log fuel expense';
      toast.error(msg);
      throw error;
    }
  },

  /**
   * Delete a fuel expense record by ID
   */
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete<void, void>(`/fuel-expenses/${id}`);
      toast.success('Fuel record deleted');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      const msg = err?.data?.message || err?.message || 'Failed to delete record';
      toast.error(msg);
      throw error;
    }
  },
};

export default fuelService;
