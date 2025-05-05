import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { saveUserProfile } from "../services/firestoreService";
import { uploadImageToCloudinary } from "../services/cloudinaryService";

export default function ProfileForm({ onUpdate }) {
  const { currentUser } = useAuth();

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    let photoURL = profilePicUrl;

    if (photo) {
      try {
        photoURL = await uploadImageToCloudinary(photo);
      } catch (err) {
        alert("Failed to upload image.");
        console.error(err);
        return;
      }
    }

    try {
      await saveUserProfile(currentUser.uid, {
        name,
        contact,
        address,
        photoURL,
      });

      alert("✅ Profile updated successfully!");

      // Notify parent component to reload data
      if (onUpdate) onUpdate();
    } catch (err) {
      alert("❌ Failed to save profile.");
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);

      const reader = new FileReader();
      reader.onload = (e) => setProfilePicUrl(e.target.result); // preview
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <div className="mb-3 text-center">
        <img
          src={profilePicUrl || "https://via.placeholder.com/150"}
          alt="Profile Preview"
          className="rounded-circle mb-2"
          style={{ width: "120px", height: "120px", objectFit: "cover" }}
        />
        <br />
        <input type="file" accept="image/*" onChange={handleFileChange} className="form-control mt-2" />
      </div>

      <div className="mb-3">
        <label className="form-label">Full Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Contact Number</label>
        <input
          type="text"
          className="form-control"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Address</label>
        <input
          type="text"
          className="form-control"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Save Profile
      </button>
    </form>
  );
}