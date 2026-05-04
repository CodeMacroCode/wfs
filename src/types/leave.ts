export interface LeaveRequest {
  employeeId: string; // This refers to the punch ID (e.g., "pava-001")
  fromDate: string;   // format: "YYYY-MM-DD"
  toDate: string;     // format: "YYYY-MM-DD"
  leaveType: string;  // e.g., "Casual", "Sick", etc.
  reason: string;
}

export interface Leave {
  _id: string;
  employeeId: string; // punch ID
  userId: {
    _id: string;
    name: string;
    email: string;
    uniqueId?: number;
  } | null;
  companyId: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
  leaveType: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  isPaid: boolean;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveResponse {
  success: boolean;
  message: string;
  data?: Leave;
}

export interface LeaveListResponse {
  success: boolean;
  data: Leave[];
  total: number;
}

export interface UpdateLeaveRequest {
  status: 'Approved' | 'Rejected';
  isPaid: boolean;
  rejectionReason?: string;
}
