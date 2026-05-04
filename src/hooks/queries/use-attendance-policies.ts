import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { attendancePolicyService } from '@/services/attendance-policy-service';
import { QUERY_KEYS } from '@/constants/query-keys';
import { CreateAttendancePolicyDto } from '@/types/attendance-policy';

/**
 * Hook to fetch all attendance policies
 */
export function useAttendancePoliciesQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.attendancePolicies.list(),
    queryFn: () => attendancePolicyService.getAll(),
  });
}

/**
 * Hook to create a new attendance policy
 */
export function useCreateAttendancePolicyMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateAttendancePolicyDto) => attendancePolicyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.attendancePolicies.all });
    },
  });
}

/**
 * Hook to update an existing attendance policy
 */
export function useUpdateAttendancePolicyMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateAttendancePolicyDto }) => 
      attendancePolicyService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.attendancePolicies.all });
    },
  });
}

/**
 * Hook to delete an attendance policy
 */
export function useDeleteAttendancePolicyMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => attendancePolicyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.attendancePolicies.all });
    },
  });
}
