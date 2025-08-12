import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  getPurchaseOrderById, 
  updatePurchaseOrder,
  approvePurchaseOrder,
  rejectPurchaseOrder 
} from '../../../services/inventory/purchaseOrder';
import { 
  getPurchaseOrderItemsByPurchaseOrder,
  createPurchaseOrderItem,
  updatePurchaseOrderItem,
  deletePurchaseOrderItem 
} from '../../../services/inventory/purchaseOrderItem';
import { getInventoryItems } from '../../../services/inventory/inventoryItem';

const PurchaseOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);
  
  const [newItem, setNewItem] = useState({
    inventoryItemId: '',
    quantity: '',
    unitPrice: '',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [poData, itemsData, inventoryData] = await Promise.all([
          getPurchaseOrderById(id),
          getPurchaseOrderItemsByPurchaseOrder(id, 0, 100),
          getInventoryItems(0, 1000)
        ]);
        
        setPurchaseOrder(poData);
        setItems(itemsData.content || []);
        setInventoryItems(inventoryData.content || []);
      } catch (err) {
        toast.error('Failed to load purchase order: ' + err.message);
        navigate('/inventory/purchase-orders');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, navigate]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    
    if (!newItem.inventoryItemId || !newItem.quantity || !newItem.unitPrice) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const itemData = {
        ...newItem,
        purchaseOrderId: parseInt(id),
        quantity: parseFloat(newItem.quantity),
        unitPrice: parseFloat(newItem.unitPrice),
        totalPrice: parseFloat(newItem.quantity) * parseFloat(newItem.unitPrice)
      };
      
      const createdItem = await createPurchaseOrderItem(itemData);
      setItems(prev => [...prev, createdItem]);
      setNewItem({ inventoryItemId: '', quantity: '', unitPrice: '', notes: '' });
      setShowAddItem(false);
      toast.success('Item added successfully');
      
      // Refresh purchase order to update totals
      const updatedPO = await getPurchaseOrderById(id);
      setPurchaseOrder(updatedPO);
    } catch (err) {
      toast.error('Failed to add item: ' + err.message);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem({
      ...item,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice.toString()
    });
    setIsEditing(true);
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    
    if (!editingItem.quantity || !editingItem.unitPrice) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const updatedData = {
        ...editingItem,
        quantity: parseFloat(editingItem.quantity),
        unitPrice: parseFloat(editingItem.unitPrice),
        totalPrice: parseFloat(editingItem.quantity) * parseFloat(editingItem.unitPrice)
      };
      
      const updatedItem = await updatePurchaseOrderItem(editingItem.id, updatedData);
      setItems(prev => prev.map(item => 
        item.id === editingItem.id ? updatedItem : item
      ));
      setEditingItem(null);
      setIsEditing(false);
      toast.success('Item updated successfully');
      
      // Refresh purchase order to update totals
      const updatedPO = await getPurchaseOrderById(id);
      setPurchaseOrder(updatedPO);
    } catch (err) {
      toast.error('Failed to update item: ' + err.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await deletePurchaseOrderItem(itemId);
      setItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Item deleted successfully');
      
      // Refresh purchase order to update totals
      const updatedPO = await getPurchaseOrderById(id);
      setPurchaseOrder(updatedPO);
    } catch (err) {
      toast.error('Failed to delete item: ' + err.message);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this purchase order?')) {
      return;
    }

    try {
      await approvePurchaseOrder(id);
      const updatedPO = await getPurchaseOrderById(id);
      setPurchaseOrder(updatedPO);
      toast.success('Purchase order approved successfully');
    } catch (err) {
      toast.error('Failed to approve purchase order: ' + err.message);
    }
  };

  const handleReject = async () => {
    const reason = window.prompt('Please enter rejection reason:');
    if (!reason) return;

    try {
      await rejectPurchaseOrder(id, { reason });
      const updatedPO = await getPurchaseOrderById(id);
      setPurchaseOrder(updatedPO);
      toast.success('Purchase order rejected successfully');
    } catch (err) {
      toast.error('Failed to reject purchase order: ' + err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInventoryItemName = (inventoryItemId) => {
    const item = inventoryItems.find(item => item.id === inventoryItemId);
    return item ? item.name : 'Unknown Item';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" role="status" aria-label="Loading"></div>
      </div>
    );
  }

  if (!purchaseOrder) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-900">Purchase Order Not Found</h2>
        <p className="text-gray-600 mt-2">The requested purchase order could not be found.</p>
        <button
          onClick={() => navigate('/inventory/purchase-orders')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Purchase Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Purchase Order #{purchaseOrder.orderNumber}
            </h1>
            <p className="text-gray-600">
              Created on {new Date(purchaseOrder.orderDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(purchaseOrder.status)}`}>
              {purchaseOrder.status?.toUpperCase()}
            </span>
            <button
              onClick={() => navigate('/inventory/purchase-orders')}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Back to List
            </button>
          </div>
        </div>

        {/* Purchase Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Information</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-500">Order Date:</span>
                <p className="text-gray-900">{new Date(purchaseOrder.orderDate).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Expected Delivery:</span>
                <p className="text-gray-900">
                  {purchaseOrder.expectedDeliveryDate 
                    ? new Date(purchaseOrder.expectedDeliveryDate).toLocaleDateString()
                    : 'Not specified'
                  }
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Priority:</span>
                <p className="text-gray-900">{purchaseOrder.priority || 'Normal'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Supplier Information</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-500">Supplier:</span>
                <p className="text-gray-900">{purchaseOrder.supplierName || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Contact:</span>
                <p className="text-gray-900">{purchaseOrder.supplierContact || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <p className="text-gray-900">{purchaseOrder.supplierEmail || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Financial Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${purchaseOrder.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">${purchaseOrder.taxAmount?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span className="text-gray-900">Total:</span>
                <span className="text-blue-600">${purchaseOrder.totalAmount?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {purchaseOrder.status?.toLowerCase() === 'pending' && (
          <div className="flex space-x-4 mt-6 pt-6 border-t">
            <button
              onClick={handleApprove}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Approve Order
            </button>
            <button
              onClick={handleReject}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Reject Order
            </button>
          </div>
        )}
      </div>

      {/* Items Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
          {purchaseOrder.status?.toLowerCase() !== 'completed' && (
            <button
              onClick={() => setShowAddItem(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Item
            </button>
          )}
        </div>

        {/* Add Item Form */}
        {showAddItem && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Item</h3>
            <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="inventoryItemId" className="block text-sm font-medium text-gray-700 mb-1">
                  Inventory Item *
                </label>
                <select
                  id="inventoryItemId"
                  value={newItem.inventoryItemId}
                  onChange={(e) => setNewItem(prev => ({ ...prev, inventoryItemId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select item</option>
                  {inventoryItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} - {item.sku}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Price *
                </label>
                <input
                  id="unitPrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={newItem.unitPrice}
                  onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-end space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddItem(false);
                    setNewItem({ inventoryItemId: '', quantity: '', unitPrice: '', notes: '' });
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                {purchaseOrder.status?.toLowerCase() !== 'completed' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No items found. Click "Add Item" to add items to this purchase order.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getInventoryItemName(item.inventoryItemId)}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {item.inventoryItemId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isEditing && editingItem?.id === item.id ? (
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={editingItem.quantity}
                          onChange={(e) => setEditingItem(prev => ({ ...prev, quantity: e.target.value }))}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isEditing && editingItem?.id === item.id ? (
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={editingItem.unitPrice}
                          onChange={(e) => setEditingItem(prev => ({ ...prev, unitPrice: e.target.value }))}
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        `$${item.unitPrice?.toFixed(2) || '0.00'}`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${(item.quantity * item.unitPrice)?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {isEditing && editingItem?.id === item.id ? (
                        <input
                          type="text"
                          value={editingItem.notes || ''}
                          onChange={(e) => setEditingItem(prev => ({ ...prev, notes: e.target.value }))}
                          className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Notes"
                        />
                      ) : (
                        item.notes || '-'
                      )}
                    </td>
                    {purchaseOrder.status?.toLowerCase() !== 'completed' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {isEditing && editingItem?.id === item.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={handleUpdateItem}
                              className="text-green-600 hover:text-green-900"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setIsEditing(false);
                                setEditingItem(null);
                              }}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Notes */}
        {purchaseOrder.notes && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Notes</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{purchaseOrder.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseOrderDetail;
