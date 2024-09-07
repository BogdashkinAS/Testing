import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [fileId, setFileId] = useState('');
  const [userToken, setUserToken] = useState('');

  const logoutUser = () => {
    setToken('');
    setUserId('');
    setIsAdmin(false);
    setFileId('');
  };

  return (
    <AuthContext.Provider value={{ token, setToken, userId, setUserId, isAdmin, setIsAdmin, fileId, setFileId, 
      logoutUser, userToken, setUserToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };