export type FuelType = "Petrol" | "Diesel" | "CNG" | "Electric";

export interface FuelExpense {
  _id: string;
  vehicleId: string;
  vehicleName: string;
  date: string;
  fuelType: FuelType;
  quantity: number; // in liters or kg
  pricePerUnit: number;
  totalAmount: number;
  odometerReading: number;
  driverId?: string;
  driverName?: string;
  receiptUrl?: string;
  remarks?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FuelStats {
  totalAmount: number;
  totalQuantity: number;
  avgPrice: number;
  totalEntries: number;
}

export interface FuelExpenseResponse {
  data: FuelExpense[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  stats: FuelStats;
}

export interface FuelQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  vehicleId?: string;
  startDate?: string;
  endDate?: string;
}
