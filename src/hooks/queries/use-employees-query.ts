import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/services/employee-service';
import { QUERY_KEYS } from '@/constants/query-keys';
import { RegisterEmployeeDto, UpdateEmployeeDto, EmployeeQueryParams } from '@/types/employee';

/**
 * Hook to fetch employees with pagination and filters
 */
export function useEmployeesQuery(params?: EmployeeQueryParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.users.all, 'list', params],
    queryFn: () => employeeService.getAll(params),
  });
}

/**
 * Hook to fetch employees with infinite scrolling
 */
export function useEmployeesInfiniteQuery(params?: EmployeeQueryParams) {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.users.all, 'infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      employeeService.getAll({ ...params, page: pageParam, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });
}

/**
 * Hook to fetch employees for dropdown with infinite scrolling
 */
export function useEmployeesDropdownInfiniteQuery(params?: EmployeeQueryParams, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.users.all, 'dropdown', 'infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      employeeService.getDropdown({ ...params, page: pageParam, limit: 10 }),
    initialPageParam: 1,
    enabled,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });
}

/**
 * Hook to fetch a single employee by ID
 */
export function useEmployeeQuery(id: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.users.detail(id || ''),
    queryFn: () => employeeService.getById(id!),
    enabled: !!id,
  });
}

/**
 * Hook to register a new employee
 */
export function useRegisterEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterEmployeeDto) => employeeService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
    },
  });
}

/**
 * Hook to update an existing employee
 */
export function useUpdateEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeDto }) =>
      employeeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
    },
  });
}

/**
 * Hook to delete an employee
 */
export function useDeleteEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
    },
  });
}
