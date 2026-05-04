import apiClient from '@/lib/api-client';
import { 
  PayrollPoliciesResponse, 
  CreatePayrollPolicyDto,
  PayrollPolicy,
  ApiResponse
} from '@/types/payroll-policy';
import { toast } from 'sonner';

/**
 * Payroll Policy Service to handle all policy-related API operations
 */
export const payrollPolicyService = {
  /**
   * Get all payroll policies
   */
  getAll: async (): Promise<PayrollPoliciesResponse> => {
    try {
      return await apiClient.get<void, PayrollPoliciesResponse>('/payroll/policy');
    } catch (error: unknown) {
      toast.error('Failed to fetch payroll policies');
      throw error;
    }
  },

  /**
   * Create a new payroll policy
   */
  create: async (data: CreatePayrollPolicyDto): Promise<ApiResponse<PayrollPolicy>> => {
    try {
      const response = await apiClient.post<CreatePayrollPolicyDto, ApiResponse<PayrollPolicy>>('/payroll/policy', data);
      toast.success('Payroll policy created successfully');
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create payroll policy';
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Update an existing payroll policy
   */
  update: async (id: string, data: CreatePayrollPolicyDto): Promise<ApiResponse<PayrollPolicy>> => {
    try {
      const response = await apiClient.put<CreatePayrollPolicyDto, ApiResponse<PayrollPolicy>>(`/payroll/policy/${id}`, data);
      toast.success('Payroll policy updated successfully');
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update payroll policy';
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Delete a payroll policy
   */
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete<void, void>(`/payroll/policy/${id}`);
      toast.success('Payroll policy deleted successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete payroll policy';
      toast.error(errorMessage);
      throw error;
    }
  },
};

export default payrollPolicyService;
