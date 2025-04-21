import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

const getToken = () => {
  return localStorage.getItem('token');
};

const IsLoggedIn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();

    if (token) {
      if (isTokenExpired(token)) {
        let role = 'user'; // default role
        try {
          const decoded = jwtDecode(token);
          role = decoded.role || 'user'; // fallback if role is missing
        } catch {}

        localStorage.clear();
        toast.error('Session expired. Please log in again.');
        navigate(`/${role}/login`);
      }
    }
  }, []);

  return (
    <>
      <ToastContainer />
      <Outlet />
    </>
  );
};

export default IsLoggedIn;
