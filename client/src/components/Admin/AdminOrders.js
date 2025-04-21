import React, { useState, useEffect } from 'react';
import Table from '../ui/Table';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

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
                body: ({ status: newStatus }),
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

    // Define table columns
    const columns = [
        { 
            Header: 'Order ID', 
            accessor: '_id',
            Cell: ({ value }) => <span className="font-mono text-xs">{value}</span>
        },
        { 
            Header: 'Customer', 
            accessor: 'customer',
            Cell: ({ value }) => <span>{value || 'N/A'}</span>
        },
        { 
            Header: 'Items', 
            accessor: 'items',
            Cell: ({ value }) => {
                if (!value || !Array.isArray(value)) return 'No items';
                return (
                    <div className="max-h-20 overflow-y-auto">
                        <ul className="list-disc pl-4">
                            {value.map((item, index) => (
                                <li key={index}>
                                    {item.medicine || item.medicineId || 'Unknown'} 
                                    (x{item.quantity || 0})
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            }
        },
        { 
            Header: 'Total', 
            accessor: 'totalPrice',
            Cell: ({ value }) => `${parseFloat(value || 0).toFixed(2)}`
        },
        { 
            Header: 'Status', 
            accessor: 'status',
            Cell: ({ row }) => {
                const order = row.original || {};
                return (
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
                );
            }
        },
        { 
            Header: 'Created At', 
            accessor: 'orderDate', 
            Cell: ({ value }) => value ? new Date(value).toLocaleString() : 'N/A'
        },
    ];

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Orders</h1>
                <button 
                    onClick={fetchOrders}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
            
            {/* Debug information */}
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
            
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : orders && orders.length > 0 ? (
                <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr className="bg-gray-100">
                                {columns.map(col => (
                                    <th key={col.accessor} className="py-2 px-4 border-b text-left">
                                        {col.Header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={order._id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    {columns.map(col => (
                                        <td key={`${order._id}-${col.accessor}`} className="py-2 px-4 border-b">
                                            {col.Cell ? 
                                                col.Cell({ value: order[col.accessor], row: { original: order } }) : 
                                                (order[col.accessor]?.toString() || 'N/A')}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>
                    <p className="text-center text-gray-500 py-8">No orders available.</p>
                    {/* Fallback simple table */}
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold mb-2">Fallback Display</h2>
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    {columns.map(col => (
                                        <th key={col.accessor} className="py-2 px-4 border-b">
                                            {col.Header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(orders) && orders.map((order, index) => (
                                    <tr key={index}>
                                        {columns.map(col => (
                                            <td key={col.accessor} className="py-2 px-4 border-b">
                                                {typeof order[col.accessor] === 'object' ? 
                                                  JSON.stringify(order[col.accessor]) : 
                                                  String(order[col.accessor] || '')}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}            
        </div>
    );
};

export default AdminOrders;