import { Employee } from "./employee";

export type AssetType = "Laptop" | "Safety Gear" | "Specialized Tool" | "Uniform" | "Mobile Device" | "Electronics" | "Other";
export type AssetStatus = "Issued" | "Returned" | "Under Maintenance" | "Damaged";

export interface Asset {
  id: string;
  _id?: string;
  name: string;
  type: AssetType;
  serialNumber: string;
  issuedTo: string | Employee; // Employee ID or Populated Employee Object
  issuedDate: string;
  returnDate?: string;
  status: AssetStatus;
  maintenanceDueDate: string;
  lastMaintenanceDate?: string;
  maintenanceIntervalDays?: number;
  extraNote?: string;
}

export type CreateAssetDto = Omit<Asset, "id" | "_id">;
export type UpdateAssetDto = Partial<CreateAssetDto>;

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AssetsResponse {
  success: boolean;
  data: Asset[];
  pagination: Pagination;
}

export interface AssetQueryParams {
  search?: string;
  type?: string;
  page?: number;
  limit?: number;
}
