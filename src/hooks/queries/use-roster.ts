import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rosterService } from '@/services/roster-service';
import { QUERY_KEYS } from '@/constants/query-keys';
import { AssignRosterDto, AssignAttendancePolicyDto } from '@/types/roster';

/**
 * Hook to fetch all rosters
 */
export function useRostersQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.rosters.list(),
    queryFn: () => rosterService.getAll(),
  });
}

/**
 * Hook to fetch assigned attendance policies
 */
export function useAssignAttendancePolicyQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...QUERY_KEYS.rosters.all, 'assigned-policies', page, limit],
    queryFn: () => rosterService.getAssignedPolicies(page, limit),
  });
}

/**
 * Hook to assign a roster
 */
export function useAssignRosterMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AssignRosterDto) => rosterService.assign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rosters.all });
    },
  });
}

/**
 * Hook to delete a roster entry
 */
export function useDeleteRosterMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => rosterService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rosters.all });
    },
  });
}

/**
 * Hook to assign attendance policy to multiple users
 */
export function useAssignAttendancePolicyMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AssignAttendancePolicyDto) => rosterService.assignAttendancePolicy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rosters.all });
    },
  });
}
