import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { 
  Package, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Edit,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';
import { fetchInventoryRecordById } from '../../services/inventory/InventoryRecord';

const InventoryRecordDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecord();
  }, [id]);

  const fetchRecord = async () => {
    try {
      setLoading(true);
      const result = await fetchInventoryRecordById(id);
      if (result.success) {
        setRecord(result.data);
      } else {
        toast.error('Failed to fetch inventory record');
        navigate('/admin/inventory/records');
      }
    } catch (error) {
      toast.error('Failed to fetch inventory record');
      navigate('/admin/inventory/records');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (record.quantity <= (record.inventoryItem?.reorderLevel || 0)) return 'bg-red-100 text-red-800';
    if (new Date(record.expiryDate) < new Date()) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = () => {
    if (record.quantity <= (record.inventoryItem?.reorderLevel || 0)) return 'Low Stock';
    if (new Date(record.expiryDate) < new Date()) return 'Expired';
    return 'In Stock';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const isExpiringSoon = () => {
    if (!record?.expiryDate) return false;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return new Date(record.expiryDate) <= thirtyDaysFromNow && new Date(record.expiryDate) >= new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Record not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Record Details</h1>
        </div>
        <Button variant="primary" onClick={() => navigate(`/admin/inventory/records/${id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Record
        </Button>
      </div>

      {/* Alerts */}
      {record.quantity <= (record.inventoryItem?.reorderLevel || 0) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-800">
              This item is running low on stock. Current quantity: {record.quantity}
            </p>
          </div>
        </div>
      )}

      {new Date(record.expiryDate) < new Date() && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-orange-400 mr-2" />
            <p className="text-orange-800">
              This item has expired on {formatDate(record.expiryDate)}
            </p>
          </div>
        </div>
      )}

      {isExpiringSoon() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
            <p className="text-yellow-800">
              This item will expire soon on {formatDate(record.expiryDate)}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Record Information */}
        <Card title="Record Information">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Record ID:</span>
              <span className="text-gray-900">{record.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Batch Number:</span>
              <span className="text-gray-900">{record.batchNumber || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Quantity:</span>
              <span className="text-gray-900">{record.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Expiry Date:</span>
              <span className="text-gray-900">{formatDate(record.expiryDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Status:</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Created Date:</span>
              <span className="text-gray-900">{formatDate(record.createdDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Last Updated:</span>
              <span className="text-gray-900">{formatDate(record.lastModifiedDate)}</span>
            </div>
          </div>
        </Card>

        {/* Item Information */}
        <Card title="Item Information">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Item Name:</span>
              <span className="text-gray-900">{record.inventoryItem?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Common Name:</span>
              <span className="text-gray-900">{record.inventoryItem?.commonName || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Manufacturer:</span>
              <span className="text-gray-900">{record.inventoryItem?.manufacturer || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Unit:</span>
              <span className="text-gray-900">{record.inventoryItem?.unit || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Reorder Level:</span>
              <span className="text-gray-900">{record.inventoryItem?.reorderLevel || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Cost Price:</span>
              <span className="text-gray-900">${record.inventoryItem?.costPrice || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Selling Price:</span>
              <span className="text-gray-900">${record.inventoryItem?.sellingPrice || 'N/A'}</span>
            </div>
          </div>
        </Card>

        {/* Stock Analysis */}
        <Card title="Stock Analysis">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Stock</p>
                <p className="text-2xl font-bold text-gray-900">{record.quantity}</p>
              </div>
              {record.quantity > (record.inventoryItem?.reorderLevel || 0) ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-500" />
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-600">Reorder Level</p>
                <p className="text-lg font-bold text-blue-900">{record.inventoryItem?.reorderLevel || 0}</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-600">Stock Status</p>
                <p className="text-lg font-bold text-green-900">
                  {record.quantity > (record.inventoryItem?.reorderLevel || 0) ? 'Good' : 'Low'}
                </p>
              </div>
            </div>

            {record.quantity <= (record.inventoryItem?.reorderLevel || 0) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Action Required:</strong> Reorder this item. Current stock is below the reorder level.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Expiry Information */}
        <Card title="Expiry Information">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiry Date</p>
                <p className="text-2xl font-bold text-gray-900">{formatDate(record.expiryDate)}</p>
              </div>
              <Calendar className="h-8 w-8 text-gray-500" />
            </div>

            {record.expiryDate && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Days until expiry:</span>
                  <span className="font-medium">
                    {Math.ceil((new Date(record.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))}
                  </span>
                </div>
                
                {new Date(record.expiryDate) < new Date() && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>Warning:</strong> This item has expired and should not be used.
                    </p>
                  </div>
                )}

                {isExpiringSoon() && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Notice:</strong> This item will expire within 30 days.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Actions */}
      <Card title="Actions">
        <div className="flex space-x-4">
          <Button variant="primary" onClick={() => navigate(`/admin/inventory/records/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Record
          </Button>
          <Button variant="outline" onClick={() => navigate(`/admin/inventory/items/${record.inventoryItem?.id}`)}>
            <Package className="h-4 w-4 mr-2" />
            View Item Details
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/inventory/records')}>
            Back to Records
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default InventoryRecordDetail; 