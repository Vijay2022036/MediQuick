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
    { 
      key: '_id', 
      label: 'ID', 
      className: 'hidden md:table-cell' // Hide on mobile, show on medium screens and up
    },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { 
      key: 'role', 
      label: 'Role',
      className: 'hidden sm:table-cell' // Hide on small screens, show on larger
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (user) => (
        <Button 
          onClick={() => handleDelete(user._id)} 
          className="bg-red-500 hover:bg-red-700 px-2 py-1 text-white text-sm rounded"
        >
          Delete
        </Button>
      ),
    },
  ];

  // Mobile view for each user
  const renderMobileUserCard = (user) => (
    <div key={user._id} className="border rounded mb-4 p-4 bg-white shadow sm:hidden">
      <div className="mb-2">
        <span className="font-semibold">Name:</span> {user.name}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Email:</span> {user.email}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Role:</span> {user.role}
      </div>
      <div className="mt-3">
        <Button 
          onClick={() => handleDelete(user._id)} 
          className="bg-red-500 hover:bg-red-700 px-3 py-1 text-white rounded"
        >
          Delete
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-6">User Management</h1>
      
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading users...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Table view for larger screens */}
          <div className="hidden sm:block overflow-x-auto">
            <Table 
              columns={columns} 
              data={users} 
              className="min-w-full bg-white shadow-md rounded"
            />
          </div>
          
          {/* Mobile cards view */}
          <div className="sm:hidden">
            {users.length > 0 ? (
              users.map(renderMobileUserCard)
            ) : (
              <p className="text-center py-4">No users found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminUsers;