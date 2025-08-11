import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { 
  CreditCard, 
  Plus, 
  Search, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { getPayments } from '../../services/billing/payment';

const PaymentList = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await getPayments(0, 50);
      setPayments(data.content || data);
    } catch (error) {
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = (payment.invoice?.invoiceNumber || '')
                          .toString()
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                          (payment.method || '')
                          .toString()
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    // No explicit status on the new DTO; client filters only by method/invoice
    if (filter === 'completed') return matchesSearch && false;
    if (filter === 'pending') return matchesSearch && false;
    if (filter === 'failed') return matchesSearch && false;
    return matchesSearch;
  });

  const getStatusColor = () => 'bg-gray-100 text-gray-800';

  const getStatusIcon = () => <Clock className="h-4 w-4 text-gray-500" />;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
        <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
        <Button variant="primary" onClick={() => navigate('/admin/billing/payments/create')}>
          <Plus className="h-4 w-4 mr-2" />
          New Payment
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by invoice number, payment method, or status..."
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
              <option value="all">All Payments</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Payments Table */}
      <Card>
        {filteredPayments.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No payments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
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
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          #{payment.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                      {payment.invoiceId || payment.invoice?.invoiceNumber || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.invoice?.patient?.name || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.method || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon()}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor()}`}>
                          {/* no status in new DTO */}N/A
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                       {formatDate(payment.paymentDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/billing/payments/${payment.id}`)}
                        >
                          View
                        </Button>
                        {payment.status === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => navigate(`/admin/billing/payments/${payment.id}/process`)}
                          >
                            Process
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {payments.filter(p => p.status === 'COMPLETED').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {payments.filter(p => p.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(payments.reduce((sum, p) => sum + (p.amount || 0), 0))}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentList; 