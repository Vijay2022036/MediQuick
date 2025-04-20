import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiCheck, FiShare2, FiHeart, FiThumbsUp } from 'react-icons/fi';
import { AiFillStar, AiOutlineStar, AiOutlineClockCircle } from 'react-icons/ai';
import axios from 'axios';

// Dummy review data
const dummyReviews = [
  {
    id: 1,
    user: 'John Doe',
    avatar: '/avatars/user1.jpg',
    rating: 5,
    date: '2024-04-05',
    title: 'Excellent product, quick relief',
    content: 'I have been using this medicine for a month now and have seen significant improvement. The quality is top-notch and the price is reasonable. Would definitely recommend to others with similar conditions.',
    helpful: 24,
    verified: true,
  },
  {
    id: 2,
    user: 'Sarah Johnson',
    avatar: '/avatars/user2.jpg',
    rating: 4,
    date: '2024-03-18',
    title: 'Works well but took time',
    content: 'This medication works as advertised, but it took about two weeks before I started noticing the effects. The packaging is good and delivery was prompt. Overall satisfied with the purchase.',
    helpful: 9,
    verified: true
  },
  {
    id: 3,
    user: 'Michael Chen',
    avatar: '/avatars/user3.jpg',
    rating: 5,
    date: '2024-02-22',
    title: 'Best medicine I have used so far',
    content: 'After trying several alternatives, this is the only one that provided consistent results without side effects. The medicine is easy to take and the effects last longer than expected. Great value for money.',
    helpful: 31,
    verified: true
  },
  {
    id: 4,
    user: 'Amanda Garcia',
    avatar: '/avatars/user4.jpg',
    rating: 3,
    date: '2024-03-30',
    title: 'Good but expensive',
    content: 'The medicine does what it promises, but I feel the price is a bit on the higher side compared to similar products. That said, the quality seems superior, so I guess you get what you pay for.',
    helpful: 5,
    verified: false
  }
];

// Rating distribution data
const getRatingDistribution = () => {
  return {
    5: 67,
    4: 21,
    3: 8,
    2: 3,
    1: 1
  };
};

