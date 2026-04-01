import Cookies from 'js-cookie';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export const authStorage = {
  /**
   * Set authentication token in cookies
   */
  setToken: (token: string) => {
    Cookies.set(AUTH_TOKEN_KEY, token, {
      expires: 7, // 7 days
      secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
      sameSite: 'strict',
    });
  },

  /**
   * Get authentication token from cookies
   */
  getToken: () => {
    return Cookies.get(AUTH_TOKEN_KEY);
  },

  /**
   * Remove authentication token from cookies
   */
  removeToken: () => {
    Cookies.remove(AUTH_TOKEN_KEY);
  },

  /**
   * Set user data in cookies (convenience for quick access)
   */
  setUser: (user: unknown) => {
    Cookies.set(USER_DATA_KEY, JSON.stringify(user), {
      expires: 7,
      secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
      sameSite: 'strict',
    });
  },

  /**
   * Get user data from cookies
   */
  getUser: () => {
    const user = Cookies.get(USER_DATA_KEY);
    return user ? JSON.parse(user) : null;
  },

  /**
   * Remove user data from cookies
   */
  removeUser: () => {
    Cookies.remove(USER_DATA_KEY);
  },

  /**
   * Clear all auth-related data
   */
  clearAll: () => {
    Cookies.remove(AUTH_TOKEN_KEY);
    Cookies.remove(USER_DATA_KEY);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!Cookies.get(AUTH_TOKEN_KEY);
  },
};
