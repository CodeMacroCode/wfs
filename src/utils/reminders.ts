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
export const getRemindersForDate = (date: Date): SystemReminder[] => {
  const day = date.getDate();
  const reminders: SystemReminder[] = [];

  // Monthly Recurring Bills
  if (day === 1) {
    reminders.push({
      id: 'rent-payment',
      title: 'Pay Monthly Office Rent',
      type: 'bill',
      description: 'Monthly office space lease payment due today.'
    });
  }

  if (day === 5) {
    reminders.push({
      id: 'elec-bill',
      title: 'Pay Electricity Bill',
      type: 'bill',
      description: 'Electricity and power utility bill payment window opens.'
    });
  }

  if (day === 10) {
    reminders.push({
      id: 'internet-bill',
      title: 'Pay Internet & Broadband',
      type: 'bill',
      description: 'Primary and backup ISP subscription payments due.'
    });
  }

  if (day === 15) {
    reminders.push({
      id: 'water-bill',
      title: 'Pay Water & Maintenance',
      type: 'bill',
      description: 'Building maintenance and water utility charges.'
    });
  }

  return reminders;
};
