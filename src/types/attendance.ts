/**
 * Attendance status types
 */
export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Half-Day' | 'On Leave';

/**
 * Single attendance record based on real API response
 */
export interface Attendance {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  date: string;
  punchIn: string | null;
  punchOut: string | null;
  status: AttendanceStatus;
  totalWorkedMinutes: number;
  overtimeHours: number;
  overtimePay: number;
  uniqueId: number;
  isManual: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/**
 * API response for attendance list matching real response
 */
export interface AttendanceResponse {
  data: Attendance[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Interface for dashboard attendance counts
 */
export interface AttendanceDashboardCount {
  startDate: string;
  endDate: string;
  totalUsers: number;
  present: number;
  absent: number;
  onLeave: number;
  notMarked: number;
}

/**
 * Interface for attendance summary in filtered reports
 */
export interface AttendanceSummary {
  totalUsers: number;
  present: number;
  absent: number;
  onLeave: number;
  notMarked: number;
}

/**
 * Interface for attendance with summary response
 */
export interface AttendanceWithSummaryResponse {
  summary: AttendanceSummary;
  data: Attendance[];
  total: number;
  page: number;
  limit: number;
  startDate: string;
  endDate: string;
}
