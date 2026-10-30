import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, push, remove, child } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDQYYjvBsU_7kaMiGZvmsRdKtLRqRItabQ",
  authDomain: "expense-tracker-970c0.firebaseapp.com",
  projectId: "expense-tracker-970c0",
  storageBucket: "expense-tracker-970c0.firebasestorage.app",
  messagingSenderId: "431556117088",
  appId: "1:431556117088:web:f998e612bd2536d2a97905",
  measurementId: "G-EGRTP8XX8L",
  databaseURL: "https://expense-tracker-970c0-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export const fetchTransactions = async (userId) => {
  const dbRef = ref(db);
  try {
    const snapshot = await get(child(dbRef, `users/${userId}/transactions`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      // data is an object like { "key1": { txData }, "key2": { txData } }
      // we need to convert it to an array
      const transactionsArray = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      return transactionsArray;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching transactions", error);
    throw error;
  }
};

export const addTransaction = async (transaction, userId) => {
  try {
    const transactionToSave = {
      ...transaction,
      date: new Date().toISOString()
    };
    const txRef = push(ref(db, `users/${userId}/transactions`));
    await set(txRef, transactionToSave);
    return { id: txRef.key, ...transactionToSave };
  } catch (error) {
    console.error("Error adding transaction", error);
    throw error;
  }
};

export const deleteTransaction = async (id, userId) => {
  try {
    const txRef = ref(db, `users/${userId}/transactions/${id}`);
    await remove(txRef);
    return id;
  } catch (error) {
    console.error("Error deleting transaction", error);
    throw error;
  }
};

// Authentication functions
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in", error);
    throw error;
  }
};

export const registerUser = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name
    await updateProfile(userCredential.user, {
      displayName: name
    });

    // Store user data in database
    const userRef = ref(db, `users/${userCredential.user.uid}`);
    await set(userRef, {
      name: name,
      email: email,
      createdAt: new Date().toISOString()
    });

    return userCredential.user;
  } catch (error) {
    console.error("Error registering", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out", error);
    throw error;
  }
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export { auth };
