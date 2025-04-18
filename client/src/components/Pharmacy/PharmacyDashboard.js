import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router

function PharmacyDashboard() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // For navigation

  const getToken = () => localStorage.getItem('token');

  const fetchMedicines = async () => {
    const token = getToken();
    if (!token) {
      toast.error('You are not logged in');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/pharmacy/medicines`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch medicines');
      const data = await res.json();
      setMedicines(data);
    } catch (err) {
      toast.error(err.message || 'Error fetching medicines');
    } finally {
      setLoading(false);
    }
  };

  const deleteMedicine = async (id) => {
    const token = getToken();
    if (!token) {
      toast.error('You are not logged in');
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/medicines/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete medicine');
      toast.success('Medicine deleted successfully');
      setMedicines((prev) => prev.filter((med) => med._id !== id));
    } catch (err) {
      toast.error(err.message || 'Error deleting medicine');
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pharmacy Dashboard</h1>
        <button
          onClick={() => navigate('/pharmacy/add-medicine')} // Redirect to add medicine page
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add New Medicine
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading medicines...</p>
      ) : medicines.length === 0 ? (
        <p className="text-center text-gray-600">No medicines found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((med) => (
            <div key={med._id} className="bg-white shadow-md rounded-2xl p-4 space-y-3 border hover:shadow-xl transition">
              <img src={med.image} alt={med.name} className="w-full h-40 object-cover rounded-xl" />
              <h2 className="text-xl font-semibold">{med.name}</h2>
              <p className="text-gray-600">{med.description}</p>
              <p><strong>Category:</strong> {med.category}</p>
              <p><strong>Composition:</strong> {med.composition}</p>
              <p><strong>Batch:</strong> {med.batchNumber}</p>
              <p><strong>Price:</strong> ₹{med.price}</p>
              <p><strong>Stock:</strong> {med.stockQuantity}</p>
              <p><strong>Expiry:</strong> {new Date(med.expiryDate).toLocaleDateString()}</p>
              <button
                onClick={() => deleteMedicine(med._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
              <button
                onClick={() => navigate(`/pharmacy/edit-medicine/${med._id}`)} // Redirect to edit medicine page
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PharmacyDashboard;
