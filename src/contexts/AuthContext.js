import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase-config';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isOwner = user?.email === 'jianwei020518@gmail.com';

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Login successful:", result.user);
    } catch (error) {
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      if (error.email) {
        console.error("Email:", error.email);
      }
      // Handle specific error cases
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          console.log("Popup closed by user");
          break;
        case 'auth/cancelled-popup-request':
          console.log("Another popup is already open");
          break;
        default:
          console.error("Authentication failed:", error);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const value = {
    user,
    login,
    logout,
    isOwner
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 