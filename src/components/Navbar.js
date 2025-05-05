import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { getUserProfile } from "../services/firestoreService";

export default function VerticalNav() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState(null);

  // Load extended user data from Firestore
  useEffect(() => {
    const loadProfile = async () => {
      if (currentUser) {
        const data = await getUserProfile(currentUser.uid);
        setUserDetails(data || {});
      }
    };

    loadProfile();
  }, [currentUser]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="d-flex flex-column bg-light p-3 position-fixed" style={{ width: "220px", height: "100vh", top: 0, left: 0 }}>
      {/* Profile Photo & Name */}
      {currentUser && (
        <div className="text-center mb-4">
          <div
            className="mx-auto rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold mb-2"
            style={{ width: "50px", height: "50px", fontSize: "1.2rem", cursor: "pointer" }}
            onClick={() => navigate("/profile")}
            role="button"
            tabIndex={0}
            aria-label="Profile"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate("/profile");
              }
            }}
          >
            {userDetails?.photoURL ? (
              <img
                src={userDetails.photoURL}
                alt="Profile"
                className="rounded-circle"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.9-1.256-1.748C10.942 10.659 10.423 10 9 10c-1.423 0-2.414.659-2.675 1.252-.158.367-.256.842-.263 1.254h10.004Z" />
              </svg>
            )}
          </div>

          {/* Display User Name */}
          <p className="mb-0 small text-truncate" title={userDetails?.name || "User"}>
            {userDetails?.name ? userDetails.name : "User"}
          </p>
        </div>
      )}

      {/* Navigation Links */}
      <ul className="nav nav-pills flex-column">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/favorites" className="nav-link">Favorites</Link>
        </li>
        {!currentUser ? (
          <li className="nav-item">
            <Link to="/login" className="nav-link">Login</Link>
          </li>
        ) : (
          <>
            <li className="nav-item">
              <Link to="/profile" className="nav-link">Profile</Link>
            </li>
            <li className="nav-item">
              <button onClick={handleLogout} className="nav-link w-100 text-start" type="button">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}