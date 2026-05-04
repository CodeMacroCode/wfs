export interface Brand {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateBrandDto {
  name: string;
  description: string;
}

export interface UpdateBrandDto {
  name?: string;
  description?: string;
}

export interface BrandQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BrandsResponse {
  success: boolean;
  data: Brand[];
  pagination: Pagination;
}

export interface BrandResponse {
  success: boolean;
  data: Brand;
}
