import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function PharmacyDashboard() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

    // Ask for confirmation before deleting
    if (!window.confirm('Are you sure you want to delete this medicine?')) {
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
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-md">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Pharmacy Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your medicine inventory</p>
          </div>
          <button
            onClick={() => navigate('/pharmacy/add-medicine')}
            className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all flex items-center justify-center font-medium shadow-md hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Medicine
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : medicines.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-xl text-gray-600">No medicines found in your inventory.</p>
            <button
              onClick={() => navigate('/pharmacy/add-medicine')}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all"
            >
              Add Your First Medicine
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicines.map((med) => (
              <div key={med._id} className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all">
                <div className="h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src={med.image || '/placeholder.png'} 
                    alt={med.name} 
                    className="w-40 h-40 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder.png';
                    }}
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-gray-800 line-clamp-1">{med.name}</h2>
                  <p className="text-gray-600 mt-1 text-sm line-clamp-2 h-10">{med.description}</p>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Category</p>
                      <p className="font-medium">{med.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Batch</p>
                      <p className="font-medium">{med.batchNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Price</p>
                      <p className="font-medium text-blue-600">₹{med.price}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Stock</p>
                      <p className={`font-medium ${med.stockQuantity < 10 ? 'text-red-500' : 'text-green-600'}`}>
                        {med.stockQuantity} units
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-3">
                    Expires: {new Date(med.expiryDate).toLocaleDateString()}
                  </p>
                  
                  <div className="mt-5 flex space-x-3">
                    <button
                      onClick={() => navigate(`/pharmacy/edit-medicine/${med._id}`)}
                      className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all font-medium text-sm flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMedicine(med._id)}
                      className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-all font-medium text-sm flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PharmacyDashboard;