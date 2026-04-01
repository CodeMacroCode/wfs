import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
