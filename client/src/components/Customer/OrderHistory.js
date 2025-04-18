import React, { useState, useEffect } from 'react';
import Table from '../ui/Table';

function OrderHistory() {
  const getToken = () => {
    return localStorage.getItem('token');
  };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchOrderHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('/api/orders', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch order history: ${response.statusText}`);
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Order History</h1>
        {loading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong> {error}
          </div>
        )}
        {!loading && !error && (
          <Table
            data={orders}
            columns={[
              { header: 'Order Number', accessor: '_id' },
              { header: 'Date', accessor: 'creationDate', format: (date) => new Date(date).toLocaleDateString() },
              { header: 'Total Amount', accessor: 'totalPrice', format: (price) => `$${price}` },
              { header: 'Status', accessor: 'status' },
            ]}
          />
        )}
      </div>
    );
  }

  export default OrderHistory;