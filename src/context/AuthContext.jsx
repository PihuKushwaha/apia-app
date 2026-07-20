import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase/config.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [officer, setOfficer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setOfficer(user);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Requires a <div id="recaptcha-container" /> to be present in the DOM (see Login.jsx)
  const sendOtp = async (phoneNumber) => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
    }
    const result = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
    setConfirmationResult(result);
    return result;
  };

  const confirmOtp = async (code) => {
    if (!confirmationResult) throw new Error("No OTP request in progress. Send OTP first.");
    const result = await confirmationResult.confirm(code);
    return result.user;
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ officer, loading, sendOtp, confirmOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
