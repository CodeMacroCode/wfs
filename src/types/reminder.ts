export type ReminderFrequency = "Daily" | "Weekly" | "Monthly" | "Yearly" | "Once";

export interface Reminder {
  _id: string;
  title: string;
  description?: string;
  nextOccurrence: string;
  frequency: ReminderFrequency;
  enabled: boolean;
  createdBy: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderDto {
  title: string;
  description?: string;
  nextOccurrence: string;
  frequency: ReminderFrequency;
  enabled: boolean;
  metadata?: Record<string, unknown>;
}
