import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '../ui/Button';
import FormField from '../ui/FormField';

function CustomerProfile() {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem('token');

  const fetchProfile = async () => {
    const token = getToken();
    if (!token) {
      toast.error('You are not logged in');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/customer/profile`,
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
        setError('Failed to fetch profile');
        toast.error('Failed to fetch profile');
      }
    } catch (err) {
      console.error(err);
      setError('Error fetching profile');
      toast.error('Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
        `${process.env.REACT_APP_API_BASE_URL}/api/customer/profile`,
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
        setError('Failed to update profile');
        toast.error('Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      setError('Error updating profile');
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">My Profile</h1>

      {loading && <p className="text-center text-gray-600">Loading profile...</p>}

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4 text-center font-medium">
          {error}
        </div>
      )}

      {!loading && !error && profileData && (
        <div className="bg-white shadow rounded-2xl p-6 space-y-6">
          {isEditing ? (
            <>
              <FormField
                label="Name"
                name="name"
                type="text"
                value={editedProfile.name || ''}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={editedProfile.email || ''}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />

              <div className="flex justify-end gap-4 mt-4">
                <Button
                  onClick={handleUpdateProfile}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-gray-800 hover:bg-gray-400"
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2 text-gray-800">
                <p>
                  <span className="font-semibold">Name:</span> {profileData.name || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {profileData.email || 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Edit Profile
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomerProfile;
