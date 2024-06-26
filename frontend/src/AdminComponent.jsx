import React from 'react';
import { useUser } from './UserContext';

const AdminComponent = ({ children }) => {
  const { user } = useUser();

  console.log('User in AdminComponent:', user); // Add this line

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div>
      {children}
    </div>
  );
};

export default AdminComponent;