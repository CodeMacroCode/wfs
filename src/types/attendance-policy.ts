export interface AttendancePolicy {
  _id: string;
  name: string;
  shiftInTime: string;
  shiftOutTime: string;
  overtimeThresholdMins: number;
  overtimeHourlyRate: number;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateAttendancePolicyDto {
  name: string;
  shiftInTime: string;
  shiftOutTime: string;
  overtimeThresholdMins: number;
  overtimeHourlyRate: number;
}

export interface AttendancePoliciesResponse {
  policies: AttendancePolicy[];
}
