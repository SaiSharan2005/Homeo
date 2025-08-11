import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Calendar,
  Hash
} from 'lucide-react';
import { 
  getGoodsReceiptItems,
  getGoodsReceiptItemsByReceipt,
  deleteGoodsReceiptItem 
} from '../../services/inventory/goodsReceiptItem';

const GoodsReceiptItemList = () => {
  const navigate = useNavigate();
  const { receiptId } = useParams();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    batchNumber: '',
    expiryDateFrom: '',
    expiryDateTo: ''
  });

  useEffect(() => {
    fetchItems();
  }, [pagination.page, pagination.size, searchTerm, filters, receiptId]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      let result;
      
      if (receiptId) {
        result = await getGoodsReceiptItemsByReceipt(
          receiptId, 
          pagination.page, 
          pagination.size
        );
      } else {
        result = await getGoodsReceiptItems(pagination.page, pagination.size);
      }
      
      if (result.success) {
        setItems(result.data.content || result.data);
        if (result.data.totalElements !== undefined) {
          setPagination(prev => ({
            ...prev,
            totalElements: result.data.totalElements,
            totalPages: result.data.totalPages
          }));
        }
      } else {
        toast.error('Failed to fetch goods receipt items');
      }
    } catch (error) {
      console.error('Error fetching goods receipt items:', error);
      toast.error('Failed to fetch goods receipt items');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({ ...prev, page: 0, size: newSize }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const result = await deleteGoodsReceiptItem(id);
      if (result.success) {
        toast.success('Item deleted successfully');
        fetchItems();
      } else {
        toast.error(result.message || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/inventory/goods-receipt-items/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/admin/inventory/goods-receipt-items/${id}`);
  };

  const handleCreate = () => {
    const path = receiptId 
      ? `/admin/inventory/goods-receipts/${receiptId}/items/create`
      : '/admin/inventory/goods-receipt-items/create';
    navigate(path);
  };

  const filteredItems = items.filter(item => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        item.batchNumber?.toLowerCase().includes(searchLower) ||
        item.inventoryItem?.name?.toLowerCase().includes(searchLower) ||
        item.inventoryItem?.commonName?.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    if (filters.batchNumber && !item.batchNumber?.includes(filters.batchNumber)) {
      return false;
    }

    if (filters.expiryDateFrom && new Date(item.expiryDate) < new Date(filters.expiryDateFrom)) {
      return false;
    }

    if (filters.expiryDateTo && new Date(item.expiryDate) > new Date(filters.expiryDateTo)) {
      return false;
    }

    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return 'unknown';
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 30) return 'expiring-soon';
    return 'valid';
  };

  const getExpiryStatusColor = (status) => {
    switch (status) {
      case 'expired': return 'text-red-600 bg-red-100';
      case 'expiring-soon': return 'text-yellow-600 bg-yellow-100';
      case 'valid': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Goods Receipt Items
                {receiptId && <span className="text-gray-500 text-lg ml-2">(Receipt #{receiptId})</span>}
              </h1>
              <p className="text-gray-600">
                Manage and track goods receipt items
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={handleCreate}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <form onSubmit={handleSearch} className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search by batch number or item name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-4 w-4 text-gray-400" />}
              />
            </div>
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </form>

          <div className="flex items-center space-x-4">
            <Filter className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Filter by batch number"
              value={filters.batchNumber}
              onChange={(e) => handleFilterChange('batchNumber', e.target.value)}
              leftIcon={<Hash className="h-4 w-4 text-gray-400" />}
              className="w-48"
            />
            <Input
              type="date"
              placeholder="From date"
              value={filters.expiryDateFrom}
              onChange={(e) => handleFilterChange('expiryDateFrom', e.target.value)}
              leftIcon={<Calendar className="h-4 w-4 text-gray-400" />}
              className="w-40"
            />
            <Input
              type="date"
              placeholder="To date"
              value={filters.expiryDateTo}
              onChange={(e) => handleFilterChange('expiryDateTo', e.target.value)}
              leftIcon={<Calendar className="h-4 w-4 text-gray-400" />}
              className="w-40"
            />
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {loading ? 'Loading...' : 'No items found'}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const expiryStatus = getExpiryStatus(item.expiryDate);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.inventoryItem?.name || 'Unknown Item'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.inventoryItem?.commonName || 'No common name'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.batchNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantityReceived}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(item.expiryDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getExpiryStatusColor(expiryStatus)}`}>
                          {expiryStatus === 'expired' && 'Expired'}
                          {expiryStatus === 'expiring-soon' && 'Expiring Soon'}
                          {expiryStatus === 'valid' && 'Valid'}
                          {expiryStatus === 'unknown' && 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(item.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Showing {pagination.page * pagination.size + 1} to{' '}
                {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
                {pagination.totalElements} results
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={pagination.size}
                onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default GoodsReceiptItemList;
