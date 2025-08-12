import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getInvoiceById, updateInvoice } from '../../services/billing/invoice';
import { getAllPaymentTerms } from '../../services/billing/paymentTerms';

const InvoiceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    invoiceDate: '',
    dueDate: '',
    paymentTermsId: '',
    subtotal: '',
    taxRate: '',
    taxAmount: '',
    total: '',
    notes: '',
    status: 'DRAFT'
  });
  const [paymentTerms, setPaymentTerms] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch invoice data first
        let invoiceData;
        try {
          invoiceData = await getInvoiceById(id);
        } catch (err) {
          toast.error('Failed to load invoice: ' + err.message);
          navigate('/billing/invoices');
          return;
        }
        
        // Fetch payment terms
        let paymentTermsData = { content: [] };
        try {
          paymentTermsData = await getAllPaymentTerms(0, 100);
        } catch (err) {
          toast.error('Failed to load payment terms: ' + err.message);
          // Don't navigate away for payment terms error, just use empty array
        }
        
        setFormData({
          invoiceNumber: invoiceData.invoiceNumber || '',
          customerName: invoiceData.customerName || '',
          customerEmail: invoiceData.customerEmail || '',
          customerPhone: invoiceData.customerPhone || '',
          customerAddress: invoiceData.customerAddress || '',
          invoiceDate: invoiceData.invoiceDate ? invoiceData.invoiceDate.split('T')[0] : '',
          dueDate: invoiceData.dueDate ? invoiceData.dueDate.split('T')[0] : '',
          paymentTermsId: invoiceData.paymentTermsId || '',
          subtotal: invoiceData.subtotal || '',
          taxRate: invoiceData.taxRate || '',
          taxAmount: invoiceData.taxAmount || '',
          total: invoiceData.total || '',
          notes: invoiceData.notes || '',
          status: invoiceData.status || 'DRAFT'
        });
        
        setPaymentTerms(paymentTermsData.content || []);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch invoice details');
        navigate('/billing/invoices');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'Invoice number is required';
    }
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Customer email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }
    
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Customer phone is required';
    }
    
    if (!formData.customerAddress.trim()) {
      newErrors.customerAddress = 'Customer address is required';
    }
    
    if (!formData.invoiceDate) {
      newErrors.invoiceDate = 'Invoice date is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    // Validate that due date is after invoice date
    if (formData.invoiceDate && formData.dueDate) {
      const invoiceDate = new Date(formData.invoiceDate);
      const dueDate = new Date(formData.dueDate);
      if (dueDate <= invoiceDate) {
        newErrors.dueDate = 'Due date must be after invoice date';
      }
    }
    
    if (!formData.paymentTermsId) {
      newErrors.paymentTermsId = 'Payment terms are required';
    }
    
    if (!formData.subtotal || parseFloat(formData.subtotal) <= 0) {
      newErrors.subtotal = 'Subtotal must be a positive number';
    }
    
    if (!formData.taxRate || parseFloat(formData.taxRate) < 0) {
      newErrors.taxRate = 'Tax rate must be 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Auto-calculate tax amount and total
    if (name === 'subtotal' || name === 'taxRate') {
      const subtotal = name === 'subtotal' ? value : formData.subtotal;
      const taxRate = name === 'taxRate' ? value : formData.taxRate;
      
      if (subtotal && !isNaN(subtotal)) {
        const taxAmount = taxRate && !isNaN(taxRate) ? (Number(subtotal) * Number(taxRate)) / 100 : 0;
        const total = Number(subtotal) + taxAmount;
        
        setFormData(prev => ({
          ...prev,
          taxAmount: taxAmount.toFixed(2),
          total: total.toFixed(2)
        }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Validate specific fields on blur
    if (name === 'subtotal') {
      if (!value || parseFloat(value) <= 0) {
        setErrors(prev => ({
          ...prev,
          [name]: 'Subtotal must be a positive number'
        }));
      }
    }
    
    if (name === 'dueDate' && formData.invoiceDate) {
      const invoiceDate = new Date(formData.invoiceDate);
      const dueDate = new Date(value);
      if (dueDate <= invoiceDate) {
        setErrors(prev => ({
          ...prev,
          [name]: 'Due date must be after invoice date'
        }));
      }
    }
    
    if (name === 'customerEmail') {
      if (value && !/\S+@\S+\.\S+/.test(value)) {
        setErrors(prev => ({
          ...prev,
          [name]: 'Please enter a valid email address'
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const invoiceData = {
        ...formData,
        id: parseInt(id),
        subtotal: parseFloat(formData.subtotal),
        taxRate: parseFloat(formData.taxRate),
        taxAmount: parseFloat(formData.taxAmount),
        total: parseFloat(formData.total)
      };
      
      await updateInvoice(parseInt(id), invoiceData);
      toast.success('Invoice updated successfully');
      navigate(`/billing/invoices/${id}`);
    } catch (error) {
      toast.error('Failed to update invoice: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/billing/invoices');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Invoice</h1>
            <p className="text-gray-600">Update the invoice details below.</p>
          </div>
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Number *
              </label>
              <input
                type="text"
                id="invoiceNumber"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.invoiceNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter invoice number"
              />
              {errors.invoiceNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.invoiceNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.customerName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter customer name"
              />
              {errors.customerName && (
                <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
              )}
            </div>

            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Customer Email *
              </label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.customerEmail ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter customer email"
              />
              {errors.customerEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.customerEmail}</p>
              )}
            </div>

            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Customer Phone *
              </label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.customerPhone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter customer phone"
              />
              {errors.customerPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.customerPhone}</p>
              )}
            </div>

            <div>
              <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Customer Address *
              </label>
              <input
                type="text"
                id="customerAddress"
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.customerAddress ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter customer address"
              />
              {errors.customerAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.customerAddress}</p>
              )}
            </div>

            <div>
              <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Date *
              </label>
              <input
                type="date"
                id="invoiceDate"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.invoiceDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.invoiceDate && (
                <p className="mt-1 text-sm text-red-600">{errors.invoiceDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dueDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="paymentTermsId" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Terms
              </label>
              <select
                id="paymentTermsId"
                name="paymentTermsId"
                value={formData.paymentTermsId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.paymentTermsId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select payment terms</option>
                {paymentTerms.map(term => (
                  <option key={term.id} value={term.id}>
                    {term.name} ({term.days} days)
                  </option>
                ))}
              </select>
              {errors.paymentTermsId && (
                <p className="mt-1 text-sm text-red-600">{errors.paymentTermsId}</p>
              )}
            </div>

            <div>
              <label htmlFor="subtotal" className="block text-sm font-medium text-gray-700 mb-2">
                Subtotal *
              </label>
              <input
                type="number"
                id="subtotal"
                name="subtotal"
                value={formData.subtotal}
                onChange={handleInputChange}
                onBlur={handleBlur}
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.subtotal ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.subtotal && (
                <p className="mt-1 text-sm text-red-600">{errors.subtotal}</p>
              )}
            </div>

            <div>
              <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                id="taxRate"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.taxRate ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.taxRate && (
                <p className="mt-1 text-sm text-red-600">{errors.taxRate}</p>
              )}
            </div>

            <div>
              <label htmlFor="taxAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Tax Amount
              </label>
              <input
                type="number"
                id="taxAmount"
                name="taxAmount"
                value={formData.taxAmount}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-2">
                Total
              </label>
              <input
                type="number"
                id="total"
                name="total"
                value={formData.total}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-semibold"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="SENT">Sent</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter invoice notes"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Updating...' : 'Update Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceEdit;
