export interface DocumentItem {
  _id: string;
  title: string;
  documentType: string;
  files: string[];
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  metadata?: {
    vendor?: string;
    amount?: number;
    description?: string;
    [key: string]: unknown;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DocCenterResponse {
  data: DocumentItem[];
  pagination: PaginationData;
}

export interface DocCenterQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  documentType?: string;
}

export interface CreateDocDto {
  title: string;
  documentType: string;
  files: File[];
  metadata?: Record<string, unknown>;
}

export interface DeleteFilesDto {
  documentId: string;
  fileUrls: string[];
}

export interface UpdateDocFilesDto {
  documentId: string;
  files: File[];
}
