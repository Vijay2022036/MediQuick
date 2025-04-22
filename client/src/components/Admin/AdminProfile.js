import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { PencilIcon, UserIcon, LogOutIcon, KeyIcon, ShieldIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Skeleton } from '../ui/Skeleton';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import Button from '../ui/Button';
import FormField from '../ui/FormField';

const AdminProfile = () => {
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");
    
    const [passwordChange, setPasswordChange] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

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
                `${API_BASE_URL}/api/admin/profile`,
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

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordChange((prev) => ({ ...prev, [name]: value }));
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
                `${API_BASE_URL}/api/admin/profile/update`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: editedProfile.name,
                        email: editedProfile.email
                    }),
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

    const changePassword = async (e) => {
        e.preventDefault();
        setPasswordError('');
        
        // Basic validation
        if (passwordChange.newPassword !== passwordChange.confirmPassword) {
            setPasswordError("New passwords don't match");
            return;
        }

        if (passwordChange.newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            return;
        }

        const token = getToken();
        if (!token) {
            toast.error('You are not logged in');
            return;
        }

        try {
            setPasswordLoading(true);
            const response = await fetch(
                `${API_BASE_URL}/api/admin/change-password`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        currentPassword: passwordChange.currentPassword,
                        newPassword: passwordChange.newPassword
                    }),
                }
            );

            if (response.ok) {
                // Reset form
                setPasswordChange({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                
                toast.success('Password changed successfully!');
                setPasswordError('');
            } else {
                const errorData = await response.json();
                setPasswordError(errorData.message || 'Failed to change password');
                toast.error(errorData.message || 'Failed to change password');
            }
        } catch (err) {
            console.error('Password change error:', err);
            setPasswordError('Error connecting to server. Please try again later.');
            toast.error('Error connecting to server. Please try again later.');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('You have been logged out');
        window.location.href = '/login';
    };

    const getInitials = (name) => {
        if (!name) return 'A';
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
                        <h2 className="text-2xl font-bold text-gray-800">{profileData?.name || 'Admin'}</h2>
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
                                <span className="text-gray-500">Role:</span>
                                <span className="font-medium capitalize">{profileData?.role || 'Admin'}</span>
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
                
                <div className="mt-6 text-sm text-gray-500">
                    <p>Account created: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        );
    };

    const renderSecurityContent = () => {
        return (
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
                
                {passwordError && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{passwordError}</p>
                            </div>
                        </div>
                    </div>
                )}
                
                <form onSubmit={changePassword} className="space-y-4">
                    <FormField
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        value={passwordChange.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter your current password"
                        required
                    />
                    
                    <FormField
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={passwordChange.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                        required
                    />
                    
                    <FormField
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        value={passwordChange.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                        required
                    />
                    
                    <div className="flex justify-end mt-6">
                        <Button
                            type="submit"
                            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
                            disabled={passwordLoading}
                        >
                            {passwordLoading ? 'Updating...' : 'Update Password'}
                        </Button>
                    </div>
                </form>
                
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Tips</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>Use a strong password with a combination of letters, numbers, and special characters</li>
                        <li>Change your password periodically for better security</li>
                        <li>Never share your admin credentials with others</li>
                        <li>Log out when you're not using the admin panel</li>
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Admin Profile</h1>
            
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
                        value="security"
                        className="flex items-center gap-2"
                    >
                        <ShieldIcon size={16} />
                        Security
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="bg-white shadow rounded-xl p-6">
                    {renderProfileContent()}
                </TabsContent>
                
                <TabsContent value="security" className="bg-white shadow rounded-xl p-6">
                    {renderSecurityContent()}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminProfile;