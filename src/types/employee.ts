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
  _id: string;
}

export interface AcademicQualification {
  degree: string;
  institute: string;
  year: string;
  _id: string;
}

export interface WorkExperience {
  company: string;
  role: string;
  years: string;
  _id: string;
}

export interface Employee {
  id: string;
  _id?: string; // MongoDB ID if present in detail view
  name: string;
  email: string;
  role: EmployeeRole;
  uniqueId: number;
  password?: string;
  empCode: string;
  otherName?: string;
  category?: string;
  gender: "Male" | "Female" | "Other";
  fatherName: string; // Updated from fathersName
  motherName: string; // Updated from mothersName
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
  spouseName?: string;
  familyDetails?: FamilyMember[]; // Updated from string
  dob: string;
  bloodGroup: string;
  emergencyContact: EmergencyContact; // Updated from string
  reference?: string;
  academicQualification: AcademicQualification[]; // Updated from string
  previousWorkExperience?: WorkExperience[]; // Updated from string (and renamed)
  interviewDate?: string;
  competencyMet: boolean; // Updated from competencyCriteriaMet (Yes/No)
  designation: string;
  workingHours: number; // Updated from string
  aadharNo: string;
  pfNo?: string;
  esiNo?: string;
  doj: string;
  doe?: string | null;
  permanentAddress: string;
  currentAddress: string;
  mobileNo: string;
  attendancePolicyId?: string;
  payrollPolicyId?: string;
  createdBy?: string;
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

export interface RegisterEmployeeDto extends Omit<Employee, "id" | "uniqueId" | "_id"> {
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
