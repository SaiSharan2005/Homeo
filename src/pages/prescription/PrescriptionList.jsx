import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  User,
  Stethoscope,
  Eye
} from 'lucide-react';
import { getPrescriptions } from '../../services/prescription';

const PrescriptionList = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchPrescriptionsData();
  }, [currentPage, filter]);

  const fetchPrescriptionsData = async () => {
    try {
      setLoading(true);
      const data = await getPrescriptions(currentPage, pageSize);
      setPrescriptions(data.content || data);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      toast.error('Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prescription.doctor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prescription.token?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prescription.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && prescription.status === 'ACTIVE';
    if (filter === 'completed') return matchesSearch && prescription.status === 'COMPLETED';
    if (filter === 'cancelled') return matchesSearch && prescription.status === 'CANCELLED';
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'COMPLETED': 'bg-blue-100 text-blue-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
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
        <h1 className="text-2xl font-bold text-gray-900">Prescription Management</h1>
        <Button variant="primary" onClick={() => navigate('/admin/prescriptions/create')}>
          <Plus className="h-4 w-4 mr-2" />
          New Prescription
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by patient name, doctor name, token, or diagnosis..."
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
              <option value="all">All Prescriptions</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Prescriptions Table */}
      <Card>
        {filteredPrescriptions.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No prescriptions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diagnosis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPrescriptions.map((prescription) => (
                  <tr key={prescription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {prescription.token}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {prescription.patient?.name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {prescription.patient?.phone || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Stethoscope className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {prescription.doctor?.name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {prescription.doctor?.specialization || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {prescription.diagnosis || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(prescription.status)}`}>
                        {prescription.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(prescription.createdDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/prescriptions/${prescription.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/prescriptions/${prescription.id}/edit`)}
                        >
                          Edit
                        </Button>
                        {prescription.status === 'ACTIVE' && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => navigate(`/admin/prescriptions/${prescription.id}/items`)}
                          >
                            Add Items
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
            <FileText className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Prescriptions</p>
              <p className="text-2xl font-bold text-gray-900">{totalElements}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {prescriptions.filter(p => p.status === 'ACTIVE').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {prescriptions.filter(p => p.status === 'COMPLETED').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <FileText className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">
                {prescriptions.filter(p => p.status === 'CANCELLED').length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrescriptionList; 