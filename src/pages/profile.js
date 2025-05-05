import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../services/firestoreService";
import ProfileForm from "../components/ProfileForm";

export default function Profile() {
  const { currentUser } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // 👈 Controls visibility of form

  const loadProfile = async () => {
    if (!currentUser) return;

    try {
      const data = await getUserProfile(currentUser.uid);
      setUserDetails(data || {});
      // Optionally hide form if photoURL exists
      setShowForm(!data?.photoURL); // Show form only if no photo uploaded
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="container py-5">
        <h2>Profile</h2>
        <p>You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2>My Profile</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card p-4 shadow-sm">
          {/* Show profile picture */}
          {userDetails?.photoURL && (
            <img
              src={userDetails.photoURL}
              alt="Profile"
              className="rounded-circle mx-auto d-block mb-3"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          )}

          {/* User Info */}
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><strong>Email:</strong> {currentUser.email}</li>
            <li className="list-group-item"><strong>Name:</strong> {userDetails.name || "Not provided"}</li>
            <li className="list-group-item"><strong>Contact:</strong> {userDetails.contact || "Not provided"}</li>
            <li className="list-group-item"><strong>Address:</strong> {userDetails.address || "Not provided"}</li>
          </ul>

          <hr />

          {/* Conditional rendering of form */}
          {!showForm ? (
            <button className="btn btn-primary mt-3" onClick={() => setShowForm(true)}>
              Edit Profile
            </button>
          ) : (
            <ProfileForm onUpdate={() => {
              loadProfile();
              setShowForm(false); 
            }} />
          )}
        </div>
      )}
    </div>
  );
}