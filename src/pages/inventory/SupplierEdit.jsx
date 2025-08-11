import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSupplierById, updateSupplier } from '../../services/inventory/supplier';

const SupplierEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getSupplierById(id);
        setForm({ name: data.name || '', email: data.email || '', phone: data.phone || '', address: data.address || '' });
      } catch (err) {
        toast.error('Failed to load supplier: ' + (err.message || 'Unknown error'));
        navigate('/inventory/suppliers');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id, navigate]);

  const setField = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = 'Please enter a valid email address';
    if (!form.phone.trim()) next.phone = 'Phone is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await updateSupplier(id, form);
      toast.success('Supplier updated');
      navigate(`/inventory/suppliers/${id}`);
    } catch (err) {
      toast.error('Failed to update supplier: ' + (err.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" role="status" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Supplier</h1>
        <button onClick={() => navigate(`/inventory/suppliers/${id}`)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Back</button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input id="name" value={form.name} onChange={(e)=>setField('name', e.target.value)} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-300':'border-gray-300'}`} />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input id="email" type="email" value={form.email} onChange={(e)=>setField('email', e.target.value)} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-300':'border-gray-300'}`} />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input id="phone" value={form.phone} onChange={(e)=>setField('phone', e.target.value)} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-300':'border-gray-300'}`} />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea id="address" rows="3" value={form.address} onChange={(e)=>setField('address', e.target.value)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300" />
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={()=>navigate(`/inventory/suppliers/${id}`)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Update Supplier</button>
        </div>
      </form>
    </div>
  );
};

export default SupplierEdit;


