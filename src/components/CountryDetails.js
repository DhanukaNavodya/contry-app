import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function CountryDetails() {
  const { name } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        const response = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
        setCountry(response.data[0]);
      } catch (error) {
        console.error("Error fetching country details:", error);
        setError("Failed to load country details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCountryDetails();
  }, [name]);

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link to="/" className="btn btn-primary">
          Back to Countries
        </Link>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          Country not found
        </div>
        <Link to="/" className="btn btn-primary">
          Back to Countries
        </Link>
      </div>
    );
  }

  const {
    flags,
    name: { common, official },
    capital,
    region,
    subregion,
    population,
    languages,
    borders = [],
    latlng,
    area,
    timezones,
    currencies = {},
    coatOfArms,
    maps,
    continents,
    independent,
  } = country;

  const languageList = languages ? Object.values(languages).join(", ") : "N/A";
  const currencyList = Object.values(currencies)
    .map((curr) => `${curr.name} (${curr.symbol})`)
    .join(", ");

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <Link to="/" className="btn btn-outline-primary mb-4">
            <i className="bi bi-arrow-left me-2"></i>Back to Countries
          </Link>
          
          <h1 className="display-4 mb-4">{common}</h1>
          <p className="lead text-secondary mb-4">{official}</p>
        </div>
      </div>
      
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm mb-4">
            <img 
              src={flags.svg || flags.png} 
              alt={`Flag of ${common}`} 
              className="card-img-top" 
              style={{ height: "250px", objectFit: "cover" }}
            />
            <div className="card-body">
              <h5 className="card-title">National Flag</h5>
              {flags.alt && <p className="card-text text-secondary small">{flags.alt}</p>}
            </div>
          </div>
          
          {coatOfArms && coatOfArms.svg && (
            <div className="card border-0 shadow-sm">
              <img 
                src={coatOfArms.svg} 
                alt={`Coat of Arms of ${common}`} 
                className="card-img-top p-4" 
                style={{ height: "200px", objectFit: "contain" }}
              />
              <div className="card-body">
                <h5 className="card-title">Coat of Arms</h5>
              </div>
            </div>
          )}
          
          {maps && maps.googleMaps && (
            <div className="mt-4">
              <a 
                href={maps.googleMaps} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline-success w-100"
              >
                <i className="bi bi-map me-2"></i>View on Google Maps
              </a>
            </div>
          )}
        </div>
        
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-4">Country Information</h4>
              
              <div className="row row-cols-1 row-cols-md-2 g-4">
                <div className="col">
                  <div className="card h-100 bg-light border-0">
                    <div className="card-body">
                      <h6 className="card-title text-primary">Location</h6>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item bg-transparent px-0">
                          <span className="fw-medium">Region:</span> {region}
                        </li>
                        <li className="list-group-item bg-transparent px-0">
                          <span className="fw-medium">Sub Region:</span> {subregion || "N/A"}
                        </li>
                        <li className="list-group-item bg-transparent px-0">
                          <span className="fw-medium">Continent:</span> {continents?.join(", ") || "N/A"}
                        </li>
                        <li className="list-group-item bg-transparent px-0">
                          <span className="fw-medium">Capital:</span> {capital && capital.length > 0 ? capital[0] : "N/A"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="col">
                  <div className="card h-100 bg-light border-0">
                    <div className="card-body">
                      <h6 className="card-title text-primary">Demographics</h6>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item bg-transparent px-0">
                          <span className="fw-medium">Population:</span> {population.toLocaleString()}
                        </li>
                        <li className="list-group-item bg-transparent px-0">
                          <span className="fw-medium">Area:</span> {area.toLocaleString()} km²
                        </li>
                        <li className="list-group-item bg-transparent px-0">
                          <span className="fw-medium">Languages:</span> {languageList}
                        </li>
                        <li className="list-group-item bg-transparent px-0">
                          <span className="fw-medium">Currency:</span> {currencyList || "N/A"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="col">
                  <div className="card h-100 bg-light border-0">
                    <div className="card-body">
                      <h6 className="card-title text-primary">Geography</h6>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item bg-transparent px-0">
                          <span className="fw-medium">Coordinates:</span> {latlng.join(", ")}
                        </li>
                        <li className="list-group-item bg-transparent px-0">
                          <span className="fw-medium">Borders:</span> {borders.length > 0 ? borders.join(", ") : "None"}
                        </li>
                        <li className="list-group-item bg-transparent px-0">
                          <span className="fw-medium">Independent:</span> {independent ? "Yes" : "No"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="col">
                  <div className="card h-100 bg-light border-0">
                    <div className="card-body">
                      <h6 className="card-title text-primary">Time</h6>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item bg-transparent px-0">
                          <span className="fw-medium">Timezone(s):</span>
                          <div className="mt-1 small">
                            {timezones.slice(0, 3).map((tz, i) => (
                              <span key={i} className="badge bg-secondary me-1 mb-1">{tz}</span>
                            ))}
                            {timezones.length > 3 && 
                              <span className="badge bg-secondary">+{timezones.length - 3} more</span>
                            }
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}