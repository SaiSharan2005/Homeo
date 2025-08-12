/**
 * Unified API Client for all frontend network calls
 * Handles authentication, error handling, and request formatting
 */

// Base URL configuration with environment variable support
// Important: point to backend /api base by default
const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080/api';

// Default timeout and retry configuration
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

/**
 * Get JWT token from localStorage
 * @returns {string|null} JWT token or null if not found
 */
const getAuthToken = () => {
  return localStorage.getItem('Token');
};

/**
 * Calculate exponential backoff delay for retries
 * @param {number} attempt - Current attempt number (1-based)
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {number} Delay in milliseconds
 */
const calculateRetryDelay = (attempt, baseDelay = RETRY_DELAY) => {
  return baseDelay * Math.pow(2, attempt - 1);
};

/**
 * Sleep utility for retry delays
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Make HTTP request with retry logic
 * @param {string} url - Full URL to request
 * @param {Object} options - Fetch options
 * @param {number} attempt - Current attempt number
 * @returns {Promise<Response>}
 */
const makeRequestWithRetry = async (url, options, attempt = 1) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    
    // Retry logic for network errors
    if (attempt < MAX_RETRIES && (error.name === 'TypeError' || error.message.includes('fetch'))) {
      const delay = calculateRetryDelay(attempt);
      await sleep(delay);
      return makeRequestWithRetry(url, options, attempt + 1);
    }
    
    throw error;
  }
};

/**
 * Handle API response and extract data
 * @param {Response} response - Fetch response object
 * @returns {Promise<any>} Parsed response data
 */
const handleResponse = async (response) => {
  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }
  
  // Handle non-2xx responses
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (e) {
      // If error response is not JSON, try to get text
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      } catch (textError) {
        // Ignore text parsing errors, use default message
      }
    }
    
    const error = new Error(errorMessage);
    error.status = response.status;
    error.statusText = response.statusText;
    throw error;
  }
  
  // Handle successful responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  // Default to text for non-JSON responses
  return response.text();
};

/**
 * Prepare request headers
 * @param {Object} customHeaders - Custom headers to include
 * @param {boolean} isFormData - Whether the request contains FormData
 * @returns {Object} Headers object
 */
const prepareHeaders = (customHeaders = {}, isFormData = false) => {
  const headers = {
    ...customHeaders
  };
  
  // Add JWT token if available
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  // Set Content-Type for JSON requests (not for FormData)
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

/**
 * Prepare request body
 * @param {any} data - Data to send
 * @param {boolean} isFormData - Whether to send as FormData
 * @returns {string|FormData} Prepared request body
 */
const prepareBody = (data, isFormData = false) => {
  if (isFormData) {
    return data; // FormData is already prepared
  }
  
  if (data === null || data === undefined) {
    return undefined;
  }
  
  return JSON.stringify(data);
};

/**
 * Make HTTP request
 * @param {string} method - HTTP method
 * @param {string} endpoint - API endpoint (without /api prefix)
 * @param {any} data - Request body data
 * @param {Object} options - Additional options
 * @returns {Promise<any>} Response data
 */
const makeRequest = async (method, endpoint, data = null, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const isFormData = data instanceof FormData;
  
  const requestOptions = {
    method: method.toUpperCase(),
    headers: prepareHeaders(options.headers, isFormData),
    ...options
  };
  
  // Add body for non-GET requests
  if (method.toUpperCase() !== 'GET' && data !== null) {
    requestOptions.body = prepareBody(data, isFormData);
  }
  
  try {
    const response = await makeRequestWithRetry(url, requestOptions);
    return await handleResponse(response);
  } catch (error) {
    // Re-throw with additional context
    if (error.status === 401) {
      // Handle unauthorized - could trigger redirect in future
      console.warn('Unauthorized request - token may be expired');
    }
    throw error;
  }
};

// Export HTTP methods
export const api = {
  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional options
   * @returns {Promise<any>} Response data
   */
  get: (endpoint, options = {}) => makeRequest('GET', endpoint, null, options),
  
  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {any} data - Request body data
   * @param {Object} options - Additional options
   * @returns {Promise<any>} Response data
   */
  post: (endpoint, data, options = {}) => makeRequest('POST', endpoint, data, options),
  
  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {any} data - Request body data
   * @param {Object} options - Additional options
   * @returns {Promise<any>} Response data
   */
  put: (endpoint, data, options = {}) => makeRequest('PUT', endpoint, data, options),
  
  /**
   * PATCH request
   * @param {string} endpoint - API endpoint
   * @param {any} data - Request body data
   * @param {Object} options - Additional options
   * @returns {Promise<any>} Response data
   */
  patch: (endpoint, data, options = {}) => makeRequest('PATCH', endpoint, data, options),
  
  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional options
   * @returns {Promise<any>} Response data
   */
  delete: (endpoint, options = {}) => makeRequest('DELETE', endpoint, null, options)
};

// Convenience wrappers for legacy usage in components/services
export const getData = (endpoint, options = {}) => api.get(endpoint, options);
export const postData = (endpoint, data, options = {}) => api.post(endpoint, data, options);
export const putData = (endpoint, data, options = {}) => api.put(endpoint, data, options);
export const deleteData = (endpoint, options = {}) => api.delete(endpoint, options);

// Legacy helper used by UI to fetch active advertisement by target page
export const fetchActiveAd = async (targetPage) => {
  return api.get(`/ads/active?targetPage=${encodeURIComponent(targetPage)}`);
};

export default api;
