export type AssetType = "Laptop" | "Safety Gear" | "Specialized Tool" | "Uniform" | "Mobile Device" | "Other";
export type AssetStatus = "Issued" | "Returned" | "Under Maintenance" | "Damaged";

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  serialNumber: string;
  issuedTo: string; // Employee Name
  issueDate: string;
  returnDate?: string;
  status: AssetStatus;
  nextMaintenanceDate: string;
  lastMaintenanceDate?: string;
  maintenanceIntervalDays?: number; // e.g., 180 for 6 months
}

export type CreateAssetDto = Omit<Asset, "id">;
export type UpdateAssetDto = Partial<CreateAssetDto>;
