import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function AddMedicine() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    composition: '',
    category: '',
    price: '',
    batchNumber: '',
    expiryDate: '',
    image: '',
    stockQuantity: '',
    pharmacy: '',
  });

  const getToken = () => localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    if (!token) {
      toast.error('You are not logged in');
      return;
    }

    try {
      // formData.pharmacy = JSON.parse(localStorage.getItem('user'))._id; // Assuming pharmacy is available in the context or state
      // console.log('Form data:', formData); // Debugging line
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
      let res;
      try {
        res = await fetch(`${apiUrl}/api/medicines`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      } catch (networkError) {
        throw new Error('Network error: Unable to reach the server');
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to add medicine');
      }

      toast.success('Medicine added successfully');
      navigate('/pharmacy/dashboard');
    } catch (err) {
      toast.error(err.message || 'Error adding medicine');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Medicine</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'description', 'composition', 'category', 'batchNumber', 'image'].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
        ))}
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="number"
          name="stockQuantity"
          placeholder="Stock Quantity"
          value={formData.stockQuantity}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="date"
          name="expiryDate"
          placeholder="Expiry Date"
          value={formData.expiryDate}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Add Medicine
        </button>
      </form>
    </div>
  );
}

export default AddMedicine;
