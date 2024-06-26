import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from './axiosConfig';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        try {
          const response = await axiosInstance.get('/user', {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          const userData = response.data;
          console.log('User Data:', userData); // Add this line
          setUser({
            ...userData,
            isAdmin: userData.role === 'admin', // Check role
          });
          console.log('Is Admin:', userData.role === 'admin'); // Add this line
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };
    fetchUser();
  }, []);


  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
