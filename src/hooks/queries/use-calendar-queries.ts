import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarService } from '@/services/calendar-service';
import { UpdateDatePayload } from '@/types/calendar';

/**
 * Hook to fetch monthly calendar data
 * @param year - The year to fetch
 * @param month - The month to fetch (1-12)
 */
export const useCalendarMonth = (year: number, month: number) => {
  return useQuery({
    queryKey: ['calendar', year, month],
    queryFn: () => calendarService.getMonthlyData(year, month),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to update a specific calendar day
 */
export const useUpdateCalendarDay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDatePayload) => calendarService.updateDate(data),
    onSuccess: (_, variables) => {
      // Invalidate the relevant month's query
      const date = new Date(variables.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      queryClient.invalidateQueries({ queryKey: ['calendar', year, month] });
    },
  });
};

/**
 * Hook to initialize a calendar year
 */
export const useInitializeCalendarYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (year: number) => calendarService.initializeYear(year),
    onSuccess: (_, year) => {
      queryClient.invalidateQueries({ queryKey: ['calendar', year] });
    },
  });
};
