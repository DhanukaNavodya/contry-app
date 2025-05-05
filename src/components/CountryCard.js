import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addFavorite, removeFavorite, isFavorite } from "../services/favoriteService";

export default function CountryCard({ country }) {
  const { name, population, region, capital, flags, languages } = country;
  const { currentUser } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (currentUser) {
        const favoriteStatus = await isFavorite(country);
        setIsFav(favoriteStatus);
      }
      setLoading(false);
    };
    checkIfFavorite();
  }, [currentUser, country]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      alert("You need to log in to favorite countries.");
      return;
    }
    
    setFavoriteLoading(true);
    try {
      if (isFav) {
        await removeFavorite(country);
        setIsFav(false);
      } else {
        await addFavorite(country);
        setIsFav(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const languageList = languages ? Object.values(languages).join(", ") : "N/A";

  return (
    <div className="card h-100 shadow-sm border-0 overflow-hidden">
      <div className="position-relative">
        <Link
          to={`/country/${name.common}`}
          className="text-decoration-none"
        >
          <img
            src={flags?.png || ""}
            alt={`Flag of ${name.common}`}
            className="card-img-top"
            style={{ height: "180px", objectFit: "cover" }}
            loading="lazy"
          />
        </Link>
      </div>
      
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <Link
            to={`/country/${name.common}`}
            className="text-decoration-none text-dark"
          >
            <h3 className="h5 card-title fw-bold mb-0">{name.common}</h3>
          </Link>
          
          {!loading && (
            <button
              onClick={toggleFavorite}
              className={`btn p-0 ms-2 ${!currentUser ? 'opacity-50' : ''}`}
              disabled={favoriteLoading || !currentUser}
              title={!currentUser ? "Login to add favorites" : isFav ? "Remove from favorites" : "Add to favorites"}
              aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              {favoriteLoading ? (
                <span className="spinner-border spinner-border-sm text-warning" role="status" aria-hidden="true"></span>
              ) : (
                <span className={`fs-4 ${isFav ? "text-warning" : "text-secondary"}`}>
                  {isFav ? "★" : "☆"}
                </span>
              )}
            </button>
          )}
        </div>
        
        <ul className="list-group list-group-flush">
          <li className="list-group-item px-0 py-2 d-flex justify-content-between">
            <span className="fw-medium">Population</span>
            <span className="text-secondary">{population.toLocaleString()}</span>
          </li>
          <li className="list-group-item px-0 py-2 d-flex justify-content-between">
            <span className="fw-medium">Region</span>
            <span className="text-secondary">{region}</span>
          </li>
          <li className="list-group-item px-0 py-2 d-flex justify-content-between">
            <span className="fw-medium">Capital</span>
            <span className="text-secondary">{capital ? capital[0] : "N/A"}</span>
          </li>
        </ul>
        
        <div className="mt-3">
          <p className="mb-1 fw-medium">Languages</p>
          <p className="text-secondary small">{languageList}</p>
        </div>
        
        <div className="d-flex mt-3">
          <Link 
            to={`/country/${name.common}`} 
            className="btn btn-outline-primary btn-sm flex-grow-1"
          >
            View Details
          </Link>
          
          {currentUser && (
            <button
              onClick={toggleFavorite}
              className={`btn btn-sm ms-2 ${isFav ? 'btn-warning' : 'btn-outline-warning'}`}
              disabled={favoriteLoading}
            >
              {favoriteLoading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <>
                  {isFav ? (
                    <>Remove Favorite</>
                  ) : (
                    <>Add Favorite</>
                  )}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}