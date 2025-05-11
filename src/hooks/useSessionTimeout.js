import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useSessionTimeout = (timeoutDuration) => {
  const navigate = useNavigate();

  useEffect(() => {
    let logoutTimer;

    const resetTimer = () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      logoutTimer = setTimeout(() => {
        console.log("Session expired");
        navigate("/login");
      }, timeoutDuration);
    };

    // Events that trigger user activity
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    // Start the first timer
    resetTimer();

    return () => {
      clearTimeout(logoutTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [navigate, timeoutDuration]);
};