import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Store, 
  BarChart3, 
  Calendar, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  ChevronDown 
} from 'lucide-react';
import axios from 'axios'; // You'll need to install axios: npm install axios

function AdminDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Admin User');
  const [notifications, setNotifications] = useState(3);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPharmacies: 0,
    totalOrders: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7days'); // Default time range

  useEffect(() => {
    fetchDashboardStats();
  }, [timeRange]); // Re-fetch when time range changes

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace with your actual API endpoint
      const response = await axios.get('/api/admin/dashboard-stats', {
        params: { timeRange }
      });
      
      setStats({
        totalUsers: response.data.totalUsers,
        totalPharmacies: response.data.totalPharmacies,
        totalOrders: response.data.totalOrders,
        pendingApprovals: response.data.pendingApprovals
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      setError("Failed to load dashboard statistics. Please try again later.");
      
      // Fallback to dummy data in development
      if (process.env.NODE_ENV === 'development') {
        setStats({
          totalUsers: 856,
          totalPharmacies: 124,
          totalOrders: 2453,
          pendingApprovals: 8
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  const exportReport = async () => {
    try {
      const response = await axios.get('/api/admin/export-report', {
        params: { timeRange },
        responseType: 'blob' // Important for file downloads
      });
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `admin-report-${timeRange}.csv`);
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
    { name: 'Calendar', icon: <Calendar size={20} />, active: false, path: '/admin/calendar' },
    { name: 'Settings', icon: <Settings size={20} />, active: false, path: '/admin/settings' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-blue-600">Pharma Admin</h1>
        </div>
        
        <div className="pt-2">
          <nav className="mt-5 px-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center px-4 py-3 mt-1 text-sm font-medium rounded-md w-full text-left ${
                  item.active 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
                {item.name === 'Users' && (
                  <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                    {stats.totalUsers}
                  </span>
                )}
                {item.name === 'Pharmacies' && (
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
            onClick={() => navigate('/logout')}
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
                  className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                className="relative p-1 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none"
                onClick={() => navigate('/admin/notifications')}
              >
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              
              <div className="relative">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {userName.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{userName}</span>
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
            <div className="flex space-x-2">
              <select 
                className="border rounded-md px-3 py-1.5 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={timeRange}
                onChange={handleTimeRangeChange}
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <button 
                className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={exportReport}
              >
                Export Report
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard 
                  title="Total Users" 
                  value={stats.totalUsers} 
                  icon={<Users size={24} className="text-blue-500" />}
                  change="+12.5%"
                  positive={true}
                  onClick={() => navigate('/admin/users')}
                />
                <StatCard 
                  title="Total Pharmacies" 
                  value={stats.totalPharmacies} 
                  icon={<Store size={24} className="text-green-500" />}
                  change="+3.2%"
                  positive={true}
                  onClick={() => navigate('/admin/pharmacies')}
                />
                <StatCard 
                  title="Total Orders" 
                  value={stats.totalOrders} 
                  icon={<BarChart3 size={24} className="text-purple-500" />}
                  change="+24.8%"
                  positive={true}
                  onClick={() => navigate('/admin/orders')}
                />
                <StatCard 
                  title="Pending Approvals" 
                  value={stats.pendingApprovals} 
                  icon={<Calendar size={24} className="text-orange-500" />}
                  change="-2.3%"
                  positive={false}
                  onClick={() => navigate('/admin/approvals')}
                />
              </div>
              
              {/* Quick Access */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <QuickAccessCard 
                  title="Manage Users"
                  description="View, edit, and manage all system users"
                  icon={<Users size={24} className="text-white" />}
                  bgColor="bg-blue-600"
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
                  title="System Settings"
                  description="Configure system preferences and settings"
                  icon={<Settings size={24} className="text-white" />}
                  bgColor="bg-purple-600"
                  onClick={() => navigate('/admin/settings')}
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
          <p className="text-2xl font-semibold mt-1">{value.toLocaleString()}</p>
        </div>
        <div className="p-2 rounded-md bg-gray-50">{icon}</div>
      </div>
      <div className={`mt-4 flex items-center text-sm ${positive ? 'text-green-500' : 'text-red-500'}`}>
        <span>{change}</span>
        <span className="ml-1.5">since last month</span>
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