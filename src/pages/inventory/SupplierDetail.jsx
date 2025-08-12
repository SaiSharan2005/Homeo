import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSupplierById } from '../../services/inventory/supplier';
import { getPurchaseOrdersBySupplier } from '../../services/inventory/purchaseOrder';
import { getGoodsReceiptsBySupplier } from '../../services/inventory/goodsReceipt';
import { CardStack, Mail, MapPin, Phone, Truck, ArrowLeft, FileSpreadsheet, Package, BadgeInfo } from 'lucide-react';

const SupplierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [supplier, setSupplier] = useState(null);
  const [pos, setPos] = useState([]);
  const [poLoading, setPoLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;
  const [activeTab, setActiveTab] = useState('overview'); // overview | purchaseOrders | receipts
  const [supplierReceipts, setSupplierReceipts] = useState([]);
  const [receiptsLoading, setReceiptsLoading] = useState(true);
  const [receiptsPage, setReceiptsPage] = useState(0);
  const [receiptsTotalPages, setReceiptsTotalPages] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getSupplierById(id);
        setSupplier(data);
      } catch (err) {
        toast.error('Failed to load supplier: ' + (err.message || 'Unknown error'));
        navigate('/admin/inventory/suppliers');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id, navigate]);

  useEffect(() => {
    const loadPOs = async () => {
      if (!id) return;
      try {
        setPoLoading(true);
        const data = await getPurchaseOrdersBySupplier(id, page, pageSize);
        const content = data.content || data.items || [];
        setPos(content);
        setTotalPages(typeof data.totalPages === 'number' ? data.totalPages : 0);
      } catch (err) {
        // Non-fatal
      } finally {
        setPoLoading(false);
      }
    };
    loadPOs();
  }, [id, page]);

  useEffect(() => {
    const loadReceipts = async () => {
      if (!id) return;
      try {
        setReceiptsLoading(true);
        const data = await getGoodsReceiptsBySupplier(id, receiptsPage, pageSize);
        const content = data.content || data.items || [];
        setSupplierReceipts(Array.isArray(content) ? content : []);
        setReceiptsTotalPages(typeof data.totalPages === 'number' ? data.totalPages : 0);
      } catch (err) {
        // Non-fatal for the page
      } finally {
        setReceiptsLoading(false);
      }
    };
    loadReceipts();
  }, [id, receiptsPage]);

  const poStats = useMemo(() => {
    const total = pos.length;
    const byStatus = pos.reduce((acc, po) => {
      const key = (po.status || 'UNKNOWN').toUpperCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return { total, byStatus };
  }, [pos]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" role="status" aria-label="Loading" />
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-900">Supplier Not Found</h2>
        <button onClick={() => navigate('/admin/inventory/suppliers')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Back to Suppliers</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center">
              <Truck className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">{supplier.name}</h1>
              <p className="text-white/80">Supplier #{supplier.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate(-1)} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20"> <ArrowLeft className="h-4 w-4 inline mr-1"/> Back</button>
            <button onClick={() => navigate(`/admin/inventory/suppliers/${id}/edit`)} className="px-4 py-2 rounded-lg bg-white text-emerald-700 hover:bg-emerald-50 font-medium">Edit Supplier</button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2"><Mail className="h-4 w-4"/><span>{supplier.email || '—'}</span></div>
          <div className="flex items-center gap-2"><Phone className="h-4 w-4"/><span>{supplier.contactDetails || '—'}</span></div>
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4"/><span className="truncate">{supplier.address || '—'}</span></div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white p-4 shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Purchase Orders</p>
              <p className="text-2xl font-bold">{poStats.total}</p>
            </div>
            <FileSpreadsheet className="h-6 w-6 text-emerald-600"/>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold">{poStats.byStatus.PENDING || 0}</p>
            </div>
            <BadgeInfo className="h-6 w-6 text-amber-600"/>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow border border-gray-100">
          <div className="flex items-center justify-between">
          <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold">{poStats.byStatus.COMPLETED || poStats.byStatus.APPROVED || 0}</p>
            </div>
            <Package className="h-6 w-6 text-teal-600"/>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-xl bg-white shadow border border-gray-100">
        <div className="border-b px-4 pt-4">
          <div className="flex gap-2">
            {['overview','purchaseOrders','receipts'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-t-lg text-sm font-medium ${activeTab===tab? 'bg-emerald-50 text-emerald-700 border border-emerald-200 border-b-white' : 'text-gray-600 hover:text-gray-800'}`}>
                {tab === 'overview' ? 'Overview' : tab === 'purchaseOrders' ? 'Purchase Orders' : 'Goods Receipts'}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4">
          {activeTab === 'overview' && (
            <div className="text-sm text-gray-700 space-y-2">
              <p>View this supplier's purchase activity and receipts.</p>
              <ul className="list-disc ml-5">
                <li>Use the Purchase Orders tab to see all orders from this supplier.</li>
                <li>Goods Receipts shows received items associated with those orders.</li>
              </ul>
            </div>
          )}
          {activeTab === 'purchaseOrders' && (
            <div className="overflow-x-auto">
              {poLoading ? (
                <div className="py-10 text-center text-gray-500">Loading purchase orders…</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO #</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pos.length === 0 ? (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No purchase orders found</td></tr>
                    ) : (
                      pos.map(po => (
                        <tr key={po.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{po.orderNumber || `PO-${po.id}`}</td>
                          <td className="px-4 py-3 text-sm">{po.orderDate ? new Date(po.orderDate).toLocaleDateString() : '—'}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              (po.status||'').toUpperCase()==='PENDING' ? 'bg-amber-100 text-amber-800' : (po.status||'').toUpperCase()==='COMPLETED' || (po.status||'').toUpperCase()==='APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {(po.status || 'UNKNOWN').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{po.items ? po.items.length : '—'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">Page {page + 1} of {totalPages}</div>
                  <div className="space-x-2">
                    <button className="px-3 py-1 rounded border" disabled={page===0} onClick={() => setPage(p=>Math.max(0,p-1))}>Previous</button>
                    <button className="px-3 py-1 rounded border" disabled={page+1>=totalPages} onClick={() => setPage(p=>Math.min(totalPages-1,p+1))}>Next</button>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'receipts' && (
            <div className="space-y-4">
              {receiptsLoading ? (
                <div className="py-10 text-center text-gray-500">Loading receipts…</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt #</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO #</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {supplierReceipts.length === 0 ? (
                        <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No receipts found</td></tr>
                      ) : (
                        supplierReceipts.map(gr => (
                          <tr key={gr.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">{gr.receiptNumber || `GR-${gr.id}`}</td>
                            <td className="px-4 py-3 text-sm">{gr.receiptDate ? new Date(gr.receiptDate).toLocaleDateString() : '—'}</td>
                            <td className="px-4 py-3 text-sm">{(gr.status || 'PENDING').toUpperCase()}</td>
                            <td className="px-4 py-3 text-sm">{gr.totalItems ?? (gr.items ? gr.items.length : '—')}</td>
                            <td className="px-4 py-3 text-sm">{gr.purchaseOrderNumber || gr.purchaseOrderId || (gr.purchaseOrder && (gr.purchaseOrder.orderNumber || gr.purchaseOrder.id)) || '—'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {receiptsTotalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">Page {receiptsPage + 1} of {receiptsTotalPages}</div>
                  <div className="space-x-2">
                    <button className="px-3 py-1 rounded border" disabled={receiptsPage===0} onClick={() => setReceiptsPage(p=>Math.max(0,p-1))}>Previous</button>
                    <button className="px-3 py-1 rounded border" disabled={receiptsPage+1>=receiptsTotalPages} onClick={() => setReceiptsPage(p=>Math.min(receiptsTotalPages-1,p+1))}>Next</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierDetail;


