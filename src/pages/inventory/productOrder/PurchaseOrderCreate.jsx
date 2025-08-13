import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { createPurchaseOrder } from '../../../services/inventory/purchaseOrder';
import { searchInventoryItems, getInventoryItems } from '../../../services/inventory/inventoryItem';
import { getAllSuppliers } from '../../../services/inventory/supplier';

const STATUS_OPTIONS = ['CREATED', 'ORDERED', 'RECEIVED', 'CANCELLED'];

const formatCurrency = (value) => {
  const num = Number(value || 0);
  return num.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
};

const PurchaseOrderCreate = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    orderDate: new Date().toISOString().slice(0, 16),
    status: 'CREATED',
    supplierId: '',
  });
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Item search state (for easy multi-add)
  const [itemSearch, setItemSearch] = useState('');
  const [itemResults, setItemResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const res = await getAllSuppliers();
        const list = res?.content || res?.items || res || [];
        setSuppliers(Array.isArray(list) ? list : []);
      } catch (err) {
        toast.error('Failed to load suppliers');
      }
    };
    loadSuppliers();
  }, []);

  // Debounced search for inventory items, and preload a few on empty query
  useEffect(() => {
    let active = true;
    const run = async () => {
      const q = itemSearch.trim();
      if (q.length < 2) {
        // load a small default set when empty to help discovery
        try {
          setIsSearching(true);
          const res = await getInventoryItems(0, 5);
          const list = res?.content || res?.items || res || [];
          if (active) setItemResults(Array.isArray(list) ? list : []);
        } catch (_) {
          if (active) setItemResults([]);
        } finally {
          if (active) setIsSearching(false);
        }
        return;
      }
      try {
        setIsSearching(true);
        const res = await searchInventoryItems(q, 0, 8);
        const list = res?.content || res?.items || res || [];
        if (active) setItemResults(Array.isArray(list) ? list : []);
      } catch (_) {
        if (active) setItemResults([]);
      } finally {
        if (active) setIsSearching(false);
      }
    };
    const t = setTimeout(run, 300);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [itemSearch]);

  // On focus, ensure we show suggestions immediately
  const handleSearchFocus = async () => {
    setIsSearchFocused(true);
    if (!itemSearch.trim()) {
      try {
        setIsSearching(true);
        const res = await getInventoryItems(0, 5);
        const list = res?.content || res?.items || res || [];
        setItemResults(Array.isArray(list) ? list : []);
      } catch (_) {
        setItemResults([]);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleSearchBlur = () => {
    // Small delay to allow clicking suggestion
    setTimeout(() => setIsSearchFocused(false), 120);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateItem = (index, field, value) => {
    setItems((prev) => prev.map((it, i) => i === index ? { ...it, [field]: value } : it));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { inventoryItemId: '', quantityOrdered: 1, unitPrice: '' }]);
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addFoundItem = (found) => {
    const id = found.id || found.inventoryItemId;
    if (!id) return;
    // prevent duplicates
    if (items.some((it) => Number(it.inventoryItemId) === Number(id))) {
      toast.info('Item already added');
      return;
    }
    const defaultPrice = Number(found.costPrice ?? found.sellingPrice ?? 0);
    setItems((prev) => [
      ...prev,
      { inventoryItemId: id, quantityOrdered: 1, unitPrice: Number.isFinite(defaultPrice) ? defaultPrice : '' }
    ]);
    toast.success(`${found.name || 'Item'} added`);
  };

  const computedTotal = useMemo(() => {
    return items.reduce((sum, it) => {
      const qty = Number(it.quantityOrdered || 0);
      const price = Number(it.unitPrice || 0);
      return sum + (qty * price);
    }, 0);
  }, [items]);

  const validate = () => {
    if (!form.supplierId) return 'Please select a supplier';
    if (!form.orderDate) return 'Order date is required';
    for (const [idx, it] of items.entries()) {
      if (!it.inventoryItemId && (it.quantityOrdered || it.unitPrice)) return `Item #${idx + 1}: Inventory Item ID is required`;
      if (it.inventoryItemId) {
        const qty = Number(it.quantityOrdered);
        if (!Number.isFinite(qty) || qty <= 0) return `Item #${idx + 1}: Quantity must be > 0`;
        const price = Number(it.unitPrice);
        if (!Number.isFinite(price) || price < 0) return `Item #${idx + 1}: Unit price must be >= 0`;
      }
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    const payload = {
      supplierId: Number(form.supplierId),
      orderDate: form.orderDate, // ISO-like string acceptable by backend LocalDateTime
      status: form.status,
      items: items.map((it) => ({
        inventoryItemId: it.inventoryItemId ? Number(it.inventoryItemId) : undefined,
        quantityOrdered: it.quantityOrdered ? Number(it.quantityOrdered) : undefined,
        unitPrice: it.unitPrice ? Number(it.unitPrice) : undefined,
      })).filter(it => it.inventoryItemId),
    };

    setIsSubmitting(true);
    try {
      await createPurchaseOrder(payload);
      toast.success('Purchase order created successfully');
      navigate('/admin/purchase-orders');
    } catch (err) {
      console.error(err);
      const msg = err?.message || 'Failed to create purchase order';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create Purchase Order</h1>
            <p className="text-gray-600 mt-1">Fill in supplier, date, and line items. Total is calculated automatically.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-rose-50 p-3 text-rose-700 border border-rose-100">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card title="Order Details">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <select
                    name="supplierId"
                    value={form.supplierId}
                    onChange={handleFormChange}
                    className="block w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              // required removed
                  >
                    <option value="">Select supplier…</option>
                    {suppliers.map((s) => (
                      <option key={s.id || s.supplierId} value={s.id || s.supplierId}>
                        {s.name || s.supplierName || `#${s.id || s.supplierId}`}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                type="datetime-local"
                  label="Order Date"
                name="orderDate"
                  value={form.orderDate}
                  onChange={handleFormChange}
                // required removed
              />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                    value={form.status}
                    onChange={handleFormChange}
                    className="block w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
              </select>
            </div>
              </div>
            </Card>

            <Card
              title="Line Items"
              subtitle="Search and add products, then set quantities and prices"
              footer={
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">Estimated total</div>
                  <div className="text-lg font-semibold text-gray-900">{formatCurrency(computedTotal)}</div>
                </div>
              }
            >
              {/* Search and quick add */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Add Items</label>
                <div className="relative">
                  <input
                    type="text"
                    value={itemSearch}
                    onChange={(e) => setItemSearch(e.target.value)}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    placeholder="Search by name or description…"
                    className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {/* Suggestions */}
                  {isSearchFocused && ((itemResults && itemResults.length > 0) || isSearching) && (
                    <div className="absolute z-10 mt-1 w-full max-h-72 overflow-auto rounded-md border border-gray-200 bg-white shadow">
                      {isSearching && (
                        <div className="px-3 py-2 text-sm text-gray-500">Searching…</div>
                      )}
                      {itemResults.map((res) => (
                        <button
                          type="button"
                          key={res.id}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => addFoundItem(res)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between"
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-800 truncate">{res.name || res.commonName || `#${res.id}`}</div>
                            <div className="text-xs text-gray-500 truncate">ID: {res.id}{res.category?.name ? ` • ${res.category.name}` : ''}</div>
                          </div>
                          <div className="text-xs text-gray-600 ml-3 whitespace-nowrap">{typeof res.costPrice !== 'undefined' ? `Cost: ${formatCurrency(res.costPrice)}` : ''}</div>
                        </button>
                      ))}
                      {!isSearching && itemResults.length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500">No items</div>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-500">Tip: type at least 2 characters to search. Click a result to add it below.</div>
              </div>

              <div className="overflow-x-auto -mx-2 md:mx-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-3 py-2 text-left">Item</th>
                      <th className="px-3 py-2 text-left">Quantity</th>
                      <th className="px-3 py-2 text-left">Unit Price</th>
                      <th className="px-3 py-2 text-left">Line Total</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {items.map((it, idx) => {
                      const lineTotal = Number(it.quantityOrdered || 0) * Number(it.unitPrice || 0);
                      return (
                        <tr key={idx} className="align-top">
                          <td className="px-3 py-2 min-w-[220px]">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                placeholder="Item ID"
                                value={it.inventoryItemId}
                                onChange={(e) => updateItem(idx, 'inventoryItemId', e.target.value)}
                                className="w-28 px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                              />
                              <span className="text-xs text-gray-500">You can also add via search above</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 w-[140px]">
                            <Input
                type="number"
                              min={1}
                              value={it.quantityOrdered}
                              onChange={(e) => updateItem(idx, 'quantityOrdered', e.target.value)}
                // required removed
              />
                          </td>
                          <td className="px-3 py-2 w-[160px]">
                            <Input
                type="number"
                              step="0.01"
                              min={0}
                              value={it.unitPrice}
                              onChange={(e) => updateItem(idx, 'unitPrice', e.target.value)}
                required
              />
                          </td>
                          <td className="px-3 py-2 text-gray-900 whitespace-nowrap">{formatCurrency(lineTotal)}</td>
                          <td className="px-3 py-2 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              type="button"
                              onClick={() => removeItem(idx)}
                              disabled={items.length === 1}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Button type="button" variant="secondary" onClick={addItem}>
                  Add Empty Row
                </Button>
                <span className="text-xs text-gray-500">Or search above and click an item to add</span>
              </div>
            </Card>

            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/purchase-orders')}>Cancel</Button>
              <Button type="submit" variant="primary" loading={isSubmitting}>Create Order</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PurchaseOrderCreate;
