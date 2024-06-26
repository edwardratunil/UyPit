import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineUser, AiOutlineLock, AiOutlineHome, AiOutlineCalendar, AiOutlineMail, AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; 
import HeaderLogo from './Logo 4.png';
import axiosInstance from './axiosConfig';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Swal from 'sweetalert2';

const RegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Registration</title>
        <meta name="viewport" content="width=device-width, initial-scale=0.50, maximum-scale=1.0, user-scalable=yes" />
      </Helmet>
      <div className="relative flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('/src/backgroundimg.png')` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md"></div>
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="flex flex-col items-center">
            <img 
              src={HeaderLogo} 
              alt='Logo'
              className="h-24 w-auto mb-6"
            />
            <h2 className="text-3xl font-bold text-center mb-4 text-black">Create a new account</h2>
            <p className="text-center font-medium mb-8 text-black">
              Or{' '}
              <button
                type="button"
                className="ml-1 text-blue-600 hover:text-blue-500"
                onClick={navigateToLogin}
              >
                login to your account
              </button>
            </p>
            {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-600 pl-10"
                  placeholder="Email"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <AiOutlineMail className="h-5 w-5 text-gray-400" />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-600 pl-10"
                  placeholder="Password"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <AiOutlineLock className="h-5 w-5 text-gray-400" />
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button type="button" onClick={togglePasswordVisibility} className="focus:outline-none">
                    {showPassword ? <AiFillEyeInvisible className="h-5 w-5 text-gray-400" /> : <AiFillEye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
              </div>

              <div className="relative">
                <input
                  type="text"
                  id="first-name"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-600 pl-10"
                  placeholder="First Name"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <AiOutlineUser className="h-5 w-5 text-gray-400" />
                </div>
                {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name[0]}</p>}
              </div>

              <div className="relative">
                <input
                  type="text"
                  id="last-name"
                  value={lastName}
                  onChange={handleLastNameChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-600 pl-10"
                  placeholder="Last Name"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <AiOutlineUser className="h-5 w-5 text-gray-400" />
                </div>
                {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name[0]}</p>}
              </div>

              <div className="relative">
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-600 pl-10"
                  placeholder="Address"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <AiOutlineHome className="h-5 w-5 text-gray-400" />
                </div>
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address[0]}</p>}
              </div>

              <div className="relative">
                <input
                  type="date"
                  id="birthdate"
                  value={birthdate}
                  onChange={handleBirthdateChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-600 pl-10"
                  placeholder="Birth Date"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <AiOutlineCalendar className="h-5 w-5 text-gray-400" />
                </div>
                {errors.birthdate && <p className="text-red-500 text-sm mt-1">{errors.birthdate[0]}</p>}
              </div>

              <div className="relative">
                <select
                  id="gender"
                  value={gender}
                  onChange={handleGenderChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-600 pl-10"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <AiOutlineUser className="h-5 w-5 text-gray-400" />
                </div>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender[0]}</p>}
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Register
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
