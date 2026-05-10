import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fuelService } from '@/services/fuel-service';
import { FuelCardStats, FuelQueryParams, FuelExpensesResponse, CreateFuelDto } from '@/types/fuel';

export const FUEL_QUERY_KEYS = {
  all: ['fuel'] as const,
  list: (params?: FuelQueryParams) => [...FUEL_QUERY_KEYS.all, 'list', params] as const,
  stats: () => [...FUEL_QUERY_KEYS.all, 'stats'] as const,
};

/**
 * Hook to fetch all fuel expenses
 */
export function useFuelExpensesQuery(params?: FuelQueryParams) {
  return useQuery<FuelExpensesResponse>({
    queryKey: FUEL_QUERY_KEYS.list(params),
    queryFn: () => fuelService.getAll(params),
  });
}

/**
 * Hook to create a new fuel expense
 */
export function useAddFuelMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFuelDto) => fuelService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FUEL_QUERY_KEYS.all });
    },
  });
}

/**
 * Hook to delete a fuel expense
 */
export function useDeleteFuelMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fuelService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FUEL_QUERY_KEYS.all });
    },
  });
}

/**
 * Hook to fetch fuel card statistics
 */
export function useFuelCardStatsQuery() {
  return useQuery<FuelCardStats>({
    queryKey: FUEL_QUERY_KEYS.stats(),
    queryFn: () => fuelService.getStats(),
  });
}

/**
 * Hook to add balance to fuel card
 */
export function useAddCardBalanceMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { amount: number; note?: string }) => fuelService.addCardBalance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FUEL_QUERY_KEYS.stats() });
    },
  });
}
