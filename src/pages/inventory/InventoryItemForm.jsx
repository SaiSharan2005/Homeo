import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { 
  Package, 
  Save, 
  X, 
  Upload, 
  Plus, 
  Trash2,
  ArrowLeft 
} from 'lucide-react';
import { 
  createInventoryItem, 
  updateInventoryItem, 
  getInventoryItemById
} from '../../services/inventory/inventoryItem';
import { getCategories } from '../../services/inventory/category';

const InventoryItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    commonName: '',
    source: '',
    potency: '',
    formulation: '',
    manufacturer: '',
    unit: '',
    costPrice: '',
    sellingPrice: '',
    reorderLevel: '',
    expiryDate: '',
    storageConditions: '',
    indications: '',
    contraindications: '',
    sideEffects: '',
    usageInstructions: '',
    regulatoryStatus: '',
    description: '',
    categoryId: ''
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchInventoryItem();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories(0, 100);
      setCategories(data.content || data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchInventoryItem = async () => {
    try {
      setLoading(true);
      const data = await getInventoryItemById(id);
      setFormData(data);
      if (data.imageUrl) {
        setImagePreview(data.imageUrl);
      }
    } catch (error) {
      toast.error('Failed to fetch inventory item');
      navigate('/admin/inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const buildPayload = () => {
    const toNumber = (val, def = 0) => {
      const n = val === '' || val === null || val === undefined ? NaN : Number(val);
      return Number.isNaN(n) ? def : n;
    };
    const toNullable = (val) => (val === '' || val === null || val === undefined ? null : val);
    return {
      // Strings
      name: (formData.name || '').trim(),
      commonName: (formData.commonName || '').trim(),
      source: (formData.source || '').trim(),
      potency: toNullable((formData.potency || '').trim()),
      formulation: toNullable((formData.formulation || '').trim()),
      description: toNullable((formData.description || '').trim()),
      manufacturer: (formData.manufacturer || '').trim(),
      unit: (formData.unit || '').trim(),
      storageConditions: toNullable((formData.storageConditions || '').trim()),
      indications: toNullable((formData.indications || '').trim()),
      contraindications: toNullable((formData.contraindications || '').trim()),
      sideEffects: toNullable((formData.sideEffects || '').trim()),
      usageInstructions: toNullable((formData.usageInstructions || '').trim()),
      regulatoryStatus: toNullable((formData.regulatoryStatus || '').trim()),
      // Numbers
      reorderLevel: toNumber(formData.reorderLevel, 0),
      costPrice: toNumber(formData.costPrice, 0),
      sellingPrice: toNumber(formData.sellingPrice, 0),
      // Dates / ids
      expiryDate: toNullable(formData.expiryDate || null),
      categoryId: formData.categoryId ? Number(formData.categoryId) : null,
    };
  };

  const validateForm = () => {
    const requiredFields = ['name', 'commonName', 'source', 'manufacturer', 'unit', 'costPrice', 'sellingPrice'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const payload = buildPayload();
      let result;
      if (id) {
        result = await updateInventoryItem(id, payload, imageFile || undefined);
        toast.success('Inventory item updated successfully');
      } else {
        result = await createInventoryItem(payload, imageFile || undefined);
        toast.success('Inventory item created successfully');
      }
      
      navigate('/admin/inventory');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
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
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? 'Edit Inventory Item' : 'Create New Inventory Item'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Basic Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Item Name *"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter item name"
                  required
                />
                <Input
                  label="Common Name *"
                  value={formData.commonName}
                  onChange={(e) => handleInputChange('commonName', e.target.value)}
                  placeholder="Enter common name"
                  required
                />
                <Input
                  label="Source *"
                  value={formData.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  placeholder="Enter source"
                  required
                />
                <Input
                  label="Manufacturer *"
                  value={formData.manufacturer}
                  onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                  placeholder="Enter manufacturer"
                  required
                />
                <Input
                  label="Potency"
                  value={formData.potency}
                  onChange={(e) => handleInputChange('potency', e.target.value)}
                  placeholder="Enter potency"
                />
                <Input
                  label="Formulation"
                  value={formData.formulation}
                  onChange={(e) => handleInputChange('formulation', e.target.value)}
                  placeholder="Enter formulation"
                />
                <Input
                  label="Unit *"
                  value={formData.unit}
                  onChange={(e) => handleInputChange('unit', e.target.value)}
                  placeholder="e.g., tablets, bottles, grams"
                  required
                />
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </Card>

            <Card title="Pricing Information">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Cost Price *"
                  type="number"
                  value={formData.costPrice}
                  onChange={(e) => handleInputChange('costPrice', e.target.value)}
                  placeholder="0.00"
                  required
                />
                <Input
                  label="Selling Price *"
                  type="number"
                  value={formData.sellingPrice}
                  onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                  placeholder="0.00"
                  required
                />
                <Input
                  label="Reorder Level"
                  type="number"
                  value={formData.reorderLevel}
                  onChange={(e) => handleInputChange('reorderLevel', e.target.value)}
                  placeholder="Minimum stock level"
                />
              </div>
            </Card>

            <Card title="Additional Details">
              <div className="space-y-4">
                <Input
                  label="Expiry Date"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                />
                <Input
                  label="Storage Conditions"
                  value={formData.storageConditions}
                  onChange={(e) => handleInputChange('storageConditions', e.target.value)}
                  placeholder="e.g., Store in a cool, dry place"
                />
                <Input
                  label="Regulatory Status"
                  value={formData.regulatoryStatus}
                  onChange={(e) => handleInputChange('regulatoryStatus', e.target.value)}
                  placeholder="e.g., Approved, Pending, etc."
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter detailed description"
                  />
                </div>
              </div>
            </Card>

            <Card title="Medical Information">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Indications
                  </label>
                  <textarea
                    value={formData.indications}
                    onChange={(e) => handleInputChange('indications', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="What this medicine is used for"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraindications
                  </label>
                  <textarea
                    value={formData.contraindications}
                    onChange={(e) => handleInputChange('contraindications', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="When this medicine should not be used"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Side Effects
                  </label>
                  <textarea
                    value={formData.sideEffects}
                    onChange={(e) => handleInputChange('sideEffects', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Possible side effects"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usage Instructions
                  </label>
                  <textarea
                    value={formData.usageInstructions}
                    onChange={(e) => handleInputChange('usageInstructions', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="How to use this medicine"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Image Upload */}
          <div className="space-y-6">
            <Card title="Item Image">
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No image uploaded</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <Card>
              <div className="space-y-3">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {id ? 'Update Item' : 'Create Item'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => navigate(-1)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InventoryItemForm; 