function MedicineDetail() {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [expandedReviews, setExpandedReviews] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [helpfulReviews, setHelpfulReviews] = useState({});
  
  // Calculate overall rating from dummy data
  const calculateOverallRating = () => {
    const total = dummyReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / dummyReviews.length).toFixed(1);
  };
  
  const overallRating = calculateOverallRating();
  const ratingDistribution = getRatingDistribution();

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/medicines/${id}`
        );
        setMedicine(response.data);
        
        // Fetch similar products (same category)
        try {
          const allProducts = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/medicines/`
          );
          
          const similar = allProducts.data
            .filter(med => med._id !== id && med.category === response.data.category)
            .slice(0, 4);
            
          setSimilarProducts(similar);
        } catch (err) {
          console.error("Error fetching similar products:", err);
        }
      } catch (err) {
        setError('Error fetching medicine details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMedicine();
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async () => {
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/cart/add`,
        { itemId: id, quantity },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );
      
      if (response.data.success) {
        showNotification('Added to cart successfully!', 'success');
      } else {
        showNotification('Failed to add to cart.', 'error');
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showNotification('Failed to add to cart.', 'error');
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const markReviewHelpful = (reviewId) => {
    setHelpfulReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };
  
  const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-5 p-4 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    } text-white transition-opacity duration-500`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  };
  
  // Star Rating component
  const StarRating = ({ rating, size = 'md' }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    const starSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<AiFillStar key={i} size={starSize} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<AiFillStar key={i} size={starSize} className="text-yellow-400" />);
      } else {
        stars.push(<AiOutlineStar key={i} size={starSize} className="text-yellow-400" />);
      }
    }
    
    return <div className="flex">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="text-red-500 font-semibold text-lg">
          {error}
        </div>
        <Link to="/shop" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Return to Shop
        </Link>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="text-gray-500 font-medium text-lg">
          Medicine not found.
        </div>
        <Link to="/shop" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Breadcrumb */}
        <nav className="py-4 flex items-center text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/shop" className="hover:text-blue-600 transition">Shop</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-800 font-medium">{medicine.name}</span>
        </nav>
        
        {/* Product Detail Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-lg border border-gray-200 p-8 flex items-center justify-center h-96 w-full">
                <img
                  src={medicine.image || '/placeholder.png'}
                  alt={medicine.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder.png';
                  }}
                />
              </div>
              
              <div className="flex justify-center mt-6 gap-4">
                <button className="p-3 rounded-lg border border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition">
                  <FiShare2 size={20} className="text-blue-600" />
                </button>
                <button className="p-3 rounded-lg border border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition">
                  <FiHeart size={20} className="text-blue-600" />
                </button>
              </div>
            </div>
            
            {/* Product Details */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-gray-800">{medicine.name}</h1>
                  {medicine.stockQuantity > 0 ? (
                    <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">In Stock</span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm font-medium">Out of Stock</span>
                  )}
                </div>
                
                <div className="flex items-center mt-3">
                  <StarRating rating={overallRating} />
                  <span className="ml-2 text-lg font-semibold text-gray-700">{overallRating}</span>
                  <span className="mx-2 text-gray-400">|</span>
                  <div className="text-blue-600 text-sm">
                    {dummyReviews.length} Reviews
                  </div>
                </div>
                
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-blue-600">₹{medicine.price}</h2>
                  <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center text-sm">
                    <span className="bg-blue-100 p-1.5 rounded-full mr-3 flex-shrink-0">
                      <FiCheck className="text-blue-600" size={14} />
                    </span>
                    <span>Free shipping on orders above ₹499</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <span className="bg-blue-100 p-1.5 rounded-full mr-3 flex-shrink-0">
                      <FiCheck className="text-blue-600" size={14} />
                    </span>
                    <span>100% authentic products</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <span className="bg-blue-100 p-1.5 rounded-full mr-3 flex-shrink-0">
                      <AiOutlineClockCircle className="text-blue-600" size={14} />
                    </span>
                    <span>Delivery in 1-3 business days</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <span className="bg-blue-100 p-1.5 rounded-full mr-3 flex-shrink-0">
                      <FiCheck className="text-blue-600" size={14} />
                    </span>
                    <span>24/7 Customer Support</span>
                  </div>
                </div>
                
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="font-semibold text-gray-700">Category:</div>
                    <div className="col-span-2 text-gray-600">{medicine.category || 'General Medicine'}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                    <div className="font-semibold text-gray-700">Batch No:</div>
                    <div className="col-span-2 text-gray-600">{medicine.batchNumber}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                    <div className="font-semibold text-gray-700">Expiry Date:</div>
                    <div className="col-span-2 text-gray-600">{new Date(medicine.expiryDate).toLocaleDateString()}</div>
                  </div>
                  
                  {medicine.stockQuantity > 0 && (
                    <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                      <div className="font-semibold text-gray-700">Availability:</div>
                      <div className="col-span-2 text-gray-600">
                        {medicine.stockQuantity} units available
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-32">
                  <div className="flex h-12">
                    <button 
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="px-4 border border-gray-300 bg-gray-50 rounded-l-lg hover:bg-gray-100 transition flex items-center justify-center"
                    >
                      <span className="text-lg font-medium text-gray-700">-</span>
                    </button>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      max={medicine.stockQuantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(medicine.stockQuantity, parseInt(e.target.value) || 1)))}
                      className="w-full border-y border-gray-300 text-center focus:outline-none focus:ring-1 focus:ring-blue-600 text-gray-700"
                    />
                    <button 
                      onClick={() => setQuantity(prev => Math.min(medicine.stockQuantity, prev + 1))}
                      className="px-4 border border-gray-300 bg-gray-50 rounded-r-lg hover:bg-gray-100 transition flex items-center justify-center"
                    >
                      <span className="text-lg font-medium text-gray-700">+</span>
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={medicine.stockQuantity === 0 || isAddingToCart}
                  className={`flex-1 h-12 rounded-lg flex items-center justify-center gap-2 transition
                    ${
                      medicine.stockQuantity === 0
                        ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                        : isAddingToCart
                        ? 'bg-blue-600 text-white'
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }`}
                >
                  {isAddingToCart ? (
                    <div className="flex items-center">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Adding...
                    </div>
                  ) : (
                    <>
                      <FiShoppingCart size={20} />
                      {medicine.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-t border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-8 py-4 font-medium text-sm transition
                  ${activeTab === 'description'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`px-8 py-4 font-medium text-sm transition
                  ${activeTab === 'details'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                Details
              </button>
              <button
                id="reviews"
                onClick={() => setActiveTab('reviews')}
                className={`px-8 py-4 font-medium text-sm transition
                  ${activeTab === 'reviews'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                Reviews ({dummyReviews.length})
              </button>
            </div>
            
            <div className="p-8">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {medicine.description || 'No description available for this product.'}
                  </p>
                </div>
              )}
              
              {activeTab === 'details' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">Composition</h3>
                    <p className="text-gray-700">
                      {medicine.composition || 'Composition details not available.'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">Direction for Use</h3>
                    <p className="text-gray-700">
                      Take as directed by your physician. Do not exceed the recommended dosage.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">Storage Information</h3>
                    <p className="text-gray-700">
                      Store in a cool, dry place away from direct sunlight. Keep out of reach of children.
                    </p>
                  </div>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  {/* Review Summary */}
                  <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b">
                    <div className="md:w-1/3 flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-lg shadow-sm">
                      <h3 className="text-5xl font-bold text-gray-800">{overallRating}</h3>
                      <div className="my-3">
                        <StarRating rating={Number(overallRating)} size="lg" />
                      </div>
                      <p className="text-sm text-gray-500">{dummyReviews.length} verified ratings</p>
                    </div>
                    
                    <div className="md:w-2/3">
                      <h3 className="font-semibold text-lg mb-4 text-gray-800">Rating Distribution</h3>
                      {[5, 4, 3, 2, 1].map(star => (
                        <div key={star} className="flex items-center mb-3">
                          <div className="w-8 text-gray-700">{star} ★</div>
                          <div className="w-full mx-3">
                            <div className="bg-gray-200 rounded-full h-3 w-full">
                              <div 
                                className="bg-yellow-400 h-3 rounded-full" 
                                style={{ width: `${ratingDistribution[star]}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="w-12 text-right text-gray-700">{ratingDistribution[star]}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Customer Reviews */}
                  <div>
                    <h3 className="font-semibold text-xl mb-6 text-gray-800">Customer Reviews</h3>
                    <div className="space-y-8">
                      {(expandedReviews ? dummyReviews : dummyReviews.slice(0, 2)).map(review => (
                        <div key={review.id} className="border-b pb-8">
                          <div className="flex items-start">
                            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                              <img
                                src={review.avatar}
                                alt={review.user}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/profile-placeholder.png";
                                  e.target.className = "w-full h-full object-cover bg-blue-100 text-blue-600 flex items-center justify-center";
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-medium text-gray-800">{review.user}</h4>
                                {review.verified && (
                                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">Verified Purchase</span>
                                )}
                              </div>
                              <div className="flex items-center mt-1 mb-2">
                                <StarRating rating={review.rating} size="sm" />
                                <span className="ml-2 text-sm text-gray-500">
                                  {new Date(review.date).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </span>
                              </div>
                              <h5 className="font-medium mb-2 text-gray-800">{review.title}</h5>
                              <p className="text-gray-700 text-sm mb-3">{review.content}</p>
                              <button 
                                onClick={() => markReviewHelpful(review.id)}
                                className={`text-sm flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                                  helpfulReviews[review.id] 
                                    ? 'text-blue-600 border-blue-600 bg-blue-50' 
                                    : 'text-gray-600 border-gray-300 hover:border-blue-600 hover:text-blue-600'
                                }`}
                              >
                                <FiThumbsUp size={14} />
                                Helpful ({helpfulReviews[review.id] ? review.helpful + 1 : review.helpful})
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {dummyReviews.length > 2 && (
                      <button
                        onClick={() => setExpandedReviews(!expandedReviews)}
                        className="mt-6 text-blue-600 hover:text-blue-800 font-medium flex items-center border border-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition"
                      >
                        {expandedReviews ? 'Show Less' : `Show All ${dummyReviews.length} Reviews`}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map(product => (
                <Link 
                  key={product._id} 
                  to={`/medicines/${product._id}`}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col group"
                >
                  <div className="w-full h-48 flex items-center justify-center p-6 bg-white">
                    <img
                      src={product.image || '/placeholder.png'}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder.png';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-gray-800 font-medium line-clamp-2 h-12 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                    <div className="flex items-center mt-2">
                      <StarRating rating={product._id.length % 2 === 0 ? 4.5 : 4} size="sm" />
                    </div>
                    <p className="text-blue-600 font-semibold mt-2">₹{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicineDetail;