import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosConfig';
import { AiOutlineMail } from 'react-icons/ai';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    try {
      const response = await axiosInstance.post('/forgot-password', { email });
      setMessage('If your email is registered, you will receive a password reset link.');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Something went wrong. Please try again later.' });
      }
    }
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full md:w-80rem">
        <div className="flex flex-col justify-center items-center py-12 px-6 md:px-12">
          <p className="text-3xl font-bold text-center md:text-5xl mb-4 text-black">Forgot Password</p>
          <p className="text-center font-medium md:text-left mb-8 text-black">Enter your email to reset your password</p>

          {message && <p className="text-green-500 mb-4">{message}</p>}
          {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}

          <form onSubmit={handleForgotPassword} className="flex flex-col items-stretch w-full max-w-md relative">
            <div className="relative mb-4">
              <input
                className="w-full px-4 py-2 text-base border-2 rounded-xl transition bg-white text-black focus:outline-none focus:border-indigo-600 pl-10"
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

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-xl font-semibold text-base transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Reset Password
            </button>
          </form>

          <button
            type="button"
            onClick={navigateToLogin}
            className="mt-1 font-semibold text-center text-gray-900"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
