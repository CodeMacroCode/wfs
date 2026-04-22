import apiClient from '@/lib/api-client';
import { CreateAssetDto, UpdateAssetDto, AssetsResponse, AssetQueryParams } from '@/types/asset';
import { toast } from 'sonner';

/**
 * Asset Service to handle asset-related API operations
 */
export const assetService = {
  /**
   * Create a new asset
   */
  create: async (data: CreateAssetDto): Promise<void> => {
    try {
      await apiClient.post<CreateAssetDto, void>('/assets', data);
      toast.success('Asset created successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create asset';
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Get all assets with optional filtering and search
   */
  getAll: async (params?: AssetQueryParams): Promise<AssetsResponse> => {
    try {
      const response = await apiClient.get<void, AssetsResponse>('/assets', { params });
      return response;
    } catch (error: unknown) {
      toast.error('Failed to fetch assets');
      throw error;
    }
  },

  /**
   * Update an existing asset
   */
  update: async (id: string, data: UpdateAssetDto): Promise<void> => {
    try {
      await apiClient.patch<UpdateAssetDto, void>(`/assets/${id}`, data);
      toast.success('Asset updated successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update asset';
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Delete an asset
   */
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete<void, void>(`/assets/${id}`);
      toast.success('Asset deleted successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete asset';
      toast.error(errorMessage);
      throw error;
    }
  },
};

export default assetService;
