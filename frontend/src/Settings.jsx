import React, { useState, useEffect } from 'react';
import { useTheme } from './App';
import { useUser } from './UserContext';
import Swal from 'sweetalert2';
import axiosInstance from './axiosConfig';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Settings = () => {
  const { theme } = useTheme();
  const { user, setUser } = useUser();
  const [openTab, setOpenTab] = useState(1);
  const [editInfo, setEditInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    birthdate: '',
    gender: ''
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      const formattedBirthdate = user.birthdate ? user.birthdate.split('T')[0] : '';
      setEditInfo({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        address: user.address || '',
        birthdate: formattedBirthdate,
        gender: user.gender || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setEditInfo({ ...editInfo, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleProfileImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleTabClick = (tabNumber) => {
    setOpenTab(tabNumber);
  };

  const handleEditInfoSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem('authToken');
    setErrors({}); // Clear previous errors

    try {
      await axiosInstance.put('/update', {
        firstName: editInfo.firstName,
        lastName: editInfo.lastName,
        email: editInfo.email,
        address: editInfo.address,
        birthdate: editInfo.birthdate,
        gender: editInfo.gender,
      }, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      Swal.fire('Success', 'Information updated successfully', 'success');
      // Optionally refetch user data to ensure the latest info is displayed
      const response = await axiosInstance.get('/user', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(response.data);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
        Swal.fire('Error', 'Validation Error: ' + JSON.stringify(error.response.data.errors), 'error');
      } else {
        console.error('Error updating information:', error);
        Swal.fire('Error', 'Failed to update information', 'error');
      }
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem('authToken');
    setErrors({}); // Clear previous errors

    if (passwords.newPassword !== passwords.confirmPassword) {
      Swal.fire('Error', 'New passwords do not match', 'error');
      return;
    }

    try {
      await axiosInstance.post('/user/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
        newPassword_confirmation: passwords.confirmPassword
      }, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      Swal.fire('Success', 'Password changed successfully', 'success');
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
        Swal.fire('Error', 'Validation Error: ' + JSON.stringify(error.response.data.errors), 'error');
      } else {
        console.error('Error changing password:', error);
        Swal.fire('Error', 'Failed to change password', 'error');
      }
    }
  };

  const handleProfileImageSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('profile_image', profileImage);

    try {
      await axiosInstance.post('/user/upload-profile-image', formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire('Success', 'Profile image uploaded successfully', 'success');
      // Refresh user data to get updated profile image URL
      const response = await axiosInstance.get('/user', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error uploading profile image:', error);
      Swal.fire('Error', 'Failed to upload profile image', 'error');
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Settings</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
      </Helmet>

      <div className={`{w-full h-[91vh] flex flex-col md:flex-row ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <div className={`flex flex-col lg:w-1/5  p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
          <h1 className="mb-8 text-2xl font-semibold">Settings</h1>
          <button
            className={`cursor-pointer text-left w-full mb-4 px-3 py-2 font-semibold transition 
              ${openTab === 1 ? 'text-indigo-500 border-l-2 border-indigo-500' : 'text-dark hover:text-indigo-500'}`}
            onClick={() => handleTabClick(1)}
          >
            Profile Picture
          </button>
          <button
            className={`cursor-pointer text-left w-full mb-4 px-3 py-2 font-semibold transition 
              ${openTab === 2 ? 'text-indigo-500 border-l-2 border-indigo-500' : 'text-dark hover:text-indigo-500'}`}
            onClick={() => handleTabClick(2)}
          >
            Edit Profile
          </button>
          <button
            className={`cursor-pointer text-left w-full mb-4 px-3 py-2 font-semibold transition 
              ${openTab === 3 ? 'text-indigo-500 border-l-2 border-indigo-500' : 'text-dark hover:text-indigo-500'}`}
            onClick={() => handleTabClick(3)}
          >
            Change Password
          </button>
        </div>

        <div className="h-72 border-gray-300 mt-4 border-l md:ml-0" />

        <div className="flex-grow p-6 md:ml-6">
          {user ? (
            <>
              {openTab === 1 && (
                <div>
                  <h2 className="text-xl mb-8 mt-0 pl-3 font-semibold">Profile Picture</h2>
                  <div className={`p-6 max-w-lg rounded-md ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                    {user.profile_image_url && (
                      <div className="flex justify-center">
                        <img
                          src={user.profile_image_url}
                          alt="Profile"
                          className="w-40 h-40 rounded-full object-cover border border-indigo-500"
                        />
                      </div>
                    )}
                    <form onSubmit={handleProfileImageSubmit} className="mt-6 space-y-4">
                      <div className="flex flex-col">
                        <input
                          id="profileImageInput"
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageChange}
                          className={`w-[20rem] px-3 py-2 mt-1 mx-auto items-center border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}
                        />
                        <div className="flex justify-center mt-4">
                          <button
                            type="submit"
                            className={`px-4 py-2 ml-60 text-white bg-indigo-500 rounded-md focus:outline-none hover:bg-indigo-600 ${
                              theme === 'dark' ? 'bg-gray-800' : 'bg-indigo-700'
                            }`}
                          >
                            Upload
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {openTab === 2 && (
                <div>
                  <div className={`p-0 max-w-lg  ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                    <h2 className="text-xl mb-8 mt-0 pl-3 font-semibold">Edit Profile</h2>
                    <form onSubmit={handleEditInfoSubmit} className="space-y-4 ml-16">
                      <div className="flex flex-col space-y-4 ">
                        <label className="text-base font-medium">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={editInfo.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'
                          }`}
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName[0]}</p>}
                      </div>
                      <div className="flex flex-col space-y-4">
                        <label className="text-base font-medium">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={editInfo.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'
                          }`}
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName[0]}</p>}
                      </div>
                      <div className="flex flex-col space-y-4">
                        <label className="text-base font-medium">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={editInfo.email}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'
                          }`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
                      </div>
                      <div className="flex flex-col space-y-4">
                        <label className="text-base font-medium">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={editInfo.address}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'
                          }`}
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address[0]}</p>}
                      </div>
                      <div className="flex flex-col space-y-4">
                        <label className="text-base font-medium">Birthdate</label>
                        <input
                          type="date"
                          name="birthdate"
                          value={editInfo.birthdate}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'
                          }`}
                        />
                        {errors.birthdate && <p className="text-red-500 text-sm mt-1">{errors.birthdate[0]}</p>}
                      </div>
                      <div className="flex flex-col space-y-4">
                        <label className="text-base font-medium">Gender</label>
                        <select
                          name="gender"
                          value={editInfo.gender}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'
                          }`}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender[0]}</p>}
                      </div>
                      <div className="flex items-center justify-end">
                        <button
                          type="submit"
                          className={`px-4 py-2 text-white bg-indigo-500 rounded-md focus:outline-none hover:bg-indigo-600 ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-indigo-700'
                          }`}
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {openTab === 3 && (
                <div className={`p-0 max-w-lg  ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                  <h2 className="text-xl mb-8 mt-0 font-semibold">Change Password</h2>
                  <form onSubmit={handleChangePasswordSubmit} className="space-y-4 ml-16">
                    <div className="flex flex-col space-y-4">
                      <label className="text-base font-medium">Current Password</label>
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwords.currentPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-3 py-2 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
                      />
                      <label className={`text-base font-medium ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>New Password</label>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-3 py-2 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
                      />
                      <label className={`text-base font-medium ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>Confirm New Password</label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-3 py-2 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
                      />
                    </div>
                    <div className="flex items-center justify-end">
                      <button
                        type="submit"
                        className={`px-4 py-2 text-white bg-indigo-500 rounded-md focus:outline-none hover:bg-indigo-600 ${
                          theme === 'dark' ? 'bg-gray-800' : 'bg-indigo-700'
                        }`}
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          ) : (
            <p>Loading user information...</p>
          )}
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Settings;

