import React, { useEffect, useState } from "react";
import { getAllCountries } from "../services/countryService";
import CountryCard from "../components/CountryCard";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRegion, setFilterRegion] = useState("All");
  const [loading, setLoading] = useState(true);

  // Load all countries on mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await getAllCountries();
        setCountries(data);
        setFilteredCountries(data);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  // Apply filters whenever searchTerm or filterRegion changes
  useEffect(() => {
    let result = [...countries];

    if (filterRegion !== "All") {
      result = result.filter((country) => country.region === filterRegion);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((country) =>
        country.name.common.toLowerCase().includes(term)
      );
    }

    setFilteredCountries(result);
  }, [searchTerm, filterRegion, countries]);

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <h1 className="display-4 text-primary mb-4">All Countries</h1>

          {/* Search and Filter Row */}
          <div className="row g-3 mb-4 align-items-end">
            <div className="col-md-8">
              <SearchBar onSearch={setSearchTerm} />
            </div>
            <div className="col-md-4">
              <FilterBar onFilter={setFilterRegion} />
            </div>
          </div>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        /* Country Cards Grid */
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country, index) => (
              <div className="col" key={index}>
                <CountryCard country={country} />
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info text-center mb-0">
                No matching countries found.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}