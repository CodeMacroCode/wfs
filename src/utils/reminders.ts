/**
 * Utility to manage system-generated reminders for the calendar
 */

export interface SystemReminder {
  id: string;
  title: string;
  type: 'bill' | 'task' | 'alert';
  description?: string;
}

/**
 * Returns a list of system reminders for a given day of the month
 */
export const getRemindersForDate = (): SystemReminder[] => {
  return [];
};
