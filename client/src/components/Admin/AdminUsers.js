import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Table from '../ui/Table';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('token');

  const fetchUsers = async () => {
    const token = getToken();
    if (!token) {
      setError('Authentication token missing. Please log in.');
      setLoading(false);
      navigate('/admin/dashboard');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/customer`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const token = getToken();
    if (!token) {
      setError('Authentication token missing. Please log in.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/customer/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }

      setUsers(prev => prev.filter(user => user._id !== id));
    } catch (err) {
      setError(`Error deleting user: ${err.message}`);
    }
  };

  const columns = [
    { key: '_id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    {
      key: 'actions',
      label: 'Actions',
      render: (user) => (
        <Button onClick={() => handleDelete(user._id)} className="bg-red-500 hover:bg-red-700">
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">User Management</h2>

      {loading && <div className="text-center">Loading users...</div>}
      {error && <div className="text-red-500 mt-4">{error}</div>}

      {!loading && !error && <Table data={users} columns={columns} />}
    </div>
  );
}

export default AdminUsers;
