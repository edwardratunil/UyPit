// // UserContext.js connected in settings kung magchange kag information automatic ma change tanan across pages
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';
// import axiosInstance from './axiosConfig';

// const UserContext = createContext();

// export const useUser = () => useContext(UserContext);

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const authToken = localStorage.getItem('authToken');
//       if (authToken) {
//         try {
//           const response = await axiosInstance.get('/user', {
//             headers: { Authorization: `Bearer ${authToken}` },
//           });
//           setUser(response.data);
//         } catch (error) {
//           console.error('Error fetching user:', error);
//         }
//       }
//     };
//     fetchUser();
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// src/UserContext.js
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
