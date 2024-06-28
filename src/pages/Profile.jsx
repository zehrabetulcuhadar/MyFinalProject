import React, { useState, useEffect } from 'react';
import ProfileInfo from '../components/ProfileInfo'
import { auth, database } from '../firebaseConfig'; 
import { ref, onValue } from 'firebase/database';
import { useParams } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import DashboardNavbar from '../components/DashboardNavbar';
import CopyrightBar from '../components/CopyrightBar';

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
    <div className='profile-content'>
      <DashboardNavbar/>
      <div className="dashboard-container">
        <ProfileInfo userId={userId} />
      </div>
      <CopyrightBar/>
    </div>
  )
}

export default Profile