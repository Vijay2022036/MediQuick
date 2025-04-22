import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast , ToastContainer } from 'react-toastify';

function EditMedicine() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem('token');

  const fetchMedicine = async () => {
    const token = getToken();
    if (!token) {
      toast.error('You are not logged in');
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/medicines/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        method: 'GET',
      });

      if (!res.ok) throw new Error('Failed to fetch medicine');
      const data = await res.json();
      setMedicine(data);
    } catch (err) {
      toast.error(err.message || 'Error loading medicine' , {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMedicine = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      toast.error('You are not logged in' , {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/medicines/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(medicine),
      });

      if (!res.ok) throw new Error('Failed to update medicine');
      toast.success('Medicine updated successfully',{
        position: "top-center",
        autoClose: 3000,
      });
      navigate('/pharmacy/dashboard');
    } catch (err) {
      toast.error(err.message || 'Error updating medicine',{
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchMedicine();
  }, []);

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!medicine) return <p className="text-center mt-6">Medicine not found</p>;

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
      <h2 className="text-2xl font-bold mb-6">Edit Medicine</h2>
      <form onSubmit={updateMedicine} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Name"
          value={medicine.name}
          onChange={(e) => setMedicine({ ...medicine, name: e.target.value })}
          required
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Description"
          value={medicine.description}
          onChange={(e) => setMedicine({ ...medicine, description: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Composition"
          value={medicine.composition}
          onChange={(e) => setMedicine({ ...medicine, composition: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Category"
          value={medicine.category}
          onChange={(e) => setMedicine({ ...medicine, category: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Batch Number"
          value={medicine.batchNumber}
          onChange={(e) => setMedicine({ ...medicine, batchNumber: e.target.value })}
        />
        <input
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Price"
          value={medicine.price}
          onChange={(e) => setMedicine({ ...medicine, price: parseFloat(e.target.value) })}
        />
        <input
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Stock Quantity"
          value={medicine.stockQuantity}
          onChange={(e) => setMedicine({ ...medicine, stockQuantity: parseInt(e.target.value) })}
        />
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={medicine.expiryDate?.split('T')[0]}
          onChange={(e) => setMedicine({ ...medicine, expiryDate: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Image URL"
          value={medicine.image}
          onChange={(e) => setMedicine({ ...medicine, image: e.target.value })}
        />
        <div className="flex justify-between pt-4">
          <button
            type="button"
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditMedicine;
