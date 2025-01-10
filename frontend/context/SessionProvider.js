import React, { createContext, useState, useEffect, useContext } from 'react';
import sessionService from '../services/sessionService';  // Service handling session-related API calls
import { AuthContext } from './AuthContext';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const { logout } = useContext(AuthContext);
  const [sessionToken, setSessionToken] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  // useEffect(() => {
  //   const manageSession = async () => {
  //     if (user) {
  //       const newToken = await sessionService.refreshToken();
  //       if (newToken) {
  //         setSessionToken(newToken);
  //       } else {
  //         logout();  // Log out the user if the token is invalid
  //       }
  //     }
  //     setSessionLoading(false);
  //   };

  //   manageSession();
  // }, []);
 
  const refreshSession = async () => {
    const newToken = await sessionService.refreshToken();
    if (newToken) {
      setSessionToken(newToken);
    } else {
      logout();
    }
  };

  return (
    <SessionContext.Provider value={{ sessionToken, sessionLoading, refreshSession }}>
      {children}
    </SessionContext.Provider>
  );
};
