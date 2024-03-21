import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Calendar from '../components/Calendar';
import DashboardNavbar from '../components/DashboardNavbar';
import DashboardSubmenu from '../components/DashboardSubmenu';
import CopyrightBar from '../components/CopyrightBar';

const Dashboard = () => {
  const { userId } = useParams(); // URL'den userId'yi al
  const [userData, setUserData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (userId) {
      // Firestore'dan kullanıcı verilerini çek
      const userNotesRef = collection(db, "users", userId, "notes");
      const q = query(userNotesRef, where("userId", "==", userId));

      getDocs(q).then(querySnapshot => {
        // querySnapshot ile gelen verileri kullanarak istediğiniz işlemleri yapın
        // Örneğin, kullanıcının notlarını set edin:
        const notes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserData(notes);
      });

      // Kayıt olduktan sonra gelindiyse Toast bildirimi göster
      if (location?.state?.fromRegistration) {
        toast.success("Başarıyla kayıt oldunuz!");
      }
    }
  }, [userId, location?.state?.fromRegistration]);
  
  return (
    <div className="dashboard-container">
      <DashboardNavbar />
      <DashboardSubmenu />
      <Calendar />
      <CopyrightBar />
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  )
}

export default Dashboard