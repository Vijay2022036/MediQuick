import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

function AdminPharmacies() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('token');

  const fetchPharmacies = async () => {
    const token = getToken();
    if (!token) {
      setError('Authentication token missing. Please log in.');
      setLoading(false);
      navigate('/admin/dashboard');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/pharmacy`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch pharmacies: ${response.statusText}`);
      }

      const data = await response.json();
      setPharmacies(data);
    } catch (err) {
      setError('Failed to fetch pharmacies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const handleVerify = async (id) => {
    const token = getToken();
    if (!token) {
      setError('Authentication token missing. Please log in.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/pharmacy/verify/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to verify pharmacy: ${response.statusText}`);
      }

      setPharmacies((prev) =>
        prev.map((p) => (p._id === id ? { ...p, verified: true } : p))
      );
    } catch (err) {
      setError(`Error verifying pharmacy: ${err.message}`);
      navigate('/admin/dashboard');
    }
  };

  // Render pharmacy card for mobile view
  const renderPharmacyCard = (pharmacy) => (
    <div key={pharmacy._id} className="bg-white rounded-lg shadow mb-4 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b">
        <h3 className="font-medium text-gray-800 truncate">{pharmacy.name}</h3>
      </div>
      <div className="p-4">
        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-500">ID:</p>
            <p className="font-mono text-xs truncate">{pharmacy._id}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Email:</p>
            <p className="truncate">{pharmacy.email}</p>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Verified:</p>
              <p className={pharmacy.verified ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                {pharmacy.verified ? "Yes" : "No"}
              </p>
            </div>
            
            {!pharmacy.verified && (
              <Button
                onClick={() => handleVerify(pharmacy._id)}
                className="bg-orange-500 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm"
              >
                Verify
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Pharmacy Management</h2>
        <button 
          onClick={fetchPharmacies}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Mobile card view */}
          <div className="md:hidden">
            {pharmacies.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg shadow">
                <p className="text-gray-500">No pharmacies found.</p>
              </div>
            ) : (
              pharmacies.map(pharmacy => renderPharmacyCard(pharmacy))
            )}
          </div>

          {/* Desktop table view */}
          <div className="hidden md:block overflow-x-auto rounded-lg shadow">
            {pharmacies.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg">
                <p className="text-gray-500">No pharmacies found.</p>
              </div>
            ) : (
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pharmacies.map((pharmacy) => (
                    <tr key={pharmacy._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-500">{pharmacy._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{pharmacy.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{pharmacy.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${pharmacy.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {pharmacy.verified ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {!pharmacy.verified && (
                          <Button
                            onClick={() => handleVerify(pharmacy._id)}
                            className="bg-orange-500 hover:bg-orange-700 text-white px-3 py-1 rounded"
                          >
                            Verify
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminPharmacies;