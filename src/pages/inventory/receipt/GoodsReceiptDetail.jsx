import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getGoodsReceiptById } from '../../../services/inventory/goodsReceipt';
import { getGoodsReceiptItemsByGoodsReceipt } from '../../../services/inventory/goodsReceiptItem';

const GoodsReceiptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [receiptData, itemData] = await Promise.all([
          getGoodsReceiptById(id),
          getGoodsReceiptItemsByGoodsReceipt(id, 0, 100)
        ]);
        setReceipt(receiptData);
        setItems(itemData.content || []);
      } catch (err) {
        toast.error('Failed to load goods receipt: ' + (err.message || 'Unknown error'));
        navigate('/admin/inventory/receipt');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" role="status" aria-label="Loading" />
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-900">Goods Receipt Not Found</h2>
        <p className="text-gray-600 mt-2">The requested goods receipt could not be found.</p>
        <button onClick={() => navigate('/admin/inventory/receipt')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Back to Goods Receipts</button>
      </div>
    );
  }

  const total = items.reduce((sum, it) => sum + (Number(it.quantity) * Number(it.unitPrice || 0)), 0);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Goods Receipt #{receipt.receiptNumber || id}</h1>
            <p className="text-gray-600">Received on {receipt.receiptDate ? new Date(receipt.receiptDate).toLocaleDateString() : 'N/A'}</p>
          </div>
          <button onClick={() => navigate('/admin/inventory/receipt')} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Back</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Supplier</h3>
            <p className="text-gray-900">{receipt.supplierName || receipt.supplierId || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Purchase Order</h3>
            <p className="text-gray-900">{receipt.purchaseOrderNumber || receipt.purchaseOrderId || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Amount</h3>
            <p className="text-blue-600 font-semibold">${total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Items</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No items found</td>
                </tr>
              ) : (
                items.map((it) => (
                  <tr key={it.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{it.inventoryItemName || it.inventoryItemId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{it.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${Number(it.unitPrice || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${(Number(it.quantity) * Number(it.unitPrice || 0)).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GoodsReceiptDetail;


