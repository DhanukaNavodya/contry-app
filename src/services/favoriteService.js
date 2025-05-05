import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";

const FAVORITES_COLLECTION = "favorites";

export const addFavorite = async (country) => {
  const user = auth.currentUser;
  if (!user) return;

  const favDocRef = doc(db, FAVORITES_COLLECTION, `${user.uid}_${country.cca3}`);

  try {
    await setDoc(favDocRef, {
      ...country,
      userId: user.uid,
    });
  } catch (error) {
    console.error("Error adding favorite:", error);
  }
};

export const removeFavorite = async (country) => {
  const user = auth.currentUser;
  if (!user) return;

  const favDocRef = doc(db, FAVORITES_COLLECTION, `${user.uid}_${country.cca3}`);

  try {
    await deleteDoc(favDocRef);
  } catch (error) {
    console.error("Error removing favorite:", error);
  }
};

export const isFavorite = async (country) => {
  const user = auth.currentUser;
  if (!user) return false;

  const favDocRef = doc(db, FAVORITES_COLLECTION, `${user.uid}_${country.cca3}`);
  const docSnap = await getDoc(favDocRef);

  return docSnap.exists();
};