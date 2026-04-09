export const QUERY_KEYS = {
  users: {
    all: ['users'] as const,
    list: () => [...QUERY_KEYS.users.all, 'list'] as const,
    detail: (id: string) => [...QUERY_KEYS.users.all, 'detail', id] as const,
  },
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
  },
  payrollPolicies: {
    all: ['payrollPolicies'] as const,
    list: () => [...QUERY_KEYS.payrollPolicies.all, 'list'] as const,
  },
  rosters: {
    all: ['rosters'] as const,
    list: () => [...QUERY_KEYS.rosters.all, 'list'] as const,
  },
} as const;
