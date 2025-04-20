import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBagIcon, EyeIcon, RefreshCwIcon, ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import Table from '../ui/Tablee';
import { Skeleton } from '../ui/Skeleton';
import { Badge } from '../ui/Badge';
import OrderHistoryCard from './OrderHistoryCard';

function OrderHistory() {
  const getToken = () => localStorage.getItem('token');
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('table'); // 'table' or 'cards'
  const [sortConfig, setSortConfig] = useState({
    key: 'orderDate',
    direction: 'desc'
  });
  
  useEffect(() => {
    fetchOrderHistory();
  }, []);

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
        const formattedOrders = data.orders.map(order => ({ 
          ...order, 
          id: order._id || order.id,
          totalAmount: order.totalAmount || order.totalPrice || 0 
        }));
        
        // Sort orders based on current sortConfig
        const sortedOrders = sortOrders(formattedOrders, sortConfig);
        setOrders(sortedOrders);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    // Re-sort the orders with new configuration
    setOrders(prevOrders => sortOrders([...prevOrders], { key, direction }));
  };

  const sortOrders = (ordersArray, { key, direction }) => {
    return [...ordersArray].sort((a, b) => {
      if (key === 'orderDate') {
        const dateA = new Date(a[key] || a.createdAt || 0);
        const dateB = new Date(b[key] || b.createdAt || 0);
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (key === 'totalPrice' || key === 'totalAmount') {
        const amountA = parseFloat(a.totalPrice || a.totalAmount || 0);
        const amountB = parseFloat(b.totalPrice || b.totalAmount || 0);
        return direction === 'asc' ? amountA - amountB : amountB - amountA;
      }
      
      // Default string comparison
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return null;
    
    return sortConfig.direction === 'asc' 
      ? <ArrowUpIcon className="inline ml-1" size={14} /> 
      : <ArrowDownIcon className="inline ml-1" size={14} />;
  };

  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      'paid': { color: 'bg-green-100 text-green-800', text: 'Paid' },
      'pending': { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      'failed': { color: 'bg-red-100 text-red-800', text: 'Failed' },
      'refunded': { color: 'bg-orange-100 text-orange-800', text: 'Refunded' }
    };
    
    const defaultStatus = { color: 'bg-gray-100 text-gray-800', text: status || 'Unknown' };
    const statusConfig = statusMap[status?.toLowerCase()] || defaultStatus;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
        {statusConfig.text}
      </span>
    );
  };

  const renderTable = () => {
    return (
      <Table
        data={orders}
        columns={[
          { 
            header: () => (
              <button 
                onClick={() => handleSort('id')}
                className="flex items-center font-medium"
              >
                Order ID {getSortIcon('id')}
              </button>
            ), 
            accessor: 'id',
            render: (row) => <span className="font-mono text-sm">{row.id?.substring(0, 8)}...</span>
          },
          { 
            header: () => (
              <button 
                onClick={() => handleSort('orderDate')}
                className="flex items-center font-medium"
              >
                Date {getSortIcon('orderDate')}
              </button>
            ), 
            accessor: 'orderDate', 
            render: (row) => {
              const date = new Date(row.orderDate || row.createdAt);
              return (
                <div>
                  <div>{date.toLocaleDateString()}</div>
                  <div className="text-xs text-gray-500">{date.toLocaleTimeString()}</div>
                </div>
              );
            }
          },
          { 
            header: () => (
              <button 
                onClick={() => handleSort('totalPrice')}
                className="flex items-center font-medium"
              >
                Total Amount {getSortIcon('totalPrice')}
              </button>
            ), 
            accessor: 'totalPrice', 
            render: (row) => (
              <span className="font-medium">
                INR {(row.totalPrice || row.totalAmount || 0).toFixed(2)}
              </span>
            )
          },
          { 
            header: 'Payment Status', 
            accessor: 'paymentStatus',
            render: (row) => getPaymentStatusBadge(row.paymentStatus)
          },
          {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
              <button
                onClick={() => handleViewDetails(row.id || row._id)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
              >
                <EyeIcon size={14} />
                Details
              </button>
            ),
          },
        ]}
      />
    );
  };

  const renderCards = () => {
    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderHistoryCard
            key={order.id || order._id}
            order={order}
            onViewDetails={() => handleViewDetails(order.id || order._id)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Order History</h1>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button
            onClick={fetchOrderHistory}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
            disabled={loading}
          >
            <RefreshCwIcon size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          
          <div className="bg-gray-100 rounded-lg flex">
            <button
              onClick={() => setView('table')}
              className={`px-3 py-1.5 rounded-l-lg ${view === 'table' 
                ? 'bg-orange-600 text-white' 
                : 'text-gray-700 hover:bg-gray-200'}`}
            >
              Table
            </button>
            <button
              onClick={() => setView('cards')}
              className={`px-3 py-1.5 rounded-r-lg ${view === 'cards' 
                ? 'bg-orange-600 text-white' 
                : 'text-gray-700 hover:bg-gray-200'}`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>
      
      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6">
          <p className="font-bold mb-1">Error</p>
          <p>{error}</p>
          <button
            onClick={fetchOrderHistory}
            className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-2 text-gray-500">You haven't placed any orders yet.</p>
          <button
            onClick={() => navigate('/shop')}
            className="mt-6 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg"
          >
            Browse Products
          </button>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {view === 'table' ? renderTable() : renderCards()}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;