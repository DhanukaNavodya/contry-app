import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const saveUserProfile = async (userId, userData) => {
  const userDocRef = doc(db, "users", userId);
  await setDoc(userDocRef, userData, { merge: true });
};

export const getUserProfile = async (userId) => {
  const userDocRef = doc(db, "users", userId);
  const docSnap = await getDoc(userDocRef);
  return docSnap.exists() ? docSnap.data() : null;
};