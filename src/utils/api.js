import { API_CONFIG, STORAGE_KEYS, HTTP_STATUS, ERROR_MESSAGES } from '../config/constants';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
  }

  // Get authentication token
  getAuthToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  // Get default headers
  getHeaders(contentType = 'application/json') {
    const headers = {};
    
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Handle response
  async handleResponse(response) {
    if (response.status === HTTP_STATUS.NO_CONTENT) {
      return null;
    }

    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || ERROR_MESSAGES.GENERIC_ERROR);
      }
      
      return data;
    } else {
      const text = await response.text();
      
      if (!response.ok) {
        throw new Error(text || ERROR_MESSAGES.GENERIC_ERROR);
      }
      
      return text;
    }
  }

  // Make API request with retry logic
  async makeRequest(endpoint, options = {}, retryCount = 0) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(options.contentType);
    
    const config = {
      headers,
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return await this.handleResponse(response);
      
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      if (retryCount < this.retryAttempts && this.shouldRetry(error)) {
        await this.delay(1000 * (retryCount + 1)); // Exponential backoff
        return this.makeRequest(endpoint, options, retryCount + 1);
      }
      
      throw error;
    }
  }

  // Determine if request should be retried
  shouldRetry(error) {
    return error.message.includes('Network') || 
           error.message.includes('timeout') ||
           error.message.includes('ECONNRESET');
  }

  // Delay utility
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.makeRequest(url, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data = null, contentType = 'application/json') {
    const options = {
      method: 'POST',
      contentType,
    };
    
    if (data && contentType === 'application/json') {
      options.body = JSON.stringify(data);
    } else if (data) {
      options.body = data;
    }
    
    return this.makeRequest(endpoint, options);
  }

  // PUT request
  async put(endpoint, data = null, contentType = 'application/json') {
    const options = {
      method: 'PUT',
      contentType,
    };
    
    if (data && contentType === 'application/json') {
      options.body = JSON.stringify(data);
    } else if (data) {
      options.body = data;
    }
    
    return this.makeRequest(endpoint, options);
  }

  // PATCH request
  async patch(endpoint, data = null, contentType = 'application/json') {
    const options = {
      method: 'PATCH',
      contentType,
    };
    
    if (data && contentType === 'application/json') {
      options.body = JSON.stringify(data);
    } else if (data) {
      options.body = data;
    }
    
    return this.makeRequest(endpoint, options);
  }

  // DELETE request
  async delete(endpoint) {
    return this.makeRequest(endpoint, { method: 'DELETE' });
  }

  // File upload
  async uploadFile(endpoint, file, additionalData = {}, fieldName = 'file') {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    // Add additional data to form
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });
    
    return this.makeRequest(endpoint, {
      method: 'POST',
      contentType: null, // Let browser set content-type for FormData
      body: formData,
    });
  }

  // Multiple file upload
  async uploadFiles(endpoint, files, additionalData = {}) {
    const formData = new FormData();
    
    if (Array.isArray(files)) {
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });
    } else {
      formData.append('files', files);
    }
    
    // Add additional data to form
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });
    
    return this.makeRequest(endpoint, {
      method: 'POST',
      contentType: null,
      body: formData,
    });
  }
}

// Create singleton instance
const apiService = new ApiService();

// Export individual methods for convenience
export const {
  get,
  post,
  put,
  patch,
  delete: deleteRequest,
  uploadFile,
  uploadFiles,
} = apiService;

// Export the service instance
export default apiService; 