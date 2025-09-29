import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const credentials = {
  user: { username: 'testuser', password: '1234', role: 'user' },
  admin: { username: 'testadmin', password: '1234', role: 'admin' },
  ngo: { username: 'testngo', password: '1234', role: 'ngo' },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('monasteryUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const updateUserState = (newUserData) => {
      setUser(newUserData);
      localStorage.setItem('monasteryUser', JSON.stringify(newUserData));
  };

  const login = (username, password) => {
    const userRole = Object.keys(credentials).find(role => 
      credentials[role].username === username && credentials[role].password === password
    );
    if (userRole) {
      // --- THIS LINE IS FIXED ---
      const userData = { username, role: userRole, email: `${username}@example.com`, number: '+91 99999 88888', coins: 0, favorites: { monasteries: [], archives: [] } };
      updateUserState(userData);
      return userData;
    }
    return null;
  };
  
  const signup = (username, email, password, role, additionalData) => {
     const userData = { username, email, role, coins: 0, favorites: { monasteries: [], archives: [] }, ...additionalData };
     updateUserState(userData);
     return userData;
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('monasteryUser');
  };

  const addCoins = (amount) => {
    if (!user) return;
    const updatedUser = {...user, coins: user.coins + amount };
    updateUserState(updatedUser);
  };

  const toggleMonasteryFavorite = (monasteryId) => {
    if (!user) return;
    const favs = user.favorites.monasteries;
    const newFavs = favs.includes(monasteryId) 
        ? favs.filter(id => id !== monasteryId) 
        : [...favs, monasteryId];
    const updatedUser = { ...user, favorites: { ...user.favorites, monasteries: newFavs } };
    updateUserState(updatedUser);
  };

  const toggleArchiveFavorite = (archiveId) => {
    if (!user) return;
    const favs = user.favorites.archives;
    const newFavs = favs.includes(archiveId) 
        ? favs.filter(id => id !== archiveId) 
        : [...favs, archiveId];
    const updatedUser = { ...user, favorites: { ...user.favorites, archives: newFavs } };
    updateUserState(updatedUser);
  };

  const value = { user, login, logout, signup, addCoins, loading, toggleMonasteryFavorite, toggleArchiveFavorite, updateUserState };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};