import { STORAGE_KEYS, USER_ROLES } from '../config/constants';

class AuthService {
  // Get current user from localStorage
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Set current user in localStorage
  setCurrentUser(user) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  // Get authentication token
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  // Set authentication token
  setToken(token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  // Get user role
  getUserRole() {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Check if user has specific role
  hasRole(role) {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles) {
    const userRole = this.getUserRole();
    return roles.includes(userRole);
  }

  // Check if user is admin
  isAdmin() {
    return this.hasRole(USER_ROLES.ADMIN);
  }

  // Check if user is doctor
  isDoctor() {
    return this.hasRole(USER_ROLES.DOCTOR);
  }

  // Check if user is patient
  isPatient() {
    return this.hasRole(USER_ROLES.PATIENT);
  }

  // Check if user is staff
  isStaff() {
    return this.hasRole(USER_ROLES.STAFF);
  }

  // Login user
  login(userData, token) {
    this.setCurrentUser(userData);
    this.setToken(token);
  }

  // Logout user
  logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
  }

  // Update user data
  updateUser(userData) {
    this.setCurrentUser(userData);
  }

  // Get user ID
  getUserId() {
    const user = this.getCurrentUser();
    return user?.id || null;
  }

  // Get user username/phone
  getUsername() {
    const user = this.getCurrentUser();
    return user?.username || user?.phoneNumber || null;
  }

  // Get user name
  getUserName() {
    const user = this.getCurrentUser();
    return user?.name || user?.firstName || null;
  }

  // Check if token is expired (basic check)
  isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  // Refresh token (placeholder for future implementation)
  async refreshToken() {
    // This would typically make an API call to refresh the token
    // For now, we'll just return false
    return false;
  }

  // Get user permissions (placeholder for future implementation)
  getUserPermissions() {
    const user = this.getCurrentUser();
    return user?.permissions || [];
  }

  // Check if user has specific permission
  hasPermission(permission) {
    const permissions = this.getUserPermissions();
    return permissions.includes(permission);
  }

  // Get user profile data
  getUserProfile() {
    const user = this.getCurrentUser();
    return user?.profile || null;
  }

  // Update user profile
  updateProfile(profileData) {
    const user = this.getCurrentUser();
    if (user) {
      user.profile = { ...user.profile, ...profileData };
      this.setCurrentUser(user);
    }
  }

  // Clear all auth data
  clearAuth() {
    this.logout();
  }

  // Get auth headers for API requests
  getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;