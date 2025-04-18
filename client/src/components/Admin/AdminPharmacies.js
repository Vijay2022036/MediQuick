import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Table from '../ui/Table';

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

  const columns = [
    { key: '_id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'verified',
      label: 'Verified',
      render: (item) => (item.verified ? 'Yes' : 'No'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item) =>
        !item.verified && (
          <Button
            onClick={() => handleVerify(item._id)}
            className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            Verify
          </Button>
        ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Pharmacy Management</h2>

      {loading && <div className="text-center">Loading pharmacies...</div>}
      {error && <div className="text-red-500 mt-4">{error}</div>}

      {!loading && !error && <Table data={pharmacies} columns={columns} />}
    </div>
  );
}

export default AdminPharmacies;
