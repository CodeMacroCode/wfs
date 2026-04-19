import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { leaveService } from '@/services/leave-service';
import { QUERY_KEYS } from '@/constants/query-keys';
import { LeaveRequest, UpdateLeaveRequest } from '@/types/leave';

/**
 * Hook to create a new leave request
 */
export function useCreateLeaveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LeaveRequest) => leaveService.create(data),
    onSuccess: () => {
      // Invalidate both leaves and attendance because leave affects attendance stats
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.leaves.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.attendance.all });
    },
  });
}

/**
 * Hook to fetch leaves for a specific employee
 */
export function useEmployeeLeavesQuery(userId: string, month: string, year: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.leaves.all, 'user', userId, { month, year }],
    queryFn: () => leaveService.getByUser(userId, month, year),
    enabled: !!userId && !!month && !!year,
  });
}

/**
 * Hook to fetch all leave requests with pagination and optional date filtering
 */
export function useLeavesQuery(
  page: number, 
  limit: number, 
  month?: string, 
  year?: string
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.leaves.all, { page, limit, month, year }],
    queryFn: () => leaveService.getAll(page, limit, month, year),
  });
}

/**
 * Hook to update leave status
 */
export function useUpdateLeaveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateLeaveRequest }) => 
      leaveService.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.leaves.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.attendance.all });
    },
  });
}
