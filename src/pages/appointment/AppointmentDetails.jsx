import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAppointmentByToken, updateAppointment } from '../../services/appointment';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatDate, formatTime, formatCurrency } from '../../utils/helpers';

const AppointmentDetails = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointmentDetails();
  }, [tokenId]);

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      const data = await getAppointmentByToken(tokenId);
      setAppointment(data);
    } catch (error) {
      toast.error('Failed to fetch appointment details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateAppointment(appointment.id, { status: newStatus });
      toast.success('Appointment status updated successfully');
      fetchAppointmentDetails();
    } catch (error) {
      toast.error('Failed to update appointment status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      missed: 'bg-gray-100 text-gray-800',
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

  if (!appointment) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Appointment not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Information */}
        <Card title="Appointment Information">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Token:</span>
              <span className="text-gray-900">{appointment.token}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Status:</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Date:</span>
              <span className="text-gray-900">{formatDate(appointment.scheduleId?.date)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Time:</span>
              <span className="text-gray-900">
                {formatTime(appointment.scheduleId?.startTime)} - {formatTime(appointment.scheduleId?.endTime)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Fee:</span>
              <span className="text-gray-900">{formatCurrency(appointment.scheduleId?.fee || 0)}</span>
            </div>
          </div>
        </Card>

        {/* Patient Information */}
        <Card title="Patient Information">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Name:</span>
              <span className="text-gray-900">{appointment.patient?.name || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Phone:</span>
              <span className="text-gray-900">{appointment.patient?.phoneNumber || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Email:</span>
              <span className="text-gray-900">{appointment.patient?.email || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Age:</span>
              <span className="text-gray-900">{appointment.patient?.age || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Gender:</span>
              <span className="text-gray-900">{appointment.patient?.gender || 'N/A'}</span>
            </div>
          </div>
        </Card>

        {/* Doctor Information */}
        <Card title="Doctor Information">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Name:</span>
              <span className="text-gray-900">{appointment.doctor?.name || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Specialization:</span>
              <span className="text-gray-900">{appointment.doctor?.specialization || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Phone:</span>
              <span className="text-gray-900">{appointment.doctor?.phoneNumber || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Email:</span>
              <span className="text-gray-900">{appointment.doctor?.email || 'N/A'}</span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <Card title="Actions">
          <div className="space-y-3">
            {appointment.status === 'pending' && (
              <>
                <Button
                  variant="success"
                  fullWidth
                  onClick={() => handleStatusUpdate('confirmed')}
                >
                  Confirm Appointment
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() => handleStatusUpdate('cancelled')}
                >
                  Cancel Appointment
                </Button>
              </>
            )}
            
            {appointment.status === 'confirmed' && (
              <Button
                variant="success"
                fullWidth
                onClick={() => handleStatusUpdate('completed')}
              >
                Mark as Completed
              </Button>
            )}
            
            {appointment.status === 'completed' && (
              <div className="text-center">
                <p className="text-green-600 font-medium">Appointment completed successfully</p>
              </div>
            )}
            
            {appointment.status === 'cancelled' && (
              <div className="text-center">
                <p className="text-red-600 font-medium">Appointment has been cancelled</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Prescription Information */}
      {appointment.prescription && (
        <Card title="Prescription Information">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Prescription ID:</span>
              <span className="text-gray-900">{appointment.prescription.id}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Created Date:</span>
              <span className="text-gray-900">{formatDate(appointment.prescription.createdAt)}</span>
            </div>
            
            {appointment.prescription.notes && (
              <div>
                <span className="font-medium text-gray-700">Notes:</span>
                <p className="text-gray-900 mt-1">{appointment.prescription.notes}</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AppointmentDetails; 