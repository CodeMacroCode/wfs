import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reminderService } from '@/services/reminder-service';
import { CreateReminderDto, Reminder } from '@/types/reminder';
import { toast } from 'sonner';

export function useRemindersQuery(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['reminders', params],
    queryFn: () => reminderService.getAll(params),
  });
}

export function useCreateReminderMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateReminderDto) => reminderService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
}

export function useDeleteReminderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reminderService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
}

export function useUpdateReminderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Reminder> & { action?: string } }) => reminderService.update(id, data),
    onSuccess: (response: { data: Reminder; message: string }) => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      if (response.message) {
        toast.success(response.message);
      }
    },
  });
}
