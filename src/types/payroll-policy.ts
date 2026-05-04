export interface PayrollPolicyHeads {
  esiEmployee: number;
  pfEmployee: number;
  esiEmployer: number;
  pfEmployer: number;
  hra: number;
  conveyance: number;
  basic: number;
  lwfEmployee: number;
  lwfEmployer: number;
  overtimeHourlyRate: number;
}

export interface PayrollPolicy {
  _id: string;
  name: string;
  sundayPolicyActive: boolean;
  heads: PayrollPolicyHeads;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreatePayrollPolicyDto {
  name: string;
  sundayPolicyActive: boolean;
  heads: {
    hra: number;
    conveyance: number;
    pfEmployee: number;
    pfEmployer: number;
    esiEmployee: number;
    esiEmployer: number;
    basic: number;
    lwfEmployee: number;
    lwfEmployer: number;
    overtimeHourlyRate: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type PayrollPoliciesResponse = ApiResponse<PayrollPolicy[]>;
