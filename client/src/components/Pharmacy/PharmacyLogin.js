import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Button from '../ui/Button';
import FormField from '../ui/FormField';

function PharmacyLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear errors as user types
    if (e.target.name === 'email') setEmailError('');
    if (e.target.name === 'password') setPasswordError('');
    setGeneralError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate email
    if (!formData.email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    }

    // Validate password
    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    if (!isValid) return;

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/pharmacy/login`, formData);
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', 'pharmacy');
        navigate('/pharmacy/dashboard');
      } else {
        setGeneralError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setGeneralError(message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold text-center mb-6">Pharmacy Login</h2>

        {generalError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mb-4 rounded">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={emailError}
          />
          <FormField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={passwordError}
          />
          <Button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded mt-4"
          >
            Login
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/pharmacy/register" className="text-orange-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default PharmacyLogin;
