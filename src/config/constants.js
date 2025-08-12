// API Configuration
export const API_CONFIG = {
  // Default to local dev backend if env not provided
  BASE_URL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'Token',
  USER: 'user',
  ROLE: 'role',
  THEME: 'theme',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  PATIENT: 'PATIENT',
  STAFF: 'STAFF',
};

// Route Paths
export const ROUTES = {
  // Public Routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Doctor Routes
  DOCTOR: {
    BASE: '/doctor',
    HOME: '/doctor/home',
    PROFILE: '/doctor/profile',
    DETAILS: '/doctor/details',
    SCHEDULE: '/doctor/schedule',
    CREATE_SCHEDULE: '/doctor/create-schedule',
    APPOINTMENTS: '/doctor/appointment',
    TOKEN: '/doctor/token/:tokenId',
  },
  
  // Patient Routes
  PATIENT: {
    BASE: '/patient',
    HOME: '/patient/home',
    PROFILE: '/patient/profile',
    HISTORY: '/patient/history',
    ADV: '/patient/adv',
    DOCTOR_SEARCH: '/patient/doctorSearch',
    BOOK_APPOINTMENT: '/patient/BookAppoinment/:doctorId',
    TOKEN: '/patient/token/:tokenId',
  },
  
  // Admin Routes
  ADMIN: {
    BASE: '/admin',
    HOME: '/admin/home',
    APPOINTMENTS: '/admin/appointment',
    DOCTOR_SEARCH: '/admin/doctor-search',
    PATIENT_SEARCH: '/admin/patient-search',
    ADVERTISEMENT: '/admin/advertisement',
    INVENTORY: '/admin/inventory',
    INVENTORY_CREATE: '/admin/inventory/create',
  },
  
  // Staff Routes
  STAFF: {
    BASE: '/staff',
    PAYMENTS: '/staff/payments',
    PAYMENT_DETAILS: '/staff/payment/:id',
    ALL_ACTIVITY: '/staff/all-activity',
    DOCTOR_ACTIVITY: '/staff/doctor-activity',
    PATIENT_ACTIVITY: '/staff/patient-activity',
    APPOINTMENT_ACTIVITY: '/staff/appointment-activity',
    ADVERTISEMENT_ACTIVITY: '/staff/advertisement-activity',
    APPOINTMENT_BOOKING: '/staff/appointment-booking',
  },
  
  // Inventory Routes
  INVENTORY: {
    ITEMS: '/inventory-items',
    ITEM_CREATE: '/inventory-items/create',
    ITEM_DETAIL: '/inventory-items/:id',
    PURCHASE_ORDERS: '/purchase-orders',
    PURCHASE_ORDER_CREATE: '/purchase-orders/create',
  },
  
  // Prescription Routes
  PRESCRIPTION: {
    CREATE: '/prescription/create',
  },
  
  // Advertisement Routes
  ADVERTISEMENT: {
    MANAGEMENT: '/adv/management',
    CREATE: '/staff/create-adv',
    UPDATE: '/staff/update-adv/:id',
    ALL: '/staff/all-adv',
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Appointment Status
export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  MISSED: 'missed',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  PARTIAL: 'PARTIAL',
  OVERDUE: 'OVERDUE',
};

// Form Validation
export const VALIDATION = {
  PHONE_REGEX: /^[0-9]{10}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
};

// UI Constants
export const UI = {
  TOAST_DURATION: 5000,
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
  },
  DATE_FORMAT: 'yyyy-MM-dd',
  DATETIME_FORMAT: 'yyyy-MM-dd HH:mm:ss',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created.',
  UPDATED: 'Successfully updated.',
  DELETED: 'Successfully deleted.',
  SAVED: 'Successfully saved.',
  LOGIN: 'Successfully logged in.',
  LOGOUT: 'Successfully logged out.',
}; 