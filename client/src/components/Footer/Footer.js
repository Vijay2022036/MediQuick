import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gray-300 border-t border-gray-600">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    <div className="mb-8 sm:mb-0">
                        <Link to="/" className="flex items-center text-gray-900 text-lg font-semibold">
                            MediQuik
                        </Link>
                        <p className="mt-4 text-gray-600">
                            Your trusted partner in healthcare. We provide quality medicines and health products
                            delivered to your doorstep.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900 uppercase mb-4">Explore</h2>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/" className="text-gray-600 hover:text-gray-900">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about" className="text-gray-600 hover:text-gray-900">
                                        About Us
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900 uppercase mb-4">Connect</h2>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="https://github.com/Vijay2022036"
                                        className="text-gray-600 hover:text-gray-900"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        GitHub
                                    </a>
                                </li>
                                <li>
                                    <Link to="/" className="text-gray-600 hover:text-gray-900">
                                        Discord
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-8 border-gray-200" />
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <p className="text-sm text-gray-600 text-center sm:text-left">
                        &copy; 2024 MediQuik. All rights reserved.
                    </p>
                    <div className="flex space-x-4">
                        <Link to="#" className="text-gray-600 hover:text-gray-900">
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 8 19"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                            >
                                <path d="M1.571 23.664l10.531-10.501 3.712 3.701-12.519 6.941c-.476.264-1.059.26-1.532-.011l-.192-.13zm9.469-11.56l-10.04 10.011v-20.022l10.04 10.011zm6.274-4.137l4.905 2.719c.482.268.781.77.781 1.314s-.299 1.046-.781 1.314l-5.039 2.793-4.015-4.003 4.149-4.137zm-15.854-7.534c.09-.087.191-.163.303-.227.473-.271 1.056-.275 1.532-.011l12.653 7.015-3.846 3.835-10.642-10.612z" />
                            </svg>
                            <span className="sr-only">Facebook</span>
                        </Link>
                        <Link to="#" className="text-gray-600 hover:text-gray-900">
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 21 16"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                            >
                                <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z" />
                            </svg>
                            <span className="sr-only">Twitter</span>
                        </Link>
                        <Link to="#" className="text-gray-600 hover:text-gray-900">
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 20 17"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            <span className="sr-only">LinkedIn</span>
                        </Link>
                        <Link to="#" className="text-gray-600 hover:text-gray-900">
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M10 0a10 10 0 1 0 10 10A10.009 10.009 0 0 0 10 0Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.094 20.094 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM8 1.707a8.821 8.821 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.758 45.758 0 0 0 8 1.707ZM1.642 8.262a8.57 8.57 0 0 1 4.73-5.981A53.998 53.998 0 0 1 9.54 7.222a32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.64 31.64 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM10 18.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 13.113 11a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            <span className="sr-only">Instagram</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
