import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');

        navigate('/'); // Redirect to home page after logout
    };

    return (
        <header className="shadow-xl sticky z-50 top-0">
            <nav className="bg-gray-100 border-gray-200 px-4 lg:px-6 py-2.5">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to="/" className="flex items-center">
                        <img
                            src="data:image/jpeg;base64,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
                            9tb9US0qyKrF6ZHLzWEzAhIIPAKdCNQUaMkEAcufDzQB3eKEaosqGEyF0jooXNYftP4BbdWFdb4XBqXZtNXl8jLjdla9fSS2TPJ3cmhXGP0yuvmfLKi/qVtnEeEMDI2sYGsaAO4DRWUYqPgrm23yZhSQSpAIAQAgBAf/Z" // Replace with your medical store logo URL
                            className="mr-3 h-12"
                            alt="Medical Store Logo"
                        />
                    </Link>
                    <div className="flex items-center lg:order-2">
                        {localStorage.getItem('token') ? (
                            <button
                                onClick={handleLogout}
                                className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                            >
                                Logout
                            </button>
                            
                        ) : (
                            <>
                                {/* Login Dropdown */}
                                <div className="mr-2 inline-block text-left">
                                    <div className="group">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                                            id="menu-button"
                                            aria-expanded="true"
                                            aria-haspopup="true"
                                        >
                                            Login
                                            <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <div className="hidden group-hover:block origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                                            <div className="py-1" role="none">
                                                <Link to="/customer/login" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" role="menuitem" tabIndex="-1" id="menu-item-0">Customer Login</Link>
                                                <Link to="/admin/login" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" role="menuitem" tabIndex="-1" id="menu-item-1">Admin Login</Link>
                                                <Link to="/pharmacy/login" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" role="menuitem" tabIndex="-1" id="menu-item-2">Pharmacy Login</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Register Dropdown */}
                                <div className="inline-block text-left">
                                    <div className="group">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-orange-700 text-sm font-medium text-white hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                                            id="options-menu"
                                            aria-expanded="true"
                                            aria-haspopup="true"
                                        >
                                            Register
                                            <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                            </svg>
                                        </button>

                                        <div className="hidden group-hover:block origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="options-menu" tabIndex="-1">
                                            <div className="py-1" role="none">
                                                <Link to="/customer/register" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" role="menuitem" tabIndex="-1" id="options-menu-0">Customer Register</Link>
                                                <Link to="/pharmacy/register" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" role="menuitem" tabIndex="-1" id="options-menu-1">Pharmacy Register</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>

                        )}
                    </div>
                    <div
                        className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                        id="mobile-menu-2"
                    >
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/about"
                                    className={({ isActive }) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                >
                                    About
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/support"
                                    className={({ isActive }) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                >
                                    support
                                </NavLink>
                            </li>
                            {(localStorage.getItem('role') === 'customer' || localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === null) && (
                            <li>
                                <NavLink
                                    to="/shop"
                                    className={({ isActive }) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                >
                                    Products
                                </NavLink>
                            </li>
                            )}
                                {localStorage.getItem('role') === 'pharmacy' && (
                            <li>
                                    <NavLink
                                        to="/pharmacy/dashboard"
                                        className={({ isActive }) =>
                                            `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                        }
                                    >
                                        Dashboard
                                    </NavLink>
                            </li>
                                )}
                                {localStorage.getItem('role') === 'admin' && (
                            <li>
                                    <NavLink
                                        to="/admin/dashboard"
                                        className={({ isActive }) =>
                                            `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                        }
                                    >
                                        Admin Dashboard
                                    </NavLink>
                            </li>
                                )}
                                {localStorage.getItem('role') === 'customer' && (
                            <li>
                                    <NavLink
                                        to="/cart"
                                        className={({ isActive }) =>
                                            `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                        }
                                    >
                                        Cart
                                    </NavLink>
                            </li>
                                )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}


