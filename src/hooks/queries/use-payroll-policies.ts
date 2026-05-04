import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { payrollPolicyService } from '@/services/payroll-policy-service';
import { QUERY_KEYS } from '@/constants/query-keys';
import { CreatePayrollPolicyDto } from '@/types/payroll-policy';

/**
 * Hook to fetch all payroll policies
 */
export function usePayrollPoliciesQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.payrollPolicies.list(),
    queryFn: () => payrollPolicyService.getAll(),
  });
}

/**
 * Hook to create a new payroll policy
 */
export function useCreatePayrollPolicyMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePayrollPolicyDto) => payrollPolicyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.payrollPolicies.all });
    },
  });
}

/**
 * Hook to update an existing payroll policy
 */
export function useUpdatePayrollPolicyMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreatePayrollPolicyDto }) => 
      payrollPolicyService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.payrollPolicies.all });
    },
  });
}

/**
 * Hook to delete a payroll policy
 */
export function useDeletePayrollPolicyMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => payrollPolicyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.payrollPolicies.all });
    },
  });
}
