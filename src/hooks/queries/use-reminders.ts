import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reminderService } from '@/services/reminder-service';
import { CreateReminderDto } from '@/types/reminder';

export function useCreateReminderMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateReminderDto) => reminderService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
}
