import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import DashboardNavbar from '../components/DashboardNavbar';
import DashboardSubmenu from '../components/DashboardSubmenu';
import CopyrightBar from '../components/CopyrightBar';
import DashboardCard from '../components/DashboardCard';
import DashboardForm from '../components/DashboardForm';
import { Modal, Box, Fab } from '@mui/material';
import SupportIcon from '@mui/icons-material/Support';
import { useNavigate } from 'react-router-dom';
import cards from './../data/card';

const Dashboard = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // URL'den userId'yi al
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // kart tıklamna fonksiyonu
  const handleCardClick = (cardId) => {
    navigate(`/article/${cardId}`);
  };

  useEffect(() => {
    if (userId) {
      // Firestore'dan kullanıcı verilerini çek
      const userNotesRef = collection(db, "users", userId, "notes");
      const q = query(userNotesRef, where("userId", "==", userId));

      getDocs(q).then(querySnapshot => {
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
      <CopyrightBar />
      <div className="card-wrapper">
        <div className="card-container">
          {cards.map(card => (
            <DashboardCard
              key={card.id}
              title={card.title}
              description={card.description}
              imageUrl={card.imageUrl}
              color={card.color}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </div>
      </div>
      <Fab color="primary" aria-label="support" onClick={handleOpen} sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <SupportIcon />
      </Fab>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', maxWidth: 600, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <DashboardForm userId={userId} handleClose={handleClose} />
        </Box>
      </Modal>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  )
}

export default Dashboard