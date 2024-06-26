import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineUser, AiOutlineLock, AiOutlineHome, AiOutlineCalendar, AiOutlineMail } from 'react-icons/ai'; 
import HeaderLogo from './Logo 4.png';
import axiosInstance from './axiosConfig';
import { Helmet, HelmetProvider} from 'react-helmet-async';
import Swal from 'sweetalert2';

const RegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleFirstNameChange = (e) => setFirstName(e.target.value);
  const handleLastNameChange = (e) => setLastName(e.target.value);
  const handleAddressChange = (e) => setAddress(e.target.value);
  const handleBirthdateChange = (e) => setBirthdate(e.target.value);
  const handleGenderChange = (e) => setGender(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      address,
      birthdate,
      gender,
    };

    try {
      const registrationResponse = await axiosInstance.post('/register', formData);
      console.log('Registration response:', registrationResponse);

      if (registrationResponse.data) {
        const loginData = { email, password };
        const loginResponse = await axiosInstance.post('/dashboard', loginData);
        console.log('Login response:', loginResponse);

        if (loginResponse.data) {
          const { token, user } = loginResponse.data;
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(user));

          console.log('Registration Successful!');
          Swal.fire('Success', 'Registration Successful!', 'success' );
          navigate('/login');
        } else {
          console.log('Login failed');
        }
      } else {
        Swal.fire('Error', 'Registration failed.', 'error');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error('Error:', error);
        Swal.fire('Error', 'Registration or login failed. Please try again.', 'error');
      }
    }
  };

  const navigateToLogin = () => navigate('/login');

  return (
    <HelmetProvider>
      <Helmet>
        <title>Registration</title>
        <meta name="viewport" content="width=device-width, initial-scale=0.50, maximum-scale=1.0, user-scalable=yes" />
      </Helmet>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img 
            src={HeaderLogo} 
            alt='Logo'
            className="mx-auto h-14 w-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create a new account
          </h2>

          <p className="mt-2 text-center text-sm text-gray-600">
            Or
            <button
              type="button"
              className="ml-1 text-blue-600 hover:text-blue-500"
              onClick={navigateToLogin}
            >
              login to your account
            </button>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <AiOutlineMail className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <AiOutlineLock className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
              </div>

              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="first-name"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <AiOutlineUser className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name[0]}</p>}
              </div>

              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="last-name"
                    value={lastName}
                    onChange={handleLastNameChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <AiOutlineUser className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name[0]}</p>}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <AiOutlineHome className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address[0]}</p>}
              </div>

              <div>
                <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
                  Birth Date
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="date"
                    id="birthdate"
                    value={birthdate}
                    onChange={handleBirthdateChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <AiOutlineCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {errors.birthdate && <p className="text-red-500 text-sm mt-1">{errors.birthdate[0]}</p>}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <select
                    id="gender"
                    value={gender}
                    onChange={handleGenderChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-10"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <AiOutlineUser className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender[0]}</p>}
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Create account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default RegistrationForm;
