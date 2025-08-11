import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getStockLevels, getLowStockItems } from '../../services/inventory/stockLevel';

const StockLevels = () => {
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const fetchPage = async (pageNumber = 0, lowOnly = false) => {
    try {
      setLoading(true);
      const response = lowOnly
        ? await getLowStockItems(10, pageNumber, size)
        : await getStockLevels(pageNumber, size);
      setLevels(response.content || []);
      setTotalPages(typeof response.totalPages === 'number' ? response.totalPages : 0);
    } catch (err) {
      toast.error('Failed to load stock levels: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(0, showLowStockOnly);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLowStockOnly]);

  const goToPage = (newPage) => {
    if (newPage < 0 || newPage >= totalPages) return;
    setPage(newPage);
    fetchPage(newPage, showLowStockOnly);
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
        <h1 className="text-2xl font-bold text-gray-900">Stock Levels</h1>
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={showLowStockOnly}
            onChange={(e) => setShowLowStockOnly(e.target.checked)}
          />
          Show low stock only
        </label>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {levels.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No stock levels found</td>
              </tr>
            ) : (
              levels.map((row) => {
                const qty = row.quantity ?? row.currentQuantity ?? 0;
                const reorder = row.reorderLevel ?? 0;
                const low = qty <= reorder;
                return (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.itemName || row.inventoryItem?.name || row.itemId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.sku || row.inventoryItem?.sku || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.warehouseName || row.warehouseId || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{qty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reorder}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${low ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {low ? 'Low' : 'Healthy'}
                      </span>
                    </td>
                  </tr>
                );
              })
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

export default StockLevels;


