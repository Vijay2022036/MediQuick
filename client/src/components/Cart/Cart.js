import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingCart, Plus, Minus, Trash2, MapPin, CreditCard, ArrowRight, ChevronDown, ChevronUp, X, Check, Loader } from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [addressError, setAddressError] = useState('');

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')) || {});
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

  const handleAddressInput = (e) => {
    const { name, value } = e.target;
    setAddressFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateAddress = () => {
    // Basic validation
    if (!addressFormData.fullName || !addressFormData.addressLine1 || 
        !addressFormData.city || !addressFormData.state || 
        !addressFormData.zipCode || !addressFormData.phone) {
      setAddressError('Please fill all required fields');
      return false;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(addressFormData.phone.replace(/[^0-9]/g, ''))) {
      setAddressError('Please enter a valid phone number');
      return false;
    }
    
    // ZIP code validation (basic)
    const zipRegex = /^\d{6}$/;
    if (!zipRegex.test(addressFormData.zipCode.replace(/[^0-9]/g, ''))) {
      setAddressError('Please enter a valid 6-digit ZIP code');
      return false;
    }

    setAddressError('');
    return true;
  };

  const handleCheckout = async () => {
    if (!validateAddress()) {
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/payment/create-order`,
        { 
          cartItems,
          deliveryAddress: addressFormData
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await res.data;
      if (data.success) {
        const order = data.order;
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "Pharmacy App",
          description: "Medicine Purchase",
          order_id: order.id,

          handler: async function (response) {
            try {
              const verifyRes = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/payment/verify`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  deliveryAddress: addressFormData
                },
                {
                  withCredentials: true,
                  headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                }
              );

              if (verifyRes.data.success) {
                console.log("Payment verified successfully:", verifyRes.data);
                alert("Payment successful and verified!");
              } else {
                console.error("Payment verification failed:", verifyRes.data);
                alert("Payment verification failed. Please contact support.");
              }
            } catch (err) {
              console.error("Error during payment verification:", err);
              alert("An error occurred during payment verification.");
            }
          },
          prefill: {
            name: addressFormData.fullName || user.name,
            email: user.email,
            contact: addressFormData.phone || user.contact
          },
          theme: { color: "#3399cc" }
        };
  
        const rzp = new window.Razorpay(options);
        rzp.open();
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

  const incrementQuantity = (itemId, currentQuantity) => {
    handleQuantityChange(itemId, currentQuantity + 1);
  };

  const decrementQuantity = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      handleQuantityChange(itemId, currentQuantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-10 w-10 text-orange-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold mt-6">
        <X className="inline-block mr-2 h-6 w-6" />
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 sm:p-8 bg-white rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <ShoppingCart className="mr-3 h-8 w-8 text-orange-600" />
        Your Cart
      </h1>
      {Object.values(cartItems).length === 0 ? (
        <div className="text-gray-500 text-center py-12 flex flex-col items-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-lg">Your cart is empty.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4 mb-8">
            {Object.values(cartItems).map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image || '/placeholder.png'}
                    alt={item.name}
                    className="w-20 h-20 object-contain border rounded-md"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-700">{item.name}</h2>
                    <p className="text-gray-500">₹{item.price}</p>
                  </div>
                </div>

                <div className="flex items-center mt-4 sm:mt-0 gap-4">
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <button 
                      onClick={() => decrementQuantity(item._id, item.quantity)}
                      className="px-2 py-1 hover:bg-gray-100"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4 text-gray-600" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value, 10))}
                      className="w-12 py-1 border-x text-center focus:outline-none"
                    />
                    <button 
                      onClick={() => incrementQuantity(item._id, item.quantity)}
                      className="px-2 py-1 hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-red-600 p-1 rounded-full hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center font-semibold text-lg mb-2">
              <span>Subtotal:</span>
              <span>₹{calculateTotal()}</span>
            </div>
            <div className="text-sm text-gray-500 mb-4">
              Shipping and taxes will be calculated at checkout
            </div>
          </div>

          <div className="bg-white border rounded-lg overflow-hidden">
            <div 
              className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
              onClick={() => setShowAddressForm(!showAddressForm)}
            >
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-orange-600 mr-2" />
                <h3 className="font-medium">Delivery Address</h3>
              </div>
              {showAddressForm ? 
                <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                <ChevronDown className="h-5 w-5 text-gray-500" />
              }
            </div>

            {showAddressForm && (
              <div className="p-4">
                {addressError && (
                  <div className="text-red-500 mb-4 p-2 bg-red-50 rounded flex items-center">
                    <X className="h-4 w-4 mr-2" />
                    {addressError}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={addressFormData.fullName}
                      onChange={handleAddressInput}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={addressFormData.phone}
                      onChange={handleAddressInput}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="10-digit number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={addressFormData.addressLine1}
                      onChange={handleAddressInput}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Street address"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={addressFormData.addressLine2}
                      onChange={handleAddressInput}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={addressFormData.city}
                      onChange={handleAddressInput}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={addressFormData.state}
                      onChange={handleAddressInput}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={addressFormData.zipCode}
                      onChange={handleAddressInput}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="6-digit code"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handleCheckout} 
            className="w-full mt-6 px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition duration-200 flex items-center justify-center"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Proceed to Payment
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;