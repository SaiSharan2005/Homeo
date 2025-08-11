import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getStockAdjustments } from '../../services/inventory/stockAdjustment';

const StockAdjustments = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPage = async (pageNumber = 0) => {
    try {
      setLoading(true);
      const response = await getStockAdjustments(pageNumber, size);
      setRows(response.content || []);
      setTotalPages(typeof response.totalPages === 'number' ? response.totalPages : 0);
    } catch (err) {
      toast.error('Failed to load adjustments: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPage(0); }, []);

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
        <h1 className="text-2xl font-bold text-gray-900">Stock Adjustments</h1>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No adjustments found</td>
              </tr>
            ) : (
              rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{row.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.itemName || row.inventoryItem?.name || row.itemId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.warehouseName || row.warehouseId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.quantity > 0 ? `+${row.quantity}` : row.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.reason || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.adjustmentDate ? new Date(row.adjustmentDate).toLocaleString() : '-'}</td>
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
            <button onClick={() => goToPage(page - 1)} disabled={page === 0} className={`px-3 py-1 rounded border ${page === 0 ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}>Previous</button>
            <button onClick={() => goToPage(page + 1)} disabled={page + 1 >= totalPages} className={`px-3 py-1 rounded border ${(page + 1 >= totalPages) ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockAdjustments;


