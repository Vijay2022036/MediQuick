// Cart.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import Card from '../UI/Card';
import Table from '../UI/Table';
function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = getToken();

                const response = await fetch('/api/cart', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch cart: ${response.status}`);
                }

                const data = await response.json();
                setCartItems(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching cart:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const handleRemoveItem = async (itemId) => {
        try {
            const token = getToken();
            const response = await fetch(`/api/cart/${itemId}`, { // Assuming DELETE /api/cart/:id
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setCartItems(cartItems.filter(item => item._id !== itemId));
            } else {
                console.error('Failed to remove item:', response.status);
                // Optionally show an error message to the user
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        try {
            const token = getToken();
            const response = await fetch(`/api/cart/${itemId}`, { // Assuming PUT /api/cart/:id
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            if (response.ok) {
                setCartItems(cartItems.map(item =>
                    item._id === itemId ? { ...item, quantity: newQuantity } : item
                )); // Corrected typo here
            } else {
                console.error('Failed to update quantity:', response.status);
                setError('Failed to update quantity. Please try again.');
            }
        } catch (error) { // Corrected typo here
            console.error('Error updating quantity:', error);
        }
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleCheckout = async () => {
        try {
            const token = getToken();
            const response = await fetch('/api/orders', { // Assuming POST /api/orders
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: cartItems }), // Send cart items
            });

            if (response.ok) {
                console.log('Order placed successfully!');
                setCartItems([]); // Clear the cart after successful checkout
                navigate('/order-confirmation'); // Navigate to order confirmation
            } else {
                console.error('Failed to place order:', response.status);
                setError('Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            setError('Error placing order. Please try again.');
        }
    };

    const getToken = () => {
        const token = localStorage.getItem('token');
        return token ? `Bearer ${token}` : '';
    };

    async function initiatePayment() {
        setError(null);
        try {
            const token = getToken();
            const response = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: calculateTotalPrice() * 100 }), // amount in paisa
            });
            if (!response.ok) {
                throw new Error(`Failed to create order: ${response.status}`);
            }

            const data = await response.json();
            const { order_id } = data;
            // Initialize Razorpay options
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: calculateTotalPrice() * 100,
                currency: 'INR',
                name: 'MediQuik',
                description: 'Secure Payment',
                order_id: order_id,
                handler: async function (response) {
                    // Payment verification
                    const verificationResponse = await fetch('/api/payment/verify', {
                        method: 'POST',
                        headers: {
                            'Authorization': token,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    });

                    const verificationData = await verificationResponse.json();
                    if (verificationData.success) {
                        console.log('Payment successful!');
                        setCartItems([]);
                        navigate('/order-confirmation');
                    } else {
                        console.error('Payment verification failed:', verificationData.error);
                        setError('Payment verification failed. Please try again.');
                    }
                },
                theme: { color: '#3399cc' }
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) { setError('Error in payment process: ' + error.message); }
    }

    if (loading) return <p>Loading cart...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
            <Card className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Cart</h1>
                {loading && (
                    <div className="text-center">
                        Loading cart...
                </div>
                )}
                {error && (
                    <div className="text-red-500">
                        Error: {error}
                </div>
                )}
                {!loading && !error && cartItems.length === 0 && (
                    <div className="text-gray-500">Your cart is empty.</div>
                )}
                {!loading && !error && cartItems.length > 0 && (
                    <>
                        <Table
                            columns={[
                                { Header: 'Name', accessor: 'name' },
                                {
                                    Header: 'Quantity', accessor: 'quantity', Cell: ({ row, value }) => (
                                        <div className="flex items-center">
                                            <Button onClick={() => handleQuantityChange(row.original._id, value - 1)} disabled={value <= 1} className="mr-1">-</Button>
                                            <span>{value}</span>
                                            <Button onClick={() => handleQuantityChange(row.original._id, value + 1)} className="ml-1">+</Button>
                                        </div>
                                    )
                                },
                                { Header: 'Price', accessor: 'price', Cell: ({ value }) => `$${value}` },
                                {
                                    Header: 'Actions', accessor: 'actions', Cell: ({ row }) => (
                                        <Button onClick={() => handleRemoveItem(row.original._id)} className="bg-red-500 hover:bg-red-700 text-white">
                                            Remove
                                        </Button>
                                    )
                                }
                            ]}
                            data={cartItems}
                        />
                        <div className="mt-4 text-right">
                            <p className="text-lg font-bold">Total: ${calculateTotalPrice()}</p>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button onClick={handleCheckout} className="bg-blue-500 hover:bg-blue-700 text-white mr-2">
                                Proceed to Checkout
                            </Button>
                            <Button onClick={initiatePayment} className="bg-green-500 hover:bg-green-700 text-white">
                                Pay with Razorpay
                            </Button>
                        </div>
                    </>
                )}
            </Card>
    );
}
export default Cart;