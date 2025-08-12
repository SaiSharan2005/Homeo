# Migration Guide - Frontend Refactoring

This guide helps you understand the changes made during the frontend refactoring and how to migrate existing code to the new structure.

## 🎯 What Changed

### 1. **New Folder Structure**
The project has been reorganized for better maintainability and scalability:

**Before:**
```
src/
├── components/
│   ├── appointment/
│   ├── inventory/
│   ├── navbar/
│   ├── Layouts/
│   └── prescription/
├── pages/
│   ├── auth/
│   ├── doctor/
│   ├── patient/
│   ├── staff/
│   └── inventory/
├── services/
│   ├── api.js
│   ├── doctor/
│   ├── patient/
│   └── inventory/
└── utils/
```

**After:**
```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── layouts/         # Layout components
│   ├── forms/           # Form components
│   ├── tables/          # Table components
│   └── charts/          # Chart components
├── pages/               # Organized by feature
│   ├── auth/
│   ├── doctor/
│   ├── patient/
│   ├── admin/
│   ├── staff/
│   ├── appointment/
│   ├── inventory/
│   ├── prescription/
│   ├── advertisement/
│   └── landing/
├── services/            # API service layer
├── utils/               # Utility functions
├── config/              # Configuration
├── hooks/               # Custom hooks
├── context/             # React context
└── styles/              # Global styles
```

### 2. **New API Service Layer**
- Centralized API client with error handling
- Service-specific API classes
- Better error management and retry logic

### 3. **New Utility Functions**
- Authentication utilities
- Validation helpers
- Common helper functions
- Centralized constants

### 4. **New Component Library**
- Reusable UI components
- Consistent design system
- Better prop validation

## 🔄 Migration Steps

### Step 1: Update Imports

**Before:**
```javascript
import { getData, postData } from '../services/api';
import './style.css';
```

**After:**
```javascript
import apiService from '../services/appointment.service';
import { validateEmail } from '../utils/validation';
import { formatDate } from '../utils/helpers';
```

### Step 2: Update API Calls

**Before:**
```javascript
const response = await getData('/api/bookingAppointments');
```

**After:**
```javascript
const result = await appointmentService.getAllAppointments();
if (result.success) {
  setAppointments(result.data);
} else {
  toast.error(result.message);
}
```

### Step 3: Update Component Structure

**Before:**
```javascript
function MyComponent() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2>Title</h2>
      <p>Content</p>
    </div>
  );
}
```

**After:**
```javascript
import Card from '../components/common/Card';

function MyComponent() {
  return (
    <Card title="Title">
      <p>Content</p>
    </Card>
  );
}
```

### Step 4: Update Form Handling

**Before:**
```javascript
const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});

const handleSubmit = (e) => {
  e.preventDefault();
  // Manual validation
  if (!formData.email) {
    setErrors({ ...errors, email: 'Email is required' });
    return;
  }
  // Submit logic
};
```

**After:**
```javascript
import { validateForm, validateEmail, validateRequired } from '../utils/validation';

const validationRules = {
  email: validateEmail,
  name: validateRequired,
};

const handleSubmit = (e) => {
  e.preventDefault();
  const { isValid, errors } = validateForm(formData, validationRules);
  
  if (!isValid) {
    setErrors(errors);
    return;
  }
  
  // Submit logic
};
```

### Step 5: Update Authentication

**Before:**
```javascript
const token = localStorage.getItem('Token');
const user = JSON.parse(localStorage.getItem('user'));
```

**After:**
```javascript
import authService from '../services/auth.service';

const isAuthenticated = authService.isAuthenticated();
const userRole = authService.getUserRole();
const currentUser = authService.getCurrentUserData();
```

## 📁 File Migration Map

### Components Migration

| Old Path | New Path | Notes |
|----------|----------|-------|
| `components/Layouts/DoctorLayout.js` | `components/layouts/DoctorLayout.jsx` | Updated to use new structure |
| `components/navbar/AdminNavbar.js` | `components/layouts/AdminNavbar.jsx` | Moved to layouts |
| `components/appointment/Appointments.js` | `components/appointment/AppointmentList.jsx` | Renamed for clarity |

### Pages Migration

