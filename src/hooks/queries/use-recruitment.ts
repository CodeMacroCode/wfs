import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { recruitmentService } from '@/services/recruitment-service';
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
