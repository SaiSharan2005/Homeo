import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createGoodsReceipt } from '../../../services/inventory/goodsReceipt';
import { getAllSuppliers } from '../../../services/inventory/supplier';
import { getInventoryItems } from '../../../services/inventory/inventoryItem';

const GoodsReceiptCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    supplierId: '',
    receiptDate: new Date().toISOString().split('T')[0],
    notes: '',
    items: [
      { inventoryItemId: '', quantity: '', unitPrice: '' }
    ]
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [supplierData, inventoryData] = await Promise.all([
          getAllSuppliers(),
          getInventoryItems(0, 1000)
        ]);
        setSuppliers(supplierData?.content || supplierData || []);
        setItems(inventoryData?.content || []);
      } catch (err) {
        toast.error('Failed to load form data: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const setField = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const setItemField = (index, name, value) => {
    setForm(prev => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [name]: value };
      return { ...prev, items: updated };
    });
  };

  const addItemRow = () => setForm(prev => ({ ...prev, items: [...prev.items, { inventoryItemId: '', quantity: '', unitPrice: '' }] }));
  const removeItemRow = (index) => setForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));

  const validate = () => {
    const next = {};
    if (!form.supplierId) next.supplierId = 'Supplier is required';
    if (!form.receiptDate) next.receiptDate = 'Receipt date is required';
    if (!form.items.length) next.items = 'At least one item is required';
    let hasInvalidItem = false;
    form.items.forEach((it, i) => {
      if (!it.inventoryItemId) next[`item_${i}_inventoryItemId`] = 'Item is required';
      if (!it.quantity || Number(it.quantity) <= 0) next[`item_${i}_quantity`] = 'Quantity must be > 0';
      if (!it.unitPrice || Number(it.unitPrice) < 0) next[`item_${i}_unitPrice`] = 'Unit price must be >= 0';
      if (!it.inventoryItemId || !it.quantity || Number(it.quantity) <= 0 || it.unitPrice === '' || Number(it.unitPrice) < 0) {
        hasInvalidItem = true;
      }
    });
    if (!next.items && hasInvalidItem) next.items = 'At least one item is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const payload = {
        supplierId: form.supplierId,
        receiptDate: form.receiptDate,
        notes: form.notes,
        items: form.items.map(it => ({
          inventoryItemId: Number(it.inventoryItemId),
          quantity: Number(it.quantity),
          unitPrice: Number(it.unitPrice),
          totalPrice: Number(it.quantity) * Number(it.unitPrice)
        }))
      };
      const created = await createGoodsReceipt(payload);
      toast.success('Goods receipt created');
      navigate(`/admin/inventory/receipt/${created.id || ''}`);
    } catch (err) {
      toast.error('Failed to create receipt: ' + (err.message || 'Unknown error'));
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Create Goods Receipt</h1>
        <button onClick={() => navigate('/admin/inventory/receipt')} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Back</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 mb-1">Supplier *</label>
            <select
              id="supplierId"
              value={form.supplierId}
              onChange={(e) => setField('supplierId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.supplierId ? 'border-red-300' : 'border-gray-300'}`}
            >
              <option value="">Select supplier</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name || s.companyName || `Supplier ${s.id}`}</option>
              ))}
            </select>
            {errors.supplierId && <p className="mt-1 text-sm text-red-600">{errors.supplierId}</p>}
          </div>
          <div>
            <label htmlFor="receiptDate" className="block text-sm font-medium text-gray-700 mb-1">Receipt Date *</label>
            <input
              id="receiptDate"
              type="date"
              value={form.receiptDate}
              onChange={(e) => setField('receiptDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.receiptDate ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.receiptDate && <p className="mt-1 text-sm text-red-600">{errors.receiptDate}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Items *</label>
          <div className="space-y-4">
            {form.items.map((it, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label htmlFor={`item_${i}_inventoryItemId`} className="block text-sm font-medium text-gray-700 mb-1">Item *</label>
                  <select
                    id={`item_${i}_inventoryItemId`}
                    value={it.inventoryItemId}
                    onChange={(e) => setItemField(i, 'inventoryItemId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`item_${i}_inventoryItemId`] ? 'border-red-300' : 'border-gray-300'}`}
                  >
                    <option value="">Select item</option>
                    {items.map(item => (
                      <option key={item.id} value={item.id}>{item.name} - {item.sku}</option>
                    ))}
                  </select>
                  {errors[`item_${i}_inventoryItemId`] && <p className="mt-1 text-sm text-red-600">{errors[`item_${i}_inventoryItemId`]}</p>}
                </div>
                <div>
                  <label htmlFor={`item_${i}_quantity`} className="block text-sm font-medium text-gray-700 mb-1">Qty *</label>
                  <input
                    id={`item_${i}_quantity`}
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={it.quantity}
                    onChange={(e) => setItemField(i, 'quantity', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`item_${i}_quantity`] ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors[`item_${i}_quantity`] && <p className="mt-1 text-sm text-red-600">{errors[`item_${i}_quantity`]}</p>}
                </div>
                <div>
                  <label htmlFor={`item_${i}_unitPrice`} className="block text-sm font-medium text-gray-700 mb-1">Unit Price *</label>
                  <input
                    id={`item_${i}_unitPrice`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={it.unitPrice}
                    onChange={(e) => setItemField(i, 'unitPrice', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`item_${i}_unitPrice`] ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors[`item_${i}_unitPrice`] && <p className="mt-1 text-sm text-red-600">{errors[`item_${i}_unitPrice`]}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => removeItemRow(i)} className="px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button type="button" onClick={addItemRow} className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">Add Item</button>
          </div>
          {errors.items && <p className="mt-2 text-sm text-red-600">{errors.items}</p>}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            id="notes"
            rows="3"
            value={form.notes}
            onChange={(e) => setField('notes', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
            placeholder="Optional notes"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/admin/inventory/receipt')} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Create Receipt</button>
        </div>
      </form>
    </div>
  );
};

export default GoodsReceiptCreate;


