import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
function PrescriptionUpload() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const getToken = () => {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : '';
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(''); // Clear any previous errors
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setSuccessMessage('');
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('prescription', selectedFile); // Use the same name as expected in the backend

    setLoading(true);
    fetch('/api/prescriptions', {
      method: 'POST',
      headers: { 'Authorization': getToken()
      },
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            // Handle unauthorized error (e.g., token expired)
            setError('Unauthorized: Please log in again.');
            // Optionally, redirect to the login page
            // navigate('/login');
          } else {
            throw new Error('File upload failed');
          }
        }
        setSuccessMessage('File uploaded successfully!');
        setError('');
        return response.json();
      })
      .then(data => {
        console.log('File uploaded successfully:', data);
        // Reset the selected file after successful submission
        setSelectedFile(null);

        // Optionally, redirect or show a success message
        // navigate('/profile');
      })
      .catch(error => {
        setSuccessMessage('');
        console.error('Error uploading file:', error);
        setError('Failed to upload prescription. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload Prescription</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Select Prescription File"
          type="file"
          onChange={handleFileChange}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

        <Button type="submit" disabled={loading} className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          {loading ? 'Uploading...' : 'Upload Prescription'}
        </Button>
      </form>
    </div>
  );
}

export default PrescriptionUpload;