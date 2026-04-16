export type EmployeeRole = "user" | "hr" | "admin";

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface FamilyMember {
  name: string;
  relation: string;
  age: number;
  _id?: string;
}

export interface AcademicQualification {
  degree: string;
  institute: string;
  year: string;
  _id?: string;
}

export interface WorkExperience {
  company: string;
  role: string;
  years: string;
  _id?: string;
}

export interface Employee {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: EmployeeRole;
  uniqueId: number;
  password?: string;
  otherName?: string;
  gender: "male" | "female" | "other";
  fatherName: string;
  motherName: string;
  maritalStatus: "single" | "married" | "divorced" | "widowed";
  spouseName?: string;
  familyDetails?: FamilyMember[];
  dob: string;
  bloodGroup: string;
  emergencyContact: EmergencyContact;
  reference?: string;
  academicQualification: AcademicQualification[];
  previousWorkExperience?: WorkExperience[];
  interviewDate?: string;
  competencyMet: boolean;
  designation: string;
  department?: string;
  aadharNo: string;
  pfNo?: string;
  esiNo?: string;
  doj: string;
  permanentAddress: string;
  currentAddress: string;
  mobileNo: string;
  attendancePolicyId?: string;
  payrollPolicyId?: string;
  createdBy?: string;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EmployeesResponse {
  data: Employee[];
  pagination: PaginationInfo;
}

export interface RegisterEmployeeDto extends Omit<Employee, "id" | "_id"> {
  password?: string;
}

export type UpdateEmployeeDto = Partial<RegisterEmployeeDto>;

export interface EmployeeQueryParams {
  page?: number;
  limit?: number | string;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
}

export interface EmployeeDropdownItem {
  _id: string;
  name: string;
}

export interface EmployeeDropdownResponse {
  success: boolean;
  data: EmployeeDropdownItem[];
  pagination: PaginationInfo;
}
