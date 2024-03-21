// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from 'firebase/database';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5fC9uP2DmqFWBCh9LCUEFR9iTG4lDCVw",
  authDomain: "duygutakip.firebaseapp.com",
  projectId: "duygutakip",
  storageBucket: "duygutakip.appspot.com",
  messagingSenderId: "814898268415",
  appId: "1:814898268415:web:0a3c99603dca3c4962e4ca",
  databaseURL: "https://duygutakip-default-rtdb.firebaseio.com"
};

export const getEmotionColorForDate = async () => {
  // Firebase veritabanı sorgularınızı burada yapın
  // Bu bir örnek olduğu için gerçek bir sorgu yapmıyoruz
  // Örnek dönüş yapısı:
  return [
    { title: 'Happy', date: '2024-03-01', backgroundColor: 'green' },
    { title: 'Sad', date: '2024-03-02', backgroundColor: 'blue' },
    // Diğer eventler...
  ];
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); // firebase başlatılan nokta

// Firebase Auth servisini al
const auth = getAuth(app);

export const database = getDatabase(app);
export const db = getFirestore(app);

export { auth };