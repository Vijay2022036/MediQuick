import React, { useState, useEffect } from 'react';
import Button from '../UI/Button';
import Card from '../UI/Card';

function AdminPrescriptions() {
  const [prescriptions, setPrescriptions] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);


  const getToken = () => {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : '';
  };

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/prescriptions', {
          headers: { Authorization: getToken() },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch prescriptions');
        }

        const data = await response.json();
        setPrescriptions(data);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPrescriptions();
  }, []);

  const handleVerify = async (prescriptionId) => {
    try {
      const response = await fetch(`/api/prescriptions/${prescriptionId}/verify`, {
        method: 'PUT',
        headers: {
          Authorization: getToken(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to verify prescription');
      }

      // Update the state to reflect the change
      setPrescriptions(
        prescriptions.map((prescription) =>
          prescription._id === prescriptionId
            ? { ...prescription, verified: true }
            : prescription
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>;
  }

  return (
    <div className="container mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Prescriptions</h1>
      {error && <p className="text-red-500">{error}</p>}
      {prescriptions && prescriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prescriptions.map((prescription) => (
            <Card key={prescription._id} className="hover:shadow-md transition-shadow duration-200">
              <img src={`/${prescription.imageUrl}`} alt="Prescription" className="h-48 w-full object-cover rounded-t-lg" />
              <div className="p-4">
                <p className="text-gray-700"><strong>User:</strong> {prescription.user}</p>
                <p className="text-gray-700"><strong>Upload Date:</strong> {new Date(prescription.uploadDate).toLocaleDateString()}</p>
                <p className="text-gray-700"><strong>Verified:</strong> {prescription.verified ? 'Yes' : 'No'}</p>
                {!prescription.verified && (
                  <Button onClick={() => handleVerify(prescription._id)} className="mt-4">Verify</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-700">No prescriptions found.</p>
      )}
    </div>
  );
}

export default AdminPrescriptions;