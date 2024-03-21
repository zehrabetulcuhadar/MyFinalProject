import React, { useState, useEffect } from 'react';
import '../assets/styles/Profile.css'
import AccountSettings from '../components/AccountSettings'
import DeleteAccount from '../components/DeleteAccount'
import PastReports from '../components/PastReports'
import ProfileInfo from '../components/ProfileInfo'
import { auth, database } from '../firebaseConfig'; 
import { ref, onValue } from 'firebase/database';
import { useParams } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

const Profile = () => {
  const { userId } = useParams();
  const [userName, setUserName] = useState(''); // Kullanıcı adını saklamak için yeni state

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        // Eğer firstName veya lastName boş ise varsayılan değer olarak 'Kullanıcı' kullanılır
        const fullName = `${data?.firstName || 'Kullanıcı'} ${data?.lastName || ''}`.trim();
        setUserName(fullName);
      }, {
        onlyOnce: true // Sadece bir kere veriyi çek
      });
    }
  }, []);
  
  return (
    <div className="dashboard-container">
      <ProfileInfo userId={userId} />
    </div>
  )
}

export default Profile