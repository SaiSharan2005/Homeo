import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  createPaymentTerms, 
  getPaymentTermsById, 
  updatePaymentTerms 
} from '../../services/billing/paymentTerms';
import { toast } from 'react-toastify';

const PaymentTermsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    days: '',
    active: true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      loadPaymentTerm();
    }
  }, [id]);

  const loadPaymentTerm = async () => {
    try {
      setInitialLoading(true);
      const paymentTerm = await getPaymentTermsById(id);
      setFormData({
        name: paymentTerm.name || '',
        description: paymentTerm.description || '',
        days: paymentTerm.days || '',
        active: paymentTerm.active !== undefined ? paymentTerm.active : true
      });
    } catch (error) {
      toast.error('Failed to load payment term: ' + error.message);
      navigate('/billing/payment-terms');
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.days) {
      newErrors.days = 'Days is required';
    } else if (isNaN(formData.days) || Number(formData.days) < 0) {
      newErrors.days = 'Days must be a positive number';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      if (isEditMode) {
        await updatePaymentTerms(id, formData);
        toast.success('Payment term updated successfully');
      } else {
        await createPaymentTerms(formData);
        toast.success('Payment term created successfully');
      }
      
      navigate('/billing/payment-terms');
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} payment term: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Edit Payment Term' : 'Create New Payment Term'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEditMode ? 'Update the payment term details below.' : 'Fill in the details to create a new payment term.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter payment term name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter payment term description (optional)"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {formData.description.length}/500 characters
          </p>
        </div>

        {/* Days Field */}
        <div className="mb-4">
          <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-2">
            Days *
          </label>
          <input
            type="number"
            id="days"
            name="days"
            value={formData.days}
            onChange={handleInputChange}
            min="0"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.days ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter number of days"
          />
          {errors.days && (
            <p className="mt-1 text-sm text-red-600">{errors.days}</p>
          )}
        </div>

        {/* Active Status Field */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Active</span>
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditMode ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              isEditMode ? 'Update Payment Term' : 'Create Payment Term'
            )}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/billing/payment-terms')}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentTermsForm;
