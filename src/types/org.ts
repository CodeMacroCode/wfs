export interface Department {
  _id: string;
  name: string;
  companyId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Designation {
  _id: string;
  name: string;
  departmentId: string | { _id: string; name: string };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentDto {
  name: string;
  companyId?: string;
}

export interface CreateDesignationDto {
  name: string;
  departmentId: string;
}

export interface OrgResponse<T> {
  success: boolean;
  data: T;
}

export interface OrgListResponse<T> {
  success: boolean;
  data: T[];
}
