import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createInvoice } from '../../services/billing/invoice';
import { getAllPaymentTerms } from '../../services/billing/paymentTerms';
import { toast } from 'react-toastify';

const InvoiceCreate = () => {
  const navigate = useNavigate();
  const [paymentTerms, setPaymentTerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPaymentTerms, setLoadingPaymentTerms] = useState(true);

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

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadPaymentTerms();
  }, []);

  const loadPaymentTerms = async () => {
    try {
      setLoadingPaymentTerms(true);
      const response = await getAllPaymentTerms(0, 100); // Get all payment terms
      setPaymentTerms(response.content || []);
    } catch (error) {
      toast.error('Failed to load payment terms: ' + error.message);
    } finally {
      setLoadingPaymentTerms(false);
    }
  };

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

    if (!formData.invoiceDate) {
      newErrors.invoiceDate = 'Invoice date is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else if (new Date(formData.dueDate) <= new Date(formData.invoiceDate)) {
      newErrors.dueDate = 'Due date must be after invoice date';
    }

    if (!formData.subtotal || isNaN(formData.subtotal) || Number(formData.subtotal) < 0) {
      newErrors.subtotal = 'Subtotal must be a positive number';
    }

    if (formData.taxRate && (isNaN(formData.taxRate) || Number(formData.taxRate) < 0)) {
      newErrors.taxRate = 'Tax rate must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Live validate email format on blur or change when non-empty
    if (name === 'customerEmail') {
      if (value && !/\S+@\S+\.\S+/.test(value)) {
        setErrors(prev => ({
          ...prev,
          customerEmail: 'Please enter a valid email address'
        }));
      }
    }

    // Auto-calculate tax amount and total
    if (name === 'subtotal' || name === 'taxRate') {
      const subtotal = name === 'subtotal' ? value : formData.subtotal;
      const taxRate = name === 'taxRate' ? value : formData.taxRate;
      
      if (subtotal && taxRate && !isNaN(subtotal) && !isNaN(taxRate)) {
        const taxAmount = (Number(subtotal) * Number(taxRate)) / 100;
        const total = Number(subtotal) + taxAmount;
        
        setFormData(prev => ({
          ...prev,
          taxAmount: taxAmount.toFixed(2),
          total: total.toFixed(2)
        }));
      }
    }

    // Auto-apply payment terms: when invoiceDate or paymentTermsId changes, compute dueDate
    if (name === 'invoiceDate' || name === 'paymentTermsId') {
      const invoiceDate = name === 'invoiceDate' ? value : formData.invoiceDate;
      const paymentTermsId = name === 'paymentTermsId' ? value : formData.paymentTermsId;
      const selected = paymentTerms.find(t => String(t.id) === String(paymentTermsId));
      if (invoiceDate && selected && selected.days !== undefined) {
        const base = new Date(invoiceDate);
        const due = new Date(base.getTime());
        due.setDate(due.getDate() + Number(selected.days || 0));
        const yyyy = due.getFullYear();
        const mm = String(due.getMonth() + 1).padStart(2, '0');
        const dd = String(due.getDate()).padStart(2, '0');
        setFormData(prev => ({ ...prev, dueDate: `${yyyy}-${mm}-${dd}` }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data for submission
      const invoiceData = {
        ...formData,
        subtotal: Number(formData.subtotal),
        taxRate: formData.taxRate ? Number(formData.taxRate) : 0,
        taxAmount: formData.taxAmount ? Number(formData.taxAmount) : 0,
        total: Number(formData.total)
      };

      await createInvoice(invoiceData);
      toast.success('Invoice created successfully');
      navigate('/billing/invoices');
    } catch (error) {
      toast.error('Failed to create invoice: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingPaymentTerms) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" role="status" aria-label="Loading"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Invoice</h1>
        <p className="text-gray-600 mt-2">Fill in the details to create a new invoice.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Invoice Details */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h3>
          </div>

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
                errors.invoiceNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter invoice number"
            />
            {errors.invoiceNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.invoiceNumber}</p>
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
                errors.invoiceDate ? 'border-red-500' : 'border-gray-300'
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.dueDate ? 'border-red-500' : 'border-gray-300'
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select payment terms</option>
              {paymentTerms.map(term => (
                <option key={term.id} value={term.id}>
                  {term.name} ({term.days} days)
                </option>
              ))}
            </select>
          </div>

          {/* Customer Information */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
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
                errors.customerName ? 'border-red-500' : 'border-gray-300'
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.customerEmail ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter customer email"
            />
            {errors.customerEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.customerEmail}</p>
            )}
          </div>

          <div>
            <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
              Customer Phone
            </label>
            <input
              type="tel"
              id="customerPhone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter customer phone"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-2">
              Customer Address
            </label>
            <textarea
              id="customerAddress"
              name="customerAddress"
              value={formData.customerAddress}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter customer address"
            />
          </div>

          {/* Financial Details */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Details</h3>
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
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.subtotal ? 'border-red-500' : 'border-gray-300'
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
                errors.taxRate ? 'border-red-500' : 'border-gray-300'
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

          {/* Notes */}
          <div className="md:col-span-2">
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
              placeholder="Enter any additional notes"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Invoice...
              </span>
            ) : (
              'Create Invoice'
            )}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/billing/invoices')}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceCreate;
