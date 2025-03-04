import React, { useState } from 'react';
import axios from 'axios';

const UpdatePasswordModal = ({ isOpen, onClose }) => {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('Authorization');
      const userId = localStorage.getItem('userid');

      await axios.put(`http://localhost:8080/users/update-password/${userId}`,
        {
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword
        },
        {
          headers: { Authorization: token }
        }
      );

      alert('Password updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating password:', error);
      setError(error.response?.data?.message || 'Failed to update password');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-300">Update Password</h2>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={passwords.oldPassword}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-blue-900/50 border border-blue-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-blue-900/50 border border-blue-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">Confirm New Password</label>
            <input
              type="password"
              name="confirmNewPassword"
              value={passwords.confirmNewPassword}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-blue-900/50 border border-blue-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordModal;
