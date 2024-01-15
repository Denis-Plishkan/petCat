import {
  db,
  collection,
  addDoc,
  setDoc,
  storage,
  getDocs,
  getDoc,
} from '../firebase-config';
let userCounter = 0;
export async function usersCount() {
  const usersCollection = collection(db, 'users');

  try {
    const querySnapshot = await getDocs(usersCollection);
    userCounter = querySnapshot.size;

    return;
  } catch (error) {
    return '?';
  }
}
