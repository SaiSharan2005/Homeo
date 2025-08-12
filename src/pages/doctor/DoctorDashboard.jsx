import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Settings, 
  User,
  Activity
} from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/helpers';
import authService from '../../services/auth.service';
import appointmentService from '../../services/appointment.service';

const DoctorDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const user = authService.getCurrentUserData();
      setCurrentUser(user);

      // Get appointments for current doctor
      const appointmentsResult = await appointmentService.getMyAppointmentsAsDoctor(0, 10);
      
      if (appointmentsResult.success) {
        const appointments = appointmentsResult.data.content || appointmentsResult.data;
        setRecentAppointments(appointments);
        
        // Calculate stats
        const today = new Date().toISOString().split('T')[0];
        const todayAppts = appointments.filter(apt => 
          apt.scheduleId?.date === today
        );
        
        setStats({
          totalAppointments: appointments.length,
          todayAppointments: todayAppts.length,
          completedAppointments: appointments.filter(apt => apt.status === 'completed').length,
          pendingAppointments: appointments.filter(apt => apt.status === 'pending').length
        });
      }
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, Dr. {currentUser?.name || 'Doctor'}!
        </h1>
        <p className="text-blue-100">
          Here's what's happening with your appointments today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedAppointments}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Activity className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingAppointments}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/doctor/appointment">
            <Button variant="primary" fullWidth>
              <Calendar className="h-4 w-4 mr-2" />
              View Appointments
            </Button>
          </Link>
          
          <Link to="/doctor/create-schedule">
            <Button variant="outline" fullWidth>
              <Clock className="h-4 w-4 mr-2" />
              Create Schedule
            </Button>
          </Link>
          
          <Link to="/doctor/profile">
            <Button variant="outline" fullWidth>
              <User className="h-4 w-4 mr-2" />
              Update Profile
            </Button>
          </Link>
          
          <Link to="/doctor/schedule">
            <Button variant="outline" fullWidth>
              <Settings className="h-4 w-4 mr-2" />
              Manage Schedule
            </Button>
          </Link>
        </div>
      </Card>

      {/* Recent Appointments */}
      <Card title="Recent Appointments">
        {recentAppointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No recent appointments</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentAppointments.slice(0, 5).map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.patient?.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.patient?.phoneNumber || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(appointment.scheduleId?.date)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.scheduleId?.startTime} - {appointment.scheduleId?.endTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(appointment.scheduleId?.fee || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {recentAppointments.length > 5 && (
          <div className="mt-4 text-center">
            <Link to="/doctor/appointment">
              <Button variant="outline">
                View All Appointments
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DoctorDashboard; 