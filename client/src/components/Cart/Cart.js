import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  MapPin,
  CreditCard,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Loader,
  AlertTriangle
} from 'lucide-react';

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
  const [stockInfo, setStockInfo] = useState({});
  const [exceedsStockItems, setExceedsStockItems] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    setUser(userData ? JSON.parse(userData) : {});
    
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/cart`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (res.data.success) {
          setCartItems(res.data.cartData);
          
          // Fetch stock information for all cart items
          await fetchStockInfo(res.data.cartData);
        } else {
          setError('Failed to load cart items');
          toast.error('Failed to load cart items');
        }
      } catch (err) {
        setError('Failed to load cart items');
        toast.error('Failed to load cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Function to fetch stock information for all cart items
  const fetchStockInfo = async (items) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !items.length) return;
      
      // Get product IDs from cart items
      const productIds = items.map(item => item._id);
      
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/medicines/stock-info`,
        { medicineIds: productIds },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      
      if (res.data.success) {
        const stockData = res.data.stockInfo;
        setStockInfo(stockData);
        
        // Check if any items exceed available stock
        checkExceedsStock(items, stockData);
      }
    } catch (err) {
      console.error('Failed to fetch stock information:', err);
    }
  };

  // Function to check and mark items that exceed available stock
  const checkExceedsStock = (items, stockData) => {
    const exceedingItems = items.filter(item => {
      // Use productId instead of _id to check stock
      const availableStock = stockData[item._id.toString()] || 0;
      return item.quantity > availableStock;
    });
    
    if (exceedingItems.length > 0) {
      setExceedsStockItems(exceedingItems.map(item => item._id));
      
      // Show notification for items exceeding stock
      exceedingItems.forEach(item => {
        const availableStock = stockData[item._id.toString()] || 0;
        toast.warning(
          `${item.name} has only ${availableStock} units in stock (you have ${item.quantity} in cart)`,
          { autoClose: 5000 }
        );
      });
    } else {
      setExceedsStockItems([]);
    }
  };

  const handleQuantityChange = async (itemId, quantity) => {
    if (quantity < 1) return;
    
    // Find the current item
    const currentItem = cartItems.find(item => item._id === itemId);
    if (!currentItem) return;
    
    // Check if new quantity exceeds available stock
    const availableStock = stockInfo[currentItem._id.toString()] || 0;
    
    // Update UI immediately for better UX
    setCartItems(prev =>
      prev.map(item =>
        item._id === itemId ? { ...item, quantity } : item
      )
    );
    
    // Check if exceeding stock after UI update
    if (quantity > availableStock) {
      setExceedsStockItems(prev => 
        prev.includes(itemId) ? prev : [...prev, itemId]
      );
      
      toast.warning(
        `Only ${availableStock} units of this item are available in stock`,
        { autoClose: 3000 }
      );
    } else {
      setExceedsStockItems(prev => 
        prev.filter(id => id !== itemId)
      );
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/cart/update`,
        { itemId, quantity },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      toast.error('Failed to update item quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/cart/${itemId}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setCartItems(prev => prev.filter(item => item._id !== itemId));
      setExceedsStockItems(prev => prev.filter(id => id !== itemId));
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item from cart');
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
    // Required fields validation
    const requiredFields = ['fullName', 'addressLine1', 'city', 'state', 'zipCode', 'phone'];
    const missingFields = requiredFields.filter(field => !addressFormData[field]);
    
    if (missingFields.length > 0) {
      setAddressError('Please fill all required fields');
      toast.error('Please fill all required fields');
      return false;
    }
    
    // Phone validation
    const cleanedPhone = addressFormData.phone.replace(/[^0-9]/g, '');
    if (cleanedPhone.length !== 10) {
      setAddressError('Please enter a valid 10-digit phone number');
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    
    // ZIP code validation
    const cleanedZip = addressFormData.zipCode.replace(/[^0-9]/g, '');
    if (cleanedZip.length !== 6) {
      setAddressError('Please enter a valid 6-digit ZIP code');
      toast.error('Please enter a valid 6-digit ZIP code');
      return false;
    }

    setAddressError('');
    return true;
  };

  const handleCheckout = async () => {
    if (!validateAddress()) return;
    
    // Check if any items exceed stock before proceeding
    if (exceedsStockItems.length > 0) {
      toast.error('Please adjust quantities for items exceeding available stock before checkout', {
        position: "top-center",
        autoClose: 5000
      });
      return;
    }

    const toastId = toast.loading('Processing your order...');
    
    try {
      const token = localStorage.getItem('token');
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;
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
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (verifyRes.data.success) {
                toast.dismiss(toastId);
                toast.success('Payment successful! Your order is confirmed.', {
                  position: "top-center",
                  autoClose: 5000,
                });
                setCartItems([]);
              } else {
                toast.dismiss(toastId);
                toast.error('Payment verification failed. Please contact support.', {
                  position: "top-center"
                });
              }
            } catch (err) {
              toast.dismiss(toastId);
              toast.error('An error occurred during payment verification.', {
                position: "top-center"
              });
            }
          },
          prefill: {
            name: addressFormData.fullName || user.name,
            email: user.email,
            contact: addressFormData.phone || user.contact
          },
          theme: { color: "#3399cc" },
          modal: {
            ondismiss: () => {
              toast.dismiss(toastId);
              toast.info('Payment window closed', { autoClose: 2000 });
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.dismiss(toastId);
        toast.error('Failed to initiate checkout. Please try again.', {
          position: "top-center"
        });
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error('Error during checkout. Please try again.', {
        position: "top-center"
      });
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  const incrementQuantity = (itemId, currentQuantity) => {
    handleQuantityChange(itemId, currentQuantity + 1);
  };

  const decrementQuantity = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      handleQuantityChange(itemId, currentQuantity - 1);
    }
  };

  // Function to get the stock status for an item
  const getStockStatus = (item) => {
    // Use productId instead of _id
    if (!stockInfo[item._id.toString()]) return null;
    
    const availableStock = stockInfo[item._id.toString()];
    
    if (item.quantity > availableStock) {
      return {
        exceeds: true,
        available: availableStock
      };
    }
    
    if (availableStock <= 5) {
      return {
        exceeds: false,
        available: availableStock,
        lowStock: true
      };
    }
    
    return {
      exceeds: false,
      available: availableStock
    };
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
      <ToastContainer />
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <ShoppingCart className="mr-3 h-8 w-8 text-orange-600" />
        Your Cart
      </h1>
      
      {cartItems.length === 0 ? (
        <div className="text-gray-500 text-center py-12 flex flex-col items-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-lg">Your cart is empty.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {exceedsStockItems.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Some items in your cart exceed available stock. Please adjust quantities before checkout.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4 mb-8">
            {cartItems.map((item) => {
              const stockStatus = getStockStatus(item);
              const isExceeding = exceedsStockItems.includes(item._id);
              
              return (
                <div
                  key={item._id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between border rounded-lg p-4 hover:shadow-md transition-shadow ${
                    isExceeding ? 'border-red-300 bg-red-50' : ''
                  }`}
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
                      
                      {stockStatus && (
                        <div className="mt-1">
                          {stockStatus.exceeds ? (
                            <p className="text-xs text-red-600 font-medium flex items-center">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Only {stockStatus.available} in stock (you have {item.quantity})
                            </p>
                          ) : stockStatus.lowStock ? (
                            <p className="text-xs text-orange-600 font-medium">
                              Only {stockStatus.available} left in stock
                            </p>
                          ) : (
                            <p className="text-xs text-green-600 font-medium">
                              In stock ({stockStatus.available} available)
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center mt-4 sm:mt-0 gap-4">
                    <div className={`flex items-center border rounded-md overflow-hidden ${
                      isExceeding ? 'border-red-300' : ''
                    }`}>
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
                        className={`w-12 py-1 border-x text-center focus:outline-none ${
                          isExceeding ? 'bg-red-50 text-red-700' : ''
                        }`}
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
              );
            })}
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
                      required
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
                      required
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
                      required
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
                      required
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
                      required
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
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handleCheckout} 
            className="w-full mt-6 px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition duration-200 flex items-center justify-center disabled:opacity-50"
            disabled={cartItems.length === 0 || exceedsStockItems.length > 0}
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Proceed to Payment
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
          
          {exceedsStockItems.length > 0 && (
            <p className="text-center text-sm text-red-600 mt-2">
              Please adjust quantities for items exceeding stock before checkout
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;