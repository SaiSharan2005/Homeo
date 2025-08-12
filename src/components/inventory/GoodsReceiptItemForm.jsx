import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import { 
  Package, 
  Save, 
  X, 
  Plus, 
  Calendar,
  Hash
} from 'lucide-react';
import { 
  createGoodsReceiptItem, 
  updateGoodsReceiptItem, 
  getGoodsReceiptItemById 
} from '../../services/inventory/goodsReceiptItem';
import { getInventoryItems } from '../../services/inventory/inventoryItem';

const GoodsReceiptItemForm = () => {
  const { id, receiptId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    inventoryItemId: '',
    batchNumber: '',
    expiryDate: '',
    quantityReceived: ''
  });

  const [inventoryItems, setInventoryItems] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchInventoryItems();
    if (id) {
      fetchGoodsReceiptItem();
    }
  }, [id]);

  const fetchInventoryItems = async () => {
    try {
      const data = await getInventoryItems(0, 100);
      setInventoryItems(data.content || data);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      toast.error('Failed to fetch inventory items');
    }
  };

  const fetchGoodsReceiptItem = async () => {
    try {
      setLoading(true);
      const result = await getGoodsReceiptItemById(id);
      if (result.success) {
        setFormData({
          inventoryItemId: result.data.inventoryItemId || '',
          batchNumber: result.data.batchNumber || '',
          expiryDate: result.data.expiryDate || '',
          quantityReceived: result.data.quantityReceived || ''
        });
      } else {
        toast.error('Failed to fetch goods receipt item');
        navigate('/admin/inventory/goods-receipt-items');
      }
    } catch (error) {
      toast.error('Failed to fetch goods receipt item');
      navigate('/admin/inventory/goods-receipt-items');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.inventoryItemId) {
      newErrors.inventoryItemId = 'Inventory item is required';
    }
    
    if (!formData.batchNumber?.trim()) {
      newErrors.batchNumber = 'Batch number is required';
    }
    
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      const expiryDate = new Date(formData.expiryDate);
      const today = new Date();
      if (expiryDate <= today) {
        newErrors.expiryDate = 'Expiry date must be in the future';
      }
    }
    
    if (!formData.quantityReceived || formData.quantityReceived <= 0) {
      newErrors.quantityReceived = 'Quantity must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      
      const submitData = {
        ...formData,
        quantityReceived: parseInt(formData.quantityReceived)
      };
      
      let result;
      if (id) {
        result = await updateGoodsReceiptItem(id, submitData);
      } else {
        // If receiptId is provided, add it to the data
        if (receiptId) {
          submitData.goodsReceiptId = receiptId;
        }
        result = await createGoodsReceiptItem(submitData);
      }
      
      if (result.success) {
        toast.success(id ? 'Goods receipt item updated successfully' : 'Goods receipt item created successfully');
        navigate('/admin/inventory/goods-receipt-items');
      } else {
        toast.error(result.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving goods receipt item:', error);
      toast.error('Failed to save goods receipt item');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/inventory/goods-receipt-items');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {id ? 'Edit' : 'Create'} Goods Receipt Item
              </h1>
              <p className="text-gray-600">
                {id ? 'Update' : 'Add'} a new item to the goods receipt
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inventory Item Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inventory Item <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.inventoryItemId}
                onChange={(e) => handleInputChange('inventoryItemId', e.target.value)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
                  errors.inventoryItemId 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                disabled={saving}
              >
                <option value="">Select an inventory item</option>
                {inventoryItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} - {item.commonName}
                  </option>
                ))}
              </select>
              {errors.inventoryItemId && (
                <p className="mt-1 text-sm text-red-600">{errors.inventoryItemId}</p>
              )}
            </div>

            {/* Batch Number */}
            <div>
              <Input
                label="Batch Number"
                value={formData.batchNumber}
                onChange={(e) => handleInputChange('batchNumber', e.target.value)}
                placeholder="Enter batch number"
                required
                error={errors.batchNumber}
                leftIcon={<Hash className="h-4 w-4 text-gray-400" />}
                disabled={saving}
              />
            </div>

            {/* Expiry Date */}
            <div>
              <Input
                type="date"
                label="Expiry Date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                required
                error={errors.expiryDate}
                leftIcon={<Calendar className="h-4 w-4 text-gray-400" />}
                disabled={saving}
              />
            </div>

            {/* Quantity Received */}
            <div>
              <Input
                type="number"
                label="Quantity Received"
                value={formData.quantityReceived}
                onChange={(e) => handleInputChange('quantityReceived', e.target.value)}
                placeholder="Enter quantity"
                min="1"
                required
                error={errors.quantityReceived}
                leftIcon={<Package className="h-4 w-4 text-gray-400" />}
                disabled={saving}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={saving}
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              {id ? 'Update' : 'Create'} Item
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default GoodsReceiptItemForm;
