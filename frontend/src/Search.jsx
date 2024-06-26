

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from './App'; // Import the theme context
import axiosInstance from './axiosConfig';
import { Helmet, HelmetProvider} from 'react-helmet-async';
import { FaArrowLeft } from "react-icons/fa";



const Search = () => {
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('query');
  const { theme } = useTheme(); // Get the current theme
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const authToken = localStorage.getItem('authToken');

        // Fetch users based on search query
        const response = await axiosInstance.get(`/search?query=${searchQuery}`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        setUsers(response.data);

        // Fetch users that the current user is following
        const followingResponse = await axiosInstance.get(`/following`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        setFollowing(followingResponse.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [searchQuery]);

  const handleFollow = async (userId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      await axiosInstance.post(`/follow`, { user_id: userId }, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setFollowing([...following, userId]);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      await axiosInstance.post(`/unfollow`, { user_id: userId }, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setFollowing(following.filter(id => id !== userId));
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const isFollowing = (userId) => following.includes(userId);

  return (
    <HelmetProvider>
      <Helmet>
      <title>Search Results</title>
      <meta name="viewport" content="width=device-width, initial-scale=0.50, maximum-scale=1.0, user-scalable=yes" />
      </Helmet>
    
    <div className={`h-screen flex flex-row  mx-auto ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
    <div className="mb-4 onClick={() => navigate(-1)}relative">
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center mb-4 mt-2 ml-4 py-2 px-2 rounded-full  ${theme === 'dark' ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-white text-black hover:bg-gray-200'}`}
    >
      <FaArrowLeft className=" text-gray-400 w-5 h-5" />
    </button>
      </div>

      <div className="mx-auto  w-1/2 p-6 overflow-auto">

    <h1 className="text-base font-bold mb-4">Search Result</h1>
    {users.length > 0 ? (
      users.map((user) => (
        <div key={user.id} className={`mb-4 px-5 py-5 w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-md shadow-md`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {user.profile_image_url ? (
                <img src={user.profile_image_url} alt="Profile" className="w-10 h-10 rounded-full mr-4" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-500 mr-4">
                  No Image
                </div>
              )}
              <div>
                <button onClick={() => handleViewProfile(user.id)} className={`text-lg no-underline hover:underline font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {user.first_name} {user.last_name}
                </button>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <div>
              {isFollowing(user.id) ? (
                <button
                  onClick={() => handleUnfollow(user.id)}
                  className="py-1 px-2 bg-red-600 hover:bg-red-700 rounded-xl text-white"
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={() => handleFollow(user.id)}
                  className="py-1 px-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white"
                >
                  Follow
                </button>
              )}
            </div>
          </div>
        </div>
      ))
    ) : (
      <p>No users found</p>
    )}
  </div>
</div>
</HelmetProvider>

    );
  };

  export default Search;
