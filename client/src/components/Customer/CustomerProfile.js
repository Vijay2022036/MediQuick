import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { PencilIcon, ShoppingBagIcon, UserIcon, LogOutIcon, ExternalLinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Skeleton } from '../ui/Skeleton';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import OrderHistoryCard from './OrderHistoryCard';

function CustomerProfile() {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [orderHistory, setOrderHistory] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [ordersError, setOrdersError] = useState(null);

  const getToken = () => localStorage.getItem('token');
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

  const fetchProfile = async () => {
    const token = getToken();
    if (!token) {
      toast.error('You are not logged in');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/customer/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        setEditedProfile(data);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch profile');
        toast.error(errorData.message || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError('Error connecting to server. Please try again later.');
      toast.error('Error connecting to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderHistory = async () => {
    const token = getToken();
    if (!token) {
      setOrdersLoading(false);
      setOrdersError('Authentication required');
      return;
    }

    try {
      setOrdersLoading(true);
      // Use the same endpoint as the standalone OrderHistory component
      const response = await fetch(
        `${API_BASE_URL}/api/orders/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.orders && Array.isArray(data.orders)) {
          setOrderHistory(data.orders.map(order => ({ 
            ...order, 
            id: order._id || order.id,
            totalAmount: order.totalAmount || order.totalPrice || 0 
          })));
        } else {
          setOrderHistory([]);
        }
        setOrdersError(null);
      } else {
        const errorData = await response.json();
        setOrdersError(errorData.message || 'Failed to fetch order history');
      }
    } catch (err) {
      console.error('Order history fetch error:', err);
      setOrdersError('Error loading order history');
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    
    // Only fetch orders when on orders tab
    if (activeTab === 'orders') {
      fetchOrderHistory();
    }
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    const token = getToken();
    if (!token) {
      toast.error('You are not logged in');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/customer/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedProfile),
        }
      );

      if (response.ok) {
        const updatedData = await response.json();
        setProfileData(updatedData);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update profile');
        toast.error(errorData.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Error connecting to server. Please try again later.');
      toast.error('Error connecting to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('You have been logged out');
    window.location.href = '/login';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const renderProfileContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      );
    }

    if (error && !profileData) {
      return (
        <div className="bg-red-100 text-red-700 p-6 rounded-lg text-center">
          <p className="font-medium">{error}</p>
          <Button 
            onClick={fetchProfile} 
            className="mt-4 bg-red-600 hover:bg-red-700"
          >
            Try Again
          </Button>
        </div>
      );
    }

    if (isEditing) {
      return (
        <div className="space-y-6">
          <FormField
            label="Name"
            name="name"
            type="text"
            value={editedProfile.name || ''}
            onChange={handleInputChange}
            placeholder="Enter your name"
            required
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            value={editedProfile.email || ''}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
          />

          <div className="flex flex-wrap justify-end gap-4 mt-6">
            <Button
              onClick={() => {
                setIsEditing(false);
                setEditedProfile(profileData); // Reset to original data
              }}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300"
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateProfile}
              className="bg-orange-600 hover:bg-orange-700"
              disabled={loading}
              type="submit"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-20 w-20 border-2 border-orange-200">
            <AvatarFallback className="bg-orange-100 text-orange-800 text-xl">
              {getInitials(profileData?.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{profileData?.name || 'User'}</h2>
            <p className="text-gray-600">{profileData?.email || 'No email available'}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Account Details</h3>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium">{profileData?.name || 'N/A'}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{profileData?.email || 'N/A'}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Account type:</span>
                <span className="font-medium capitalize">{profileData?.role || 'Customer'}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-medium text-gray-700 mb-2">Actions</h3>
            <Button 
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700"
            >
              <PencilIcon size={16} />
              Edit Profile
            </Button>
           
            <Button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 bg-gray-600 text-white hover:bg-gray-700"
            >
              <LogOutIcon size={16} />
              Log Out
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderOrdersContent = () => {
    if (ordersLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      );
    }

    if (ordersError) {
      return (
        <div className="bg-red-50 text-red-700 p-6 rounded-lg">
          <p className="font-medium">{ordersError}</p>
          <Button 
            onClick={fetchOrderHistory}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white"
          >
            Retry
          </Button>
        </div>
      );
    }

    if (!orderHistory || orderHistory.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found in profile view</h3>
          <p className="mt-1 text-gray-500">Try viewing your complete order history</p>
          <div className="mt-6 flex justify-center">
            <Link 
              to="/order-history"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              View Full Order History
              <ExternalLinkIcon size={16} />
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Your Recent Orders</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {orderHistory.length} {orderHistory.length === 1 ? 'order' : 'orders'}
            </span>
            <Link 
              to="/order-history"
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
            >
              View All
              <ExternalLinkIcon size={14} />
            </Link>
          </div>
        </div>
        
        <div className="space-y-4">
          {orderHistory.slice(0, 3).map((order) => (
            <OrderHistoryCard key={order._id || order.id} order={order} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-center mb-8">My Account</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger 
            value="profile" 
            className="flex items-center gap-2"
          >
            <UserIcon size={16} />
            Profile
          </TabsTrigger>
          <TabsTrigger 
            value="orders"
            className="flex items-center gap-2"
          >
            <ShoppingBagIcon size={16} />
            Order History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="bg-white shadow rounded-xl p-6">
          {renderProfileContent()}
        </TabsContent>
        
        <TabsContent value="orders" className="bg-white shadow rounded-xl p-6">
          {renderOrdersContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CustomerProfile;