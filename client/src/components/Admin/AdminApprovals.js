import React, { useEffect, useState } from 'react';

const AdminApprovals = () => {
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPharmacy, setSelectedPharmacy] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        // Fetch non-verified pharmacies
        const fetchPharmacies = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/admin/approval`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                setPharmacies(data);
                setError(null);
            } catch (error) {
                console.error('Error fetching pharmacies:', error);
                setError('Failed to load pharmacies. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchPharmacies();
    }, []);

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    const verifyPharmacy = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/pharmacy/verify/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                // Remove the verified pharmacy from the list
                setPharmacies(pharmacies.filter(pharmacy => pharmacy._id !== id));
                setSelectedPharmacy(null);
                
                // Show success notification
                showNotification('Pharmacy verified successfully!', 'success');
            } else {
                showNotification('Failed to verify pharmacy.', 'error');
            }
        } catch (error) {
            console.error('Error verifying pharmacy:', error);
            showNotification('Error verifying pharmacy. Please try again.', 'error');
        }
    };

    const deletePharmacy = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/pharmacy/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                setPharmacies(pharmacies.filter(pharmacy => pharmacy._id !== id));
                setSelectedPharmacy(null);
                showNotification('Pharmacy deleted successfully!', 'success');
            } else {
                showNotification('Failed to delete pharmacy!', 'error');
            }
        } catch (error) {
            console.error('Error deleting pharmacy:', error);
            showNotification('Error deleting pharmacy. Please try again.', 'error');
        }
    };

    // Modal for confirmation
    const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 max-w-md w-full mx-4">
                    <h3 className="text-lg font-semibold mb-4">{title}</h3>
                    <p className="mb-6 text-gray-600">{message}</p>
                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors w-full sm:w-auto"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors w-full sm:w-auto"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState({ type: '', id: '' });

    const handleActionConfirm = () => {
        if (modalAction.type === 'verify') {
            verifyPharmacy(modalAction.id);
        } else if (modalAction.type === 'delete') {
            deletePharmacy(modalAction.id);
        }
        setConfirmModalOpen(false);
    };

    const openConfirmationModal = (type, id) => {
        setModalAction({ type, id });
        setConfirmModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            {/* Notification */}
            {notification.show && (
                <div 
                    className={`fixed top-4 right-4 left-4 sm:left-auto p-4 rounded-md shadow-md ${
                        notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    } text-white max-w-sm z-50`}
                >
                    {notification.message}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Pharmacy Approval Requests</h1>
                <div className="text-gray-500">
                    {pharmacies.length} {pharmacies.length === 1 ? 'pharmacy' : 'pharmacies'} pending approval
                </div>
            </div>

            {/* Cards view for pharmacies */}
            {pharmacies.length === 0 ? (
                <div className="text-center py-10">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No pending approvals</h3>
                    <p className="mt-1 text-sm text-gray-500">All pharmacy requests have been processed.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {pharmacies.map(pharmacy => (
                        <div 
                            key={pharmacy._id} 
                            className={`border rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
                                selectedPharmacy === pharmacy._id ? 'ring-2 ring-orange-500' : ''
                            }`}
                            onClick={() => setSelectedPharmacy(selectedPharmacy === pharmacy._id ? null : pharmacy._id)}
                        >
                            <div className="bg-gray-50 px-3 py-3 sm:px-4 sm:py-5 border-b">
                                <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900 truncate">{pharmacy.name}</h3>
                            </div>
                            <div className="px-3 py-3 sm:px-4 sm:py-5">
                                <dl className="space-y-1 sm:space-y-2">
                                    <div className="flex flex-col sm:grid sm:grid-cols-3 sm:gap-2">
                                        <dt className="text-sm font-medium text-gray-500">Address</dt>
                                        <dd className="text-sm text-gray-900 sm:col-span-2">{pharmacy.address}</dd>
                                    </div>
                                    
                                    {pharmacy.email && (
                                        <div className="flex flex-col sm:grid sm:grid-cols-3 sm:gap-2">
                                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                                            <dd className="text-sm text-gray-900 sm:col-span-2 break-words">{pharmacy.email}</dd>
                                        </div>
                                    )}
                                    
                                    {pharmacy.phone && (
                                        <div className="flex flex-col sm:grid sm:grid-cols-3 sm:gap-2">
                                            <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                            <dd className="text-sm text-gray-900 sm:col-span-2">{pharmacy.phone}</dd>
                                        </div>
                                    )}
                                    
                                    {pharmacy.registrationDate && (
                                        <div className="flex flex-col sm:grid sm:grid-cols-3 sm:gap-2">
                                            <dt className="text-sm font-medium text-gray-500">Registered</dt>
                                            <dd className="text-sm text-gray-900 sm:col-span-2">
                                                {new Date(pharmacy.registrationDate).toLocaleDateString()}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                                
                                <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:space-x-3">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openConfirmationModal('verify', pharmacy._id);
                                        }}
                                        className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Verify
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openConfirmationModal('delete', pharmacy._id);
                                        }}
                                        className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleActionConfirm}
                title={modalAction.type === 'verify' ? 'Verify Pharmacy' : 'Reject Pharmacy'}
                message={
                    modalAction.type === 'verify'
                        ? 'Are you sure you want to verify this pharmacy? This will allow them to operate on the platform.'
                        : 'Are you sure you want to reject this pharmacy? This action cannot be undone.'
                }
            />
        </div>
    );
};

export default AdminApprovals;