import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../ui/Button';
import FormField from '../ui/FormField';

function CustomerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validateInputs = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setLoginError('');

    if (!email.trim()) {
      setEmailError('Email/Username is required');
      valid = false;
    }

    if (password.trim().length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      setIsLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/customer/login`, {
        email: email.trim(),
        password: password.trim(),
      });

      const data = response.data;

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem("role" , 'customer');
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setLoginError(data.message || 'Invalid login credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error.response?.data?.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Customer Login</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <FormField
            label="Email/Username"
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            ariaInvalid={!!emailError}
            ariaDescribedby="email-error"
          />
          <FormField
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            ariaInvalid={!!passwordError}
            ariaDescribedby="password-error"
          />
          {loginError && (
            <p className="text-red-500 text-sm text-center" role="alert">
              {loginError}
            </p>
          )}
          <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/customer/register')}
            className="text-orange-500 hover:underline focus:outline-none"
            type="button"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

export default CustomerLogin;
