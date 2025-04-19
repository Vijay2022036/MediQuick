import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import axios from 'axios';

export default function Shop() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/medicines/`,
          { withCredentials: true }
        );
        setMedicines(response.data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleQuantityChange = (id, value) => {
    const qty = Math.max(1, parseInt(value) || 1);
    setQuantities(prev => ({ ...prev, [id]: qty }));
  };

  const handleCart = async (medicineId) => {
    const quantity = quantities[medicineId] || 1;
    if (quantity > medicines.find(med => med._id === medicineId).stockQuantity) {
      alert("Quantity exceeds available stock!");
      return;
    }
    try {
      await axios.post(
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
      alert(`${quantity} item(s) added to cart successfully!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto w-full max-w-7xl">
      <header className="text-center py-10">
        <h1 className="text-3xl font-bold text-gray-800">Shop Medicines</h1>
        <p className="text-lg mt-2 text-gray-600">Explore our wide range of products</p>
        <div className="relative mt-6 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-5 py-3 pl-12 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <FiSearch className="absolute left-4 top-3 text-gray-400" size={20} />
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10 text-lg">Error: {error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 pb-16">
          {filteredMedicines.length > 0 ? (
            filteredMedicines.map((medicine) => (
              <div
                key={medicine._id}
                className="bg-white border rounded-2xl shadow-md hover:shadow-lg transition duration-200 hover:scale-105 p-5 flex flex-col items-center"
              >
                <div className="w-full h-48 flex items-center justify-center mb-4 bg-gray-50 rounded-lg overflow-hidden">
                  <img
                    src={medicine.image || '/placeholder.png'}
                    alt={medicine.name}
                    className="w-32 h-32 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder.png';
                    }}
                  />
                </div>
                <div className="text-center w-full">
                  <Link to={`/medicines/${medicine._id}`}>
                    <h2 className="text-lg font-semibold text-gray-800 hover:text-orange-600 line-clamp-2 h-12">
                      {medicine.name}
                    </h2>
                  </Link>
                  <p className="text-gray-600 mt-1 font-medium">₹{medicine.price}</p>

                  <div className="mt-3 flex justify-center items-center gap-2">
                    <label htmlFor={`qty-${medicine._id}`} className="text-sm font-medium">Qty:</label>
                    <input
                      type="number"
                      id={`qty-${medicine._id}`}
                      min="1"
                      max={medicine.stockQuantity}
                      value={quantities[medicine._id] || 1}
                      onChange={(e) => handleQuantityChange(medicine._id, e.target.value)}
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded-lg"
                    />
                  </div>

                  <button
                    onClick={() => handleCart(medicine._id)}
                    disabled={medicine.stockQuantity === 0}
                    className={`mt-4 px-5 py-2 rounded-full transition-all ${
                      medicine.stockQuantity === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }`}
                  >
                    {medicine.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500 text-lg">
              No matching results found.
            </p>
          )}
        </div>
      )}

      <footer className="text-center py-6 bg-gray-800 text-white mt-10">
        <Link to="/" className="text-lg underline hover:text-orange-400 transition">
          Go Back Home
        </Link>
      </footer>
    </div>
  );
}