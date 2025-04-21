import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Store, 
  BarChart3, 
  Calendar, 
  LogOut, 
  Search, 
  ChevronDown 
} from 'lucide-react';
import axios from 'axios';

function AdminDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPharmacies: 0,
    totalOrders: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7days');

  // Fetch user profile and dashboard stats when component mounts
  useEffect(() => {
    fetchUserProfile();
    fetchDashboardStats();
  }, []);

  // Re-fetch dashboard stats when time range changes
  useEffect(() => {
    fetchDashboardStats();
  }, [timeRange]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/admin/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUserName(data.name);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      // Use the stored name from local storage as fallback
      const storedName = localStorage.getItem('userName');
      if (storedName) setUserName(storedName);
      else setUserName('Admin User');
    }
  };

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/admin/dashboard-stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      setError("Failed to load dashboard statistics. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  const exportReport = async () => {
    try {
      const response = await axios.get('${process.env.REACT_APP_API_BASE_URL}/api/admin/export-report', {
        params: { timeRange },
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `admin-report-${timeRange}-${date}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to export report:", error);
      alert("Failed to export report. Please try again later.");
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: <BarChart3 size={20} />, active: true, path: '/admin/dashboard' },
    { name: 'Users', icon: <Users size={20} />, active: false, path: '/admin/users' },
    { name: 'Pharmacies', icon: <Store size={20} />, active: false, path: '/admin/pharmacies' },
    { name: 'Orders', icon: <Calendar size={20} />, active: false, path: '/admin/orders' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Calculate percentage changes
  const getPercentageChange = (current, previous) => {
    if (!previous) return '+0%';
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-orange-600">MediQuick</h1>
        </div>
        
        <div className="pt-2">
          <nav className="mt-5 px-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center px-4 py-3 mt-1 text-sm font-medium rounded-md w-full text-left ${
                  item.active 
                    ? 'bg-orange-50 text-orange-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
                {item.name === 'Users' && stats.totalUsers > 0 && (
                  <span className="ml-auto bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">
                    {stats.totalUsers}
                  </span>
                )}
                {item.name === 'Pharmacies' && stats.totalPharmacies > 0 && (
                  <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                    {stats.totalPharmacies}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button 
            className="flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 w-full text-left"
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
          >
            <LogOut size={20} className="mr-3" />
            Log Out
          </button>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={() => navigate('/admin/profile')}
                >
                  <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                    {userName ? userName.charAt(0) : 'A'}
                  </div>
                  <span className="text-sm font-medium">{userName || 'Admin User'}</span>
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h2>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
              <button 
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={fetchDashboardStats}
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard 
                  title="Total Users" 
                  value={stats.totalUsers} 
                  icon={<Users size={24} className="text-orange-500" />}
                  change={getPercentageChange(stats.totalUsers, stats.previousUsers)}
                  positive={stats.totalUsers >= (stats.previousUsers || 0)}
                  onClick={() => navigate('/admin/users')}
                />
                <StatCard 
                  title="Total Pharmacies" 
                  value={stats.totalPharmacies} 
                  icon={<Store size={24} className="text-green-500" />}
                  change={getPercentageChange(stats.totalPharmacies, stats.previousPharmacies)}
                  positive={stats.totalPharmacies >= (stats.previousPharmacies || 0)}
                  onClick={() => navigate('/admin/pharmacies')}
                />
                <StatCard 
                  title="Total Orders" 
                  value={stats.totalOrders} 
                  icon={<BarChart3 size={24} className="text-purple-500" />}
                  change={getPercentageChange(stats.totalOrders, stats.previousOrders)}
                  positive={stats.totalOrders >= (stats.previousOrders || 0)}
                  onClick={() => navigate('/admin/orders')}
                />
                <StatCard 
                  title="Pending Approvals" 
                  value={stats.pendingApprovals} 
                  icon={<Calendar size={24} className="text-orange-500" />}
                  change={getPercentageChange(stats.pendingApprovals, stats.previousApprovals)}
                  positive={stats.pendingApprovals < (stats.previousApprovals || 0)}
                  onClick={() => navigate('/admin/approvals')}
                />
              </div>
              
              {/* Recent Activity Section */}
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-medium">Recent Activity</h3>
                </div>
                <div className="p-4">
                  {stats.recentActivity && stats.recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {stats.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start">
                          <div className={`p-2 rounded-full mr-3 ${
                            activity.type === 'user' ? 'bg-orange-100' :
                            activity.type === 'pharmacy' ? 'bg-green-100' :
                            activity.type === 'order' ? 'bg-purple-100' : 'bg-gray-100'
                          }`}>
                            {activity.type === 'user' && <Users size={16} className="text-orange-500" />}
                            {activity.type === 'pharmacy' && <Store size={16} className="text-green-500" />}
                            {activity.type === 'order' && <BarChart3 size={16} className="text-purple-500" />}
                          </div>
                          <div>
                            <p className="text-sm text-gray-700">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(activity.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No recent activity to display</p>
                  )}
                </div>
              </div>
              
              {/* Quick Access */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <QuickAccessCard 
                  title="Manage Users"
                  description="View, edit, and manage all system users"
                  icon={<Users size={24} className="text-white" />}
                  bgColor="bg-orange-600"
                  onClick={() => navigate('/admin/users')}
                />
                <QuickAccessCard 
                  title="Manage Pharmacies"
                  description="Add and edit registered pharmacies"
                  icon={<Store size={24} className="text-white" />}
                  bgColor="bg-green-600"
                  onClick={() => navigate('/admin/pharmacies')}
                />
                <QuickAccessCard 
                  title="Log Out"
                  description="Log out of the admin panel"
                  icon={<LogOut size={24} className="text-white" />}
                  bgColor="bg-purple-600"
                  onClick={() => {
                    localStorage.clear();
                    navigate('/admin/login');
                  }}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, change, positive, onClick }) {
  return (
    <div 
      className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow duration-300"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value?.toLocaleString() || '0'}</p>
        </div>
        <div className="p-2 rounded-md bg-gray-50">{icon}</div>
      </div>
      <div className={`mt-4 flex items-center text-sm ${positive ? 'text-green-500' : 'text-red-500'}`}>
        <span>{change}</span>
        <span className="ml-1.5">since last period</span>
      </div>
    </div>
  );
}

function QuickAccessCard({ title, description, icon, bgColor, onClick }) {
  return (
    <div 
      className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 flex flex-col"
      onClick={onClick}
    >
      <div className={`p-4 ${bgColor}`}>
        <div className="rounded-full bg-white bg-opacity-20 p-2 inline-block">
          {icon}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="text-gray-500 mt-1 text-sm">{description}</p>
      </div>
    </div>
  );
}

export default AdminDashboard;