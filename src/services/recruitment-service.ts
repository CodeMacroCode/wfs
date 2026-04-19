import apiClient from '@/lib/api-client';
import { RecruitmentResponse, InterviewQueryParams } from '@/types/recruitment';
import { toast } from 'sonner';

/**
 * Helper to normalize API response shape to internal Interview type
 */
function normalizeInterview(raw: any) {
  return {
    id: raw._id,
    _id: raw._id,
    candidateName: raw.candidateName,
    email: raw.email,
    contact: raw.contactNumber,
    contactNumber: raw.contactNumber,
    position: raw.appliedPosition,
    appliedPosition: raw.appliedPosition,
    interviewDate: raw.interviewDate,
    interviewer: raw.interviewerName,
    interviewerName: raw.interviewerName,
    feedback: raw.interviewerFeedback,
    interviewerFeedback: raw.interviewerFeedback,
    status: raw.selectionStatus,
    selectionStatus: raw.selectionStatus,
    resumes: raw.resumes,
    metadata: raw.metadata,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export const recruitmentService = {
  /**
   * Get all recruitment records with pagination and filters
   */
  getAll: async (params?: InterviewQueryParams): Promise<RecruitmentResponse> => {
    try {
      const response = await apiClient.get<void, any>('/recruitment', { params });
      return {
        ...response,
        data: (response.data || []).map(normalizeInterview),
      };
    } catch (error: unknown) {
      toast.error('Failed to fetch recruitment records');
      throw error;
    }
  },

  /**
   * Create a new recruitment record (multipart/form-data)
   */
  create: async (formData: FormData): Promise<void> => {
    try {
      await apiClient.post<FormData, void>('/recruitment', formData);
      toast.success('Candidate logged successfully');
    } catch (error: unknown) {
      const msg = (error as any)?.data?.message || (error as any)?.message || 'Failed to log candidate';
      toast.error(msg);
      throw error;
    }
  },

  /**
   * Delete a recruitment record by ID
   */
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete<void, void>(`/recruitment/${id}`);
      toast.success('Candidate record deleted');
    } catch (error: unknown) {
      const msg = (error as any)?.data?.message || (error as any)?.message || 'Failed to delete record';
      toast.error(msg);
      throw error;
    }
  },
};

export default recruitmentService;
