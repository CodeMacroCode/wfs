import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fuelService } from '@/services/fuel-service';
import { FuelQueryParams, FuelExpense } from '@/types/fuel';
import { QUERY_KEYS } from '@/constants/query-keys';

export function useFuelQuery(params?: FuelQueryParams) {
  return useQuery({
    queryKey: QUERY_KEYS.fuel.list(params),
    queryFn: () => fuelService.getAll(params),
  });
}

export function useCreateFuelMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<FuelExpense>) => fuelService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.fuel.all });
    },
  });
}

export function useDeleteFuelMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fuelService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.fuel.all });
    },
  });
}
