import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../common/Card';
import Button from '../common/Button';
import { 
  Package, 
  Edit, 
  ArrowLeft, 
  Calendar,
  Hash,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { 
  getGoodsReceiptItemById,
  deleteGoodsReceiptItem 
} from '../../services/inventory/goodsReceiptItem';

const GoodsReceiptItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (id) {
      fetchGoodsReceiptItem();
    }
  }, [id]);

  const fetchGoodsReceiptItem = async () => {
    try {
      setLoading(true);
      const result = await getGoodsReceiptItemById(id);
      if (result.success) {
        setItem(result.data);
      } else {
        toast.error('Failed to fetch goods receipt item');
        navigate('/admin/inventory/goods-receipt-items');
      }
    } catch (error) {
      console.error('Error fetching goods receipt item:', error);
      toast.error('Failed to fetch goods receipt item');
      navigate('/admin/inventory/goods-receipt-items');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/inventory/goods-receipt-items/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await deleteGoodsReceiptItem(id);
      if (result.success) {
        toast.success('Item deleted successfully');
        navigate('/admin/inventory/goods-receipt-items');
      } else {
        toast.error(result.message || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleBack = () => {
    navigate('/admin/inventory/goods-receipt-items');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { status: 'unknown', label: 'Unknown', icon: Clock, color: 'text-gray-600' };
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return { 
        status: 'expired', 
        label: 'Expired', 
        icon: AlertTriangle, 
        color: 'text-red-600',
        days: Math.abs(daysUntilExpiry)
      };
    }
    
    if (daysUntilExpiry <= 30) {
      return { 
        status: 'expiring-soon', 
        label: 'Expiring Soon', 
        icon: AlertTriangle, 
        color: 'text-yellow-600',
        days: daysUntilExpiry
      };
    }
    
    return { 
      status: 'valid', 
      label: 'Valid', 
      icon: CheckCircle, 
      color: 'text-green-600',
      days: daysUntilExpiry
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <div className="text-center py-8">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Item Not Found</h2>
            <p className="text-gray-600 mb-4">The requested goods receipt item could not be found.</p>
            <Button variant="primary" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const expiryStatus = getExpiryStatus(item.expiryDate);
  const StatusIcon = expiryStatus.icon;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Goods Receipt Item Details
              </h1>
              <p className="text-gray-600">
                View detailed information about this receipt item
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button
              variant="primary"
              onClick={handleEdit}
              className="flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Basic Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name
                  </label>
                  <p className="text-sm text-gray-900">
                    {item.inventoryItem?.name || 'Unknown Item'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Common Name
                  </label>
                  <p className="text-sm text-gray-900">
                    {item.inventoryItem?.commonName || 'No common name'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch Number
                  </label>
                  <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-900 font-mono">
                      {item.batchNumber}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity Received
                  </label>
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-900 font-semibold">
                      {item.quantityReceived}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expiry Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expiry Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-900">
                      {formatDate(item.expiryDate)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <div className="flex items-center space-x-2">
                    <StatusIcon className={`h-4 w-4 ${expiryStatus.color}`} />
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${expiryStatus.color} bg-opacity-10`}>
                      {expiryStatus.label}
                    </span>
                  </div>
                </div>
                
                {expiryStatus.days !== undefined && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {expiryStatus.status === 'expired' ? 'Days Since Expiry' : 'Days Until Expiry'}
                    </label>
                    <p className={`text-sm font-semibold ${
                      expiryStatus.status === 'expired' ? 'text-red-600' : 
                      expiryStatus.status === 'expiring-soon' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {expiryStatus.days} day{expiryStatus.days !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Additional Information */}
          <div className="space-y-6">
            {/* Receipt Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Receipt Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receipt ID
                  </label>
                  <p className="text-sm text-gray-900 font-mono">
                    #{item.goodsReceipt?.id || 'Unknown'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receipt Date
                  </label>
                  <p className="text-sm text-gray-900">
                    {item.goodsReceipt?.receiptDate ? formatDate(item.goodsReceipt.receiptDate) : 'Unknown'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receipt Status
                  </label>
                  <p className="text-sm text-gray-900">
                    {item.goodsReceipt?.status || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>

            {/* Inventory Item Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Item Details</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <p className="text-sm text-gray-900">
                    {item.inventoryItem?.category?.name || 'Uncategorized'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manufacturer
                  </label>
                  <p className="text-sm text-gray-900">
                    {item.inventoryItem?.manufacturer || 'Unknown'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <p className="text-sm text-gray-900">
                    {item.inventoryItem?.unit || 'Unknown'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Storage Conditions
                  </label>
                  <p className="text-sm text-gray-900">
                    {item.inventoryItem?.storageConditions || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Audit Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created Date
                  </label>
                  <p className="text-sm text-gray-900">
                    {item.createdAt ? formatDate(item.createdAt) : 'Unknown'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Modified
                  </label>
                  <p className="text-sm text-gray-900">
                    {item.updatedAt ? formatDate(item.updatedAt) : 'Unknown'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created By
                  </label>
                  <p className="text-sm text-gray-900">
                    {item.createdBy || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GoodsReceiptItemDetail;
