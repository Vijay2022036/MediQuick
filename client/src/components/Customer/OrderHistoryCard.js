import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, PackageIcon, ShoppingCartIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function OrderHistoryCard({ order, onViewDetails }) {
  const [expanded, setExpanded] = useState(false);
  const Navigate = useNavigate();
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-orange-100 text-orange-800',
      'shipped': 'bg-indigo-100 text-indigo-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'paid': 'bg-green-100 text-green-800',
      'refunded': 'bg-gray-100 text-gray-800',
      'failed': 'bg-red-100 text-red-800'
    };
    
    return statusConfig[status?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  // Handle items display
  const renderItems = () => {
    if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
      return <p className="text-gray-500 italic">No items information available</p>;
    }

    return (
      <div className="space-y-2 mt-2">
        <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <ShoppingCartIcon size={14} />
          Order Items
        </h4>
        
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <tr key={item._id || item.id || index}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {item.medicine?.name || item.name || 'Unknown Item'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity || 1}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                    INR {(item.price || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan="2" className="px-3 py-2 text-sm font-medium text-gray-900 text-right">Total:</td>
                <td className="px-3 py-2 text-sm font-medium text-gray-900 text-right">
                  INR {(order.totalPrice || order.totalAmount || 0).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  // Determine shipping/delivery address
  const getAddress = () => {
    const address = order.shippingAddress || order.deliveryAddress || order.address;
    
    if (!address) return 'No address information available';
    
    if (typeof address === 'string') return address;
    
    // Handle case when address is an object
    if (typeof address === 'object') {
      const addressParts = [
        address.street,
        address.city,
        address.state,
        address.zipCode || address.postalCode,
        address.country
      ].filter(Boolean);
      
      return addressParts.join(', ');
    }
    
    return 'Address format unknown';
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-shadow duration-200">
      {/* Order Header - Always visible */}
      <div className="p-4 flex items-center justify-between bg-gray-50 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="font-mono text-sm text-gray-500">
            #{order._id || order.id || 'Unknown ID'}
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status || order.paymentStatus)}`}>
              {order.status || order.paymentStatus || 'Processing'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700">{formatDate(order.orderDate || order.createdAt)}</div>
            <div className="text-sm font-bold text-gray-900">₹{(order.totalPrice || order.totalAmount || 0).toFixed(2)}</div>
          </div>
          
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-2 p-1 rounded-full hover:bg-gray-200"
            aria-label={expanded ? "Collapse details" : "Expand details"}
          >
            {expanded ? (
              <ChevronUpIcon size={20} className="text-gray-500" />
            ) : (
              <ChevronDownIcon size={20} className="text-gray-500" />
            )}
          </button>
        </div>
      </div>
      
      {/* Order Details - Expandable section */}
      {expanded && (
        <div className="p-4 bg-white space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Shipping Information */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-2">
                <PackageIcon size={14} />
                Shipping Information
              </h4>
              <div className="text-sm text-gray-700">
                <p className="mb-1">{getAddress()}</p>
                <p>
                  <span className="font-medium">Delivery Status: </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.deliveryStatus || 'processing')}`}>
                    {order.deliveryStatus || 'Processing'}
                  </span>
                </p>
              </div>
            </div>
            
            {/* Payment Information */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Information</h4>
              <div className="text-sm text-gray-700">
                <p><span className="font-medium">Method: </span>{order.paymentMethod || 'Not specified'}</p>
                <p><span className="font-medium">Status: </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.paymentStatus || 'pending')}`}>
                    {order.paymentStatus || 'Pending'}
                  </span>
                </p>
                <p className="font-medium mt-1">Total: ₹{(order.totalPrice || order.totalAmount || 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          {/* Order Items */}
          {renderItems()}
          
          {/* Action Button */}
          <div className="border-t pt-4 flex justify-end">
            <button
              onClick={() => Navigate(`/order/${order._id || order.id}`)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              View Complete Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistoryCard;