import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { authStorage } from '@/lib/auth';
import { toast } from 'sonner';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request Interceptor: Attach Auth Token + handle FormData
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Check if we are on the client side
    if (typeof window !== 'undefined') {
      const token = authStorage.getToken();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // If sending FormData, remove the Content-Type header so the browser
    // can set it automatically with the correct multipart boundary.
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data; // Return only the data portion
  },
  (error) => {
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : null;
    const message = data?.message || error.message || 'Something went wrong';

    // Global error handling (e.g., redirect on 401)
    if (status === 401 || status === 403) {
      if (typeof window !== 'undefined') {
        authStorage.clearAll();
        
        // Only redirect and toast if not already on the login page to avoid loops
        if (!window.location.pathname.startsWith('/auth/login')) {
          const toastMessage = status === 401 
            ? 'Session expired. Please login again.' 
            : 'Access denied. You do not have permission for this action.';
          
          toast.error(toastMessage);
          
          // Small delay to let the toast be seen before redirecting
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 1000);
        }
      }
    }

    // You can integrate a toast library here
    // toast.error(message);

    return Promise.reject(new ApiError(message, status, data));
  }
);

export default apiClient;
