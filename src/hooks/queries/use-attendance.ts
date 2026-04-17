import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { attendanceService } from "@/services/attendance-service";
import { QUERY_KEYS } from "@/constants/query-keys";
import { AttendanceResponse } from "@/types/attendance";

/**
 * Hook to fetch all attendance records with pagination
 */
export function useAttendanceQuery(
  page: number = 1, 
  limit: number = 10, 
  status?: string, 
  options?: Partial<UseQueryOptions<AttendanceResponse>>
) {
  return useQuery<AttendanceResponse>({
    queryKey: [...QUERY_KEYS.attendance.list(), { page, limit, status }],
    queryFn: () => attendanceService.getAll(page, limit, status),
    ...options
  });
}

/**
 * Hook to fetch monthly attendance for a specific user
 */
export function useMonthlyAttendanceQuery(userId: string, month: string, year: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.attendance.list(), 'monthly', { userId, month, year }],
    queryFn: () => attendanceService.getMonthlyAttendance(userId, month, year),
    enabled: !!userId && !!month && !!year,
  });
}
