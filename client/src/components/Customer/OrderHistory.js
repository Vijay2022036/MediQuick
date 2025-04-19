import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../ui/Tablee';

function OrderHistory() {
  const getToken = () => localStorage.getItem('token');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        if (!token) throw new Error('No authentication token found');

        const response = await fetch(`/api/orders/user`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Failed to fetch order history: ${response.statusText}`);

        const data = await response.json();
        if (Array.isArray(data.orders)) {
          setOrders(data.orders.map(order => ({ ...order, id: order._id, totalAmount: order.totalAmount || 0 })));
        } else {
          throw new Error('Invalid data format');
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const handleViewDetails = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Order History</h1>
      
      {loading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl mb-6">
          <strong className="font-bold">Error: </strong> {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="text-center text-lg text-gray-600">
          You haven't placed any orders yet.
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <Table
          data={orders}
          columns={[
            { header: 'Order ID', accessor: 'id' },
            { header: 'Date', accessor: 'orderDate', format: (date) => new Date(date).toLocaleDateString() },
            { header: 'Total Amount', accessor: 'totalPrice', format: (price) => `INR ${price.toFixed(2)}` },
            { header: 'Payment Status', accessor: 'paymentStatus' },
            {
              header: 'Actions',
              accessor: 'actions',
              render: (row) => (
                <button
                  onClick={() => handleViewDetails(row._id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
                >
                  View Details
                </button>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}

export default OrderHistory;
