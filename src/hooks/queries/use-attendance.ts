import { useQuery } from "@tanstack/react-query";
import { attendanceService } from "@/services/attendance-service";
import { QUERY_KEYS } from "@/constants/query-keys";

/**
 * Hook to fetch all attendance records with pagination
 */
export function useAttendanceQuery(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...QUERY_KEYS.attendance.list(), { page, limit }],
    queryFn: () => attendanceService.getAll(page, limit),
  });
}
