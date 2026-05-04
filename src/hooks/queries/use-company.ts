import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { companyService } from '@/services/company-service';
import { QUERY_KEYS } from '@/constants/query-keys';
import { CompanyQueryParams, CreateCompanyDto } from '@/types/company';

/**
 * Hook to fetch companies with optional filtering
 */
export function useCompanyQuery(params?: CompanyQueryParams) {
  return useQuery({
    queryKey: QUERY_KEYS.company.list(params),
    queryFn: () => companyService.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to create a new company
 */
export function useCreateCompanyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCompanyDto) => companyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.company.all });
    },
  });
}

/**
 * Hook to update an existing company
 */
export function useUpdateCompanyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCompanyDto> }) =>
      companyService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.company.all });
    },
  });
}

/**
 * Hook to delete a company
 */
export function useDeleteCompanyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => companyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.company.all });
    },
  });
}
/**
 * Hook to fetch company dropdown list
 */
export function useCompanyDropdownQuery() {
  return useQuery({
    queryKey: [...QUERY_KEYS.company.all, 'dropdown'],
    queryFn: () => companyService.getDropdown(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch companies for dropdown with infinite scrolling
 */
export function useCompanyDropdownInfiniteQuery(params?: CompanyQueryParams) {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.company.all, 'dropdown', 'infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      companyService.getDropdown({ ...params, page: pageParam as number, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Safely check for pagination as the API might not return it for all dropdowns
      if (lastPage?.pagination && lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });
}
