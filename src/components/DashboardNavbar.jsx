import React from 'react'
import { Container, Navbar, Nav, Offcanvas } from 'react-bootstrap';
import "./../assets/styles/DashboardNavbar.css";
import { Link } from 'react-router-dom';
import { useUserContext } from '../context/UserContext'; 

function DashboardNavbar() {
  const { currentUser, loading  } = useUserContext(); // Aktif kullanıcıyı context'ten al

  // Eğer currentUser yükleniyorsa (null ise ve loading true ise) bir yükleme göstergesi render et
  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div>
       <Navbar expand={false} className="unique-navbar">
        <Container fluid>
          <Navbar.Brand as={Link} to={`/dashboard/${currentUser.uid}`} className='navbar-title'>
            <img
              src="/logoo.png"
              alt="Logo"
              className="navbar-logo"
            />
            İZ - Duygu Takip Uygulaması
          </Navbar.Brand>
            <Navbar.Toggle aria-controls="offcanvasNavbar" className="unique-navbar-toggler" />
            <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
            >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">
                Menü
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3" > 
                <Nav.Link className='canvas-link' as={Link} to={`/dashboard/${currentUser.uid}`}>Anasayfa</Nav.Link>
                <Nav.Link className='canvas-link' as={Link} to={`/profile/${currentUser.uid}`}>Profilim</Nav.Link>
                {currentUser && (
                  <Nav.Link className='canvas-link' as={Link} to={`/notes/${currentUser.uid}`}>Notlarım</Nav.Link> // Kullanıcının ID'si ile dinamik path
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </div>
  )
}

export default DashboardNavbar