export type SalaryType = 'monthly' | 'hourly' | 'daily';

export interface SalaryPayload {
  userId: string;
  hourly: boolean;
  monthly: boolean;
  daily: boolean;
  monthlySalary?: number;
  hourlyRate?: number;
  dailyRate?: number;
}

export interface SalaryListItem {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  hourly: boolean;
  monthly: boolean;
  daily: boolean;
  monthlySalary?: number;
  hourlyRate?: number;
  dailyRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryListResponse {
  message: string;
  data: SalaryListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
