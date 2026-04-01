import apiClient from '@/lib/api-client';
import { 
  EmployeesResponse, 
  RegisterEmployeeDto, 
  UpdateEmployeeDto, 
  EmployeeQueryParams 
} from '@/types/employee';
import { toast } from 'sonner';

/**
 * Employee Service to handle all employee-related API operations
 */
export const employeeService = {
  /**
   * Get all employees with optional filters and pagination
   */
  getAll: async (params?: EmployeeQueryParams): Promise<EmployeesResponse> => {
    try {
      return await apiClient.get<void, EmployeesResponse>('/user/get-all', { params });
    } catch (error: unknown) {
      toast.error('Failed to fetch employees');
      throw error;
    }
  },

  /**
   * Register a new employee
   */
  register: async (data: RegisterEmployeeDto): Promise<void> => {
    try {
      await apiClient.post<RegisterEmployeeDto, void>('/user/register', data);
      toast.success('Employee registered successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to register employee';
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Update an existing employee
   */
  update: async (id: string, data: UpdateEmployeeDto): Promise<void> => {
    try {
      await apiClient.put<UpdateEmployeeDto, void>(`/user/update/${id}`, data);
      toast.success('Employee updated successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update employee';
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Delete an employee
   */
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete<void, void>(`/user/delete/${id}`);
      toast.success('Employee deleted successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete employee';
      toast.error(errorMessage);
      throw error;
    }
  },
};

export default employeeService;
