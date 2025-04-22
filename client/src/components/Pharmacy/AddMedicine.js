import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      toast.error('You are not logged in', {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
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

      } catch (error) {
        throw new Error('Network error: Unable to reach the server');
      }

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400) {
          toast.error('Bad Request: Please check your input', {
            position: "top-center",
            autoClose: 3000,
          });
        } else if (res.status === 500) {
          toast.error('Server error: Please try again later', {
            position: "top-center",
            autoClose: 3000,
          });
        } else {
          toast.error(data.message || 'An error occurred', {
            position: "top-center",
            autoClose: 3000,
          });
        }
        return;
      }

      toast.success('Medicine added successfully', {
        position: "top-center",
        autoClose: 3000,
      });
      navigate('/pharmacy/dashboard');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Please login to add medicines to store', {
          position: "top-center",
          autoClose: 3000,
        });
        navigate('/pharmacy/login');
      } else {
        toast.error('Only pharmacies can ADD medicines.', {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
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