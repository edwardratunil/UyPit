// EditUserModal.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosConfig';
import { useTheme } from './App'; // Assuming the theme context is in App.js

const EditUserModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    birthdate: '',
    gender: '',
    role: '',
  });

  const { theme } = useTheme();

  useEffect(() => {
    if (user) {
      const formattedDate = user.birthdate ? user.birthdate.split('T')[0] : '';
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        address: user.address,
        birthdate: formattedDate,
        gender: user.gender,
        role: user.role,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/admin/users/${user.id}`, formData);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className={`bg-white p-6 rounded-lg shadow-lg w-full max-w-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
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
              className="w-full px-3 py-2 border rounded"
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
              className="w-full px-3 py-2 border rounded"
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
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block">Birthdate</label>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
