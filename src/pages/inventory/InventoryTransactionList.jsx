import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { 
  RefreshCw, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  Package
} from 'lucide-react';
import { fetchInventoryTransactions } from '../../services/inventory/inventoryTransaction';

const InventoryTransactionList = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const result = await fetchInventoryTransactions();
      if (result.success) {
        setTransactions(result.data);
      } else {
        toast.error('Failed to fetch inventory transactions');
      }
    } catch (error) {
      toast.error('Failed to fetch inventory transactions');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.inventoryItem?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.inventoryRecord?.batchNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.transactionType?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'in') return matchesSearch && transaction.transactionType === 'IN';
    if (filter === 'out') return matchesSearch && transaction.transactionType === 'OUT';
    if (filter === 'adjustment') return matchesSearch && transaction.transactionType === 'ADJUSTMENT';
    return matchesSearch;
  });

  const getTransactionTypeColor = (type) => {
    const colors = {
      'IN': 'bg-green-100 text-green-800',
      'OUT': 'bg-red-100 text-red-800',
      'ADJUSTMENT': 'bg-blue-100 text-blue-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTransactionIcon = (type) => {
    if (type === 'IN') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (type === 'OUT') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <RefreshCw className="h-4 w-4 text-blue-500" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
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
        <h1 className="text-2xl font-bold text-gray-900">Inventory Transactions</h1>
        <Button variant="primary" onClick={() => navigate('/admin/inventory/transactions/create')}>
          <Plus className="h-4 w-4 mr-2" />
          New Transaction
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by item name, batch number, or transaction type..."
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
              <option value="all">All Transactions</option>
              <option value="in">Stock In</option>
              <option value="out">Stock Out</option>
              <option value="adjustment">Adjustments</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No inventory transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
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
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTransactionIcon(transaction.transactionType)}
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          #{transaction.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.inventoryItem?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.inventoryItem?.commonName || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.inventoryRecord?.batchNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${
                          transaction.transactionType === 'IN' ? 'text-green-600' : 
                          transaction.transactionType === 'OUT' ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          {transaction.transactionType === 'IN' ? '+' : 
                           transaction.transactionType === 'OUT' ? '-' : '±'}
                          {transaction.quantity}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTransactionTypeColor(transaction.transactionType)}`}>
                        {transaction.transactionType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(transaction.transactionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/inventory/transactions/${transaction.id}`)}
                        >
                          View
                        </Button>
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
            <RefreshCw className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Stock In</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.filter(t => t.transactionType === 'IN').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <TrendingDown className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Out</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.filter(t => t.transactionType === 'OUT').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <RefreshCw className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Adjustments</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.filter(t => t.transactionType === 'ADJUSTMENT').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card title="Recent Activity">
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                {getTransactionIcon(transaction.transactionType)}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.transactionType} - {transaction.inventoryItem?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Quantity: {transaction.quantity} | {formatDate(transaction.transactionDate)}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/admin/inventory/transactions/${transaction.id}`)}
              >
                View
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default InventoryTransactionList; 