import React, { useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import CountryCard from "../components/CountryCard";

export default function Favorites() {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "favorites"),
        where("userId", "==", currentUser.uid)
      );

      try {
        const snapshot = await getDocs(q);
        const favList = snapshot.docs.map((doc) => doc.data());
        setFavorites(favList);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  if (loading) return <div>Loading favorites...</div>;

  return (
    <div>
      <h1>Favorite Countries</h1>
      {favorites.length === 0 ? (
        <p>No favorite countries yet.</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px"
        }}>
          {favorites.map((country, index) => (
            <CountryCard key={index} country={country} />
          ))}
        </div>
      )}
    </div>
  );
}