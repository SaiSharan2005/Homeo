import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { 
  Package, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

import { getBatches } from '../../services/inventory/batch';

const BatchList = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchBatches();
  }, [currentPage]);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const data = await getBatches(currentPage, pageSize);
      setBatches(data.content || data);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      toast.error('Failed to fetch batches');
    } finally {
      setLoading(false);
    }
  };

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.batchNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         batch.inventoryItem?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         batch.status?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && batch.status === 'ACTIVE';
    if (filter === 'expired') return matchesSearch && batch.status === 'EXPIRED';
    if (filter === 'quarantined') return matchesSearch && batch.status === 'QUARANTINED';
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'EXPIRED': 'bg-red-100 text-red-800',
      'QUARANTINED': 'bg-yellow-100 text-yellow-800',
      'DISPOSED': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    if (status === 'ACTIVE') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === 'EXPIRED') return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (status === 'QUARANTINED') return <Clock className="h-4 w-4 text-yellow-500" />;
    return <Package className="h-4 w-4 text-gray-500" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const isExpiringSoon = (batch) => {
    if (!batch.expiryDate || batch.status === 'EXPIRED') return false;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return new Date(batch.expiryDate) <= thirtyDaysFromNow && new Date(batch.expiryDate) >= new Date();
  };

  const isExpired = (batch) => {
    if (!batch.expiryDate) return false;
    return new Date(batch.expiryDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Batch Management</h1>
        <Button variant="primary" onClick={() => navigate('/admin/inventory/batches/create')}>
          <Plus className="h-4 w-4 mr-2" />
          New Batch
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by batch number, item name, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Batches</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="quarantined">Quarantined</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Batches Table */}
      <Card>
        {filteredBatches.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No batches found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manufacture Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBatches.map((batch) => (
                  <tr key={batch.id} className={`hover:bg-gray-50 ${
                    isExpired(batch) ? 'bg-red-50' : 
                    isExpiringSoon(batch) ? 'bg-yellow-50' : ''
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {batch.batchNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {batch.inventoryItem?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {batch.inventoryItem?.commonName || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {batch.quantity} {batch.inventoryItem?.unit || ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(batch.status)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(batch.status)}`}>
                          {batch.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(batch.manufactureDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(batch.expiryDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/inventory/batches/${batch.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/inventory/batches/${batch.id}/edit`)}
                        >
                          Edit
                        </Button>
                        {batch.status === 'ACTIVE' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/admin/inventory/batches/${batch.id}/adjust`)}
                          >
                            Adjust
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">Page {currentPage + 1} of {totalPages}</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 0} onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}>Previous</Button>
            <Button variant="outline" size="sm" disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages - 1))}>Next</Button>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Batches</p>
              <p className="text-2xl font-bold text-gray-900">{batches.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {batches.filter(b => b.status === 'ACTIVE').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-gray-900">
                {batches.filter(b => b.status === 'EXPIRED').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">
                {batches.filter(b => isExpiringSoon(b)).length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BatchList; 