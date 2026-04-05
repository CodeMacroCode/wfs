export type EmployeeRole = "user" | "hr" | "admin";

export interface Employee {
  id: string;
  namd: string;
  email: string;
  role: EmployeeRole;
  uniqueId: number;
  name?: string;
  password?: string;
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

export interface RegisterEmployeeDto {
  name: string;
  email: string;
  password: string;
  role: EmployeeRole;
}

export type UpdateEmployeeDto = Partial<RegisterEmployeeDto>;

export interface EmployeeQueryParams {
  page?: number;
  limit?: number | string;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
}
