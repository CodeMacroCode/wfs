import apiClient from '@/lib/api-client';
import { 
  Department, 
  Designation, 
  CreateDepartmentDto, 
  CreateDesignationDto, 
  OrgListResponse, 
  OrgResponse 
} from '@/types/org';
import { toast } from 'sonner';

export const orgService = {
  // Department
  getDepartments: async (): Promise<OrgListResponse<Department>> => {
    try {
      return await apiClient.get('/org/department');
    } catch (error) {
      toast.error('Failed to fetch departments');
      throw error;
    }
  },
  createDepartment: async (data: CreateDepartmentDto): Promise<OrgResponse<Department>> => {
    try {
      return await apiClient.post('/org/department', data);
    } catch (error) {
      toast.error('Failed to create department');
      throw error;
    }
  },
  updateDepartment: async (id: string, data: Partial<CreateDepartmentDto>): Promise<OrgResponse<Department>> => {
    try {
      return await apiClient.put(`/org/department/${id}`, data);
    } catch (error) {
      toast.error('Failed to update department');
      throw error;
    }
  },
  deleteDepartment: async (id: string): Promise<OrgResponse<Department>> => {
    try {
      return await apiClient.delete(`/org/department/${id}`);
    } catch (error) {
      toast.error('Failed to delete department');
      throw error;
    }
  },

  // Designation
  getDesignations: async (): Promise<OrgListResponse<Designation>> => {
    try {
      return await apiClient.get('/org/designation');
    } catch (error) {
      toast.error('Failed to fetch designations');
      throw error;
    }
  },
  createDesignation: async (data: CreateDesignationDto): Promise<OrgResponse<Designation>> => {
    try {
      return await apiClient.post('/org/designation', data);
    } catch (error) {
      toast.error('Failed to create designation');
      throw error;
    }
  },
  updateDesignation: async (id: string, data: Partial<CreateDesignationDto>): Promise<OrgResponse<Designation>> => {
    try {
      return await apiClient.put(`/org/designation/${id}`, data);
    } catch (error) {
      toast.error('Failed to update designation');
      throw error;
    }
  },
  deleteDesignation: async (id: string): Promise<OrgResponse<Designation>> => {
    try {
      return await apiClient.delete(`/org/designation/${id}`);
    } catch (error) {
      toast.error('Failed to delete designation');
      throw error;
    }
  }
};
