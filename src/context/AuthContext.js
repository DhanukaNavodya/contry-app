// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  // Use ref to persist timer across renders without triggering effects
  const logoutTimerRef = useRef(null);

  // Session timeout duration (e.g., 5 minutes)
  const SESSION_TIMEOUT = 1 * 60 * 1000; // 5 minutes

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Reset session timeout on user activity
  const resetSessionTimeout = useCallback(() => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

    if (!currentUser) return;

    logoutTimerRef.current = setTimeout(() => {
      console.warn("Session expired due to inactivity");
      handleLogout();
      setIsSessionExpired(true);
    }, SESSION_TIMEOUT);
  }, [currentUser, SESSION_TIMEOUT]);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, []);

  // Track user activity only when logged in
  useEffect(() => {
    if (!currentUser) return;

    const activityEvents = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];

    activityEvents.forEach((event) =>
      window.addEventListener(event, resetSessionTimeout)
    );

    resetSessionTimeout(); // Start initial session timer

    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetSessionTimeout)
      );
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, [currentUser, resetSessionTimeout]);

  const value = {
    currentUser,
    loading,
    isSessionExpired,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}