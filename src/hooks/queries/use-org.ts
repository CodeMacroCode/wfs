import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orgService } from '@/services/org-service';
import { CreateDepartmentDto, CreateDesignationDto } from '@/types/org';

const ORG_QUERY_KEYS = {
  departments: ['org', 'departments'],
  designations: ['org', 'designations'],
};

export function useDepartmentsQuery() {
  return useQuery({
    queryKey: ORG_QUERY_KEYS.departments,
    queryFn: () => orgService.getDepartments(),
  });
}

export function useCreateDepartmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDepartmentDto) => orgService.createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORG_QUERY_KEYS.departments });
    },
  });
}

export function useUpdateDepartmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateDepartmentDto> }) =>
      orgService.updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORG_QUERY_KEYS.departments });
    },
  });
}

export function useDeleteDepartmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orgService.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORG_QUERY_KEYS.departments });
    },
  });
}

export function useDesignationsQuery() {
  return useQuery({
    queryKey: ORG_QUERY_KEYS.designations,
    queryFn: () => orgService.getDesignations(),
  });
}

export function useCreateDesignationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDesignationDto) => orgService.createDesignation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORG_QUERY_KEYS.designations });
    },
  });
}

export function useUpdateDesignationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateDesignationDto> }) =>
      orgService.updateDesignation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORG_QUERY_KEYS.designations });
    },
  });
}

export function useDeleteDesignationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orgService.deleteDesignation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORG_QUERY_KEYS.designations });
    },
  });
}
