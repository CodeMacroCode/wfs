import apiClient from '@/lib/api-client';
import {
  BrandQueryParams,
  BrandsResponse,
  BrandResponse,
  CreateBrandDto,
  UpdateBrandDto
} from '@/types/brand';
import { toast } from 'sonner';

/**
 * Brand Service to handle all brand-related API operations
 */
export const brandService = {
  /**
   * Get all brands with optional filters and pagination
   */
  getAll: async (params?: BrandQueryParams): Promise<BrandsResponse> => {
    try {
      return await apiClient.get<void, BrandsResponse>('/brands', { params });
    } catch (error: unknown) {
      toast.error('Failed to fetch brands');
      throw error;
    }
  },

  /**
   * Get a single brand by ID
   */
  getById: async (id: string): Promise<BrandResponse> => {
    try {
      return await apiClient.get<void, BrandResponse>(`/brands/${id}`);
    } catch (error: unknown) {
      toast.error('Failed to fetch brand details');
      throw error;
    }
  },

  /**
   * Create a new brand
   */
  create: async (data: CreateBrandDto): Promise<BrandResponse> => {
    try {
      const response = await apiClient.post<CreateBrandDto, BrandResponse>('/brands', data);
      toast.success('Brand created successfully');
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create brand';
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Update an existing brand
   */
  update: async (id: string, data: UpdateBrandDto): Promise<BrandResponse> => {
    try {
      const response = await apiClient.put<UpdateBrandDto, BrandResponse>(`/brands/${id}`, data);
      toast.success('Brand updated successfully');
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update brand';
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Delete a brand
   */
  delete: async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiClient.delete<void, { success: boolean; message?: string }>(`/brands/${id}`);
      toast.success('Brand deleted successfully');
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete brand';
      toast.error(errorMessage);
      throw error;
    }
  },
};

export default brandService;
