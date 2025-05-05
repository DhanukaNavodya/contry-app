import React from "react";

export default function SearchBar({ onSearch }) {
  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search by country name..."
      onChange={handleChange}
      style={{
        width: "100%",
        padding: "10px",
        fontSize: "1rem",
        marginBottom: "20px",
        borderRadius: "4px",
        border: "1px solid #ccc",
      }}
    />
  );
}