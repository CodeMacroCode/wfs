import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { authStorage } from '@/lib/auth';

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

// Request Interceptor: Attach Auth Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Check if we are on the client side
    if (typeof window !== 'undefined') {
      const token = authStorage.getToken();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
    if (status === 401) {
      console.warn('Unauthorized access - potential token expiration');
      // Handle logout/redirect logic here
    }

    // You can integrate a toast library here
    // toast.error(message);

    return Promise.reject(new ApiError(message, status, data));
  }
);

export default apiClient;
