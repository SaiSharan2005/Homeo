import apiService from '../utils/api';
import authService from '../utils/auth';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../config/constants';

class AuthAPI {
  // Register new user
  async register(userData) {
    try {
      // Backend returns { token }
      const response = await apiService.post('/auth/register', userData);
      
      if (response?.token) {
        // Save token and fetch current user profile
        authService.setToken(response.token);
        try {
          const me = await apiService.get('/auth/me');
          if (me) {
            authService.setCurrentUser(me);
          }
        } catch (_) {}
      }
      
      return {
        success: true,
        message: SUCCESS_MESSAGES.CREATED,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.GENERIC_ERROR
      };
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await apiService.post('/auth/login', credentials);
      
      if (response?.token) {
        authService.setToken(response.token);
        try {
          const me = await apiService.get('/auth/me');
          if (me) {
            authService.setCurrentUser(me);
          }
        } catch (_) {}
      }
      
      return {
        success: true,
        message: SUCCESS_MESSAGES.LOGIN,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.GENERIC_ERROR
      };
    }
  }

  // Get current authenticated user
  async getCurrentUser() {
    try {
      const response = await apiService.get('/auth/me');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.GENERIC_ERROR
      };
    }
  }

  // Add profile picture
  async addProfilePicture(file) {
    try {
      // Backend expects form field name 'image'
      const formData = new FormData();
      formData.append('image', file);
      const response = await apiService.post('/auth/addProfilePic', formData, null);
      return {
        success: true,
        message: 'Profile picture updated successfully',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.GENERIC_ERROR
      };
    }
  }

  // Logout user
  logout() {
    authService.logout();
    return {
      success: true,
      message: SUCCESS_MESSAGES.LOGOUT
    };
  }

  // Check if user is authenticated
  isAuthenticated() {
    return authService.isAuthenticated();
  }

  // Get user role
  getUserRole() {
    return authService.getUserRole();
  }

  // Check if user has specific role
  hasRole(role) {
    return authService.hasRole(role);
  }

  // Get current user data
  getCurrentUserData() {
    return authService.getCurrentUser();
  }
}

export default new AuthAPI(); 