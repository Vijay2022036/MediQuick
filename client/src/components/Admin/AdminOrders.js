import React, { useState, useEffect } from 'react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [isDebugVisible, setIsDebugVisible] = useState(false);

    // Define available status options
    const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    // Get token from localStorage
    const getToken = () => localStorage.getItem('token');

    // Fetch orders on component mount
    useEffect(() => {
        fetchOrders();
    }, []);

    // Function to fetch all orders
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = getToken();
            
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/admin/orders`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to fetch orders (${response.status})`);
            }
            
            const data = await response.json();
            
            // Check if data is in the expected format
            const ordersArray = Array.isArray(data) ? data : 
                               (data.orders ? data.orders : []);
            
            setOrders(ordersArray);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to update order status
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            setUpdatingOrderId(orderId);
            const token = getToken();
            
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/admin/orders/status/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update order status');
            }

            // Update the order in the local state
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: newStatus } : order
            ));
            
            // Show success message
            alert(`Order status updated to ${newStatus}`);
            setError(null);
        } catch (err) {
            setError(`Error updating order: ${err.message}`);
        } finally {
            setUpdatingOrderId(null);
        }
    };

    // Render card view for mobile
    const renderOrderCard = (order, index) => {
        return (
            <div key={order._id || index} className="bg-white rounded-lg shadow mb-4 overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold truncate">
                            Order: <span className="font-mono text-xs">{order._id}</span>
                        </h3>
                        <span className="text-sm text-gray-600">
                            {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                </div>
                
                <div className="p-4">
                    <div className="grid grid-cols-1 gap-2">
                        <div>
                            <span className="text-sm text-gray-500">Customer:</span>
                            <p>{order.customer || 'N/A'}</p>
                        </div>
                        
                        <div>
                            <span className="text-sm text-gray-500">Items:</span>
                            {!order.items || !Array.isArray(order.items) ? (
                                <p>No items</p>
                            ) : (
                                <ul className="list-disc pl-5 text-sm">
                                    {order.items.map((item, i) => (
                                        <li key={i}>
                                            {item.medicine || item.medicineId || 'Unknown'} 
                                            (x{item.quantity || 0})
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        
                        <div className="flex justify-between items-center pt-2">
                            <div>
                                <span className="text-sm text-gray-500">Total:</span>
                                <p className="font-semibold">${parseFloat(order.totalPrice || 0).toFixed(2)}</p>
                            </div>
                            
                            <div>
                                <span className="text-sm text-gray-500 block mb-1">Status:</span>
                                <div className="flex items-center">
                                    <select
                                        value={order.status || 'pending'}
                                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                        disabled={updatingOrderId === order._id}
                                        className="p-1 text-sm border rounded"
                                    >
                                        {statusOptions.map((status) => (
                                            <option key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    {updatingOrderId === order._id && (
                                        <span className="text-xs text-gray-500 ml-2">Updating...</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
                <h1 className="text-xl sm:text-2xl font-bold">Admin Orders</h1>
                <button 
                    onClick={fetchOrders}
                    className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white text-sm sm:text-base rounded hover:bg-blue-700 w-full sm:w-auto"
                    disabled={loading}
                >
                    {loading ? 'Refreshing...' : 'Refresh Orders'}
                </button>
            </div>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            {/* Debug toggle button */}
            <button 
                onClick={() => setIsDebugVisible(!isDebugVisible)}
                className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm mb-2"
            >
                {isDebugVisible ? 'Hide Debug Info' : 'Show Debug Info'}
            </button>
            
            {/* Debug information */}
            {isDebugVisible && (
                <div className="mb-4 p-2 bg-gray-100 rounded">
                    <p>Debug Info:</p>
                    <p>Orders count: {orders ? orders.length : 0}</p>
                    <p>Data type: {Array.isArray(orders) ? 'Array' : typeof orders}</p>
                    <button 
                        onClick={() => console.log('Current orders state:', orders)}
                        className="px-2 py-1 bg-gray-300 text-gray-800 rounded text-sm mt-1"
                    >
                        Log Orders to Console
                    </button>
                </div>
            )}
            
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : orders && orders.length > 0 ? (
                <>
                    {/* Mobile card view */}
                    <div className="md:hidden">
                        {orders.map((order, index) => renderOrderCard(order, index))}
                    </div>
                    
                    {/* Desktop table view */}
                    <div className="hidden md:block overflow-x-auto rounded-lg shadow">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-4 border-b text-left">Order ID</th>
                                    <th className="py-2 px-4 border-b text-left">Customer</th>
                                    <th className="py-2 px-4 border-b text-left">Items</th>
                                    <th className="py-2 px-4 border-b text-left">Total</th>
                                    <th className="py-2 px-4 border-b text-left">Status</th>
                                    <th className="py-2 px-4 border-b text-left">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={order._id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="py-2 px-4 border-b">
                                            <span className="font-mono text-xs">{order._id}</span>
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {order.customer || 'N/A'}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {!order.items || !Array.isArray(order.items) ? 'No items' : (
                                                <div className="max-h-20 overflow-y-auto">
                                                    <ul className="list-disc pl-4">
                                                        {order.items.map((item, idx) => (
                                                            <li key={idx}>
                                                                {item.medicine || item.medicineId || 'Unknown'} 
                                                                (x{item.quantity || 0})
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            ${parseFloat(order.totalPrice || 0).toFixed(2)}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="flex items-center">
                                                <select
                                                    value={order.status || 'pending'}
                                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                    disabled={updatingOrderId === order._id}
                                                    className="p-1 border rounded mr-2"
                                                >
                                                    {statusOptions.map((status) => (
                                                        <option key={status} value={status}>
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                                {updatingOrderId === order._id && (
                                                    <span className="text-sm text-gray-500">Updating...</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {order.orderDate ? new Date(order.orderDate).toLocaleString() : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-center text-gray-500 py-8">No orders available.</p>
                </div>
            )}            
        </div>
    );
};

export default AdminOrders;