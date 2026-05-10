import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService, CreateVehicleDto } from '@/services/vehicle-service';
import { VehicleQueryParams } from '@/types/vehicle';

export const VEHICLE_QUERY_KEYS = {
  all: ['vehicles'] as const,
  list: (params?: VehicleQueryParams) => [...VEHICLE_QUERY_KEYS.all, 'list', params] as const,
  infinite: (params?: VehicleQueryParams) => [...VEHICLE_QUERY_KEYS.all, 'infinite', params] as const,
};

/**
 * Hook to fetch vehicles with infinite scrolling
 */
export function useVehiclesInfiniteQuery(params?: VehicleQueryParams) {
  return useInfiniteQuery({
    queryKey: VEHICLE_QUERY_KEYS.infinite(params),
    queryFn: ({ pageParam = 1 }) => 
      vehicleService.getAll({ ...params, page: pageParam as number, limit: params?.limit || 10 }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

/**
 * Hook to fetch vehicles with pagination and search
 */
export function useVehiclesQuery(params?: VehicleQueryParams) {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.list(params),
    queryFn: () => vehicleService.getAll(params),
  });
}

/**
 * Hook to create a new vehicle
 */
export function useCreateVehicleMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateVehicleDto) => vehicleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.all });
    },
  });
}

/**
 * Hook to update an existing vehicle
 */
export function useUpdateVehicleMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateVehicleDto> }) => 
      vehicleService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.all });
    },
  });
}

/**
 * Hook to delete a vehicle
 */
export function useDeleteVehicleMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => vehicleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.all });
    },
  });
}
