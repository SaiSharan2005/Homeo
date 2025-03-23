import React from 'react';
import InventoryItemForm from '../../components/inventory/InventoryItemForm';
import AdminNavbar from '../../components/navbar/AdminNavbar';

const InventoryPage = () => {
  return (
    <>
    <AdminNavbar/>
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-center text-3xl font-bold mb-6">Inventory Management</h1>
      <InventoryItemForm />
      {/* Other inventory-related components can be added here */}
    </div>
    </>

  );
};

export default InventoryPage;
