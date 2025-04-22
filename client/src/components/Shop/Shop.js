import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Shop() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [cartAnimation, setCartAnimation] = useState(null);
  const navigate = useNavigate();

  // Fetch medicines
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/medicines/`,
          { withCredentials: true }
        );
        setMedicines(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load products');
        toast.error('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle search input change
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // Handle quantity change
  const handleQuantityChange = (id, value) => {
    const qty = Math.max(1, parseInt(value) || 1);
    setQuantities(prev => ({ ...prev, [id]: qty }));
  };

  // Add to cart handler with animation
  const handleCart = async (medicineId) => {
    const quantity = quantities[medicineId] || 1;
    const medicine = medicines.find(med => med._id === medicineId);
    
    if (quantity > medicine.stockQuantity) {
      toast.error('Quantity exceeds available stock!', {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    
    setCartAnimation(medicineId);
    
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/cart/add`,
        { itemId: medicineId, quantity },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true
        }
      );
      
        toast.success(`${quantity} ${medicine.name} added to cart`, {
          position: "top-center",
          autoClose: 3000,
        });
      
      // Reset animation after completion
      setTimeout(() => {
        setCartAnimation(null);
      }, 1000);
      
    } catch (error) {
      setCartAnimation(null);
      if (error.response && error.response.status === 401) {
        toast.error('Please login to add items to cart', {
          position: "top-center",
          autoClose: 3000,
        });
        navigate('/customer/login');
      } else {
        toast.error('Only customers can ADD to cart.', {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  // Filter medicines based on debounced search term
  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(debouncedTerm.toLowerCase())
  );

  // Display star rating
  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<AiFillStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<AiOutlineStar key={i} className="text-yellow-400" />);
      }
    }
    
    return <div className="flex justify-center">{stars}</div>;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="mx-auto w-full max-w-7xl">
        <header className="text-center py-10">
          <h1 className="text-4xl font-bold text-gray-800">MediQuick</h1>
          <p className="text-lg mt-2 text-gray-600">Your trusted source for quality medicines</p>
          <div className="relative mt-8 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search for medicines..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-5 py-3 pl-12 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <FiSearch className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10 text-lg bg-white rounded-lg shadow-sm mx-6 p-6">
            <p>Error: {error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center px-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-700">
                {filteredMedicines.length} Products
              </h2>
              <div className="flex gap-2">
                {/* Add sorting options here if needed */}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 pb-16">
              {filteredMedicines.length > 0 ? (
                filteredMedicines.map((medicine) => (
                  <div
                    key={medicine._id}
                    className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col"
                  >
                    <Link to={`/medicines/${medicine._id}`} className="block relative">
                      <div className="w-full h-48 flex items-center justify-center p-6 bg-white relative overflow-hidden">
                        <img
                          src={medicine.image || '/placeholder.png'}
                          alt={medicine.name}
                          className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-110"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder.png';
                          }}
                        />
                      </div>
                      {medicine.stockQuantity <= 5 && medicine.stockQuantity > 0 && (
                        <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                          Low Stock
                        </div>
                      )}
                    </Link>
                    
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <Link to={`/medicines/${medicine._id}`}>
                          <h2 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition line-clamp-2 h-12 mb-1">
                            {medicine.name}
                          </h2>
                        </Link>
                        
                        <div className="flex items-center justify-center mb-2">
                          <StarRating rating={medicine._id.length % 2 === 0 ? 4.5 : 4} />
                          <span className="text-xs text-gray-500 ml-1">
                            ({Math.floor(Math.random() * 100) + 20})
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-1">
                          {medicine.category || 'General Medicine'}
                        </p>
                        
                        <p className="text-lg font-semibold text-blue-600 mt-2">₹{medicine.price}</p>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1">
                          <input
                            type="number"
                            id={`qty-${medicine._id}`}
                            min="1"
                            max={medicine.stockQuantity}
                            value={quantities[medicine._id] || 1}
                            onChange={(e) => handleQuantityChange(medicine._id, e.target.value)}
                            className="w-full px-2 py-1.5 text-center border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <button
                          onClick={() => handleCart(medicine._id)}
                          disabled={medicine.stockQuantity === 0}
                          className={`flex-1 px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                            medicine.stockQuantity === 0
                              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                              : cartAnimation === medicine._id
                              ? 'bg-green-600 text-white'
                              : 'bg-orange-600 hover:bg-orange-700 text-white'
                          }`}
                        >
                          {cartAnimation === medicine._id ? (
                            'Added!'
                          ) : medicine.stockQuantity === 0 ? (
                            'Out of Stock'
                          ) : (
                            <>
                              <FiShoppingCart size={16} />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-white rounded-lg shadow-sm p-10 text-center">
                  <img 
                    src="/no-results.svg" 
                    alt="No results found" 
                    className="w-32 h-32 mx-auto mb-4 opacity-60"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                  <p className="text-gray-500 text-lg font-medium">
                    No matching products found.
                  </p>
                  <p className="text-gray-400 mt-2">
                    Try adjusting your search term or browse our categories.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}