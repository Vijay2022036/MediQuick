import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

// ✅ Cart.js - Updated rendering logic
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/cart`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        });
        if (res.data.success) {
          setCartItems(res.data.cartData);
        } else {
          setError('Failed to load cart items');
        }
      } catch (err) {
        setError('Failed to load cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/cart/update`,
        { itemId, quantity },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === itemId
            ? { ...item, quantity }
            : item
        )
      );
    } catch (err) {
      setError('Failed to update item quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/cart/${itemId}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setCartItems((prev) => prev.filter(item => item._id !== itemId));
    } catch (err) {
      setError('Failed to remove item from cart');
    }
  };
  const handleCheckout = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/cart/checkout`,
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      if (res.data.success) {
        const order = res.data.order;
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID, // The Razorpay key ID
          amount: order.amount, // amount in paise (100 INR = 10000 paise)
          currency: order.currency,
          name: "Pharmacy App",
          description: "Medicine Purchase",
          order_id: order.id, // order ID from Razorpay API
          handler: function (response) {
            // Success handler: When payment is successful
            console.log("Payment Success:", response);
            alert("Payment successful!");
          },
          prefill: {
            name: "Customer",
            email: "customer@example.com", // Use real user details here
            contact: "9999999999" // Use real user contact here
          },
          theme: { color: "#3399cc" }
        };
  
        const rzp = new window.Razorpay(options); // Create a Razorpay instance
        rzp.open(); // Open the Razorpay checkout modal
      } else {
        alert("Failed to initiate checkout");
      }
    } catch (err) {
      console.error(err);
      alert("Error during checkout");
    }
  };
  
  const calculateTotal = () =>
    Object.values(cartItems).reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold mt-6">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 sm:p-8 bg-white rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
      {Object.values(cartItems).length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {Object.values(cartItems).map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image || '/placeholder.png'}
                  alt={item.name}
                  className="w-20 h-20 object-contain border rounded-md"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-700">{item.name}</h2>
                  <p className="text-gray-500">Price: ₹{item.price}</p>
                </div>
              </div>

              <div className="flex items-center mt-4 sm:mt-0 gap-4">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item._id, parseInt(e.target.value, 10))
                  }
                  className="w-16 px-2 py-1 border rounded-md text-center"
                />
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="text-red-600 hover:underline text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center mt-6 font-semibold text-lg">
            <span>Total:</span>
            <span>₹{calculateTotal()}</span>
          </div>
          <button onClick={handleCheckout} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
