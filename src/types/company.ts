export interface Company {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  gstNumber?: string;
  isActive: boolean;
  prefix?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateCompanyDto {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  gstNumber?: string;
  isActive: boolean;
  prefix?: string;
}

export interface CompanyResponse {
  success: boolean;
  data: Company[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CompanyQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CompanyListItem {
  _id: string;
  name: string;
  prefix?: string;
}

export interface CompanyDropdownResponse {
  success: boolean;
  data: CompanyListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
