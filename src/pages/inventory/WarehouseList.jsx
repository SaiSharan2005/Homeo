import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { 
  Warehouse, 
  Plus, 
  Search, 
  MapPin,
  Phone,
  Mail,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const WarehouseList = () => {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchWarehousesData();
  }, [currentPage, filter]);

  const fetchWarehousesData = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockData = {
        content: [
          {
            id: 1,
            name: 'Main Warehouse',
            code: 'WH001',
            address: '123 Main Street, City, State 12345',
            phone: '+1 (555) 123-4567',
            email: 'main@warehouse.com',
            manager: 'John Smith',
            capacity: 10000,
            usedCapacity: 7500,
            status: 'ACTIVE'
          },
          {
            id: 2,
            name: 'Secondary Warehouse',
            code: 'WH002',
            address: '456 Oak Avenue, City, State 12345',
            phone: '+1 (555) 987-6543',
            email: 'secondary@warehouse.com',
            manager: 'Jane Doe',
            capacity: 5000,
            usedCapacity: 3000,
            status: 'ACTIVE'
          }
        ],
        totalElements: 2,
        totalPages: 1
      };
      
      setWarehouses(mockData.content);
      setTotalPages(mockData.totalPages);
      setTotalElements(mockData.totalElements);
    } catch (error) {
      toast.error('Failed to fetch warehouses');
    } finally {
      setLoading(false);
    }
  };

  const filteredWarehouses = warehouses.filter(warehouse => {
    const matchesSearch = warehouse.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         warehouse.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         warehouse.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         warehouse.manager?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && warehouse.status === 'ACTIVE';
    if (filter === 'inactive') return matchesSearch && warehouse.status === 'INACTIVE';
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'INACTIVE': 'bg-red-100 text-red-800',
      'MAINTENANCE': 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCapacityPercentage = (used, total) => {
    return Math.round((used / total) * 100);
  };

  const getCapacityColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleDelete = async (warehouseId) => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      try {
        // Mock delete - replace with actual API call
        toast.success('Warehouse deleted successfully');
        fetchWarehousesData();
      } catch (error) {
        toast.error('Failed to delete warehouse');
      }
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
        <h1 className="text-2xl font-bold text-gray-900">Warehouse Management</h1>
        <Button variant="primary" onClick={() => navigate('/admin/inventory/warehouses/create')}>
          <Plus className="h-4 w-4 mr-2" />
          New Warehouse
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, code, address, or manager..."
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
              <option value="all">All Warehouses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWarehouses.map((warehouse) => (
          <Card key={warehouse.id} className="hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Warehouse className="h-6 w-6 text-blue-500 mr-2" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{warehouse.name}</h3>
                    <p className="text-sm text-gray-500">{warehouse.code}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(warehouse.status)}`}>
                  {warehouse.status}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="truncate">{warehouse.address}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{warehouse.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="truncate">{warehouse.email}</span>
                </div>
              </div>

              {/* Manager */}
              <div className="border-t pt-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Manager:</span> {warehouse.manager}
                </p>
              </div>

              {/* Capacity */}
              <div className="border-t pt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Capacity Usage</span>
                  <span className={`text-sm font-semibold ${getCapacityColor(getCapacityPercentage(warehouse.usedCapacity, warehouse.capacity))}`}>
                    {getCapacityPercentage(warehouse.usedCapacity, warehouse.capacity)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      getCapacityPercentage(warehouse.usedCapacity, warehouse.capacity) >= 90 
                        ? 'bg-red-500' 
                        : getCapacityPercentage(warehouse.usedCapacity, warehouse.capacity) >= 75 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${getCapacityPercentage(warehouse.usedCapacity, warehouse.capacity)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{warehouse.usedCapacity.toLocaleString()} / {warehouse.capacity.toLocaleString()} units</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-3 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/admin/inventory/warehouses/${warehouse.id}`)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/admin/inventory/warehouses/${warehouse.id}/edit`)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(warehouse.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredWarehouses.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <Warehouse className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No warehouses found</p>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} results
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="px-3 py-2 text-sm text-gray-700">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages - 1}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <Warehouse className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Warehouses</p>
              <p className="text-2xl font-bold text-gray-900">{totalElements}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <Warehouse className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {warehouses.filter(w => w.status === 'ACTIVE').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <Warehouse className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-gray-900">
                {warehouses.filter(w => w.status === 'INACTIVE').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <Warehouse className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">High Usage</p>
              <p className="text-2xl font-bold text-gray-900">
                {warehouses.filter(w => getCapacityPercentage(w.usedCapacity, w.capacity) >= 75).length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WarehouseList; 