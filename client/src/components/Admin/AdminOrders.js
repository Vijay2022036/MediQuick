import React, { useState, useEffect } from 'react';
import Table from '../ui/Table';

const AdminOrders = () => {
    const [token] = useState(localStorage.getItem('token'));
    const [newToken, setToken] = useState(localStorage.getItem('token'));

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const getToken = () => {
        return localStorage.getItem('token');
    };
    const [error, setError] = useState(null);


    
    useEffect(() => {
        const fetchOrders = async () => {
                try {
                    const token = getToken();
                    const response = await fetch('/api/orders', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });
    
                    if (!response.ok) {
                        throw new Error('Failed to fetch orders');
                    }
                    const data = await response.json();
                    setOrders(data);
                } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = getToken();
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (error) {
            setError(error.message);
        }
    };


    const columns = [
        { Header: 'Order ID', accessor: '_id' },
        { Header: 'Customer ID', accessor: 'customer' },
        { Header: 'Pharmacy ID', accessor: 'pharmacy' },
        { 
            Header: 'Items', 
            accessor: 'items', 
            Cell: ({ value }) => value.map(item => `${item.medicineId} (x${item.quantity})`).join(', ') 
        },
        { Header: 'Total', accessor: 'totalPrice' },
        { Header: 'Status', accessor: 'status' },
        { 
            Header: 'Created At', 
            accessor: 'creationDate', 
            Cell: ({ value }) => new Date(value).toLocaleString() 
        },        
    ];

    



    if (loading) {
        return <div>Loading orders...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Admin Orders</h1>
            {orders.length > 0 ? (
                <Table data={orders} columns={columns} />
            ) : (
                <p>No orders available.</p>
            )}            
        </div>
    );
};

export default AdminOrders;