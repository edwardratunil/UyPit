import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosConfig';

const Header = ({ onLogout, toggleSidebar, sidebarRef, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
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
        toggleSidebar();
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
      navigate('/login');
      window.location.reload();
    }
  }, [navigate]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

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
    <div className="h-20 px-4 flex justify-between items-center border-b border-gray-100 bg-white text-black">
      <div className="flex items-center">
        <img
          src="src/Logo 1.png" // Replace with the path to your logo
          alt="Logo"
          className="h-10 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        />
      </div>
      <div className="flex-1 flex justify-center items-center">
        <form onSubmit={handleSearch} className="relative flex">
          <HiOutlineSearch fontSize={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
          <input
            type="text"
            placeholder="Search users"
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 border rounded-full bg-slate-500"
          />
          <button type="submit" className="ml-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white">
            Search
          </button>
        </form>
        <div className="flex items-center space-x-4 ml-4">
          <button
            onClick={toggleNotifications}
            className="relative py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-full">
            Notifications
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-block w-4 h-4 bg-red-600 text-white text-xs leading-tight font-bold rounded-full text-center">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div ref={dropdownRef} className="absolute mt-2 right-0 w-72 bg-white border border-gray-200 rounded-lg shadow-lg">
              <ul>
                {notifications.map(notification => (
                  <li
                    key={notification.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {notification.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            onClick={() => navigate('/create')}
            className="py-2 px-4 bg-green-500 hover:bg-green-600 rounded-full text-white transition duration-200">
            Create
          </button>
          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-red-500 hover:bg-red-600 rounded-full text-white transition duration-200">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
