import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Nav, Button } from 'react-bootstrap';
import { toast } from 'react-toastify'; // toast fonksiyonunu import edin
import './../assets/styles/DashboardSubmenu.css';
import { useUserContext } from '../context/UserContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const DashboardSubmenu = () => {
  const navigate = useNavigate();
  const { currentUser } = useUserContext();
  const userId = currentUser?.uid;

  const checkTestAndNavigate = useCallback(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, "user_answers"),
      where("userId", "==", userId),
      where("date", "==", today)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Kullanıcı testi çözmüşse toast bildirimi göster
      toast.info('Bugünün testini zaten tamamladınız.');
    } else {
      // Kullanıcı testi çözmediyse teste yönlendir
      navigate('/test');
    }
  }, [userId, navigate]);

  return (
    <div className="submenu-container">
      <Container>
        <Nav className="submenu-navbar">
          <Nav.Item>
          <Button 
            style={{ 
              backgroundColor: 'transparent', // Arka planı transparan yaparak kaldırıyoruz
              border: 'none', // Varsayılan buton sınırını kaldırıyoruz
              fontWeight: 'bold', // Yazı tipini kalın yapıyoruz
              boxShadow: 'none', // Varsayılan gölgeyi kaldırıyoruz
              color: '#15203d', // Yazı rengini ayarlıyoruz
              textDecoration: 'none' // Alt çizgiyi kaldırıyoruz
            }} 
            onMouseOver={(e) => {
              e.currentTarget.style.textDecoration = 'none'; // Üzerine gelindiğinde alt çizgi olmayacak
              e.currentTarget.style.color = '#007bff'; // Yazı rengini değiştiriyoruz
            }} 
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#15203d'; // Yazı rengini orijinal haline çeviriyoruz
            }}
            onClick={checkTestAndNavigate}
          >
            Teste Başla
          </Button>
          </Nav.Item>
        </Nav>
      </Container>
    </div>
  );
};

export default DashboardSubmenu;
