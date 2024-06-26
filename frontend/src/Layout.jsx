

import React, { useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from './App'; // Import the theme context

const Layout = ({ onLogout, toggleSidebar, isSidebarOpen, sidebarRef }) => {
  const { theme } = useTheme(); // Get the current theme
  const layoutRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      sidebarRef.current && !sidebarRef.current.contains(event.target) &&
      layoutRef.current && !layoutRef.current.contains(event.target)
    ) {
      if (isSidebarOpen) {
        toggleSidebar(); // Only close the sidebar if it's open
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div ref={layoutRef} className={`flex min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <Sidebar ref={sidebarRef} onLogout={onLogout} isOpen={isSidebarOpen} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header onLogout={onLogout} toggleSidebar={toggleSidebar} sidebarRef={sidebarRef} isSidebarOpen={isSidebarOpen} />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
