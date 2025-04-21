import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  CreditCard, 
  MapPin, 
  Package, 
  ShoppingBag, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  XCircle,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';

function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication required. Please login to view order details.');
        }
        
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/orders/${orderId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.status === 401) {
          throw new Error('Your session has expired. Please login again.');
        }
        
        if (response.status === 404) {
          throw new Error('Order not found. Please check the order number and try again.');
        }
        
        if (!response.ok) {
          throw new Error(`Failed to retrieve order details (${response.status})`);
        }
        
        const data = await response.json();
        
        if (!data || !data.order) {
          throw new Error('Invalid data received from server');
        }
        
        setOrder(data.order);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-700">Error</h3>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">Order not found. Please check the order number and try again.</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'pending':
        return <Clock className="h-4 w-4 mr-1" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-4xl mx-auto my-8">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-5 sm:px-6">
        <div className="flex items-center">
          <ShoppingBag className="h-6 w-6 text-gray-500 mr-2" />
          <div>
            <h1 className="text-lg font-medium text-gray-900">Order Details</h1>
            <p className="mt-1 text-sm text-gray-500">Order #{order._id}</p>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-medium text-gray-500 flex items-center">
              <Package className="h-4 w-4 mr-1 text-gray-400" />
              Order Information
            </h2>
            <div className="mt-3 border-t border-gray-200">
              <dl className="divide-y divide-gray-200">
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    Order Date
                  </dt>
                  <dd className="text-sm text-gray-900">{formatDate(order.orderDate)}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <CreditCard className="h-4 w-4 mr-1 text-gray-400" />
                    Total Amount
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">₹{order.totalPrice.toFixed(2)}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    Status
                  </dt>
                  <dd className="text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                      {getStatusIcon(order.paymentStatus)}
                      {order.paymentStatus}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          <div>
            <h2 className="text-sm font-medium text-gray-500 flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
              Delivery Address
            </h2>
            <div className="mt-3 text-sm text-gray-900 border-t border-gray-200 pt-3">
              <p className="whitespace-pre-line">
                <strong>{order.deliveryAddress.fullName || 'N/A'}</strong><br />
                {order.deliveryAddress.addressLine1}<br />
                {order.deliveryAddress.addressLine2 && `${order.deliveryAddress.addressLine2}\n`}
                {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.zipCode}<br />
                Phone: {order.deliveryAddress.phone}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-sm font-medium text-gray-500 flex items-center">
            <Package className="h-4 w-4 mr-1 text-gray-400" />
            Order Items
          </h2>
          <div className="mt-3 border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img 
                            src={`${item.medicine.image}`} 
                            alt={item.medicine.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        to={`/medicines/${item.medicine._id}`}
                        className="text-blue-600 hover:text-blue-900 font-medium flex items-center"
                      >
                        {item.medicine.name}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{item.medicine.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{(item.quantity * item.medicine.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan="4" className="px-6 py-4 text-right text-sm font-medium text-gray-900">Total</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{order.totalPrice.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <Link
            to="/order-history"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;