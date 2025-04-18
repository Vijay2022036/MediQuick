import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function OrderDetails() {
  const [order, setOrder] = useState({
    orderNumber: '1234567890',
    date: '2024-01-15',
    totalAmount: 500,
    status: 'Delivered',
    items: [
      { name: 'Medicine A', quantity: 2, price: 100 },
      { name: 'Medicine B', quantity: 1, price: 300 },
    ],
    deliveryAddress: '123 Main St, Anytown',
  });

  return (
    <div>
      <h1>Order Details</h1>
      <p>Order Number: {order.orderNumber}</p>
      <p>Date: {order.date}</p>
      <p>Total Amount: {order.totalAmount}</p>
      <p>Status: {order.status}</p>
      <h2>Items:</h2>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            {item.name} - Quantity: {item.quantity}, Price: {item.price}
          </li>
        ))}
      </ul>
      <p>Delivery Address: {order.deliveryAddress}</p>
    </div>
  );
}
export default OrderDetails;