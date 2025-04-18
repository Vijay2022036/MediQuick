import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function OrderDetails() {
  const { orderId } = useParams(); // Retrieve the order ID from the URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const getToken = () => {
    return localStorage.getItem('token');
  };

  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }
        let res = await fetch(`/api/orders`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch order details');
        }
        res = await res.json();
        const orders = res.orders;
        let response = null;
        for (let i = 0; i < orders.length; i++) {
          if (orders[i]._id === orderId) {
            response = orders[i];
            break;
          }
        }
        if (!response) {
          throw new Error('Order not found');
        }
        setOrder(response);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl mb-6">
        <strong className="font-bold">Error: </strong> {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center text-lg text-gray-600">
        Order not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Order Details</h1>
      
      <p><strong>Order Number:</strong> {order._id}</p>
      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
      <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
      <p><strong>Status:</strong> {order.paymentStatus}</p>
      
      <h2 className="mt-4 text-2xl font-semibold">Items:</h2>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            {item.medicine.name} - Quantity: {item.quantity}, Price: ${item.medicine.price.toFixed(2)}
          </li>
        ))}
      </ul>
      
      <p className="mt-4"><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
    </div>
  );
}

export default OrderDetails;
