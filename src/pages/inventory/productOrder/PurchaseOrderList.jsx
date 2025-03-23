import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../../../components/navbar/AdminNavbar';

const PurchaseOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + '/api/purchase-orders'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch purchase orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders by supplier ID or status or any field if needed (example: filtering by status)
  const filteredOrders = orders.filter((order) =>
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Purchase Orders</h1>
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Search by status..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 p-2 rounded w-1/3"
          />
        </div>
        {isLoading ? (
          <div className="text-center">Loading purchase orders...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border">Order ID</th>
                  <th className="py-2 px-4 border">Order Date</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Total Amount</th>
                  <th className="py-2 px-4 border">Supplier ID</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border text-center">{order.orderId}</td>
                    <td className="py-2 px-4 border text-center">
                      {new Date(order.orderDate).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border text-center">{order.status}</td>
                    <td className="py-2 px-4 border text-center">{order.totalAmount}</td>
                    <td className="py-2 px-4 border text-center">{order.supplier ? order.supplier.id : 'N/A'}</td>
                    <td className="py-2 px-4 border text-center">
                      <Link
                        to={`/purchase-orders/${order.orderId}`}
                        className="text-blue-500 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {currentOrders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default PurchaseOrderList;
