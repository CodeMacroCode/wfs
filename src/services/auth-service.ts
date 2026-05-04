import apiClient from '../lib/api-client';
import { authStorage } from '../lib/auth';
import { LoginPayload, LoginResponse } from '../types/auth';

export const AuthService = {
  /**
   * Login user and store token
   */
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    // We cast the response because our interceptor returns response.data
    const response = await apiClient.post('/user/login', payload) as unknown as LoginResponse;
    
    if (response.token) {
      authStorage.setToken(response.token);
      authStorage.setUser(response.user);
    }
    
    return response;
  },

  /**
   * Logout user and clear session
   */
  logout: () => {
    authStorage.clearAll();
    window.location.href = '/auth/login';
  },
};
