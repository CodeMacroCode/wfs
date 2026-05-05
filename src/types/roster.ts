


export interface Roster {
  _id: string;
  employeeId: string;
  employeeName: string;
  companyName: string;
  shiftId: string;
  shiftName: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignRosterDto {
  employeeIds: string[];
  shiftId: string;
  startDate: string;
  endDate: string;
}

export interface AssignAttendancePolicyDto {
  userIds: string[];
  attendancePolicyId: string;
}

export interface RosterResponse {
  rosters: Roster[];
}

export interface AttendancePolicyUser {
  _id: string;
  name: string;
  email?: string;
  createdBy: string;
  role: string;
  uniqueId: number;
  gender: string;
  dob?: string;
  doj?: string;
  permanentAddress?: string;
  currentAddress?: string;
  mobileNo: string;
  familyDetails: any[];
  academicQualification: any[];
  previousWorkExperience: any[];
  otherDocuments: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  attendancePolicyId?: string;
  companyId?: string;
  departmentId?: string;
  designationId?: string;
  employeeObjId?: string;
  maritalStatus?: string;
  department?: string;
  designation?: string;
}

export interface AttendancePolicyUserResponse {
  data: AttendancePolicyUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