| Old Path | New Path | Notes |
|----------|----------|-------|
| `pages/doctor/home/DoctorHome.js` | `pages/doctor/DoctorDashboard.jsx` | Renamed for clarity |
| `pages/patient/home/PatientHome.js` | `pages/patient/PatientDashboard.jsx` | Renamed for clarity |
| `pages/staff/Home/Home.js` | `pages/admin/AdminDashboard.jsx` | Moved to admin section |

### Services Migration

| Old Path | New Path | Notes |
|----------|----------|-------|
| `services/api.js` | `utils/api.js` | Moved to utils, enhanced |
| `services/doctor/doctor_api.js` | `services/doctor.service.js` | Renamed and restructured |
| `services/patient/patient_api.js` | `services/patient.service.js` | Renamed and restructured |

## 🆕 New Features

### 1. **Protected Routes**
```javascript
import ProtectedRoute from '../components/common/ProtectedRoute';

<ProtectedRoute allowedRoles={['DOCTOR']}>
  <DoctorDashboard />
</ProtectedRoute>
```

### 2. **Form Validation**
```javascript
import { validateEmail, validatePhone, validateRequired } from '../utils/validation';

const validationRules = {
  email: validateEmail,
  phone: validatePhone,
  name: validateRequired,
};
```

### 3. **Toast Notifications**
```javascript
import { toast } from 'react-toastify';

toast.success('Operation completed successfully');
toast.error('Something went wrong');
```

### 4. **Loading States**
```javascript
import Button from '../components/common/Button';

<Button loading={isLoading} disabled={isLoading}>
  Submit
</Button>
```

## 🔧 Configuration Updates

### Environment Variables
Update your `.env` file:
```env
REACT_APP_BACKEND_URL=http://localhost:8080
REACT_APP_APP_NAME=Homeopathy Hospital
```

### Package.json Updates
The following dependencies have been added:
```json
{
  "dependencies": {
    "lucide-react": "^0.484.0",
    "react-toastify": "^11.0.5",
    "date-fns": "^3.6.0"
  }
}
```

## 🐛 Common Issues and Solutions

### Issue 1: Import Errors
**Problem:** Components not found after refactoring
**Solution:** Update import paths to match new structure

### Issue 2: API Calls Not Working
**Problem:** API calls returning errors
**Solution:** Use the new service layer instead of direct API calls

### Issue 3: Styling Issues
**Problem:** Styles not applying correctly
**Solution:** Ensure Tailwind CSS is properly configured

### Issue 4: Authentication Issues
**Problem:** User not staying logged in
**Solution:** Use the new auth service for token management

## 📋 Checklist for Migration

- [ ] Update all import statements
- [ ] Replace direct API calls with service layer
- [ ] Update form validation logic
- [ ] Replace custom components with new common components
- [ ] Update authentication logic
- [ ] Test all functionality
- [ ] Update environment variables
- [ ] Install new dependencies
- [ ] Update routing configuration

## 🚀 Best Practices

### 1. **Use Service Layer**
Always use the service layer for API calls:
```javascript
// Good
const result = await appointmentService.createAppointment(data);

// Avoid
const response = await fetch('/api/bookingAppointments', {...});
```

### 2. **Use Common Components**
Leverage the new common components:
```javascript
// Good
import Button from '../components/common/Button';
import Input from '../components/common/Input';

// Avoid
<button className="bg-blue-500 text-white px-4 py-2 rounded">
```

### 3. **Use Validation Utilities**
Use the validation utilities for forms:
```javascript
// Good
import { validateEmail } from '../utils/validation';

// Avoid
const validateEmail = (email) => {
  // Custom validation logic
};
```

### 4. **Use Constants**
Use centralized constants:
```javascript
// Good
import { ROUTES, USER_ROLES } from '../config/constants';

// Avoid
const routes = {
  doctor: '/doctor',
  patient: '/patient',
};
```

## 📞 Support

If you encounter issues during migration:

1. Check the [README.md](./README.md) for detailed documentation
2. Review the new component examples
3. Check the service layer documentation
4. Create an issue in the repository

## 🔄 Rollback Plan

If you need to rollback to the old structure:

1. Keep a backup of the old code
2. Use git branches for the migration
3. Test thoroughly before merging
4. Have a rollback strategy ready

---

**Note:** This migration guide is a living document. It will be updated as the codebase evolves. 