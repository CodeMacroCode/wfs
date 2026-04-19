import apiClient from '@/lib/api-client';
import { Company, CompanyResponse, CompanyQueryParams, CreateCompanyDto, CompanyDropdownResponse } from '@/types/company';
import { toast } from 'sonner';

/**
 * Company Service handles all operations with /company endpoints
 */
export const companyService = {
  /**
   * Get all companies with optional filtering
   */
  getAll: async (params?: CompanyQueryParams): Promise<CompanyResponse> => {
    try {
      return await apiClient.get<void, CompanyResponse>('/company', { params });
    } catch (error: unknown) {
      toast.error('Failed to fetch companies');
      throw error;
    }
  },

  /**
   * Create a new company
   */
  create: async (data: CreateCompanyDto): Promise<Company> => {
    try {
      const response = await apiClient.post<CreateCompanyDto, { success: boolean; data: Company }>(
        '/company',
        data
      );
      toast.success('Company created successfully');
      return response.data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create company';
      toast.error(message);
      throw error;
    }
  },

  /**
   * Update an existing company
   */
  update: async (id: string, data: Partial<CreateCompanyDto>): Promise<Company> => {
    try {
      const response = await apiClient.put<Partial<CreateCompanyDto>, { success: boolean; data: Company }>(
        `/company/${id}`,
        data
      );
      toast.success('Company updated successfully');
      return response.data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update company';
      toast.error(message);
      throw error;
    }
  },

  /**
   * Delete a company
   */
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete<void, void>(`/company/${id}`);
      toast.success('Company deleted successfully');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete company';
      toast.error(message);
      throw error;
    }
  },
  
  /**
   * Get company dropdown list
   */
  getDropdown: async (): Promise<CompanyDropdownResponse> => {
    try {
      return await apiClient.get<void, CompanyDropdownResponse>('/company/dropdown');
    } catch (error: unknown) {
      toast.error('Failed to fetch company dropdown');
      throw error;
    }
  },
};

export default companyService;
