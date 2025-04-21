import React, { useEffect } from 'react';
import { useNavigate , Outlet } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

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
        alert('Session expired. Please log in again.');
        navigate(`/${role}/login`);
      }
    }
  }, []);

  return <Outlet/>; // optional: or return <Outlet /> if you want nested routing
};

export default IsLoggedIn;
