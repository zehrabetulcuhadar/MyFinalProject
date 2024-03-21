import React from 'react'
import { Container, Navbar, Nav, NavDropdown, Offcanvas } from 'react-bootstrap';
import "./../assets/styles/DashboardNavbar.css";
import { Link } from 'react-router-dom';
import { useUserContext } from '../context/UserContext'; // UserContext hook'unu import et

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
            <Navbar.Brand href="#">İZ - Duygu Takip Uygulaması</Navbar.Brand>
            <Navbar.Toggle aria-controls="offcanvasNavbar" className="unique-navbar-toggler" />
            <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
            >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">
                Offcanvas
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link as={Link} to={`/profile/${currentUser.uid}`}>Profilim</Nav.Link>
              {currentUser && (
                <Nav.Link as={Link} to={`/notes/${currentUser.uid}`}>Notlarım</Nav.Link> // Kullanıcının ID'si ile dinamik path
              )}
                <NavDropdown title="Dropdown" id="offcanvasNavbarDropdown">
                  <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action4">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action5">
                    Something else here
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </div>
  )
}

export default DashboardNavbar