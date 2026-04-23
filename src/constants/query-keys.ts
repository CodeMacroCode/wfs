const userKeys = {
  all: ['users'] as const,
  list: () => [...userKeys.all, 'list'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
  stats: () => [...userKeys.all, 'stats'] as const,
};

export const QUERY_KEYS = {
  users: userKeys,
  inventory: {
    all: ['inventory'] as const,
    list: (filters?: unknown) => [...QUERY_KEYS.inventory.all, 'list', { filters }] as const,
  },
  brands: {
    all: ['brands'] as const,
    list: (params?: unknown) => [...QUERY_KEYS.brands.all, 'list', { params }] as const,
  },
  suppliers: {
    all: ['suppliers'] as const,
    list: (params?: unknown) => [...QUERY_KEYS.suppliers.all, 'list', { params }] as const,
    detail: (id: string) => [...QUERY_KEYS.suppliers.all, 'detail', id] as const,
  },
  warehouses: {
    all: ['warehouses'] as const,
    list: (params?: unknown) => [...QUERY_KEYS.warehouses.all, 'list', { params }] as const,
    detail: (id: string) => [...QUERY_KEYS.warehouses.all, 'detail', id] as const,
    racks: (warehouseId: string) => [...QUERY_KEYS.warehouses.all, 'racks', warehouseId] as const,
  },
  productItems: {
    all: ['productItems'] as const,
    rackWise: (rackId: string, params?: unknown) => [...QUERY_KEYS.productItems.all, 'rackWise', rackId, { params }] as const,
  },
  attendancePolicies: {
    all: ['attendancePolicies'] as const,
    list: () => [...QUERY_KEYS.attendancePolicies.all, 'list'] as const,
  },
  attendance: {
    all: ['attendance'] as const,
    list: () => [...QUERY_KEYS.attendance.all, 'list'] as const,
    dashboardCount: () => [...QUERY_KEYS.attendance.all, 'dashboard-count'] as const,
    withSummary: (params: unknown) => [...QUERY_KEYS.attendance.all, 'with-summary', { params }] as const,
  },
  payrollPolicies: {
    all: ['payrollPolicies'] as const,
    list: () => [...QUERY_KEYS.payrollPolicies.all, 'list'] as const,
  },
  rosters: {
    all: ['rosters'] as const,
    list: () => [...QUERY_KEYS.rosters.all, 'list'] as const,
  },
  assets: {
    all: ['assets'] as const,
    list: (params?: unknown) => [...QUERY_KEYS.assets.all, 'list', { params }] as const,
    detail: (id: string) => [...QUERY_KEYS.assets.all, 'detail', id] as const,
  },
  docCenter: {
    all: ['docCenter'] as const,
    list: (params?: unknown) => [...QUERY_KEYS.docCenter.all, 'list', { params }] as const,
    detail: (id: string) => [...QUERY_KEYS.docCenter.all, 'detail', id] as const,
  },
  company: {
    all: ['company'] as const,
    list: (params?: unknown) => [...QUERY_KEYS.company.all, 'list', { params }] as const,
  },
  leaves: {
    all: ['leaves'] as const,
    list: () => [...QUERY_KEYS.leaves.all, 'list'] as const,
  },
  recruitment: {
    all: ['recruitment'] as const,
    list: (params?: unknown) => [...QUERY_KEYS.recruitment.all, 'list', { params }] as const,
    detail: (id: string) => [...QUERY_KEYS.recruitment.all, 'detail', id] as const,
  },
} as const;
