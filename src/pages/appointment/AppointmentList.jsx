import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { getBookingAppointments, updateAppointment } from '../../services/appointment';

const AppointmentList = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchAppointmentsData();
  }, [currentPage, filter]);

  const fetchAppointmentsData = async () => {
    try {
      setLoading(true);
      const res = await getBookingAppointments(currentPage, pageSize);
      setAppointments(res.content || res);
      setTotalPages(res.totalPages || 0);
      setTotalElements(res.totalElements || 0);
    } catch (error) {
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patient?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.doctor?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.token?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.status?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'scheduled') return matchesSearch && appointment.status === 'scheduled';
    if (filter === 'completed') return matchesSearch && appointment.status === 'completed';
    if (filter === 'cancelled') return matchesSearch && appointment.status === 'cancelled';
    if (filter === 'missed') return matchesSearch && appointment.status === 'missed';
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'missed': 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === 'scheduled') return <Clock className="h-4 w-4 text-blue-500" />;
    if (status === 'cancelled') return <XCircle className="h-4 w-4 text-red-500" />;
    if (status === 'missed') return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    return <Clock className="h-4 w-4 text-gray-500" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await updateAppointment(appointmentId, { status: newStatus });
      toast.success('Appointment status updated successfully');
      fetchAppointmentsData();
    } catch (error) {
      toast.error('Failed to update appointment status');
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
        <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
        <Button variant="primary" onClick={() => navigate('/admin/appointments/create')}>
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by patient name, doctor name, token, or status..."
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
              <option value="all">All Appointments</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="missed">Missed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Appointments Table */}
      <Card>
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No appointments found</p>
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
                    Date & Time
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
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {appointment.token}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.patient?.username || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.patient?.email || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.doctor?.username || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.doctor?.email || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {formatDate(appointment.appointmenDate)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTime(appointment.scheduleId?.startTime)} - {formatTime(appointment.scheduleId?.endTime)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(appointment.status)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/appointments/${appointment.id}`)}
                        >
                          View
                        </Button>
                        {appointment.status === 'scheduled' && (
                          <>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                            >
                              Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                            >
                              Cancel
                            </Button>
                          </>
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
            <Calendar className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{totalElements}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.status === 'cancelled').length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentList; 