import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllGoodsReceipts } from '../../../services/inventory/goodsReceipt';

const GoodsReceiptList = () => {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size] = useState(10);

  const fetchPage = async (pageNumber = 0) => {
    try {
      setLoading(true);
      const result = await getAllGoodsReceipts(pageNumber, size);
      setReceipts(result.content || []);
      setTotalPages(typeof result.totalPages === 'number' ? result.totalPages : 0);
    } catch (err) {
      toast.error('Failed to load goods receipts: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(0);
  }, []);

  const goToPage = (newPage) => {
    if (newPage < 0 || newPage >= totalPages) return;
    setPage(newPage);
    fetchPage(newPage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" role="status" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Goods Receipts</h1>
        <button
          onClick={() => navigate('/admin/inventory/receipt/create')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          New Goods Receipt
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {receipts.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No goods receipts found</td>
              </tr>
            ) : (
              receipts.map((gr) => (
                <tr key={gr.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{gr.receiptNumber || `GR-${gr.id}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{gr.receiptDate ? new Date(gr.receiptDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{gr.supplierName || gr.supplierId || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {(gr.status || 'PENDING').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{gr.totalItems ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => navigate(`/admin/inventory/receipt/${gr.id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Page {page + 1} of {totalPages}</div>
          <div className="space-x-2">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 0}
              className={`px-3 py-1 rounded border ${page === 0 ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              Previous
            </button>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page + 1 >= totalPages}
              className={`px-3 py-1 rounded border ${(page + 1 >= totalPages) ? 'text-gray-400 border-gray-2 00' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoodsReceiptList;


