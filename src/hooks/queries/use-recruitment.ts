import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { recruitmentService, type RawInterview } from '@/services/recruitment-service';
import { QUERY_KEYS } from '@/constants/query-keys';
import { InterviewQueryParams } from '@/types/recruitment';

/**
 * Hook to fetch all recruitment records with pagination and filters
 */
export function useRecruitmentQuery(params?: InterviewQueryParams) {
  return useQuery({
    queryKey: QUERY_KEYS.recruitment.list(params),
    queryFn: () => recruitmentService.getAll(params),
  });
}

/**
 * Hook to create a new recruitment record
 */
export function useCreateRecruitmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => recruitmentService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recruitment.all });
    },
  });
}

/**
 * Hook to fetch a single recruitment record by ID
 */
export function useRecruitmentByIdQuery(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.recruitment.detail(id),
    queryFn: () => recruitmentService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to update a recruitment record by ID
 */
export function useUpdateRecruitmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RawInterview> }) => recruitmentService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recruitment.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recruitment.detail(id) });
    },
  });
}

/**
 * Hook to delete a recruitment record by ID
 */
export function useDeleteRecruitmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recruitmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recruitment.all });
    },
  });
}
