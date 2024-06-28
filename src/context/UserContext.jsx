import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './../firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const contextValue = {
    currentUser,
    setCurrentUser,
    loading,
    error,
  };


  return (
    <UserContext.Provider value={contextValue}>
      {!loading && children} 
    </UserContext.Provider>
  );
};

