import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/config.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [officer, setOfficer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setOfficer(user);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const signup = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ officer, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);