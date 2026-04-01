import apiClient from '@/lib/api-client';

/**
 * Generic API Service Template
 * Use this pattern for creating specific entity services (e.g., UserService, ProductService)
 */
export const apiServiceTemplate = {
  /**
   * GET request
   */
  get: async <T>(url: string, params?: unknown): Promise<T> => {
    return apiClient.get(url, { params });
  },

  /**
   * POST request
   */
  post: async <T>(url: string, data?: unknown): Promise<T> => {
    return apiClient.post(url, data);
  },

  /**
   * PUT request
   */
  put: async <T>(url: string, data?: unknown): Promise<T> => {
    return apiClient.put(url, data);
  },

  /**
   * DELETE request
   */
  delete: async <T>(url: string): Promise<T> => {
    return apiClient.delete(url);
  },
};

export default apiServiceTemplate;
