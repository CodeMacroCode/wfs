import apiClient from '@/lib/api-client';
import { SalaryPayload, SalaryListResponse, PayrollCalculationResult } from '@/types/salary';
import { toast } from 'sonner';

/**
 * Salary Service to handle all salary-related API operations
 */
export const salaryService = {
  /**
   * Create or update employee salary configuration
   */
  createSalary: async (data: SalaryPayload): Promise<void> => {
    try {
      await apiClient.post<SalaryPayload, void>('/employee-salary/add', data);
      toast.success('Salary updated successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update salary';
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Get all employee salaries with pagination
   */
  getSalaries: async (page: number = 1, limit: number = 10): Promise<SalaryListResponse> => {
    try {
      return await apiClient.get<void, SalaryListResponse>('/employee-salary/get', {
        params: { page, limit }
      });
    } catch (error: unknown) {
      toast.error('Failed to fetch salaries');
      throw error;
    }
  },

  /**
   * Delete an employee salary configuration
   */
  deleteSalary: async (userId: string): Promise<void> => {
    try {
      await apiClient.delete<void, void>(`/delete/${userId}`);
      toast.success('Salary configuration deleted');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete salary';
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Update an employee salary configuration
   */
  updateSalary: async (userId: string, data: SalaryPayload): Promise<void> => {
    try {
      await apiClient.put<SalaryPayload, void>(`/employee-salary/update/${userId}`, data);
      toast.success('Salary configuration updated');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update salary';
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Calculate employee salary for a specific month
   */
  calculatePayroll: async (employeeId: string, month: string): Promise<PayrollCalculationResult> => {
    try {
      return await apiClient.get<void, PayrollCalculationResult>('/employee-salary/calculate', {
        params: { employeeId, month }
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to calculate salary';
      toast.error(errorMessage);
      throw error;
    }
  },
};

export default salaryService;
