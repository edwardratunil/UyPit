import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './App'; // Import the theme context
import axiosInstance from './axiosConfig';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Following = () => {
  const [expanded, setExpanded] = useState(true);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const { theme } = useTheme(); // Get the current theme
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowingAndFollowers = async () => {
      const authToken = localStorage.getItem('authToken');
      try {
        // Fetch the IDs of the users the current user is following
        const followingResponse = await axiosInstance.get('/following', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        const followingUserIds = followingResponse.data;

        // Fetch details of each followed user
        const followingDetails = await Promise.all(followingUserIds.map(async (userId) => {
          const userResponse = await axiosInstance.get(`/users/${userId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          return { ...userResponse.data, id: userId }; // Ensure each user has a unique id
        }));

        setFollowing(followingDetails);

        // Fetch the IDs of the users following the current user
        const followersResponse = await axiosInstance.get('/followers', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        const followersUserIds = followersResponse.data;

        // Fetch details of each follower
        const followersDetails = await Promise.all(followersUserIds.map(async (userId) => {
          const userResponse = await axiosInstance.get(`/users/${userId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          return { ...userResponse.data, id: userId }; // Ensure each user has a unique id
        }));

        setFollowers(followersDetails);
      } catch (error) {
        console.error('Error fetching following or followers:', error);
      }
    };

    fetchFollowingAndFollowers();
  }, []);

  const handleUnfollow = async (userId) => {
    const authToken = localStorage.getItem('authToken');
    try {
      await axiosInstance.post(`/unfollow`, { user_id: userId }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setFollowing(following.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleMessage = (userId) => {
    navigate(`/messages/${userId}`);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Friends</title>
        <meta name="viewport" content="width=device-width, initial-scale=0.50, maximum-scale=1.0, user-scalable=yes" />
      </Helmet>
      <div className={`h-[91vh] text-gray-900 flex ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <div className="container mx-auto p-6 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
          <div className={`flex-1 p-6 overflow-auto ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <h1 className="text-xl font-bold mb-4">Following ({following.length})</h1>
            {following.length > 0 ? (
              following.map((user) => (
                <div key={user.id} className={`mb-4 p-4 w-auto mx-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl shadow-md`}>
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                      {user.profile_image_url ? (
                        <img src={user.profile_image_url} alt="Profile" className="w-10 h-10 rounded-full mr-4" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-500 mr-4">
                          No Image
                        </div>
                      )}
                      <div>
                        <button
                          onClick={() => handleViewProfile(user.id)}
                          className={`text-lg no-underline hover:underline font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                        >
                          {user.first_name} {user.last_name}
                        </button>
                        <p className={`text-gray-600 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUnfollow(user.id)}
                        className="py-1 px-2 bg-red-600 hover:bg-red-700 rounded-xl text-white"
                      >
                        Unfollow
                      </button>
                      <button
                        onClick={() => handleMessage(user.id)}
                        className="py-1 px-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white"
                      >
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>You are not following any users.</p>
            )}
          </div>
          <div className={`flex-1 p-6 overflow-auto ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <h1 className="text-xl font-bold mb-4">Followers ({followers.length})</h1>
            {followers.length > 0 ? (
              followers.map((user) => (
                <div key={user.id} className={`mb-4 p-4 w-auto  mx-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl shadow-md ${expanded ? "w-auto" : "w-4/5"}`}>
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                      {user.profile_image_url ? (
                        <img src={user.profile_image_url} alt="Profile" className="w-10 h-10 rounded-full mr-4" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-500 mr-4">
                          No Image
                        </div>
                      )}
                      <div>
                        <button
                          onClick={() => handleViewProfile(user.id)}
                          className={`text-lg no-underline hover:underline font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                        >
                          {user.first_name} {user.last_name}
                        </button>
                        <p className="text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleMessage(user.id)}
                        className="py-1 px-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white"
                      >
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>You have no followers.</p>
            )}
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Following;
