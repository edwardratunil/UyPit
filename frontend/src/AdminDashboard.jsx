// AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosConfig';
import EditUserModal from './EditUserModal';
import CreateUserModal from './CreateUserModal';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const authToken = localStorage.getItem('authToken');
    try {
      const response = await axiosInstance.get('/admin/users', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setEditModalOpen(true);
  };

  const handleCreate = () => {
    setCreateModalOpen(true);
  };

  const closeEditModal = () => {
    setCurrentUser(null);
    setEditModalOpen(false);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleUserUpdate = () => {
    fetchUsers();
  };

  const handleDelete = async (userId) => {
    const authToken = localStorage.getItem('authToken');
    try {
      await axiosInstance.delete(`/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleCreate}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Create Account
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">First Name</th>
              <th className="border border-gray-300 p-2">Last Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Address</th>
              <th className="border border-gray-300 p-2">Birthdate</th>
              <th className="border border-gray-300 p-2">Gender</th>
              <th className="border border-gray-300 p-2">Role</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border border-gray-300 p-2">{user.first_name}</td>
                <td className="border border-gray-300 p-2">{user.last_name}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">{user.address}</td>
                <td className="border border-gray-300 p-2">{user.birthdate.split('T')[0]}</td>
                <td className="border border-gray-300 p-2">{user.gender}</td>
                <td className="border border-gray-300 p-2">{user.role}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        user={currentUser}
        onUpdate={handleUserUpdate}
      />
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onCreate={handleUserUpdate}
      />
    </div>
  );
};

export default AdminDashboard;
