import { AttendancePolicy } from "./attendance-policy";

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

export interface RosterResponse {
  rosters: Roster[];
}
