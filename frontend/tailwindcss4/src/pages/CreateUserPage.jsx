import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateUserPage = () => {
  const [formData, setFormData] = useState({
    userId: '',
    username: '',
    password: '',
    email: '',
    roles: '',
    managerName: '',
    managerId: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('Authorization');  
      console.log(`${token}`);
      const response = await axios.post('http://localhost:8080/hr/createUser', formData, {
        headers: { Authorization: `${token}` }
      });
      
      // Show success message
      alert('User created successfully!');
      
      // Navigate back to HR dashboard
      navigate('/hr');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-blue-100 fixed inset-0 text-white">
      <div className="relative z-10 flex flex-col justify-center items-center w-full max-w-md p-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl w-full p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-300">Create New User</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">User ID</label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-blue-900/50 border border-blue-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-blue-900/50 border border-blue-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-blue-900/50 border border-blue-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-blue-900/50 border border-blue-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Role</label>
              <select
                name="roles"
                value={formData.roles}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    roles: Array.from(e.target.selectedOptions, (option) => option.value),
                  })
                }
                required
                className="w-full px-3 py-2 bg-blue-900/50 border border-blue-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Role</option>
                <option value="HR">HR</option>
                <option value="MANAGER">Manager</option>
                <option value="EMPLOYEE">Employee</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Manager Name</label>
              <input
                type="text"
                name="managerName"
                value={formData.managerName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-blue-900/50 border border-blue-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Manager ID</label>
              <input
                type="text"
                name="managerId"
                value={formData.managerId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-blue-900/50 border border-blue-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;