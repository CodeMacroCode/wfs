import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/services/brand-service';
import { QUERY_KEYS } from '@/constants/query-keys';
import {
  BrandQueryParams,
  CreateBrandDto,
  UpdateBrandDto
} from '@/types/brand';

// --- Queries ---

/**
 * Hook to fetch all brands with optional filtering and pagination
 */
export function useBrands(params?: BrandQueryParams) {
  return useQuery({
    queryKey: QUERY_KEYS.brands.list(params),
    queryFn: () => brandService.getAll(params),
  });
}

// --- Mutations ---

/**
 * Hook to create a new brand
 */
export function useCreateBrandMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBrandDto) => brandService.create(data),
    onSuccess: () => {
      // Invalidate brand list to trigger refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.brands.all });
    },
  });
}

/**
 * Hook to update an existing brand
 */
export function useUpdateBrandMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBrandDto }) =>
      brandService.update(id, data),
    onSuccess: () => {
      // Invalidate both the list and the specific detail query
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.brands.all });
    },
  });
}

/**
 * Hook to delete a brand
 */
export function useDeleteBrandMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => brandService.delete(id),
    onSuccess: () => {
      // Invalidate brand list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.brands.all });
    },
  });
}
