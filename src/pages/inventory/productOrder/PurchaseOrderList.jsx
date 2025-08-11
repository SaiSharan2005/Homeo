
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllPurchaseOrders, getPurchaseOrdersByStatus } from '../../../services/inventory/purchaseOrder';

const STATUS_OPTIONS = ['PENDING', 'APPROVED', 'COMPLETED', 'REJECTED'];
const PAGE_SIZE_OPTIONS = [10, 20, 50];

const formatCurrency = (value) =>
  typeof value === 'number'
    ? value.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
    : value;

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : '—');

const StatusChip = ({ status }) => {
  const color =
    status === 'PENDING'
      ? 'bg-amber-100 text-amber-800'
      : status === 'APPROVED' || status === 'COMPLETED'
      ? 'bg-emerald-100 text-emerald-800'
      : 'bg-rose-100 text-rose-800';
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${color}`}>
      {status}
    </span>
  );
};

const PurchaseOrderList = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = statusFilter
          ? await getPurchaseOrdersByStatus(statusFilter, 0, 200)
          : await getAllPurchaseOrders(0, 200);
        const content = res?.content || res?.items || res || [];
        setAllOrders(Array.isArray(content) ? content : []);
        setPage(1);
      } catch (err) {
        setError(err?.message || 'Failed to load purchase orders');
        toast.error('Failed to load purchase orders');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [statusFilter]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return allOrders;
    return allOrders.filter((o) =>
      (o.orderNumber || `${o.orderId || o.id}` || '').toLowerCase().includes(q) ||
      (o.supplier?.name || o.supplierName || '').toLowerCase().includes(q) ||
      (o.status || '').toLowerCase().includes(q)
    );
  }, [allOrders, searchTerm]);

  const total = filtered.length;
  const startIndex = (page - 1) * pageSize;
  const current = filtered.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 pt-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Purchase Orders</h1>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2 items-center w-full md:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              placeholder="Search by PO #, supplier, or status"
              className="w-full md:w-80 px-3 py-2 rounded-md border border-gray-300"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <Link to="/admin/purchase-orders/create" className="px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
            Create Purchase Order
          </Link>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">PO #</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">Loading…</td></tr>
              ) : error ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-rose-600">{error}</td></tr>
              ) : current.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">No purchase orders found</td></tr>
              ) : (
                current.map((o) => {
                  const id = o.orderId || o.id;
                  const supplierName = o.supplier?.name || o.supplierName || `#${o.supplier?.id || o.supplierId || '—'}`;
                  const totalItems = o.totalItems ?? o.items?.length ?? 0;
                  return (
                    <tr key={id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{o.orderNumber || id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{supplierName}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(o.orderDate)}</td>
                      <td className="px-4 py-3"><StatusChip status={(o.status || 'PENDING').toUpperCase()} /></td>
                      <td className="px-4 py-3 text-sm text-gray-700">{totalItems}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(o.totalAmount)}</td>
                      <td className="px-4 py-3 text-right">
                        <Link to={`/purchase-orders/${id}`} className="px-2 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50">
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-sm text-gray-600">
            {total === 0 ? '0-0 of 0' : `${startIndex + 1}-${Math.min(startIndex + current.length, total)} of ${total}`}
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Rows per page</label>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setPage(1); }}
              className="px-2 py-1 rounded-md border border-gray-300"
            >
              {PAGE_SIZE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
              >
                Prev
              </button>
              <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderList;
