import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosConfig';
import HeaderLogo from './Logo 2.png';
import { AiOutlineLock, AiOutlineMail } from 'react-icons/ai';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    try {
      const response = await axiosInstance.post('/login', { email, password });
      const { token, user } = response.data;

      // Save the token and user info in local storage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      onLogin(); // Call the onLogin prop to update the isLoggedIn state in the App component

      navigate('/dashboard'); // Redirect to the dashboard route
      location.reload();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Something went wrong. Please try again later.' });
      }
    }
  };

  const navigateToRegister = () => navigate('/register');
  const navigateToForgotPassword = () => navigate('/forgot-password');

  return (
    <HelmetProvider>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="flex flex-col items-center">
            <img 
              src={HeaderLogo} 
              alt='Logo'
              className="h-24 w-auto mb-6"
            />
            <h2 className="text-3xl font-bold text-center mb-4 text-black">Welcome back</h2>
            <p className="text-center font-medium mb-8 text-black">Sign in to your account</p>

            {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}

            <form onSubmit={handleLogin} className="w-full space-y-6">
              <div className="relative">
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-600 pl-10"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <AiOutlineMail className="h-5 w-5 text-gray-400" />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
              </div>

              <div className="relative">
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-600 pl-10"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <AiOutlineLock className="h-5 w-5 text-gray-400" />
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Login
              </button>
              <p className="py-4 text-gray-600 text-center">
                <button
                  type="button"
                  onClick={navigateToForgotPassword}
                  className="font-semibold text-center text-gray-900"
                >
                  Forgot password?
                </button>
              </p>
              <p className="py-4 text-gray-600 text-center">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={navigateToRegister}
                  className="font-semibold text-center text-gray-900"
                >
                  Sign up.
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Login;