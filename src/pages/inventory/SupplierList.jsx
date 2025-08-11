import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSuppliers } from '../../services/inventory/supplier';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Truck, Plus, Search, Phone, Mail, MapPin } from 'lucide-react';

const SupplierList = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchSuppliers();
  }, [currentPage]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await getSuppliers(currentPage, pageSize);
      setSuppliers(data.content || data);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      toast.error('Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = (
      supplier.name || ''
    ).toLowerCase().includes(searchQuery.toLowerCase()) || (
      supplier.email || ''
    ).toLowerCase().includes(searchQuery.toLowerCase()) || (
      supplier.contactDetails || ''
    ).toLowerCase().includes(searchQuery.toLowerCase()) || (
      supplier.address || ''
    ).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Removed status/rating UI; backend Supplier does not expose those fields

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
        <h1 className="text-2xl font-bold text-gray-900">Supplier Management</h1>
        <Button variant="primary" onClick={() => navigate('/admin/inventory/suppliers/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">Page {currentPage + 1} of {totalPages}</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 0} onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}>Previous</Button>
            <Button variant="outline" size="sm" disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages - 1))}>Next</Button>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, email, phone, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          {/* Removed status filter not supported by backend */}
        </div>
      </Card>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No suppliers found</p>
          </div>
        ) : (
          filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Truck className="h-8 w-8 text-blue-500 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                      <p className="text-sm text-gray-500">{supplier.email}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  {supplier.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {supplier.email}
                    </div>
                  )}
                  {supplier.contactDetails && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {supplier.contactDetails}
                    </div>
                  )}
                  {supplier.address && (
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                      <div>{supplier.address}</div>
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Tax ID:</span>
                    <div className="font-medium">{supplier.taxId || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Payment Terms:</span>
                    <div className="font-medium">{supplier.paymentTerms || 'N/A'}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <Button
                    size="sm"
                    variant="outline"
                    fullWidth
                    onClick={() => navigate(`/admin/inventory/suppliers/${supplier.id}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    fullWidth
                    onClick={() => navigate(`/admin/inventory/suppliers/${supplier.id}/edit`)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
            </div>
          </div>
        </Card>
        {/* Removed Active/Inactive blocks not supported by backend */}
      </div>
    </div>
  );
};

export default SupplierList; 