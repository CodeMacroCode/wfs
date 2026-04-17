import apiClient from '@/lib/api-client';
import { DocCenterResponse, DocCenterQueryParams, CreateDocDto, DeleteFilesDto, UpdateDocFilesDto } from '@/types/doc-center';
import { toast } from 'sonner';

/**
 * Document Center Service to handle document-related API operations
 */
export const docCenterService = {
  /**
   * Get all documents with optional filtering and search
   */
  getAll: async (params?: DocCenterQueryParams): Promise<DocCenterResponse> => {
    try {
      const response = await apiClient.get<void, DocCenterResponse>('/doccenter', { params });
      return response;
    } catch (error: unknown) {
      toast.error('Failed to fetch documents');
      throw error;
    }
  },

  /**
   * Create a new document (Upload)
   * Uses FormData for multipart/form-data support
   */
  create: async (data: CreateDocDto): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('documentType', data.documentType);
      
      // Append multiple files
      if (Array.isArray(data.files)) {
        data.files.forEach((file) => {
          formData.append('files', file);
        });
      } else {
        formData.append('files', data.files);
      }

      await apiClient.post<FormData, void>('/doccenter', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Document uploaded successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload document';
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Delete a document
   */
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete<void, void>(`/doccenter/${id}`);
      toast.success('Document deleted successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete document';
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Delete specific files from a document
   */
  deleteFiles: async (data: DeleteFilesDto): Promise<void> => {
    try {
      await apiClient.post<DeleteFilesDto, void>('/doccenter/delete-files', data);
      toast.success('Files deleted successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete files';
      toast.error(errorMessage);
      throw error;
    }
  },
  /**
   * Add more files to an existing document
   */
  updateFiles: async (data: UpdateDocFilesDto): Promise<void> => {
    try {
      const formData = new FormData();
      data.files.forEach((file) => {
        formData.append('files', file);
      });

      await apiClient.patch<FormData, void>(`/doccenter/${data.documentId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Files added successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add files';
      toast.error(errorMessage);
      throw error;
    }
  },
};

export default docCenterService;
