// CreateUserModal.jsx
import React, { useState } from 'react';
import axiosInstance from './axiosConfig';
import { useTheme } from './App'; // Assuming the theme context is in App.js

const CreateUserModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    address: '',
    birthdate: '',
    gender: 'Male',
    role: 'user',
  });

  const { theme } = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem('authToken');
    try {
      await axiosInstance.post('/admin/users', formData, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      onCreate();
      onClose();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className={`p-6 rounded-lg shadow-lg w-full max-w-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-xl font-bold mb-4">Create User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            />
          </div>
          <div className="mb-4">
            <label className="block">Birthdate</label>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            />
          </div>
          <div className="mb-4">
            <label className="block">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            >
              <option value="Male" className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>Male</option>
              <option value="Female" className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>Female</option>
              <option value="Other" className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
