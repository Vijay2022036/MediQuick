import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function MedicineDetail() {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/medicines/${id}`
        );
        setMedicine(response.data);
      } catch (err) {
        setError('Error fetching medicine details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMedicine();
  }, [id]);

  const handleAddToCart = async () => {
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
        alert('Added to cart successfully!');
      } else {
        alert('Failed to add to cart.');
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert('Failed to add to cart.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
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

  if (!medicine) {
    return (
      <div className="text-center text-gray-500 font-medium mt-6">
        Medicine not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={medicine.image || '/placeholder.png'}
          alt={medicine.name}
          className="w-full h-64 object-contain rounded-xl border"
        />
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">{medicine.name}</h2>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Category:</strong> {medicine.category}</p>
              <p><strong>Batch No:</strong> {medicine.batchNumber}</p>
              <p><strong>Expiry Date:</strong> {new Date(medicine.expiryDate).toLocaleDateString()}</p>
            </div>
            <div className="mt-4 space-y-2 text-gray-700 text-sm">
              <p><strong>Description:</strong> {medicine.description}</p>
              <p><strong>Composition:</strong> {medicine.composition}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-blue-600">₹{medicine.price}</span>
              {medicine.stockQuantity > 0 ? (
                <span className="text-sm text-green-600">In Stock ({medicine.stockQuantity})</span>
              ) : (
                <span className="text-sm text-red-500">Out of Stock</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="qty" className="text-sm">Qty:</label>
              <input
                id="qty"
                type="number"
                min="1"
                max={medicine.stockQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(medicine.stockQuantity, parseInt(e.target.value) || 1)))}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
              />
            </div>

            <button
              onClick={handleAddToCart}
              disabled={medicine.stockQuantity === 0}
              className={`px-6 py-2 rounded-xl text-white font-medium transition-all duration-200 ${
                medicine.stockQuantity === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicineDetail;
