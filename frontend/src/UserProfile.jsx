import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from './App';
import axiosInstance from './axiosConfig';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [openTab, setOpenTab] = useState(1);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { theme } = useTheme(); // Get the current theme

  useEffect(() => {
    const fetchUserData = async () => {
      const authToken = localStorage.getItem('authToken');
      try {
        const userResponse = await axiosInstance.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUser(userResponse.data);

        const postsResponse = await axiosInstance.get(`/users/${userId}/posts`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setPosts(postsResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data. Please try again.');
      }
    };

    fetchUserData();
  }, [userId]);

  const handleTabClick = (tabNumber) => {
    setOpenTab(tabNumber);
  };

  const handleViewPost = (postId) => {
    navigate(`/posts/${postId}`);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <HelmetProvider>
      <Helmet>
      <title>{user.first_name} {user.last_name}</title>
      <meta name="viewport" content="width=device-width, initial-scale=0.50, maximum-scale=1.0, user-scalable=yes" />
      </Helmet>

      <div className={`h-[91vh] overflow-auto ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="flex flex-row justify-center"></div>
      <div className={`bg-indigo-400 p-4 h-56 rounded-2xl mt-6   ml-15 mx-auto w-[40rem] ${theme === 'dark' ? 'bg-gray-900 text-white ' : ' text-black '}`}>
      </div>
      <div className={`mx-auto -mt-16 w-32 h-32 rounded-full border-4  overflow-hidden  ${theme === 'dark' ? 'bg-gray-900 text-white border-gray-900' : 'bg-slate-100 text-black border-gray-200'}`}>
        {user.profile_image_url ? (
            <img src={user.profile_image_url} alt="Profile" className="w-full h-full object-cover bg-white" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center   ${theme === 'dark' ? 'bg-gray-900 text-white ' : 'bg-slate-100 text-black '}`}>
              No Image
            </div>
          )}
        </div>

        <div className="text-center mt-4">
          <h2 className="font-semibold text-2xl">{`${user.first_name} ${user.last_name}`}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* Header */}
        <div className={`py-4 shadow-md mt-10 w-[39rem] mx-auto rounded-xl ${theme === 'dark' ? 'bg-gray-800 text-white ' : 'bg-gray-100 text-black '}`}>
          <div className="flex justify-between items-center px-4 md:px-10">
          <div className={`flex space-x-4 ${theme === 'dark' ? 'bg-gray-800 text-white ' : 'bg-gray-100 text-black '}`}>
          <button
                className={`px-3 py-2 font-bold text-base transition ${openTab === 1 ? 'text-indigo-600 border-b-2 border-indigo-600' : ' hover:text-indigo-600'} ${theme === 'dark' ? ' text-white ' : ' text-black '}`}
                onClick={() => handleTabClick(1)}
              >
                Posts
              </button>
              <button
                className={`px-3 py-2 font-bold text-base transition ${openTab === 2 ? 'text-indigo-600 border-b-2 border-indigo-600' : ' hover:text-indigo-600'}`}
                onClick={() => handleTabClick(2)}
              >
                About
              </button>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        {openTab === 1 && (
          <div className="justify-center items-center flex flex-col md:flex-row mt-2">
            <div className="col-span-2 space-y-4 w-[50rem]">
              {posts.length > 0 ? (
                posts.map(post => (
                  <div key={post.id} className={`mb-4 p-4 rounded-xl mt-4 mx-auto w-[39rem] shadow-md bg-gray-100 text-black ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm mb-5">
                        <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{`${user.first_name} ${user.last_name}`}</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-50' : 'text-gray-500'}`}>{moment(post.created_at).format('MMMM Do YYYY @ h:mm a')}</p>
                      </div>
                    </div>
                    <p>{post.content}</p>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleViewPost(post.id)}
                        className="py-1 px-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white ml-auto"
                      >
                        View Post
                      </button>
                    </div>
                    <div className="mt-4 space-y-2">
                      {(post.comments || []).map((comment) => (
                        <div key={comment.id} className={`p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-xl`}>
                          <div className="text-sm">
                            {comment.user && `${comment.user.first_name} ${comment.user.last_name} on ${moment(comment.created_at).format('MMMM Do YYYY, h:mm:ss a')}`}
                          </div>
                          <p className="mt-2 ">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className={`text-gray-700 flex items-center justify-center font-extrabold mt-20 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>No posts found</p>
              )}
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </div>
        )}

        {/* About Section */}
        {openTab === 2 && (
          <div className="justify-center flex flex-col md:flex-row mt-2 ml-[0rem]">
            <div className="col-span-2 space-y-4 w-[50rem]">
            <ul className={`divide-y mx-auto w-[39rem] rounded-xl mt-3 py-2 px-3  shadow-md   ${theme === 'dark' ? 'bg-gray-800 text-white ' : 'bg-gray-100 text-black '}`}>
            <li className="flex items-center py-3 text-sm">
                  <span>First Name</span>
                  <span className="ml-auto"> {user.first_name}</span>
                </li>
                <li className="flex items-center py-3 text-sm">
                  <span>Last Name</span>
                  <span className="ml-auto"> {user.last_name}</span>
                </li>
                <li className="flex items-center py-3 text-sm">
                  <span>Address</span>
                  <span className="ml-auto">{user.address}</span>
                </li>
                <li className="flex items-center py-3 text-sm">
                  <span>Birthday</span>
                  <span className="ml-auto">{moment(user.birthdate).format('MMMM Do YYYY')}</span>
                </li>
                <li className="flex items-center py-3 text-sm">
                  <span>Gender</span>
                  <span className="ml-auto">{user.gender}</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </HelmetProvider>
  );
};
export default UserProfile;
