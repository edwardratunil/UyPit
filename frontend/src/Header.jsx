
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import { Popover, Transition, Menu } from '@headlessui/react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './App'; // Import the theme context
import axiosInstance from './axiosConfig';
import axios from 'axios';

// import HeaderLogo from './Logo 3.png';
// import HeaderLogo2 from './Logo 1.png';

const Header = ({ onLogout, toggleSidebar, sidebarRef, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const headerRef = useRef(null);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    navigate(`/users?query=${searchQuery}`);
  };

  // const handleSearch = async () => {
  //   try {
  //     const authToken = localStorage.getItem('authToken');
  //     const response = await axios.get(`http://localhost:8000/api/users?search=${searchQuery}`, {
  //       headers: {
  //         Authorization: `Bearer ${authToken}`
  //       }
  //     });
  //     const searchResults = response.data;

  //     // Navigate to the Search page with the search results
  //     navigate('/search', { state: { searchResults } });
  //   } catch (error) {
  //     console.error('Error searching users:', error);
  //     if (error.response && error.response.status === 401) {
  //       // Token expired, handle token refresh here
  //       // For simplicity, you can redirect to login for token refresh
  //       navigate('/login');
  //     }
  //   }
  // };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const fetchNotifications = async () => {
    const authToken = localStorage.getItem('authToken');
    try {
      const response = await axiosInstance.get('/notifications', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setNotifications(response.data);
      setUnreadCount(response.data.filter(notification => !notification.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markNotificationsAsRead = async () => {
    const authToken = localStorage.getItem('authToken');
    try {
      await axiosInstance.post('/notifications/mark-as-read', {}, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      markNotificationsAsRead();
    }
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current && !dropdownRef.current.contains(event.target) &&
      headerRef.current && !headerRef.current.contains(event.target)
    ) {
      setShowNotifications(false);
    }
    if (
      sidebarRef.current && !sidebarRef.current.contains(event.target) &&
      headerRef.current && !headerRef.current.contains(event.target)
    ) {
      if (isSidebarOpen) {
        toggleSidebar(); // Close the sidebar if it's open
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Redirect to login if no user data found
      navigate('/login');
      window.location.reload();
    }
  }, [navigate]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]); // Only re-run the effect if isSidebarOpen changes

  const handleNotificationClick = async (notification) => {
    const authToken = localStorage.getItem('authToken');
    try {
      await axiosInstance.delete(`/notifications/${notification.id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setNotifications(prevNotifications => prevNotifications.filter(n => n.id !== notification.id));
      if (notification.type === 'message') {
        navigate(`/messages/${notification.related_id}`);
      } else if (notification.type === 'post' || notification.type === 'like') {
        navigate(`/posts/${notification.post_id}`);
      } else if (notification.type === 'comment') {
        navigate(`/posts/${notification.post_id}`);
      } else if (notification.type === 'follow') {
        navigate(`/profile/${notification.related_id}`);
      }

      setShowNotifications(false);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  

  return (
    <div className={`h-20 px-4 flex justify-between items-center border-b border-gray-100 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className='flex-1 flex justify-center items-center'>
        <div className='relative flex ml-10'>
          <HiOutlineSearch fontSize={20} className='ml-[14rem] text-gray-400 absolute top-1/2 transform -translate-y-1/2 left-3' />
    {/* <div ref={headerRef} className={`fixed w-full flex items-center justify-between p-4 shadow-md z-30 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <button onClick={toggleSidebar} className="sidebar-toggle-button md:hidden text-2xl">
        ☰
      </button>
      <div className="text-3xl font-bold text-center">
        <img 
          src={theme === 'dark' ? "HeaderLogo" : "HeaderLogo2"} 
          alt='Logo'
          className="w-auto h-14 mt-0 ml-2 rounded-xl"
        />
      </div> */}
        <input
          type="text"
          placeholder="  Search users"
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-8 pr-32 py-2 border rounded-xl flex-grow ml-56"
        />
        <button type="submit" onClick={handleSearch} className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl transition duration-200 text-white ml-2">
          Search
        </button>
      <div className="flex space-x-4 ml-4 ">
        <button
          onClick={toggleNotifications}
          className={` py-2 px-4 text-white rounded-full ml-32 ${theme === 'dark' ? 'bg-gray-0 text-white' : 'bg-white text-black'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-7 active:fill-indigo-500 ${theme === 'dark' ? 'text-white fill-indigo-500 hover:fill-indigo-300' : 'fill-indigo-500 text-black hover:fill-indigo-700'}`}>
            <path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z" />
            <path fillRule="evenodd" d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z" clipRule="evenodd" />
          </svg>
          {unreadCount > 0 && <span className="absolute bottom-auto top-0 z-10 inline-block -translate-y-1/2 translate-x-2/4 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 rounded-full bg-red-700 p-2 text-xs">{unreadCount}</span>}
        </button>
        {showNotifications && (
          <div ref={dropdownRef} className={`absolute mt-14 w-80 max-h-96 overflow-y-auto left-auto right-0 top-0 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'} rounded-xl shadow-lg`}>
            <ul className="p-4">
              {notifications.length === 0 ? (
                <li className="p-2">No notifications</li>
              ) : (
                notifications.map(notification => (
                  <li
                    key={notification.id}
                    className="p-2 border-b border-gray-200 cursor-pointer"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <p>{notification.message}</p>
                    <p className="text-sm text-gray-500">
                      {notification.formatted_date ? ` | ${notification.formatted_date}` : ''}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
        <button
          onClick={toggleTheme}
          className={`py-2 px-4 text-white right-0 ${theme === 'dark' ? 'text-white bg-slate-200 hover:bg-slate-300' : 'bg-gray-800 text-black hover:bg-gray-900'} rounded-full shadow-lg`}
        >
          {theme === 'dark' ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 fill-gray-900">
            <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
          </svg>
            : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 fill-gray-200">
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
            </svg>
          }
        </button>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Header;
