import React from "react";

const regions = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];

export default function FilterBar({ onFilter }) {
  const handleChange = (e) => {
    onFilter(e.target.value);
  };

  return (
    <select onChange={handleChange} defaultValue="All" style={{
      padding: "10px",
      fontSize: "1rem",
      marginBottom: "20px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    }}>
      {regions.map((region) => (
        <option key={region} value={region}>
          {region}
        </option>
      ))}
    </select>
  );
}