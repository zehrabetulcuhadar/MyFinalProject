import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './../firebaseConfig'; // Firebase Auth import et

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state'i ekle

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false); // Kullanıcı durumu güncellendiğinde loading'i false yap
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  // Context değerini güncelle
  const contextValue = {
    currentUser,
    setCurrentUser,
    loading, // Loading state'i context'e ekle
  };

  return (
    <UserContext.Provider value={contextValue}>
      {!loading && children} 
    </UserContext.Provider>
  );
};

