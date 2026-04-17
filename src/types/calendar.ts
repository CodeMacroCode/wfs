/**
 * Calendar Day representation from API
 */
export interface CalendarDay {
  _id: string;
  date: string; // ISO string
  dayType: 'working' | 'holiday';
  isNationalHoliday: boolean;
  isCompanyHoliday: boolean;
  description?: string;
  checkIn?: string;
  checkOut?: string;
  __v?: number;
}

/**
 * Monthly Calendar Response
 */
export interface CalendarResponse {
  success: boolean;
  year: number;
  month: number;
  days: CalendarDay[];
}

/**
 * Payload for updating a specific date
 */
export interface UpdateDatePayload {
  date: string; // "YYYY-MM-DD"
  dayType: 'working' | 'holiday';
  isNationalHoliday: boolean;
  isCompanyHoliday: boolean;
  description: string;
  checkIn?: string;
  checkOut?: string;
}

/**
 * Payload for initializing a calendar year
 */
export interface InitializeYearPayload {
  year: number;
}
