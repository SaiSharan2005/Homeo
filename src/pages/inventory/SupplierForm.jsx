import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Save, X, UserPlus, Pencil, ArrowLeft } from 'lucide-react';
import { createSupplier, getSupplierById, updateSupplier } from '../../services/inventory/supplier';

const SupplierForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    contactDetails: '',
    address: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        setLoading(true);
        const data = await getSupplierById(id);
        setForm({
          name: data.name || '',
          email: data.email || '',
          contactDetails: data.contactDetails || '',
          address: data.address || ''
        });
      } catch (err) {
        toast.error('Failed to load supplier');
        navigate('/admin/inventory/suppliers');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit, navigate]);

  const setField = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = 'Enter a valid email';
    return Object.keys(next).length === 0 ? null : next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (errs) { setErrors(errs); return; }
    setSaving(true);
    try {
      if (isEdit) {
        await updateSupplier(id, form);
        toast.success('Supplier updated');
        navigate(`/admin/inventory/suppliers/${id}`);
      } else {
        const created = await createSupplier(form);
        toast.success('Supplier created');
        navigate(`/admin/inventory/suppliers/${created.id || created.supplierId || ''}`);
      }
    } catch (err) {
      toast.error('Save failed: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Supplier' : 'Create Supplier'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Supplier Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name *"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="Acme Distributors"
              error={errors.name}
              required
            />
            <Input
              label="Email *"
              type="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="contact@acme.com"
              error={errors.email}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Details</label>
              <textarea
                rows={3}
                value={form.contactDetails}
                onChange={(e) => setField('contactDetails', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Primary contact name, phone, notes"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                rows={3}
                value={form.address}
                onChange={(e) => setField('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Street, City, State, ZIP"
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex gap-3">
            <Button type="submit" variant="primary" fullWidth loading={saving}>
              {isEdit ? <Pencil className="h-4 w-4 mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
              {isEdit ? 'Update Supplier' : 'Create Supplier'}
            </Button>
            <Button type="button" variant="outline" fullWidth onClick={() => navigate('/admin/inventory/suppliers')}>
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default SupplierForm;


