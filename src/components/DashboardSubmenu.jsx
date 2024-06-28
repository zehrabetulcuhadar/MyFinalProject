import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Nav, Button } from 'react-bootstrap';
import { toast } from 'react-toastify'; 
import './../assets/styles/DashboardSubmenu.css';
import { useUserContext } from '../context/UserContext';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const DashboardSubmenu = () => {
  const navigate = useNavigate();
  const { currentUser } = useUserContext();
  const userId = currentUser?.uid;

  const checkTestAndNavigate = useCallback(async () => {
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;

    const dateDocRef = doc(db, `users/${userId}/dates`, formattedDate);
    const docSnap = await getDoc(dateDocRef);

    if (docSnap.exists()) {
      toast.info('Bugünün testini zaten tamamladınız.');
      navigate(`/dashboard/${userId}`);
    } else {
      navigate(`/test/${userId}`);
    }
  }, [userId, navigate]);

  return (
    <div className="submenu-container">
      <Container>
        <Nav className="submenu-navbar">
          <Nav.Item>
          <Button 
            style={{ 
              backgroundColor: '#1b466a',
              border: 'none',
              fontWeight: 'bold',
              boxShadow: '0px 0px 20px rgba(87, 216, 132, 0.4)',
              color: '#fff',
              textDecoration: 'none'
            }} 
            onMouseOver={(e) => {
              e.currentTarget.style.textDecoration = 'none';
              e.currentTarget.style.backgroundColor ='#3486c1';
            }} 
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor ='#1b466a';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.boxShadow = '0px 0px 20px rgba(87, 216, 132, 0.4)';
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
